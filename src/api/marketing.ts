/**
 * Marketing API client
 *
 * Frontend API calls — all routes are JWT-protected and agent-scoped.
 * See the backend architecture notes at the bottom of this file.
 */
import apiClient from './index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MarketingCredits {
  available: number;
  used: number;
  monthlyAllocation: number;
}

export interface MarketingStats {
  postsThisMonth: number;
  totalReach: number;
  engagementRate: number; // e.g. 12.4 (percent)
  leadsGenerated: number;
}

export interface PlatformStat {
  platform: string;
  posts: number;
  reach: number;
  engagement: string; // e.g. "14.2%"
  leads: number;
}

export interface PostStat {
  id: string;
  content: string;
  platform: string;
  date: string;
  reach: number;
  engagement: number;
  leads: number;
}

export interface AnalyticsData {
  keyMetrics: {
    totalReach: number;
    totalReachTrend: string;
    engagementRate: number;
    engagementTrend: string;
    leadsGenerated: number;
    leadsTrend: string;
    postsPublished: number;
    postsTrend: string;
  };
  platformStats: PlatformStat[];
  recentPosts: PostStat[];
}

export interface ContactList {
  id: string;
  name: string;
  count: number;
  description: string;
}

export interface CreateEmailCampaignPayload {
  templateId: string;
  recipientListIds: string[];
  customRecipients?: string[];
  subject: string;
  preheader: string;
  body: string;
  htmlBody?: string;
  scheduleDate?: string;
  scheduleTime?: string;
}

export interface GenerateEmailCampaignCopyPayload {
  templateId: string;
  recipientListIds?: string[];
  customRecipients?: string[];
}

export interface GeneratedEmailCampaignCopy {
  subject: string;
  preheader: string;
  body: string;
}

export interface SendTestEmailCampaignPayload {
  templateId: string;
  subject: string;
  preheader?: string;
  body: string;
  htmlBody?: string;
}

export interface CanvaAuthUrlResponse {
  url: string;
}

export interface CanvaStatus {
  connected: boolean;
  connectedAt: string | null;
  expiresAt: string | null;
}

export interface CanvaDesign {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  updatedAt: string;
  pageCount: number | null;
}

export interface ImportedCanvaEmail {
  templateName: string;
  subject: string;
  preheader: string;
  htmlBody: string;
}

export interface CreateAdCampaignPayload {
  platforms: string[];
  objective: string;
  budget: number;
  durationDays: number;
  startDate?: string;
  paymentMethod?: 'CREDITS' | 'BANK' | 'CARD';
  targeting: {
    locations?: string[];
    ageRanges?: string[];
    incomeLevel?: string[];
    interests?: string[];
  };
}

export interface CreateBookingPayload {
  serviceType: 'PHOTOGRAPHY' | 'VIDEOGRAPHY' | 'TOUR_3D';
  packageId: string;
  propertyAddress: string;
  propertyType: string;
  contactName: string;
  contactPhone: string;
  date: string;
  time: string;
  specialRequests?: string;
  paymentMethod: 'CREDITS' | 'BANK' | 'CARD';
}

