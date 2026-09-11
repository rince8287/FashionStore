import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiShield,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";

import {
  Link,
  useNavigate,
} from "react-router-dom";

// ==========================================================
// COMPONENTS
// ==========================================================

import CheckoutHeader from "../../components/checkout/CheckoutHeader";
import SavedAddresses from "../../components/checkout/SavedAddresses";
import AddressForm from "../../components/checkout/AddressForm";
import DeliveryOptions from "../../components/checkout/DeliveryOptions";
import PaymentMethods from "../../components/checkout/PaymentMethods";
import CouponBox from "../../components/checkout/CouponBox";
import OrderSummary from "../../components/checkout/OrderSummary";
import PriceDetails from "../../components/checkout/PriceDetails";
import PlaceOrderButton from "../../components/checkout/PlaceOrderButton";

// ==========================================================
// CONTEXT
// ==========================================================

import {
  useCart,
} from "../../context/CartContext";

// ==========================================================
// SERVICES
// ==========================================================

import {
  createOrder,
} from "../../services/orderService";

import paymentService from "../../services/paymentService";
import couponService from "../../admin/services/couponService";

// ==========================================================
// CHECKOUT
// ==========================================================

function Checkout() {
  const navigate = useNavigate();

  // ========================================================
  // STATE
  // ========================================================

  const [
    selectedAddress,
    setSelectedAddress,
  ] = useState(null);

  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(false);

  const [
    selectedPayment,
    setSelectedPayment,
  ] = useState("online");

  const [
    couponLoading,
    setCouponLoading,
  ] = useState(false);

  const [
    orderLoading,
    setOrderLoading,
  ] = useState(false);

  const [
    couponDiscount,
    setCouponDiscount,
  ] = useState(0);

  const [
    couponCode,
    setCouponCode,
  ] = useState("");

  const [
    deliveryType,
    setDeliveryType,
  ] = useState("standard");

  // ========================================================
  // CART
  // ========================================================

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    moveToWishlist,
    refreshCart,
  } = useCart();

  // ========================================================
  // SAFE CART
  // ========================================================

  const safeCartItems = Array.isArray(
    cartItems
  )
    ? cartItems
    : [];

  // ========================================================
  // CALCULATIONS
  // ========================================================

  const subtotal = useMemo(() => {
    return safeCartItems.reduce(
      (total, item) => {
        const product =
          item?.product || item;

        const price =
          product?.discountPrice ??
          product?.price ??
          item?.discountPrice ??
          item?.price ??
          0;

        const quantity =
          Number(
            item?.quantity
          ) || 0;

        return (
          total +
          Number(price) *
            quantity
        );
      },
      0
    );
  }, [safeCartItems]);

  // ========================================================
  // DELIVERY CHARGE
  // ========================================================

  const deliveryCharge =
    subtotal > 999
      ? 0
      : deliveryType ===
          "express"
        ? 199
        : 99;

  // ========================================================
  // PLATFORM FEE
  // ========================================================

  const platformFee = 29;

  // ========================================================
  // GST
  // ========================================================

  const gst = Math.round(
    subtotal * 0.18
  );

  // ========================================================
  // TOTAL
  // ========================================================

  const totalAmount =
    subtotal +
    deliveryCharge +
    platformFee +
    gst -
    couponDiscount;

  // ========================================================
  // TOTAL ITEMS
  // ========================================================

  const totalItems =
    safeCartItems.reduce(
      (total, item) =>
        total +
        (Number(
          item?.quantity
        ) || 0),
      0
    );

  // ========================================================
  // LOAD RAZORPAY
  // ========================================================

  const loadRazorpay = () => {
    return new Promise(
      (resolve) => {
        if (
          window.Razorpay
        ) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () =>
          resolve(true);

        script.onerror = () =>
          resolve(false);

        document.body.appendChild(
          script
        );
      }
    );
  };

  // ========================================================
  // APPLY / REMOVE REAL COUPON
  // ========================================================

  const applyCoupon = async (code) => {
    const normalizedCode = String(code || "")
      .trim()
      .toUpperCase();

    if (couponLoading) return;

    setCouponLoading(true);

    try {
      // ------------------------------------------------------
      // REMOVE COUPON
      // ------------------------------------------------------
      if (!normalizedCode) {
        const response =
          await couponService.removeCoupon();

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Unable to remove coupon."
          );
        }

        setCouponCode("");
        setCouponDiscount(0);

        await refreshCart();
        return;
      }

      // ------------------------------------------------------
      // APPLY REAL ADMIN-CREATED COUPON
      // The backend performs the actual DB validation.
      // ------------------------------------------------------
      const response =
        await couponService.applyCoupon(
          normalizedCode
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to apply coupon."
        );
      }

      const coupon =
        response?.coupon ||
        response?.data?.coupon;

      const serverDiscount = Number(
        coupon?.discountAmount ??
          response?.cartSummary?.discount ??
          response?.data?.cartSummary?.discount ??
          0
      );

      if (
        !Number.isFinite(serverDiscount) ||
        serverDiscount < 0
      ) {
        throw new Error(
          "Invalid discount returned by server."
        );
      }

      // Never trust a client-side calculation.
      // The backend is the source of truth.
      const safeDiscount = Math.min(
        serverDiscount,
        Math.max(0, subtotal)
      );

      setCouponCode(
        coupon?.code ||
          normalizedCode
      );

      setCouponDiscount(
        Number(safeDiscount.toFixed(2))
      );

      await refreshCart();
    } catch (error) {
      console.error(
        "COUPON ERROR:",
        error
      );

      setCouponCode("");
      setCouponDiscount(0);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid or unavailable coupon.";

      alert(message);
    } finally {
      setCouponLoading(false);
    }
  };

  // ========================================================
  // GET ADDRESS ID
  // ========================================================

  const getAddressId = (
    address
  ) => {
    if (!address) {
      return null;
    }

    if (
      typeof address ===
      "string"
    ) {
      return address;
    }

    if (
      address?._id
    ) {
      if (
        typeof address._id ===
        "string"
      ) {
        return address._id;
      }

      if (
        address._id?.toString
      ) {
        return address._id.toString();
      }
    }

    if (
      address?.id
    ) {
      return String(
        address.id
      );
    }

    return null;
  };

  // ========================================================
  // PLACE ORDER
  // ========================================================

  const placeOrder =
    async () => {
      // ----------------------------------------------------
      // ADDRESS
      // ----------------------------------------------------

      const addressId =
        getAddressId(
          selectedAddress
        );

      if (!addressId) {
        alert(
          "Please select a delivery address."
        );
        return;
      }

      // ----------------------------------------------------
      // CART
      // ----------------------------------------------------

      if (
        !safeCartItems.length
      ) {
        alert(
          "Your cart is empty."
        );
        return;
      }

      // ----------------------------------------------------
      // LOADING
      // ----------------------------------------------------

      setOrderLoading(true);

      try {
        // --------------------------------------------------
        // ORDER PAYLOAD
        // --------------------------------------------------

        const orderPayload = {
          items:
            safeCartItems.map(
              (item) => ({
                product:
                  item?.product?._id ||
                  item?.product ||
                  item?._id,

                quantity:
                  Number(
                    item?.quantity
                  ),

                size:
                  item?.size ||
                  "",

                color:
                  item?.color ||
                  "",
              })
            ),

          addressId,

          paymentMethod:
            selectedPayment ===
            "cod"
              ? "COD"
              : "Razorpay",

          couponCode:
            couponCode || "",

          deliveryCharge:
            Number(
              deliveryCharge
            ),

          platformFee:
            Number(
              platformFee
            ),

          gst:
            Number(gst),

          // couponCode is the only coupon input sent by the client.
          // The backend MUST recalculate the discount from MongoDB.
        };

        // --------------------------------------------------
        // CREATE ORDER
        // --------------------------------------------------

        const orderResponse =
          await createOrder(
            orderPayload
          );

        const order =
          orderResponse?.order ||
          orderResponse?.data ||
          orderResponse;

        if (
          !order ||
          !order._id
        ) {
          throw new Error(
            "Order was created but order details were not returned."
          );
        }

        // --------------------------------------------------
        // COD
        // --------------------------------------------------

        if (
          selectedPayment ===
          "cod"
        ) {
          await refreshCart();

          navigate(
            `/orders/${order._id}`
          );

          return;
        }

        // --------------------------------------------------
        // RAZORPAY SDK
        // --------------------------------------------------

        const sdkLoaded =
          await loadRazorpay();

        if (!sdkLoaded) {
          throw new Error(
            "Unable to load Razorpay."
          );
        }

        // --------------------------------------------------
        // AUTH TOKEN
        // --------------------------------------------------

        const authToken =
          localStorage.getItem(
            "fashionstore-token"
          ) ||
          localStorage.getItem(
            "token"
          );

        if (!authToken) {
          throw new Error(
            "Your login session has expired. Please login again."
          );
        }

        // --------------------------------------------------
        // CREATE RAZORPAY ORDER
        // --------------------------------------------------

        const razorpayResponse =
          await paymentService.createRazorpayOrder(
            {
              orderId:
                order._id,
            }
          );

        const razorpayOrder =
          razorpayResponse?.razorpayOrder ||
          razorpayResponse?.order ||
          razorpayResponse?.data
            ?.razorpayOrder ||
          razorpayResponse?.data ||
          razorpayResponse;

        const razorpayKey =
          razorpayResponse?.key ||
          razorpayResponse?.data
            ?.key ||
          razorpayOrder?.key;

        if (
          !razorpayOrder?.id
        ) {
          throw new Error(
            "Razorpay order could not be created."
          );
        }

        if (!razorpayKey) {
          throw new Error(
            "Razorpay key was not returned by the server."
          );
        }

        // --------------------------------------------------
        // RAZORPAY OPTIONS
        // --------------------------------------------------

        const options = {
          key:
            razorpayKey,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,

          name:
            "FashionStore",

          description:
            "Order Payment",

          order_id:
            razorpayOrder.id,

          // -----------------------------------------------
          // PAYMENT SUCCESS
          // -----------------------------------------------

          handler:
            async (
              response
            ) => {
              try {
                await paymentService.verifyPayment(
                  {
                    orderId:
                      order._id,

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }
                );

                await refreshCart();

                navigate(
                  `/orders/${order._id}`
                );
              } catch (
                error
              ) {
                console.error(
                  "PAYMENT VERIFICATION ERROR:",
                  error
                );

                alert(
                  error?.response
                    ?.data
                    ?.message ||
                    error?.message ||
                    "Payment verification failed."
                );
              }
            },

          // -----------------------------------------------
          // PAYMENT CANCEL
          // -----------------------------------------------

          modal: {
            ondismiss:
              async () => {
                try {
                  await paymentService.paymentFailed(
                    {
                      orderId:
                        order._id,

                      reason:
                        "Payment cancelled by user",
                    }
                  );
                } catch (
                  error
                ) {
                  console.error(
                    "PAYMENT FAILED UPDATE ERROR:",
                    error
                  );
                }
              },
          },

          // -----------------------------------------------
          // RAZORPAY THEME
          // -----------------------------------------------

          theme: {
            color:
              "#D4AF37",
          },
        };

        // --------------------------------------------------
        // OPEN RAZORPAY
        // --------------------------------------------------

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();
      } catch (
        error
      ) {
        console.error(
          "CREATE ORDER ERROR:",
          error
        );

        alert(
          error?.response
            ?.data
            ?.message ||
            error?.message ||
            "Unable to place order."
        );
      } finally {
        setOrderLoading(
          false
        );
      }
    };

  // ========================================================
  // EMPTY CART
  // ========================================================

  if (
    !safeCartItems.length
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-brand-bg
          px-4
          py-10
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            max-w-xl
            items-center
            justify-center
          "
        >
          <div
            className="
              w-full
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-6
              text-center
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
              sm:p-8
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-accent-soft
                text-accent
              "
            >
              <FiShoppingBag
                size={23}
              />
            </div>

            <h1
              className="
                mt-4
                text-xl
                font-bold
                text-text-primary
                sm:text-2xl
              "
            >
              Your cart is empty
            </h1>

            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-xs
                leading-5
                text-text-secondary
                sm:text-sm
              "
            >
              Add something you love
              before continuing to
              checkout.
            </p>

            <Link
              to="/products"
              className="
                mt-5
                inline-flex
                items-center
                justify-center
                rounded-lg
                bg-accent
                px-5
                py-2.5
                text-xs
                font-bold
                text-black
                transition-all
                duration-300
                hover:bg-accent-hover
                hover:shadow-lg
                active:scale-95
              "
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ========================================================
  // MAIN UI
  // ========================================================

  return (
    <main
      className="
        min-h-screen
        bg-brand-bg
        text-text-primary
      "
    >
      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div
        className="
          border-b
          border-border-subtle
          bg-brand-bg/95
        "
      >
        <div
          className="
            mx-auto
            flex
            h-11
            w-full
            max-w-[1180px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <Link
            to="/cart"
            className="
              group
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-semibold
              text-text-secondary
              transition-colors
              hover:text-accent
              sm:text-xs
            "
          >
            <FiArrowLeft
              size={13}
              className="
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            />

            Back to Cart
          </Link>

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[9px]
              font-semibold
              text-green-400
              sm:text-[10px]
            "
          >
            <FiShield
              size={12}
            />

            Secure Checkout
          </div>
        </div>
      </div>

      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1180px]
          px-4
          py-5
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-8
        "
      >
        {/* =================================================
            CHECKOUT HEADER
        ================================================= */}

        <CheckoutHeader
          currentStep={3}
        />

        {/* =================================================
            COMPACT CHECKOUT META
        ================================================= */}

        <div
          className="
            mb-5
            mt-5
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-2
            border-b
            border-border-subtle
            pb-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-text-secondary
              sm:text-xs
            "
          >
            <FiShoppingBag
              size={13}
              className="text-accent"
            />

            <span>
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </span>
          </div>

          <div
            className="
              hidden
              h-3
              w-px
              bg-border-subtle
              sm:block
            "
          />

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-text-secondary
              sm:text-xs
            "
          >
            <FiTruck
              size={13}
              className="text-accent"
            />

            <span>
              {deliveryCharge ===
              0
                ? "Free delivery"
                : "Standard delivery"}
            </span>
          </div>

          <div
            className="
              hidden
              h-3
              w-px
              bg-border-subtle
              sm:block
            "
          />

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[10px]
              text-green-400
              sm:text-xs
            "
          >
            <FiCheckCircle
              size={13}
            />

            <span>
              Secure payment
            </span>
          </div>
        </div>

        {/* =================================================
            CHECKOUT GRID
        ================================================= */}

        <div
          className="
            grid
            items-start
            gap-5
            lg:grid-cols-[minmax(0,1fr)_340px]
            xl:grid-cols-[minmax(0,1fr)_350px]
          "
        >
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div
            className="
              min-w-0
              space-y-4
            "
          >
            {/* =================================================
                ADDRESS
            ================================================= */}

            <SavedAddresses
              selectedAddress={
                selectedAddress
              }
              onSelect={(
                address
              ) => {
                setSelectedAddress(
                  address
                );
              }}
              showAddressForm={
                showAddressForm
              }
              onToggleAddressForm={() =>
                setShowAddressForm(
                  (prev) =>
                    !prev
                )
              }
            />

            {/* =================================================
                ADDRESS FORM
            ================================================= */}

            {showAddressForm && (
              <div
                className="
                  animate-[fadeIn_0.3s_ease-out]
                "
              >
                <AddressForm
                  onSave={(
                    address
                  ) => {
                    const addressId =
                      getAddressId(
                        address
                      );

                    if (!addressId) {
                      alert(
                        "Address saved, but its ID was not returned. Please refresh and select the address."
                      );

                      return;
                    }

                    setSelectedAddress(
                      addressId
                    );

                    setShowAddressForm(
                      false
                    );
                  }}
                />
              </div>
            )}

            {/* =================================================
                DELIVERY
            ================================================= */}

            <DeliveryOptions
              selectedOption={
                deliveryType
              }
              onSelect={
                setDeliveryType
              }
            />

            {/* =================================================
                PAYMENT
            ================================================= */}

            <PaymentMethods
              selectedMethod={
                selectedPayment
              }
              onSelect={
                setSelectedPayment
              }
            />

            {/* =================================================
                COUPON
            ================================================= */}

            <CouponBox
              loading={
                couponLoading
              }
              onApplyCoupon={
                applyCoupon
              }
            />

            {/* =================================================
                ORDER ITEMS
            ================================================= */}

            <OrderSummary
              items={
                safeCartItems
              }
              onIncreaseQuantity={
                increaseQuantity
              }
              onDecreaseQuantity={
                decreaseQuantity
              }
              onRemove={
                removeFromCart
              }
              onMoveToWishlist={
                moveToWishlist
              }
            />
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside
            className="
              min-w-0
              lg:sticky
              lg:top-4
            "
          >
            <div
              className="
                space-y-4
              "
            >
              {/* =============================================
                  PRICE DETAILS
              ============================================= */}

              <PriceDetails
                subtotal={
                  subtotal
                }
                deliveryCharge={
                  deliveryCharge
                }
                platformFee={
                  platformFee
                }
                couponDiscount={
                  couponDiscount
                }
                gst={gst}
              />

              {/* =============================================
                  PLACE ORDER
              ============================================= */}

              <PlaceOrderButton
                loading={
                  orderLoading
                }
                disabled={
                  safeCartItems.length ===
                    0 ||
                  !getAddressId(
                    selectedAddress
                  ) ||
                  orderLoading
                }
                onPlaceOrder={
                  placeOrder
                }
              />

              {/* =============================================
                  SMALL TRUST STRIP
              ============================================= */}

              <div
                className="
                  rounded-xl
                  border
                  border-border-subtle
                  bg-surface
                  px-3
                  py-2.5
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-x-4
                    gap-y-2
                  "
                >
                  <TrustItem
                    text="Secure payment"
                  />

                  <TrustItem
                    text="Safe checkout"
                  />

                  <TrustItem
                    text="Easy returns"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* =================================================
            BOTTOM TRUST MESSAGE
        ================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            items-center
            justify-center
            gap-2
            border-t
            border-border-subtle
            pt-5
            text-center
            sm:flex-row
            sm:gap-3
          "
        >
          <FiShield
            size={14}
            className="text-green-400"
          />

          <p
            className="
              text-[9px]
              leading-4
              text-text-muted
              sm:text-[10px]
            "
          >
            Your personal and payment
            information is protected
            throughout checkout.
          </p>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// TRUST ITEM
// ============================================================

function TrustItem({
  text,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-1.5
      "
    >
      <FiCheckCircle
        size={10}
        className="text-green-400"
      />

      <span
        className="
          text-[8px]
          font-medium
          text-text-muted
          sm:text-[9px]
        "
      >
        {text}
      </span>
    </div>
  );
}

export default Checkout;