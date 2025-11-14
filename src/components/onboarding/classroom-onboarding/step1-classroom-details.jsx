'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClassroom } from '@/actions/create-classroom';
import { generateClassroomCode } from '@/actions/generate-classroom-code';

const formSchema = z.object({
  classroomName: z
    .string()
    .min(3, 'Classroom name must be at least 3 characters'),
  classroomCode: z
    .string()
    .min(4, 'Classroom code must be at least 4 characters'),
});

export function Step1ClassroomDetails({
  formData,
  onComplete,
  onNext,
  setClassroomId,
  isLoading,
  setIsLoading,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroomName: formData.classroomName || '',
      classroomCode: formData.classroomCode || '',
    },
  });

  const handleGenerateCode = async () => {
    try {
      const { data, error } = await generateClassroomCode();
      if (error) {
        toast.error(error);
        return;
      }
      form.setValue('classroomCode', data);
      toast.success('Classroom code generated!');
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error('Failed to generate code');
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { data, error } = await createClassroom(values);

      if (error) {
        toast.error(error);
        return;
      }

      setClassroomId(data.classroom.id);
      onComplete({
        classroomName: values.classroomName,
        classroomCode: values.classroomCode,
      });
      toast.success('Classroom created successfully!');
      onNext();
    } catch (error) {
      console.error('Error creating classroom:', error);
      toast.error('Failed to create classroom');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  disabled={isLoading}
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
                    disabled={isLoading}
                    className="h-12 font-mono"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCode}
                  disabled={isLoading}
                  className="h-12"
                >
                  Generate
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Students will use this code to join your classroom
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