export interface CreateContentPayload {
  platforms: string[];
  contentTypes: Record<string, string>;
  propertyId: string;
  templateId: string;
  caption: string;
  hashtags: string;
  brandingOptions: {
    showWatermark: boolean;
    showContactInfo: boolean;
    showCompanyName: boolean;
  };
  scheduleDate?: string;
  scheduleTime?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const MarketingService = {
  getCredits: (): Promise<MarketingCredits> =>
    apiClient.get('/marketing/credits').then(r => r.data?.data ?? r.data),

  getStats: (): Promise<MarketingStats> =>
    apiClient.get('/marketing/stats').then(r => r.data?.data ?? r.data),

  getAnalytics: (period = '30d'): Promise<AnalyticsData> =>
    apiClient.get('/marketing/analytics', { params: { period } }).then(r => r.data?.data ?? r.data),

  getContactLists: (): Promise<ContactList[]> =>
    apiClient.get('/marketing/contact-lists').then(r => r.data?.data ?? []),

  createEmailCampaign: (payload: CreateEmailCampaignPayload) =>
    apiClient.post('/marketing/email-campaigns', payload).then(r => r.data?.data ?? r.data),

  generateEmailCampaignCopy: (payload: GenerateEmailCampaignCopyPayload): Promise<GeneratedEmailCampaignCopy> =>
    apiClient.post('/marketing/email-campaigns/generate-copy', payload).then(r => r.data?.data ?? r.data),

  sendTestEmailCampaign: (payload: SendTestEmailCampaignPayload) =>
    apiClient.post('/marketing/email-campaigns/send-test', payload).then(r => r.data?.data ?? r.data),

  getCanvaAuthUrl: (params: { redirectUri: string }): Promise<CanvaAuthUrlResponse> =>
    apiClient.get('/marketing/canva/auth-url', { params }).then(r => r.data?.data ?? r.data),

  exchangeCanvaCode: (payload: { code: string; state: string; redirectUri: string }) =>
    apiClient.post('/marketing/canva/exchange', payload).then(r => r.data?.data ?? r.data),

  getCanvaStatus: (): Promise<CanvaStatus> =>
    apiClient.get('/marketing/canva/status').then(r => r.data?.data ?? r.data),

  disconnectCanva: () =>
    apiClient.delete('/marketing/canva/status').then(r => r.data?.data ?? r.data),

  listCanvaDesigns: (query?: string): Promise<CanvaDesign[]> =>
    apiClient.get('/marketing/canva/designs', { params: query ? { query } : undefined }).then(r => r.data?.data ?? []),

  importCanvaEmail: (designId: string): Promise<ImportedCanvaEmail> =>
    apiClient.post('/marketing/canva/import-email', { designId }).then(r => r.data?.data ?? r.data),

  createAdCampaign: (payload: CreateAdCampaignPayload) =>
    apiClient.post('/marketing/ad-campaigns', payload).then(r => r.data?.data ?? r.data),

  createBooking: (payload: CreateBookingPayload) =>
    apiClient.post('/marketing/bookings', payload).then(r => r.data?.data ?? r.data),

  createContent: (payload: CreateContentPayload) =>
    apiClient.post('/marketing/content', payload).then(r => r.data?.data ?? r.data),
};

/*
 * ═════════════════════════════════════════════════════════════════════════════
 * BACKEND ARCHITECTURE  —  src/modules/marketing/
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. EMAIL CAMPAIGNS  —  Resend + BullMQ + Redis
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Flow:
 *   POST /marketing/email-campaigns
 *     → validate payload
 *     → resolve recipients: expand recipientListIds into actual contact emails
 *        (query leads/contacts table filtered by list segment)
 *     → save EmailCampaign { id, agentId, subject, preheader, body, templateId,
 *                            recipientCount, status='queued', scheduledAt, sentAt }
 *     → enqueue BullMQ job on the 'email-campaigns' queue:
 *         if scheduleDate → job.delay = ms until scheduledAt  (delayed job)
 *         else            → job.delay = 0                     (send immediately)
 *     → return { id, status: 'queued' | 'scheduled' }
 *
 * BullMQ worker  (src/modules/marketing/workers/email-campaign.worker.ts):
 *   - processes 'email-campaigns' queue
 *   - fetches EmailCampaign + recipient list from DB
 *   - chunks recipients into batches (Resend allows up to 100/request)
 *   - calls Resend batch send API for each chunk
 *   - updates EmailCampaign.status = 'sent', sentAt = now()
 *   - on failure: BullMQ handles retries (exponential backoff, max 3 attempts)
 *                 on exhausted retries → status = 'failed', log error
 *
 * Contact list segments (GET /marketing/contacts/lists):
 *   Derived dynamically from the leads table:
 *     - "All Contacts"       → all leads for agent
 *     - "Active Buyers"      → leads where status = 'active' | 'inquiry'
 *     - "Potential Sellers"  → leads where type = 'seller'
 *     - "Investors"          → leads where type = 'investor'
 *     - "Past Clients"       → leads where status = 'closed'
 *
 * Prisma schema additions:
 *   model EmailCampaign {
 *     id             String    @id @default(uuid())
 *     agentId        String
 *     agent          User      @relation(...)
 *     templateId     String
 *     subject        String
 *     preheader      String?
 *     body           String    @db.Text
 *     recipientCount Int
 *     status         EmailCampaignStatus @default(QUEUED)
 *     scheduledAt    DateTime?
 *     sentAt         DateTime?
 *     createdAt      DateTime  @default(now())
 *     @@map("email_campaigns")
 *   }
 *   enum EmailCampaignStatus { QUEUED SCHEDULED SENT FAILED }
 *
 * Infra:
 *   - Redis: needed by BullMQ for job queues (use Upstash Redis or self-hosted)
 *   - Resend: email delivery provider (@resend/node SDK)
 *   - BullMQ: @nestjs/bullmq + bullmq packages
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 2. DIGITAL ADS  —  Save & Hand Off to External Agency
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Flow:
 *   POST /marketing/ad-campaigns
 *     → save AdCampaign { id, agentId, platforms (json), objective, budget,
 *                         durationDays, startDate, targeting (json),
 *                         status='PENDING_REVIEW' }
 *     → send internal notification (email/Slack) to the agency team with
 *       the campaign brief  (use same Resend + BullMQ infra, low priority queue)
 *     → return { id, status: 'pending_review' }
 *
 * Status lifecycle (updated manually by admin or via an admin endpoint):
 *   PENDING_REVIEW → ACTIVE → PAUSED | COMPLETED
 *
 * No external ad platform API integration needed on our side.
 *
 * Prisma schema:
 *   model AdCampaign {
 *     id           String          @id @default(uuid())
 *     agentId      String
 *     agent        User            @relation(...)
 *     platforms    Json            // string[]
 *     objective    String
 *     budget       Decimal
 *     durationDays Int
 *     startDate    DateTime?
 *     targeting    Json            // { locations, ageRanges, incomeLevel, interests }
 *     status       AdCampaignStatus @default(PENDING_REVIEW)
 *     createdAt    DateTime        @default(now())
 *     updatedAt    DateTime        @updatedAt
 *     @@map("ad_campaigns")
 *   }
 *   enum AdCampaignStatus { PENDING_REVIEW ACTIVE PAUSED COMPLETED CANCELLED }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 3. SERVICE BOOKINGS  —  Photography / Videography / 3D Tour
 *    All handled by external agencies — we just record and hand off
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Flow:
 *   POST /marketing/bookings
 *     → save ServiceBooking { id, agentId, serviceType, packageId,
 *                             propertyAddress, propertyType, contactName,
 *                             contactPhone, scheduledAt, specialRequests,
 *                             paymentMethod, status='PENDING',
 *                             creditsDeducted: bool }
 *     → if paymentMethod === 'credits':
 *         deduct credits from MarketingCredit for current billing month
 *         (atomic: check balance first, throw if insufficient)
 *     → send internal notification to relevant agency team
 *     → send confirmation email to agent via Resend
 *     → return { id, status: 'pending' }
 *
 * Status lifecycle (updated by admin):
 *   PENDING → CONFIRMED → COMPLETED | CANCELLED
 *
 * Prisma schema:
 *   model ServiceBooking {
 *     id              String         @id @default(uuid())
 *     agentId         String
 *     agent           User           @relation(...)
 *     serviceType     ServiceType    // PHOTOGRAPHY | VIDEOGRAPHY | TOUR_3D
 *     packageId       String
 *     propertyAddress String
 *     propertyType    String
 *     contactName     String
 *     contactPhone    String
 *     scheduledAt     DateTime
 *     specialRequests String?
 *     paymentMethod   PaymentMethod  // CREDITS | BANK | CARD
 *     creditsDeducted Boolean        @default(false)
 *     status          BookingStatus  @default(PENDING)
 *     createdAt       DateTime       @default(now())
 *     updatedAt       DateTime       @updatedAt
 *     @@map("service_bookings")
 *   }
 *   enum ServiceType   { PHOTOGRAPHY VIDEOGRAPHY TOUR_3D }
 *   enum PaymentMethod { CREDITS BANK CARD }
 *   enum BookingStatus { PENDING CONFIRMED COMPLETED CANCELLED }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 4. MARKETING CREDITS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * GET /marketing/credits
 *   → find or create MarketingCredit for agentId + current month (YYYY-MM)
 *   → return { available: allocation - used, used, monthlyAllocation: allocation }
 *
 * Credit deduction is done atomically inside the bookings service:
 *   - query current balance
 *   - if balance < required credits → throw BadRequestException
 *   - increment used in same transaction as creating the booking
 *
 * Monthly reset: a scheduled NestJS Cron job runs on the 1st of each month
 *   and inserts a new MarketingCredit row for each active agent.
 *
 * Prisma schema:
 *   model MarketingCredit {
 *     id          String   @id @default(uuid())
 *     agentId     String
 *     agent       User     @relation(...)
 *     monthYear   String   // "2026-04"
 *     allocation  Int      @default(300)
 *     used        Int      @default(0)
 *     createdAt   DateTime @default(now())
 *     @@unique([agentId, monthYear])
 *     @@map("marketing_credits")
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 5. ANALYTICS & PERFORMANCE REPORTS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * We track everything ourselves from our own records.
 * No external social media API integration yet (future work).
 *
 * GET /marketing/stats   (quick card numbers)
 *   Aggregates from MarketingPost for current month:
 *     postsThisMonth  = COUNT posts WHERE publishedAt in current month
 *     totalReach      = SUM posts.reach
 *     engagementRate  = AVG posts.engagementRate
 *     leadsGenerated  = SUM posts.leads
 *
 * GET /marketing/analytics?period=7d|30d|90d|1y
 *   keyMetrics: same as /stats but for the given period + trend vs prior period
 *   platformStats: GROUP BY platform → { posts, reach, engagement, leads }
 *   recentPosts: latest 10 MarketingPost records with their tracked metrics
 *
 * How reach/engagement/leads gets onto a MarketingPost:
 *   - When a post is created (POST /marketing/content) → reach=0, engagement=0, leads=0
 *   - Future: a daily sync job calls social platform APIs (Meta Graph, TikTok,
 *     LinkedIn) to pull updated metrics and writes them back to MarketingPost
 *   - leads: incremented when a lead/inquiry is traced back to a post
 *     (e.g. lead source = 'instagram_post', postId stored on the lead record)
 *
 * Prisma schema:
 *   model MarketingPost {
 *     id              String      @id @default(uuid())
 *     agentId         String
 *     agent           User        @relation(...)
 *     platforms       Json        // string[]
 *     contentTypes    Json        // { instagram: 'reel', ... }
 *     propertyId      String?
 *     templateId      String
 *     caption         String      @db.Text
 *     hashtags        String?
 *     brandingOptions Json
 *     status          PostStatus  @default(DRAFT)
 *     scheduledAt     DateTime?
 *     publishedAt     DateTime?
 *     // tracked metrics (updated by sync job or manually)
 *     reach           Int         @default(0)
 *     engagement      Int         @default(0)
 *     engagementRate  Decimal     @default(0)
 *     leads           Int         @default(0)
 *     createdAt       DateTime    @default(now())
 *     updatedAt       DateTime    @updatedAt
 *     @@index([agentId])
 *     @@index([status])
 *     @@map("marketing_posts")
 *   }
 *   enum PostStatus { DRAFT SCHEDULED PUBLISHED FAILED }
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 6. SOCIAL MEDIA DIRECT POSTING  —  Future Work
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Not implemented yet. When ready:
 *   - Meta (Instagram/Facebook): Meta Graph API with long-lived page tokens
 *     POST /me/media → POST /me/media/publish  (for Instagram)
 *     POST /{page-id}/feed                     (for Facebook)
 *   - TikTok: TikTok for Developers Content Posting API
 *   - LinkedIn: LinkedIn Marketing API
 *   - Twitter/X: Twitter API v2  POST /2/tweets
 *
 * The BullMQ worker for MarketingPost (status=SCHEDULED) will call the
 * relevant platform API at the scheduled time, then update:
 *   status = PUBLISHED, publishedAt = now(), platformPostId = returned id
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 7. NestJS MODULE STRUCTURE  —  src/modules/marketing/
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   marketing/
 *     marketing.module.ts          ← registers BullMQ queues, imports PrismaModule
 *     marketing.controller.ts      ← all HTTP routes
 *     marketing.service.ts         ← business logic
 *     dto/
 *       create-email-campaign.dto.ts
 *       create-ad-campaign.dto.ts
 *       create-booking.dto.ts
 *       create-content.dto.ts
 *     workers/
 *       email-campaign.worker.ts   ← BullMQ processor for 'email-campaigns' queue
 *     queues/
 *       email-campaign.queue.ts    ← queue name constant + job type definitions
 *
 * Dependencies to install:
 *   @nestjs/bullmq  bullmq  ioredis   (queue)
 *   resend                            (email delivery)
 *   @nestjs/schedule                  (cron for monthly credit reset)
 *
 * ═════════════════════════════════════════════════════════════════════════════
 */
