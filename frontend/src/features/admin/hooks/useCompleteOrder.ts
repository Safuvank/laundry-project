import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeOrder } from "../api/admin.api";

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => completeOrder(orderId),

    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-order", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};