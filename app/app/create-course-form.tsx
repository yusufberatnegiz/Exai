"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CourseActionResult = { error: string } | { success: true } | null;

type Props = {
  action: (prevState: null, formData: FormData) => Promise<CourseActionResult>;
};

export default function CreateCourseForm({ action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(null, formData);
      if (result && "error" in result) {
        setError(result.error);
      } else {
        setError(null);
        formRef.current?.reset();
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">New Course</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <Input
            name="title"
            placeholder="Course title (e.g. Calculus II)"
            required
            disabled={isPending}
          />
{error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Creating…" : "Create course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
