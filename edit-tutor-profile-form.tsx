"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { TutorProfile } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// نفس الـ Schema مع تعديلات بسيطة
const formSchema = z.object({
  bio: z.string().min(50, "يجب أن تكون النبذة 50 حرفًا على الأقل.").max(500),
  subjects: z.array(z.string()).min(1, "يجب اختيار تخصص واحد على الأقل."),
  experience: z.string().min(10, "يرجى وصف خبرتك."),
  education: z.string().min(10, "يرجى وصف مؤهلاتك."),
  hourlyRate: z.coerce.number().min(5).max(50),
})

interface EditTutorProfileFormProps {
  tutorProfile: TutorProfile
}

export function EditTutorProfileForm({ tutorProfile }: EditTutorProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: tutorProfile.bio || "",
      subjects: tutorProfile.subjects || [],
      experience: tutorProfile.experience || "",
      education: tutorProfile.education || "",
      hourlyRate: tutorProfile.hourlyRate || 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement server action call
    console.log(values)
    // await updateTutorProfileAction(values)
  }

  return (
    <Form {...form}>
      {/* ... حقول النموذج ... */}
    </Form>
  )
}