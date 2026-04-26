"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  QrCode,
  Minus,
  Trash2Icon,
} from "lucide-react";
import { useProducts } from "../hooks/useProduct";
import type { IProduct } from "../../types/product";
import { useCategories } from "../hooks/useCategoryQuery";
import type { ICategory } from "../../types/category";
import { toast } from "sonner";
import type { ICart } from "../../types/cart";
import Dialog from "../../components/shared/Dialog";
import { useCreateOrder } from "../hooks/userOrder";
import type { orderPayload } from "../../services/order.service";
import { Input } from "../../components/ui/input";
import { SpinnerCustom } from "../../components/ui/spinner";
import { useCheckTransaction, useCreatePayment } from "../hooks/usePayment";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Field, FieldLabel } from "../../components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useSearchParams } from "react-router-dom";

export default function POS() {
  // state
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [orderItems, setOrderItems] = useState<ICart[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [draftNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: productData } = useProducts(
    searchText,
    page,
    limit,
    selectedCategory,
  );
  const pagination = productData?.pagination;
  const totalPages = Math.ceil(
    (pagination?.total || 0) / (pagination?.limit || 10),
  );
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  console.log("product data", productData);
  const { data: categoryData } = useCategories();
  console.log("productData", productData);

  const products = (productData?.data as IProduct[]) ?? [];
  console.log("PRODUCT DATA:", productData);
  const categories = (categoryData?.data as ICategory[]) ?? [];
  const allCategories = [
    { id: undefined, name: "all", icon: "⭐" },
    ...categories,
  ];
  // console.log("categories", categories);
  // hook
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSuccess]);
  useEffect(() => {
    const timer = setTimeout(() => {}, 1500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const addToOrder = (product: IProduct) => {
    if (product.qty <= 0) {
      toast.warning("product is empty");
      return;
    }
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.qty >= existingItem.stock) {
          toast.warning("Out of stock");
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category?.name || "Uncategory",
          price: Number(product.price),
          imageUrl: product.productImages?.[0]?.imageUrl || "/no-image.png",
          stock: product.qty,
          qty: 1,
          total: Number(product.price) * 1,
        },
      ];
    });
  };

  const removeFromOrder = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty === 0) {
      removeFromOrder(id);
    } else {
      const item = orderItems.find((item) => item.id === id);
      if (!item) return;
      if (qty > item.stock) {
        toast.warning("Out of stock");
        return;
      }
      setOrderItems(
        orderItems.map((item) => (item.id === id ? { ...item, qty } : item)),
      );
    }
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  //mutate
  const { mutate: createOrderMutate } = useCreateOrder();
  const { mutate: createPaymentMutate } = useCreatePayment();
  const { mutate: checkTransactionMutate } = useCheckTransaction();
  //function
  const handlePlaceOrder = () => {
    setIsLoading(true);
    const payload: orderPayload = {
      discount: 0,
      items: orderItems.map((item) => ({
        productId: item.id,
        qty: item.qty,
      })),
    };
    createOrderMutate(payload, {
      onSuccess: (orderRes) => {
        const orderId = orderRes.data.id;
        createPaymentMutate(orderId, {
          onSuccess: (res) => {
            if (res.data) {
              const form = document.createElement("form");
              const payway = res.data.payway;
              form.id = "aba_merchant_request";
              form.method = payway.method;
              form.action = payway.action;
              form.target = payway.target;
              Object.entries(payway.field).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
              });
              document.body.appendChild(form);
              setIsOpen(false);
              AbaPayway?.checkout();
            }
          },
        });
        // setOrderItems([]);
        // setIsOpen(false);
        // setIsSuccess(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };
  //hook
  const tranId = searchParams.get("tranId");
  useEffect(() => {
    if (tranId) {
      checkTransactionMutate(tranId, {
        onSuccess: () => {
          setSearchParams({});
        },
      });
    }
  }, [tranId]);

  if (isLoading) {
    return (
      <>
        <p className="flex items-center justify-center h-full">
          <SpinnerCustom />
        </p>
      </>
    );
  }
  return (
    <>
      <div className="flex h-screen">
        {/* Left Sidebar */}

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Categories</h1>
              <div className="flex items-center gap-2">
                <ChevronLeft className="text-muted-foreground h-5 w-5" />
                <ChevronRight className="text-muted-foreground h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b p-4">
            <div className="flex gap-4 overflow-x-auto">
              {allCategories.map((category, index) => (
                <div
                  key={index}
                  className="hover:bg-muted flex min-w-20 cursor-pointer flex-col items-center rounded-lg p-2"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">
                    {category.icon}
                  </div>
                  <span className="text-muted-foreground text-center text-xs">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* search */}
          <Input
            placeholder="Search product...."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64 mt-6 ml-6"
          />

          {/* Menu Items Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((item: IProduct) => (
                <Card
                  key={item.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg p-0"
                  onClick={() => addToOrder(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={
                          item?.productImages?.[0]?.imageUrl || "/no-image.png"
                        }
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground mb-2 text-sm">
                        {item?.category?.name}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ${item.price}
                      </p>
                      <p>Available Stock: {item.qty}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* pagination */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <Pagination>
                <PaginationContent>
                  {/* Previous */}
                  <PaginationItem>
                    <PaginationPrevious
                      size="sm"
                      href="#"
                      onClick={() => {
                        if (pagination?.prePage) setPage(pagination.prePage);
                      }}
                    />
                  </PaginationItem>

                  {/* Page numbers */}
                  {pages.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        size="sm"
                        href="#"
                        isActive={p === pagination?.currentPage}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Next */}
                  <PaginationItem>
                    <PaginationNext
                      size="sm"
                      href="#"
                      onClick={() => {
                        if (pagination?.nextPage) setPage(pagination.nextPage);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page">
                  Rows per page
                </FieldLabel>
                <Select
                  value={String(limit)}
                  onValueChange={(value) => setLimit(Number(value))}
                >
                  <SelectTrigger className="w-20" id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectGroup>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Order Summary */}
        <div className="flex w-80 flex-col border-l">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">
                Draft #{draftNumber.toString().padStart(3, "0")}
              </h2>
              <div className="flex items-center gap-2">
                <Plus className="text-muted-foreground h-4 w-4" />
                <Trash2
                  className="text-muted-foreground h-4 w-4 cursor-pointer"
                  onClick={() => setOrderItems([])}
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {orderItems.map((item: ICart, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3"
                >
                  <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                    <span className="text-lg">
                      <img src={item.imageUrl} alt={item.name} />
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-muted-foreground text-xs">
                      {item.category}
                    </p>
                    <p>${item.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">${item.price * item.qty}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className=" cursor-pointer"
                      >
                        <Minus />
                      </button>
                      <p>{item.qty}</p>
                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className=" cursor-pointer"
                      >
                        <Plus />
                      </button>
                      <Trash2Icon
                        className="cursor-pointer"
                        onClick={() => removeFromOrder(item.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}$</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{tax.toFixed(2)}$</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)}$</span>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex h-auto flex-col items-center bg-transparent p-4"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <span className="font-semibold text-green-600">$</span>
                </div>
                <span className="text-xs">Cash</span>
              </Button>

              <Button
                variant="outline"
                className="flex h-auto flex-col items-center bg-transparent p-4"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                  <QrCode className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs">Scan</span>
              </Button>
            </div>
            <div>
              <Button
                onClick={() => setIsOpen(true)}
                className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700 cursor-pointer"
              >
                Checkout ${total.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* modal */}

      {/* modal check-out */}
      <Dialog
        open={isOpen}
        setOpen={setIsOpen}
        isCancel={false}
        title="Order Summary"
      >
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {orderItems.map((item: ICart, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center gap-3"
              >
                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                  <span className="text-lg">
                    <img src={item.imageUrl} alt={item.name} />
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    {item.category}
                  </p>
                  <p className="space-x-3">
                    <span>${item.price}</span>x
                    <span className="text-green-500">{item.qty}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold">${item.price * item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="text-right">
          <p>tax: {tax.toFixed(2)}$ </p>
          <p>total: {total.toFixed(2)}$</p>
        </div>
        <div className="flex justify-around space-y-3">
          <button
            onClick={handlePlaceOrder}
            type="button"
            className="border border-amber-500 p-3 rounded-lg w-full cursor-pointer"
          >
            Place Order
          </button>
        </div>
      </Dialog>
      {/* modal-success */}
      <Dialog
        open={isSuccess}
        setOpen={setIsSuccess}
        isCancel={false}
        title="Order Successfuly"
        width="25"
      >
        <div className="flex flex-col items-center justify-center">
          <img className="" src="/onSuccess.png" alt="icon-success" />
          <p>Order Create Successfuly</p>
        </div>
      </Dialog>
    </>
  );
}
