"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  File,
  Video,
  Image as ImageIcon,
  FileText,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/shared/utils/formatters";

/**
 * FileUpload Component
 * A comprehensive file upload component that handles multiple file types,
 * previews, thumbnails, and upload progress.
 *
 * @param {Object} props
 * @param {Function} props.onUpload - Callback function when upload completes: (file, metadata) => Promise<{data, error}>
 * @param {string[]} props.acceptedTypes - Array of accepted MIME types (e.g., ['video/*', 'image/*'])
 * @param {number} props.maxSize - Maximum file size in bytes (default: 500MB)
 * @param {boolean} props.multiple - Allow multiple file selection
 * @param {string} props.label - Label for the upload button
 * @param {boolean} props.showPreview - Show file preview (default: true)
 * @param {boolean} props.showMetadata - Show metadata fields (title, description)
 * @param {boolean} props.required - Is file required
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.existingFile - Existing file data to display
 * @param {Function} props.onRemove - Callback when file is removed
 * @param {Function} props.onView - Callback when existing file is clicked to view
 * @param {Function} props.onDelete - Callback when existing file is deleted: (file) => Promise<void>
 */
export function FileUpload({
  onUpload,
  acceptedTypes = ["*/*"],
  maxSize = 500 * 1024 * 1024, // 500MB default
  multiple = false,
  label = "Upload File",
  showPreview = true,
  showMetadata = true,
  required = false,
  className,
  existingFile = null,
  onRemove,
  onView,
  onDelete,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("video/")) return Video;
    if (fileType?.startsWith("image/")) return ImageIcon;
    if (
      fileType?.includes("pdf") ||
      fileType?.includes("document") ||
      fileType?.includes("text")
    )
      return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  };

  // Format video duration - using shared utility

  // Generate video thumbnail
  const generateVideoThumbnail = (videoFile) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.preload = "metadata";
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Seek to 1 second
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(thumbnailUrl);
      };

      video.onerror = () => {
        resolve(null);
      };

      video.src = URL.createObjectURL(videoFile);
    });
  };

  // Handle file selection
  const handleFileSelect = useCallback(
    async (selectedFile) => {
      setError(null);
      setUploaded(false);

      // Validate file type
      if (acceptedTypes.length > 0 && !acceptedTypes.includes("*/*")) {
        const isAccepted = acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            return selectedFile.type.startsWith(type.split("/")[0] + "/");
          }
          return selectedFile.type === type;
        });

        if (!isAccepted) {
          const errorMsg = `File type not accepted. Accepted types: ${acceptedTypes.join(", ")}`;
          setError(errorMsg);
          toast.error(errorMsg);
          return;
        }
      }

      // Validate file size
      if (selectedFile.size > maxSize) {
        const errorMsg = `File size exceeds ${formatFileSize(maxSize)} limit`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setFile(selectedFile);

      // Generate preview
      if (showPreview) {
        if (selectedFile.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreview(e.target.result);
            setThumbnail(e.target.result);
          };
          reader.readAsDataURL(selectedFile);
        } else if (selectedFile.type.startsWith("video/")) {
          const videoUrl = URL.createObjectURL(selectedFile);
          setPreview(videoUrl);
          // Generate thumbnail
          const thumb = await generateVideoThumbnail(selectedFile);
          setThumbnail(thumb);
        } else {
          setPreview(null);
          setThumbnail(null);
        }
      }

      // Auto-fill title if empty
      if (!metadata.title && selectedFile.name) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setMetadata((prev) => ({ ...prev, title: nameWithoutExt }));
      }
    },
    [acceptedTypes, maxSize, showPreview, metadata.title]
  );

  // Handle file input change
  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (showMetadata && !metadata.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress (in real implementation, this would come from the upload)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await onUpload(file, {
        ...metadata,
        thumbnail: thumbnail,
        fileSize: file.size,
        fileType: file.type,
        fileName: file.name,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        setUploading(false);
        return;
      }

      setUploaded(true);
      toast.success("File uploaded successfully!");
      
      // Reset after a short delay
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setThumbnail(null);
        setMetadata({ title: "", description: "" });
        setUploadProgress(0);
        setUploaded(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload file");
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Handle remove
  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setThumbnail(null);
    setMetadata({ title: "", description: "" });
    setError(null);
    setUploaded(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  // Display existing file if provided
  const displayFile = existingFile || file;
  // Get file type from existingFile.fileType or file.type
  const fileType = existingFile?.fileType 
    ? (existingFile.fileType === "pdf" ? "application/pdf" 
       : existingFile.fileType === "doc" ? "application/msword" 
       : existingFile.fileType === "text" ? "text/plain" 
       : existingFile.fileType)
    : (file?.type || displayFile?.type);
  const FileIcon = getFileIcon(fileType);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* File Input */}
      {!displayFile && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleInputChange}
            multiple={multiple}
            required={required}
            className="hidden"
          />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 mb-2">
            {label}
          </p>
          <p className="text-xs text-gray-500">
            Drag and drop or click to select
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      )}

      {/* File Preview */}
      {displayFile && (
        <div className="space-y-4">
          {/* Preview Card */}
          {showPreview && (preview || thumbnail || existingFile) && (
            <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              {fileType?.startsWith("video/") ? (
                <div
                  className={`relative aspect-video bg-black ${
                    existingFile && onView ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
                  }`}
                  onClick={() => {
                    if (existingFile && onView) {
                      onView(existingFile);
                    }
                  }}
                >
                  {thumbnail || existingFile?.thumbnailUrl ? (
                    <Image
                      src={thumbnail || existingFile.thumbnailUrl}
                      alt="Video thumbnail"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <video
                      src={preview || existingFile?.url}
                      className="w-full h-full object-contain"
                      controls={false}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  {existingFile?.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(existingFile.duration)}
                    </div>
                  )}
                </div>
              ) : fileType?.startsWith("image/") ? (
                <div className="relative w-full flex items-center justify-center" style={{ minHeight: '200px', maxHeight: '384px' }}>
                  <Image
                    src={preview || existingFile?.url || existingFile?.thumbnailUrl}
                    alt="Preview"
                    width={800}
                    height={600}
                    className="object-contain max-w-full max-h-96 w-auto h-auto"
                    unoptimized
                    style={{ maxHeight: '384px' }}
                  />
                </div>
              ) : (
                <div
                  className={`relative flex items-center justify-center p-12 bg-gray-100 ${
                    existingFile && onView ? "cursor-pointer hover:bg-gray-200 transition-colors" : ""
                  }`}
                  onClick={() => {
                    if (existingFile && onView) {
                      onView(existingFile);
                    }
                  }}
                >
                  <FileIcon className="h-16 w-16 text-gray-400" />
                  {existingFile && onView && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Remove/Delete button */}
              {!existingFile ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : existingFile && onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
                      setDeleting(true);
                      try {
                        await onDelete(existingFile);
                      } catch (error) {
                        console.error("Error deleting file:", error);
                        toast.error("Failed to delete file");
                      } finally {
                        setDeleting(false);
                      }
                    }
                  }}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              ) : null}
            </div>
          )}

          {/* File Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file?.name || existingFile?.fileName || "File"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file?.size || existingFile?.fileSize || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {existingFile && onView && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onView(existingFile)}
                    className="h-8 text-xs"
                    disabled={deleting}
                  >
                    {existingFile.fileType === "text" || !existingFile.url ? (
                      <Eye className="h-3 w-3 mr-1" />
                    ) : (
                      <Play className="h-3 w-3 mr-1" />
                    )}
                    View
                  </Button>
                )}
                {existingFile && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
                        setDeleting(true);
                        try {
                          await onDelete(existingFile);
                        } catch (error) {
                          console.error("Error deleting file:", error);
                          toast.error("Failed to delete file");
                        } finally {
                          setDeleting(false);
                        }
                      }
                    }}
                    className="h-8 text-xs"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3 mr-1" />
                    )}
                    Delete
                  </Button>
                )}
                {uploaded && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Metadata Fields */}
          {showMetadata && !existingFile && (
            <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
              <div>
                <Label htmlFor="file-title">Title *</Label>
                <Input
                  id="file-title"
                  placeholder="Enter file title"
                  value={metadata.title}
                  onChange={(e) =>
                    setMetadata((prev) => ({ ...prev, title: e.target.value }))
                  }
                  disabled={uploading || uploaded}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="file-description">Description</Label>
                <Textarea
                  id="file-description"
                  placeholder="Enter file description (optional)"
                  value={metadata.description}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={uploading || uploaded}
                  rows={3}
                  className="mt-2 resize-none"
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!existingFile && (
            <Button
              onClick={handleUpload}
              disabled={uploading || uploaded || !file || (showMetadata && !metadata.title.trim())}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : uploaded ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Uploaded
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

