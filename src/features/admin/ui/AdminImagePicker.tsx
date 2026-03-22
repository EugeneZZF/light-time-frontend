"use client";

import { cn } from "@/features/admin/lib/utils";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type AdminImagePickerProps = {
  className?: string;
  onChange: (value: string) => void;
  onPendingFilesChange: (files: File[]) => void;
  pendingFiles: File[];
  placeholder?: string;
  value: string;
};

type ImageLineItem = {
  sortOrder: number;
  url: string;
};

type PendingImageItem = {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
};

const uploadBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

function parseImageValue(value: string): ImageLineItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, sortOrder] = line.split("|");

      return {
        url: (url ?? "").trim(),
        sortOrder: Number(sortOrder ?? index),
      };
    })
    .filter((item) => item.url);
}

function serializeImageValue(items: ImageLineItem[]) {
  return items
    .map((item, index) => `${item.url}|${Number.isFinite(item.sortOrder) ? item.sortOrder : index}`)
    .join("\n");
}

function resolveImageUrl(url: string) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return uploadBaseUrl ? `${uploadBaseUrl}${url}` : url;
}

export default function AdminImagePicker({
  className,
  onChange,
  onPendingFilesChange,
  pendingFiles,
  placeholder = "/uploads/item.webp|0",
  value,
}: AdminImagePickerProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const images = useMemo(() => parseImageValue(value), [value]);
  const pendingImages = useMemo(
    (): PendingImageItem[] =>
      pendingFiles.map((file, index) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
      })),
    [pendingFiles],
  );

  useEffect(() => {
    return () => {
      pendingImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [pendingImages]);

  async function appendFiles(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!files.length) {
      setError("Можно загружать только изображения.");
      return;
    }

    setError("");
    onPendingFilesChange([...pendingFiles, ...files]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeImage(indexToRemove: number) {
    const nextItems = images
      .filter((_, index) => index !== indexToRemove)
      .map((item, index) => ({
        ...item,
        sortOrder: index,
      }));

    onChange(serializeImageValue(nextItems));
  }

  function removePendingFile(indexToRemove: number) {
    onPendingFilesChange(
      pendingFiles.filter((_, index) => index !== indexToRemove),
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          void appendFiles(event.target.files);
        }}
      />

      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="group relative h-[112px] w-[112px] overflow-hidden rounded-[18px] border border-[#d6e1d8] bg-[#f5f8f5] shadow-[0_8px_20px_rgba(23,53,35,0.06)]"
          >
            <div
              className="h-full w-full bg-cover bg-center transition duration-200 group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${resolveImageUrl(image.url)})` }}
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#7e1420] text-[18px] leading-none text-white opacity-0 shadow-[0_6px_16px_rgba(126,20,32,0.28)] transition group-hover:opacity-100 hover:bg-[#991726]"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-2 rounded-full bg-[rgba(17,34,24,0.74)] px-2 py-1 text-[11px] font-bold text-white">
              {index + 1}
            </div>
          </div>
        ))}

        {pendingImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative h-[112px] w-[112px] overflow-hidden rounded-[18px] border border-[#cfe0d3] bg-[#eef4ef] shadow-[0_8px_20px_rgba(23,53,35,0.06)]"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image.previewUrl})` }}
            />
            <button
              type="button"
              aria-label="Remove pending image"
              onClick={() => removePendingFile(index)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#7e1420] text-[18px] leading-none text-white opacity-0 shadow-[0_6px_16px_rgba(126,20,32,0.28)] transition hover:bg-[#991726] group-hover:opacity-100"
            >
              ×
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-[rgba(22,47,31,0.68)] px-2 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              Waiting Upload
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            const relatedTarget = event.relatedTarget as Node | null;

            if (!event.currentTarget.contains(relatedTarget)) {
              setIsDragActive(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragActive(false);
            void appendFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex h-[112px] w-[112px] flex-col items-center justify-center rounded-[18px] border-2 border-dashed bg-white px-3 text-center transition",
            isDragActive
              ? "border-[#2a7a45] bg-[#f1f8f3] text-[#1c5f33]"
              : "border-[#c8d7cb] text-[#7b8f7f] hover:border-[#2a7a45] hover:bg-[#f7fbf8] hover:text-[#1c5f33]",
          )}
        >
          <span className="text-[44px] leading-none">+</span>
          <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em]">
            Add image
          </span>
        </button>
      </div>

      <p className="text-[12px] leading-[1.45] text-[#6a7d6e]">
        Нажмите на рамку или перетащите изображения сюда. Файлы загрузятся только после `Create` или `Update`.
      </p>

      <textarea
        value={value}
        readOnly
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        placeholder={placeholder}
      />

      {error ? (
        <div className="rounded-[14px] border border-[#f1c8c8] bg-[#fff4f4] px-4 py-3 text-[13px] text-[#a03535]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
