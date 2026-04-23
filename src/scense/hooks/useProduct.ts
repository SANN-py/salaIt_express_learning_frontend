import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getProduct,
  updateProduct,
  uploadProductImage,
} from "../../services/product.service";

import { toast } from "sonner";

export const useProducts = (
  search?: string,
  page?: number,
  limit?: number,
  categoryId?: number,
) => {
  return useQuery({
    queryKey: ["products", search, page, limit, categoryId],
    queryFn: () => getProduct(search, page, limit, categoryId),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      console.log("failed to create product");
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: any }) =>
      updateProduct(id, request),
    onSuccess: () => {
      toast.success("products create successfuly", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to create products image", {
        position: "top-center",
      });
      console.log("failed to create product");
    },
  });
};
export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: File }) =>
      uploadProductImage(id, request),
    onSuccess: () => {
      toast.success("products Image upload successfuly", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to update products image", {
        position: "top-center",
      });
      console.log("failed to upload product image");
    },
  });
};
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProductImage(id),
    onSuccess: () => {
      toast.success("products image deleted successfuly", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to delete products image", {
        position: "top-center",
      });
      console.log("failed to delete product image");
    },
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProduct(id),
    onSuccess: () => {
      toast.success("products  deleted successfuly", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to delete products ", {
        position: "top-center",
      });
      console.log("failed to delete product ");
    },
  });
};
