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

import type { Skill } from "@/features/skills/types/skills";

import {
  useDeleteSKills,
  useGetSkills,
} from "@/features/skills/queries/skillsQueries";

const SkillFormModal = dynamic(
  () => import("@/features/skills/components/SkillsFormModal")
);

export default function SkillsTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);

  const [workExperienceRow, setWorkExperienceRow] = useState<null | Skill>(
    null
  );

  const { data, isLoading } = useGetSkills();

  const { mutateAsync: deleteSkill } = useDeleteSKills();

  const deleteWorkExperienceHandler = async (id: number) => {
    await deleteSkill({ id });
  };

  const openEditWorkExperienceModal = (workExperience: Skill) => {
    setIsEditCategory(true);
    setIsOpenModal(true);
    setWorkExperienceRow(workExperience);
  };

  const columns: ColumnDef<Skill | any>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <p>{row.getValue("id")}</p>,
    },
    {
      accessorKey: "name",
      header: "Skill",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Action
            editCallback={() => openEditWorkExperienceModal(row.original)}
            deleteCallback={() => deleteWorkExperienceHandler(row.original.id)}
            row={row.original}
          />
        );
      },
    },
  ];

  const CREATE_TEXT_BUTTON = "Agregar Skill";

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
    setWorkExperienceRow(null);
  };

  return (
    <div className="w-full">
      {isOpenModal && (
        <SkillFormModal
          data={workExperienceRow}
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
                placeholder="Filtrar por skill"
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Button onClick={openCreateCategoryModal}>
                {CREATE_TEXT_BUTTON}
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
