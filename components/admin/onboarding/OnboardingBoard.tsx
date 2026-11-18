"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { NativeSelect } from "@/components/shared/NativeSelect";
import { onboardingPipeline, type OnboardingStage } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type Pipeline = typeof onboardingPipeline;

export function OnboardingBoard() {
  const [pipeline, setPipeline] = useState<Pipeline>(onboardingPipeline);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  function moveCard(cardId: string, stage: OnboardingStage) {
    setPipeline((current) => {
      const card = current
        .flatMap((column) => column.cards)
        .find((item) => item.id === cardId);
      if (!card) return current;
      return current.map((column) => ({
        ...column,
        cards:
          column.stage === stage
            ? column.cards.some((item) => item.id === cardId)
              ? column.cards
              : [...column.cards, card]
            : column.cards.filter((item) => item.id !== cardId),
      }));
    });
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3">
        {pipeline.map((column) => (
          <div
            key={column.stage}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setOverStage(column.stage);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setOverStage(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/plain") || dragId;
              if (id) moveCard(id, column.stage);
              setDragId(null);
              setOverStage(null);
            }}
            className={cn(
              "w-64 shrink-0 rounded-lg border bg-background transition-colors",
              overStage === column.stage
                ? "border-primary/50 bg-primary/[0.03]"
                : "border-border",
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <p className="text-xs font-semibold">{column.stage}</p>
              <span className="font-mono text-[10px] text-muted-foreground">
                {column.cards.length}
              </span>
            </div>
            <div className="space-y-2 p-2">
              {column.cards.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                  Nothing here
                </p>
              ) : (
                column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", card.id);
                      event.dataTransfer.effectAllowed = "move";
                      setDragId(card.id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverStage(null);
                    }}
                    className={cn(
                      "cursor-grab rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/30 active:cursor-grabbing",
                      dragId === card.id && "opacity-60",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{card.client}</p>
                      <GripVertical
                        className="mt-0.5 size-3 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
                      {card.missing}
                    </p>
                    <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                      {card.days}
                    </p>
                    <div className="mt-2 md:hidden">
                      <NativeSelect
                        aria-label={`Move ${card.client}`}
                        value={column.stage}
                        onChange={(event) =>
                          moveCard(card.id, event.target.value as OnboardingStage)
                        }
                        className="h-8 text-[10px]"
                      >
                        {pipeline.map((option) => (
                          <option key={option.stage} value={option.stage}>
                            {option.stage}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
