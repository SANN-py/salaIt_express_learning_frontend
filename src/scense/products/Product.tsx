import { DataTable } from "../../components/global/data-table";
import { columns } from "../../components/table/products/columns";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SpinnerCustom } from "../../components/ui/spinner";
import { getProduct } from "../../services/product.service";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ProductForm } from "../../components/form/ProductForm";
import { CirclePlus } from "lucide-react";
import { createCategory } from "../../services/category.service";
import type { IProduct } from "../../types/product";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useDeleteProduct, useProducts } from "../hooks/useProduct";
import { Field, FieldLabel } from "../../components/ui/field";
import { getAccessToken } from "../login/TokenStorage";
import { useNavigate } from "react-router-dom";
import FileUpload01 from "../../components/file-upload-01";

// const BASE_URI = "http://localhost:3000/api/v1";
function Product() {
  // const products = [
  //   {
  //     id: 1,
  //     name: "Laptop",
  //     price: 232,
  //     qty: 12,
  //   },
  //   {
  //     id: 2,
  //     name: "Phone",
  //     price: 23,
  //     qty: 2,
  //   },
  // ];
  // const [products, setProducts] = useState([]);
  // // use on useEffect
  // const getProduct = async () => {
  //   const res = await fetch(`${BASE_URI}/products`);
  //   const data = await res.json();
  //   console.log("data", data);
  //   setProducts(data.data);
  //   return data;
  // };
  // useEffect(() => {
  //   getProduct();
  // }, []);

  // const getProduct = async () => {
  //   const res = await fetch(`${BASE_URI}/products`);
  //   const data = await res.json();
  //   console.log("data", data);

  //   return data;
  // };

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(
    undefined,
  );
  const [formKey, setFormKey] = useState(0);
  const { mutate: deleteProductMutate } = useDeleteProduct();
  const { data: productsData, isLoading } = useProducts(search, page, limit);

  const navigate = useNavigate();

  // const {data,isLoading} = useQuery({ queryKey: ["products"], queryFn: getProduct });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <SpinnerCustom />
      </div>
    );
  }
  const products = productsData?.data ?? [];
  const handleSearch = () => {
    console.log("search input", searchInput);
    setSearch(searchInput);
  };

  const onEdit = (product: IProduct) => {
    console.log("edit product", product);
    setSelectedProduct(product);
    setFormKey((k) => k + 1);
    setIsProductOpen(true);
  };
  const onDelete = (product: IProduct) => {
    console.log("delete product", product);
    deleteProductMutate({ id: product.id });
  };
  const pagination = productsData?.pagination;
  const totalPages = Math.ceil(
    (pagination?.total || 0) / (pagination?.limit || 10),
  );
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const accessToken = getAccessToken();

  if (!accessToken) {
    navigate("/admin/login");
  }

  return (
    <>
      <ProductForm
        key={formKey}
        isProductOpen={isProductOpen}
        setIsProductOpen={() => {
          (setIsProductOpen(false), setSelectedProduct(undefined));
        }}
        product={selectedProduct}
      />

      <div className="flex gap-5  mb-3">
        <Button
          onClick={() => {
            setSelectedProduct(undefined);
            setIsProductOpen(true);
          }}
        >
          <CirclePlus /> Create Product
        </Button>

        <Input
          className="w-full max-w-1/5"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={() => handleSearch()} className="cursor-pointer">
          Search
        </Button>
      </div>

      {/* data table from shadcnui */}
      <DataTable columns={columns({ onEdit, onDelete })} data={products} />

      {/* pagination */}
      <div className="flex items-center justify-between gap-4">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
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
                href="#"
                onClick={() => {
                  if (pagination?.nextPage) setPage(pagination.nextPage);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
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
    </>
  );
}

export default Product;
