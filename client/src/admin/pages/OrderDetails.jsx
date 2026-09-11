import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiRefreshCw,
} from "react-icons/fi";

import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";

import orderService from "../services/orderService";

function OrderDetails() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  // ==========================================
  // STATES
  // ==========================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    order,
    setOrder,
  ] = useState(null);

  // ==========================================
  // LOAD ORDER
  // ==========================================

  const loadOrder =
    async () => {

      try {

        setLoading(true);

        const response =
          await orderService.getOrderById(
            id
          );

        setOrder(
          response.order
        );

      } catch (error) {

        console.error(error);

        alert(
          error.message
        );

        navigate(
          "/admin/orders"
        );

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadOrder();

  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div
        className="
          flex
          h-[70vh]
          items-center
          justify-center
          text-xl
          font-semibold
          text-text-primary
        "
      >
        Loading Order...
      </div>

    );

  }

  if (!order) {

    return (

      <div
        className="
          flex
          h-[70vh]
          items-center
          justify-center
          text-xl
          font-semibold
          text-red-400
        "
      >
        Order Not Found
      </div>

    );

  }

  // ==========================================
  // JSX
  // ==========================================

  return (

    <div className="space-y-8">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <PageHeader
        title={`Order #${order.orderNumber || order._id}`}

        subtitle="View complete order information."

        breadcrumbs={[
          "Admin",
          "Orders",
          "Order Details",
        ]}

        action={

          <div className="flex gap-3">

            <button
              type="button"
              onClick={loadOrder}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-border-subtle
                bg-surface
                px-5
                py-3
                text-text-primary
                transition
                hover:border-accent
              "
            >

              <FiRefreshCw />

              Refresh

            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/orders")
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-border-subtle
                bg-surface
                px-5
                py-3
                text-text-primary
                transition
                hover:border-accent
              "
            >

              <FiArrowLeft />

              Back

            </button>

          </div>

        }

      />
            {/* ==========================================
          ORDER SUMMARY
      ========================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ==========================================
            ORDER INFORMATION
        ========================================== */}

        <div
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >

          <h2
            className="
              mb-5
              text-xl
              font-bold
              text-text-primary
            "
          >
            Order Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Order ID
              </span>

              <span className="font-semibold text-text-primary">
                {order.orderNumber || order._id}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Order Date
              </span>

              <span className="font-semibold text-text-primary">

                {new Date(
                  order.createdAt
                ).toLocaleDateString()}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Status
              </span>

              <StatusBadge
                status={order.status}
              />

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Payment
              </span>

              <StatusBadge
                status={
                  order.paymentStatus
                }
              />

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Total
              </span>

              <span
                className="
                  text-lg
                  font-bold
                  text-accent
                "
              >
                ₹
                {Number(
                  order.totalAmount || 0
                ).toLocaleString()}
              </span>

            </div>

          </div>

        </div>

        {/* ==========================================
            CUSTOMER
        ========================================== */}

        <div
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >

          <h2
            className="
              mb-5
              text-xl
              font-bold
              text-text-primary
            "
          >
            Customer
          </h2>

          <div className="space-y-4">

            <div>

              <p className="text-sm text-text-secondary">
                Name
              </p>

              <p className="font-semibold text-text-primary">
                {order.user?.name ||
                  order.shippingAddress?.fullName ||
                  "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-text-secondary">
                Email
              </p>

              <p className="font-semibold text-text-primary">
                {order.user?.email || "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-text-secondary">
                Phone
              </p>

              <p className="font-semibold text-text-primary">
                {order.user?.phone ||
                  order.shippingAddress?.phone ||
                  "-"}
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            SHIPPING ADDRESS
        ========================================== */}

        <div
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >

          <h2
            className="
              mb-5
              text-xl
              font-bold
              text-text-primary
            "
          >
            Shipping Address
          </h2>

          <div className="space-y-2 text-text-primary">

            <p>
              {order.shippingAddress?.fullName}
            </p>

            <p>
              {order.shippingAddress?.phone}
            </p>

            <p>
              {[
                order.shippingAddress?.houseNumber,
                order.shippingAddress?.area,
              ]
                .filter(Boolean)
                .join(", ") || "-"}
            </p>

            {order.shippingAddress?.landmark && (
              <p>
                Landmark: {order.shippingAddress.landmark}
              </p>
            )}

            <p>
              {order.shippingAddress?.city || "-"}
            </p>

            <p>
              {order.shippingAddress?.state}
            </p>

            <p>
              {order.shippingAddress?.country}
            </p>

            <p>
              {order.shippingAddress?.postalCode}
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          PAYMENT DETAILS
      ========================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
        "
      >

        <h2
          className="
            mb-6
            text-xl
            font-bold
            text-text-primary
          "
        >
          Payment Information
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <p className="text-sm text-text-secondary">
              Payment Method
            </p>

            <p className="mt-1 font-semibold text-text-primary">
              {order.paymentMethod}
            </p>

          </div>

          <div>

            <p className="text-sm text-text-secondary">
              Payment Status
            </p>

            <div className="mt-2">

              <StatusBadge
                status={order.paymentStatus}
              />

            </div>

          </div>

          <div>

            <p className="text-sm text-text-secondary">
              Transaction ID
            </p>

            <p className="mt-1 break-all font-semibold text-text-primary">
              {order.transactionId || "-"}
            </p>

          </div>

        </div>

      </div>
            {/* ==========================================
          ORDERED PRODUCTS
      ========================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
        "
      >

        <h2
          className="
            mb-6
            text-xl
            font-bold
            text-text-primary
          "
        >
          Ordered Products
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-border-subtle">

                <th className="py-4 text-left text-text-secondary">
                  Product
                </th>

                <th className="py-4 text-center text-text-secondary">
                  Price
                </th>

                <th className="py-4 text-center text-text-secondary">
                  Qty
                </th>

                <th className="py-4 text-right text-text-secondary">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {order.items?.map(
                (item, index) => (

                  <tr
                    key={index}
                    className="
                      border-b
                      border-border-subtle
                    "
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            item.image ||
                            "https://placehold.co/80x80"
                          }
                          alt={
                            item.product?.name
                          }
                          className="
                            h-16
                            w-16
                            rounded-xl
                            object-cover
                            border
                            border-border-subtle
                          "
                        />

                        <div>

                          <p className="font-semibold text-text-primary">
                            {
                              item.product?.name ||
                              item.name
                            }
                          </p>

                          <p className="text-sm text-text-secondary">
                            SKU :
                            {" "}
                            {
                              item.product?.sku ||
                              "-"
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="text-center font-semibold text-text-primary">
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </td>

                    <td className="text-center text-text-primary">
                      {item.quantity}
                    </td>

                    <td className="text-right font-bold text-accent">
                      ₹
                      {Number(
                        item.total ??
                        (Number(item.price || 0) *
                          Number(item.quantity || 0))
                      ).toLocaleString()}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          PRICE SUMMARY
      ========================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >

          <h2
            className="
              mb-5
              text-xl
              font-bold
              text-text-primary
            "
          >
            Price Details
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Subtotal
              </span>

              <span className="font-semibold text-text-primary">
                ₹
                {Number(
                  order.subtotal || 0
                ).toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Shipping
              </span>

              <span className="font-semibold text-text-primary">
                ₹
                {Number(
                  order.shippingCharge || 0
                ).toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Tax
              </span>

              <span className="font-semibold text-text-primary">
                ₹
                {Number(
                  order.tax || 0
                ).toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-text-secondary">
                Discount
              </span>

              <span className="font-semibold text-green-400">
                - ₹
                {Number(
                  order.discount || 0
                ).toLocaleString()}
              </span>

            </div>

            <div className="border-t border-border-subtle pt-4">

              <div className="flex justify-between">

                <span className="text-lg font-bold text-text-primary">
                  Grand Total
                </span>

                <span className="text-xl font-bold text-accent">
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString()}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            ORDER TIMELINE
        ========================================== */}

        <div
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-6
          "
        >

          <h2
            className="
              mb-5
              text-xl
              font-bold
              text-text-primary
            "
          >
            Order Timeline
          </h2>

          <div className="space-y-5">

            <div>

              <p className="font-semibold text-text-primary">
                Order Placed
              </p>

              <p className="text-sm text-text-secondary">
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="font-semibold text-text-primary">
                Current Status
              </p>

              <div className="mt-2">

                <StatusBadge
                  status={order.status}
                />

              </div>

            </div>

            <div>

              <p className="font-semibold text-text-primary">
                Last Updated
              </p>

              <p className="text-sm text-text-secondary">
                {new Date(
                  order.updatedAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* ==========================================
          ADMIN ACTIONS
      ========================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
        "
      >

        <h2
          className="
            mb-6
            text-xl
            font-bold
            text-text-primary
          "
        >
          Admin Actions
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Change Status */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-text-secondary
              "
            >
              Change Order Status
            </label>

            <select
              defaultValue={order.status}
              onChange={async (event) => {

                const newStatus =
                  event.target.value;

                if (
                  !newStatus ||
                  newStatus === order.status
                ) {
                  return;
                }

                try {

                  await orderService.updateOrderStatus(
                    id,
                    newStatus
                  );

                  await loadOrder();

                  alert(
                    "Order status updated successfully."
                  );

                } catch (error) {

                  console.error(
                    "Update Order Status Error:",
                    error
                  );

                  alert(
                    error?.message ||
                    "Failed to update order status."
                  );

                }

              }}
              className="
                w-full
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                px-4
                py-3
                text-text-primary
                outline-none
                focus:border-accent
              "
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Packed">
                Packed
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Out For Delivery">
                Out For Delivery
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

              <option value="Returned">
                Returned
              </option>

            </select>

          </div>

          {/* Admin Note */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-text-secondary
              "
            >
              Admin Note
            </label>

            <textarea
              rows={4}
              placeholder="Write internal notes..."
              className="
                w-full
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                px-4
                py-3
                text-text-primary
                outline-none
                focus:border-accent
              "
            />

          </div>

        </div>

        {/* Action Buttons */}

        <div
          className="
            mt-8
            flex
            flex-wrap
            justify-end
            gap-4
          "
        >

          <button
            type="button"
            onClick={() => window.print()}
            className="
              rounded-xl
              border
              border-border-subtle
              px-6
              py-3
              text-text-primary
              transition
              hover:border-accent
            "
          >
            Print Invoice
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Download Invoice API will be connected."
              )
            }
            className="
              rounded-xl
              border
              border-border-subtle
              px-6
              py-3
              text-text-primary
              transition
              hover:border-accent
            "
          >
            Download Invoice
          </button>

          <button
            type="button"
            onClick={async () => {

              if (
                !window.confirm(
                  "Cancel this order?"
                )
              ) {
                return;
              }

              try {

                await orderService.updateOrderStatus(
                  id,
                  "Cancelled"
                );

                await loadOrder();

                alert(
                  "Order cancelled successfully."
                );

              } catch (error) {

                console.error(
                  "Cancel Order Error:",
                  error
                );

                alert(
                  error?.message ||
                  "Failed to cancel order."
                );

              }

            }}
            className="
              rounded-xl
              bg-red-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-700
            "
          >
            Cancel Order
          </button>

        </div>

      </div>

    </div>

  );

}

export default OrderDetails;