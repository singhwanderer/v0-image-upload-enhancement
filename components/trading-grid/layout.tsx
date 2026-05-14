"use client"

import { useState } from "react"
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Download, 
  ImageIcon, 
  AlertCircle,
  Settings,
  FileText,
  CheckSquare,
  FileBarChart,
  Palette,
  Building2,
  FileCheck,
  ShieldCheck,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type PortalType = "supplier" | "retailer"

interface TradingGridLayoutProps {
  children: React.ReactNode
  activeNav?: string
  portalType?: PortalType
  onPortalChange?: (portal: PortalType) => void
}

type NavSection = {
  id: string
  title: string
  items: { id: string; label: string; icon?: React.ReactNode; badge?: string }[]
}

// Supplier portal nav sections
const supplierNavSections: NavSection[] = [
  {
    id: "catalogue",
    title: "Catalogue",
    items: [
      { id: "selection-code-list", label: "Selection Code List" },
      { id: "advanced-search", label: "Advanced Search" },
      { id: "download-basket", label: "Download Basket" },
    ],
  },
  {
    id: "data-management",
    title: "Data Management",
    items: [
      { id: "error-processing", label: "Error Processing", badge: "0" },
      { id: "edi-management", label: "EDI Management Console" },
      { id: "image-upload", label: "Image Upload", icon: <ImageIcon className="size-4" /> },
      { id: "text-file-upload", label: "Text File Upload" },
      { id: "text-file-download", label: "Text File Download" },
      { id: "compliance-checks", label: "Compliance Checks" },
      { id: "compliance-reports", label: "Compliance Reports" },
    ],
  },
  {
    id: "color-size-codes",
    title: "Color/Size Codes",
    items: [],
  },
  {
    id: "account",
    title: "Account",
    items: [],
  },
  {
    id: "product-documentation",
    title: "Product Documentation",
    items: [],
  },
  {
    id: "administration",
    title: "Administration",
    items: [],
  },
]

// Retailer portal nav sections (starts with Vendor List)
const retailerNavSections: NavSection[] = [
  {
    id: "catalogue",
    title: "Catalogue",
    items: [
      { id: "vendor-list", label: "Vendor List" },
      { id: "subscription-profiles", label: "Subscription Profiles" },
      { id: "advanced-search", label: "Advanced Search" },
      { id: "text-file-search", label: "Text File Search" },
      { id: "download-basket", label: "Download Basket" },
    ],
  },
  {
    id: "data-management",
    title: "Data Management",
    items: [
      { id: "error-processing", label: "Error Processing", badge: "0" },
      { id: "edi-management", label: "EDI Management Console" },
      { id: "text-file-download", label: "Text File Download" },
      { id: "compliance-reports", label: "Compliance Reports" },
    ],
  },
  {
    id: "color-size-codes",
    title: "Color/Size Codes",
    items: [],
  },
  {
    id: "account",
    title: "Account",
    items: [],
  },
  {
    id: "product-documentation",
    title: "Product Documentation",
    items: [],
  },
  {
    id: "administration",
    title: "Administration",
    items: [],
  },
]

export function TradingGridLayout({ 
  children, 
  activeNav, 
  portalType = "supplier",
  onPortalChange 
}: TradingGridLayoutProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["catalogue", "data-management"])
  
  const navSections = portalType === "supplier" ? supplierNavSections : retailerNavSections
  const companyName = portalType === "supplier" ? "KIBBLES N BITS" : "Atlas Stores"
  const accountNumber = portalType === "supplier" ? "125103335555" : "127142417199"

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-12 items-center justify-between bg-gradient-to-r from-tg-header-start to-tg-header-end px-4 text-white">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold tracking-tight">
            <span className="font-light">opentext</span>
            <span className="mx-1 text-white/60">|</span>
            <span>Trading Grid Catalogue</span>
            <span className="ml-2 text-sm font-normal text-white/80">26.1</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/90 flex items-center gap-1">
            You are logged in as: 
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-1 inline-flex items-center gap-1 font-medium text-white underline hover:text-white/90 focus:outline-none">
                {portalType === "supplier" ? "KIBBLES" : "ATLAS"} for {companyName} ({accountNumber})
                <ChevronDown className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem 
                  onClick={() => onPortalChange?.("supplier")}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">KIBBLES N BITS</span>
                    <span className="text-xs text-muted-foreground">Supplier Portal</span>
                  </div>
                  {portalType === "supplier" && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onPortalChange?.("retailer")}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Atlas Stores</span>
                    <span className="text-xs text-muted-foreground">Retailer Portal</span>
                  </div>
                  {portalType === "retailer" && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
          <nav className="flex items-center gap-3 text-white/90">
            <a href="#" className="hover:text-white hover:underline">Logout</a>
            <span className="text-white/40">|</span>
            <a href="#" className="hover:text-white hover:underline">OpenText</a>
            <span className="text-white/40">|</span>
            <a href="#" className="hover:text-white hover:underline">Help</a>
            <span className="text-white/40">|</span>
            <a href="#" className="hover:text-white hover:underline">Support</a>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <aside className="w-56 flex-shrink-0 border-r border-border bg-sidebar">
          <nav className="flex flex-col py-2">
            {navSections.map((section) => (
              <div key={section.id} className="border-b border-sidebar-border last:border-b-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-1 px-3 py-2 text-left text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                  {section.title}
                </button>
                {expandedSections.includes(section.id) && section.items.length > 0 && (
                  <div className="flex flex-col pb-1">
                    {section.items.map((item) => (
                      <a
                        key={item.id}
                        href="#"
                        className={cn(
                          "flex items-center gap-2 px-6 py-1.5 text-sm transition-colors",
                          activeNav === item.id
                            ? "bg-tg-nav-active font-medium text-white"
                            : "text-tg-link hover:bg-tg-nav-hover hover:text-tg-link-hover"
                        )}
                      >
                        {item.icon && <span>{item.icon}</span>}
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            [{item.badge}]
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
