// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-gs1-data.mjs from the per-category GPC matrix
// CSVs (Clothing.csv, Footwear.csv, …) and gs1_extended_attribute_master_code_list.csv.
// Run `node scripts/generate-gs1-data.mjs` to regenerate.
//
// Maps each product category to its GPC bricks. Per brick, attributeCodeListNames lists the
// Code List Names valid for that brick (a subset of the category's Code List Names, so master
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
  "Clothing": [
    {
      "code": "10001333",
      "name": "Dresses",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Dress Type",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gauge",
        "Gender",
        "Length Description",
        "Lined",
        "Lining Material",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001350",
      "name": "Jackets/Blazers/Cardigans/Waistcoats",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Coat/Jacket Type",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gauge",
        "Gender",
        "Length Description",
        "Lined",
        "Lining Material",
        "Sleeve Type",
        "Water Repellent"
      ]
    },
    {
      "code": "10001352",
      "name": "Shirts/Blouses/Polo Shirts/T-shirts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Lined",
        "Lining Material",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001351",
      "name": "Sweaters/Pullovers",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gauge",
        "Gender",
        "Length Description",
        "Lined",
        "Lining Material",
        "Sleeve Type",
        "Sweater/Pullover Type"
      ]
    },
    {
      "code": "10001361",
      "name": "Upper Body Wear/Tops Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001332",
      "name": "Overalls/Bodysuits",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Leg Type",
        "Length Description",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001356",
      "name": "Lower Body Wear/Bottoms Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Leg Type",
        "Length Description",
        "Pants/Shorts Type",
        "Waist Rise",
        "Waistband Type"
      ]
    },
    {
      "code": "10001334",
      "name": "Skirts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Lined",
        "Lining Material",
        "Skirt Type",
        "Waistband Type"
      ]
    },
    {
      "code": "10001335",
      "name": "Trousers/Shorts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Leg Type",
        "Length Description",
        "Lined",
        "Lining Material",
        "Pants/Shorts Type",
        "Waist Rise",
        "Waistband Type"
      ]
    },
    {
      "code": "10001338",
      "name": "Dressing Gowns",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Sleepwear Type",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001339",
      "name": "Night Dresses/Shirts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Dress Type",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Sleepwear Type",
        "Sleeve Type"
      ]
    },
    {
      "code": "10001341",
      "name": "Sleep Trousers/Shorts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Sleepwear Type",
        "Waistband Type"
      ]
    },
    {
      "code": "10001358",
      "name": "Sleepwear Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Length Description",
        "Sleepwear Type",
        "Sleeve Type",
        "Waistband Type"
      ]
    },
    {
      "code": "10006964",
      "name": "Beachwear/Cover Ups",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Sleeve Type",
        "Swim Cover Up Type"
      ]
    },
    {
      "code": "10008068",
      "name": "Swimsuit - 2+ Pieces",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Panty Back Coverage",
        "Sleeve Type",
        "Swim Bottom Type",
        "Swim Top Type"
      ]
    },
    {
      "code": "10008066",
      "name": "Swimsuit Bottom",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Panty Back Coverage",
        "Swim Bottom Type"
      ]
    },
    {
      "code": "10008065",
      "name": "Swimsuit Top",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Collar/Neck Type",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Sleeve Type",
        "Swim Top Type"
      ]
    },
    {
      "code": "10008067",
      "name": "Swimsuit-One Piece",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Care Instructions",
        "Collar/Neck Type",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Panty Back Coverage",
        "Swim One-Piece Type"
      ]
    },
    {
      "code": "10006965",
      "name": "Swimwear - Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Corporate/Philanthropic Certifications",
        "Fabric or Material",
        "Fiber",
        "Gender"
      ]
    },
    {
      "code": "10001345",
      "name": "Bras/Basques/Corsets",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Bra Band Type",
        "Bra Bust Type",
        "Bra Cup Coverage",
        "Bra Cup Type",
        "Bra Impact Level",
        "Bra Padding",
        "Bra Specialty Type",
        "Bra Type",
        "Care Instructions",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Lined",
        "Shapewear Type",
        "Strap Placement"
      ]
    },
    {
      "code": "10001346",
      "name": "Full Body Underwear",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Shapewear Type"
      ]
    },
    {
      "code": "10001347",
      "name": "Pants/Briefs/Undershorts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Panty Back Coverage",
        "Panty Type",
        "Shapewear Type"
      ]
    },
    {
      "code": "10002425",
      "name": "Pantyhose/Stockings",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Hosiery/Sock Type",
        "Shapewear Type",
        "Support Level"
      ]
    },
    {
      "code": "10002424",
      "name": "Petticoats/Underskirts/Slips",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Care Instructions",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Shapewear Type",
        "Slip Type"
      ]
    },
    {
      "code": "10001348",
      "name": "Socks",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Hosiery/Sock Type"
      ]
    },
    {
      "code": "10002426",
      "name": "Suspenders/Garters",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Care Instructions",
        "Consumer Life Stage",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender"
      ]
    },
    {
      "code": "10001349",
      "name": "Undershirts/Chemises/Camisoles",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Care Instructions",
        "Collar/Neck Type",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Shapewear Type"
      ]
    },
    {
      "code": "10001360",
      "name": "Underwear Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Consumer Life Stage",
        "Control Level",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Shapewear Type"
      ]
    }
  ],
  "Shoes": [
    {
      "code": "10001077",
      "name": "Shoes - General Purpose",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Open/Closed Toe",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10001076",
      "name": "Boots - General Purpose",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Boot Shaft Type",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Open/Closed Toe",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10001070",
      "name": "Athletic Footwear - General Purpose",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Shoe Type",
        "Sole Type",
        "Sport"
      ]
    },
    {
      "code": "10001071",
      "name": "Athletic Footwear - Specialist",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Shoe Type",
        "Sole Type",
        "Sport"
      ]
    },
    {
      "code": "10001078",
      "name": "Indoor Footwear - Fully Enclosed Uppers",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Open/Closed Toe",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10001079",
      "name": "Indoor Footwear - Partially Enclosed Uppers",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Open/Closed Toe",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10001081",
      "name": "Safety/Protective Occupational Overshoes",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10001082",
      "name": "Safety/Protective Occupational Shoes",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10001080",
      "name": "Safety/Protective/Occupational Boots",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Boot Shaft Type",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Gender",
        "Heel Height Range",
        "Lining Material",
        "Shoe Type",
        "Sole Type",
        "Toe Shape",
        "Toe Style"
      ]
    },
    {
      "code": "10000400",
      "name": "Shoe Cleaning/Care Preparations",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions"
      ]
    }
  ],
  "Bags": [
    {
      "code": "10001103",
      "name": "Wallets/Purses/Travel Document Holders",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Bag Type",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender"
      ]
    },
    {
      "code": "10001096",
      "name": "Personal Bags",
      "attributeCodeListNames": [
        "Adjustable Strap",
        "Advertised Origin",
        "Bag Type",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Lining Material"
      ]
    },
    {
      "code": "10005756",
      "name": "Key Rings",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Fabric or Material",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender"
      ]
    }
  ],
  "Jewelry": [
    {
      "code": "10001083",
      "name": "Anklets",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Bracelet Type",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001084",
      "name": "Bracelets",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Bracelet Type",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001085",
      "name": "Brooches",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001086",
      "name": "Cuff-links",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001087",
      "name": "Earrings/Body-piercing Jewellery",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Closure",
        "Consumer Life Stage",
        "Earring Type",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001089",
      "name": "Jewellery Boxes/Pouches",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender"
      ]
    },
    {
      "code": "10001387",
      "name": "Jewellery Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001388",
      "name": "Jewellery Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001090",
      "name": "Necklaces/Necklets",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type",
        "Necklace Type"
      ]
    },
    {
      "code": "10001091",
      "name": "Pendants",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001092",
      "name": "Rings",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type",
        "Ring Type"
      ]
    },
    {
      "code": "10001093",
      "name": "Tiaras",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Jewelry Type"
      ]
    },
    {
      "code": "10001104",
      "name": "Watch Accessories/Replacement Parts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Band Type",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender"
      ]
    },
    {
      "code": "10001105",
      "name": "Watches",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Band Type",
        "Closure",
        "Consumer Life Stage",
        "Fabric or Material",
        "Gender",
        "Watch Case Shape"
      ]
    }
  ],
  "Beauty": [
    {
      "code": "10000762",
      "name": "Breast/Hip Enhancer Pads",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000532",
      "name": "Cosmetic/MakeUp - Complexion",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000533",
      "name": "Cosmetic/MakeUp - Eyes",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000534",
      "name": "Cosmetic/MakeUp - Lips",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10008306",
      "name": "Cosmetic/MakeUp - Multizone",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000377",
      "name": "Cosmetic/MakeUp Aids/Accessories",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10008024",
      "name": "Cosmetic/MakeUp Applicators",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10006201",
      "name": "Cosmetic/MakeUp Display Test",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000761",
      "name": "Cosmetic/MakeUp Paints/Shimmers/Glitters",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000775",
      "name": "Cosmetic/MakeUp Products Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000669",
      "name": "Cosmetic/MakeUp Products Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000764",
      "name": "Eyelashes - False",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000486",
      "name": "Skin Lightening",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000763",
      "name": "Tattoos/Stencils/Stick-on Jewellery - Temporary",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000672",
      "name": "Cosmetics/Fragrances Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000365",
      "name": "Fragrances",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000360",
      "name": "Cosmetics - Nails",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000768",
      "name": "Nail Cosmetic/Care Products - Replacement Parts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000671",
      "name": "Nail Cosmetic/Care Products Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000385",
      "name": "Nails - Accessories (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000767",
      "name": "Nails - Accessories (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000358",
      "name": "Nails - Aids (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000780",
      "name": "Nails - Aids (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000333",
      "name": "Nails - Cleansers/Cosmetic Removers",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000359",
      "name": "Nails - False",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000361",
      "name": "Nails - Treatments",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000324",
      "name": "After Shave Care",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10006275",
      "name": "After-Sun Moisturisers",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10000327",
      "name": "Anti-spot Aids (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10000806",
      "name": "Anti-spot Aids (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000332",
      "name": "Cleansers/Cosmetics Removers (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10000808",
      "name": "Cleansers/Cosmetics Removers (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000719",
      "name": "Cooling Face/Body Misters",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10000342",
      "name": "Exfoliants/Masks",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10005727",
      "name": "Lip Balms",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000810",
      "name": "Skin Care - Replacement Parts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000721",
      "name": "Skin Care Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000356",
      "name": "Skin Care/Moisturising Products",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000374",
      "name": "Skin Drying Powder",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10000484",
      "name": "Toners/Astringents",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type"
      ]
    },
    {
      "code": "10000717",
      "name": "Skin Products Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Skin Type",
        "SPF Rating"
      ]
    },
    {
      "code": "10000379",
      "name": "Hair - Accessories",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000564",
      "name": "Hair - Aids (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000828",
      "name": "Hair - Aids (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10008023",
      "name": "Hair - Brushes and Combs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000345",
      "name": "Hair - Colour",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000346",
      "name": "Hair - Conditioner/Treatment",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000343",
      "name": "Hair - False",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000348",
      "name": "Hair - Perming",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000368",
      "name": "Hair - Shampoo",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000381",
      "name": "Hair - Styling (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000678",
      "name": "Hair - Styling (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000833",
      "name": "Hair Care Products - Replacement Parts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000834",
      "name": "Hair Care Products Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000677",
      "name": "Hair Care Products Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000829",
      "name": "Hair Curlers/Rollers",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000329",
      "name": "Bleaching/Lightening Products",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000340",
      "name": "Depilation/Epilation (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000830",
      "name": "Depilation/Epilation (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000350",
      "name": "Hair Removal - Care",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000832",
      "name": "Hair Removal/Masking Products - Replacement Parts",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000835",
      "name": "Hair Removal/Masking Products Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000680",
      "name": "Hair Removal/Masking Products Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000349",
      "name": "Hair Removal/Shaving - Accessories",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000679",
      "name": "Mirrors - Personal Care",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000369",
      "name": "Shaving - Blades",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000370",
      "name": "Shaving - Razors - Disposable (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000730",
      "name": "Shaving - Razors - Non Disposable (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000831",
      "name": "Shaving - Razors (Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Formulation",
        "Gender"
      ]
    },
    {
      "code": "10000535",
      "name": "Shaving Preparations",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Type",
        "Gender"
      ]
    },
    {
      "code": "10000328",
      "name": "Bath Additives",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000813",
      "name": "Body Washing Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000722",
      "name": "Body Washing Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000334",
      "name": "Cleansing/Washing Accessories - Personal",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000330",
      "name": "Cleansing/Washing/Soap - Body",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000573",
      "name": "Wipes - Personal",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "Scent Type"
      ]
    },
    {
      "code": "10000814",
      "name": "Skin Tanning Products Other",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "SPF Rating"
      ]
    },
    {
      "code": "10000723",
      "name": "Skin Tanning Products Variety Packs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "SPF Rating"
      ]
    },
    {
      "code": "10000373",
      "name": "Sun Protection Products",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "SPF Rating"
      ]
    },
    {
      "code": "10000388",
      "name": "Sun Tan Accelerator Products",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "SPF Rating"
      ]
    },
    {
      "code": "10000731",
      "name": "Sunless Tanning - Oral (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "SPF Rating"
      ]
    },
    {
      "code": "10000355",
      "name": "Sunless Tanning - Topical (Non Powered)",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Beauty Area of Use",
        "Beauty Treatment Specialty",
        "Beauty Type",
        "Formulation",
        "Gender",
        "SPF Rating"
      ]
    }
  ],
  "Accessories": [
    {
      "code": "10001328",
      "name": "Handwear/gloves",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Glove Type",
        "Lining Material"
      ]
    },
    {
      "code": "10001329",
      "name": "Headwear",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Hat Type"
      ]
    },
    {
      "code": "10001327",
      "name": "Pocket Square/Handkerchiefs",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender"
      ]
    },
    {
      "code": "10001330",
      "name": "Scarf/Tie/Neckwear",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Care Instructions",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender",
        "Neckwear Type",
        "Scarf Type"
      ]
    },
    {
      "code": "10001326",
      "name": "Belts/Braces/Cummerbunds",
      "attributeCodeListNames": [
        "Advertised Origin",
        "Belt Type",
        "Care Instructions",
        "Closure",
        "Fabric or Material",
        "Fiber",
        "Fur Animal Name",
        "Fur Treatment",
        "Gender"
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
