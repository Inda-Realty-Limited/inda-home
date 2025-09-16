import { Container, Footer, Navbar } from "@/components";
import { getToken, getUser, StoredUser } from "@/helpers";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiMail,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Client-side guard
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }
    const u = getUser();
    setUser(u);
    setLoading(false);
  }, [router]);

  return (
    <>
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
          ) : !user ? (
            <div className="text-black/60 text-sm sm:text-base">
              No user data found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                  Account Information
                </h2>
                <dl className="space-y-4 sm:space-y-5 text-[#101820]">
                  <div>
                    <dt className="text-[#6B7280] text-xs sm:text-sm mb-1">
                      Name
                    </dt>
                    <dd className="text-sm sm:text-base inline-flex items-center gap-2">
                      <FiUser
                        className="text-[#4EA8A1] flex-shrink-0"
                        size={16}
                      />
                      <span className="break-words">
                        {user.firstName} {user.lastName}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6B7280] text-xs sm:text-sm mb-1">
                      Email
                    </dt>
                    <dd className="text-sm sm:text-base inline-flex items-center gap-2">
                      <FiMail
                        className="text-[#4EA8A1] flex-shrink-0"
                        size={16}
                      />
                      <span className="break-all">{user.email}</span>
                    </dd>
                  </div>
                  {user.createdAt && (
                    <div>
                      <dt className="text-[#6B7280] text-xs sm:text-sm mb-1">
                        Joined
                      </dt>
                      <dd className="text-sm sm:text-base inline-flex items-center gap-2">
                        <FiCalendar
                          className="text-[#4EA8A1] flex-shrink-0"
                          size={16}
                        />
                        <span className="break-words">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </dd>
                    </div>
                  )}
                  {user.isVerified !== undefined && (
                    <div>
                      <dt className="text-[#6B7280] text-xs sm:text-sm mb-1">
                        Account Status
                      </dt>
                      <dd className="text-sm sm:text-base inline-flex items-center gap-2">
                        {user.isVerified ? (
                          <>
                            <FiCheckCircle
                              className="text-emerald-600 flex-shrink-0"
                              size={16}
                            />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <FiXCircle
                              className="text-rose-500 flex-shrink-0"
                              size={16}
                            />
                            <span>Not Verified</span>
                          </>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                  Preferences
                </h2>
                <div className="text-center py-8 sm:py-12">
                  <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-[#6B7280]/10 text-[#6B7280] mb-3 sm:mb-4">
                    <FiUser size={20} className="sm:hidden" />
                    <FiUser size={24} className="hidden sm:block" />
                  </div>
                  <p className="text-[#6B7280] text-xs sm:text-sm">
                    Customization options coming soon…
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </Container>
    </>
  );
};

export default ProfilePage;
