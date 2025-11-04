"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, GraduationCap, Building, Shield, KeyRound } from "lucide-react"

// Zod Schemas for validation
const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  familyName: z.string().min(2, "Family name is too short"),
  phone: z.string().regex(/^\+968[79]\d{7}$/, "Invalid Omani phone number"),
  // Add other fields as needed
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

/**
 * Mock user data. Replace this with `await requireAuth()` in a real Server Component.
 * We are using a client component here to demonstrate the form logic.
 */
const mockUser = {
  id: "clx123abc",
  firstName: "Mohammed",
  familyName: "Ashraf",
  email: "mohammed@peeredu.om",
  phone: "+96891234567",
  university: "UTAS Ibri",
  yearOfStudy: "Year 4",
  role: "TEACHER",
  image: "https://github.com/shadcn.png", // Placeholder image
}

export default function ProfilePage() {
  // In a real app, this would be a Server Component:
  // const user = await requireAuth();
  const user = mockUser

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account settings and personal information.</p>
        </header>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password">
              <KeyRound className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileCard user={user} />
          </TabsContent>

          <TabsContent value="password">
            <PasswordCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProfileCard({ user }: { user: typeof mockUser }) {
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(user.image)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      familyName: user.familyName,
      phone: user.phone,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.")
      return
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP formats are allowed.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      // const result = await updateProfile(data); // Server Action
      // if (result.success) toast.success("Profile updated successfully!");
      // else toast.error(result.error);
      console.log("Profile data:", data)
      toast.success("Profile updated successfully! (Demo)")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={preview ?? undefined} />
                <AvatarFallback>{user.firstName[0]}{user.familyName[0]}</AvatarFallback>
              </Avatar>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Profile Picture</Label>
                <Input id="picture" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                <p className="text-xs text-muted-foreground">Max 2MB. JPG, PNG, or WEBP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input placeholder="Your first name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="familyName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Family Name</FormLabel>
                  <FormControl><Input placeholder="Your family name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Read-only fields */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /><span>{user.email}</span></div>
            </div>
            <div className="space-y-2">
              <Label>University</Label>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground"><Building className="h-4 w-4" /><span>{user.university}</span></div>
            </div>

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input type="tel" placeholder="+968" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex items-center justify-between">
              <Badge variant={user.role === "TEACHER" ? "default" : "secondary"} className="capitalize">
                <Shield className="w-3 h-3 mr-1.5" />
                {user.role.toLowerCase()}
              </Badge>
              {user.role === "TEACHER" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/profile/teacher">Manage Tutor Profile</Link>
                </Button>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function PasswordCard() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const onSubmit = (data: PasswordFormValues) => {
    startTransition(async () => {
      // const result = await updatePassword(data); // Server Action
      // if (result.success) toast.success("Password updated successfully!");
      // else toast.error(result.error);
      console.log("Password change data:", data)
      toast.success("Password updated successfully! (Demo)")
      form.reset()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password here. It's recommended to use a strong password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="currentPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="newPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}