"use client";

import { useState } from "react";

import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createOrderSchema,
  type CreateOrderFormData,
} from "../validation/create-order.schema";

import { useCreateOrder } from "../hooks/useCreateOrder";

import CreateOrderProgress from "./CreateOrder/CreateOrderProgress";

import AddressStep from "./CreateOrder/AddressStep";
import ServicesStep from "./CreateOrder/ServicesStep";
import TurnaroundStep from "./CreateOrder/TurnaroundStep";
import PickupDateStep from "./CreateOrder/PickupDateStep";
import PickupSlotStep from "./CreateOrder/PickupSlotStep";
import PreferencesStep from "./CreateOrder/PreferencesStep";
import ReviewStep from "./CreateOrder/ReviewStep";

const TOTAL_STEPS = 7;

export default function CreateOrderPage() {
  const [step, setStep] = useState(1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const createOrderMutation = useCreateOrder();

  const methods = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),

    defaultValues: {
      addressId: "",
      laundryServiceIds: [],
      turnaroundPlanId: "",
      pickupDate: "",
      pickupSlotId: "",

      detergentPreference: "",
      fabricSoftener: false,
      starchPreference: false,
      foldingPreference: "",
      customerNotes: "",
    },

    mode: "onTouched",
  });

  const { trigger, handleSubmit } = methods;

  const nextStep = async () => {
    let fields: (keyof CreateOrderFormData)[] = [];

    switch (step) {
      case 1:
        fields = ["addressId"];
        break;

      case 2:
        fields = ["laundryServiceIds"];
        break;

      case 3:
        fields = ["turnaroundPlanId"];
        break;

      case 4:
        fields = ["pickupDate"];
        break;

      case 5:
        fields = ["pickupSlotId"];
        break;

      case 6:
        fields = [
          "detergentPreference",
          "fabricSoftener",
          "starchPreference",
          "foldingPreference",
          "customerNotes",
        ];
        break;
    }

    const isValid = fields.length === 0 || (await trigger(fields));

    if (!isValid) {
      return;
    }

    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  /**
   * Get customer's current location at booking time.
   *
   * The location is captured only when the customer
   * clicks "Create Order".
   */
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("Location services are not supported by your browser."),
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            reject(new Error("Unable to get a valid location."));
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
                  "Location permission was denied. Please allow location access to create your order.",
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
                new Error("Location request timed out. Please try again."),
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
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  };

  const onSubmit = async (data: CreateOrderFormData) => {
    setLocationError(null);
    setIsGettingLocation(true);

    try {
      /**
       * Capture the customer's location at the exact
       * time the order is being created.
       */
      const pickupLocation = await getCurrentLocation();

      /**
       * pickupDate is used only by the frontend form.
       * The backend does not currently require it.
       */
      const { pickupDate: _pickupDate, ...orderData } = data;

      const payload = {
        ...orderData,
        pickupLocation,
      };

      createOrderMutation.mutate(payload);
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? error.message
          : "Unable to get your current location.",
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const isSubmitting = createOrderMutation.isPending || isGettingLocation;

  return (
    <FormProvider {...methods}>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <header>
            <p className="text-sm font-semibold text-blue-600">New Order</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Create Your Laundry Order
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Schedule a convenient pickup and choose the services you need.
            </p>
          </header>

          <div className="mt-8">
            <CreateOrderProgress currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {step === 1 && <AddressStep />}

              {step === 2 && <ServicesStep />}

              {step === 3 && <TurnaroundStep />}

              {step === 4 && <PickupDateStep />}

              {step === 5 && <PickupSlotStep />}

              {step === 6 && <PreferencesStep />}

              {step === 7 && <ReviewStep />}
            </section>

            {/* Location Error */}
            {locationError && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Location Required
                </p>

                <p className="mt-1 text-sm text-amber-700">{locationError}</p>
              </div>
            )}

            {/* Order Creation Error */}
            {createOrderMutation.isError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Unable to create order
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {createOrderMutation.error instanceof Error
                    ? createOrderMutation.error.message
                    : "Something went wrong. Please try again."}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={previousStep}
                disabled={step === 1 || isSubmitting}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGettingLocation
                    ? "Getting Location..."
                    : createOrderMutation.isPending
                      ? "Creating Order..."
                      : "Create Order"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </FormProvider>
  );
}
