import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Tag } from "lucide-react";
import { getColorToken } from "../constants/colorPalette";
import type { ContentCategory } from "@/features/contents/api/contentCategoriesApi";

interface ContentCategoryListProps {
  categories: ContentCategory[];
  onEdit: (category: ContentCategory) => void;
  onDelete: (category: ContentCategory) => void;
}

export function ContentCategoryList({
  categories,
  onEdit,
  onDelete,
}: ContentCategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200 flex-1">
        <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-800 mb-3 border border-red-100">
          <Tag className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">
          No Content Category
        </h4>
        <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-semibold">
          Add a new content category to define the media type to be published.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm flex flex-col flex-1 min-h-0 [&>div]:flex-1 [&>div]:overflow-y-auto">
      <Table>
        <TableHeader className="bg-gray-50 sticky top-0 z-10">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-gray-400 font-medium py-3">
              Category Type
            </TableHead>
            <TableHead className="text-gray-400 font-medium py-3 text-center">
              Status
            </TableHead>
            <TableHead className="text-gray-400 font-medium py-3 text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className="border-b border-gray-50 last:border-none hover:bg-gray-50/30 transition-colors"
            >
              <TableCell className="py-3.5 font-semibold text-gray-900 leading-snug">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full border border-black/5 ${getColorToken(category.id, category.color_key).dot}`}
                  />
                  <span>{category.type_name}</span>
                </div>
              </TableCell>
              <TableCell className="py-3.5 text-center">
                <Badge
                  variant="outline"
                  className={`shadow-none rounded-lg px-2.5 py-1 font-semibold text-xs border ${
                    category.is_active
                      ? "bg-green-50/80 text-green-700 border-green-200"
                      : "bg-gray-50/80 text-gray-600 border-gray-200"
                  }`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="py-3.5">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(category)}
                    className="h-8 w-8 text-gray-500 hover:text-gray-700 border-gray-200 rounded-xl cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(category)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50/30 border-gray-200 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
