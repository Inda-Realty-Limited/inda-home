const REPORT_SESSION_KEY_PREFIX = "inda_report_session_";

function generateSessionId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateReportSessionId(reportId: string): string {
  if (typeof window === "undefined") {
    return generateSessionId();
  }

  const key = `${REPORT_SESSION_KEY_PREFIX}${reportId}`;
  const existing = window.sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const sessionId = generateSessionId();
  window.sessionStorage.setItem(key, sessionId);
  return sessionId;
}
