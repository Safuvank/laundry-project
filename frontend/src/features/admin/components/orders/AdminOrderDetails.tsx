"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Mail,
  Package,
  Phone,
  User,
} from "lucide-react";

import type { AdminOrder } from "../../types/admin.types";
import OrderActions from "./OrderActions";
import { useStartOrderQualityCheck } from "../../hooks/useStartOrderQualityCheck";
import { useCompleteOrderQualityCheck } from "../../hooks/useCompleteOrderQualityCheck";
import { useCreateDeliveryAssignment } from "../../hooks/useCreateDeliveryAssignment";
import { useCompleteOrder } from "../../hooks/useCompleteOrder";

const AdminOrderLocationMap = dynamic(() => import("./AdminOrderLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
      <p className="text-sm text-gray-500">Loading map...</p>
    </div>
  ),
});

interface AdminOrderDetailsProps {
  order: AdminOrder;
}

interface OrderProcessingActionsProps {
  orderId: string;
  status: string;
}

const OrderProcessingActions = ({
  orderId,
  status,
}: OrderProcessingActionsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const startQualityCheckMutation = useStartOrderQualityCheck();
  const completeQualityCheckMutation = useCompleteOrderQualityCheck();

  const isStartingQualityCheck = startQualityCheckMutation.isPending;
  const isCompletingQualityCheck = completeQualityCheckMutation.isPending;
  const isPending = isStartingQualityCheck || isCompletingQualityCheck;

  const handleStartQualityCheck = async () => {
    try {
      await startQualityCheckMutation.mutateAsync(orderId);
      setShowConfirm(false);
    } catch {
      // Mutation error is displayed below.
    }
  };

  const handleCompleteQualityCheck = async () => {
    try {
      await completeQualityCheckMutation.mutateAsync(orderId);
      setShowConfirm(false);
    } catch {
      // Mutation error is displayed below.
    }
  };

  if (status === "PROCESSING") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-900">Quality Check</h3>

          <p className="mt-1 text-sm text-blue-700">
            The order is currently being processed and is ready to enter quality
            check.
          </p>
        </div>

        {startQualityCheckMutation.isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {startQualityCheckMutation.error instanceof Error
              ? startQualityCheckMutation.error.message
              : "Failed to start quality check."}
          </div>
        )}

        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Quality Check
          </button>
        ) : (
          <div className="space-y-3 rounded-lg border border-blue-200 bg-white p-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to start the quality check for this order?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartQualityCheck}
                disabled={isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStartingQualityCheck ? "Starting..." : "Yes, Start"}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === "QUALITY_CHECK") {
    return (
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-cyan-900">
            Quality Check In Progress
          </h3>

          <p className="mt-1 text-sm text-cyan-700">
            Complete the quality check once the order has been inspected and
            approved for delivery.
          </p>
        </div>

        {completeQualityCheckMutation.isError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {completeQualityCheckMutation.error instanceof Error
              ? completeQualityCheckMutation.error.message
              : "Failed to complete quality check."}
          </div>
        )}

        {!showConfirm ? (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Complete Quality Check
          </button>
        ) : (
          <div className="space-y-3 rounded-lg border border-cyan-200 bg-white p-4">
            <p className="text-sm text-gray-700">
              Confirm that the quality check has been completed for this order.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCompleteQualityCheck}
                disabled={isPending}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCompletingQualityCheck ? "Completing..." : "Yes, Complete"}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

interface CompleteOrderActionProps {
  orderId: string;
  status: string;
}

const CompleteOrderAction = ({ orderId, status }: CompleteOrderActionProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const completeOrderMutation = useCompleteOrder();

  if (status !== "DELIVERED") return null;

  const isPending = completeOrderMutation.isPending;

  const handleCompleteOrder = async () => {
    try {
      await completeOrderMutation.mutateAsync(orderId);
      setShowConfirm(false);
    } catch {
      // Mutation error is displayed below.
    }
  };

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-green-900">Complete Order</h3>
        <p className="mt-1 text-sm text-green-700">
          The order has been delivered successfully. Mark it as completed to
          finish the order workflow.
        </p>
      </div>

      {completeOrderMutation.isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {completeOrderMutation.error instanceof Error
            ? completeOrderMutation.error.message
            : "Failed to complete the order."}
        </div>
      )}

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Complete Order
        </button>
      ) : (
        <div className="space-y-3 rounded-lg border border-green-200 bg-white p-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to mark this order as completed?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCompleteOrder}
              disabled={isPending}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Completing..." : "Yes, Complete"}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface DeliveryAssignmentActionProps {
  orderId: string;
  status: string;
}

