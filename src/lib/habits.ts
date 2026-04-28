import { STORAGE_KEYS } from "./constants";
import { readFromStorage, writeToStorage } from "./storage";
import type { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const uniqueCompletions = new Set(habit.completions);

  if (uniqueCompletions.has(date)) {
    uniqueCompletions.delete(date);
  } else {
    uniqueCompletions.add(date);
  }

  return {
    ...habit,
    completions: Array.from(uniqueCompletions).sort(),
  };
}

export function getHabits(): Habit[] {
  return readFromStorage<Habit[]>(STORAGE_KEYS.habits, []);
}

export function saveHabits(habits: Habit[]): void {
  writeToStorage(STORAGE_KEYS.habits, habits);
}

export function getHabitsByUser(userId: string): Habit[] {
  return getHabits().filter((habit) => habit.userId === userId);
}
