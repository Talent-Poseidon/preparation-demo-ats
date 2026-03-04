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

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  assigneeEmail: z.string().email("Invalid email format"),
  assigneeName: z.string().min(1, "Assignee name is required"),
});

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  assignees: { email: string; name: string }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      startDate: "",
      endDate: "",
      assigneeEmail: "",
      assigneeName: "",
    },
  });

  useEffect(() => {
    // TODO: Replace with actual API endpoint
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err: Error) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Replace with actual API endpoint
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      console.error("Failed to create project");
      return;
    }
    const newProject = await res.json();
    setProjects((prev) => [...prev, newProject]);
    setSuccess(true);
  }

  return (
    <div className="p-8">
      <nav role="navigation" aria-label="Projects" data-testid="project-menu-nav">
        <h1 className="text-2xl font-bold">Projects</h1>
      </nav>
      <div data-testid="project-list-container">
        {loading ? (
          <p>Loading projects...</p>
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
      <Button data-testid="setup-new-project-btn" onClick={() => {}}>
        Setup New Project
      </Button>
      {success && (
        <div data-testid="success-alert" className="alert alert-success">
          Project created successfully
        </div>
      )}
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
                  <Input data-testid="start-date-input" type="date" {...field} />
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
                  <Input data-testid="end-date-input" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigneeEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee Email</FormLabel>
                <FormControl>
                  <Input data-testid="assignee-email-input" placeholder="Assignee Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigneeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee Name</FormLabel>
                <FormControl>
                  <Input data-testid="assignee-name-input" placeholder="Assignee Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" data-testid="submit-project-btn">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
