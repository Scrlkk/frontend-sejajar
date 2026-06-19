import {
  MoreHorizontal,
  Clock,
  Users,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
  Pencil,
  ListTodo,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { differenceInDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import { useNavigate } from "react-router-dom";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { PriorityCard } from "@/features/pillars/components/PriorityCard";
import { FormatBadgeContent } from "@/features/pillars/components/FormatBadgeContent";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";

interface ContentBoardProps {
  cards: ContentPlanCardItem[];
  selectedFilter: ContentPlanCardItem["status"] | "All";
  openPreviewModal: (card: ContentPlanCardItem) => void;
  openEditModal: (card: ContentPlanCardItem) => void;
  openAssignModal: (card: ContentPlanCardItem) => void;
  openRevisionModal: (card: ContentPlanCardItem) => void;
  handleDeleteCard: (card: ContentPlanCardItem) => void;
  openAddModal: () => void;
  openTasksAddModal: (card: ContentPlanCardItem) => void;
  handlePublishCard: (id: string) => void;
}

// Filtered statuses to display as columns
const activeStatuses: ContentPlanCardItem["status"][] = [
  "Draft",
  "Assigned",
  "On Progress",
  "Review",
  "Revision",
  "Approved",
  "Published",
];

// Helper to get styling for status columns/dots
const getStatusStyle = (status: ContentPlanCardItem["status"]) => {
  switch (status) {
    case "Draft":
      return {
        dot: "bg-slate-500",
        text: "text-slate-600",
        bg: "bg-slate-50/50",
        border: "border-slate-300",
        cardBorder: "border-slate-300 hover:border-slate-400",
      };
    case "Assigned":
      return {
        dot: "bg-blue-600",
        text: "text-blue-600",
        bg: "bg-blue-50/40",
        border: "border-blue-300",
        cardBorder: "border-blue-300 hover:border-blue-400",
      };
    case "On Progress":
      return {
        dot: "bg-amber-600",
        text: "text-amber-700",
        bg: "bg-amber-50/30",
        border: "border-amber-300",
        cardBorder: "border-amber-300 hover:border-amber-400",
      };
    case "Review":
      return {
        dot: "bg-purple-600",
        text: "text-purple-600",
        bg: "bg-purple-50/40",
        border: "border-purple-300",
        cardBorder: "border-purple-300 hover:border-purple-400",
      };
    case "Revision":
      return {
        dot: "bg-red-600",
        text: "text-red-600",
        bg: "bg-red-50/40",
        border: "border-red-300",
        cardBorder: "border-red-300 hover:border-red-400",
      };
    case "Approved":
      return {
        dot: "bg-emerald-600",
        text: "text-emerald-600",
        bg: "bg-emerald-50/40",
        border: "border-emerald-300",
        cardBorder: "border-emerald-300 hover:border-emerald-400",
      };
    case "Published":
      return {
        dot: "bg-cyan-600",
        text: "text-cyan-600",
        bg: "bg-cyan-50/40",
        border: "border-cyan-300",
        cardBorder: "border-cyan-300 hover:border-cyan-400",
      };
    default:
      return {
        dot: "bg-slate-500",
        text: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-gray-200",
        cardBorder: "border-gray-300 hover:border-gray-400",
      };
  }
};



export function ContentBoard({
  cards,
  selectedFilter,
  openPreviewModal,
  openEditModal,
  openAssignModal,
  openRevisionModal,
  handleDeleteCard,
  openAddModal,
  openTasksAddModal,
  handlePublishCard,
}: ContentBoardProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex gap-4 overflow-x-auto pb-4 scrollbar-none">
      {activeStatuses
        .filter(
          (status) => selectedFilter === "All" || selectedFilter === status,
        )
        .map((status) => {
          const columnsCards = cards.filter((card) => card.status === status);
          const style = getStatusStyle(status);

          return (
            <div key={status} className="w-60 shrink-0 flex flex-col gap-3">
              {/* Column Header */}
              <div
                className={`rounded-xl p-3 flex items-center justify-between border ${style.bg} ${style.border}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`}
                  />
                  <span className={`text-xs font-semibold ${style.text}`}>
                    {status}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold ${style.text} shrink-0`}
                >
                  {columnsCards.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="flex flex-col gap-3 min-h-37.5">
                {columnsCards.map((card) => {
                  const overdueDays = card.overdue
                    ? differenceInDays(new Date(), new Date(card.dueDate))
                    : 0;
                  const isOverdue = card.overdue && overdueDays > 0;

                  return (
                    <div
                      key={card.id}
                      onClick={() => openPreviewModal(card)}
                      className={`bg-white rounded-xl border p-3.5 shadow-sm flex flex-col gap-2.5 relative transition-all duration-200 cursor-pointer hover:shadow-md ${
                        isOverdue
                          ? "border-red-800 outline outline-red-800/10 shadow-red-800/5"
                          : style.cardBorder
                      }`}
                    >
                      {/* More action menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 h-8 w-8 cursor-pointer rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white border border-gray-300/80 shadow-md rounded-xl p-1 z-50"
                        >
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(card);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Edit Plan</span>
                          </DropdownMenuItem>
                          {card.status === "Assigned" && (
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                openTasksAddModal(card);
                              }}
                            >
                              <ListTodo className="h-4 w-4 text-slate-500 shrink-0" />
                              <span>Add Tasks</span>
                            </DropdownMenuItem>
                          )}
                          {card.status === "On Progress" && (
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tasks?id=${card.id}`);
                              }}
                            >
                              <ListTodo className="h-4 w-4 text-slate-500 shrink-0" />
                              <span>View Tasks</span>
                            </DropdownMenuItem>
                          )}
                          {card.status === "Review" && (
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tasks?id=${card.id}`);
                              }}
                            >
                              <ListTodo className="h-4 w-4 text-slate-500 shrink-0" />
                              <span>Review Tasks</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignModal(card);
                            }}
                          >
                            <UserPlus className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Assign Team</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openRevisionModal(card);
                            }}
                          >
                            <RefreshCw className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>
                              {card.status === "Revision"
                                ? "See Revision"
                                : "Request Revision"}
                            </span>
                          </DropdownMenuItem>

                          {/* View Published URL — only for Published cards with a URL */}
                          {card.status === "Published" && card.fileUrl && (
                            <DropdownMenuItem
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-cyan-700 rounded-lg cursor-pointer hover:bg-cyan-50 focus:bg-cyan-50 focus:text-cyan-800 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(card.fileUrl, "_blank", "noopener,noreferrer");
                              }}
                            >
                              <ExternalLink className="h-4 w-4 text-cyan-500 shrink-0" />
                              <span>View Published URL</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:text-red-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Title */}
                      <h4 className="text-sm max-w-50 font-semibold text-slate-900 leading-snug line-clamp-2 pr-6">
                        {card.title}
                      </h4>

                      {/* Meta Tags Row */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {/* Category Badge */}
                        <PillarsCard category={card.category} />
                        {/* Platform Badge */}
                        <PlatformBadge
                          platform={card.platform}
                          className="rounded-lg px-2 py-0.5 text-[10px]"
                          showDot={false}
                        />
                        {/* Content Pillar Badge */}
                        {card.pillar && (
                          <PillarsCard category={card.pillar} />
                        )}
                        {/* Format Badge */}
                        <FormatBadgeContent format={card.format} />
                      </div>

                      {/* Priority Badge */}
                      <div className="flex items-center">
                        <PriorityCard priority={card.priority} />
                      </div>

                      {/* Revision Feedback text */}
                      {card.feedback && (
                        <div
                          className={`w-full text-left p-2 rounded-lg mt-0.5 border ${
                            card.status === "Revision"
                              ? "bg-red-50 border-red-100 text-red-500"
                              : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}
                        >
                          <p
                            className="text-[10px] font-semibold leading-tight line-clamp-2"
                            title={card.feedback}
                          >
                            {card.feedback}
                          </p>
                        </div>
                      )}

                      {/* Due Date & Overdue Alert Bar */}
                      {isOverdue ? (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 border border-red-105 text-[10px] mt-1">
                          <div className="flex items-center gap-1 text-red-800 font-bold">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{overdueDays}d overdue</span>
                          </div>
                          <span className="text-slate-400 font-semibold">
                            {card.dueDate}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100 text-[10px] mt-1">
                          <div className="flex items-center gap-1 text-slate-500 font-semibold">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>Due Date</span>
                          </div>
                          <span className="text-slate-500 font-semibold">
                            {card.dueDate}
                          </span>
                        </div>
                      )}

                      {/* Card Footer: Assignees & Feedback */}
                      <div className="pt-2 border-t border-gray-300/70 flex flex-col gap-2">
                        {card.assignedTeam && card.assignedTeam.length > 0 ? (
                          <div className="flex flex-col gap-2 w-full">
                            <div
                              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity min-w-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssignModal(card);
                              }}
                            >
                              {/* Stacked Avatars */}
                              <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                                {card.assignedTeam.map((team, idx) => (
                                  <div
                                    key={idx}
                                    title={team.name}
                                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shrink-0 ${team.avatarBg}`}
                                  >
                                    {team.initials}
                                  </div>
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold ml-1.5 truncate">
                                {card.assignedTeam.length} assigned
                              </span>
                            </div>
                            {card.status === "Assigned" && (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTasksAddModal(card);
                                }}
                                className="flex items-center justify-center gap-1 w-full py-1 border border-dashed border-slate-300 rounded-lg text-[9px] font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-500 cursor-pointer h-7 transition-colors duration-150"
                              >
                                <ListTodo className="h-3 w-3 shrink-0" />
                                <span className="truncate">Add Tasks</span>
                              </Button>
                            )}
                            {card.status === "On Progress" && (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks?id=${card.id}`);
                                }}
                                className="flex items-center justify-center gap-1 w-full py-1 border border-dashed border-slate-300 rounded-lg text-[9px] font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-500 cursor-pointer h-7 transition-colors duration-150"
                              >
                                <ListTodo className="h-3 w-3 shrink-0" />
                                <span className="truncate">View Tasks</span>
                              </Button>
                            )}
                            {card.status === "Review" && (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tasks?id=${card.id}`);
                                }}
                                className="flex items-center justify-center gap-1 w-full py-1 border border-dashed border-slate-300 rounded-lg text-[9px] font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-500 cursor-pointer h-7 transition-colors duration-150"
                              >
                                <ListTodo className="h-3 w-3 shrink-0" />
                                <span className="truncate">Review Tasks</span>
                              </Button>
                            )}
                            {card.status === "Approved" && (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePublishCard(card.id);
                                }}
                                className="flex items-center justify-center gap-1 w-full py-1 border border-dashed border-slate-300 rounded-lg text-[9px] font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-500 cursor-pointer h-7 transition-colors duration-150"
                              >
                                <Send className="h-3 w-3 shrink-0" />
                                <span className="truncate">Publish</span>
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignModal(card);
                            }}
                            className="flex items-center justify-center gap-1 w-full py-1 border border-dashed border-slate-300 rounded-lg text-[9px] font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-500 cursor-pointer h-7 transition-colors duration-150"
                          >
                            <Users className="h-3 w-3 shrink-0" />
                            <span className="truncate">Assign</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add Content Plan Button (Only in Draft column) */}
                {status === "Draft" && (
                  <Button
                    variant="outline"
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-500 hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-150 h-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add content plan</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
