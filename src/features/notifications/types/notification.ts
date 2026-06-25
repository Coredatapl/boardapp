import type { Entity } from "@/types/entity";

export interface AppNotificationDto {
  label: string;
  description: string;
  trigger: string;
  triggerType: "todo" | "weather";
  remindAfterDays?: number;
}

export interface AppNotification extends Entity {
  label: string;
  description: string;
  remindAfterDays: number | null;
  trigger: string;
  triggerType: "todo" | "weather";
  read: boolean;
  emailed: boolean;
}
