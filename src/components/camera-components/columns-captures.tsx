"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import ShowImageComponent from "./ShowImageComponent";

export type Captures = {
  id: number;
  path: string;
  name: string;
  type: string;
  date: string;
};

export const columns: ColumnDef<Captures>[] = [
  {
    accessorKey: "path",
    header: "Filename",
    cell: ({ row }) => {
      const filename = row.getValue("path") as string;

      return <ShowImageComponent path={filename} />;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Filetype
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const filetype = row.getValue("type") as string;

      return <div className="text-nowrap text-left">{filetype}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));

      return (
        <div className="text-nowrap text-left tracking-tight">
          {date.toLocaleTimeString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </div>
      );
    },
  },
];
