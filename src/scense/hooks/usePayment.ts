import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkTransaction,
  createPayment,
} from "../../services/payment.service";
import { toast } from "sonner";

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success("payment created");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("failed to create payment");
      console.log("payment create error", error);
    },
  });
};
export const useCheckTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkTransaction,
    onSuccess: () => {
      toast.success("transaction check successfuly");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("transaction check failed");
      console.log("transaction check failed", error);
    },
  });
};
