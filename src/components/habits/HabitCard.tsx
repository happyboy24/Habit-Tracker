"use client";

import type { Habit } from "@/types/habit";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getHabitSlug } from "@/lib/slug";

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitCard({
  habit,
  today,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompletedToday = habit.completions.includes(today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border p-5 shadow-sm ${
        isCompletedToday
          ? "border-[#066735] bg-[#eef8f1]"
          : "border-[#eaecf0] bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#123524]">{habit.name}</h2>

          {habit.description && (
            <p className="mt-1 text-sm text-[#667085]">{habit.description}</p>
          )}

          <p
            data-testid={`habit-streak-${slug}`}
            className="mt-3 text-sm font-medium text-[#7a5c16]"
          >
            Current streak: {streak} day{streak === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            data-testid={`habit-complete-${slug}`}
            type="button"
            onClick={() => onToggleComplete(habit)}
            className="rounded-xl bg-[#066735] px-3 py-2 font-mono font-bold text-sm text-white cursor-pointer transition-transform duration-300 hover:-translate-y-1"
          >
            {isCompletedToday ? "Unmark" : "Complete"}
          </button>

          <button
            data-testid={`habit-edit-${slug}`}
            type="button"
            onClick={() => onEdit(habit)}
            className="rounded-xl font-mono border border-[#d0d5dd] px-3 py-2 text-sm font-semibold text-[#123524] cursor-pointer transition-transform duration-300 hover:bg-[#123524] hover:text-white hover:-translate-y-1"
          >
            Edit
          </button>

          <button
            data-testid={`habit-delete-${slug}`}
            type="button"
            onClick={() => onDelete(habit)}
            className="rounded-xl font-mono border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 cursor-pointer transition-transform duration-300 hover:bg-red-600 hover:text-white hover:-translate-y-1"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
