import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.locator('[data-testid="splash-screen"]'),
    ).toBeVisible();

    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "redirect@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await expect(page).toHaveURL("/dashboard");

    await page.goto("/");

    await expect(page).toHaveURL("/dashboard", { timeout: 5000 });
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "newuser@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(
      page.locator('[data-testid="dashboard-page"]'),
    ).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "usera@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "User A Habit");
    await page.click('[data-testid="habit-save-button"]');

    await expect(
      page.locator('[data-testid="habit-card-user-a-habit"]'),
    ).toBeVisible();

    await page.click('[data-testid="auth-logout-button"]');
    await expect(page).toHaveURL("/login");

    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "userb@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "User B Habit");
    await page.click('[data-testid="habit-save-button"]');

    await expect(
      page.locator('[data-testid="habit-card-user-b-habit"]'),
    ).toBeVisible();

    await page.click('[data-testid="auth-logout-button"]');
    await expect(page).toHaveURL("/login");

    await page.fill(
      '[data-testid="auth-login-email"]',
      "usera@example.com",
    );
    await page.fill(
      '[data-testid="auth-login-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-login-submit"]');

    await expect(page).toHaveURL("/dashboard");

    await expect(
      page.locator('[data-testid="habit-card-user-a-habit"]'),
    ).toBeVisible();

    await expect(
      page.locator('[data-testid="habit-card-user-b-habit"]'),
    ).not.toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "create@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill(
      '[data-testid="habit-name-input"]',
      "Morning Run",
    );
    await page.fill(
      '[data-testid="habit-description-input"]',
      "Run every morning",
    );

    await page.click('[data-testid="habit-save-button"]');

    await expect(
      page.locator('[data-testid="habit-card-morning-run"]'),
    ).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "streak@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "Meditate");
    await page.click('[data-testid="habit-save-button"]');

    await expect(
      page.locator('[data-testid="habit-streak-meditate"]'),
    ).toHaveText("Current streak: 0 days");

    await page.click('[data-testid="habit-complete-meditate"]');

    await expect(
      page.locator('[data-testid="habit-streak-meditate"]'),
    ).toHaveText("Current streak: 1 day");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "persist@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', "Read");
    await page.click('[data-testid="habit-save-button"]');

    await page.click('[data-testid="habit-complete-read"]');

    await expect(
      page.locator('[data-testid="habit-streak-read"]'),
    ).toHaveText("Current streak: 1 day");

    await page.reload();

    await expect(page).toHaveURL("/dashboard");

    await expect(
      page.locator('[data-testid="habit-card-read"]'),
    ).toBeVisible();

    await expect(
      page.locator('[data-testid="habit-streak-read"]'),
    ).toHaveText("Current streak: 1 day");
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.goto("/signup");

    await page.fill(
      '[data-testid="auth-signup-email"]',
      "logout@example.com",
    );
    await page.fill(
      '[data-testid="auth-signup-password"]',
      "password123",
    );
    await page.click('[data-testid="auth-signup-submit"]');

    await expect(page).toHaveURL("/dashboard");

    await page.click('[data-testid="auth-logout-button"]');

    await expect(page).toHaveURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/login", { timeout: 5000 });

    await context.setOffline(true);

    await page.reload();

    const bodyText = await page.locator("body").innerText();

    expect(bodyText.length).toBeGreaterThan(0);

    await context.setOffline(false);
  });
});
