import { useForm } from "@tanstack/react-form";
import z from "zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategoryList } from "../../scense/hooks/useCategoryQuery";
import {
  useCreateProduct,
  useDeleteProduct,
  useDeleteProductImage,
  useUpdateProduct,
  useUploadProductImage,
} from "../../scense/hooks/useProduct";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SpinnerCustom } from "../ui/spinner";
import { toast } from "sonner";
import type { IProduct, IProductImage } from "../../types/product";
import { cn } from "../../lib/utils";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be 0 or more"),
  categoryId: z.number().min(1, "Category is required"),
  qty: z.number().int().min(0, "Quantity must be 0 or more"),
});

export type productSchema = z.infer<typeof productSchema>;

interface Props {
  isProductOpen: boolean;
  setIsProductOpen: (isProductOpen: boolean) => void;
  product?: IProduct;
}

export const ProductForm = ({
  isProductOpen,
  setIsProductOpen,
  product,
}: Props) => {
  console.log("product", product);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
  const { data } = useCategoryList();
  // mutate
  const { mutate: createProductMutate } = useCreateProduct();
  const { mutate: updateProductMutate } = useUpdateProduct();
  const { mutate: deleteProductMutate } = useDeleteProduct();
  const { mutate: uploadProductImageMutate } = useUploadProductImage();
  const { mutate: deleteProductImageMutate } = useDeleteProductImage();

  // --- File upload state ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {},
  );

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== filename));
  };

  // --- Form ---
  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ? Number(product.price) : 0, // ensure Number()
      categoryId: product?.categoryId ? Number(product.categoryId) : 0,
      qty: product?.qty ? Number(product.qty) : 0,
    },
    validators: { onSubmit: productSchema },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      if (product) {
        updateProductMutate(
          { id: product.id, request: value },
          {
            onSuccess: (res) => {
              if (res.data?.id) {
                uploadedFiles.map((file) => {
                  return uploadProductImageMutate({
                    id: res.data.id,
                    request: file,
                  });
                });
              }
              // call to delete image Id
              console.log("delete image id", deleteImageIds);
              deleteImageIds.map((imageId) => {
                return deleteProductImageMutate({ id: imageId });
              });
              setIsProductOpen(false);
              setUploadedFiles([]);
              form.reset();
            },
            onSettled: () => setIsLoading(false),
          },
        );
      } else {
        createProductMutate(value, {
          onSuccess: (res) => {
            console.log("res from createProductMutate", res);
            if (res.data?.id) {
              // uploadProductImageMutate({
              //   // id: res.data.id,
              //   // request: uploadedFiles[0],

              // });

              uploadedFiles.forEach((file) => {
                uploadProductImageMutate({ id: res.data.id, request: file });
              });
            }

            setIsProductOpen(false);
            setUploadedFiles([]);
            form.reset();
          },
          onSettled: () => setIsLoading(false),
        });
      }
    },
  });

  return (
    <>
      {isLoading && <SpinnerCustom />}
      <Dialog open={isProductOpen} onOpenChange={setIsProductOpen}>
        {/* Wider dialog + flex column so footer stays pinned */}
        <DialogContent
          key={product?.id ?? "new"}
          className="flex flex-col sm:max-w-2xl overflow-y-auto max-h-[90vh] p-0 gap-0"
        >
          {/* ── Header ── */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-lg font-semibold">
              {product ? "Edit Product" : "New Product"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Fill in the details below. All fields marked * are required.
            </DialogDescription>
          </DialogHeader>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <form
              id="product-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup className="space-y-1">
                {/* name field */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Product Name *
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g. Gaming Mouse"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Row 2: Price + Qty */}
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="price"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Price *</FieldLabel>

                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            value={field.state.value ?? ""} // ✅ NEVER NaN
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              const val = e.target.value;

                              field.handleChange(
                                val === "" ? 0 : Number(val), // safe conversion
                              );
                            }}
                            aria-invalid={isInvalid}
                            placeholder="0.00"
                          />

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <form.Field
                    name="qty"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Quantity *
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.handleChange(val === "" ? 0 : Number(val));
                            }}
                            aria-invalid={isInvalid}
                            placeholder="0"
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
                {/*  Category */}
                <div className="grid grid-cols-2 ">
                  <form.Field
                    name="categoryId"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="cat-select">
                            Category *
                          </FieldLabel>
                          <Select
                            name={field.name}
                            value={String(field.state.value)}
                            onValueChange={(val) =>
                              field.handleChange(Number(val))
                            }
                          >
                            <SelectTrigger
                              id="cat-select"
                              aria-invalid={isInvalid}
                              className="w-full"
                            >
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              {data?.data?.map((cat, i) => (
                                <SelectItem key={i} value={String(cat.id)}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                {/* Row 3: Description (full width) */}
                <form.Field
                  name="description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Short product description"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Row 4: Image upload */}
                <div className="space-y-3">
                  <p className="text-sm font-medium leading-none">
                    Product Image
                  </p>

                  {/* Drop zone */}
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileSelect(e.dataTransfer.files);
                    }}
                  >
                    <div className="mb-2 bg-muted rounded-full p-2.5">
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Drag & drop or{" "}
                      <span className="text-primary hover:underline cursor-pointer">
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP — max 4 MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                  </div>
                  {/* image preview */}
                  {product?.productImages &&
                    product.productImages?.length > 0 && (
                      <div>
                        {product?.productImages &&
                          product.productImages.length > 0 && (
                            <div className="space-y-2">
                              {product.productImages
                                .filter(
                                  (image: IProductImage) =>
                                    !deleteImageIds.includes(image.id),
                                )
                                .map((image: IProductImage, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center gap-3 border border-border rounded-lg p-2.5 bg-muted/20"
                                    >
                                      {/* Thumbnail */}
                                      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
                                        <img
                                          src={image.imageUrl}
                                          alt={image.fileName}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>

                                      {/* Info */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-medium truncate max-w-50">
                                            {image.fileName}
                                          </span>
                                        </div>

                                        {/* Static full bar (already uploaded) */}
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                                          <div className="h-full bg-primary w-full" />
                                        </div>
                                      </div>
                                      {/* TODO */}
                                      {/* Remove (optional: call API instead) */}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 hover:text-destructive h-7 w-7"
                                        onClick={() => {
                                          console.log("image object:", image);
                                          console.log("image.id:", image.id);
                                          setDeleteImageIds((prev) => [
                                            ...prev,
                                            image.id,
                                          ]);
                                        }}
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                      </div>
                    )}

                  {/* File previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => {
                        const imageUrl = URL.createObjectURL(file);
                        const progress = fileProgresses[file.name] || 0;
                        return (
                          <div
                            key={file.name + index}
                            className="flex items-center gap-3 border border-border rounded-lg p-2.5 bg-muted/20"
                          >
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
                              <img
                                src={imageUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info + progress */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                                  {Math.round(file.size / 1024)} KB
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                                  <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-8 text-right">
                                  {Math.round(progress)}%
                                </span>
                              </div>
                            </div>

                            {/* Remove */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="shrink-0 hover:text-destructive h-7 w-7"
                              onClick={() => removeFile(file.name)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </FieldGroup>
            </form>
          </div>

          {/* ── Footer — always visible ── */}
          <DialogFooter className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form="product-form"
              className="bg-blue-500 hover:bg-blue-600"
            >
              {product ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
