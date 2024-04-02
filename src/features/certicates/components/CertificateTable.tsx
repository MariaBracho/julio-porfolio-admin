"use client";

import { useState } from "react";

import dynamic from "next/dynamic";
import Image from "next/image";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Certificate } from "@/features/certicates/types/certificate";

import Action from "@/components/table/Actions";

import {
  useDeleteCertificate,
  useGetCertificates,
} from "@/features/certicates/queries/certificatesQueries";

import useSupabaseBrowser from "@/utils/supabase-browser";

const CertificateFormModal = dynamic(() => import("./CertificateFormModal"));

export default function CertificateTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const client = useSupabaseBrowser();

  const { data, isLoading } = useGetCertificates();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);

  const [categoryRow, setCategoryRow] = useState<null | Certificate>(null);

  const { mutateAsync: deleteCertificate } = useDeleteCertificate();

  const deleteCertificateHanlder = async (id: number) => {
    const certificate = await deleteCertificate({ id });
    const fileName =
      certificate?.img && (certificate?.img as string).split("/").at(-1);

    await client.storage.from("certificate").remove([`${fileName}`]);
  };

  const openEditCategoryModal = (category: Certificate) => {
    setIsEditCategory(true);
    setIsOpenModal(true);
    setCategoryRow(category);
  };

  const columns: ColumnDef<Certificate>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <p>{row.getValue("id")}</p>,
    },
    {
      accessorKey: "img",
      header: "Certificado",
      cell: ({ row }) => (
        <Image
          src={row.getValue("img")}
          alt="img"
          width={200}
          height={200}
          className="w-auto h-auto"
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
            deleteCallback={() => deleteCertificateHanlder(row.original.id)}
            row={row.original}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const openCreateCategoryModal = () => {
    setIsOpenModal(true);
    setIsEditCategory(false);
  };

  return (
    <div className="w-full">
      {isOpenModal && (
        <CertificateFormModal
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
            <div className="flex items-center  justify-end py-4">
              <Button onClick={openCreateCategoryModal}>
                Crear certificado
              </Button>
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
