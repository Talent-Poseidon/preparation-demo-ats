"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  assignees: z.array(
    z.object({
      email: z.string().email("Invalid email format"),
      name: z.string().min(1, "Assignee name is required"),
    })
  ).min(1, "At least one assignee is required"),
})

export default function ProjectForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      startDate: "",
      endDate: "",
      assignees: [{ email: "", name: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignees",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      console.error("Failed to create project")
      return
    }
    const newProject = await res.json()
    // Handle success (e.g., update state, show success message)
  }

  return (
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
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <FormField
              control={form.control}
              name={`assignees.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee Email</FormLabel>
                  <FormControl>
                    <Input data-testid={`assignee-email-input-${index}`} placeholder="Assignee Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`assignees.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee Name</FormLabel>
                  <FormControl>
                    <Input data-testid={`assignee-name-input-${index}`} placeholder="Assignee Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={() => remove(index)}>Remove Assignee</Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ email: "", name: "" })}>Add Assignee</Button>
        <Button type="submit" data-testid="submit-project-btn">
          Submit
        </Button>
      </form>
    </Form>
  )
}
