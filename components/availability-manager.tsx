"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Define the Availability type
interface Availability {
  id: string;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
}

// Props for the AvailabilityManager component
interface AvailabilityManagerProps {
  tutorId: string;
  initialAvailabilities?: Availability[];
}

// Helper for day names
const daysOfWeek = [
  { name: "Sunday", nameAr: "الأحد", value: 0 },
  { name: "Monday", nameAr: "الإثنين", value: 1 },
  { name: "Tuesday", nameAr: "الثلاثاء", value: 2 },
  { name: "Wednesday", nameAr: "الأربعاء", value: 3 },
  { name: "Thursday", nameAr: "الخميس", value: 4 },
  { name: "Friday", nameAr: "الجمعة", value: 5 },
  { name: "Saturday", nameAr: "السبت", value: 6 },
];

// --- API Simulation (Replace with actual API calls) ---
const simulateApiCall = <T,>(
  data: T,
  successMessage: string,
  errorMessage: string
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate
        toast.success(successMessage);
        resolve(data);
      } else {
        toast.error(errorMessage);
        reject(new Error(errorMessage));
      }
    }, 800);
  });
};

const addAvailabilityApi = async (
  tutorId: string,
  newAvailability: Omit<Availability, "id">
): Promise<Availability> => {
  console.log("API POST:", { tutorId, newAvailability });
  const newId = `avail-${Date.now()}`; // Simulate ID from backend
  return simulateApiCall(
    { ...newAvailability, id: newId },
    "تم إضافة الوقت بنجاح",
    "فشل إضافة الوقت"
  );
};

const updateAvailabilityApi = async (
  tutorId: string,
  updatedAvailability: Availability
): Promise<Availability> => {
  console.log("API PUT:", { tutorId, updatedAvailability });
  return simulateApiCall(
    updatedAvailability,
    "تم تعديل الوقت بنجاح",
    "فشل تعديل الوقت"
  );
};

const deleteAvailabilityApi = async (
  tutorId: string,
  availabilityId: string
): Promise<string> => {
  console.log("API DELETE:", { tutorId, availabilityId });
  return simulateApiCall(
    availabilityId,
    "تم حذف الوقت بنجاح",
    "فشل حذف الوقت"
  );
};
// --- End API Simulation ---

// Availability Form Dialog Component
interface AvailabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (availability: Omit<Availability, "id">) => void;
  initialData?: Availability;
  dayOfWeek: number;
}

const AvailabilityDialog: React.FC<AvailabilityDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  dayOfWeek,
}) => {
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");

  useEffect(() => {
    if (initialData) {
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
    } else {
      setStartTime("");
      setEndTime("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      toast.error("الرجاء إدخال وقت البدء والانتهاء.");
      return;
    }
    onSave({ dayOfWeek, startTime, endTime });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "تعديل الفترة" : "إضافة فترة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              وقت البدء
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              وقت الانتهاء
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  tutorId,
  initialAvailabilities,
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>(
    initialAvailabilities || []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] =
    useState<Availability | undefined>(undefined);
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number>(0); // For adding new availability

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [availabilityToDelete, setAvailabilityToDelete] =
    useState<string | undefined>(undefined);

  // Handlers for Add/Edit Dialog
  const handleAddClick = (day: number) => {
    setCurrentDayOfWeek(day);
    setEditingAvailability(undefined); // Ensure no initial data for add
    setIsDialogOpen(true);
  };

  const handleEditClick = (availability: Availability) => {
    setEditingAvailability(availability);
    setCurrentDayOfWeek(availability.dayOfWeek);
    setIsDialogOpen(true);
  };

  const handleSaveAvailability = async (
    newAvailabilityData: Omit<Availability, "id">
  ) => {
    try {
      if (editingAvailability) {
        // Update existing
        const updated = await updateAvailabilityApi(tutorId, {
          ...newAvailabilityData,
          id: editingAvailability.id,
        } as Availability);
        setAvailabilities((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
      } else {
        // Add new
        const added = await addAvailabilityApi(tutorId, newAvailabilityData);
        setAvailabilities((prev) => [...prev, added]);
      }
    } catch (error) {
      console.error("Failed to save availability:", error);
      // Toast error is handled by simulateApiCall
    }
  };

  // Handlers for Delete Alert Dialog
  const handleDeleteClick = (id: string) => {
    setAvailabilityToDelete(id);
    setIsAlertDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (availabilityToDelete) {
      try {
        await deleteAvailabilityApi(tutorId, availabilityToDelete);
        setAvailabilities((prev) =>
          prev.filter((a) => a.id !== availabilityToDelete)
        );
      } catch (error) {
        console.error("Failed to delete availability:", error);
        // Toast error is handled by simulateApiCall
      } finally {
        setAvailabilityToDelete(undefined);
        setIsAlertDialogOpen(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        إدارة الأوقات المتاحة
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <Card key={day.value} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {day.name} / {day.nameAr}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddClick(day.value)}
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                {availabilities
                  .filter((a) => a.dayOfWeek === day.value)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((availability) => (
                    <div
                      key={availability.id}
                      className="flex items-center justify-between p-2 border rounded-md text-sm"
                    >
                      <span>
                        {availability.startTime} - {availability.endTime}
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
                {availabilities.filter((a) => a.dayOfWeek === day.value)
                  .length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    لا توجد أوقات متاحة
                  </p>
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
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيؤدي هذا الإجراء إلى حذف الفترة الزمنية المحددة بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
