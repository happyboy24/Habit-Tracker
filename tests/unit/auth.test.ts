import { beforeEach, describe, expect, it } from "vitest";
import { getCurrentSession, login, logout, signup } from "@/lib/auth";
import { STORAGE_KEYS } from "@/lib/constants";

describe("auth helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("signs up a new user and creates a session", () => {
    const result = signup("test@example.com", "password123");

    const session = getCurrentSession();

    expect(result.success).toBe(true);
    expect(session?.email).toBe("test@example.com");
  });

  it("rejects duplicate signup email", () => {
    signup("test@example.com", "password123");

    const result = signup("test@example.com", "password123");

    expect(result.success).toBe(false);
    expect(result.error).toBe("User already exists");
  });

  it("logs in an existing user", () => {
    signup("login@example.com", "password123");
    window.localStorage.removeItem(STORAGE_KEYS.session);

    const result = login("login@example.com", "password123");

    expect(result.success).toBe(true);
    expect(getCurrentSession()?.email).toBe("login@example.com");
  });

  it("rejects invalid login credentials", () => {
    const result = login("wrong@example.com", "badpassword");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid email or password");
  });

  it("logs out by removing the active session", () => {
    signup("logout@example.com", "password123");

    logout();

    expect(getCurrentSession()).toBeNull();
  });
});
