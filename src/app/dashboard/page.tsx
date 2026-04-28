"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import { getCurrentSession, logout } from "@/lib/auth";
import {
  getHabits,
  getHabitsByUser,
  saveHabits,
  toggleHabitCompletion,
} from "@/lib/habits";
import type { Habit } from "@/types/habit";
import Modal from "@/components/shared/Modal";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const session = getCurrentSession();
  const today = new Date().toISOString().slice(0, 10);

  const [habits, setHabits] = useState<Habit[]>(
    session ? getHabitsByUser(session.userId) : [],
  );
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const closeModal = () => {
    setHabitToDelete(null);
    setShowForm(false);
    setEditingHabit(null);
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    const isAnyModalOpen = habitToDelete || showForm || editingHabit;

    if (isAnyModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [habitToDelete, showForm, editingHabit]);

  function syncHabits(updatedHabits: Habit[]) {
    saveHabits(updatedHabits);

    if (session) {
      setHabits(
        updatedHabits.filter((habit) => habit.userId === session.userId),
      );
    }
  }

  function handleCreateHabit(values: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (!session) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: values.name,
      description: values.description,
      frequency: values.frequency,
      createdAt: new Date().toISOString(),
      completions: [],
    };

    const updatedHabits = [newHabit, ...getHabits()];

    syncHabits(updatedHabits);
    setShowForm(false);
  }

  function handleEditHabit(values: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (!editingHabit) return;

    const updatedHabits = getHabits().map((habit) => {
      if (habit.id !== editingHabit.id) {
        return habit;
      }

      return {
        ...habit,
        name: values.name,
        description: values.description,
        frequency: "daily" as const,
      };
    });

    syncHabits(updatedHabits);
    setEditingHabit(null);
  }

  function handleToggleComplete(habitToUpdate: Habit) {
    const updatedHabits = getHabits().map((habit) => {
      if (habit.id !== habitToUpdate.id) {
        return habit;
      }

      return toggleHabitCompletion(habit, today);
    });

    syncHabits(updatedHabits);
  }

  function handleConfirmDelete() {
    if (!habitToDelete) return;

    const updatedHabits = getHabits().filter(
      (habit) => habit.id !== habitToDelete.id,
    );

    syncHabits(updatedHabits);
    setHabitToDelete(null);
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <main
      data-testid="dashboard-page"
      className="min-h-screen bg-[#84b2b3] px-4 py-6"
    >
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#066735] text-xl tracking-[-1px] font-bold text-white shadow-[0_12px_28px_rgba(15,139,141,0.24)]">
                <span className="text-2xl text-[#d0d5dd]">H</span>T
              </div>
              <p className="text-sm font-bold uppercase text-[#0B4F51] tracking-[6px]">
                Habit Tracker
              </p>
            </div>
          </div>

          <button
            data-testid="auth-logout-button"
            type="button"
            onClick={handleLogout}
            className="rounded-xl font-mono bg-white border-[1.5px] border-[#066735] px-4 py-2 text-sm font-semibold text-[#123524] cursor-pointer transition-transform duration-300 hover:bg-[#123524] hover:text-white hover:-translate-y-1"
          >
            Log out
          </button>
        </header>

        <section className="mx-auto flex max-w-5xl flex-col gap-6 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-lg bg-[#123524] p-6 rounded-lg shadow-md">
          <div className="flex flex-col justify-center items-center bg-[#f4f1f1] px-4 py-2 border-2 border-[#84b2b3]">
            <h1 className="mt-2 text-2xl font-bold text-[#123524]">
              Your Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#667085]">
              Track your daily habits and build consistent streaks.
            </p>
          </div>
        </section>

        {!showForm && !editingHabit && (
          <button
            data-testid="create-habit-button"
            type="button"
            onClick={() => setShowForm(true)}
            className="w-fit rounded-xl bg-[#066735] font-mono font-bold px-4 py-2 text-sm text-white cursor-pointer transition-transform duration-300 hover:-translate-y-1"
          >
            Create habit
          </button>
        )}

        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <HabitForm
              submitLabel="Create habit"
              onSave={handleCreateHabit}
              onCancel={() => setShowForm(false)}
            />
          </Modal>
        )}

        {editingHabit && (
          <Modal onClose={() => setEditingHabit(null)}>
            <HabitForm
              initialValues={{
                name: editingHabit.name,
                description: editingHabit.description,
                frequency: editingHabit.frequency,
              }}
              submitLabel="Update habit"
              onSave={handleEditHabit}
              onCancel={() => setEditingHabit(null)}
            />
          </Modal>
        )}

        <HabitList
          habits={habits}
          today={today}
          onToggleComplete={handleToggleComplete}
          onEdit={setEditingHabit}
          onDelete={setHabitToDelete}
        />

        {habitToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={closeModal}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-[#123524]">
                Confirm deletion
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                Are you sure you want to delete{" "}
                <strong>{habitToDelete.name}</strong>?
              </p>

              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl font-mono border border-[#d0d5dd] px-4 py-2 text-sm font-semibold text-[#123524] cursor-pointer transition-transform duration-300 hover:bg-[#123524] hover:text-white hover:-translate-y-1"
                >
                  Cancel
                </button>

                <button
                  data-testid="confirm-delete-button"
                  type="button"
                  onClick={handleConfirmDelete}
                  className="rounded-xl font-mono bg-red-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer transition-transform duration-300 hover:bg-red-700 hover:text-white hover:-translate-y-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
