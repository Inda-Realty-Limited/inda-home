import apiClient from "@/api";

const VISITOR_KEY = "inda_visitor_id";
const SESSION_KEY = "inda_analytics_session_id";
const TRACKED_PATH_PREFIX = "inda_analytics_tracked_";

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return generateId("visitor");
  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const next = generateId("visitor");
  window.localStorage.setItem(VISITOR_KEY, next);
  return next;
}

export function getOrCreateAnalyticsSessionId(): string {
  if (typeof window === "undefined") return generateId("session");
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = generateId("session");
  window.sessionStorage.setItem(SESSION_KEY, next);
  return next;
}

export function getAnalyticsSource(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.sessionStorage.getItem("inda_channel_source") ||
    window.localStorage.getItem("inda_ref") ||
    undefined
  );
}

export function getAnalyticsContext(listingId?: string) {
  return {
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateAnalyticsSessionId(),
    source: getAnalyticsSource(),
    listingId,
  };
}

export async function trackWebsiteVisit(params: { path: string; listingId?: string }) {
  if (typeof window === "undefined") return;

  const sessionId = getOrCreateAnalyticsSessionId();
  const trackingKey = `${TRACKED_PATH_PREFIX}${sessionId}:${params.path}`;
  if (window.sessionStorage.getItem(trackingKey)) {
    return;
  }

  window.sessionStorage.setItem(trackingKey, "1");

  try {
    await apiClient.post("/analytics/events", {
      eventType: "WEBSITE_VISIT",
      visitorId: getOrCreateVisitorId(),
      sessionId,
      listingId: params.listingId,
      path: params.path,
      source: getAnalyticsSource(),
      metadata: {
        pathname: params.path,
      },
    });
  } catch (error) {
    console.error("Failed to track website visit:", error);
  }
}
