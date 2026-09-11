const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const getToken = () => {
  return (
    localStorage.getItem("fashionstore-token") ||
    localStorage.getItem("token") ||
    ""
  );
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...(options.headers || {}),
  };

  let response;

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        credentials: "include",
        headers,
      }
    );
  } catch (error) {
    console.error(
      "Payment Network Error:",
      error
    );

    throw new Error(
      "Unable to connect to payment server."
    );
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Payment request failed with status ${response.status}.`
    );
  }

  return data;
};

export const createRazorpayOrder = async (
  orderData
) => {
  if (!orderData?.orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  return request(
    "/payments/create-order",
    {
      method: "POST",
      body: JSON.stringify(orderData),
    }
  );
};

export const verifyPayment = async (
  paymentData
) => {
  if (!paymentData?.orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  return request(
    "/payments/verify",
    {
      method: "POST",
      body: JSON.stringify(paymentData),
    }
  );
};

export const paymentFailed = async (
  paymentData
) => {
  if (!paymentData?.orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  return request(
    "/payments/failure",
    {
      method: "POST",
      body: JSON.stringify(paymentData),
    }
  );
};

export const getPaymentStatus = async (
  orderId
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  return request(
    `/payments/${orderId}/status`,
    {
      method: "GET",
    }
  );
};

export const createRefund = async (
  orderId,
  refundData = {}
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  return request(
    `/payments/${orderId}/refund`,
    {
      method: "POST",
      body: JSON.stringify(refundData),
    }
  );
};

export const getRefundStatus = async (
  orderId
) => {
  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  return request(
    `/payments/${orderId}/refund-status`,
    {
      method: "GET",
    }
  );
};

const paymentService = {
  createRazorpayOrder,
  verifyPayment,
  paymentFailed,
  getPaymentStatus,
  createRefund,
  getRefundStatus,
};

export default paymentService;