import { ProReportsService } from "@/api/pro-reports";

interface CreateTrackedReportLinkOptions {
  listingId?: string | null;
  leadId?: string;
  channel?: string;
  fallbackPath?: string;
}

function getOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "https://investinda.com";
}

export async function createTrackedReportLink({
  listingId,
  leadId,
  channel,
  fallbackPath,
}: CreateTrackedReportLinkOptions): Promise<string> {
  const origin = getOrigin();
  const fallbackUrl = fallbackPath ? `${origin}${fallbackPath}` : origin;

  if (!listingId) {
    return fallbackUrl;
  }

  try {
    const response = await ProReportsService.createShareForListing(listingId, {
      leadId,
      channel,
    });
    const sharePath = response?.data?.sharePath;

    if (sharePath) {
      return `${origin}${sharePath}`;
    }
  } catch {
    // Fall back to the plain listing/property URL when no tracked report is available.
  }

  return fallbackUrl;
}

export async function copyTrackedReportLink(
  options: CreateTrackedReportLinkOptions,
): Promise<string> {
  const link = await createTrackedReportLink(options);
  await navigator.clipboard.writeText(link);
  return link;
}
