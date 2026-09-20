"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDeliveryAssignment } from "../api/admin.api";

interface CreateDeliveryAssignmentPayload {
  orderId: string;
  latitude: number;
  longitude: number;
}

export const useCreateDeliveryAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      latitude,
      longitude,
    }: CreateDeliveryAssignmentPayload) =>
      createDeliveryAssignment(orderId, latitude, longitude),

    onSuccess: (_, variables) => {
      // Refresh Admin Orders
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Refresh the current Admin Order Details
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", variables.orderId],
      });

      // Refresh Admin Delivery Assignments
      queryClient.invalidateQueries({
        queryKey: ["admin", "assignments"],
      });
    },
  });
};
