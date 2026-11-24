"use client";

import { useEffect, useState } from "react";

export type DirectoryClient = {
  id: string;
  name: string;
  companies: { name: string; city: string }[];
};

export type DirectoryProject = {
  id: string;
  name: string;
  client: string;
};

export type DirectoryBlueprint = {
  id: string;
  client: string;
  title: string;
  status: string;
  price: number;
};

type Directory = {
  clients: DirectoryClient[];
  projects: DirectoryProject[];
  blueprints: DirectoryBlueprint[];
};

const EMPTY: Directory = { clients: [], projects: [], blueprints: [] };

/** Clients, projects and Blueprints for the create dialogs. */
export function useDirectory(): Directory {
  const [directory, setDirectory] = useState<Directory>(EMPTY);

  useEffect(() => {
    let active = true;
    fetch("/api/directory")
      .then((response) => response.json())
      .then((data: Partial<Directory>) => {
        if (!active) return;
        setDirectory({
          clients: data.clients ?? [],
          projects: data.projects ?? [],
          blueprints: data.blueprints ?? [],
        });
      })
      .catch(() => {
        // Dialogs stay empty if the request fails.
      });
    return () => {
      active = false;
    };
  }, []);

  return directory;
}
