'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Video, Play, Clock, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDuration, formatDate } from '@/shared/utils/formatters';

export function TopicVideoCard({ video, isReadOnly = false }) {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const handleVideoClick = () => {
    if (video) {
      setIsVideoDialogOpen(true);
    }
  };

  return (
    <>
      <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4 px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-50">
              <Video className="h-4 w-4 text-red-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Video Lecture
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {video ? (
            <div className="space-y-3">
              <div
                className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                onClick={handleVideoClick}
              >
                {video.thumbnailUrl ? (
                  <>
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title || 'Video thumbnail'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    {video.duration > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2">
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatDate(video.createdAt)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVideoClick}
                    className="h-7 text-xs"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Video className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs">No video available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Player Dialog */}
      {video && (
        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
          <DialogContent className="max-w-6xl w-full p-0 gap-0 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6 border-b border-slate-200">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold text-slate-900 mb-2 pr-8">
                  {video.title}
                </DialogTitle>
                {video.description && (
                  <DialogDescription className="text-base text-slate-600 mt-1">
                    {video.description}
                  </DialogDescription>
                )}
              </DialogHeader>
            </div>

            <div className="bg-white">
              <div className="relative bg-black">
                <video
                  controls
                  className="w-full h-auto max-h-[70vh]"
                  src={video.url}
                  preload="metadata"
                  controlsList="nodownload"
                  style={{ aspectRatio: '16/9' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {video.chapter && (
                      <Badge
                        variant="outline"
                        className="font-medium px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200"
                      >
                        {video.chapter}
                      </Badge>
                    )}
                    {video.topic && (
                      <Badge
                        variant="outline"
                        className="font-medium px-3 py-1 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {video.topic}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    {video.duration > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                    )}
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100">
                      <span className="font-medium">
                        {formatDate(video.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => {
                      window.open(video.url, '_blank');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = video.url;
                      link.download = `${video.title}.mp4`;
                      link.click();
                    }}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

