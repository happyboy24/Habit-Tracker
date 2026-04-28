"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validators";

type HabitFormValues = {
  name: string;
  description: string;
  frequency: "daily";
};

type HabitFormProps = {
  initialValues?: HabitFormValues;
  submitLabel?: string;
  onSave: (values: HabitFormValues) => void;
  onCancel?: () => void;
};

export default function HabitForm({
  initialValues,
  submitLabel = "Save habit",
  onSave,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = validateHabitName(name);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    onSave({
      name: result.value,
      description: description.trim(),
      frequency: "daily",
    });

    setName("");
    setDescription("");
    setError(null);
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-[#123524]">
            Habit name
          </label>
          <input
            data-testid="habit-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d0d5dd] px-3 py-2 text-sm"
            placeholder="Drink water"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123524]">
            Description
          </label>
          <textarea
            data-testid="habit-description-input"
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d0d5dd] px-3 py-2 text-sm"
            placeholder="Describe your habit"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#123524]">
            Frequency
          </label>
          <select
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            className="mt-2 w-full rounded-xl border border-[#d0d5dd] bg-gray-50 cursor-not-allowed text-gray-500 text-sm px-3 py-2"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          data-testid="habit-save-button"
          type="submit"
          className="rounded-xl bg-[#066735] font-mono font-bold px-4 py-2 text-sm text-white cursor-pointer transition-transform duration-300 hover:-translate-y-1"
        >
          {submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl font-mono border border-[#d0d5dd] px-4 py-2 text-sm font-semibold text-[#123524] cursor-pointer transition-transform duration-300 hover:bg-[#123524] hover:text-white hover:-translate-y-1"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
