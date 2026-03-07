"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type UploadState = { error: string } | { success: true } | null;

type Props = {
  courseId: string;
  action: (prevState: null, formData: FormData) => Promise<UploadState>;
};

export default function UploadForm({ courseId, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await action(null, formData);
      if (result && "error" in result) {
        setError(result.error);
      } else {
        setError(null);
        setFileName(null);
        formRef.current?.reset();
      }
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Upload Exam</CardTitle>
        <CardDescription>
          Upload a PDF or image, or paste the exam text directly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="courseId" value={courseId} />

          {/* File picker */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">
              File (PDF, PNG, JPG — max 10 MB)
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => fileRef.current?.click()}
              >
                Choose file
              </Button>
              <span className="text-sm text-gray-400 truncate max-w-[200px]">
                {fileName ?? "No file chosen"}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              disabled={isPending}
              onChange={(e) =>
                setFileName(e.target.files?.[0]?.name ?? null)
              }
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <div className="flex-1 h-px bg-gray-100" />
            or paste text
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Paste area */}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">
              Paste exam text
            </label>
            <Textarea
              name="pastedText"
              placeholder="Paste the full exam text here…"
              disabled={isPending}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
