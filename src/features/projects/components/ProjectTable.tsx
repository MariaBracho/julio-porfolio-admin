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

import { Project } from "@/features/projects/types/project";

import Action from "@/components/table/Actions";

import dynamic from "next/dynamic";
import {
  useDeletePropject,
  useGetProjects,
} from "@/features/projects/queries/projects";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";

import { Link1Icon } from "@radix-ui/react-icons";

const ProjectFormModal = dynamic(() => import("./ProjectFormModal"));

export default function ProjectTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useGetProjects();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEditProject, setIsEditProject] = useState(false);

  const [projectRow, setProjectRow] = useState<null | Project>(null);

  const { mutateAsync: deleteProject } = useDeletePropject();

  const deleteProjectHanlder = async (id: number) => {
    await deleteProject({ id });
  };

  const openEditProjectModal = (category: Project) => {
    setIsEditProject(true);
    setIsOpenModal(true);
    setProjectRow(category);
  };

  const columns: ColumnDef<Project | any>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => <p>{row.getValue("id")}</p>,
    },
    {
      accessorKey: "img",
      header: "Foto del proyecto",
      cell: ({ row }) => (
        <Image
          src={row.getValue("img")}
          alt="img"
          width={224}
          height={224}
          className="h-52 w-52 object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Titulo",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.getValue("logo")} />
          <AvatarFallback>logo</AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "categories",
      header: "Categoría",
      cell: ({ row }) => <div>{row.original?.categories?.name}</div>,
    },
    {
      accessorKey: "url_link",
      header: "URL",
      cell: ({ row }) => (
        <a target="_blank" rel="noopener" href={row.getValue("url_link")}>
          <div className="flex gap-2 items-center text-sky-500 ">
            <Link1Icon />
            <p> Link</p>
          </div>
        </a>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Action
            editCallback={() => openEditProjectModal(row.original)}
            deleteCallback={() => deleteProjectHanlder(row.original.id)}
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
    setIsEditProject(false);
    setProjectRow(null);
  };

  return (
    <div className="w-full">
      {isOpenModal && (
        <ProjectFormModal
          isLoading={isLoading}
          data={projectRow}
          open={isOpenModal}
          setOpen={setIsOpenModal}
          isEdit={isEditProject}
        />
      )}
      <div className="w-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-full">
            <div className="flex items-center  justify-between py-4">
              <Input
                placeholder="Filtrar proyectos..."
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Button onClick={openCreateCategoryModal}>Crear Proyecto</Button>
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
