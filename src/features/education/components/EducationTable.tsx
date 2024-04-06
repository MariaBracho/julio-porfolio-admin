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

import Action from "@/components/table/Actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Education } from "../types/educationType";
import {
  useDeleteEducation,
  useGetEducations,
} from "../queries/educationQueries";

const EducationFormModal = dynamic(
  () => import("@/features/education/components/EducationFormModal")
);

export default function EducationTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useGetEducations();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditEducation, setIsEditEducation] = useState(false);

  const [educationRow, setEducationRow] = useState<null | Education>(null);

  const { mutateAsync: deleteEducation } = useDeleteEducation();

  const deleteEducationHanlder = async (id: number) => {
    await deleteEducation({ id });
  };

  const openEditEducationModal = (education: Education) => {
    setIsEditEducation(true);
    setIsOpenModal(true);
    setEducationRow(education);
  };

  const CURRENT_DATE_TEXT = "Actualidad";

  const columns: ColumnDef<Education | any>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <p>{row.getValue("id")}</p>,
    },
    {
      accessorKey: "training",
      header: "Formación",
      cell: ({ row }) => <div>{row.getValue("training")}</div>,
    },
    {
      accessorKey: "institution",
      header: "Institución",
      cell: ({ row }) => <div>{row.getValue("institution")}</div>,
    },
    {
      accessorKey: "start_date",
      header: "Fecha de inicio",
      cell: ({ row }) => <div>{row.getValue("start_date")}</div>,
    },
    {
      header: "Fecha de finalización",
      cell: ({ row }) => (
        <div>
          {row.original.isEducationFinish
            ? row.original.end_date
            : CURRENT_DATE_TEXT}
        </div>
      ),
    },
    {
      accessorKey: "logo",
      header: "Logo de la institución",
      cell: ({ row }) => (
        <Image
          src={row.getValue("logo") ?? ""}
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
            editCallback={() => openEditEducationModal(row.original)}
            deleteCallback={() => deleteEducationHanlder(row.original.id)}
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

  const openCreateEducationModal = () => {
    setIsOpenModal(true);
    setIsEditEducation(false);
  };

  return (
    <div className="w-full">
      {isOpenModal && (
        <EducationFormModal
          data={educationRow}
          open={isOpenModal}
          setOpen={setIsOpenModal}
          isEdit={isEditEducation}
        />
      )}
      <div className="w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full">
            <div className="flex items-center  justify-between py-4">
              <Input
                placeholder="Filtrar por institución"
                value={
                  (table
                    .getColumn("institution")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("institution")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Button onClick={openCreateEducationModal}>
                Crear Educación
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
