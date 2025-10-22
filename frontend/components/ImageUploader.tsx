import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: File | null;
  onChange: (file: File) => void;
  error?: string;
  touched?: boolean;
  url?: string; // existing image URL for edit
}

export default function ImageUploader({ value, onChange, error, touched, url }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>("");

  // Set preview to existing URL on mount or when url changes
  useEffect(() => {
    if (url && !value) {
      setPreview(url);
    }
  }, [url, value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image" className="text-sm font-medium text-gray-700">
        Upload Image
      </label>

      <div
        className={cn(
          "relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition bg-gray-100 hover:bg-gray-200 cursor-pointer overflow-hidden",
          touched && error ? "border-red-500" : "border-gray-300"
        )}
        onClick={() => document.getElementById("imageUploadInput")?.click()}
      >
        <input
          id="imageUploadInput"
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {!preview ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5v-9m0 0l3 3m-3-3l-3 3m9 3v3.75A2.25 2.25 0 0115.75 18H8.25A2.25 2.25 0 016 15.75V12"
              />
            </svg>
            <p className="text-sm">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (max 5MB)</p>
          </div>
        ) : (
          <img
            src={preview}
            alt="Uploaded preview"
            className="object-contain h-full max-h-full"
          />
        )}
      </div>

      {touched && error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
