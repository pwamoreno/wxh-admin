"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.id._id}`}
        className="hover:text-blue-400"
      >
        {row.original.id.title}
      </Link>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  }
];
