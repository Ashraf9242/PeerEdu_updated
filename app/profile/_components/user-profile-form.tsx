
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { updateUserProfile } from "../_actions/update-profile";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional(),
  university: z.string().optional(),
  academicYear: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  user: User;
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      university: user.university || "",
      academicYear: user.academicYear || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large. Max size is 2MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        // First, upload the image if a new one is selected
        let imageUrl = user.image;
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("type", "profile");

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || "Image upload failed.");
          }
          imageUrl = result.url;
        }

        // Then, update the rest of the profile data
        await updateUserProfile({ ...data, image: imageUrl });

        toast.success("Profile updated successfully!");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Failed to update profile.");
      }
    });
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={imagePreview || ''} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1.5">
            <FormLabel>Profile Picture</FormLabel>
            <Input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
            <FormDescription>Max 2MB. JPG, PNG, WEBP.</FormDescription>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
                <FormItem>
                <FormLabel>University</FormLabel>
                <FormControl>
                    <Input placeholder="Your university" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 3rd year" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
