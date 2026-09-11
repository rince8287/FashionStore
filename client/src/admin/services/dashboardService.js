const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ==========================================
// GET TOKEN
// ==========================================

const getToken = () => {
  return localStorage.getItem("fashionstore-token");
};

// ==========================================
// REQUEST HELPER
// ==========================================

const request = async (
  endpoint,
  options = {}
) => {

  const token = getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {

      ...options,

      headers: {

        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...options.headers,

      },

    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Something went wrong."
    );
  }

  return data;
};

// ==========================================
// DASHBOARD SERVICE
// ==========================================

const dashboardService = {

  // ========================================
  // COMPLETE DASHBOARD
  // ========================================

  async getDashboard() {

    return await request(
      "/admin/dashboard",
      {
        method: "GET",
      }
    );

  },

};

export default dashboardService;