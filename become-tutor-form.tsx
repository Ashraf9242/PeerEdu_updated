"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// 6. Validation Schema
const formSchema = z.object({
  bio: z.string().min(50, "يجب أن تكون النبذة 50 حرفًا على الأقل.").max(500),
  subjects: z.array(z.string()).min(1, "يجب اختيار تخصص واحد على الأقل."),
  experience: z.string().min(10, "يرجى وصف خبرتك."),
  education: z.string().min(10, "يرجى وصف مؤهلاتك."),
  hourlyRate: z.coerce.number().min(5).max(50),
  certificate: z.any().optional(), // TODO: Add file validation
})

export function BecomeTutorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement server action call
    console.log(values)
    // await createTutorProfileAction(values)
  }

  return (
    <Form {...form}>
      {/* ... حقول النموذج (Bio, Subjects, etc.) ... */}
    </Form>
  )
}