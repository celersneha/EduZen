'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  BookOpen,
  FileText,
  Users,
  Video,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Step components
import { Step1ClassroomDetails } from '@/components/onboarding/classroom-onboarding/step1-classroom-details';
import { Step2SubjectDetails } from '@/components/onboarding/classroom-onboarding/step2-subject-details';
import { Step3UploadSyllabus } from '@/components/onboarding/classroom-onboarding/step3-upload-syllabus';
import { Step4InviteStudents } from '@/components/onboarding/classroom-onboarding/step4-invite-students';
import { Step5UploadLecture } from '@/components/onboarding/classroom-onboarding/step5-upload-lecture';

const STEPS = [
  {
    id: 1,
    title: 'Classroom Details',
    description: 'Enter basic classroom information',
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'Subject Details',
    description: 'Enter subject information',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Upload Syllabus',
    description: 'Upload and preview syllabus',
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Invite Students',
    description: 'Invite students to your classroom',
    icon: Users,
  },
  {
    id: 5,
    title: 'Upload Lecture',
    description: 'Upload your first video lecture',
    icon: Video,
  },
];

export function CreateClassroomClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Store data from each step
  const [formData, setFormData] = useState({
    // Step 1
    classroomName: '',
    classroomCode: '',
    // Step 2
    subjectName: '',
    subjectDescription: '',
    // Step 3
    syllabusData: null,
    // Step 4
    studentEmails: [],
    // Step 5
    videoData: null,
  });

  const [classroomId, setClassroomId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < STEPS.length) {
      handleNext();
    }
  };

  const handleFinish = () => {
    router.push(`/teacher/classroom/${classroomId}`);
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length) {
      handleNext();
    } else {
      handleFinish();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ClassroomDetails
            formData={formData}
            onComplete={handleStepComplete}
            onNext={handleNext}
            setClassroomId={setClassroomId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 2:
        return (
          <Step2SubjectDetails
            formData={formData}
            onComplete={handleStepComplete}
            onNext={handleNext}
            classroomId={classroomId}
            setSubjectId={setSubjectId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 3:
        return (
          <Step3UploadSyllabus
            formData={formData}
            onComplete={handleStepComplete}
            onNext={handleNext}
            classroomId={classroomId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 4:
        return (
          <Step4InviteStudents
            formData={formData}
            onComplete={handleStepComplete}
            onNext={handleNext}
            classroomId={classroomId}
            onSkip={handleSkip}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 5:
        return (
          <Step5UploadLecture
            formData={formData}
            onComplete={handleStepComplete}
            onFinish={handleFinish}
            classroomId={classroomId}
            onSkip={handleSkip}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/teacher/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Classroom
              </h1>
              <p className="text-gray-600 mt-1">
                Follow the steps below to set up your classroom
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all z-10 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isActive
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-medium ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const StepIcon = STEPS[currentStep - 1].icon;
                    return StepIcon ? <StepIcon className="h-5 w-5" /> : null;
                  })()}
                  {STEPS[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent>{renderStep()}</CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
