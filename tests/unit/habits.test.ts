import { beforeEach, describe, expect, it } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import type { Habit } from "@/types/habit";
import { getHabits, getHabitsByUser, saveHabits } from "@/lib/habits";

const habit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Drink enough water daily",
  frequency: "daily",
  createdAt: "2026-04-26T10:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const updatedHabit = toggleHabitCompletion(habit, "2026-04-26");

    expect(updatedHabit.completions).toContain("2026-04-26");
  });

  it("removes a completion date when the date already exists", () => {
    const completedHabit = {
      ...habit,
      completions: ["2026-04-26"],
    };

    const updatedHabit = toggleHabitCompletion(completedHabit, "2026-04-26");

    expect(updatedHabit.completions).not.toContain("2026-04-26");
  });

  it("does not mutate the original habit object", () => {
    const originalHabit = {
      ...habit,
      completions: [],
    };

    toggleHabitCompletion(originalHabit, "2026-04-26");

    expect(originalHabit.completions).toEqual([]);
  });

  it("does not return duplicate completion dates", () => {
    const completedHabit = {
      ...habit,
      completions: ["2026-04-26", "2026-04-26"],
    };

    const updatedHabit = toggleHabitCompletion(completedHabit, "2026-04-27");

    expect(updatedHabit.completions).toEqual(["2026-04-26", "2026-04-27"]);
  });
});

describe("habit persistence helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and reads habits from localStorage", () => {
    saveHabits([habit]);

    expect(getHabits()).toEqual([habit]);
  });

  it("returns only habits belonging to a specific user", () => {
    saveHabits([
      habit,
      {
        ...habit,
        id: "habit-2",
        userId: "user-2",
        name: "Read Books",
      },
    ]);

    expect(getHabitsByUser("user-1")).toEqual([habit]);
  });
});
