import {
  FiShoppingBag,
  FiCreditCard,
  FiHelpCircle,
  FiGlobe,
  FiShare2,
  FiStar,
  FiFileText,
  FiLogOut,
  FiGift,
  FiEdit,
  FiUser,
} from "react-icons/fi";

import { FaWallet } from "react-icons/fa6";

/* =========================================================
   PROFILE QUICK ACTIONS
========================================================= */

export const PROFILE_QUICK_ACTIONS = [
  {
    id: 1,
    title: "Edit Profile",
    subtitle: "Update your personal details",
    icon: FiEdit,
    route: "/profile/edit",
  },

  {
    id: 2,
    title: "My Orders",
    subtitle: "Track and manage your orders",
    icon: FiShoppingBag,
    route: "/profile/orders",
  },
];

/* =========================================================
   ACCOUNT SECTION
========================================================= */

export const PROFILE_ACCOUNT_MENU = [
  {
    id: 1,
    title: "FashionStore Wallet",
    subtitle: "Wallet balance, cashback & rewards",
    icon: FaWallet,
    route: "/profile/wallet",
  },

  {
    id: 2,
    title: "Refer & Earn",
    subtitle: "Invite friends and earn rewards",
    icon: FiGift,
    route: "/profile/refer-earn",
  },

  {
    id: 3,
    title: "My Payments",
    subtitle: "Manage Bank & UPI details",
    icon: FiCreditCard,
    route: "/profile/payments",
  },

  {
    id: 4,
    title: "Payment & Refund",
    subtitle: "Payment history and refunds",
    icon: FiCreditCard,
    route: "/profile/payment-refund",
  },

  {
    id: 5,
    title: "Help Center",
    subtitle: "FAQs, support & contact us",
    icon: FiHelpCircle,
    route: "/profile/help-center",
  },
];

/* =========================================================
   MY ACTIVITY
========================================================= */

export const PROFILE_ACTIVITY_MENU = [
  {
    id: 1,
    title: "Change Language",
    subtitle: "Switch app language",
    icon: FiGlobe,
    route: "/profile/change-language",
  },

  {
    id: 2,
    title: "Share App",
    subtitle: "Invite your friends",
    icon: FiShare2,
    route: "/profile/share-app",
  },

  {
    id: 3,
    title: "Rate Us",
    subtitle: "Rate FashionStore",
    icon: FiStar,
    route: "/profile/rate-us",
  },
];

/* =========================================================
   LEGAL
========================================================= */

export const PROFILE_LEGAL_MENU = [
  {
    id: 1,
    title: "Legal & Policies",
    subtitle: "Privacy, Terms & Shipping",
    icon: FiFileText,
    route: "/profile/legal",
  },
];

/* =========================================================
   LOGOUT
========================================================= */

export const PROFILE_LOGOUT = {
  id: 1,
  title: "Logout",
  subtitle: "Sign out from your account",
  icon: FiLogOut,
  route: "/logout",
};

/* =========================================================
   PROFILE SECTIONS
========================================================= */

export const PROFILE_SECTIONS = {
  ACCOUNT: "Account",
  ACTIVITY: "My Activity",
  LEGAL: "Legal & Policies",
};

/* =========================================================
   EDIT PROFILE FIELDS
========================================================= */

export const PROFILE_EDIT_FIELDS = [
  {
    id: 1,
    label: "Full Name",
    name: "fullName",
    type: "text",
    placeholder: "Enter your full name",
    icon: FiUser,
  },

  {
    id: 2,
    label: "Phone Number",
    name: "phone",
    type: "tel",
    placeholder: "Enter phone number",
  },

  {
    id: 3,
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "Enter email address",
  },

  {
    id: 4,
    label: "Gender",
    name: "gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },

  {
    id: 5,
    label: "Language Spoken",
    name: "language",
    type: "select",
    options: [
      "English",
      "Hindi",
      "Punjabi",
      "Gujarati",
      "Marathi",
      "Tamil",
      "Telugu",
      "Kannada",
      "Malayalam",
      "Bengali",
    ],
  },

  {
    id: 6,
    label: "Occupation",
    name: "occupation",
    type: "text",
    placeholder: "Enter occupation",
  },

  {
    id: 7,
    label: "Pincode",
    name: "pincode",
    type: "number",
    placeholder: "Enter pincode",
  },

  {
    id: 8,
    label: "City",
    name: "city",
    type: "text",
    placeholder: "Enter city",
  },

  {
    id: 9,
    label: "State",
    name: "state",
    type: "text",
    placeholder: "Enter state",
  },
];

/* =========================================================
   CHANGE LANGUAGE
========================================================= */

export const APP_LANGUAGES = [
  "English",
  "हिन्दी",
  "ਪੰਜਾਬੀ",
  "ગુજરાતી",
  "मराठी",
  "বাংলা",
  "தமிழ்",
  "తెలుగు",
  "ಕನ್ನಡ",
  "മലയാളം",
];

/* =========================================================
   HELP CENTER
========================================================= */

export const HELP_CENTER_OPTIONS = [
  "FAQs",
  "Contact Support",
  "Live Chat",
  "Returns & Refunds",
  "Shipping Information",
  "Cancellation Policy",
  "Report a Problem",
];

/* =========================================================
   SHARE OPTIONS
========================================================= */

export const SHARE_OPTIONS = [
  "WhatsApp",
  "Telegram",
  "Facebook",
  "Instagram",
  "X (Twitter)",
  "Copy Link",
];

/* =========================================================
   PAYMENT METHODS
========================================================= */

export const PAYMENT_METHODS = [
  "Bank Account",
  "Google Pay",
  "PhonePe",
  "Paytm",
  "BHIM UPI",
];