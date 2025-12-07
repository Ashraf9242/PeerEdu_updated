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
  { name: "Sunday", value: 0 },
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
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

const addAvailabilityApi = async (tutorId: string, newAvailability: Omit<Availability, "id">): Promise<Availability> => {
  console.log("API POST:", { tutorId, newAvailability })
  return simulateApiCall(
    { ...newAvailability, id: `avail-${Date.now()}` },
    "Availability slot saved.",
    "Unable to save the availability slot."
  )
}

const updateAvailabilityApi = async (
  tutorId: string,
  updatedAvailability: Availability,
): Promise<Availability> => {
  console.log("API PUT:", { tutorId, updatedAvailability })
  return simulateApiCall(updatedAvailability, "Availability slot updated.", "Unable to update the availability slot.")
}

const deleteAvailabilityApi = async (tutorId: string, availabilityId: string): Promise<string> => {
  console.log("API DELETE:", { tutorId, availabilityId })
  return simulateApiCall(availabilityId, "Availability slot removed.", "Unable to delete the availability slot.")
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
      toast.error("Please enter both a start time and an end time.")
      return
    }
    if (endTime <= startTime) {
      toast.error("End time must be later than the start time.")
      return
    }
    onSave({ dayOfWeek, startTime, endTime })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit availability" : "Add availability"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start time
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
              End time
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
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Save slot
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
  heading = "Manage Availability",
  layout = "full",
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>(initialAvailabilities)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAvailability, setEditingAvailability] = useState<Availability | undefined>(undefined)
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number>(0)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [availabilityToDelete, setAvailabilityToDelete] = useState<string | undefined>(undefined)

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
        const updated = await updateAvailabilityApi(tutorId, {
          ...newAvailabilityData,
          id: editingAvailability.id,
        } as Availability)
        setAvailabilities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      } else {
        const added = await addAvailabilityApi(tutorId, newAvailabilityData)
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
        await deleteAvailabilityApi(tutorId, availabilityToDelete)
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
      {showHeading && <h2 className="text-2xl font-bold text-center">{heading}</h2>}

      <div className={gridClasses}>
        {daysOfWeek.map((day) => (
          <Card key={day.value} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{day.name}</CardTitle>
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
                  <p className="text-sm text-muted-foreground">No slots yet</p>
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
            <AlertDialogTitle>Delete this availability?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the selected time slot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
