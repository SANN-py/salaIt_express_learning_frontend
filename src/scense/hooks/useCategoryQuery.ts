import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryList,
  updateCategory,
} from "../../services/category.service";

// define type

const useCategories = (search?: string, page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["categories", search, page, limit],
    queryFn: () => getCategories(search, page, limit),
  });
};

const useCategoryList = () => {
  return useQuery({
    queryKey: ["categories-list"],
    queryFn: () => getCategoryList(),
  });
};

const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: any }) =>
      updateCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id?: number }) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export {
  useUpdateCategory,
  useCreateCategory,
  useCategories,
  useDeleteCategory,
  useCategoryList,
};
