import { useState } from "react";
import CategoryForm from "../../components/form/CategoryForm";
import { DataTable } from "../../components/global/data-table";
import { columns } from "../../components/table/categories/columns";
import { useCategories, useDeleteCategory } from "../hooks/useCategoryQuery";
import { Button } from "../../components/ui/button";
import { CirclePlus } from "lucide-react";
import { Input } from "../../components/ui/input";
import type { ICategory } from "../../types/category";
import { toast } from "sonner";
import ConfirmDelete from "./ConfirmDelete";
import { useDebounce } from "use-debounce";

import {
  Pagination,
  PaginationContent,
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

import { Field, FieldLabel } from "../../components/ui/field";
import { SpinnerCustom } from "../../components/ui/spinner";

function Category() {
  const { mutate: deleteCategoryMutate } = useDeleteCategory();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [category, setCategory] = useState<ICategory | undefined>(undefined);
  const [search, setSearch] = useState("");

  const [value] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data, isLoading } = useCategories(search, page, limit);
  console.log("category data", data);

  const pagination = data?.pagination;
  const totalPages = Math.ceil(
    (pagination?.total || 0) / (pagination?.limit || 10),
  );
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEdit = (category: ICategory) => {
    console.log("category", category);
    setCategory(category);
    setIsCategoryOpen(true);
  };

  const onDelete = (category: ICategory) => {
    console.log("get the click category", category);
    setCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteCategoryMutate(
      { id: category?.id },
      {
        onSuccess: () => {
          toast.success("category delete succefully");
        },
      },
    );
  };

  console.log("debounce value", value);

  // const handleClose = () => {
  //   setIsCategoryOpen(false);
  // };
  if (isLoading) {
    return <SpinnerCustom />;
  }
  return (
    <>
      <div>
        <CategoryForm
          isCategoryOpen={isCategoryOpen}
          setIsCategoryOpen={setIsCategoryOpen}
          category={category}
        />

        <div className="flex gap-5 mb-3">
          <Button
            onClick={() => {
              setCategory(undefined);
              setIsCategoryOpen(true);
            }}
          >
            <CirclePlus /> Create Category
          </Button>
          <div>
            <Input
              placeholder="Search By Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete })}
          data={data?.data ?? []}
        />
        <ConfirmDelete
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          category={category}
          confirmDelete={confirmDelete}
        />

        {/* pagination */}
        <div className="flex items-center justify-between gap-4 py-4">
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
    </>
  );
}

export default Category;
