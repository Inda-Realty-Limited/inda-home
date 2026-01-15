import { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Flame, Phone, Mail, MoreHorizontal, MessageCircle, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type LeadStatus = "new" | "hot" | "offer_made" | "visit_scheduled";
type LeadPriority = "low" | "medium" | "high";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyTitle: string;
  propertyLocation: string;
  timeAgo: string;
  status: LeadStatus;
  priority: LeadPriority;
  isHot: boolean;
  badge?: string;
  questionsCount?: number;
  lastQuestion?: string;
  offerAmount?: string;
  offerPercent?: string;
  channelLabel: string;
  viewsLabel: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Chioma Adeleke",
    phone: "+234 803 456 7890",
    email: "chioma.adeleke@gmail.com",
    propertyTitle: "4 Bedroom Detached Duplex",
    propertyLocation: "Lekki Phase 1, Lagos",
    timeAgo: "2h ago",
    status: "offer_made",
    priority: "high",
    isHot: true,
    badge: "Offer Made",
    questionsCount: 2,
    lastQuestion: 'What are the annual maintenance fees?',
    offerAmount: "₦76,000,000",
    offerPercent: "93% of asking",
    channelLabel: "WhatsApp",
    viewsLabel: "8 views",
  },
  {
    id: "lead-2",
    name: "Tunde Okafor",
    phone: "+234 807 123 4567",
    email: "tunde.okafor@example.com",
    propertyTitle: "3 Bedroom Flat",
    propertyLocation: "Ikeja GRA, Lagos",
    timeAgo: "18h ago",
    status: "visit_scheduled",
    priority: "medium",
    isHot: true,
    badge: "Visit Scheduled",
    questionsCount: 1,
    lastQuestion: "Can I pay in installments over 12 months?",
    channelLabel: "WhatsApp",
    viewsLabel: "12 views",
  },
  {
    id: "lead-3",
    name: "Abiola Johnson",
    phone: "+234 802 987 6543",
    email: "abiola.johnson@example.com",
    propertyTitle: "2 Bedroom Apartment",
    propertyLocation: "Yaba, Lagos",
    timeAgo: "1d ago",
    status: "new",
    priority: "low",
    isHot: false,
    questionsCount: 0,
    channelLabel: "Portfolio Page",
    viewsLabel: "3 views",
  },
];

export default function LeadsInboxPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | LeadPriority>("all");
  const [query, setQuery] = useState("");

  const totalLeads = MOCK_LEADS.length;
  const hotLeads = MOCK_LEADS.filter((lead) => lead.isHot).length;
  const offersMade = MOCK_LEADS.filter((lead) => lead.status === "offer_made").length;

  const filteredLeads = useMemo(() => {
    return MOCK_LEADS.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }
      if (priorityFilter !== "all" && lead.priority !== priorityFilter) {
        return false;
      }
      if (!query.trim()) {
        return true;
      }
      const q = query.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.propertyTitle.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q)
      );
    });
  }, [statusFilter, priorityFilter, query]);

  return (
    <ProtectedRoute>
      <DashboardLayout title="Leads Inbox">
        <div className="max-w-6xl mx-auto pb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-inda-dark">Leads Inbox</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and follow up with your property leads from every channel
              </p>
            </div>
            {user && (
              <div className="text-xs text-gray-500 font-medium">
                Signed in as{" "}
                <span className="text-gray-900 font-semibold">
                  {user.firstName || user.name || user.email}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col justify-between">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Leads
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  All time
                </div>
              </div>
            </div>

            <div className="bg-[#FFF6F0] rounded-2xl border border-orange-100 shadow-sm px-6 py-5 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 uppercase tracking-wider">
                <Flame className="w-3 h-3" />
                Hot Leads
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">{hotLeads}</div>
                <div className="text-[11px] text-orange-500">
                  Likely to convert soon
                </div>
              </div>
            </div>

            <div className="bg-[#FFF8F2] rounded-2xl border border-amber-100 shadow-sm px-6 py-5 flex flex-col justify-between">
              <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Offers Made
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">{offersMade}</div>
                <div className="text-[11px] text-amber-500">
                  With active monetary offers
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search leads by name, property, or phone..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#4EA8A1]/40 focus:border-[#4EA8A1]"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-[#4EA8A1]/40 focus:border-[#4EA8A1] min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="hot">Hot</option>
                <option value="offer_made">Offer Made</option>
                <option value="visit_scheduled">Visit Scheduled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-[#4EA8A1]/40 focus:border-[#4EA8A1] min-w-[140px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="bg-white border border-gray-200 border-dashed rounded-3xl py-16 flex flex-col items-center justify-center text-center">
                <div className="mb-3 text-sm font-semibold text-gray-500">
                  No leads match your filters
                </div>
                <p className="text-xs text-gray-400 max-w-sm">
                  Try clearing your search or choosing a different status or priority to see
                  more leads.
                </p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {lead.name}
                        </div>
                        {lead.isHot && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E5] text-[11px] font-semibold text-orange-600 px-2 py-0.5">
                            <Flame className="w-3 h-3" />
                            Hot lead
                          </span>
                        )}
                        {lead.badge && (
                          <span className="inline-flex items-center rounded-full bg-[#FFEFD5] text-[11px] font-semibold text-amber-700 px-2.5 py-0.5">
                            {lead.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {lead.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-2 min-w-[200px]">
                      <div className="text-sm font-semibold text-gray-900">
                        {lead.propertyTitle}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lead.propertyLocation}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {lead.timeAgo}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xs hover:bg-[#25D366]/20 transition-colors">
                          <FaWhatsapp size={14} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs hover:bg-gray-200 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs hover:bg-gray-200 transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {lead.questionsCount && lead.questionsCount > 0 && lead.lastQuestion && (
                    <div className="rounded-2xl bg-[#F5F0FF] px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 text-xs md:text-sm">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Asked {lead.questionsCount} question
                        {lead.questionsCount > 1 ? "s" : ""}
                      </div>
                      <div className="text-gray-700 md:flex-1">
                        <span className="text-[11px] text-gray-500 mr-1">
                          Latest:
                        </span>
                        <span className="italic">"{lead.lastQuestion}"</span>
                      </div>
                    </div>
                  )}

                  {lead.offerAmount && (
                    <div className="rounded-2xl bg-[#E6F6EC] px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 text-xs md:text-sm">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
                        Offer
                      </div>
                      <div className="text-gray-800 md:flex-1 flex flex-wrap items-baseline gap-1">
                        <span className="font-semibold">{lead.offerAmount}</span>
                        {lead.offerPercent && (
                          <span className="text-[11px] text-green-700">
                            ({lead.offerPercent})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>{lead.channelLabel}</span>
                    <span>{lead.viewsLabel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

