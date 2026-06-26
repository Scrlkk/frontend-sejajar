import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { TASKS_CARD_CONFIG } from "@/features/tasks/constants/cardConfig";
import { getTasksApi, deleteTaskApi, restoreTaskApi, getTaskByIdApi } from "@/features/tasks/api/tasksApi";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { getInitialsAndBg, isTaskOverdue } from "@/utils/formatter";
import { TaskBoard } from "@/features/tasks/components/TasksBoard";
import { TasksFilter } from "@/features/tasks/components/TasksFilter";
import { TasksDrawer } from "@/features/tasks/components/TasksDrawer";
import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import { RotateCcw } from "lucide-react";

export const TasksPage = () => {
  const { roles } = usePermissions();
  const { user } = useAuth();
  const queryClient = useQueryClient();
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

  const { data: apiTasks = [] } = useQuery({
    queryKey: ["tasks", { status: showDeleted ? "deleted" : undefined }],
    queryFn: () => getTasksApi({ status: showDeleted ? "deleted" : undefined, limit: 1000 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: number) => deleteTaskApi(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tugas berhasil dihapus");
      setConfirmModal({ isOpen: false, task: null, action: "delete" });
    },
    onError: () => {
      toast.error("Gagal menghapus tugas");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (taskId: number) => restoreTaskApi(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tugas berhasil dikembalikan");
      setConfirmModal({ isOpen: false, task: null, action: "restore" });
    },
    onError: () => {
      toast.error("Gagal mengembalikan tugas");
    },
  });

  // Map DB Task → TaskBoardItem for the Kanban board
  const tasks = useMemo<TaskBoardItem[]>(() => {
    const rawTasks = isLeadOrOwner
      ? apiTasks
      : apiTasks.filter((t) => {
          if (roles.includes("admin_social_media") && (t.content_status === "scheduled" || t.content_status === "published")) {
            return true;
          }
          return Number(t.assigned_to) === Number(user?.id);
        });

    return rawTasks.map((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
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
    });
  }, [apiTasks, isLeadOrOwner, user, roles]);

  const cardData = useMemo(() => {
    return TASKS_CARD_CONFIG.map((config) => {
      let value = 0;
      const statusKey = config.statusKey;
      if (config.isOverdue) {
        value = tasks.filter((t) => t.isOverdue).length;
      } else if (Array.isArray(statusKey)) {
        value = tasks.filter((t) => statusKey.includes(t.status)).length;
      } else if (statusKey) {
        value = tasks.filter((t) => t.status === statusKey).length;
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
  }, [tasks]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");

  const [selectedTask, setSelectedTask] = useState<TaskBoardItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const taskIdParam = searchParams.get("id");

  const lastProcessedIdRef = useRef<string | null>(null);

  // Intercept the 'id' parameter to auto-open the drawer on route navigation
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
          // Fallback: fetch directly from API
          const idNum = Number(taskIdParam);
          if (!isNaN(idNum)) {
            getTaskByIdApi(idNum)
              .then((t) => {
                const role = t.assignee_roles?.[0] ?? "content_editor";
                const { label: type, bg: typeBg } = getTaskTypeConfig(role);
                const { initials, avatarBg } = getInitialsAndBg(t.assignee_name ?? "");
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

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      (task.content_title?.toLowerCase().includes(query) ?? false) ||
      (task.contract_name?.toLowerCase().includes(query) ?? false);

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

    return matchesSearch && matchesType && matchesOverdue;
  });

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
    // Clear search param once closed
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
          onDeleteTask={isLeadOrOwner ? handleDeleteTask : undefined}
          onRestoreTask={isLeadOrOwner ? handleRestoreTask : undefined}
        />
      </div>

      <TasksDrawer
        key={selectedTask?.id ?? "none"}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        task={selectedTask}
      />

      <DeleteModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={confirmModal.action === "delete" ? "Hapus Tugas" : "Kembalikan Tugas"}
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
        iconBgColor={confirmModal.action === "delete" ? undefined : "bg-emerald-50"}
        iconBorderColor={
          confirmModal.action === "delete" ? undefined : "border-emerald-150"
        }
        iconTextColor={confirmModal.action === "delete" ? undefined : "text-emerald-800"}
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
