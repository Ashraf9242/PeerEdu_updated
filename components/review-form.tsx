"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Mock i18n function
const useTranslation = () => ({
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      "review_form.rating_label": "Your Rating",
      "review_form.comment_label": "Your Comment",
      "review_form.comment_placeholder": "Share your experience with the tutor...",
      "review_form.submit_button": "Submit Review",
      "review_form.submitting_button": "Submitting...",
      "review_form.success_toast": "Thank you for your review!",
      "review_form.error_toast": "Failed to submit review. Please try again.",
      "review_form.character_count": "characters",
    };
    return translations[key] || key;
  },
});

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating is required"),
  comment: z.string().max(500, "Comment must be 500 characters or less").optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  bookingId: string;
  tutorName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ bookingId, tutorName, onSuccess }: ReviewFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, bookingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast({
        title: t("review_form.success_toast"),
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: t("review_form.error_toast"),
        variant: "destructive",
      });
      console.error("Review submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rating = form.watch("rating");
  const comment = form.watch("comment");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{t("review_form.rating_label")}</FormLabel>
              <FormControl>
                <div
                  className="flex items-center space-x-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-8 w-8 cursor-pointer transition-colors",
                        (hoverRating >= star || field.value >= star)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      )}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">{t("review_form.comment_label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("review_form.comment_placeholder")}
                  className="resize-none"
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <div className="text-right text-sm text-muted-foreground">
                {comment?.length || 0} / 500 {t("review_form.character_count")}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
          {isSubmitting ? t("review_form.submitting_button") : t("review_form.submit_button")}
        </Button>
      </form>
    </Form>
  );
}
