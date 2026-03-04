"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssigneeInput } from "@/components/admin/assignee-input";

// Define the schema for form validation
const formSchema = z.object({
  projectName: z.string().min(1, "Project Name is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  assignees: z.array(
    z.object({
      email: z.string().email("Invalid email"),
      name: z.string().min(1, "Name is required"),
    })
  ),
});

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      startDate: "",
      endDate: "",
      assignees: [{ email: "", name: "" }],
    },
  });

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err: Error) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (new Date(values.endDate) <= new Date(values.startDate)) {
      setErrorMessage("End date must be after start date");
      setSuccessMessage("");
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create project");
      setSuccessMessage("Project created successfully");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to create project");
      setSuccessMessage("");
    }
  }

  return (
    <div>
      <nav role="navigation" data-testid="project-menu">
        <h1>Projects</h1>
      </nav>

      <div data-testid="project-list">
        {loading ? (
          <p>Loading...</p>
        ) : projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        ) : (
          <p>No projects found</p>
        )}
      </div>

      {successMessage && <p data-testid="success-alert">{successMessage}</p>}
      {errorMessage && <p data-testid="error-alert">{errorMessage}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input data-testid="project-name-input" placeholder="Project Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input data-testid="start-date-input" placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input data-testid="end-date-input" placeholder="YYYY-MM-DD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AssigneeInput />
          <Button type="submit" data-testid="submit-project-btn">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
