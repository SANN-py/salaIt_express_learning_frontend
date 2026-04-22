import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../services/order.service";
import { toast } from "sonner";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("order created");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: Error) => {
      toast.error("failed to create order");
      console.log("order create error", error);
    },
  });
};
