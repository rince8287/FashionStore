import axios from "axios";

// ======================================================
// API
// ======================================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/address`
      : "http://localhost:5000/api/v1/address",

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// AUTH CONFIG
// ======================================================

const getAuthConfig = () => {
  const token = localStorage.getItem(
    "fashionstore-token"
  );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// GET ALL ADDRESSES
// GET /api/v1/address
// ======================================================

export const getAddresses =
  async () => {
    const { data } = await API.get(
      "/",
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// GET SINGLE ADDRESS
// GET /api/v1/address/:id
// ======================================================

export const getAddressById =
  async (id) => {
    const { data } = await API.get(
      `/${id}`,
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// CREATE ADDRESS
// POST /api/v1/address
// ======================================================

export const createAddress =
  async (addressData) => {
    const { data } = await API.post(
      "/",
      addressData,
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// UPDATE ADDRESS
// PUT /api/v1/address/:id
// ======================================================

export const updateAddress =
  async (
    id,
    addressData
  ) => {
    const { data } = await API.put(
      `/${id}`,
      addressData,
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// DELETE ADDRESS
// DELETE /api/v1/address/:id
// ======================================================

export const deleteAddress =
  async (id) => {
    const { data } = await API.delete(
      `/${id}`,
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// SET DEFAULT ADDRESS
// PATCH /api/v1/address/:id/default
// ======================================================

export const setDefaultAddress =
  async (id) => {
    const { data } = await API.patch(
      `/${id}/default`,
      {},
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// DEFAULT EXPORT
// ======================================================

const addressService = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

export default addressService;