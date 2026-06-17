import { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModalPreviewPublish } from "@/features/tasks/components/ModalPreviewPublish";

export interface ScheduledContentItem {
  id: string | number;
  title: string;
  campaign: string;
  platform: string;
  platformBg: string;
  pillar: string;
  pillarBg: string;
  pillarDot: string;
  postDate: string;
  time: string;
  status: "Published" | "Approved" | "On Progress" | "Draft" | string;
  statusBg: string;
  statusDot: string;
  hasPublishButton: boolean;
}

interface SchedulesContentProps {
  contents: ScheduledContentItem[];
  title?: string;
  itemsPerPage?: number;
  onScheduleNew?: () => void;
  onPreview?: (item: ScheduledContentItem) => void;
  onEdit?: (item: ScheduledContentItem) => void;
  onCancel?: (item: ScheduledContentItem) => void;
}

export function SchedulesContent({
  contents,
  title = "List All Content",
  itemsPerPage = 6,
  onPreview,
}: SchedulesContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Local CRUD items state initialized from props
  const [prevContents, setPrevContents] = useState(contents);
  const [items, setItems] = useState<ScheduledContentItem[]>(() => contents);

  if (contents !== prevContents) {
    setPrevContents(contents);
    setItems(contents);
  }



  // Preview modal states & actions
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [itemToPreview, setItemToPreview] = useState<ScheduledContentItem | null>(null);

  const openPreviewModal = (item: ScheduledContentItem) => {
    setItemToPreview(item);
    // Open in next tick to allow DropdownMenu to fully close first,
    // avoiding Radix overlay pointer-events locking issue.
    setTimeout(() => {
      setIsPreviewModalOpen(true);
    }, 100);
    onPreview?.(item);
  };

  const handlePublish = (item: ScheduledContentItem) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === item.id) {
          return {
            ...it,
            status: "Published",
            statusBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
            statusDot: "bg-blue-500",
          };
        }
        return it;
      }),
    );
    setIsPreviewModalOpen(false);
  };




  const filteredItems = items.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pillar.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="w-full sm:w-1/2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, campaign, or pillar..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto rounded-xl border border-gray-50">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium py-3">
                Content
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Platform
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Pillar
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Post Date
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Time
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Status
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-center py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col max-w-60">
                      <span className="font-bold text-gray-900 leading-snug wrap-break-word">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5 font-medium wrap-break-word">
                        {item.campaign}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <PlatformBadge
                      platform={item.platform}
                      className="text-xs font-medium"
                    />
                  </TableCell>

                  <TableCell className="py-4">
                    <PillarsCard
                      category={item.pillar}
                    />
                  </TableCell>

                  <TableCell className="py-4 text-gray-500 font-medium text-sm">
                    {item.postDate}
                  </TableCell>

                  <TableCell className="py-4 text-gray-500 font-medium text-sm">
                    {item.time}
                  </TableCell>

                  <TableCell className="py-4">
                    <StatusBadgeContent
                      status={item.status}
                      className="text-xs font-bold"
                    />
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={() => openPreviewModal(item)}
                        variant="outline"
                        size="sm"
                        className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-200/80 rounded-xl px-3 h-8 text-xs flex items-center gap-1.5 shadow-none cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              /* State Jika Data Sistem Kosong */
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v6a2 2 0 012-2m14-10V4a2 2 0 00-2-2H5a2 2 0 00-2 2v7"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No content scheduled
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      There are no content records registered in the timeline
                      yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* State Jika Hasil Pencarian Kosong */
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No matching content
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      We couldn't find any content matching "{searchQuery}".
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2 text-sm text-gray-500 border-t border-gray-100 mt-auto">
        <div>
          Showing{" "}
          <span className="font-medium text-gray-900">
            {totalItems === 0 ? 0 : indexOfFirstItem + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-900">
            {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
          </span>{" "}
          of <span className="font-medium text-gray-900">{totalItems}</span>{" "}
          contents
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl h-9 px-3 gap-1 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center justify-center min-w-8 font-medium text-gray-900 px-2">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-xl h-9 px-3 gap-1 border-gray-200"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>



      {/* Separated Preview Publish Modal */}
      <ModalPreviewPublish
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        item={itemToPreview}
        onPublish={handlePublish}
        mode="preview"
      />
    </div>
  );
}
