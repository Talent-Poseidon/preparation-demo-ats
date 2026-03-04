import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsPage from "../../app/admin/projects";
import { act } from "react-dom/test-utils";

jest.mock("../../app/api/projects/route", () => ({
  GET: jest.fn(() => Promise.resolve({
    json: () => Promise.resolve([
      { id: "1", name: "Project Alpha", startDate: "2023-10-01", endDate: "2023-12-01", assignees: [] },
      { id: "2", name: "Project Beta", startDate: "2023-11-01", endDate: "2024-01-01", assignees: [] },
    ]),
  })),
  POST: jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      id: "3", name: "New Project", startDate: "2023-11-01", endDate: "2024-01-01", assignees: []
    }),
  })),
}));

describe("ProjectsPage", () => {
  it("renders project list", async () => {
    await act(async () => {
      render(<ProjectsPage />);
    });

    expect(screen.getByTestId("project-list-container")).toBeVisible();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
  });

  it("submits new project", async () => {
    await act(async () => {
      render(<ProjectsPage />);
    });

    fireEvent.change(screen.getByTestId("project-name-input"), { target: { value: "New Project" } });
    fireEvent.change(screen.getByTestId("start-date-input"), { target: { value: "2023-11-01" } });
    fireEvent.change(screen.getByTestId("end-date-input"), { target: { value: "2024-01-01" } });
    fireEvent.change(screen.getByTestId("assignee-email-input"), { target: { value: "john.doe@example.com" } });
    fireEvent.change(screen.getByTestId("assignee-name-input"), { target: { value: "John Doe" } });

    await act(async () => {
      fireEvent.click(screen.getByTestId("submit-project-btn"));
    });

    expect(screen.getByTestId("success-alert")).toBeVisible();
    expect(screen.getByText("New Project")).toBeInTheDocument();
  });
});
