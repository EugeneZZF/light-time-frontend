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

function redirectToAdminLogin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_access_token");
    window.location.replace("/admin/login");
  }
}

function parseResponseBody<T>(text: string) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T | ErrorResponse;
  } catch {
    return null;
  }
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
}

export async function adminRequest<T>(
  path: string,
  options: AdminRequestOptions = {},
): Promise<T> {
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_access_token")
      : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = parseResponseBody<T>(text);

  if (!response.ok) {
    const message = extractErrorMessage(data, "Request failed.");

    // if (response.status === 401 || message.toLowerCase() === "unauthorized") {
    //   redirectToAdminLogin();
    // }

    throw new Error(message);
  }

  return data as T;
}

export async function adminUploadFile(
  file: File,
): Promise<AdminUploadResponse> {
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_access_token")
      : null;
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/files/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const text = await response.text();
  const data = parseResponseBody<AdminUploadResponse>(text);

  if (!response.ok) {
    const message = extractErrorMessage(data, "Upload failed.");

    // if (response.status === 401 || message.toLowerCase() === "unauthorized") {
    //   redirectToAdminLogin();
    // }

    throw new Error(message);
  }

  if (!data || typeof data !== "object" || !("url" in data)) {
    throw new Error("Upload succeeded but returned invalid payload.");
  }

  return data as AdminUploadResponse;
}
