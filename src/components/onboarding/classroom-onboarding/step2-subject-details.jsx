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
import { Textarea } from '@/components/ui/textarea';
import { createSubject } from '@/actions/create-subject';

const formSchema = z.object({
  subjectName: z.string().min(2, 'Subject name must be at least 2 characters'),
  subjectDescription: z.string().optional(),
});

export function Step2SubjectDetails({
  formData,
  onComplete,
  onNext,
  classroomId,
  setSubjectId,
  isLoading,
  setIsLoading,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectName: formData.subjectName || '',
      subjectDescription: formData.subjectDescription || '',
    },
  });

  const onSubmit = async (values) => {
    if (!classroomId) {
      toast.error('Classroom ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('subjectName', values.subjectName);
      formDataObj.append('subjectDescription', values.subjectDescription || '');
      formDataObj.append('classroomId', classroomId);

      const { data, error } = await createSubject(formDataObj);

      if (error) {
        toast.error(error);
        return;
      }

      setSubjectId(data.subject.id);
      onComplete({
        subjectName: values.subjectName,
        subjectDescription: values.subjectDescription,
      });
      toast.success('Subject created successfully!');
      onNext();
    } catch (error) {
      console.error('Error creating subject:', error);
      toast.error('Failed to create subject');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subjectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Mathematics, Physics, Computer Science"
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
          name="subjectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the subject..."
                  {...field}
                  disabled={isLoading}
                  rows={4}
                />
              </FormControl>
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

