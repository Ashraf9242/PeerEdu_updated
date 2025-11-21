
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.ts";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const read = searchParams.get("read"); // 'true', 'false', or null

    const skip = (page - 1) * limit;

    const whereClause: any = {
        userId: session.user.id,
    };

    if (read === "true") {
        whereClause.read = true;
    } else if (read === "false") {
        whereClause.read = false;
    }

    try {
        const notifications = await db.notification.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });

        const totalNotifications = await db.notification.count({ where: whereClause });

        return NextResponse.json({
            notifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("[GET_NOTIFICATIONS]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
