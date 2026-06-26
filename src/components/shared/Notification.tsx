import {
  Bell,
  AlertTriangle,
  CircleCheckBig,
  ClipboardList,
  CheckCheck,
  MessageSquare,
  FileSignature,
  Video,
  FileUp,
  Trash2,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";

export function Notification() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const hasUnread = unreadCount > 0;

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "revision":
        return (
          <div className="h-8 w-8 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4 stroke-2" />
          </div>
        );
      case "approved":
        return (
          <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CircleCheckBig className="h-4 w-4 stroke-2" />
          </div>
        );
      case "assigned":
        return (
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ClipboardList className="h-4 w-4 stroke-2" />
          </div>
        );
      case "comment":
        return (
          <div className="h-8 w-8 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4 w-4 stroke-2" />
          </div>
        );
      case "contract":
        return (
          <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <FileSignature className="h-4 w-4 stroke-2" />
          </div>
        );
      case "content":
        return (
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Video className="h-4 w-4 stroke-2" />
          </div>
        );
      case "upload":
        return (
          <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <FileUp className="h-4 w-4 stroke-2" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-150 text-gray-500 flex items-center justify-center shrink-0">
            <Bell className="h-4 w-4 stroke-2" />
          </div>
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors focus:outline-none"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-88 sm:w-96 bg-white border border-gray-150 shadow-2xl rounded-2xl p-0 flex flex-col overflow-hidden outline-none z-50"
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">
              Notifications
            </span>
            {hasUnread && (
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-[10px] font-bold text-red-800 hover:text-red-900 cursor-pointer transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-87.5 overflow-y-auto divide-y divide-gray-100 scrollbar-none">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 flex gap-3.5 hover:bg-slate-50/30 transition-colors relative group ${
                  !notif.isRead ? "bg-red-50/10" : ""
                }`}
              >
                {getNotifIcon(notif.type)}

                <div className="flex-1 min-w-0 pr-12 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-bold text-gray-900 text-xs truncate">
                      {notif.title}
                    </h5>
                    <span className="text-[9px] text-gray-400 font-semibold shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-gray-600 leading-normal wrap-break-words">
                    {notif.description}
                  </p>
                </div>

                {/* Actions container shown on hover */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {!notif.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notif.id);
                      }}
                      className="h-6 w-6 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 hover:text-red-800 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif.id);
                    }}
                    className="h-6 w-6 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-3.5 w-3.5 stroke-2" />
                  </button>
                </div>

                {/* Default dot indicators when not hovering */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity">
                  {!notif.isRead ? (
                    <span className="h-2 w-2 bg-red-600 rounded-full block animate-pulse"></span>
                  ) : (
                    <span className="h-1.5 w-1.5 bg-gray-300 rounded-full block"></span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-gray-150 flex items-center justify-center text-gray-400 mb-2.5">
                <Bell className="h-5 w-5 stroke-[1.5]" />
              </div>
              <p className="text-xs font-bold text-gray-800">
                No new notifications
              </p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                We'll notify you when tasks or reviews need attention.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
