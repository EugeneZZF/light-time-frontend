const SESSION_COOKIE_NAME = "admin_session";
const ACCESS_TOKEN_COOKIE_NAME = "admin_access_token";
const SESSION_MAX_AGE = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  issuedAt: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-admin-session-secret";
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function toBase64Url(value: string) {
  return bytesToBase64Url(encoder.encode(value));
}

function fromBase64Url(value: string) {
  return decoder.decode(base64UrlToBytes(value));
}

async function signValue(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email,
    issuedAt: Date.now(),
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = await signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSession(sessionValue?: string | null) {
  if (!sessionValue) {
    return null;
  }

  const [encodedPayload, signature] = sessionValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await signValue(encodedPayload);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;

    if (!payload.email || !payload.issuedAt) {
      return null;
    }

    const expiresAt = payload.issuedAt + SESSION_MAX_AGE * 1000;

    if (Date.now() > expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export const adminSessionCookie = {
  maxAge: SESSION_MAX_AGE,
  name: SESSION_COOKIE_NAME,
};
