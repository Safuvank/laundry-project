"use client";

import { ChangeEvent, useEffect, useState } from "react";

import type { CustomerProfile } from "../types/profile.types";
import { useUpdateProfileImage } from "../hooks/useUploadProfileImage";

interface ProfileImageUploadProps {
  profile: CustomerProfile;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function ProfileImageUpload({
  profile,
}: ProfileImageUploadProps) {
  const updateProfileImage = useUpdateProfileImage();

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.profileImage,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(profile.profileImage);
  }, [profile.profileImage]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setError(null);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        setError("Unable to process the selected image.");
        return;
      }

      updateProfileImage.mutate(
        {
          profileImage: result,
        },
        {
          onSuccess: () => {
            setSelectedFile(null);
          },
          onError: (mutationError) => {
            setError(
              mutationError instanceof Error
                ? mutationError.message
                : "Failed to update profile image.",
            );
          },
        },
      );
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    setPreviewUrl(profile.profileImage);
  };

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(
    0,
  )}`.toUpperCase();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Profile Picture
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Upload a profile picture to personalize your FreshFold account.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Image Preview */}
        <div className="flex shrink-0 justify-center sm:justify-start">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-500">
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="min-w-0 flex-1">
          <label
            htmlFor="profile-image"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Choose Image
          </label>

          <input
            id="profile-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="sr-only"
          />

          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG, or WebP. Maximum file size: 5 MB.
          </p>

          {selectedFile && (
            <p className="mt-2 truncate text-sm text-gray-700">
              Selected:{" "}
              <span className="font-medium">
                {selectedFile.name}
              </span>
            </p>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {selectedFile && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleUpload}
                disabled={updateProfileImage.isPending}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateProfileImage.isPending
                  ? "Uploading..."
                  : "Save Photo"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={updateProfileImage.isPending}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {updateProfileImage.isSuccess && !selectedFile && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Profile picture updated successfully.
        </div>
      )}
    </div>
  );
}
