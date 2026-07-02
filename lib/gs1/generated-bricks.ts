// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-brick-options.mjs from brick-attributes.csv
// (itself flattened from "Brick to extended attributes.xlsx" by
// scripts/extract-brick-attributes.py).
// Run `node scripts/generate-brick-options.mjs` to regenerate.
//
// Maps each product category to its GPC bricks. Per brick, attributeCodeListNames lists the
// Code List Names valid for that brick (a subset of the category's Code List Names, so CSV
// values + GS1 codes remain available via generated-options.ts). Names only → client-safe.
// =============================================================================

import type { ProductCategory } from "./types"

// One GPC brick (leaf classification) and the Code List Names that apply to it.
export type Brick = {
  code: string
  name: string
  attributeCodeListNames: string[]
}

export const CATEGORY_BRICKS: Record<ProductCategory, Brick[]> = {
  "Shoes": [
    {
      "code": "10001077",
      "name": "Shoes - General Purpose",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    },
    {
      "code": "10001076",
      "name": "Boots - General Purpose",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    },
    {
      "code": "10001070",
      "name": "Athletic Footwear - General Purpose",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type"
      ]
    },
    {
      "code": "10001071",
      "name": "Athletic Footwear - Specialist",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type"
      ]
    },
    {
      "code": "10001078",
      "name": "Indoor Footwear - Fully Enclosed Uppers",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    },
    {
      "code": "10001079",
      "name": "Indoor Footwear - Partially Enclosed Uppers",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    },
    {
      "code": "10001081",
      "name": "Safety/Protective Occupational Overshoes",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    },
    {
      "code": "10001082",
      "name": "Safety/Protective Occupational Shoes",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    },
    {
      "code": "10001080",
      "name": "Safety/Protective/Occupational Boots",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Shoe Type",
        "Sole Type",
        "Toe Shape"
      ]
    }
  ],
  "Apparel": [
    {
      "code": "10001338",
      "name": "Dressing Gowns",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001339",
      "name": "Night Dresses/Shirts",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001341",
      "name": "Sleep Trousers/Shorts",
      "attributeCodeListNames": [
        "Closure",
        "Gender"
      ]
    },
    {
      "code": "10001358",
      "name": "Sleepwear Variety Packs",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001345",
      "name": "Bras/Basques/Corsets",
      "attributeCodeListNames": [
        "Closure",
        "Gender"
      ]
    },
    {
      "code": "10001360",
      "name": "Underwear Variety Packs",
      "attributeCodeListNames": [
        "Closure",
        "Gender"
      ]
    },
    {
      "code": "10006964",
      "name": "Beachwear/Cover Ups",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Sleeve Type"
      ]
    },
    {
      "code": "10008068",
      "name": "Swimsuit - 2+ Pieces",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Sleeve Type"
      ]
    },
    {
      "code": "10008065",
      "name": "Swimsuit Top",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Sleeve Type"
      ]
    }
  ],
  "Bags": [
    {
      "code": "10001103",
      "name": "Wallets/Purses/Travel Document Holders",
      "attributeCodeListNames": [
        "Bag Type",
        "Closure",
        "Gender"
      ]
    },
    {
      "code": "10001096",
      "name": "Personal Bags",
      "attributeCodeListNames": [
        "Bag Type",
        "Closure",
        "Gender",
        "Lining Material"
      ]
    }
  ],
  "Jewelry": [
    {
      "code": "10001083",
      "name": "Anklets",
      "attributeCodeListNames": [
        "Bracelet Type",
        "Closure",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001084",
      "name": "Bracelets",
      "attributeCodeListNames": [
        "Bracelet Type",
        "Closure",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001085",
      "name": "Brooches",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001086",
      "name": "Cuff-links",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001087",
      "name": "Earrings/Body-piercing Jewellery",
      "attributeCodeListNames": [
        "Closure",
        "Earring Type",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001387",
      "name": "Jewellery Other",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001388",
      "name": "Jewellery Variety Packs",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001090",
      "name": "Necklaces/Necklets",
      "attributeCodeListNames": [
        "Closure",
        "Gender",
        "Jewelry Type",
        "Necklace Type"
      ]
    },
    {
      "code": "10001091",
      "name": "Pendants",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001092",
      "name": "Rings",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type",
        "Ring Type"
      ]
    },
    {
      "code": "10001093",
      "name": "Tiaras",
      "attributeCodeListNames": [
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001104",
      "name": "Watch Accessories/Replacement Parts",
      "attributeCodeListNames": [
        "Band Type",
        "Closure",
        "Gender"
      ]
    },
    {
      "code": "10001105",
      "name": "Watches",
      "attributeCodeListNames": [
        "Band Type",
        "Closure",
        "Gender"
      ]
    }
  ],
  "Beauty": [
    {
      "code": "10000532",
      "name": "Cosmetic/MakeUp - Complexion",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000533",
      "name": "Cosmetic/MakeUp - Eyes",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000534",
      "name": "Cosmetic/MakeUp - Lips",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10008306",
      "name": "Cosmetic/MakeUp - Multizone",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000377",
      "name": "Cosmetic/MakeUp Aids/Accessories",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10008024",
      "name": "Cosmetic/MakeUp Applicators",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10006201",
      "name": "Cosmetic/MakeUp Display Test",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000761",
      "name": "Cosmetic/MakeUp Paints/Shimmers/Glitters",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000775",
      "name": "Cosmetic/MakeUp Products Other",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000669",
      "name": "Cosmetic/MakeUp Products Variety Packs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000764",
      "name": "Eyelashes - False",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000486",
      "name": "Skin Lightening",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000763",
      "name": "Tattoos/Stencils/Stick-on Jewellery - Temporary",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000324",
      "name": "After Shave Care",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10006275",
      "name": "After-Sun Moisturisers",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10000327",
      "name": "Anti-spot Aids (Non Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10000806",
      "name": "Anti-spot Aids (Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000332",
      "name": "Cleansers/Cosmetics Removers (Non Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10000808",
      "name": "Cleansers/Cosmetics Removers (Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000719",
      "name": "Cooling Face/Body Misters",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10000342",
      "name": "Exfoliants/Masks",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10005727",
      "name": "Lip Balms",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000810",
      "name": "Skin Care - Replacement Parts",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000721",
      "name": "Skin Care Variety Packs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000356",
      "name": "Skin Care/Moisturising Products",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000374",
      "name": "Skin Drying Powder",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10000484",
      "name": "Toners/Astringents",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type"
      ]
    },
    {
      "code": "10000717",
      "name": "Skin Products Variety Packs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000379",
      "name": "Hair - Accessories",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000564",
      "name": "Hair - Aids (Non Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000828",
      "name": "Hair - Aids (Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10008023",
      "name": "Hair - Brushes and Combs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000345",
      "name": "Hair - Colour",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000346",
      "name": "Hair - Conditioner/Treatment",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000343",
      "name": "Hair - False",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000348",
      "name": "Hair - Perming",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000368",
      "name": "Hair - Shampoo",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000381",
      "name": "Hair - Styling (Non Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000678",
      "name": "Hair - Styling (Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000833",
      "name": "Hair Care Products - Replacement Parts",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000834",
      "name": "Hair Care Products Other",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000677",
      "name": "Hair Care Products Variety Packs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000829",
      "name": "Hair Curlers/Rollers",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty"
      ]
    },
    {
      "code": "10000328",
      "name": "Bath Additives",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Scent Type"
      ]
    },
    {
      "code": "10000813",
      "name": "Body Washing Other",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Scent Type"
      ]
    },
    {
      "code": "10000722",
      "name": "Body Washing Variety Packs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Scent Type"
      ]
    },
    {
      "code": "10000334",
      "name": "Cleansing/Washing Accessories - Personal",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Scent Type"
      ]
    },
    {
      "code": "10000330",
      "name": "Cleansing/Washing/Soap - Body",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Scent Type"
      ]
    },
    {
      "code": "10000573",
      "name": "Wipes - Personal",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Scent Type"
      ]
    },
    {
      "code": "10000814",
      "name": "Skin Tanning Products Other",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "SPF Rating"
      ]
    },
    {
      "code": "10000723",
      "name": "Skin Tanning Products Variety Packs",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "SPF Rating"
      ]
    },
    {
      "code": "10000373",
      "name": "Sun Protection Products",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "SPF Rating"
      ]
    },
    {
      "code": "10000388",
      "name": "Sun Tan Accelerator Products",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "SPF Rating"
      ]
    },
    {
      "code": "10000731",
      "name": "Sunless Tanning - Oral (Non Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "SPF Rating"
      ]
    },
    {
      "code": "10000355",
      "name": "Sunless Tanning - Topical (Non Powered)",
      "attributeCodeListNames": [
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "SPF Rating"
      ]
    }
  ]
}

// All bricks for a category (empty array if unknown).
export function getCategoryBricks(category: string): Brick[] {
  return CATEGORY_BRICKS[category as ProductCategory] ?? []
}

// Look up a single brick by category + code (undefined if not found).
export function getBrick(category: string, code: string): Brick | undefined {
  return getCategoryBricks(category).find(b => b.code === code)
}
