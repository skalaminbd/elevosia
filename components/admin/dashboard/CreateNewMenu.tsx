"use client";

import { FileStack, FolderKanban, Receipt, UserPlus } from "lucide-react";
import { NewBlueprintDialog } from "@/components/admin/blueprints/NewBlueprintDialog";
import { NewClientDialog } from "@/components/admin/clients/NewClientDialog";
import { NewInvoiceDialog } from "@/components/admin/invoices/NewInvoiceDialog";
import { NewProjectDialog } from "@/components/admin/projects/NewProjectDialog";
import {
  CreateNewDisclosure,
  CreateNewDisclosureItem,
} from "@/components/kit/watermelon/create-new-disclosure";

/** Dashboard header shortcut that opens the four real create flows. */
export function CreateNewMenu() {
  return (
    <CreateNewDisclosure
      items={[
        <NewProjectDialog key="project">
          <CreateNewDisclosureItem icon={FolderKanban} label="Project" />
        </NewProjectDialog>,
        <NewClientDialog key="client">
          <CreateNewDisclosureItem icon={UserPlus} label="Client" />
        </NewClientDialog>,
        <NewInvoiceDialog key="invoice">
          <CreateNewDisclosureItem icon={Receipt} label="Invoice" />
        </NewInvoiceDialog>,
        <NewBlueprintDialog key="blueprint">
          <CreateNewDisclosureItem icon={FileStack} label="Blueprint" />
        </NewBlueprintDialog>,
      ]}
    />
  );
}
