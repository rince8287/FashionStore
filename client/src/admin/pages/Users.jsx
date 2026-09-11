import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldCheck,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// TOKEN
// ======================================================

const getToken = () => {
  return localStorage.getItem(
    "fashionstore-token"
  );
};

// ======================================================
// COMMON REQUEST
// ======================================================

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
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
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

// ======================================================
// USERS PAGE
// ======================================================

function Users() {
  // ====================================================
  // USERS
  // ====================================================

  const [users, setUsers] = useState([]);

  // ====================================================
  // LOADING
  // ====================================================

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // ERROR
  // ====================================================

  const [error, setError] =
    useState("");

  // ====================================================
  // SEARCH
  // ====================================================

  const [search, setSearch] =
    useState("");

  // ====================================================
  // STATUS
  // ====================================================

  const [status, setStatus] =
    useState("all");

  // ====================================================
  // PAGE
  // ====================================================

  const [page, setPage] =
    useState(1);

  // ====================================================
  // LIMIT
  // ====================================================

  const limit = 10;

  // ====================================================
  // PAGINATION
  // ====================================================

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });

  // ====================================================
  // STATISTICS
  // ====================================================

  const [statistics, setStatistics] =
    useState({
      totalCustomers: 0,
      activeCustomers: 0,
      blockedCustomers: 0,
      verifiedCustomers: 0,
      unverifiedCustomers: 0,
      recentCustomers: 0,
    });

  // ====================================================
  // SELECTED USER
  // ====================================================

  const [selectedUser, setSelectedUser] =
    useState(null);

  // ====================================================
  // DETAILS LOADING
  // ====================================================

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  // ====================================================
  // ACTION LOADING
  // ====================================================

  const [actionLoading, setActionLoading] =
    useState("");

  // ====================================================
  // FETCH USERS
  // ====================================================

  const fetchUsers = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        params.set(
          "page",
          page
        );

        params.set(
          "limit",
          limit
        );

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (status !== "all") {
          params.set(
            "status",
            status
          );
        }

        const data =
          await request(
            `/users/admin/all?${params.toString()}`
          );

        setUsers(
          data?.users || []
        );

        setPagination(
          data?.pagination || {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } catch (err) {
        console.error(
          "FETCH USERS ERROR:",
          err
        );

        setError(
          err.message ||
            "Failed to load customers."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      search,
      status,
    ]
  );

  // ====================================================
  // FETCH STATISTICS
  // ====================================================

  const fetchStatistics =
    useCallback(async () => {
      try {
        const data =
          await request(
            "/users/admin/statistics"
          );

        setStatistics(
          data?.statistics || {
            totalCustomers: 0,
            activeCustomers: 0,
            blockedCustomers: 0,
            verifiedCustomers: 0,
            unverifiedCustomers: 0,
            recentCustomers: 0,
          }
        );
      } catch (err) {
        console.error(
          "FETCH USER STATISTICS ERROR:",
          err
        );
      }
    }, []);

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh =
    async () => {
      await Promise.all([
        fetchUsers(),
        fetchStatistics(),
      ]);
    };

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    setPage(1);
  };

  // ====================================================
  // VIEW USER
  // ====================================================

  const handleViewUser =
    async (userId) => {
      try {
        setDetailsLoading(true);
        setSelectedUser(null);

        const data =
          await request(
            `/users/admin/${userId}`
          );

        setSelectedUser(
          data?.user || null
        );
      } catch (err) {
        console.error(
          "VIEW USER ERROR:",
          err
        );

        alert(
          err.message ||
            "Failed to load customer details."
        );
      } finally {
        setDetailsLoading(false);
      }
    };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    setSelectedUser(null);
  };

  // ====================================================
  // VERIFY USER
  // ====================================================

  const handleVerify =
    async (user) => {
      try {
        setActionLoading(
          user._id
        );

        await request(
          `/users/admin/${user._id}/verify`,
          {
            method: "PATCH",
          }
        );

        alert(
          "Customer verified successfully."
        );

        setSelectedUser(null);

        await Promise.all([
          fetchUsers(),
          fetchStatistics(),
        ]);
      } catch (err) {
        console.error(
          "VERIFY USER ERROR:",
          err
        );

        alert(
          err.message ||
            "Failed to verify customer."
        );
      } finally {
        setActionLoading("");
      }
    };

  // ====================================================
  // BLOCK USER
  // ====================================================

  const handleBlock =
    async (user) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to block ${user.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          user._id
        );

        await request(
          `/users/admin/${user._id}/block`,
          {
            method: "PATCH",
          }
        );

        alert(
          "Customer blocked successfully."
        );

        setSelectedUser(null);

        await Promise.all([
          fetchUsers(),
          fetchStatistics(),
        ]);
      } catch (err) {
        console.error(
          "BLOCK USER ERROR:",
          err
        );

        alert(
          err.message ||
            "Failed to block customer."
        );
      } finally {
        setActionLoading("");
      }
    };

  // ====================================================
  // UNBLOCK USER
  // ====================================================

  const handleUnblock =
    async (user) => {
      try {
        setActionLoading(
          user._id
        );

        await request(
          `/users/admin/${user._id}/unblock`,
          {
            method: "PATCH",
          }
        );

        alert(
          "Customer unblocked successfully."
        );

        setSelectedUser(null);

        await Promise.all([
          fetchUsers(),
          fetchStatistics(),
        ]);
      } catch (err) {
        console.error(
          "UNBLOCK USER ERROR:",
          err
        );

        alert(
          err.message ||
            "Failed to unblock customer."
        );
      } finally {
        setActionLoading("");
      }
    };

  // ====================================================
  // DELETE USER
  // ====================================================

  const handleDelete =
    async (user) => {
      const confirmed =
        window.confirm(
          `Delete "${user.name}" permanently? This action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          user._id
        );

        await request(
          `/users/admin/${user._id}`,
          {
            method: "DELETE",
          }
        );

        alert(
          "Customer deleted successfully."
        );

        setSelectedUser(null);

        // Agar last user delete ho gaya
        // to previous page par chale jao.
        if (
          users.length === 1 &&
          page > 1
        ) {
          setPage(
            (current) =>
              current - 1
          );
        } else {
          await fetchUsers();
        }

        await fetchStatistics();
      } catch (err) {
        console.error(
          "DELETE USER ERROR:",
          err
        );

        alert(
          err.message ||
            "Failed to delete customer."
        );
      } finally {
        setActionLoading("");
      }
    };

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ====================================================
  // FORMAT DATE TIME
  // ====================================================

  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(
      value
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (
    loading &&
    users.length === 0
  ) {
    return (
      <div className="min-h-full bg-brand-bg p-4 sm:p-6 lg:p-8">

        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-elevated" />

          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-surface-elevated" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            1,
            2,
            3,
            4,
          ].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-border-subtle bg-surface"
              />
            )
          )}
        </div>

        <div className="mt-6 h-96 animate-pulse rounded-2xl border border-border-subtle bg-surface" />

      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-full bg-brand-bg p-4 text-text-primary sm:p-6 lg:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Customers
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Manage registered customers and their accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-border-subtle
            bg-surface
            px-4
            py-3
            text-sm
            font-medium
            transition
            hover:bg-surface-elevated
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() => {
              setError("");
              fetchUsers();
            }}
            className="font-semibold underline"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==================================================
          STAT CARDS
      ================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="rounded-2xl border border-border-subtle bg-surface p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-text-secondary">
                Total Customers
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.totalCustomers}
              </p>
            </div>

            <div className="rounded-xl bg-accent-soft p-3 text-accent">
              <UsersIcon size={22} />
            </div>

          </div>

        </div>

        {/* ACTIVE */}

        <div className="rounded-2xl border border-border-subtle bg-surface p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-text-secondary">
                Active Customers
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.activeCustomers}
              </p>
            </div>

            <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
              <UserCheck size={22} />
            </div>

          </div>

        </div>

        {/* BLOCKED */}

        <div className="rounded-2xl border border-border-subtle bg-surface p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-text-secondary">
                Blocked Customers
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.blockedCustomers}
              </p>
            </div>

            <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
              <UserX size={22} />
            </div>

          </div>

        </div>

        {/* VERIFIED */}

        <div className="rounded-2xl border border-border-subtle bg-surface p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-text-secondary">
                Verified Customers
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.verifiedCustomers}
              </p>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <ShieldCheck size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          SEARCH / FILTER
      ================================================== */}

      <div className="mt-6 rounded-2xl border border-border-subtle bg-surface p-4">

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >

          <div className="relative flex-1">

            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );

                setPage(1);
              }}
              placeholder="Search by name, email or phone..."
              className="
                w-full
                rounded-xl
                border
                border-border-subtle
                bg-brand-bg
                py-3
                pl-11
                pr-4
                text-sm
                text-text-primary
                outline-none
                placeholder:text-text-muted
                focus:border-accent
              "
            />

          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value
              );

              setPage(1);
            }}
            className="
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              px-4
              py-3
              text-sm
              text-text-primary
              outline-none
              focus:border-accent
            "
          >

            <option value="all">
              All Customers
            </option>

            <option value="active">
              Active
            </option>

            <option value="blocked">
              Blocked
            </option>

            <option value="verified">
              Verified
            </option>

            <option value="unverified">
              Unverified
            </option>

          </select>

          <button
            type="submit"
            className="
              rounded-xl
              bg-accent
              px-6
              py-3
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-accent-hover
            "
          >
            Search
          </button>

        </form>

      </div>

      {/* ==================================================
          USERS TABLE
      ================================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle bg-surface">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="border-b border-border-subtle bg-surface-elevated">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Joined
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-border-subtle">

              {users.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="px-5 py-16 text-center"
                  >

                    <UsersIcon
                      size={42}
                      className="mx-auto text-text-muted"
                    />

                    <p className="mt-4 font-semibold">
                      No customers found
                    </p>

                    <p className="mt-1 text-sm text-text-secondary">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>

              ) : (

                users.map(
                  (user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-surface-elevated"
                    >

                      {/* CUSTOMER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          {user.avatar ? (

                            <img
                              src={
                                user.avatar
                              }
                              alt={
                                user.name
                              }
                              className="h-11 w-11 rounded-full object-cover"
                            />

                          ) : (

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-accent">
                              {user.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                          )}

                          <div className="min-w-0">

                            <p className="truncate font-semibold">
                              {user.name ||
                                "-"}
                            </p>

                            <p className="text-xs text-text-muted">
                              ID:{" "}
                              {user._id?.slice(
                                -8
                              )}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <p className="max-w-[260px] truncate text-sm">
                          {user.email ||
                            "-"}
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          {user.phone ||
                            "-"}
                        </p>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <div className="flex flex-col items-start gap-2">

                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              ${
                                user.isActive
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-red-500/10 text-red-400"
                              }
                            `}
                          >
                            {user.isActive
                              ? "Active"
                              : "Blocked"}
                          </span>

                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-xs
                              font-semibold
                              ${
                                user.isVerified
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                              }
                            `}
                          >
                            {user.isVerified
                              ? "Verified"
                              : "Unverified"}
                          </span>

                        </div>

                      </td>

                      {/* JOINED */}

                      <td className="px-5 py-4 text-sm">
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleViewUser(
                                user._id
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-border-subtle
                              p-2
                              text-text-secondary
                              transition
                              hover:border-accent
                              hover:text-accent
                            "
                            title="View customer"
                          >
                            <Eye
                              size={17}
                            />
                          </button>

                          {/* BLOCK / UNBLOCK */}

                          {user.isActive ? (

                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                user._id
                              }
                              onClick={() =>
                                handleBlock(
                                  user
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-red-500/20
                                p-2
                                text-red-400
                                transition
                                hover:bg-red-500/10
                                disabled:opacity-50
                              "
                              title="Block customer"
                            >
                              <Ban
                                size={17}
                              />
                            </button>

                          ) : (

                            <button
                              type="button"
                              disabled={
                                actionLoading ===
                                user._id
                              }
                              onClick={() =>
                                handleUnblock(
                                  user
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-green-500/20
                                p-2
                                text-green-400
                                transition
                                hover:bg-green-500/10
                                disabled:opacity-50
                              "
                              title="Unblock customer"
                            >
                              <CheckCircle
                                size={17}
                              />
                            </button>

                          )}

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              user._id
                            }
                            onClick={() =>
                              handleDelete(
                                user
                              )
                            }
                            className="
                              rounded-lg
                              border
                              border-red-500/20
                              p-2
                              text-red-400
                              transition
                              hover:bg-red-500/10
                              disabled:opacity-50
                            "
                            title="Delete customer"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {pagination.totalPages > 0 && (

          <div className="flex flex-col justify-between gap-4 border-t border-border-subtle p-4 sm:flex-row sm:items-center">

            <p className="text-sm text-text-secondary">

              Showing{" "}
              <span className="font-semibold text-text-primary">
                {users.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-text-primary">
                {pagination.total}
              </span>{" "}
              customers

            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={
                  !pagination.hasPrevPage
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        current - 1,
                        1
                      )
                  )
                }
                className="
                  rounded-lg
                  border
                  border-border-subtle
                  p-2
                  transition
                  hover:bg-surface-elevated
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <span className="min-w-24 text-center text-sm">

                Page{" "}
                <strong>
                  {pagination.page}
                </strong>{" "}
                of{" "}
                <strong>
                  {pagination.totalPages}
                </strong>

              </span>

              <button
                type="button"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1
                  )
                }
                className="
                  rounded-lg
                  border
                  border-border-subtle
                  p-2
                  transition
                  hover:bg-surface-elevated
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ChevronRight
                  size={18}
                />
              </button>

            </div>

          </div>
        )}

      </div>

      {/* ==================================================
          CUSTOMER DETAILS MODAL
      ================================================== */}

      {(selectedUser ||
        detailsLoading) && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-subtle bg-surface shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-surface p-5">

              <div>

                <h2 className="text-xl font-bold">
                  Customer Details
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Customer account information
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="
                  rounded-lg
                  p-2
                  text-text-secondary
                  transition
                  hover:bg-surface-elevated
                  hover:text-text-primary
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* LOADING */}

            {detailsLoading ? (

              <div className="flex min-h-80 items-center justify-center">

                <RefreshCw
                  size={30}
                  className="animate-spin text-accent"
                />

              </div>

            ) : selectedUser ? (

              <div className="p-5">

                {/* PROFILE */}

                <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-elevated p-5 sm:flex-row sm:items-center">

                  {selectedUser.avatar ? (

                    <img
                      src={
                        selectedUser.avatar
                      }
                      alt={
                        selectedUser.name
                      }
                      className="h-20 w-20 rounded-full object-cover"
                    />

                  ) : (

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-soft text-2xl font-bold text-accent">

                      {selectedUser.name
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase() ||
                        "U"}

                    </div>

                  )}

                  <div className="flex-1">

                    <h3 className="text-xl font-bold">
                      {selectedUser.name ||
                        "-"}
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                      Customer
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            selectedUser.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }
                        `}
                      >
                        {selectedUser.isActive
                          ? "Active"
                          : "Blocked"}
                      </span>

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            selectedUser.isVerified
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }
                        `}
                      >
                        {selectedUser.isVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* CONTACT INFO */}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-border-subtle bg-brand-bg p-4">

                    <div className="flex items-center gap-3">

                      <Mail
                        size={18}
                        className="text-accent"
                      />

                      <div className="min-w-0">

                        <p className="text-xs text-text-muted">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium">
                          {selectedUser.email ||
                            "-"}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-xl border border-border-subtle bg-brand-bg p-4">

                    <div className="flex items-center gap-3">

                      <Phone
                        size={18}
                        className="text-accent"
                      />

                      <div>

                        <p className="text-xs text-text-muted">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {selectedUser.phone ||
                            "-"}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-xl border border-border-subtle bg-brand-bg p-4">

                    <div className="flex items-center gap-3">

                      <Calendar
                        size={18}
                        className="text-accent"
                      />

                      <div>

                        <p className="text-xs text-text-muted">
                          Joined
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatDateTime(
                            selectedUser.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="rounded-xl border border-border-subtle bg-brand-bg p-4">

                    <div className="flex items-center gap-3">

                      <ShieldCheck
                        size={18}
                        className="text-accent"
                      />

                      <div>

                        <p className="text-xs text-text-muted">
                          Verification
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {selectedUser.isVerified
                            ? "Verified"
                            : "Not Verified"}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* CUSTOMER ID */}

                <div className="mt-5 rounded-xl border border-border-subtle bg-brand-bg p-4">

                  <p className="text-xs text-text-muted">
                    Customer ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-text-secondary">
                    {selectedUser._id}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  {!selectedUser.isVerified && (

                    <button
                      type="button"
                      disabled={
                        actionLoading ===
                        selectedUser._id
                      }
                      onClick={() =>
                        handleVerify(
                          selectedUser
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-500
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-600
                        disabled:opacity-50
                      "
                    >
                      <CheckCircle
                        size={17}
                      />

                      Verify
                    </button>

                  )}

                  {selectedUser.isActive ? (

                    <button
                      type="button"
                      disabled={
                        actionLoading ===
                        selectedUser._id
                      }
                      onClick={() =>
                        handleBlock(
                          selectedUser
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-500/30
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-red-400
                        transition
                        hover:bg-red-500/10
                        disabled:opacity-50
                      "
                    >
                      <Ban
                        size={17}
                      />

                      Block
                    </button>

                  ) : (

                    <button
                      type="button"
                      disabled={
                        actionLoading ===
                        selectedUser._id
                      }
                      onClick={() =>
                        handleUnblock(
                          selectedUser
                        )
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-green-500/30
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-green-400
                        transition
                        hover:bg-green-500/10
                        disabled:opacity-50
                      "
                    >
                      <CheckCircle
                        size={17}
                      />

                      Unblock
                    </button>

                  )}

                  <button
                    type="button"
                    disabled={
                      actionLoading ===
                      selectedUser._id
                    }
                    onClick={() =>
                      handleDelete(
                        selectedUser
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-red-500/30
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-red-400
                      transition
                      hover:bg-red-500/10
                      disabled:opacity-50
                    "
                  >
                    <Trash2
                      size={17}
                    />

                    Delete
                  </button>

                </div>

              </div>

            ) : null}

          </div>

        </div>
      )}

    </div>
  );
}

export default Users;