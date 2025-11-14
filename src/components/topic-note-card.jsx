'use client';

import { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/shared/utils/formatters';

export function TopicNoteCard({ note, isReadOnly = false }) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const handleNoteClick = () => {
    if (note) {
      setIsNoteDialogOpen(true);
    }
  };

  return (
    <>
      <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4 px-5 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Notes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {note ? (
            <div className="space-y-3">
              <div
                className="p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={handleNoteClick}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2">
                      {note.title}
                    </h4>
                    {note.content && (
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                        {note.content}
                      </p>
                    )}
                    {note.fileName && (
                      <p className="text-xs text-slate-500 mb-2">
                        {note.fileName}
                      </p>
                    )}
                  </div>
                  {note.fileUrl && (
                    <Download className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>{formatDate(note.createdAt)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNoteClick();
                    }}
                    className="h-6 text-xs"
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <p className="text-xs">No notes available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note Viewer Dialog */}
      {note && (
        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {note.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {note.fileUrl ? (
                <div className="space-y-4">
                  {note.fileType === 'pdf' || note.fileUrl.endsWith('.pdf') ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <div className="w-full h-[600px] relative">
                        <object
                          data={`${note.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                          type="application/pdf"
                          className="w-full h-full"
                          style={{ minHeight: '600px' }}
                        >
                          <iframe
                            src={`${note.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                            className="w-full h-full border-0"
                            title={note.title}
                            style={{ minHeight: '600px' }}
                          >
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                              <FileText className="h-16 w-16 text-slate-400 mb-4" />
                              <p className="text-sm text-slate-600 mb-4">
                                Your browser doesn&apos;t support PDF preview.
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    window.open(note.fileUrl, '_blank');
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open PDF in New Tab
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = note.fileUrl;
                                    link.download = note.fileName || note.title;
                                    link.click();
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                              </div>
                            </div>
                          </iframe>
                        </object>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                      <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-sm text-slate-600 mb-4">
                        Preview not available for{' '}
                        {note.fileType?.toUpperCase() || 'DOCUMENT'} files
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.open(note.fileUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = note.fileUrl;
                            link.download = note.fileName || note.title;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                  {note.content && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-sm mb-2 text-slate-900">
                        Additional Notes:
                      </h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  )}
                </div>
              ) : note.content ? (
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>No content available for this note.</p>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  {note.chapter && (
                    <Badge variant="outline" className="font-medium">
                      {note.chapter}
                    </Badge>
                  )}
                  {note.topic && (
                    <Badge variant="outline" className="font-medium">
                      {note.topic}
                    </Badge>
                  )}
                </div>
                <span>{formatDate(note.createdAt)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

