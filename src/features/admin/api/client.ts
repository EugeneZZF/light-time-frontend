"use client";

export type AdminRequestOptions = {
  body?: unknown;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
};

export type AdminUploadResponse = {
  id: string;
  mimeType: string;
  originalName: string;
  size: number;
  url: string;
};

type ErrorResponse = {
  message?: string;
};

export async function adminRequest<T>(
  path: string,
  options: AdminRequestOptions = {},
): Promise<T> {
  const response = await fetch(`/api/admin/proxy/${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | ErrorResponse) : null;

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Request failed.";

    throw new Error(message);
  }

  return data as T;
}

export async function adminUploadFile(file: File): Promise<AdminUploadResponse> {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/admin/proxy/files/upload", {
    method: "POST",
    body: formData,
  });

  const text = await response.text();
  const data = text
    ? (JSON.parse(text) as AdminUploadResponse | ErrorResponse)
    : null;

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "Upload failed.";

    throw new Error(message);
  }

  if (!data || typeof data !== "object" || !("url" in data)) {
    throw new Error("Upload succeeded but returned invalid payload.");
  }

  return data as AdminUploadResponse;
}
