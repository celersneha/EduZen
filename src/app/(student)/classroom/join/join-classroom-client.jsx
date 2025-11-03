'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle, GraduationCap } from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { joinClassroom } from '@/actions/join-classroom';

const formSchema = z.object({
  classroomCode: z.string().min(1, 'Classroom code is required'),
});

export function JoinClassroomClient({ initialCode }) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classroomCode: initialCode || '',
    },
  });

  const onSubmit = async (values) => {
    setIsJoining(true);
    try {
      const { data, error } = await joinClassroom(values.classroomCode.trim());

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Successfully joined classroom!');
      router.push('/classroom/list');
    } catch (error) {
      console.error('Error joining classroom:', error);
      toast.error('Failed to join classroom');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Join a Classroom</CardTitle>
            <CardDescription>
              Enter the classroom code provided by your teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="classroomCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter classroom code"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          disabled={isJoining}
                          className="h-12 text-center font-mono text-lg"
                          autoFocus
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        Ask your teacher for the classroom code or check your
                        email for an invitation link
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isJoining}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Join Classroom
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {initialCode && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  You were invited to join a classroom! The code has been
                  pre-filled. Click "Join Classroom" to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

