import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { STORAGE_KEYS } from "@/lib/constants";

// mocking router to replace Nextjs router during test

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

// test group
describe("auth flow", () => {
  // reset before each test (runs before every it)
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    replaceMock.mockClear();
  });

  it("submits the signup form and creates a session", async () => {
    // prepare simulated user
    const user = userEvent.setup();

    // display SignupForm into the test DOM so as to interact with it
    render(<SignupForm />);

    // find signup email input element and type passed email into it
    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );

    // find signup password input element and type password into it
    await user.type(screen.getByTestId("auth-signup-password"), "password123");

    // simulate user submitting the form
    await user.click(screen.getByTestId("auth-signup-submit"));

    // retrieve session from localStorage to verify signup side effects
    const session = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.session) ?? "null",
    );

    // check that the stored session matches the signup input
    expect(session.email).toBe("test@example.com");

    // check that the session tried to redirect to dashboard
    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    // show first signup form
    render(<SignupForm />);

    // signup and store user
    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    cleanup();

    // show another signup form
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeInTheDocument();
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "login@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    window.localStorage.removeItem(STORAGE_KEYS.session);
    replaceMock.mockClear();
    cleanup();

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "login@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    const session = JSON.parse(
      window.localStorage.getItem(STORAGE_KEYS.session) ?? "null",
    );

    expect(session.email).toBe("login@example.com");
    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "wrong@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "badpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
