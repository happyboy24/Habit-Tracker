"use client";

import type { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

type HabitListProps = {
  habits: Habit[];
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitList({
  habits,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[#123524]">No habits yet</h2>
        <p className="mt-2 text-sm text-[#667085]">
          Create your first habit to start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
