"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Divide, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import type { IProduct } from "../../../types/product";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface Props {
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

export const columns = ({ onEdit, onDelete }: Props): ColumnDef<IProduct>[] => [
  {
    header: "NO",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Image",
    cell: ({ row }) => (
      <div>
        {/* to handle undefine if no imageUrl productImages?.[0]? */}
        <img
          src={row.original.productImages?.[0]?.imageUrl ?? "/no-image.png"}
          alt=""
          className="aspect-square w-20 h-20 object-cover rounded"
        />
      </div>
    ),
  },
  {
    header: "Title",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="">
        <Badge className="px-4 ">{row.original.price}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="w-full max-w-200 text-wrap">
        {row.original.description}
      </div>
    ),
  },
  {
    header: "Qty",
    cell: ({ row }) => (
      <div className="">
        <Badge className="px-4 ">{row.original.qty}</Badge>
      </div>
    ),
  },
  {
    header: "Category",
    cell: ({ row }) => (
      <div className="">
        <Badge className="px-4 ">{row.original.category?.name}</Badge>
      </div>
    ),
    filterFn: "equalsString",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <SquarePen />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
