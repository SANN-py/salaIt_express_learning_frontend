import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
} from "../../scense/hooks/useCategoryQuery";

import { useForm } from "@tanstack/react-form";
import z from "zod";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import type { ICategory } from "../../types/category";

const categorySchema = z.object({
  name: z.string().min(1, "name is require"),
});

export type categorySchema = z.infer<typeof categorySchema>;

interface Props {
  isCategoryOpen: boolean;
  setIsCategoryOpen: (isCategoryOpen: boolean) => void;
  category?: ICategory;
}

function CategoryForm({ isCategoryOpen, setIsCategoryOpen, category }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createCategoryMutate } = useCreateCategory();
  const { mutate: updateCategoryMutate } = useUpdateCategory();
  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      console.log("value", value);

      if (category) {
        updateCategoryMutate(
          { id: category.id, request: value },
          {
            onSuccess: () => {
              toast.success("update successfully");
              setIsCategoryOpen(false);
              form.reset();
            },
            onSettled: () => {
              setIsLoading(false);
            },
          },
        );
      } else {
        setIsLoading(true);
        createCategoryMutate(value, {
          onSuccess: () => {
            toast.success("created successfully");
            setIsCategoryOpen(false);
            form.reset();
          },
          onSettled: () => {
            setIsLoading(false);
          },
        });
      }
    },
  });

  useEffect(() => {
    form.reset({ name: category?.name ?? "" });
  }, [category]);

  return (
    <div>
      <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {category ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>Product Information Detail</DialogDescription>
          </DialogHeader>
          <form
            id="category-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Category Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter product name"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
          <DialogFooter>
            <Field orientation="horizontal" className="flex justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                className="bg-blue-500"
                type="submit"
                form="category-form"
              >
                {category ? "Update" : "Create"}
              </Button>
            </Field>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CategoryForm;
