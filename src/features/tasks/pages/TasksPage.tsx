import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { TASKS_CARD_CONFIG } from "@/features/tasks/constants/cardConfig";
import { getTaskByIdApi } from "@/features/tasks/api/tasksApi";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { getInitialsAndBg, isTaskOverdue } from "@/utils/formatter";
import { TaskBoard } from "@/features/tasks/components/TasksBoard";
import { TasksFilter } from "@/features/tasks/components/TasksFilter";
import { UnifiedTaskDrawer } from "@/features/tasks/components/UnifiedTaskDrawer";
import type { TaskBoardItem } from "@/features/tasks/types";
import {
  useTasks,
  useDeleteTaskMutation,
  useRestoreTaskMutation,
} from "@/features/tasks/hooks/useTasks";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { DeleteModal } from "@/components/shared/DeleteModal";
import { RotateCcw } from "lucide-react";
import { matchTimeframe } from "@/utils/timeframe";

export const TasksPage = () => {
  const { roles } = usePermissions();
  const { user } = useAuth();
  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  const [showDeleted, setShowDeleted] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    task: TaskBoardItem | null;
    action: "delete" | "restore";
  }>({
    isOpen: false,
    task: null,
    action: "delete",
  });

  const { data: apiTasks = [] } = useTasks({
    status: showDeleted ? "deleted" : undefined,
    limit: 1000,
  });

  const deleteMutation = useDeleteTaskMutation(() => {
    setConfirmModal({ isOpen: false, task: null, action: "delete" });
  });

  const restoreMutation = useRestoreTaskMutation(() => {
    setConfirmModal({ isOpen: false, task: null, action: "restore" });
  });

  const tasks = useMemo<TaskBoardItem[]>(() => {
    const rawTasks = isLeadOrOwner
      ? apiTasks
      : apiTasks.filter((t) => {
          return Number(t.assigned_to) === Number(user?.id);
        });

    return rawTasks.map((t) => {
      const role = t.role ?? t.assignee_roles?.[0] ?? "content_editor";
      const { label: type, bg: typeBg } = getTaskTypeConfig(role);
      const { initials, avatarBg } = getInitialsAndBg(t.assignee_name ?? "");
      const overdue = isTaskOverdue(t.deadline ?? null, t.status);
      const statusKey = t.status as TaskBoardItem["status"];

      return {
        id: t.id,
        content_id: t.content_id,
        title: t.title,
        type,
        typeBg,
        category: t.category_name ?? "General",
        categoryDot: "bg-gray-400",
        assignee: t.assignee_name ?? "Unassigned",
        assigneeInitials: initials,
        assigneeBg: avatarBg,
        assigneeId: t.assigned_to,
        contractCreatedBy: t.contract_created_by,
        leadId: t.lead_id,
        status: statusKey,
        isOverdue: overdue,
        date: t.deadline ? new Date(t.deadline) : new Date(),
        deadline: t.deadline || null,
        priority: "medium",
        description: t.description,
        role,
        pillar: t.pillar_name,
        pillars: t.pillars,
        content_title: t.content_title,
        contract_name: t.contract_name,
        is_active: t.is_active,
        rolesArray: t.assignee_roles || [],
        contentStatus: t.content_status,
      };
    });
  }, [apiTasks, isLeadOrOwner, user]);

  const [searchParams, setSearchParams] = useSearchParams();
  const taskIdParam = searchParams.get("id");

  const [timeFilter, setTimeFilter] = useState("all");
  const searchQuery = searchParams.get("search") || "";
  const setSearchQuery = (val: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (val) {
          next.set("search", val);
        } else {
          next.delete("search");
        }
        return next;
      },
      { replace: true }
    );
  };
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");

  const [selectedTask, setSelectedTask] = useState<TaskBoardItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const lastProcessedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (taskIdParam) {
      if (lastProcessedIdRef.current !== taskIdParam) {
        const task = tasks.find((t) => String(t.id) === String(taskIdParam));
        if (task) {
          const timer = setTimeout(() => {
            lastProcessedIdRef.current = taskIdParam;
            setSelectedTask(task);
            setIsDrawerOpen(true);
          }, 0);
          return () => clearTimeout(timer);
        } else {
          const idNum = Number(taskIdParam);
          if (!isNaN(idNum)) {
            getTaskByIdApi(idNum)
              .then((t) => {
                const role = t.assignee_roles?.[0] ?? "content_editor";
                const { label: type, bg: typeBg } = getTaskTypeConfig(role);
                const { initials, avatarBg } = getInitialsAndBg(
                  t.assignee_name ?? "",
                );
                const overdue = isTaskOverdue(t.deadline ?? null, t.status);
                const statusKey = t.status as TaskBoardItem["status"];

                const mappedTask: TaskBoardItem = {
                  id: t.id,
                  content_id: t.content_id,
                  title: t.title,
                  type,
                  typeBg,
                  category: t.category_name ?? "General",
                  categoryDot: "bg-gray-400",
                  assignee: t.assignee_name ?? "Unassigned",
                  assigneeInitials: initials,
                  assigneeBg: avatarBg,
                  status: statusKey,
                  isOverdue: overdue,
                  date: t.deadline ? new Date(t.deadline) : new Date(),
                  priority: "medium",
                  description: t.description,
                  role,
                  pillar: t.pillar_name,
                  pillars: t.pillars,
                  content_title: t.content_title,
                  contract_name: t.contract_name,
                  is_active: t.is_active,
                  rolesArray: t.assignee_roles || [],
                  contentStatus: t.content_status,
                };
                lastProcessedIdRef.current = taskIdParam;
                setSelectedTask(mappedTask);
                setIsDrawerOpen(true);
              })
              .catch((err) => {
                console.error("Failed to fetch task by id:", err);
              });
          }
        }
      }
    } else {
      lastProcessedIdRef.current = null;
    }
  }, [taskIdParam, tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.content_title?.toLowerCase().includes(query) ?? false) ||
        (task.contract_name?.toLowerCase().includes(query) ?? false) ||
        (task.assignee?.toLowerCase().includes(query) ?? false);

      let matchesType: boolean;
      if (activeTypeFilter === "all") {
        matchesType = true;
      } else {
        const rolesArray = task.rolesArray || [];
        if (activeTypeFilter === "Script") {
          matchesType = rolesArray.includes("script_writer");
        } else if (activeTypeFilter === "Editor") {
          matchesType = rolesArray.includes("content_editor");
        } else if (activeTypeFilter === "Caption") {
          matchesType = rolesArray.includes("admin_social_media");
        } else {
          matchesType = task.type === activeTypeFilter;
        }
      }

      const matchesOverdue = showOverdue ? task.isOverdue : true;

      const matchesTime = matchTimeframe(task.deadline, timeFilter);

      return matchesSearch && matchesType && matchesOverdue && matchesTime;
    });
  }, [tasks, searchQuery, activeTypeFilter, showOverdue, timeFilter]);

  const cardData = useMemo(() => {
    return TASKS_CARD_CONFIG.map((config) => {
      let value = 0;
      const statusKey = config.statusKey;
      if (config.isOverdue) {
        value = filteredTasks.filter((t) => t.isOverdue).length;
      } else if (Array.isArray(statusKey)) {
        value = filteredTasks.filter((t) => statusKey.includes(t.status)).length;
      } else if (statusKey) {
        value = filteredTasks.filter((t) => t.status === statusKey).length;
      }
      return {
        title: config.title,
        value,
        description: config.description,
        icon: config.icon,
        iconColor: config.iconColor,
        iconBgColor: config.iconBgColor,
      };
    });
  }, [filteredTasks]);

  const handleDeleteTask = (task: TaskBoardItem) => {
    setConfirmModal({
      isOpen: true,
      task,
      action: "delete",
    });
  };

  const handleRestoreTask = (task: TaskBoardItem) => {
    setConfirmModal({
      isOpen: true,
      task,
      action: "restore",
    });
  };

  const handleConfirmAction = () => {
    if (!confirmModal.task) return;
    if (confirmModal.action === "delete") {
      deleteMutation.mutate(Number(confirmModal.task.id));
    } else {
      restoreMutation.mutate(Number(confirmModal.task.id));
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTask(null);
    if (searchParams.has("id")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("id");
      setSearchParams(newParams, { replace: true });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <TasksFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTypeFilter={activeTypeFilter}
        setActiveTypeFilter={setActiveTypeFilter}
        showDeleted={showDeleted}
        setShowDeleted={setShowDeleted}
        showOverdue={showOverdue}
        setShowOverdue={setShowOverdue}
        showTypeFilters={isLeadOrOwner}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <TaskBoard
          tasks={filteredTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDrawerOpen(true);
            const newParams = new URLSearchParams(searchParams);
            newParams.set("id", String(task.id));
            setSearchParams(newParams, { replace: true });
          }}
          onDeleteTask={handleDeleteTask}
          onRestoreTask={handleRestoreTask}
        />
      </div>

      <UnifiedTaskDrawer
        key={selectedTask?.id ?? "none"}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        task={selectedTask}
        hideUpload={true}
      />

      <DeleteModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.action === "delete" ? "Hapus Tugas" : "Kembalikan Tugas"
        }
        description={
          confirmModal.action === "delete" ? (
            <>
              Apakah Anda yakin ingin menghapus tugas{" "}
              <span className="font-bold text-gray-900">
                "{confirmModal.task?.title}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </>
          ) : (
            <>
              Apakah Anda yakin ingin mengembalikan tugas{" "}
              <span className="font-bold text-gray-900">
                "{confirmModal.task?.title}"
              </span>
              ? Tugas akan kembali aktif.
            </>
          )
        }
        icon={
          confirmModal.action === "delete" ? undefined : (
            <RotateCcw className="h-6 w-6" />
          )
        }
        iconBgColor={
          confirmModal.action === "delete" ? undefined : "bg-emerald-50"
        }
        iconBorderColor={
          confirmModal.action === "delete" ? undefined : "border-emerald-100"
        }
        iconTextColor={
          confirmModal.action === "delete" ? undefined : "text-emerald-800"
        }
        cancelText="Batal"
        confirmText={confirmModal.action === "delete" ? "Hapus" : "Kembalikan"}
        confirmBtnClassName={
          confirmModal.action === "delete"
            ? "bg-red-800 hover:bg-red-900 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }
      />
    </div>
  );
};
