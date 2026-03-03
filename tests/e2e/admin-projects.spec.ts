import { test, expect } from "@playwright/test";

test.describe("Admin Project Management", () => {
  test("Access Project Page", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByTestId("project-menu")).toBeVisible();
    await page.getByTestId("project-menu").click();
    await expect(page).toHaveURL("/admin/projects");
  });

  test("View Project List", async ({ page }) => {
    await page.goto("/admin/projects");
    await expect(page.getByTestId("project-list")).toBeVisible();
  });

  test("Setup New Project", async ({ page }) => {
    await page.goto("/admin/projects");
    await expect(page.getByTestId("setup-new-project-btn")).toBeVisible();
    await page.getByTestId("setup-new-project-btn").click();
    await page.getByTestId("project-name-input").fill("Project Alpha");
    await page.getByTestId("start-date-input").click();
    await page.getByRole("button", { name: "1" }).click(); // Selects the 1st of the month
    await page.getByTestId("end-date-input").click();
    await page.getByRole("button", { name: "1" }).click(); // Selects the 1st of the next month
    await page.getByTestId("assignee-email-input").fill("john.doe@example.com");
    await page.getByTestId("assignee-name-input").fill("John Doe");
    await page.getByTestId("submit-project-btn").click();
    await expect(page.getByTestId("confirmation-message")).toBeVisible();
  });

  test("Validation Error on Empty Project Name", async ({ page }) => {
    await page.goto("/admin/projects");
    await page.getByTestId("submit-project-btn").click();
    await expect(page.getByText("Project name is required")).toBeVisible();
  });

  test("Validation Error on Invalid Date Range", async ({ page }) => {
    await page.goto("/admin/projects");
    await page.getByTestId("start-date-input").click();
    await page.getByRole("button", { name: "1" }).click(); // Selects the 1st of the month
    await page.getByTestId("end-date-input").click();
    await page.getByRole("button", { name: "1" }).click(); // Selects the 1st of the previous month
    await page.getByTestId("submit-project-btn").click();
    await expect(page.getByText("End date must be after start date")).toBeVisible();
  });

  test("Validation Error on Invalid Assignee Email", async ({ page }) => {
    await page.goto("/admin/projects");
    await page.getByTestId("assignee-email-input").fill("invalid-email");
    await page.getByTestId("submit-project-btn").click();
    await expect(page.getByText("Invalid email format")).toBeVisible();
  });
});
