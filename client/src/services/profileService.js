const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const getToken = () => {
  return localStorage.getItem("fashionstore-token");
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
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

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

const profileService = {
  async getProfile() {
    return request("/users/me", {
      method: "GET",
    });
  },

  async updateProfile(updatedData) {
    return request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
  },

  async updateProfilePhoto(imageFile) {
    if (!imageFile) {
      throw new Error("Please select an image.");
    }

    const formData = new FormData();

    formData.append("image", imageFile);

    return request("/upload/profile", {
      method: "POST",
      body: formData,
    });
  },

  async updateLanguage(language) {
    return request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({
        language,
      }),
    });
  },

  async getWallet() {
    return request("/wallet", {
      method: "GET",
    });
  },

  async getBankDetails() {
    return request("/users/me/bank-details", {
      method: "GET",
    });
  },

  async updateBankDetails(bankDetails) {
    return request("/users/me/bank-details", {
      method: "PUT",
      body: JSON.stringify(bankDetails),
    });
  },

  async getUpiDetails() {
    return request("/users/me/upi-details", {
      method: "GET",
    });
  },

  async updateUpiDetails(upiDetails) {
    return request("/users/me/upi-details", {
      method: "PUT",
      body: JSON.stringify(upiDetails),
    });
  },

  async getRewards() {
    return request("/auth/rewards", {
      method: "GET",
    });
  },

  async logout() {
    try {
      const result = await request("/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("fashionstore-token");
      localStorage.removeItem("fashionstore-user");

      return result;
    } catch (error) {
      localStorage.removeItem("fashionstore-token");
      localStorage.removeItem("fashionstore-user");

      throw error;
    }
  },
};

export default profileService;