import { ColumnDef } from "@tanstack/react-table";
import { Category } from "../types/category";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    cell: ({ row }) => <p>{row.getValue("id")}</p>,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return <Actions row={payment} />;
    },
  },
];
