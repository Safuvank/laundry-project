"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUpdateAdminUser } from "../../hooks/useUpdateAdminUser";

import type {
  AdminUser,
  AdminUserAccountStatus,
  AdminUserRole,
} from "../../types/admin.types";

interface EditUserFormProps {
  user: AdminUser;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: AdminUserRole;
  accountStatus: AdminUserAccountStatus;
}

export default function EditUserForm({
  user,
}: EditUserFormProps) {
  const router = useRouter();

  const updateUser = useUpdateAdminUser();

  const [form, setForm] = useState<FormState>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    role: user.role,
    accountStatus: user.accountStatus,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber ?? "",
      role: user.role,
      accountStatus: user.accountStatus,
    });
  }, [user]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (!form.firstName.trim()) {
      setErrorMessage("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      setErrorMessage("Last name is required.");
      return;
    }

    updateUser.mutate(
      {
        userId: user._id,
        payload: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phoneNumber: form.phoneNumber.trim() || null,
          role: form.role,
          accountStatus: form.accountStatus,
        },
      },
      {
        onSuccess: () => {
          router.push(`/admin/users/${user._id}`);
        },
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to update user.",
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Personal Information */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              First Name
            </label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              disabled={updateUser.isPending}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              disabled={updateUser.isPending}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed from the admin panel.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={updateUser.isPending}
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Account Settings
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={updateUser.isPending}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            >
              <option value="USER">
                Customer
              </option>

              <option value="DELIVERY_AGENT">
                Delivery Agent
              </option>

              <option value="ADMIN">
                Administrator
              </option>
            </select>
          </div>

          {/* Account Status */}
          <div>
            <label
              htmlFor="accountStatus"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Account Status
            </label>

            <select
              id="accountStatus"
              name="accountStatus"
              value={form.accountStatus}
              onChange={handleChange}
              disabled={updateUser.isPending}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="SUSPENDED">
                Suspended
              </option>

              <option value="BLOCKED">
                Blocked
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={updateUser.isPending}
          onClick={() =>
            router.push(`/admin/users/${user._id}`)
          }
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updateUser.isPending}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateUser.isPending
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
