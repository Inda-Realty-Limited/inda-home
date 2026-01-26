import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Search, Flame, Phone, Mail, MoreHorizontal, MessageCircle, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import LeadDetailModal from "@/components/leads/LeadDetailModal";
import leadsApi, { Lead, LeadStatus, LeadPriority, LeadStats } from "@/api/leads";

export default function LeadsInboxPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | LeadPriority>("all");
  const [query, setQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const filters: any = { page, limit: 20 };
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }
      if (priorityFilter !== "all") filters.priority = priorityFilter;
      if (query.trim()) filters.search = query;

      const response = await leadsApi.getLeads(filters);
      if (response.success) {
        setLeads(response.data.leads);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await leadsApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch lead stats:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, priorityFilter, query, page]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh data when modal closes (in case updates were made)
  const handleModalClose = () => {
    setSelectedLead(null);
    fetchLeads();
    fetchStats();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (lead: Lead) => {
    const statusLabels: Record<LeadStatus, string> = {
      new_lead: "New Lead",
      contacted: "Contacted",
      viewing_scheduled: "Visit Scheduled",
      offer_made: "Offer Made",
      closed_won: "Closed Won",
      closed_lost: "Closed Lost",
    };
    return statusLabels[lead.status] || lead.status;
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout title="Leads Inbox">
        <div className="max-w-6xl mx-auto pb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-inda-dark">Leads Inbox</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and follow up with your property leads
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col justify-between">
              <div className="text-xs font-semibold text-gray-500 tracking-wider">
                Total Leads
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="h-8 w-12 bg-gray-100 animate-pulse rounded"></div>
                  ) : (
                    stats?.total || 0
                  )}
                </div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  All time
                </div>
              </div>
            </div>

            <div className="bg-[#FFF6F0] rounded-2xl border border-orange-100 shadow-sm px-6 py-5 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 tracking-wider">
                <Flame className="w-3 h-3" />
                Hot Leads
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="h-8 w-12 bg-orange-100 animate-pulse rounded"></div>
                  ) : (
                    stats?.hotLeads || 0
                  )}
                </div>
                <div className="text-[11px] text-orange-500">
                  Likely to convert soon
                </div>
              </div>
            </div>

            <div className="bg-[#FFF8F2] rounded-2xl border border-amber-100 shadow-sm px-6 py-5 flex flex-col justify-between">
              <div className="text-xs font-semibold text-amber-600 tracking-wider">
                Offers Made
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="h-8 w-12 bg-amber-100 animate-pulse rounded"></div>
                  ) : (
                    stats?.offersMade || 0
                  )}
                </div>
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
                <option value="new_lead">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="viewing_scheduled">Visit Scheduled</option>
                <option value="offer_made">Offer Made</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-[#4EA8A1]/40 focus:border-[#4EA8A1] min-w-[140px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High (Hot)</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-3">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-48 bg-gray-100 rounded"></div>
                      </div>
                      <div className="space-y-3 text-right">
                        <div className="h-4 w-40 bg-gray-200 rounded ml-auto"></div>
                        <div className="h-3 w-24 bg-gray-100 rounded ml-auto"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : leads.length === 0 ? (
              <div className="bg-white border border-gray-200 border-dashed rounded-3xl py-16 flex flex-col items-center justify-center text-center">
                <div className="mb-3 text-sm font-semibold text-gray-500">
                  {query || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No leads match your filters"
                    : "No leads yet"}
                </div>
                <p className="text-xs text-gray-400 max-w-sm">
                  {query || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try clearing your search or choosing a different status or priority to see more leads."
                    : "When potential buyers inquire about your properties, they'll appear here."}
                </p>
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5 space-y-4 cursor-pointer hover:border-inda-teal/50 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {lead.name}
                        </div>
                        {lead.priority === "high" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF1E5] text-[11px] font-semibold text-orange-600 px-2 py-0.5">
                            <Flame className="w-3 h-3" />
                            Hot lead
                          </span>
                        )}
                        {lead.status !== "new_lead" && (
                          <span className="inline-flex items-center rounded-full bg-[#FFEFD5] text-[11px] font-semibold text-amber-700 px-2.5 py-0.5">
                            {getStatusBadge(lead)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {lead.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-2 min-w-[200px]">
                      <div className="text-sm font-semibold text-gray-900">
                        {lead.propertyTitle || (typeof lead.listingId === "object" ? lead.listingId.title : "Property Inquiry")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lead.propertyLocation || (typeof lead.listingId === "object" ? `${lead.listingId.microlocationStd || lead.listingId.lga}, Lagos` : "")}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(lead.createdAt)}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xs hover:bg-[#25D366]/20 transition-colors"
                          >
                            <FaWhatsapp size={14} />
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs hover:bg-gray-200 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs hover:bg-gray-200 transition-colors"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {lead.message && (
                    <div className="rounded-2xl bg-[#F5F0FF] px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 text-xs md:text-sm">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message
                      </div>
                      <div className="text-gray-700 md:flex-1">
                        <span className="italic">"{lead.message}"</span>
                      </div>
                    </div>
                  )}

                  {lead.offerAmount && lead.offerAmount > 0 && (
                    <div className="rounded-2xl bg-[#E6F6EC] px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 text-xs md:text-sm">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
                        Offered
                      </div>
                      <div className="text-gray-800 md:flex-1 flex flex-wrap items-baseline gap-1">
                        <span className="font-semibold">{formatCurrency(lead.offerAmount)}</span>
                        {lead.offerPercent && (
                          <span className="text-[11px] text-green-700">
                            ({lead.offerPercent})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>{lead.channel}</span>
                    <span>{lead.pageViews} views</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <LeadDetailModal
            isOpen={!!selectedLead}
            onClose={handleModalClose}
            lead={selectedLead}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
