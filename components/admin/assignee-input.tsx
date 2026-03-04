"use client"

import { useState } from "react";
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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const assigneeSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
});

const formSchema = z.object({
  assignees: z.array(assigneeSchema),
});

interface Assignee {
  email: string;
  name: string;
}

export function AssigneeInput() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { assignees: [{ email: "", name: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignees",
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <FormField
              control={form.control}
              name={`assignees.${index}.email` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="assignee-email-input"
                      placeholder="Assignee Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`assignees.${index}.name` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="assignee-name-input"
                      placeholder="Assignee Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => append({ email: "", name: "" })}
        >
          Add Assignee
        </Button>
      </form>
    </Form>
  );
}
