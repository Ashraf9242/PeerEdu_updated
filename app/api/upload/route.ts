import { NextResponse, type NextRequest } from "next/server"
import { requireAuth } from "@/auth-utils"
import { v2 as cloudinary } from "cloudinary"
import formidable from "formidable"
import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

import { db } from "@/lib/db"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

/**
 * Parses the incoming multipart/form-data request to extract files and fields.
 * @param req - The NextRequest object.
 * @returns A promise that resolves with the parsed files and fields.
 */
const parseForm = async (
  req: NextRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    maxFileSize: MAX_FILE_SIZE,
    allowEmptyFiles: false,
  })

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(err)
      }
      resolve({ fields, files })
    })
  })
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { image: true },
    })

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 })
    }

    const { fields, files } = await parseForm(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    const type = (Array.isArray(fields.type) ? fields.type[0] : fields.type) as string | undefined

    // 1. Validation
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded." }, { status: 400 })
    }

    if (!type || type !== "profile") {
      return NextResponse.json({ success: false, error: "Invalid upload type specified." }, { status: 400 })
    }

    if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." },
        { status: 400 }
      )
    }

    let fileBuffer: Buffer
    let uploadOptions: any = {
      folder: `peeredu/${user.id}/${type}`,
      resource_type: "image",
    }

    // 2. Image Processing (for profile pictures)
    if (type === "profile") {
      fileBuffer = await sharp(file.filepath)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer()
      uploadOptions.transformation = { width: 800, height: 800, crop: "fill" }
    } else {
      fileBuffer = await fs.readFile(file.filepath)
    }

    // 3. Cleanup old image from Cloudinary before uploading new one
    let oldPublicId: string | null = null
    if (type === "profile" && dbUser?.image?.includes("cloudinary")) {
      // Extracts the full public_id including folders from the URL
      // e.g., https://res.cloudinary.com/.../upload/v123/peeredu/userId/profile/filename.webp -> peeredu/userId/profile/filename
      const publicIdWithVersion = dbUser.image.split("/").slice(-5).join("/") // Assumes path like /peeredu/userId/type/filename
      const publicIdWithExtension = publicIdWithVersion.substring(publicIdWithVersion.indexOf("/") + 1)
      oldPublicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."))
    }

    // 4. Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
      uploadStream.end(fileBuffer)
    })

    if (!uploadResult?.secure_url) {
      throw new Error("Cloudinary upload failed.")
    }

    const newUrl = uploadResult.secure_url

    // 5. Update Database
    if (type === "profile") {
      await db.user.update({
        where: { id: user.id },
        data: { image: newUrl },
      })
    }

    // 6. Delete old image after successful upload and DB update
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId)
      } catch (cleanupError) {
        console.error("Failed to delete old image from Cloudinary:", cleanupError)
        // Don't fail the request if cleanup fails, just log it
      }
    }

    // 7. Success Response
    return NextResponse.json({
      success: true,
      url: newUrl,
      type: type,
    })
  } catch (error: any) {
    console.error("Upload API Error:", error)
    if (error.http_code === 401) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 })
    }
    return NextResponse.json(
      { success: false, error: error.message || "An unknown error occurred." },
      { status: 500 }
    )
  }
}
