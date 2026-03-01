"use client";

import { useNotificationStore } from "@/stores/notification-store";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeLabels = {
  cycle: { label: "Cycle", variant: "crimson" as const },
  supply: { label: "Supply", variant: "gold" as const },
  wellness: { label: "Wellness", variant: "plum" as const },
  promo: { label: "Promo", variant: "default" as const },
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-crimson/10">
            <Bell className="w-5 h-5 text-crimson" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-warm-white">Notifications</h1>
            <p className="text-warm-white-muted text-sm">{unreadCount()} unread</p>
          </div>
        </div>
        {unreadCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`cursor-pointer transition-all ${!n.read ? "border-crimson/20 bg-crimson/5" : ""}`}
            onClick={() => markAsRead(n.id)}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-warm-white text-sm">{n.title}</h3>
                  <Badge variant={typeLabels[n.type].variant}>{typeLabels[n.type].label}</Badge>
                  {!n.read && <div className="w-2 h-2 bg-crimson rounded-full" />}
                </div>
                <p className="text-sm text-warm-white-muted">{n.message}</p>
                <p className="text-xs text-warm-white-muted/50 mt-2">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
