"use client"

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ComplianceStandard } from "./compliance-standards"
import type { ComplianceReport } from "./compliance-check"
import type { UploadedFile } from "./uploaded-file"

function StatusBadge({ status }: { status: ComplianceReport["status"] }) {
  if (status === "compliant") {
    return (
      <Badge className="gap-1 bg-green-600/10 text-green-700 hover:bg-green-600/10 dark:text-green-400">
        <CheckCircle2 className="size-3.5" /> Compliant
      </Badge>
    )
  }
  if (status === "non-compliant") {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="size-3.5" /> Non-compliant
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <Loader2 className="size-3.5 animate-spin" /> Checking…
    </Badge>
  )
}

function RuleRow({ rule }: { rule: ComplianceReport["rules"][number] }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-xs">
      <div className="flex items-center gap-2 min-w-0">
        {rule.passed === true && <CheckCircle2 className="size-3.5 shrink-0 text-green-600 dark:text-green-400" />}
        {rule.passed === false && <AlertCircle className="size-3.5 shrink-0 text-destructive" />}
        {rule.passed === null && <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />}
        <span className="text-foreground truncate">{rule.label}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
        <span className={cn(rule.passed === false && "text-destructive font-medium")}>{rule.actual}</span>
        <span className="text-muted-foreground/60">/ {rule.expected}</span>
      </div>
    </div>
  )
}

export function ComplianceResultsPanel({
  standard,
  files,
  reports,
}: {
  standard: ComplianceStandard
  files: UploadedFile[]
  reports: { [fileId: string]: ComplianceReport }
}) {
  return (
    <div className="rounded border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Compliance Check — {standard.label}</h3>
          <p className="text-xs text-muted-foreground">{standard.description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {files.map((file) => {
          const report = reports[file.id]
          return (
            <div key={file.id} className="rounded border border-border/70 bg-muted/20 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-foreground" title={file.name}>
                  {file.name}
                </span>
                {report ? <StatusBadge status={report.status} /> : <StatusBadge status="pending" />}
              </div>
              {report ? (
                <div className="divide-y divide-border/50">
                  {report.rules.map((rule) => (
                    <RuleRow key={rule.id} rule={rule} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Waiting for image metadata…</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
