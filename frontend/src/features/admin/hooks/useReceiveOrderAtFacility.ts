import { useMutation, useQueryClient } from "@tanstack/react-query";

import { receiveOrderAtFacility } from "../api/admin.api";

export const useReceiveOrderAtFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      receiveOrderAtFacility(orderId),

    onSuccess: (_, orderId) => {
      // Refresh admin order list
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      // Refresh current order details
      queryClient.invalidateQueries({
        queryKey: ["admin", "order", orderId],
      });
    },
  });
};