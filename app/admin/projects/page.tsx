"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AssigneeSelection } from "@/components/admin/AssigneeSelection";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      setConfirmationMessage("Project created successfully");
    } catch (error) {
      console.error(error);
      setConfirmationMessage("Failed to create project");
    }
  }

  return (
    <div>
      <nav data-testid="project-menu">
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
      <Button data-testid="setup-new-project-btn">Setup New Project</Button>
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
                  <Calendar
                    data-testid="start-date-input"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date: Date | null) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                  />
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
                  <Calendar
                    data-testid="end-date-input"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date: Date | null) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AssigneeSelection />
          <Button type="submit" data-testid="submit-project-btn">Submit</Button>
        </form>
      </Form>
      {confirmationMessage && (
        <div data-testid="confirmation-message" role="alert">
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}
