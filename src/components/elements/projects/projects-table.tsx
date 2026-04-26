import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "#/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { useProjects } from "#/queries/use-projects"

import { ProjectActions } from "./project-actions"

type Project = NonNullable<ReturnType<typeof useProjects>["data"]>[number]

export const ProjectTable = () => {
  const { data: projects } = useProjects()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorKey: "id",
        header: "#",
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          const SortIcon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={column.getToggleSortingHandler()}
              className="-ml-2"
            >
              Name
              <SortIcon data-icon="inline-end" />
            </Button>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          const SortIcon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={column.getToggleSortingHandler()}
              className="-ml-2"
            >
              Created At
              <SortIcon data-icon="inline-end" />
            </Button>
          )
        },
        cell: ({ getValue }) => {
          return <time>{getValue().toLocaleDateString()}</time>
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => <ProjectActions project={row.original} />,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: projects ?? [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                      ? "descending"
                      : "none"
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
