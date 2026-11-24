"use client";

import { useEffect, useState } from "react";

export type TeamOption = {
  id: string;
  name: string;
  role: string;
  initials: string;
  planned: number;
  capacity: number;
  projects: number;
};

/** Team members for assignment pickers, loaded once per mount. */
export function useTeamOptions(): TeamOption[] {
  const [team, setTeam] = useState<TeamOption[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/team")
      .then((response) => response.json())
      .then((data: { team?: TeamOption[] }) => {
        if (active) setTeam(data.team ?? []);
      })
      .catch(() => {
        // Keep the pickers empty if the request fails.
      });
    return () => {
      active = false;
    };
  }, []);

  return team;
}
