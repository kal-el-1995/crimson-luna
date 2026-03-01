"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-warm-white-muted hover:text-warm-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount() > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-crimson rounded-full text-[10px] font-bold flex items-center justify-center text-white">
            {unreadCount()}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-dark-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-warm-white">Notifications</h3>
            <span className="text-xs text-warm-white-muted">{unreadCount()} unread</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="p-4 text-sm text-warm-white-muted text-center">No notifications</p>
            ) : (
              recent.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                    !n.read ? "bg-crimson/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-white truncate">{n.title}</p>
                      <p className="text-xs text-warm-white-muted line-clamp-2">{n.message}</p>
                      <p className="text-xs text-warm-white-muted/50 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 bg-crimson rounded-full mt-1.5 shrink-0" />}
                  </div>
                </button>
              ))
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block p-3 text-center text-sm text-crimson hover:bg-crimson/5 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
