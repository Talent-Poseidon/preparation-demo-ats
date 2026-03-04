import { test, expect } from "@playwright/test";

// Integration tests for the project API endpoints

test.describe("Project API Endpoints", () => {
  test("GET /api/projects - should return a list of projects", async ({ request }) => {
    const response = await request.get("/api/projects");
    expect(response.ok()).toBeTruthy();

    const projects = await response.json();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("id");
    expect(projects[0]).toHaveProperty("name");
  });

  test("POST /api/projects - should create a new project", async ({ request }) => {
    const newProject = {
      name: "Test Project",
      startDate: "2023-11-01",
      endDate: "2024-01-01",
      assignees: [
        { email: "john.doe@example.com", name: "John Doe" },
        { email: "jane.smith@example.com", name: "Jane Smith" }
      ]
    };

    const response = await request.post("/api/projects", {
      data: newProject
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const project = await response.json();
    expect(project).toHaveProperty("id");
    expect(project.name).toBe(newProject.name);
  });

  test("POST /api/projects - should fail with missing fields", async ({ request }) => {
    const incompleteProject = {
      startDate: "2023-11-01",
      endDate: "2024-01-01",
      assignees: [
        { email: "john.doe@example.com", name: "John Doe" }
      ]
    };

    const response = await request.post("/api/projects", {
      data: incompleteProject
    });
    expect(response.status()).toBe(400);

    const error = await response.json();
    expect(error).toHaveProperty("error");
    expect(error.error).toBe("Missing required fields");
  });
});
