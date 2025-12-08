"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Booking, User, Review } from "@prisma/client";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition, useState, useMemo } from "react";
import { toast } from "sonner";
import { submitReview } from "../_actions/submit-review";
import { useLanguage } from "@/contexts/language-context";

type CompletedBooking = Booking & {
  tutor: Pick<User, "name" | "image">;
  review: Review | null;
};

interface RecentReviewsClientProps {
  studentId: string;
  recentCompletedSessions: CompletedBooking[];
}

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10).max(500),
  bookingId: z.string(),
});

export function RecentReviewsClient({
  studentId: _studentId,
  recentCompletedSessions,
}: RecentReviewsClientProps) {
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
  const { language, t } = useLanguage();
  const locale = language === "ar" ? "ar-SA" : "en-US";

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Muscat",
        dateStyle: "medium",
      }),
    [locale],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.student.reviews.title")}</CardTitle>
        <CardDescription>{t("dashboard.student.reviews.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentCompletedSessions.length > 0 ? (
          recentCompletedSessions.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={booking.tutor.image || ""} alt={booking.tutor.name || ""} />
                  <AvatarFallback>{booking.tutor.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.tutor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {dateFormatter.format(new Date(booking.startAt))}
                  </p>
                </div>
              </div>
              {booking.review ? (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < booking.review!.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <Dialog
                  open={openDialogs[booking.id] || false}
                  onOpenChange={(isOpen) =>
                    setOpenDialogs((prev) => ({ ...prev, [booking.id]: isOpen }))
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t("dashboard.student.reviews.rate")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {t("dashboard.student.reviews.reviewWith").replace("{{name}}", booking.tutor.name || "")}
                      </DialogTitle>
                      <DialogDescription>
                        {t("dashboard.student.reviews.feedback")}
                      </DialogDescription>
                    </DialogHeader>
                    <ReviewForm
                      bookingId={booking.id}
                      language={language}
                      t={t}
                      onReviewSubmit={() =>
                        setOpenDialogs((prev) => ({
                          ...prev,
                          [booking.id]: false,
                        }))
                      }
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("dashboard.student.reviews.none")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ReviewForm({
  bookingId,
  onReviewSubmit,
  language,
  t,
}: {
  bookingId: string;
  onReviewSubmit: () => void;
  language: "en" | "ar";
  t: (key: string) => string;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { bookingId, rating: 5, comment: "" },
  });

  const onSubmit = (values: z.infer<typeof reviewSchema>) => {
    startTransition(async () => {
      const result = await submitReview(values);
      if (result.success) {
        toast.success(t("dashboard.student.reviews.success"));
        onReviewSubmit();
      } else {
        toast.error(result.error || t("dashboard.student.reviews.error"));
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>{t("dashboard.student.reviews.rating")}</FormLabel>
              <FormControl>
                <StarRating value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dashboard.student.reviews.comment")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("dashboard.student.reviews.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? t("dashboard.student.reviews.submitting")
            : t("dashboard.student.reviews.submit")}
        </Button>
      </form>
    </Form>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-2">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className="focus:outline-none"
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`w-8 h-8 cursor-pointer transition-colors ${
                ratingValue <= (hover || value)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
