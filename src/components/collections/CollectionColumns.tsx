'use client'

import { ColumnDef } from "@tanstack/react-table"
import Delete from "../custom ui/Delete"
import Link from "next/link"


export const columns: ColumnDef<CollectionType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <Link href={`/collections/${row.original._id}`} className="hover:text-blue-400">{row.original.title}</Link>
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => <p>{row.original.products.length}</p>
    },
    {
      id: "action",
      cell: ({ row }) => <Delete item="collection" id={row.original._id}/>
    },
  ]