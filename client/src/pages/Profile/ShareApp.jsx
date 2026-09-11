import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiShare2,
  FiCopy,
  FiSmartphone,
  FiDownload,
} from "react-icons/fi";

function ShareApp() {
  const appLink = "https://fashionstore.com/app";

  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(appLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FashionStore",
          text: "Download FashionStore and enjoy premium shopping!",
          url: appLink,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] px-4 py-8">

      <div className="mx-auto max-w-6xl">

        {/* Back Button */}

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
        >
          <FiArrowLeft size={18} />
          Back to Profile
        </Link>

        {/* Header */}

        <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-8">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex rounded-full bg-blue-500/20 p-4">

                <FiShare2
                  size={42}
                  className="text-blue-400"
                />

              </div>

              <h1 className="mt-5 text-4xl font-bold text-[var(--color-text-primary)]">
                Share FashionStore
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-[var(--color-text-secondary)]">
                Invite your friends and family to experience premium shopping.
                Share the FashionStore app with just one click.
              </p>

            </div>

            <div className="rounded-2xl bg-[var(--color-surface)] p-6 text-center">

              <FiDownload
                size={42}
                className="mx-auto text-[var(--color-accent)]"
              />

              <h2 className="mt-3 text-2xl font-bold text-[var(--color-accent)]">
                Download Now
              </h2>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Fast • Secure • Easy Shopping
              </p>

            </div>

          </div>

        </div>

        {/* Share Link Card */}

        <div className="mt-8 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            App Download Link
          </h2>

          <p className="mt-2 text-[var(--color-text-secondary)]">
            Copy or share the official FashionStore app download link.
          </p>

          <div className="mt-6">
                      <div className="flex flex-col gap-4 lg:flex-row">

            <input
              type="text"
              value={appLink}
              readOnly
              className="flex-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-5 py-4 text-[var(--color-text-primary)] outline-none"
            />

            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-6 py-4 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
            >
              <FiCopy />
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <button
              type="button"
              onClick={nativeShare}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-subtle)] px-6 py-4 font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <FiShare2 />
              Share
            </button>

          </div>

          {/* Social Share */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Share on Social Media
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Download FashionStore now: ${appLink}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-green-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-green-700"
              >
                💬 WhatsApp
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  appLink
                )}&text=${encodeURIComponent(
                  "Download FashionStore today!"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-sky-500 px-6 py-4 text-center font-semibold text-white transition hover:bg-sky-600"
              >
                ✈ Telegram
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  appLink
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-blue-700 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-800"
              >
                📘 Facebook
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Download FashionStore ${appLink}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-black px-6 py-4 text-center font-semibold text-white transition hover:bg-neutral-800"
              >
                ❌ X (Twitter)
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  "Try FashionStore"
                )}&body=${encodeURIComponent(
                  `Download the FashionStore app: ${appLink}`
                )}`}
                className="rounded-2xl bg-red-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-red-700"
              >
                📧 Email
              </a>

            </div>

          </div>

        </div>

        {/* QR Code Section Starts */}

        <div className="mt-8">
                      <div className="grid gap-8 lg:grid-cols-2">

            {/* QR Code */}

            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Scan QR Code
              </h2>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                Scan this QR code to instantly open the FashionStore app
                download page.
              </p>

              <div className="mt-8 flex justify-center">

                <div className="flex h-64 w-64 items-center justify-center rounded-3xl border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-surface)]">

                  <div className="text-center">

                    <FiSmartphone
                      size={70}
                      className="mx-auto text-[var(--color-accent)]"
                    />

                    <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                      QR Code Placeholder
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Ready Message */}

            <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Ready-to-Share Message
              </h2>

              <p className="mt-2 text-[var(--color-text-secondary)]">
                Copy this message and send it anywhere.
              </p>

              <div className="mt-6 rounded-2xl bg-[var(--color-surface)] p-6">

                <p className="leading-8 text-[var(--color-text-primary)]">
                  🛍️ Hey! I found an amazing shopping app called
                  <span className="font-bold text-[var(--color-accent)]">
                    {" "}FashionStore
                  </span>.
                  <br /><br />
                  Explore premium fashion collections, exclusive offers,
                  fast delivery and secure payments.
                  <br /><br />
                  Download now:
                  <br />
                  <span className="break-all text-[var(--color-accent)]">
                    {appLink}
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* Benefits */}

          <div className="mt-10 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Why Share FashionStore?
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-5xl">🎁</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Exclusive Offers
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Help friends discover amazing deals and discounts every day.
                </p>

              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-5xl">🚚</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Fast Delivery
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Quick delivery across multiple cities with live tracking.
                </p>

              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-5xl">🔒</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Secure Payments
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Safe checkout with UPI, cards, wallets and Cash on Delivery.
                </p>

              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-6">

                <div className="text-5xl">⭐</div>

                <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
                  Premium Experience
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Beautiful UI, top brands and a smooth shopping experience.
                </p>

              </div>

            </div>

          </div>

          {/* Tips Section Starts */}

          <div className="mt-8">
                      <div className="rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-8">

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Sharing Tips
            </h2>

            <div className="mt-6 space-y-5">

              <div className="rounded-2xl bg-[var(--color-surface)] p-5">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  📱 Share Personally
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Send the app link directly to your friends and family for
                  better engagement.
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-5">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  🌐 Post on Social Media
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Share FashionStore on your favorite social platforms to help
                  more people discover great deals.
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-surface)] p-5">
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  ⭐ Recommend Your Favorites
                </h3>

                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Tell others about the products and shopping experience you
                  enjoyed the most.
                </p>
              </div>

            </div>

            {/* Action Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

              <button
                type="button"
                onClick={nativeShare}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-8 py-4 font-semibold text-black transition hover:bg-[var(--color-accent-hover)]"
              >
                <FiShare2 />
                Share Now
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border-subtle)] px-8 py-4 font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <FiCopy />
                {copied ? "Copied!" : "Copy Link"}
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-border-subtle)] px-8 py-4 font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
    </div>
        </div>
  );
}

export default ShareApp;
          
        