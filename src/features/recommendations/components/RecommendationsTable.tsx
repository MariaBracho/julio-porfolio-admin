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

import { Recommendations } from "../types/recommendations";
import {
  useDeleteRecommendation,
  useGetRecommendations,
} from "../queries/recommendationsQueries";

const RecommendationsFormModal = dynamic(
  () => import("@/features/recommendations/components/RecommendationsFormModal")
);

export default function RecommendationsTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useGetRecommendations();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditRecommendation, setIsEditRecommendation] = useState(false);

  const [recommendationRow, setRecommendationRow] =
    useState<null | Recommendations>(null);

  const { mutateAsync: deleteRecommendation } = useDeleteRecommendation();

  const deleteRecommendationHanlder = async (id: number) => {
    await deleteRecommendation({ id });
  };

  const openEditRecommendationModal = (recommendation: Recommendations) => {
    setIsEditRecommendation(true);
    setIsOpenModal(true);
    setRecommendationRow(recommendation);
  };

  const columns: ColumnDef<Recommendations | any>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <p>{row.getValue("id")}</p>,
    },
    {
      accessorKey: "username",
      header: "Usuario",
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="max-w-52">
          <p className="line-clamp-2">{row.getValue("description")}</p>
        </div>
      ),
    },
    {
      accessorKey: "profilePicture",
      header: "Foto de perfil",
      cell: ({ row }) => (
        <Image
          src={row.getValue("profilePicture") ?? ""}
          alt="icon"
          width={24}
          height={24}
          className="object-cover h-6 w-6 rounded-full"
        />
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Action
            editCallback={() => openEditRecommendationModal(row.original)}
            deleteCallback={() => deleteRecommendationHanlder(row.original.id)}
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
    setIsEditRecommendation(false);
    setRecommendationRow(null);
  };

  return (
    <div className="w-full">
      {isOpenModal && (
        <RecommendationsFormModal
          data={recommendationRow}
          open={isOpenModal}
          setOpen={setIsOpenModal}
          isEdit={isEditRecommendation}
        />
      )}
      <div className="w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full">
            <div className="flex items-center  justify-between py-4">
              <Input
                placeholder="Filtrar por usuario"
                value={
                  (table.getColumn("username")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("username")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Button onClick={openCreateEducationModal}>
                Crear recomendación
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
