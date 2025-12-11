"use client"

import React, { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

interface Availability {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface AvailabilityManagerProps {
  tutorId: string
  initialAvailabilities?: Availability[]
  className?: string
  showHeading?: boolean
  heading?: string
  layout?: "full" | "compact"
}

const daysOfWeek = [
  { labelKey: "availability.day.sunday", value: 0 },
  { labelKey: "availability.day.monday", value: 1 },
  { labelKey: "availability.day.tuesday", value: 2 },
  { labelKey: "availability.day.wednesday", value: 3 },
  { labelKey: "availability.day.thursday", value: 4 },
  { labelKey: "availability.day.friday", value: 5 },
  { labelKey: "availability.day.saturday", value: 6 },
]

const simulateApiCall = <T,>(data: T, successMessage: string, errorMessage: string): Promise<T> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        toast.success(successMessage)
        resolve(data)
      } else {
        toast.error(errorMessage)
        reject(new Error(errorMessage))
      }
    }, 500)
  })

type ApiMessages = {
  success: string
  error: string
}

const addAvailabilityApi = async (
  tutorId: string,
  newAvailability: Omit<Availability, "id">,
  messages: ApiMessages,
): Promise<Availability> => {
  console.log("API POST:", { tutorId, newAvailability })
  return simulateApiCall(
    { ...newAvailability, id: `avail-${Date.now()}` },
    messages.success,
    messages.error,
  )
}

const updateAvailabilityApi = async (
  tutorId: string,
  updatedAvailability: Availability,
  messages: ApiMessages,
): Promise<Availability> => {
  console.log("API PUT:", { tutorId, updatedAvailability })
  return simulateApiCall(updatedAvailability, messages.success, messages.error)
}

const deleteAvailabilityApi = async (
  tutorId: string,
  availabilityId: string,
  messages: ApiMessages,
): Promise<string> => {
  console.log("API DELETE:", { tutorId, availabilityId })
  return simulateApiCall(availabilityId, messages.success, messages.error)
}

interface AvailabilityDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (availability: Omit<Availability, "id">) => void
  initialData?: Availability
  dayOfWeek: number
}

const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  dayOfWeek,
}) => {
  const { t } = useLanguage()
  const [startTime, setStartTime] = useState(initialData?.startTime || "")
  const [endTime, setEndTime] = useState(initialData?.endTime || "")

  useEffect(() => {
    if (initialData) {
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
    } else {
      setStartTime("")
      setEndTime("")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      toast.error(t("availability.error.missing"))
      return
    }
    if (endTime <= startTime) {
      toast.error(t("availability.error.order"))
      return
    }
    onSave({ dayOfWeek, startTime, endTime })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("availability.dialog.edit") : t("availability.dialog.add")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              {t("availability.dialog.start")}
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              {t("availability.dialog.end")}
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("availability.dialog.cancel")}</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            {t("availability.dialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  tutorId,
  initialAvailabilities = [],
  className,
  showHeading = true,
  heading,
  layout = "full",
}) => {
  const { t } = useLanguage()
  const [availabilities, setAvailabilities] = useState<Availability[]>(initialAvailabilities)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<Availability | undefined>(undefined)
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number>(0)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [availabilityToDelete, setAvailabilityToDelete] = useState<string | undefined>(undefined)

  const dayOptions = daysOfWeek.map((day) => ({
    value: day.value,
    label: t(day.labelKey),
  }))
  const resolvedHeading = heading ?? t("availability.heading")

  const handleAddClick = (day: number) => {
    setCurrentDayOfWeek(day)
    setEditingAvailability(undefined)
    setIsDialogOpen(true)
  }

  const handleEditClick = (availability: Availability) => {
    setEditingAvailability(availability)
    setCurrentDayOfWeek(availability.dayOfWeek)
    setIsDialogOpen(true)
  }

  const handleSaveAvailability = async (newAvailabilityData: Omit<Availability, "id">) => {
    try {
      if (editingAvailability) {
        const updated = await updateAvailabilityApi(
          tutorId,
          {
            ...newAvailabilityData,
            id: editingAvailability.id,
          } as Availability,
          {
            success: t("availability.toast.updateSuccess"),
            error: t("availability.toast.updateError"),
          },
        )
        setAvailabilities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      } else {
        const added = await addAvailabilityApi(tutorId, newAvailabilityData, {
          success: t("availability.toast.saveSuccess"),
          error: t("availability.toast.saveError"),
        })
        setAvailabilities((prev) => [...prev, added])
      }
    } catch (error) {
      console.error("Failed to save availability:", error)
    }
  }

  const handleDeleteClick = (id: string) => {
    setAvailabilityToDelete(id)
    setIsAlertDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (availabilityToDelete) {
      try {
        await deleteAvailabilityApi(tutorId, availabilityToDelete, {
          success: t("availability.toast.deleteSuccess"),
          error: t("availability.toast.deleteError"),
        })
        setAvailabilities((prev) => prev.filter((a) => a.id !== availabilityToDelete))
      } catch (error) {
        console.error("Failed to delete availability:", error)
      } finally {
        setAvailabilityToDelete(undefined)
        setIsAlertDialogOpen(false)
      }
    }
  }

  const gridClasses =
    layout === "compact"
      ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7"

  return (
    <div className={cn("space-y-6", className)}>
      {showHeading && <h2 className="text-2xl font-bold text-center">{resolvedHeading}</h2>}

      <div className={gridClasses}>
        {dayOptions.map((day) => (
          <Card key={day.value} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{day.label}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleAddClick(day.value)}>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                {availabilities
                  .filter((availability) => availability.dayOfWeek === day.value)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((availability) => (
                    <div
                      key={availability.id}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <span>
                        {availability.startTime} – {availability.endTime}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditClick(availability)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(availability.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {availabilities.filter((a) => a.dayOfWeek === day.value).length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("availability.empty")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AvailabilityDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveAvailability}
        initialData={editingAvailability}
        dayOfWeek={currentDayOfWeek}
      />

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("availability.dialog.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("availability.dialog.deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("availability.dialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {t("availability.dialog.deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
