// components/columns/FeedbackColumns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";

export type Feedback = {
  userName: string;
  userEMail: string;
  message: string;
  rating: number;
};

export const feedbackColumns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "userEMail",
    header: "Email",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating: number = row.getValue("rating");
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      );
    },
  },
];
