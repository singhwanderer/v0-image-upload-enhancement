import { useState } from "react"

// Shared selection state for Product Media screens (Supplier + Retailer).
//
// Business rule: an EMPTY selection means "all items" (used for the default-all download
// behavior), while a NON-EMPTY selection is explicit and authoritative (used for bulk
// edit/delete gating, where an empty selection must never silently mean "act on everything").
export function useMediaSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = (id: string, allIds: string[]) => {
    setSelectedIds(prev => {
      const base = prev.size === 0 ? new Set(allIds) : new Set(prev)
      if (base.has(id)) base.delete(id)
      else base.add(id)
      return base
    })
  }

  const isChecked = (id: string) => selectedIds.size === 0 || selectedIds.has(id)

  const isAllSelected = (allIds: string[]) => selectedIds.size === 0 || selectedIds.size === allIds.length

  const selectOnly = (id: string) => setSelectedIds(new Set([id]))

  const selectAll = (allIds: string[]) => setSelectedIds(new Set(allIds))

  const clear = () => setSelectedIds(new Set())

  const effectiveIds = (allIds: string[]) =>
    selectedIds.size === 0 ? allIds : allIds.filter(id => selectedIds.has(id))

  // Drop ids that no longer exist (e.g. after a delete) so stale ids don't linger in the set.
  const prune = (allIds: string[]) =>
    setSelectedIds(prev => new Set([...prev].filter(id => allIds.includes(id))))

  return { selectedIds, toggle, isChecked, isAllSelected, selectOnly, selectAll, clear, effectiveIds, prune }
}
