import { useMemo, useState } from "react";
import {
  FiHelpCircle,
  FiSearch,
  FiArrowLeft,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function HelpCenter() {
  const [search, setSearch] = useState("");

  const faqs = [
    {
      id: 1,
      question: "How can I track my order?",
      answer:
        "Go to Profile → Orders → Select your order → Track Order.",
    },
    {
      id: 2,
      question: "How do I cancel an order?",
      answer:
        "Open your order details and click Cancel Order if cancellation is available.",
    },
    {
      id: 3,
      question: "How do I request a refund?",
      answer:
        "Refund requests can be made from the Order Details page after cancellation or return approval.",
    },
    {
      id: 4,
      question: "How can I update my profile?",
      answer:
        "Go to Profile → Edit Profile and save your updated information.",
    },
    {
      id: 5,
      question: "How do I change my password?",
      answer:
        "Open Profile → Account Settings → Change Password.",
    },
    {
      id: 6,
      question: "How can I contact customer support?",
      answer:
        "Use the support options below or email support@fashionstore.com.",
    },
    {
      id: 7,
      question: "How do I add a payment method?",
      answer:
        "Open Profile → My Payments and add your preferred payment method.",
    },
    {
      id: 8,
      question: "Why is my cashback pending?",
      answer:
        "Cashback is credited after successful delivery and completion of the return period.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return faqs;
    }

    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-8">

      <div className="mx-auto max-w-5xl">

        {/* Back Button */}

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
        >
          <FiArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Header */}

        <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <FiHelpCircle size={32} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Help Center
              </h1>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                Search FAQs or contact our support team for assistance.
              </p>

            </div>

          </div>

        </div>

        {/* Search */}

        <div className="mt-8 relative">

          <FiSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
          />

          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] py-4 pl-12 pr-4 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
          />
        </div>

        {/* FAQ Section Starts */}

        <div className="mt-8 space-y-4">
                      {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6"
              >
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {faq.question}
                </h2>

                <p className="mt-3 leading-7 text-[var(--color-text-secondary)]">
                  {faq.answer}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-10 text-center">

              <FiHelpCircle
                size={48}
                className="mx-auto text-[var(--color-text-secondary)]"
              />

              <h2 className="mt-5 text-xl font-semibold text-[var(--color-text-primary)]">
                No Results Found
              </h2>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                Try searching with different keywords.
              </p>

            </div>
          )}

        </div>

        {/* Contact Support */}

        <div className="mt-10">

          <h2 className="mb-5 text-2xl font-bold text-[var(--color-text-primary)]">
            Contact Support
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* Call */}

            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                📞 Call Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Talk directly with our customer support team.
              </p>

              <a
                href="tel:+911800123456"
                className="mt-6 inline-block rounded-xl bg-[var(--color-accent)] px-5 py-3 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                Call Now
              </a>

            </div>

            {/* Email */}

            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                📧 Email Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Send us your issue and we'll reply as soon as possible.
              </p>

              <a
                href="mailto:support@fashionstore.com"
                className="mt-6 inline-block rounded-xl bg-[var(--color-accent)] px-5 py-3 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                Send Email
              </a>

            </div>

            {/* Live Chat */}

            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                💬 Live Chat
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Chat instantly with our support executives.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl bg-[var(--color-accent)] px-5 py-3 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                Start Chat
              </button>

            </div>

          </div>

        </div>

        {/* Contact Form Starts */}

        <div className="mt-10">

                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6">

            <h2 className="mb-6 text-2xl font-bold text-[var(--color-text-primary)]">
              Still Need Help?
            </h2>

            <form className="space-y-5">

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              {/* Subject */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="Enter subject"
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              {/* Message */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                  Message
                </label>

                <textarea
                  rows={6}
                  placeholder="Describe your issue..."
                  className="w-full resize-none rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--color-accent)] py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-[var(--color-accent-hover)]"
              >
                Submit Request
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HelpCenter;
       