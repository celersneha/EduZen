"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClassroom } from "@/actions/create-classroom";
import { generateClassroomCode } from "@/actions/generate-classroom-code";

const formSchema = z.object({
  classroomName: z
    .string()
    .min(3, "Classroom name must be at least 3 characters"),
  classroomCode: z
    .string()
    .min(4, "Classroom code must be at least 4 characters"),
});

export function CreateClassroomClient() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroomName: "",
      classroomCode: "",
    },
  });

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await generateClassroomCode();

      if (error) {
        toast.error(error);
        return;
      }

      form.setValue("classroomCode", data);
      toast.success("Classroom code generated!");
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await createClassroom(values);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Classroom created successfully!");
      router.push(`/classroom/${data.classroom.id}`);
    } catch (error) {
      console.error("Error creating classroom:", error);
      toast.error("Failed to create classroom");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/teacher/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Classroom</CardTitle>
                <CardDescription>
                  Set up a new classroom and start inviting students
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="classroomName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Mathematics 101, Computer Science Fundamentals"
                          {...field}
                          disabled={isSubmitting}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classroomCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Code</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="e.g., MATH101"
                            {...field}
                            disabled={isSubmitting}
                            className="h-12 font-mono"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateCode}
                          disabled={isGenerating || isSubmitting}
                          className="h-12"
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Generate"
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Students will use this code to join your classroom
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Classroom"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
