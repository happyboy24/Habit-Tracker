import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/dashboard/page";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Habit } from "@/types/habit";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const session = {
  userId: "test-user",
  email: "test@example.com",
};

function renderDashboard() {
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  render(<DashboardPage />);
}

async function createHabit(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("create-habit-button"));

  await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
  await user.type(
    screen.getByTestId("habit-description-input"),
    "Stay hydrated daily",
  );

  await user.click(screen.getByTestId("habit-save-button"));
}

describe("habit form", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    replaceMock.mockClear();
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await user.click(screen.getByTestId("create-habit-button"));
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await createHabit(user);

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await createHabit(user);

    const savedBefore = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.habits) ?? "[]",
    ) as Habit[];

    const originalHabit = savedBefore[0];

    await user.click(screen.getByTestId("habit-edit-drink-water"));

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Read Books");

    await user.click(screen.getByTestId("habit-save-button"));

    const savedAfter = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.habits) ?? "[]",
    ) as Habit[];

    const editedHabit = savedAfter[0];

    expect(screen.getByTestId("habit-card-read-books")).toBeInTheDocument();
    expect(editedHabit.id).toBe(originalHabit.id);
    expect(editedHabit.userId).toBe(originalHabit.userId);
    expect(editedHabit.createdAt).toBe(originalHabit.createdAt);
    expect(editedHabit.completions).toEqual(originalHabit.completions);
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await createHabit(user);

    await user.click(screen.getByTestId("habit-delete-drink-water"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete-button"));

    expect(
      screen.queryByTestId("habit-card-drink-water"),
    ).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();

    renderDashboard();

    await createHabit(user);

    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "Current streak: 0 days",
    );

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "Current streak: 1 day",
    );

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "Current streak: 0 days",
    );
  });
});
