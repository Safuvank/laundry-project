"use client";

import { useState } from "react";

import type { DeliveryAssignment } from "../types/delivery-assignment.types";

import { useAcceptAssignment } from "../hooks/useAcceptAssignment";
import { useRejectAssignment } from "../hooks/useRejectAssignment";
import { useStartPickup } from "../hooks/useStartPickup";
import { useStartDelivery } from "../hooks/useStartDelivery";
import { useCompletePickup } from "../hooks/useCompletePickup";
import { useCompleteDelivery } from "../hooks/useCompleteDelivery";

interface DeliveryAssignmentCardProps {
  assignment: DeliveryAssignment;
}

export default function DeliveryAssignmentCard({
  assignment,
}: DeliveryAssignmentCardProps) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const acceptAssignment = useAcceptAssignment();
  const rejectAssignment = useRejectAssignment();
  const startPickup = useStartPickup();
  const startDelivery = useStartDelivery();
  const completePickup = useCompletePickup();
  const completeDelivery = useCompleteDelivery();

  const isPickup = assignment.assignmentType === "PICKUP";
  const isDelivery = assignment.assignmentType === "DELIVERY";

  const isOffered = assignment.status === "OFFERED";
  const isAccepted = assignment.status === "ACCEPTED";
  const isInProgress = assignment.status === "IN_PROGRESS";
  const isCompleted = assignment.status === "COMPLETED";
  const isRejected = assignment.status === "REJECTED";
  const isCancelled = assignment.status === "CANCELLED";

  const isPending =
    acceptAssignment.isPending ||
    rejectAssignment.isPending ||
    startPickup.isPending ||
    startDelivery.isPending ||
    completePickup.isPending ||
    completeDelivery.isPending;

  const order = assignment.orderId;

  const customerAddress =
    typeof order === "object" && order !== null && "addressId" in order
      ? order.addressId
      : undefined;

  const formatDateTime = (value?: string) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString();
  };

  const handleAccept = () => {
    acceptAssignment.mutate(assignment._id);
  };

  const handleReject = () => {
    rejectAssignment.mutate(
      {
        assignmentId: assignment._id,
        payload: rejectionReason.trim()
          ? {
              rejectionReason: rejectionReason.trim(),
            }
          : undefined,
      },
      {
        onSuccess: () => {
          setShowRejectInput(false);
          setRejectionReason("");
        },
      },
    );
  };

  const handleStart = () => {
    if (isPickup) {
      startPickup.mutate(assignment._id);
      return;
    }

    if (isDelivery) {
      startDelivery.mutate(assignment._id);
    }
  };

  const handleComplete = () => {
    if (isPickup) {
      completePickup.mutate(assignment._id);
      return;
    }

    if (isDelivery) {
      completeDelivery.mutate(assignment._id);
    }
  };

  const getStatusLabel = () => {
    if (isPickup) {
      switch (assignment.status) {
        case "OFFERED":
          return "Pickup Offered";

        case "ACCEPTED":
          return "Pickup Accepted";

        case "IN_PROGRESS":
          return "Out for Pickup";

        case "COMPLETED":
          return "Pickup Completed";

        case "REJECTED":
          return "Pickup Rejected";

        case "CANCELLED":
          return "Pickup Cancelled";

        default:
          return assignment.status;
      }
    }

    switch (assignment.status) {
      case "OFFERED":
        return "Delivery Offered";

      case "ACCEPTED":
        return "Delivery Accepted";

      case "IN_PROGRESS":
        return "Out for Delivery";

      case "COMPLETED":
        return "Delivery Completed";

      case "REJECTED":
        return "Delivery Rejected";

      case "CANCELLED":
        return "Delivery Cancelled";

      default:
        return assignment.status;
    }
  };

  const getStatusClassName = () => {
    switch (assignment.status) {
      case "OFFERED":
        return "bg-yellow-100 text-yellow-800";

      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";

      case "IN_PROGRESS":
        return "bg-indigo-100 text-indigo-800";

      case "COMPLETED":
        return "bg-green-100 text-green-800";

      case "REJECTED":
        return "bg-red-100 text-red-800";

      case "CANCELLED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
              {assignment.assignmentType}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName()}`}
            >
              {assignment.status}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-gray-900">
            {isPickup
              ? "Laundry Pickup"
              : isDelivery
                ? "Laundry Delivery"
                : "Delivery Assignment"}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            {getStatusLabel()}
          </p>
        </div>

        <div
          className={`text-sm font-medium ${
            assignment.isActive ? "text-green-600" : "text-gray-500"
          }`}
        >
          {assignment.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Order Information */}
      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <h4 className="text-sm font-semibold text-gray-900">
          Order Information
        </h4>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>

            <p className="mt-1 break-all text-sm font-medium text-gray-900">
              {typeof order === "object" ? order._id : order}
            </p>
          </div>

          {typeof order === "object" && (
            <div>
              <p className="text-xs text-gray-500">Order Status</p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {order.status}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Timeline */}
      <div className="mt-6 rounded-xl border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900">
          Assignment Timeline
        </h4>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Offered</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDateTime(assignment.offeredAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Accepted</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDateTime(assignment.acceptedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Started</p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDateTime(assignment.startedAt)}
            </p>
          </div>

          {isCompleted && (
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDateTime(assignment.completedAt)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Location */}
      {typeof order === "object" && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Customer Location
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                {isPickup ? "Pickup address" : "Delivery address"}
              </p>
            </div>

            {customerAddress?.addressType && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {customerAddress.addressType}
              </span>
            )}
          </div>

          {customerAddress ? (
            <div className="mt-4 space-y-4">
              {/* Customer */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Customer
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {customerAddress.fullName}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {customerAddress.phoneNumber}
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Address
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700">
                  {customerAddress.addressLine1}

                  {customerAddress.addressLine2 && (
                    <>
                      <br />
                      {customerAddress.addressLine2}
                    </>
                  )}

                  <br />
                  {customerAddress.city}, {customerAddress.state}
                  <br />
                  {customerAddress.postalCode},{" "}
                  {customerAddress.country}
                </p>
              </div>

              {/* Coordinates */}
              {customerAddress.location?.coordinates && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Coordinates
                  </p>

                  <p className="mt-1 break-all text-xs text-gray-600">
                    Latitude:{" "}
                    {customerAddress.location.coordinates[1]}
                    <br />
                    Longitude:{" "}
                    {customerAddress.location.coordinates[0]}
                  </p>
                </div>
              )}

              {/* Google Maps */}
              {customerAddress.location?.coordinates && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${customerAddress.location.coordinates[1]},${customerAddress.location.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                >
                  Open in Google Maps
                </a>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Customer location is not available.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rejection Form */}
      {showRejectInput && isOffered && (
        <div className="mt-6 rounded-xl border p-4">
          <label
            htmlFor={`rejection-${assignment._id}`}
            className="text-sm font-medium text-gray-900"
          >
            Rejection reason
          </label>

          <textarea
            id={`rejection-${assignment._id}`}
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Optional reason"
            rows={3}
            className="mt-2 w-full rounded-xl border px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rejectAssignment.isPending
                ? "Rejecting..."
                : "Confirm Reject"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowRejectInput(false);
                setRejectionReason("");
              }}
              disabled={isPending}
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {/* OFFERED */}
        {isOffered && !showRejectInput && (
          <>
            <button
              type="button"
              onClick={handleAccept}
              disabled={isPending}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {acceptAssignment.isPending ? "Accepting..." : "Accept"}
            </button>

            <button
              type="button"
              onClick={() => setShowRejectInput(true)}
              disabled={isPending}
              className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}

        {/* ACCEPTED - PICKUP */}
        {isAccepted && isPickup && (
          <button
            type="button"
            onClick={handleStart}
            disabled={isPending}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {startPickup.isPending ? "Starting..." : "Start Pickup"}
          </button>
        )}

        {/* ACCEPTED - DELIVERY */}
        {isAccepted && isDelivery && (
          <button
            type="button"
            onClick={handleStart}
            disabled={isPending}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {startDelivery.isPending ? "Starting..." : "Start Delivery"}
          </button>
        )}

        {/* IN PROGRESS - PICKUP */}
        {isInProgress && isPickup && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={isPending}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completePickup.isPending
              ? "Completing..."
              : "Complete Pickup"}
          </button>
        )}

        {/* IN PROGRESS - DELIVERY */}
        {isInProgress && isDelivery && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={isPending}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completeDelivery.isPending
              ? "Completing..."
              : "Complete Delivery"}
          </button>
        )}

        {/* COMPLETED */}
        {isCompleted && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700">
            <span>✓</span>
            {isPickup ? "Pickup Completed" : "Delivery Completed"}
          </div>
        )}

        {/* REJECTED */}
        {isRejected && (
          <div className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700">
            Assignment Rejected
          </div>
        )}

        {/* CANCELLED */}
        {isCancelled && (
          <div className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600">
            Assignment Cancelled
          </div>
        )}
      </div>
    </article>
  );
}
