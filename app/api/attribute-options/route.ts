import { NextResponse } from "next/server"
import { getCategoryOptions } from "@/lib/gs1/generated-options"
import { isProductCategory, type CategoryOptions } from "@/lib/gs1/types"

// Server-only route. Returns the full CSV-derived allowed options for a SINGLE category.
// The client uses this for edit dropdowns and mock-code grounding, so the full CSV (all
// categories / unrelated Code List Names) is never shipped to the browser.
export const runtime = "nodejs"

export type AttributeOptionsResponse = {
  category: string
  options: CategoryOptions
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")?.trim() ?? ""

  if (!isProductCategory(category)) {
    return NextResponse.json(
      { error: "Invalid or missing category." },
      { status: 400 },
    )
  }

  return NextResponse.json<AttributeOptionsResponse>({
    category,
    options: getCategoryOptions(category),
  })
}
