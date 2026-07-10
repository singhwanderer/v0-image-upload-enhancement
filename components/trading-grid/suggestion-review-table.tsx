"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Check, Pencil, X } from "lucide-react"

// Shared review table for AI suggestions (product attributes AND per-image details).
// One row per suggestion: label, suggested value + helper line, confidence bar + %,
// Confirm / Edit / Reject. Rows sort ascending by confidence (riskiest first) and the
// order is fixed at render — decisions never reorder rows under the cursor.
export type SuggestionRowStatus = "pending" | "accepted" | "rejected"

export type SuggestionRow = {
  id: string
  label: string
  // Secondary line under the label (e.g. GS1 code) — rendered mono.
  sublabel?: string
  value: string
  // Italic helper line under the value (e.g. the AI's reasoning).
  helper?: string
  confidence: number // 0..1
  status: SuggestionRowStatus
}

// Confidence tone: the bar color carries the attention signal (no severity bands).
const confidenceTone = (c: number) =>
  c >= 0.9
    ? { bar: "bg-tg-success", text: "text-tg-success" }
    : c >= 0.7
      ? { bar: "bg-tg-warning", text: "text-tg-warning" }
      : { bar: "bg-destructive", text: "text-destructive" }

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, confidence)) * 100)
  const tone = confidenceTone(confidence)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-xs font-medium tabular-nums", tone.text)}>{pct}%</span>
    </div>
  )
}

export function SuggestionReviewTable({
  rows,
  onConfirm,
  onReject,
  editingId,
  onEditToggle,
  renderEditor,
  headerAction,
  emptyText,
}: {
  rows: SuggestionRow[]
  // Confirm/Reject use toggle semantics — the call site decides what a second click means.
  onConfirm: (id: string) => void
  onReject: (id: string) => void
  editingId: string | null
  onEditToggle: (id: string | null) => void
  renderEditor: (row: SuggestionRow, close: () => void) => React.ReactNode
  headerAction?: React.ReactNode
  emptyText?: string
}) {
  const sorted = [...rows].sort((a, b) => a.confidence - b.confidence)

  if (sorted.length === 0) {
    return emptyText ? <p className="text-sm text-muted-foreground">{emptyText}</p> : null
  }

  return (
    <div className="overflow-x-auto rounded border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attribute</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested value</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confidence</TableHead>
            <TableHead className="text-right">{headerAction}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => {
            const editing = editingId === row.id
            return (
              <TableRow
                key={row.id}
                className={cn(
                  row.status === "accepted" && "bg-tg-success/5 hover:bg-tg-success/10",
                  row.status === "rejected" && "opacity-60",
                )}
              >
                <TableCell className="align-top">
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  {row.sublabel && <p className="font-mono text-xs text-muted-foreground">{row.sublabel}</p>}
                </TableCell>
                <TableCell className="max-w-72 align-top whitespace-normal">
                  {editing ? (
                    renderEditor(row, () => onEditToggle(null))
                  ) : (
                    <p className={cn("text-sm font-semibold text-foreground", row.status === "rejected" && "line-through")}>
                      {row.value || <span className="font-normal text-muted-foreground">—</span>}
                    </p>
                  )}
                  {row.helper && <p className="mt-0.5 text-xs italic text-muted-foreground">{row.helper}</p>}
                </TableCell>
                <TableCell className="align-top">
                  <ConfidenceBar confidence={row.confidence} />
                </TableCell>
                <TableCell className="align-top text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      size="sm"
                      className={cn(
                        "h-7 gap-1 bg-tg-success px-2.5 text-xs text-white hover:bg-tg-success/90",
                        row.status === "accepted" && "ring-2 ring-tg-success/40",
                      )}
                      aria-pressed={row.status === "accepted"}
                      onClick={() => onConfirm(row.id)}
                    >
                      <Check className="size-3" /> {row.status === "accepted" ? "Confirmed" : "Confirm"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 px-2.5 text-xs"
                      aria-pressed={editing}
                      onClick={() => onEditToggle(editing ? null : row.id)}
                    >
                      <Pencil className="size-3" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-7 gap-1 border-destructive/40 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
                        row.status === "rejected" && "bg-destructive/10",
                      )}
                      aria-pressed={row.status === "rejected"}
                      onClick={() => onReject(row.id)}
                    >
                      <X className="size-3" /> {row.status === "rejected" ? "Rejected" : "Reject"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