const DeliveryAssignmentAction = ({
  orderId,
  status,
}: DeliveryAssignmentActionProps) => {
  const [locationError, setLocationError] = useState<string | null>(null);

  const createDeliveryAssignmentMutation = useCreateDeliveryAssignment();

  if (status !== "READY_FOR_DELIVERY") {
    return null;
  }

  const isPending = createDeliveryAssignmentMutation.isPending;

  /**
   * Get the Admin's fresh browser location at the exact moment
   * the Admin clicks "Assign Delivery Agent".
   *
   * Browser Geolocation returns:
   * latitude  = latitude
   * longitude = longitude
   *
   * The API sends them separately. The backend uses these coordinates
   * as the center of the 5 km delivery-agent search.
   */
  const getAdminLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("Location services are not supported by this browser."),
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
          ) {
            reject(new Error("Your browser returned an invalid location."));
            return;
          }

          resolve({
            latitude,
            longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(
                new Error(
                  "Location permission is required to assign a delivery agent. Please allow location access and try again.",
                ),
              );
              break;

            case error.POSITION_UNAVAILABLE:
              reject(
                new Error(
                  "Your current location is unavailable. Please check your device location settings and try again.",
                ),
              );
              break;

            case error.TIMEOUT:
              reject(
                new Error(
                  "Getting your current location timed out. Please try again.",
                ),
              );
              break;

            default:
              reject(
                new Error(
                  "Unable to get your current location. Please try again.",
                ),
              );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  };

  /**
   * Location is requested directly from the Assign button click.
   * The API is called only after a valid current Admin location
   * has been obtained.
   */
  const handleAssignDelivery = async () => {
    setLocationError(null);

    try {
      const { latitude, longitude } = await getAdminLocation();

      await createDeliveryAssignmentMutation.mutateAsync({
        orderId,
        latitude,
        longitude,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to assign a delivery agent.";

      setLocationError(message);
    }
  };

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-cyan-900">
          Delivery Assignment
        </h3>

        <p className="mt-1 text-sm text-cyan-700">
          Your current Admin location will be used to find an available delivery
          agent within 5 km.
        </p>
      </div>

      {(locationError || createDeliveryAssignmentMutation.isError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {locationError ??
            (createDeliveryAssignmentMutation.error instanceof Error
              ? createDeliveryAssignmentMutation.error.message
              : "Failed to assign a delivery agent.")}
        </div>
      )}

      <button
        type="button"
        onClick={handleAssignDelivery}
        disabled={isPending}
        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Finding Delivery Agent..." : "Assign Delivery Agent"}
      </button>

      <p className="mt-3 text-xs text-gray-500">
        Clicking this button will request your current browser location.
        Location access is required for delivery-agent assignment.
      </p>
    </div>
  );
};

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatDateTime = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const getOrderStatusClasses = (status: string) => {
  switch (status) {
    case "BOOKED":
      return "bg-blue-50 text-blue-700";

    case "PICKUP_ASSIGNED":
    case "DELIVERY_ASSIGNED":
      return "bg-indigo-50 text-indigo-700";

    case "OUT_FOR_PICKUP":
    case "OUT_FOR_DELIVERY":
      return "bg-orange-50 text-orange-700";

    case "PICKED_UP":
    case "RECEIVED_AT_FACILITY":
      return "bg-purple-50 text-purple-700";

    case "PROCESSING":
    case "INSPECTION_IN_PROGRESS":
    case "QUALITY_CHECK":
      return "bg-yellow-50 text-yellow-700";

    case "READY_FOR_DELIVERY":
      return "bg-cyan-50 text-cyan-700";

    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-50 text-green-700";

    case "CANCELLED":
    case "PICKUP_FAILED":
    case "DELIVERY_FAILED":
      return "bg-red-50 text-red-700";

    case "ON_HOLD":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentStatusClasses = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700";

    case "PENDING":
      return "bg-yellow-50 text-yellow-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "REFUNDED":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface OrderLocation {
  latitude: number;
  longitude: number;
}

const getOrderLocation = (order: AdminOrder): OrderLocation | null => {
  const location = order.addressId?.location;

  if (
    !location ||
    location.type !== "Point" ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length < 2
  ) {
    return null;
  }

  const longitude = Number(location.coordinates[0]);
  const latitude = Number(location.coordinates[1]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
};

export default function AdminOrderDetails({ order }: AdminOrderDetailsProps) {
  const customer = order.userId;

  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : "Unknown customer";

  const displayPrice = order.finalPrice ?? order.estimatedPrice;
  const orderLocation = getOrderLocation(order);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* ---------------------------------------------------------------- */}
        {/* Header */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Back to Orders
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Package className="h-7 w-7 text-gray-700" strokeWidth={1.7} />

                <h1 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h1>
              </div>

              <p className="mt-2 font-mono text-sm text-gray-500">
                #{order._id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getOrderStatusClasses(
                  order.status,
                )}`}
              >
                {formatLabel(order.status)}
              </span>

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${getPaymentStatusClasses(
                  order.paymentStatus,
                )}`}
              >
                Payment: {formatLabel(order.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Customer Location */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Customer Location
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer pickup location and the 5 km delivery-agent service area.
            </p>
          </div>

          {orderLocation ? (
            <AdminOrderLocationMap
              latitude={orderLocation.latitude}
              longitude={orderLocation.longitude}
              radiusKm={5}
            />
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                Location is not available for this order.
              </p>

              <p className="mt-1 text-sm text-amber-700">
                The order response must include a GeoJSON Point location with
                coordinates in [longitude, latitude] format.
              </p>

              <p className="mt-2 font-mono text-xs text-amber-800">
                Address ID: {order.addressId?._id}
              </p>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Order Actions */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Order Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Available actions for the current order status.
            </p>
          </div>
          <OrderActions
            orderId={order._id}
            status={order.status}
            estimatedPrice={order.estimatedPrice}
            finalPrice={order.finalPrice}
          />{" "}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Processing / Quality Check Actions */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6">
          <OrderProcessingActions orderId={order._id} status={order.status} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Complete Order Action */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6">
          <CompleteOrderAction orderId={order._id} status={order.status} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Delivery Assignment Actions */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6">
          <DeliveryAssignmentAction orderId={order._id} status={order.status} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Grid */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ---------------------------------------------------------------- */}
          {/* Customer */}
          {/* ---------------------------------------------------------------- */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" strokeWidth={1.8} />

              <h2 className="text-base font-semibold text-gray-900">
                Customer
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {customerName}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 text-gray-400"
                  strokeWidth={1.8}
                />

                <div>
                  <p className="text-xs text-gray-400">Email</p>

                  <p className="mt-0.5 break-all text-sm text-gray-700">
                    {customer?.email ?? "No email"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 text-gray-400"
                  strokeWidth={1.8}
                />

                <div>
                  <p className="text-xs text-gray-400">Phone</p>

                  <p className="mt-0.5 text-sm text-gray-700">
                    {customer?.phoneNumber ?? "No phone number"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Pickup Information */}
          {/* ---------------------------------------------------------------- */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CalendarDays
                className="h-5 w-5 text-gray-600"
                strokeWidth={1.8}
              />

              <h2 className="text-base font-semibold text-gray-900">
                Pickup Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Pickup Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(order.pickupDate)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Pickup Time
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {order.pickupTimeSlot}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Pickup Address
                </p>

                <div className="mt-1 text-sm text-gray-700">
                  <p>{order.addressId.fullName}</p>
                  <p>{order.addressId.addressLine1}</p>

                  {order.addressId.addressLine2 && (
                    <p>{order.addressId.addressLine2}</p>
                  )}

                  <p>
                    {order.addressId.city}, {order.addressId.state}{" "}
                    {order.addressId.postalCode}
                  </p>

                  <p>{order.addressId.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Payment */}
          {/* ---------------------------------------------------------------- */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" strokeWidth={1.8} />

              <h2 className="text-base font-semibold text-gray-900">Payment</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Current Price
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatCurrency(displayPrice)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Estimated Price
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {formatCurrency(order.estimatedPrice)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Final Price
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {formatCurrency(order.finalPrice)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Pricing Status
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {formatLabel(order.pricingStatus)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Order Information */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Order Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Order ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-gray-700">
                {order._id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Turnaround Plan
              </p>

              <p className="mt-1 break-all font-mono text-xs text-gray-700">
                {order.turnaroundPlanId}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Created
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {formatDateTime(order.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Services */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Laundry Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.laundryServiceIds.length} service
              {order.laundryServiceIds.length !== 1 ? "s" : ""} selected.
            </p>
          </div>

          <div className="space-y-2">
            {order.laundryServiceIds.map((serviceId, index) => (
              <div
                key={`${serviceId}-${index}`}
                className="rounded-lg bg-gray-50 px-4 py-3"
              >
                <p className="text-xs text-gray-400">Service {index + 1}</p>

                <p className="mt-1 break-all font-mono text-xs text-gray-700">
                  {serviceId}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Active Status */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Record Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current order record status.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                order.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {order.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
