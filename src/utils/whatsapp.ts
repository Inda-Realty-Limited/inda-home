interface OpenWhatsAppOptions {
  phoneNumber?: string | null;
  message?: string;
}

interface BuildBuyerWhatsAppMessageOptions {
  buyerName?: string | null;
  propertyName?: string | null;
  propertyLocation?: string | null;
  senderName?: string | null;
}

function normalizePhoneNumber(phoneNumber?: string | null): string | null {
  if (!phoneNumber) {
    return null;
  }

  const trimmed = phoneNumber.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");
  return digitsOnly || null;
}

export function buildWhatsAppUrl({
  phoneNumber,
  message,
}: OpenWhatsAppOptions): string | null {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  if (!normalizedPhone) {
    return null;
  }

  const baseUrl = `https://wa.me/${normalizedPhone.replace(/^\+/, "")}`;
  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp({
  phoneNumber,
  message,
}: OpenWhatsAppOptions): boolean {
  const url = buildWhatsAppUrl({ phoneNumber, message });
  if (!url || typeof window === "undefined") {
    return false;
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

export function buildBuyerWhatsAppMessage({
  buyerName,
  propertyName,
  propertyLocation,
  senderName,
}: BuildBuyerWhatsAppMessageOptions): string {
  const greetingName = buyerName?.trim() || "there";
  const propertyLine = propertyName?.trim()
    ? ` regarding ${propertyName.trim()}`
    : "";
  const locationLine = propertyLocation?.trim()
    ? ` in ${propertyLocation.trim()}`
    : "";
  const senderLine = senderName?.trim()
    ? ` This is ${senderName.trim()} from Inda.`
    : " This is the Inda team.";

  return `Hi ${greetingName}, I'm reaching out${propertyLine}${locationLine}.${senderLine}.`;
}
