"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import ConfirmationMessage from "@/components/ui/confirmation-message";

const projectSchema = z.object({
  projectName: z.string().min(1, "Project Name is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  assigneeEmail: z.string().email("Invalid email format"),
  assigneeName: z.string().min(1, "Assignee Name is required"),
});

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data) => {
    console.log("Project Data:", data);
    setProjects([...projects, data]);
    setIsDialogOpen(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="p-8">
      <nav data-testid="project-menu" className="mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
      </nav>

      <Card data-testid="project-list">
        <CardHeader>
          <h2 className="text-xl font-semibold">Project List</h2>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <ul>
              {projects.map((project, index) => (
                <li key={index}>{project.projectName}</li>
              ))}
            </ul>
          ) : (
            <p>No projects available.</p>
          )}
        </CardContent>
      </Card>

      <Button data-testid="setup-new-project-btn" onClick={() => setIsDialogOpen(true)}>
        Setup New Project
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup New Project</DialogTitle>
          </DialogHeader>
          <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input data-testid="project-name-input" {...field} />
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
                      <Input data-testid="assignee-email-input" type="email" {...field} />
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
                      <Input data-testid="assignee-name-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" data-testid="submit-project-btn">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmationMessage message="Project setup successfully" visible={showConfirmation} />
    </div>
  );
}
