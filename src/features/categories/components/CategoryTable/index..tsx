"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";

import {
  useDeleteCategory,
  useGetCategories,
} from "@/features/categories/queries/categoriesQueries";

import type { Category } from "@/features/categories/types/category";

import Action from "@/components/table/Actions";
import dynamic from "next/dynamic";
import Image from "next/image";

const CategoryModal = dynamic(
  () => import("@/features/categories/components/CategoryModal")
);

export default function CategoryTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useGetCategories();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);

  const [categoryRow, setCategoryRow] = useState<null | Category>(null);

  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const deleteCategoryHanlder = async (id: number) => {
    await deleteCategory({ id });
  };

  const openEditCategoryModal = (category: Category) => {
    setIsEditCategory(true);
    setIsOpenModal(true);
    setCategoryRow(category);
  };

  const columns: ColumnDef<Category>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <p>{row.getValue("id")}</p>,
    },
    {
      accessorKey: "name",
      header: "Categoria",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "icon",
      header: "Icono",
      cell: ({ row }) => (
        <Image
          src={row.getValue("icon") ?? ""}
          alt="icon"
          width={24}
          height={24}
          className="object-cover h-6 w-6"
        />
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Action
            editCallback={() => openEditCategoryModal(row.original)}
            deleteCallback={() => deleteCategoryHanlder(row.original.id)}
            row={row.original}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const openCreateCategoryModal = () => {
    setIsOpenModal(true);
    setIsEditCategory(false);
  };

  return (
    <div className="w-full">
      {isOpenModal && (
        <CategoryModal
          data={categoryRow}
          open={isOpenModal}
          setOpen={setIsOpenModal}
          isEdit={isEditCategory}
        />
      )}
      <div className="w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full">
            <div className="flex items-center  justify-between py-4">
              <Input
                placeholder="Filter categories..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Button onClick={openCreateCategoryModal}>Crear categoría</Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
