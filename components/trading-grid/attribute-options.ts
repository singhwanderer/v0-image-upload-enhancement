// GS1/GDSN dropdown option lists shared across the wizard, the extracted StepTwoForm, the
// AI per-shot suggestion renderer, and the Step 3 / post-submit review displays.

// Spec code list: PRI, VF1, VIK, VIS, SDL, SDR, VIB, VIT (VBK retained from legacy data).
// VIK/VIS display the bare code until the authoritative GDSN label list is confirmed —
// showing a code is honest; inventing a label would ship wrong data.
export const ORIENTATION_OPTIONS = [
  { value: "PRI", label: "PRI-Primary" },
  { value: "VF1", label: "VF1-Front" },
  { value: "VIK", label: "VIK" },
  { value: "VIS", label: "VIS" },
  { value: "SDL", label: "SDL-Side Left" },
  { value: "SDR", label: "SDR-Side Right" },
  { value: "VIB", label: "VIB-Bottom" },
  { value: "VIT", label: "VIT-Top" },
  { value: "VBK", label: "VBK-Back" },
]

export const ANGLE_OPTIONS = [
  { value: "1", label: "1-Center, No plunge angle" },
  { value: "2", label: "2-Left, No plunge angle" },
  { value: "3", label: "3-Right, No plunge angle" },
  { value: "7", label: "7-Center, Plunge angle present" },
  { value: "8", label: "8-Left, Plunge angle present" },
  { value: "9", label: "9-Right, Plunge angle present" },
]

export const IMAGE_TYPE_OPTIONS = [
  { value: "SI", label: "SI-Still Shot" },
  { value: "LI", label: "LI-Lifestyle Image" },
  { value: "SW", label: "SW-Swatch" },
  { value: "DT", label: "DT-Detail Shot" },
  { value: "PK", label: "PK-Packaging" },
]

export const PURPOSE_OPTIONS = [
  { value: "INT", label: "INT-Internet" },
  { value: "CAT", label: "CAT-Catalog" },
  { value: "PRT", label: "PRT-Print" },
  { value: "PKG", label: "PKG-Packaging" },
]

// Spec: ACL, FTP, LMI, URL
export const LOCATION_TYPE_OPTIONS = [
  { value: "ACL", label: "ACL" },
  { value: "FTP", label: "FTP" },
  { value: "LMI", label: "LMI" },
  { value: "URL", label: "URL" },
]

// GS1 image-naming facing codes (same 1/2/3/7/8/9 scheme as ANGLE_OPTIONS above).
export const FACING_OPTIONS = [
  { value: "1", label: "1-Front" },
  { value: "2", label: "2-Left" },
  { value: "3", label: "3-Top" },
  { value: "7", label: "7-Back" },
  { value: "8", label: "8-Right" },
  { value: "9", label: "9-Bottom" },
]

// Spec: CSW (Color Swatch) or PRO (Product) only.
export const IMAGE_STYLE_OPTIONS = [
  { value: "CSW", label: "CSW-Color Swatch" },
  { value: "PRO", label: "PRO-Product" },
]
