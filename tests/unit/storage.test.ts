import { beforeEach, describe, expect, it } from "vitest";
import {
  readFromStorage,
  removeFromStorage,
  writeToStorage,
} from "@/lib/storage";

describe("storage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("writes and reads a value from localStorage", () => {
    writeToStorage("test-key", { name: "Ibrahim" });

    expect(readFromStorage("test-key", null)).toEqual({
      name: "Ibrahim",
    });
  });

  it("returns fallback when key does not exist", () => {
    expect(readFromStorage("missing-key", [])).toEqual([]);
  });

  it("removes a value from localStorage", () => {
    writeToStorage("test-key", "hello");

    removeFromStorage("test-key");

    expect(readFromStorage("test-key", null)).toBeNull();
  });
});
