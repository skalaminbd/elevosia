"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { setClientNotificationPref } from "@/app/portal/actions";

type Pref = { id: string; label: string; hint: string; enabled: boolean };

/** Client notification toggles, saved to Postgres. */
export function NotificationPrefs({ prefs }: { prefs: Pref[] }) {
  const [rows, setRows] = useState<Pref[]>(prefs);

  function toggle(id: string, enabled: boolean) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, enabled } : row)),
    );
    void setClientNotificationPref({ settingId: id, enabled }).then(
      (result) => {
        if (!result.ok) toast.error(result.error);
      },
    );
  }

  return (
    <div className="divide-y divide-border">
      {rows.map((item) => (
        <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
          <Checkbox
            id={`notify-${item.id}`}
            checked={item.enabled}
            onCheckedChange={(value) => toggle(item.id, value === true)}
            className="mt-0.5"
          />
          <div>
            <Label
              htmlFor={`notify-${item.id}`}
              className="text-sm font-medium"
            >
              {item.label}
            </Label>
            <p className="text-xs text-muted-foreground">{item.hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
