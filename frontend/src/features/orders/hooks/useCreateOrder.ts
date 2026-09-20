

"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import {
  createOrder,
  type CreateOrderPayload,
} from "../api/orders.api";

export const useCreateOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      createOrder(payload),

    onSuccess: async (order) => {
      await queryClient.invalidateQueries({
        queryKey: ["customer", "orders"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["pickup-slots"],
      });

      router.push(`/orders/${order._id}`);
    },
  });
};