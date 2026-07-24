// Compliance standard definitions — GS1 baseline plus illustrative retailer standards.
//
// These are SAMPLE thresholds, not sourced from an actual GS1 or retailer spec sheet.
// They exist to demonstrate the "pick a standard, check compliance" workflow end to end;
// swap the values in each entry for real figures once a retailer supplies them.
//
// Note: the app's global upload gate (see upload-validation.ts) already caps every file at
// 500 KB regardless of which standard is selected. A standard's own maxFileSizeBytes is
// evaluated independently so a stricter (smaller) retailer cap still shows as its own rule.

export type ComplianceRules = {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  // width / height, e.g. 1 for a perfect square
  aspectRatio?: { ratio: number; tolerance: number }
  background?: { rgb: [number, number, number]; tolerance: number; label: string }
  minDpi?: number
  allowedFormats?: string[]
  maxFileSizeBytes?: number
  requiresNonAiGenerated: boolean
}

export type ComplianceStandard = {
  id: string
  label: string
  description: string
  rules: ComplianceRules
}

export const COMPLIANCE_STANDARDS: ComplianceStandard[] = [
  {
    id: "gs1",
    label: "GS1 Standard",
    description: "Generic GS1 baseline requirements (sample values).",
    rules: {
      minWidth: 1000,
      minHeight: 1000,
      aspectRatio: { ratio: 1, tolerance: 0.05 },
      background: { rgb: [242, 242, 242], tolerance: 15, label: "Light grey (#F2F2F2)" },
      minDpi: 150,
      allowedFormats: ["jpg", "jpeg"],
      maxFileSizeBytes: 500 * 1024,
      requiresNonAiGenerated: true,
    },
  },
  {
    id: "retailer-a",
    label: "Retailer A Standard",
    description: "Example retailer profile with stricter resolution and a pure white background (sample values).",
    rules: {
      minWidth: 1500,
      minHeight: 1500,
      aspectRatio: { ratio: 1, tolerance: 0.02 },
      background: { rgb: [255, 255, 255], tolerance: 10, label: "Pure white (#FFFFFF)" },
      minDpi: 300,
      allowedFormats: ["jpg", "jpeg"],
      maxFileSizeBytes: 500 * 1024,
      requiresNonAiGenerated: true,
    },
  },
  {
    id: "retailer-b",
    label: "Retailer B Standard",
    description: "Example retailer profile with looser resolution and a darker grey background (sample values).",
    rules: {
      minWidth: 800,
      minHeight: 800,
      background: { rgb: [230, 230, 230], tolerance: 20, label: "Mid grey (#E6E6E6)" },
      minDpi: 72,
      allowedFormats: ["jpg", "jpeg"],
      maxFileSizeBytes: 500 * 1024,
      requiresNonAiGenerated: false,
    },
  },
]

export function getComplianceStandard(id: string): ComplianceStandard {
  return COMPLIANCE_STANDARDS.find(s => s.id === id) ?? COMPLIANCE_STANDARDS[0]
}
