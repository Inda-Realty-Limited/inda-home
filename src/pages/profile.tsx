import { Button, Container, Footer, Input, Navbar } from "@/components";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { AuthUser } from "@/types/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

type InfoTileTone = "default" | "success" | "danger";

const mapUserToFormValues = (target: AuthUser): Partial<AuthUser> => ({
  firstName: target.firstName ?? "",
  lastName: target.lastName ?? "",
  email: target.email ?? "",
  howDidYouHearAboutUs: target.howDidYouHearAboutUs ?? "",
  todo: target.todo ?? "",
});

const InfoTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: InfoTileTone;
}> = ({ icon, label, value, tone = "default" }) => {
  const accentClassMap: Record<InfoTileTone, string> = {
    default: "bg-[#4EA8A1]/15 text-[#4EA8A1]",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-rose-100 text-rose-600",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#DCEAE8] bg-[#F8FBFA] px-4 py-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentClassMap[tone]} text-base`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
          {label}
        </p>
        <p className="text-sm font-semibold text-[#101820]">{value}</p>
      </div>
    </div>
  );
};

const PreferenceHighlight: React.FC<{
  title: string;
  description: string;
  value?: string;
  placeholder: string;
}> = ({ title, description, value, placeholder }) => (
  <div className="space-y-2 rounded-2xl border border-[#E4EEEC] bg-[#F7FCFB] px-4 py-4 sm:px-5 sm:py-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
      {title}
    </p>
    <p className="text-sm font-semibold text-[#0B1D27]">
      {value && value.trim().length > 0 ? value : placeholder}
    </p>
    <p className="text-xs text-[#5E7572]">{description}</p>
  </div>
);

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user: authUser, setUser: setAuthUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<Partial<AuthUser>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    if (isAuthenticated && authUser) {
      setLoading(false);
    }
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    if (authUser) {
      setFormValues(mapUserToFormValues(authUser));
    }
  }, [authUser]);

  const handleInputChange = useCallback(
    (field: keyof AuthUser) =>
      (
        event:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLTextAreaElement>
      ) => {
        const { value } = event.target;
        setFormValues((prev) => ({ ...prev, [field]: value }));
        setFeedback(null);
      },
    []
  );

  const handleReset = useCallback(() => {
    if (!authUser) return;
    setFormValues(mapUserToFormValues(authUser));
    setFeedback(null);
  }, [authUser]);

  const handleSave = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!authUser) return;

      setIsSaving(true);
      setFeedback(null);

      try {
        const updatedUser: AuthUser = {
          ...authUser,
          firstName: (formValues.firstName ?? "").trim(),
          lastName: (formValues.lastName ?? "").trim(),
          email: (formValues.email ?? "").trim(),
          howDidYouHearAboutUs: formValues.howDidYouHearAboutUs?.trim() ?? "",
          todo: formValues.todo?.trim() ?? "",
        };

        setAuthUser(updatedUser);
        setFormValues(mapUserToFormValues(updatedUser));
        setFeedback({
          type: "success",
          message: "Profile details updated successfully.",
        });
      } catch (error) {
        setFeedback({
          type: "error",
          message: "Unable to save your changes right now. Please try again.",
        });
      } finally {
        setIsSaving(false);
      }
    },
    [formValues, authUser, setAuthUser]
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>My Profile • Inda</title>
      </Head>
      <Container
        noPadding
        className="min-h-screen bg-[#E5E5E5] text-[#101820] flex flex-col"
      >
        <Navbar />
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex-1">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-[#101820]">
              My Profile
            </h1>
            <p className="text-[#6B7280] text-sm sm:text-base lg:text-lg">
              Manage your account information and preferences.
            </p>
          </div>
          {loading ? (
            <div className="text-black/60 text-sm sm:text-base">Loading...</div>
          ) : !authUser ? (
            <div className="text-black/60 text-sm sm:text-base">
              No user data found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
                <div className="mb-4 flex flex-col gap-2 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#101820]">
                    Account Information
                  </h2>
                  <p className="text-xs text-[#6B7280] sm:text-sm">
                    Keep your details up to date to personalise your Inda
                    workspace.
                  </p>
                </div>
                {feedback && (
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                      feedback.type === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <FiCheckCircle className="flex-shrink-0" size={18} />
                    ) : (
                      <FiXCircle className="flex-shrink-0" size={18} />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] sm:text-sm">
                        First name
                      </span>
                      <Input
                        name="firstName"
                        value={formValues.firstName ?? ""}
                        onChange={handleInputChange("firstName")}
                        placeholder="Enter first name"
                        autoComplete="given-name"
                        required
                        className="w-full bg-white text-[#101820]"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] sm:text-sm">
                        Last name
                      </span>
                      <Input
                        name="lastName"
                        value={formValues.lastName ?? ""}
                        onChange={handleInputChange("lastName")}
                        placeholder="Enter last name"
                        autoComplete="family-name"
                        required
                        className="w-full bg-white text-[#101820]"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] sm:text-sm">
                      Email
                    </span>
                    <Input
                      name="email"
                      type="email"
                      value={formValues.email ?? ""}
                      onChange={handleInputChange("email")}
                      placeholder="Enter email"
                      autoComplete="email"
                      required
                      className="w-full bg-white text-[#101820]"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] sm:text-sm">
                      How did you hear about Inda?
                    </span>
                    <Input
                      name="howDidYouHearAboutUs"
                      value={formValues.howDidYouHearAboutUs ?? ""}
                      onChange={handleInputChange("howDidYouHearAboutUs")}
                      placeholder="e.g. Twitter, LinkedIn, a friend..."
                      className="w-full bg-white text-[#101820]"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] sm:text-sm">
                      What should we help you with next?
                    </span>
                    <textarea
                      name="todo"
                      value={formValues.todo ?? ""}
                      onChange={handleInputChange("todo")}
                      placeholder="Share context so we can tailor your dashboard."
                      className="w-full min-h-[96px] rounded-xl border border-[#D7EBE7] bg-white px-3 py-2 text-sm text-[#101820] transition focus:outline-none focus:border-[#4EA8A1] focus:ring-2 focus:ring-[#4EA8A1]/30"
                    />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[#6B7280] sm:text-sm">
                      These details stay on your device and power personalised
                      recommendations.
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleReset}
                        disabled={isSaving}
                        className="whitespace-nowrap"
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="whitespace-nowrap"
                      >
                        {isSaving ? "Saving..." : "Save changes"}
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="mt-6 space-y-3 border-t border-[#EDF4F3] pt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                    Account overview
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoTile
                      icon={<FiCalendar className="text-base" />}
                      label="Joined"
                      value={
                        authUser.createdAt
                          ? new Date(authUser.createdAt).toLocaleDateString()
                          : "Not available"
                      }
                    />
                    <InfoTile
                      icon={
                        authUser.isVerified ? (
                          <FiCheckCircle className="text-base" />
                        ) : (
                          <FiXCircle className="text-base" />
                        )
                      }
                      label="Status"
                      tone={authUser.isVerified ? "success" : "danger"}
                      value={authUser.isVerified ? "Verified" : "Not Verified"}
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101820]">
                  Preferences
                </h2>
                <p className="mt-2 text-xs text-[#6B7280] sm:text-sm">
                  See the signals we use to tailor recommendations and reports.
                </p>
                <div className="mt-6 space-y-4 sm:space-y-5">
                  <PreferenceHighlight
                    title="Discovery channel"
                    description="Helps us know where to share beta perks and event invites."
                    value={formValues.howDidYouHearAboutUs}
                    placeholder="Tell us how you discovered Inda to unlock tailored programs."
                  />
                  <PreferenceHighlight
                    title="Current focus"
                    description="We surface guides, checklists, and experts aligned with this goal."
                    value={formValues.todo}
                    placeholder="Share what you're working on to shape your dashboard."
                  />
                  <div className="rounded-2xl border border-dashed border-[#DCEAE8] bg-[#F8FBFA] px-4 py-5 sm:px-5">
                    <p className="text-sm font-semibold text-[#0B1D27]">
                      Customisation controls are coming soon
                    </p>
                    <p className="mt-1 text-xs text-[#5E7572]">
                      Granular notification cadence, saved searches, and
                      collaboration invites will live here. We’ll let you know
                      as soon as they drop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </Container>
    </ProtectedRoute>
  );
};

export default ProfilePage;
