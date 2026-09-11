import { useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from "react-icons/fi";

function ProductGallery({ product }) {
  // =========================================================
  // IMAGES
  // =========================================================

  const images = useMemo(() => {
    const list = [];

    if (Array.isArray(product?.images)) {
      product.images.forEach((image) => {
        if (
          typeof image === "string" &&
          image.trim()
        ) {
          list.push(image.trim());
        } else if (
          typeof image === "object" &&
          image?.url
        ) {
          list.push(image.url);
        }
      });
    }

    if (
      list.length === 0 &&
      product?.image
    ) {
      list.push(product.image);
    }

    return [...new Set(list)];
  }, [product?.images, product?.image]);

  // =========================================================
  // STATE
  // =========================================================

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [loaded, setLoaded] =
    useState(false);

  const [lightbox, setLightbox] =
    useState(false);

  // =========================================================
  // PRODUCT CHANGE
  // =========================================================

  useEffect(() => {
    setActiveIndex(0);
    setLoaded(false);
  }, [product?._id, product?.id]);

  // =========================================================
  // CURRENT IMAGE
  // =========================================================

  const currentImage =
    images[activeIndex] || images[0];

  // =========================================================
  // NAVIGATION
  // =========================================================

  const previousImage = () => {
    if (images.length <= 1) return;

    setLoaded(false);

    setActiveIndex((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  const nextImage = () => {
    if (images.length <= 1) return;

    setLoaded(false);

    setActiveIndex((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  };

  // =========================================================
  // KEYBOARD LIGHTBOX
  // =========================================================

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightbox(false);
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/900x1100/111827/d4af37?text=FashionStore";

    setLoaded(true);
  };

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (images.length === 0) {
    return (
      <div className="flex min-h-[420px] w-full items-center justify-center rounded-3xl bg-surface sm:min-h-[520px]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <span className="text-xl">⌁</span>
          </div>

          <p className="text-base font-semibold text-text-primary">
            No image available
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Product image will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">

        {/* ===================================================
            MAIN GALLERY
        =================================================== */}

        <div className="relative">

          {/* MAIN IMAGE */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[28px]
              bg-[#0b1020]
              shadow-[0_25px_70px_rgba(0,0,0,0.25)]
            "
          >

            {/* subtle background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.08),transparent_50%)]" />

            {/* loading */}
            {!loaded && (
              <div className="absolute inset-0 z-10 animate-pulse bg-[#111827]" />
            )}

            {/* IMAGE */}

            <div
              className="
                relative
                flex
                h-[430px]
                items-center
                justify-center
                sm:h-[560px]
                md:h-[620px]
                lg:h-[650px]
                xl:h-[690px]
                2xl:h-[720px]
              "
            >
              <img
                key={currentImage}
                src={currentImage}
                alt={
                  product?.name ||
                  "FashionStore product"
                }
                onLoad={() =>
                  setLoaded(true)
                }
                onError={
                  handleImageError
                }
                className={`
                  h-full
                  w-full
                  object-contain
                  p-3
                  transition-all
                  duration-500
                  ease-out
                  sm:p-5
                  ${
                    loaded
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }
                  group-hover:scale-[1.015]
                `}
              />

              {/* FULLSCREEN */}

              <button
                type="button"
                onClick={() =>
                  setLightbox(true)
                }
                aria-label="Open image fullscreen"
                className="
                  absolute
                  right-4
                  top-4
                  z-20
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-black/45
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-accent
                  hover:text-black
                  active:scale-95
                "
              >
                <FiMaximize2 size={17} />
              </button>

              {/* IMAGE COUNT */}

              {images.length > 1 && (
                <div
                  className="
                    absolute
                    bottom-4
                    left-1/2
                    z-20
                    -translate-x-1/2
                    rounded-full
                    bg-black/50
                    px-3
                    py-1.5
                    text-[11px]
                    font-medium
                    text-white
                    backdrop-blur-md
                  "
                >
                  {activeIndex + 1} /{" "}
                  {images.length}
                </div>
              )}

              {/* PREVIOUS */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Previous image"
                  className="
                    absolute
                    left-3
                    top-1/2
                    z-20
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-black/40
                    text-white
                    opacity-100
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:bg-accent
                    hover:text-black
                    sm:left-5
                    sm:opacity-0
                    sm:group-hover:opacity-100
                  "
                >
                  <FiChevronLeft size={21} />
                </button>
              )}

              {/* NEXT */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="
                    absolute
                    right-3
                    top-1/2
                    z-20
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-black/40
                    text-white
                    opacity-100
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:bg-accent
                    hover:text-black
                    sm:right-5
                    sm:opacity-0
                    sm:group-hover:opacity-100
                  "
                >
                  <FiChevronRight size={21} />
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              THUMBNAILS
          ================================================= */}

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-thin">

              {images.map(
                (image, index) => {
                  const active =
                    index === activeIndex;

                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => {
                        setLoaded(false);
                        setActiveIndex(index);
                      }}
                      className={`
                        group
                        relative
                        h-[76px]
                        w-[64px]
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-surface
                        transition-all
                        duration-300
                        sm:h-[88px]
                        sm:w-[74px]
                        ${
                          active
                            ? "ring-2 ring-accent ring-offset-2 ring-offset-brand-bg"
                            : "opacity-60 hover:opacity-100"
                        }
                      `}
                    >
                      <img
                        src={image}
                        alt={`${product?.name || "Product"} image ${index + 1}`}
                        loading="lazy"
                        onError={
                          handleImageError
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />

                      {active && (
                        <span className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-accent" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}

      {lightbox && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/95
            p-4
            backdrop-blur-xl
          "
          onClick={() =>
            setLightbox(false)
          }
        >
          <button
            type="button"
            onClick={() =>
              setLightbox(false)
            }
            className="
              absolute
              right-4
              top-4
              z-30
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition-all
              hover:rotate-90
              hover:bg-white/20
            "
          >
            ✕
          </button>

          <img
            src={currentImage}
            alt={
              product?.name ||
              "Product"
            }
            onError={
              handleImageError
            }
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              max-h-[90vh]
              max-w-[92vw]
              rounded-2xl
              object-contain
              animate-[galleryIn_.3s_ease-out]
            "
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousImage();
                }}
                className="
                  absolute
                  left-3
                  top-1/2
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  backdrop-blur-md
                  transition-all
                  hover:scale-110
                  hover:bg-accent
                  hover:text-black
                  sm:left-8
                "
              >
                <FiChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-11
                  w-11
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  backdrop-blur-md
                  transition-all
                  hover:scale-110
                  hover:bg-accent
                  hover:text-black
                  sm:right-8
                "
              >
                <FiChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ProductGallery;