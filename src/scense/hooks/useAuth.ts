import { useMutation } from "@tanstack/react-query";
import { authLogin, type LogInPayload } from "../../services/auth.service";

const useAuthLogin = () => {
  return useMutation({
    mutationFn: ({ request }: { request: LogInPayload }) => authLogin(request),
    onSuccess: (res: any) => {},
    onError: (error: Error) => {
      console.log("fail to log in", error);
    },
  });
};

export { useAuthLogin };
