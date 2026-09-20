"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useActivateAdminUser } from "../../hooks/useActivateAdminUser";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { useDeactivateAdminUser } from "../../hooks/useDeactivateAdminUser";

import type {
  AdminUser,
  AdminUserAccountStatus,
  AdminUserRole,
} from "../../types/admin.types";

import UserFilters from "./UserFilters";
import UsersPagination from "./UsersPagination";
import UsersTable from "./UsersTable";

const DEFAULT_LIMIT = 10;

export default function AdminUsers() {
  const router = useRouter();

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [role, setRole] = useState<AdminUserRole | "">("");

  const [accountStatus, setAccountStatus] = useState<
    AdminUserAccountStatus | ""
  >("");

  const { data, isLoading, isError, error } = useAdminUsers({
    page,
    limit: DEFAULT_LIMIT,
    search: search || undefined,
    role: role || undefined,
    accountStatus: accountStatus || undefined,
  });

  const activateUser = useActivateAdminUser();
  const deactivateUser = useDeactivateAdminUser();

  /*
   * Debounce search input.
   *
   * The API will not be called on every keystroke.
   * It waits 400ms after the user stops typing.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /*
   * Role filter
   */
  const handleRoleChange = (value: AdminUserRole | "") => {
    setRole(value);
    setPage(1);
  };

  /*
   * Account status filter
   */
  const handleStatusChange = (value: AdminUserAccountStatus | "") => {
    setAccountStatus(value);
    setPage(1);
  };

  /*
   * Reset all filters
   */
  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setRole("");
    setAccountStatus("");
    setPage(1);
  };

  /*
   * Activate user
   */
  const handleActivate = (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to activate this user?",
    );

    if (!confirmed) {
      return;
    }

    activateUser.mutate(userId);
  };

  /*
   * Deactivate user
   */
  const handleDeactivate = (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this user?",
    );

    if (!confirmed) {
      return;
    }

    deactivateUser.mutate(userId);
  };

  /*
   * View user
   */
  const handleView = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  /*
   * Edit user
   */
  const handleEdit = (user: AdminUser) => {
    router.push(`/admin/users/${user._id}/edit`);
  };

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />

        <div className="mt-5 h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  /*
   * Error state
   */
  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Failed to load users
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading users."}
          </p>
        </div>
      </div>
    );
  }

  const users = data?.data.users ?? [];
  const pagination = data?.data.pagination;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage FreshFold customers, delivery agents and admins.
        </p>
      </div>

      {/* Filters */}
      <UserFilters
        search={searchInput}
        role={role}
        accountStatus={accountStatus}
        onSearchChange={setSearchInput}
        onRoleChange={handleRoleChange}
        onAccountStatusChange={handleStatusChange}
        onReset={handleReset}
      />

      {/* Users table */}
      <div className="mt-5">
        <UsersTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          activatingUserId={
            activateUser.isPending ? String(activateUser.variables) : null
          }
          deactivatingUserId={
            deactivateUser.isPending ? String(deactivateUser.variables) : null
          }
        />
      </div>

      {/* Pagination */}
      {pagination && (
        <UsersPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
