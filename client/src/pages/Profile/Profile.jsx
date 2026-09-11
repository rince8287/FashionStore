import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiShoppingBag,
  FiHeart,
  FiCreditCard,
  FiGift,
  FiShare2,
  FiHelpCircle,
  FiGlobe,
  FiStar,
  FiFileText,
  FiLogOut,
  FiRefreshCw,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import {
  ProfileHeader,
  UserInfoCard,
  ProfileMenu,
  ProfileMenuItem,
  ProfileSection,
  LogoutDialog,
} from "../../components/profile";

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [showLogoutDialog, setShowLogoutDialog] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /* ===========================
      User Information
  =========================== */

  const profileUser = {
    name: user?.name || "Guest User",
    email: user?.email || "Not Available",
    phone: user?.phone || "Not Available",
    avatar: user?.avatar || "",
    memberSince: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric",
          }
        )
      : "New Member",
  };

  async function handleLogout() {
    try {
      setLoading(true);

      await logout();

      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setShowLogoutDialog(false);
    }
  }

  /* ===========================
      Shopping
  =========================== */
    const shoppingItems = [
    {
      id: 1,
      icon: FiShoppingBag,
      title: "My Orders",
      subtitle: "Track, return or buy again",
      to: "/orders",
    },
    {
      id: 2,
      icon: FiHeart,
      title: "Wishlist",
      subtitle: "Products you've saved",
      to: "/wishlist",
    },
  ];

  /* ===========================
      Payments
  =========================== */

  const paymentItems = [
    {
      id: 1,
      icon: FiCreditCard,
      title: "My Wallet",
      subtitle: "Balance, cashback & rewards",
      to: "/profile/wallet",
    },
    {
      id: 2,
      icon: FiCreditCard,
      title: "Payment Methods",
      subtitle: "Cards, UPI & Bank Accounts",
      to: "/profile/payments",
    },
    {
      id: 3,
      icon: FiRefreshCw,
      title: "Refunds",
      subtitle: "Track your refund requests",
      to: "/profile/payment-refund",
    },
  ];

  /* ===========================
      More
  =========================== */

  const moreItems = [
    {
      id: 1,
      icon: FiGift,
      title: "Refer & Earn",
      subtitle: "Invite friends & earn rewards",
      to: "/profile/refer-earn",
    },
    {
      id: 2,
      icon: FiShare2,
      title: "Share App",
      subtitle: "Share FashionStore",
      to: "/profile/share-app",
    },
    {
      id: 3,
      icon: FiGlobe,
      title: "Language",
      subtitle: "Choose your preferred language",
      to: "/profile/change-language",
    },
    {
      id: 4,
      icon: FiHelpCircle,
      title: "Help Center",
      subtitle: "Support & FAQs",
      to: "/profile/help-center",
    },
    {
      id: 5,
      icon: FiStar,
      title: "Rate Us",
      subtitle: "Share your experience",
      to: "/profile/rate-us",
    },
    {
      id: 6,
      icon: FiFileText,
      title: "Legal Policies",
      subtitle: "Privacy Policy & Terms",
      to: "/profile/legal",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-3 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* ================= Header ================= */}

        <ProfileHeader
          title="My Profile"
          subtitle="Manage your account, orders, payments and preferences."
        />

        {/* ================= User Information ================= */}

        <div className="mt-6">
          <UserInfoCard user={profileUser} />
        </div>

        {/* ================= Shopping ================= */}

        <div className="mt-8">

          <ProfileSection title="Shopping">

            <ProfileMenu>

              {shoppingItems.map((item) => (
                <ProfileMenuItem
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  to={item.to}
                />
              ))}

            </ProfileMenu>

          </ProfileSection>

        </div>

        {/* ================= Payments ================= */}

        <div className="mt-8">

          <ProfileSection title="Payments">

            <ProfileMenu>

              {paymentItems.map((item) => (
                <ProfileMenuItem
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  to={item.to}
                />
              ))}

            </ProfileMenu>

          </ProfileSection>

        </div>
                {/* ================= More ================= */}

        <div className="mt-8">

          <ProfileSection title="More">

            <ProfileMenu>

              {moreItems.map((item) => (
                <ProfileMenuItem
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  to={item.to}
                />
              ))}

            </ProfileMenu>

          </ProfileSection>

        </div>

        {/* ================= Account ================= */}

        <div className="mt-8">

          <ProfileSection title="Account">

            <ProfileMenu>

              <ProfileMenuItem
                icon={FiLogOut}
                title="Logout"
                subtitle="Sign out from your account"
                danger
                disabled={loading}
                onClick={() =>
                  setShowLogoutDialog(true)
                }
              />

            </ProfileMenu>

          </ProfileSection>

        </div>

        {/* ================= Logout Dialog ================= */}

        <LogoutDialog
          open={showLogoutDialog}
          loading={loading}
          onClose={() => {
            if (!loading) {
              setShowLogoutDialog(false);
            }
          }}
          onConfirm={handleLogout}
        />
                {/* ================= Footer ================= */}

        <div className="mt-10">

          <div className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]">

            {/* Top */}

            <div className="px-6 py-8 text-center">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Thanks for Shopping with FashionStore ❤️
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
                Enjoy secure payments, lightning-fast delivery,
                exclusive rewards and premium customer support.
                Thank you for being a valuable member of the
                FashionStore family.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">

                <ProfileMenuItem
                  icon={FiShoppingBag}
                  title="Continue Shopping"
                  subtitle="Explore our latest collections"
                  to="/"
                />

                <ProfileMenuItem
                  icon={FiShoppingBag}
                  title="My Orders"
                  subtitle="Track your recent purchases"
                  to="/orders"
                />

              </div>

            </div>

            {/* Bottom */}

            <div className="border-t border-[var(--color-border-subtle)] px-6 py-5 text-center">

              <p className="text-sm text-[var(--color-text-muted)]">
                FashionStore v1.0.0
              </p>

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                © {new Date().getFullYear()} FashionStore.
                All Rights Reserved.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;