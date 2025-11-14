'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Megaphone,
  Pin,
  BookOpen,
  FileText,
  Video,
  Play,
  Layers,
  Target,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TopicVideoCard } from '@/components/topic-video-card';
import { TopicNoteCard } from '@/components/topic-note-card';
import { formatDateTime } from '@/shared/utils/formatters';

export function StudentClassroomDetailClient({
  classroom,
  announcements = [],
  videoLectures = [],
  notes = [],
  syllabus,
}) {
  const router = useRouter();
  const [showTestSection, setShowTestSection] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  const handleChapterChange = (chapterName) => {
    setSelectedChapter(chapterName);
    setSelectedTopic('');
  };

  const getSelectedChapterTopics = () => {
    if (!selectedChapter || !syllabus?.chapters) return [];
    const chapter = syllabus.chapters.find(
      (ch) => ch.chapterName === selectedChapter
    );
    return chapter?.topics || [];
  };

  // Get video for a specific topic
  const getVideoForTopic = (chapterName, topicName) => {
    return videoLectures.find(
      (video) =>
        video.chapter === chapterName && video.topic === topicName
    );
  };

  // Get note for a specific topic
  const getNoteForTopic = (chapterName, topicName) => {
    return notes.find(
      (note) => note.chapter === chapterName && note.topic === topicName
    );
  };

  const handleStartTest = () => {
    if (!selectedChapter || !syllabus) {
      return;
    }

    const subjectID = syllabus._id?.toString() || syllabus.id || classroom.id;
    const params = new URLSearchParams({
      subjectID,
      classroomId: classroom.id,
      chapter: selectedChapter,
      difficulty: selectedDifficulty,
    });

    // Only add topic if one is selected
    if (selectedTopic) {
      params.set('topic', selectedTopic);
    }

    router.push(`/student/attempt-test?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/student/student-classroom/list">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Classrooms
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {classroom.classroomName}
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="font-mono text-sm">
              Code: {classroom.classroomCode}
            </Badge>
            {syllabus && (
              <Badge className="bg-green-500 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Syllabus Available
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Subject Header */}
          {syllabus && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
              <CardHeader className="p-8 pb-6">
                <CardTitle className="text-4xl font-bold mb-3 tracking-tight">
                  {syllabus.subjectName}
                </CardTitle>
                {syllabus.subjectDescription && (
                  <CardDescription className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
                    {syllabus.subjectDescription}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="px-8 pb-8 pt-0">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Chapters</p>
                      <p className="text-2xl font-bold">
                        {syllabus.chapters?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Topics</p>
                      <p className="text-2xl font-bold">
                        {syllabus.chapters?.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0) || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Videos</p>
                      <p className="text-2xl font-bold">{videoLectures.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Notes</p>
                      <p className="text-2xl font-bold">{notes.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Syllabus with Videos and Notes by Topic */}
          {syllabus && syllabus.chapters && syllabus.chapters.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-100">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Course Content
                  </h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Videos and notes organized by topics
                  </p>
                </div>
              </div>

              <Accordion type="multiple" className="w-full space-y-3">
                {syllabus.chapters.map((chapter, chapterIndex) => {
                  const chapterId = `chapter-${chapterIndex}`;
                  const topicCount = chapter.topics?.length || 0;

                  return (
                    <AccordionItem
                      key={chapterId}
                      value={chapterId}
                      className="border-0"
                    >
                      <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
                        <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                                {chapterIndex + 1}
                              </div>
                              <div className="text-left">
                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {chapter.chapterName}
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                  {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          {chapter.topics && chapter.topics.length > 0 ? (
                            <div className="space-y-4 mt-4">
                              {chapter.topics.map((topic, topicIndex) => {
                                const video = getVideoForTopic(
                                  chapter.chapterName,
                                  topic
                                );
                                const note = getNoteForTopic(
                                  chapter.chapterName,
                                  topic
                                );

                                const handleTopicTest = () => {
                                  if (!syllabus) return;
                                  const subjectID = syllabus._id?.toString() || syllabus.id || classroom.id;
                                  const params = new URLSearchParams({
                                    subjectID,
                                    classroomId: classroom.id,
                                    chapter: chapter.chapterName,
                                    topic: topic,
                                    difficulty: 'medium',
                                  });
                                  router.push(`/student/attempt-test?${params.toString()}`);
                                };

                                return (
                                  <div
                                    key={topicIndex}
                                    className="border border-slate-200/60 rounded-xl p-6 bg-gradient-to-br from-slate-50/50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-between gap-3 mb-6">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-semibold text-sm">
                                          {topicIndex + 1}
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900">
                                          {topic}
                                        </h4>
                                      </div>
                                      <Button
                                        onClick={handleTopicTest}
                                        size="sm"
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm"
                                      >
                                        <Brain className="h-4 w-4 mr-2" />
                                        Take Test
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <TopicVideoCard video={video} isReadOnly={true} />
                                      <TopicNoteCard note={note} isReadOnly={true} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-500">
                              <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                              <p className="text-sm font-medium">
                                No topics found in this chapter.
                              </p>
                            </div>
                          )}
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}

          {/* Take Tests Section */}
          {syllabus && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Take Tests
                    </CardTitle>
                    <CardDescription>
                      AI-generated practice tests based on your syllabus
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowTestSection(!showTestSection)}
                  >
                    {showTestSection ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Configure Test
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              {showTestSection && (
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                          <Layers className="mr-2 h-4 w-4" />
                          Select Chapter
                        </label>
                        <Select
                          value={selectedChapter}
                          onValueChange={handleChapterChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a chapter" />
                          </SelectTrigger>
                          <SelectContent>
                            {syllabus.chapters?.map((chapter, index) => (
                              <SelectItem key={index} value={chapter.chapterName}>
                                {chapter.chapterName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                          <Target className="mr-2 h-4 w-4" />
                          Select Topic (Optional)
                        </label>
                        <Select
                          value={selectedTopic}
                          onValueChange={setSelectedTopic}
                          disabled={!selectedChapter}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a topic (or leave blank for entire chapter)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Entire Chapter</SelectItem>
                            {getSelectedChapterTopics().map((topic, index) => (
                              <SelectItem key={index} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Leave blank to test the entire chapter, or select a specific topic
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Select Difficulty
                        </label>
                        <Select
                          value={selectedDifficulty}
                          onValueChange={setSelectedDifficulty}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleStartTest}
                        disabled={!selectedChapter}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Test
                      </Button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Test Preview</h3>
                      {selectedChapter ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Layers className="mr-2 h-4 w-4" />
                            <span className="font-medium">Chapter:</span>
                            <span className="ml-1">{selectedChapter}</span>
                          </div>
                          {selectedTopic ? (
                            <div className="flex items-center text-gray-600">
                              <Target className="mr-2 h-4 w-4" />
                              <span className="font-medium">Topic:</span>
                              <span className="ml-1">{selectedTopic}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-600">
                              <Target className="mr-2 h-4 w-4" />
                              <span className="font-medium">Scope:</span>
                              <span className="ml-1">Entire Chapter</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <FileText className="mr-2 h-4 w-4" />
                            <span className="font-medium">Difficulty:</span>
                            <span className="ml-1 capitalize">{selectedDifficulty}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="font-medium">Duration:</span>
                            <span className="ml-1">10 minutes</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Select a chapter to see test preview
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}


          {/* Announcements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="h-5 w-5 mr-2" />
                Announcements
              </CardTitle>
              <CardDescription>
                Important updates from your teacher
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Megaphone className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No announcements yet.</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border ${
                        announcement.isPinned
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {announcement.title}
                          </h3>
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(announcement.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Posted by {announcement.teacherName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
