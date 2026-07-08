// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-gs1-data.mjs from the per-category GPC matrix
// CSVs (Clothing.csv, Footwear.csv, …) and gs1_extended_attribute_master_code_list.csv.
// Run `node scripts/generate-gs1-data.mjs` to regenerate.
//
// Contains the FULL set of master-list allowed values, scoped to each category's
// relevant Code List Names only. Server-only by convention: imported by API routes,
// never by client components (the client receives a single category via the
// /api/attribute-options route).
// =============================================================================

import type { ProductCategory, CategoryOptions } from "./types"

// Relevant Code List Names per category (derived from the category's brick matrices).
export const CATEGORY_CODE_LISTS: Record<ProductCategory, string[]> = {
  "Clothing": [
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
    "Sleeve Type",
    "Coat/Jacket Type",
    "Water Repellent",
    "Sweater/Pullover Type",
    "Leg Type",
    "Pants/Shorts Type",
    "Waist Rise",
    "Waistband Type",
    "Skirt Type",
    "Sleepwear Type",
    "Swim Cover Up Type",
    "Adjustable Strap",
    "Panty Back Coverage",
    "Swim Bottom Type",
    "Swim Top Type",
    "Swim One-Piece Type",
    "Corporate/Philanthropic Certifications",
    "Bra Band Type",
    "Bra Bust Type",
    "Bra Cup Coverage",
    "Bra Cup Type",
    "Bra Impact Level",
    "Bra Padding",
    "Bra Specialty Type",
    "Bra Type",
    "Shapewear Type",
    "Strap Placement",
    "Control Level",
    "Panty Type",
    "Hosiery/Sock Type",
    "Support Level",
    "Slip Type"
  ],
  "Shoes": [
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
    "Toe Style",
    "Boot Shaft Type",
    "Sport"
  ],
  "Bags": [
    "Advertised Origin",
    "Bag Type",
    "Care Instructions",
    "Closure",
    "Fabric or Material",
    "Fur Animal Name",
    "Fur Treatment",
    "Gender",
    "Adjustable Strap",
    "Lining Material"
  ],
  "Jewelry": [
    "Advertised Origin",
    "Bracelet Type",
    "Closure",
    "Consumer Life Stage",
    "Fabric or Material",
    "Gender",
    "Jewelry Type",
    "Earring Type",
    "Necklace Type",
    "Ring Type",
    "Band Type",
    "Watch Case Shape"
  ],
  "Beauty": [
    "Advertised Origin",
    "Beauty Type",
    "Gender",
    "Beauty Area of Use",
    "Beauty Treatment Specialty",
    "Formulation",
    "Skin Type",
    "SPF Rating",
    "Scent Type"
  ],
  "Accessories": [
    "Advertised Origin",
    "Care Instructions",
    "Fabric or Material",
    "Fiber",
    "Fur Animal Name",
    "Fur Treatment",
    "Gender",
    "Glove Type",
    "Lining Material",
    "Hat Type",
    "Neckwear Type",
    "Scarf Type",
    "Belt Type",
    "Closure"
  ]
}

// Full master-list allowed values per category, by Code List Name.
export const GS1_CATEGORY_OPTIONS: Record<ProductCategory, CategoryOptions> = {
  "Clothing": [
    {
      "codeListName": "Advertised Origin",
      "values": [
        {
          "value": "Imported",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Made in Canada",
          "code": "GM03ADVOMC"
        },
        {
          "value": "Made in U.S.A.",
          "code": "GM03ADVOMU"
        },
        {
          "value": "Made in U.S.A. and Imported",
          "code": "GM03ADVOUI"
        },
        {
          "value": "Made in U.S.A. or Imported",
          "code": "GM03ADVOUO"
        },
        {
          "value": "Made in another country*",
          "code": "GM04ADV099"
        }
      ]
    },
    {
      "codeListName": "Care Instructions",
      "values": [
        {
          "value": "Dishwasher Safe",
          "code": "GM03CAINDS"
        },
        {
          "value": "Machine Wash Hot",
          "code": "GM03CAINΜΗ"
        },
        {
          "value": "Do Not Iron",
          "code": "GM03CAINDN"
        },
        {
          "value": "Machine Wash Line Dry",
          "code": "GM03CAINML"
        },
        {
          "value": "Dry Clean",
          "code": "GM03CAINDC"
        },
        {
          "value": "Machine Wash Tumble Dry",
          "code": "GM03CAINMT"
        },
        {
          "value": "Hand Wash",
          "code": "GM03CAINHW"
        },
        {
          "value": "Machine Wash Warm",
          "code": "GM03CAINMW"
        },
        {
          "value": "Leather Method Dry Cleaning",
          "code": "GM03CAINLM"
        },
        {
          "value": "Spot Clean",
          "code": "GM03CAINSC"
        },
        {
          "value": "Machine Wash Cold",
          "code": "GM03CAINMC"
        },
        {
          "value": "Wash Separately",
          "code": "GM03CAINWS"
        },
        {
          "value": "Machine Wash Dry Flat",
          "code": "GM03CAINMD"
        },
        {
          "value": "Other",
          "code": "GM04CAIN99"
        }
      ]
    },
    {
      "codeListName": "Closure",
      "values": [
        {
          "value": "Adjustable/Pull",
          "code": "GM03CLOSAP"
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        },
        {
          "value": "Back",
          "code": "GM03CLOSBC"
        },
        {
          "value": "Latch",
          "code": "GM03CLOSLA"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Click Top",
          "code": "GM03CLOSCT"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "Elastic Lace with Toggle",
          "code": "GM03CLOSET"
        },
        {
          "value": "Swivel",
          "code": "GM03CLOSSW"
        },
        {
          "value": "O Ring",
          "code": "GM03CLOSDO"
        },
        {
          "value": "Tab",
          "code": "GM03CLOSTB"
        },
        {
          "value": "Fishhook",
          "code": "GM03CLOSFS"
        },
        {
          "value": "Tie",
          "code": "GM03CLOSTI"
        },
        {
          "value": "Flap",
          "code": "GM03CLOSFP"
        },
        {
          "value": "Tie Back/Halter",
          "code": "GM03CLOSTH"
        },
        {
          "value": "Foldover",
          "code": "GM03CLOSFO"
        },
        {
          "value": "Tie Front",
          "code": "GM03CLOSTF"
        },
        {
          "value": "French Wire",
          "code": "GM03CLOSFW"
        },
        {
          "value": "Tie Side",
          "code": "GM03CLOSTS"
        },
        {
          "value": "Frog/Button Loop",
          "code": "GM03CLOSFA"
        },
        {
          "value": "Toggle",
          "code": "GM03CLOSTO"
        },
        {
          "value": "Front Button/Zip",
          "code": "GM03CLOSFZ"
        },
        {
          "value": "Toggle Front",
          "code": "GM03CLOSTN"
        },
        {
          "value": "Front Hook/Zip",
          "code": "GM03CLOSFH"
        },
        {
          "value": "Top Zip",
          "code": "GM03CLOSTZ"
        },
        {
          "value": "Hidden Button Front",
          "code": "GM03CLOSHB"
        },
        {
          "value": "Tunnel Side Tie",
          "code": "GM03CLOSTQ"
        },
        {
          "value": "Hidden Snap Front",
          "code": "GM03CLOSHS"
        },
        {
          "value": "Turn Lock",
          "code": "GM03CLOSTL"
        },
        {
          "value": "Hidden Zip Front",
          "code": "GM03CLOSHZ"
        },
        {
          "value": "Wrap",
          "code": "GM03CLOSWR"
        },
        {
          "value": "Hinged",
          "code": "GM03CLOSHI"
        },
        {
          "value": "Zipper",
          "code": "GM03CLOSZI"
        },
        {
          "value": "Hinged/Foldover",
          "code": "GM03CLOSHE"
        },
        {
          "value": "Zipper Back",
          "code": "GM03CLOSZB"
        },
        {
          "value": "Hook",
          "code": "GM03CLOSHO"
        },
        {
          "value": "Zipper Back Partial",
          "code": "GM03CLOSZP"
        },
        {
          "value": "Hook and Loop",
          "code": "GM03CLOSHL"
        },
        {
          "value": "Zipper Front",
          "code": "GM03CLOSZE"
        },
        {
          "value": "Hook-and-eye",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back Front",
          "code": "GM03CLOSHD"
        },
        {
          "value": "Zipper Side",
          "code": "GM03CLOSZS"
        },
        {
          "value": "Keyhole Button",
          "code": "GM03CLOSKB"
        },
        {
          "value": "Zipper Around",
          "code": "GM03CLOSZA"
        },
        {
          "value": "Kiss-Lock",
          "code": "GM03CLOSKL"
        },
        {
          "value": "1/4 Zip",
          "code": "GM03CLOSZQ"
        },
        {
          "value": "Knot",
          "code": "GM03CLOSKN"
        },
        {
          "value": "1/2 Zip",
          "code": "GM03CLOSZH"
        },
        {
          "value": "Lace Up",
          "code": "GM03CLOSLU"
        },
        {
          "value": "Other Closure",
          "code": "GM04CLOS99"
        }
      ]
    },
    {
      "codeListName": "Collar/Neck Type",
      "values": [
        {
          "value": "Ballet",
          "code": "GM03CLNTBL"
        },
        {
          "value": "Plunge",
          "code": "GM03CLNTPJ"
        },
        {
          "value": "Banded",
          "code": "GM03CLNTBC"
        },
        {
          "value": "Point",
          "code": "GM03CLNTΡΟ"
        },
        {
          "value": "Boat or Bateau",
          "code": "GM03CLNTBE"
        },
        {
          "value": "Polo",
          "code": "GM03CLNTPU"
        },
        {
          "value": "Button-Down",
          "code": "GM03CLNTBD"
        },
        {
          "value": "Portrait Collar",
          "code": "GM03CLNTPR"
        },
        {
          "value": "Cowl",
          "code": "GM03CLNTCW"
        },
        {
          "value": "1/4-Zip Mock",
          "code": "GM03CLNTQZ"
        },
        {
          "value": "Crew",
          "code": "GM03CLNTCR"
        },
        {
          "value": "Racer Back",
          "code": "GM03CLNTRB"
        },
        {
          "value": "Drape",
          "code": "GM03CLNTDP"
        },
        {
          "value": "Rolled",
          "code": "GM03CLNTRO"
        },
        {
          "value": "Funnel",
          "code": "GM03CLNTFU"
        },
        {
          "value": "Round",
          "code": "GM03CLNTRU"
        },
        {
          "value": "Halter",
          "code": "GM03CLNTHA"
        },
        {
          "value": "Sailor",
          "code": "GM03CLNTSD"
        },
        {
          "value": "Henley",
          "code": "GM03CLNTHΝ"
        },
        {
          "value": "Scoop",
          "code": "GM03CLNTSC"
        },
        {
          "value": "Henley Faux",
          "code": "GM03CLNTHF"
        },
        {
          "value": "Shawl",
          "code": "GM03CLNTSH"
        },
        {
          "value": "Henley Functional",
          "code": "GM03CLNTHU"
        },
        {
          "value": "Slider Halter",
          "code": "GM03CLNTSL"
        },
        {
          "value": "Jewel",
          "code": "GM03CLNTJE"
        },
        {
          "value": "Spread",
          "code": "GM03CLNTSO"
        },
        {
          "value": "Johnny",
          "code": "GM03CLNTJO"
        },
        {
          "value": "Square",
          "code": "GM03CLNTSQ"
        },
        {
          "value": "Keyhole",
          "code": "GM03CLNTKE"
        },
        {
          "value": "Stand",
          "code": "GM03CLNTSV"
        },
        {
          "value": "Mandarin",
          "code": "GM03CLNTMB"
        },
        {
          "value": "Surplice",
          "code": "GM03CLNTSU"
        },
        {
          "value": "Marilyn",
          "code": "GM03CLNTMI"
        },
        {
          "value": "Sweetheart",
          "code": "GM03CLNTSX"
        },
        {
          "value": "Mockneck",
          "code": "GM03CLNTMO"
        },
        {
          "value": "Tab",
          "code": "GM03CLNTTA"
        },
        {
          "value": "Necklace",
          "code": "GM03CLNTNE"
        },
        {
          "value": "Tie",
          "code": "GM03CLNTTI"
        },
        {
          "value": "Notch",
          "code": "GM03CLNTNO"
        },
        {
          "value": "Turtle",
          "code": "GM03CLNTTU"
        },
        {
          "value": "Off the Shoulder",
          "code": "GM03CLNTOR"
        },
        {
          "value": "V-Neck",
          "code": "GM03CLNTVN"
        },
        {
          "value": "One Shoulder",
          "code": "GM03CLNTOS"
        },
        {
          "value": "Wing",
          "code": "GM03CLNTWI"
        },
        {
          "value": "Ottoman",
          "code": "GM03CLNTOT"
        },
        {
          "value": "Y-Neck",
          "code": "GM03CLNTΥΝ"
        },
        {
          "value": "Peter Pan",
          "code": "GM03CLNTΡΑ"
        },
        {
          "value": "Other Collar",
          "code": "GM04CLNT99"
        },
        {
          "value": "Platter",
          "code": "GM03CLNTΡΕ"
        }
      ]
    },
    {
      "codeListName": "Consumer Life Stage",
      "values": [
        {
          "value": "Adult",
          "code": "GM03CNLSAD"
        },
        {
          "value": "Teen",
          "code": "GM03CNLSTE"
        },
        {
          "value": "All Ages",
          "code": "GM03CNLSAG"
        },
        {
          "value": "Toddler",
          "code": "GM03CNLTDD"
        },
        {
          "value": "Baby/Infant",
          "code": "GM03CNLSBI"
        },
        {
          "value": "Unclassified",
          "code": "GM03CNLSYA"
        },
        {
          "value": "Child",
          "code": "GM03CNLSCH"
        },
        {
          "value": "Unidentified",
          "code": "GM03CNLSUC"
        },
        {
          "value": "Child 1-2 Years",
          "code": "GM03CNLSCT"
        },
        {
          "value": "Young Adult",
          "code": "GM03CNLSYA"
        },
        {
          "value": "Child 2 Years Onwards",
          "code": "GM03CNLSCW"
        },
        {
          "value": "Other",
          "code": "GM04CNLS99"
        },
        {
          "value": "Preemie",
          "code": "GM03CNLSPR"
        }
      ]
    },
    {
      "codeListName": "Dress Type",
      "values": [
        {
          "value": "A-line",
          "code": "GM03DRTPAL"
        },
        {
          "value": "Pencil",
          "code": "GM03DRTΡΡΕ"
        },
        {
          "value": "Babydoll",
          "code": "GM03DRTPΡΒΑ"
        },
        {
          "value": "Peplum",
          "code": "GM03DRTPPL"
        },
        {
          "value": "Blouson",
          "code": "GM03DRTPBL"
        },
        {
          "value": "Popover",
          "code": "GM03DRTPPV"
        },
        {
          "value": "Body-Conscious",
          "code": "GM03DRTPРBC"
        },
        {
          "value": "Sheath",
          "code": "GM03DRTPSE"
        },
        {
          "value": "Caftan",
          "code": "GM03DRTPСА"
        },
        {
          "value": "Shift",
          "code": "GM03DRTPSI"
        },
        {
          "value": "Circular",
          "code": "GM03DRTPСІ"
        },
        {
          "value": "Shirtdress",
          "code": "GM03DRTPSD"
        },
        {
          "value": "Dress",
          "code": "GM03DRTPDR"
        },
        {
          "value": "Skater",
          "code": "GM03DRTPSK"
        },
        {
          "value": "Drop Waist",
          "code": "GM03DRTPDW"
        },
        {
          "value": "Skort",
          "code": "GM03DRTPSR"
        },
        {
          "value": "Empire Waist",
          "code": "GM03DRTPEW"
        },
        {
          "value": "Slipdress",
          "code": "GM03DRTPSL"
        },
        {
          "value": "Faux Wrap",
          "code": "GM03DRTPFW"
        },
        {
          "value": "Sweater Dress",
          "code": "GM03DRTPSW"
        },
        {
          "value": "Flared",
          "code": "GM03DRTPFL"
        },
        {
          "value": "Tank Dress",
          "code": "GM03DRTPTD"
        },
        {
          "value": "Full Skirt",
          "code": "GM03DRTPFS"
        },
        {
          "value": "Tiered",
          "code": "GM03DRTPTI"
        },
        {
          "value": "Gown",
          "code": "GM03DRTPGN"
        },
        {
          "value": "Two Piece",
          "code": "GM03DRTPΤΡ"
        },
        {
          "value": "Jacket Dress",
          "code": "GM03DRTPJD"
        },
        {
          "value": "Wedding",
          "code": "GM03DRTPWE"
        },
        {
          "value": "Jumper",
          "code": "GM03DRTPJU"
        },
        {
          "value": "Wrap",
          "code": "GM03DRTPWR"
        },
        {
          "value": "Maternity",
          "code": "GM03DRTPΡΜΑ"
        },
        {
          "value": "Other",
          "code": "GM04DRTP99"
        },
        {
          "value": "Mermaid/Trumpet",
          "code": "GM03DRTPMT"
        }
      ]
    },
    {
      "codeListName": "Fabric or Material",
      "values": [
        {
          "value": "14K Gold",
          "code": "GM03FBMC14"
        },
        {
          "value": "Marble/Wood",
          "code": "GM03FBMCMD"
        },
        {
          "value": "18K Gold",
          "code": "GM03FBMC18"
        },
        {
          "value": "Matte Jersey",
          "code": "GM03FBMCME"
        },
        {
          "value": "Agate",
          "code": "GM03FBMCAG"
        },
        {
          "value": "Melamine",
          "code": "GM03FBMCMF"
        },
        {
          "value": "Aluminum",
          "code": "GM03FBMCAL"
        },
        {
          "value": "Mercury Glass",
          "code": "GM03FBMCMG"
        },
        {
          "value": "Amethyst",
          "code": "GM03FBMCAM"
        },
        {
          "value": "Mesh",
          "code": "GM03FBMCMH"
        },
        {
          "value": "Anodized Aluminum",
          "code": "GM03FBMCAN"
        },
        {
          "value": "Metal",
          "code": "GM03FBMCMI"
        },
        {
          "value": "Beaded",
          "code": "GM03FBMCBD"
        },
        {
          "value": "Metal Alloy",
          "code": "GM03FBMCMJ"
        },
        {
          "value": "Birthstone",
          "code": "GM03FBMCBE"
        },
        {
          "value": "Metallic",
          "code": "GM03FBMCMK"
        },
        {
          "value": "Bi-stretch",
          "code": "GM03FBMCBF"
        },
        {
          "value": "Microfiber",
          "code": "GM03FBMCML"
        },
        {
          "value": "Bone",
          "code": "GM03FBMCBG"
        },
        {
          "value": "Microfleece",
          "code": "GM03FBMCMM"
        },
        {
          "value": "Boucle",
          "code": "GM03FBMCBH"
        },
        {
          "value": "Mikado",
          "code": "GM03FBMCMN"
        },
        {
          "value": "Brass",
          "code": "GM03FBMCBI"
        },
        {
          "value": "Mixed Materials",
          "code": "GM03FBMCMO"
        },
        {
          "value": "Broadcloth",
          "code": "GM03FBMCBJ"
        },
        {
          "value": "Mogador",
          "code": "GM03FBMCMP"
        },
        {
          "value": "Brocade",
          "code": "GM03FBMCBL"
        },
        {
          "value": "Moleskin",
          "code": "GM03FBMCMQ"
        },
        {
          "value": "Bronze",
          "code": "GM03FBMCBN"
        },
        {
          "value": "Mother-of-Pearl",
          "code": "GM03FBMCMR"
        },
        {
          "value": "Brushed Back Satin",
          "code": "GM03FBMCBS"
        },
        {
          "value": "Natural",
          "code": "GM03FBMCNA"
        },
        {
          "value": "Brushed Back Terry",
          "code": "GM03FBMCBT"
        },
        {
          "value": "Natural Fiber",
          "code": "GM03FBMCNB"
        },
        {
          "value": "Burlap",
          "code": "GM03FBMCBU"
        },
        {
          "value": "Nonstick",
          "code": "GM03FBMCNC"
        },
        {
          "value": "Canvas",
          "code": "GM03FBMCCA"
        },
        {
          "value": "Nubuck",
          "code": "GM03FBMCND"
        },
        {
          "value": "Cashmink",
          "code": "GM03FBMCCB"
        },
        {
          "value": "Onyx",
          "code": "GM03FBMCOA"
        },
        {
          "value": "Cast Aluminum",
          "code": "GM03FBMCCC"
        },
        {
          "value": "Opal",
          "code": "GM03FBMСОВ"
        },
        {
          "value": "Cast Iron",
          "code": "GM03FBMCCD"
        },
        {
          "value": "Organza",
          "code": "GM03FBMCOC"
        },
        {
          "value": "Ceramic",
          "code": "GM03FBMCCE"
        },
        {
          "value": "Ostrich",
          "code": "GM03FBMCOD"
        },
        {
          "value": "Challis",
          "code": "GM03FBMCCF"
        },
        {
          "value": "Ostrich Embossed",
          "code": "GM03FBMCOE"
        },
        {
          "value": "Chambray",
          "code": "GM03FBMCCG"
        },
        {
          "value": "Oxford",
          "code": "GM03FBMCOF"
        },
        {
          "value": "Charmeuse",
          "code": "GM03FBMCCH"
        },
        {
          "value": "Palladium",
          "code": "GM03FBMCPA"
        },
        {
          "value": "Chenille",
          "code": "GM03FBMCCI"
        },
        {
          "value": "Paper Braid",
          "code": "GM03FBMCPB"
        },
        {
          "value": "Chiffon/Sheer",
          "code": "GM03FBMCCJ"
        },
        {
          "value": "Patent Leather",
          "code": "GM03FBMCPC"
        },
        {
          "value": "Coated Canvas",
          "code": "GM03FBMCCK"
        },
        {
          "value": "Pearl",
          "code": "GM03FBMCPD"
        },
        {
          "value": "Composite",
          "code": "GM03FBMCCL"
        },
        {
          "value": "Percale",
          "code": "GM03FBMCPE"
        },
        {
          "value": "Confetti",
          "code": "GM03FBMCCM"
        },
        {
          "value": "Pinpoint",
          "code": "GM03FBMCPF"
        },
        {
          "value": "Copper",
          "code": "GM03FBMCCN"
        },
        {
          "value": "Pique",
          "code": "GM03FBMCPG"
        },
        {
          "value": "Coral",
          "code": "GM03FBMCCO"
        },
        {
          "value": "Plastic",
          "code": "GM03FBMCPH"
        },
        {
          "value": "Corduroy",
          "code": "GM03FBMCСР"
        },
        {
          "value": "Plastic/Acetate",
          "code": "GM03FBMCPI"
        },
        {
          "value": "Corian",
          "code": "GM03FBMCCQ"
        },
        {
          "value": "Plastic/Metal",
          "code": "GM03FBMCPJ"
        },
        {
          "value": "Cork",
          "code": "GM03FBMCCR"
        },
        {
          "value": "Plush",
          "code": "GM03FBMCPK"
        },
        {
          "value": "Crepe",
          "code": "GM03FBMCCS"
        },
        {
          "value": "Pointelle",
          "code": "GM03FBMCPL"
        },
        {
          "value": "Crinoline",
          "code": "GM03FBMCCT"
        },
        {
          "value": "Polycarbonate",
          "code": "GM03FBMCPM"
        },
        {
          "value": "Crochet",
          "code": "GM03FBMCCU"
        },
        {
          "value": "Ponte",
          "code": "GM03FBMCPN"
        },
        {
          "value": "Crochet/Openwork",
          "code": "GM03FBMCCV"
        },
        {
          "value": "Poplin",
          "code": "GM03FBMCPO"
        },
        {
          "value": "Croco",
          "code": "GM03FBMCCW"
        },
        {
          "value": "Porcelain",
          "code": "GM03FBMCPP"
        },
        {
          "value": "Croco Embossed",
          "code": "GM03FBMCCX"
        },
        {
          "value": "Portuguese Flannel",
          "code": "GM03FBMCPQ"
        },
        {
          "value": "Crystal",
          "code": "GM03FBMCCY"
        },
        {
          "value": "Propionate",
          "code": "GM03FBMCPR"
        },
        {
          "value": "Cubic Zirconia",
          "code": "GM03FBMCCZ"
        },
        {
          "value": "PU",
          "code": "GM03FBMCPS"
        },
        {
          "value": "Denim",
          "code": "GM03FBMCDA"
        },
        {
          "value": "Quartz",
          "code": "GM03FBMCQA"
        },
        {
          "value": "Diamond",
          "code": "GM03FBMCDB"
        },
        {
          "value": "Rattan",
          "code": "GM03FBMCRA"
        },
        {
          "value": "Dobby",
          "code": "GM03FBMCDC"
        },
        {
          "value": "Resin",
          "code": "GM03FBMCRB"
        },
        {
          "value": "Double Knit",
          "code": "GM03FBMCDD"
        },
        {
          "value": "Rhodium",
          "code": "GM03FBMCRC"
        },
        {
          "value": "Down",
          "code": "GM03FBMCDE"
        },
        {
          "value": "Ribbon",
          "code": "GM03FBMCRD"
        },
        {
          "value": "Down Fill",
          "code": "GM03FBMCDF"
        },
        {
          "value": "Rope",
          "code": "GM03FBMRE"
        },
        {
          "value": "Drop Needle",
          "code": "GM03FBMCDG"
        },
        {
          "value": "Saffiano",
          "code": "GM03FBMCSA"
        },
        {
          "value": "Earthenware",
          "code": "GM03FBMCEA"
        },
        {
          "value": "Sateen",
          "code": "GM03FBMCSB"
        },
        {
          "value": "Elephant Embossed",
          "code": "GM03FBMCEB"
        },
        {
          "value": "Satin",
          "code": "GM03FBMCSC"
        },
        {
          "value": "Enamel",
          "code": "GM03FBMCEC"
        },
        {
          "value": "Scuba",
          "code": "GM03FBMCSD"
        },
        {
          "value": "Enamel/Aluminum",
          "code": "GM03FBMCED"
        },
        {
          "value": "Seagrass",
          "code": "GM03FBMCSE"
        },
        {
          "value": "Enamel/Epoxy",
          "code": "GM03FBMCEF"
        },
        {
          "value": "Seersucker",
          "code": "GM03FBMCSF"
        },
        {
          "value": "Enamel/Iron",
          "code": "GM03FBMCEG"
        },
        {
          "value": "Sequin",
          "code": "GM03FBMCSG"
        },
        {
          "value": "Enamel/Steel",
          "code": "GM03FBMCЕН"
        },
        {
          "value": "Shantung",
          "code": "GM03FBMCSH"
        },
        {
          "value": "End-on-End",
          "code": "GM03FBMCEI"
        },
        {
          "value": "Shearling",
          "code": "GM03FBMCSI"
        },
        {
          "value": "Epoxy",
          "code": "GM03FBMCEJ"
        },
        {
          "value": "Sheeting",
          "code": "GM03FBMCSJ"
        },
        {
          "value": "Eyelet",
          "code": "GM03FBMСЕК"
        },
        {
          "value": "Shell",
          "code": "GM03FBMCSK"
        },
        {
          "value": "Fabric",
          "code": "GM03FBMCFA"
        },
        {
          "value": "Silicone",
          "code": "GM03FBMCSL"
        },
        {
          "value": "Faux Fur",
          "code": "GM03FBMCFB"
        },
        {
          "value": "Sinamay",
          "code": "GM03FBMCSM"
        },
        {
          "value": "Faux Leather",
          "code": "GM03FBMCFC"
        },
        {
          "value": "Slate",
          "code": "GM03FBMCSN"
        },
        {
          "value": "Faux Pearl",
          "code": "GM03FBMCFD"
        },
        {
          "value": "Slub",
          "code": "GM03FBMCSO"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03FBMCFE"
        },
        {
          "value": "Snake Embossed",
          "code": "GM03FBMCSP"
        },
        {
          "value": "Faux Suede",
          "code": "GM03FBMCFF"
        },
        {
          "value": "Snit",
          "code": "GM03FBMCSQ"
        },
        {
          "value": "Felt",
          "code": "GM03FBMCFG"
        },
        {
          "value": "Stainless Steel",
          "code": "GM03FBMCSR"
        },
        {
          "value": "Flannel",
          "code": "GM03FBMCFH"
        },
        {
          "value": "Steel",
          "code": "GM03FBMCST"
        },
        {
          "value": "Flat Knit",
          "code": "GM03FBMCFI"
        },
        {
          "value": "Sterling Silver",
          "code": "GM03FBMCSU"
        },
        {
          "value": "Fleece",
          "code": "GM03FBMCFJ"
        },
        {
          "value": "Stone",
          "code": "GM03FBMCSV"
        },
        {
          "value": "Foam",
          "code": "GM03FBMCFK"
        },
        {
          "value": "Stoneware",
          "code": "GM03FBMCSW"
        },
        {
          "value": "French Terry",
          "code": "GM03FBMCFL"
        },
        {
          "value": "Straw",
          "code": "GM03FBMCSX"
        },
        {
          "value": "Fresh Water Pearl",
          "code": "GM03FBMCFM"
        },
        {
          "value": "Styrofoam",
          "code": "GM03FBMCSY"
        },
        {
          "value": "Fur",
          "code": "GM03FBMCFN"
        },
        {
          "value": "Suede",
          "code": "GM03FBMCSZ"
        },
        {
          "value": "Gabardine",
          "code": "GM03FBMCGA"
        },
        {
          "value": "Sweater Yarn",
          "code": "GM03FBMCSS"
        },
        {
          "value": "Galvanized",
          "code": "GM03FBMCGB"
        },
        {
          "value": "Swiss Dot",
          "code": "GM03FBMCWI"
        },
        {
          "value": "Gauze",
          "code": "GM03FBMCGC"
        },
        {
          "value": "Synthetic",
          "code": "GM03FBMCYT"
        },
        {
          "value": "Genuine Stone",
          "code": "GM03FBMCGD"
        },
        {
          "value": "Taffeta",
          "code": "GM03FBMCТА"
        },
        {
          "value": "Georgette",
          "code": "GM03FBMCGE"
        },
        {
          "value": "Terra Cotta",
          "code": "GM03FBMCTB"
        },
        {
          "value": "Glass",
          "code": "GM03FBMCGF"
        },
        {
          "value": "Terry Cloth",
          "code": "GM03FBMCTC"
        },
        {
          "value": "Glitter",
          "code": "GM03FBMCGI"
        },
        {
          "value": "Thermal",
          "code": "GM03FBMCTD"
        },
        {
          "value": "Grenadine",
          "code": "GM03FBMCGG"
        },
        {
          "value": "Titanium",
          "code": "GM03FBMCTЕ"
        },
        {
          "value": "Grosgrain",
          "code": "GM03FBMCGH"
        },
        {
          "value": "Topaz",
          "code": "GM03FBMCTF"
        },
        {
          "value": "Hard Anodized",
          "code": "GM03FBMCHA"
        },
        {
          "value": "Tricot",
          "code": "GM03FBMCTG"
        },
        {
          "value": "Hatchi",
          "code": "GM03FBMCHB"
        },
        {
          "value": "Tri-Ply Stainless Steel",
          "code": "GM03FBMCTH"
        },
        {
          "value": "Heavy Gauge Steel",
          "code": "GM03FBMCHC"
        },
        {
          "value": "Tritan",
          "code": "GM03FBMCTI"
        },
        {
          "value": "High-Carbon Steel",
          "code": "GM03FBMCHD"
        },
        {
          "value": "Tulle",
          "code": "GM03FBMCT"
        },
        {
          "value": "Hopsack",
          "code": "GM03FBMCHE"
        },
        {
          "value": "Turquoise",
          "code": "GM03FBMCTK"
        },
        {
          "value": "Howlite",
          "code": "GM03FBMCHF"
        },
        {
          "value": "Tweed",
          "code": "GM03FBMCTL"
        },
        {
          "value": "Ironstone",
          "code": "GM03FBMCIA"
        },
        {
          "value": "Tweed/Boucle",
          "code": "GM03FBMCTM"
        },
        {
          "value": "Jacquard",
          "code": "GM03FBMCJA"
        },
        {
          "value": "Twill",
          "code": "GM03FBMCTN"
        },
        {
          "value": "Jade",
          "code": "GM03FBMCJB"
        },
        {
          "value": "Velour",
          "code": "GM03FBMCVA"
        },
        {
          "value": "Jasper",
          "code": "GM03FBMCJC"
        },
        {
          "value": "Velvet",
          "code": "GM03FBMCVB"
        },
        {
          "value": "Knit (Generic)",
          "code": "GM03FBMСKA"
        },
        {
          "value": "Velveteen",
          "code": "GM03FBMCVC"
        },
        {
          "value": "Knit Cable",
          "code": "GM03FBMCKB"
        },
        {
          "value": "Voile",
          "code": "GM03FBMCVD"
        },
        {
          "value": "Knit Fine Gauge",
          "code": "GM03FBMCKC"
        },
        {
          "value": "Waffle",
          "code": "GM03FBMCWA"
        },
        {
          "value": "Knit Intarsia",
          "code": "GM03FBMCKD"
        },
        {
          "value": "Wax",
          "code": "GM03FBMCWB"
        },
        {
          "value": "Knit Interlock",
          "code": "GM03FBMCKE"
        },
        {
          "value": "Wicker",
          "code": "GM03FBMCWC"
        },
        {
          "value": "Knit Jersey",
          "code": "GM03FBMCKF"
        },
        {
          "value": "Wire",
          "code": "GM03FBMCWD"
        },
        {
          "value": "Knit Ribbed",
          "code": "GM03FBMCKG"
        },
        {
          "value": "Wood",
          "code": "GM03FBMCWE"
        },
        {
          "value": "Knit/Woven",
          "code": "GM03FBMCKH"
        },
        {
          "value": "Wood Alternative",
          "code": "GM03FBMCWF"
        },
        {
          "value": "Knitted",
          "code": "GM03FBMCKI"
        },
        {
          "value": "Wool",
          "code": "GM03FBMCWG"
        },
        {
          "value": "Lace",
          "code": "GM03FBMCLA"
        },
        {
          "value": "Woven (generic)",
          "code": "GM03FBMCWH"
        },
        {
          "value": "Leather",
          "code": "GM03FBMCLB"
        },
        {
          "value": "Other",
          "code": "GM03FBMC99"
        },
        {
          "value": "Lizard Embossed",
          "code": "GM03FBMCLC"
        },
        {
          "value": "Magnesite",
          "code": "GM03FBMCMA"
        },
        {
          "value": "Magnet",
          "code": "GM03FBMCMB"
        },
        {
          "value": "Marble",
          "code": "GM03FBMCMC"
        }
      ]
    },
    {
      "codeListName": "Fiber",
      "values": [
        {
          "value": "Acetate",
          "code": "GM03FIBRAA"
        },
        {
          "value": "Paper",
          "code": "GM03FIBRPA"
        },
        {
          "value": "Acrylic",
          "code": "GM03FIBRAB"
        },
        {
          "value": "Pashmina",
          "code": "GM03FIBRPB"
        },
        {
          "value": "Alpaca",
          "code": "GM03FIBRAC"
        },
        {
          "value": "Pigskin",
          "code": "GM03FIBRPC"
        },
        {
          "value": "Angora",
          "code": "GM03FIBRAD"
        },
        {
          "value": "Pima Cotton",
          "code": "GM03FIBRPD"
        },
        {
          "value": "Bamboo",
          "code": "GM03FIBRBA"
        },
        {
          "value": "Pima Cotton Blend",
          "code": "GM03FIBRPE"
        },
        {
          "value": "Buffalo",
          "code": "GM03FIBRBB"
        },
        {
          "value": "Polyester",
          "code": "GM03FIBRPF"
        },
        {
          "value": "Cashmere",
          "code": "GM03FIBRCA"
        },
        {
          "value": "Polyester Blend",
          "code": "GM03FIBRPG"
        },
        {
          "value": "Cotton",
          "code": "GM03FIBRCB"
        },
        {
          "value": "Polyester/Cotton",
          "code": "GM03FIBRPH"
        },
        {
          "value": "Cotton Blend",
          "code": "GM03FIBRCC"
        },
        {
          "value": "Polyester/Elastane",
          "code": "GM03FIBRPI"
        },
        {
          "value": "Cotton/Cashmere",
          "code": "GM03FIBRCD"
        },
        {
          "value": "Polyester/Modal",
          "code": "GM03FIBRPJ"
        },
        {
          "value": "Cotton/Elastane",
          "code": "GM03FIBRCE"
        },
        {
          "value": "Polyester/Nylon",
          "code": "GM03FIBRPK"
        },
        {
          "value": "Cotton/Lyocell",
          "code": "GM03FIBRCF"
        },
        {
          "value": "Polyester/Rayon",
          "code": "GM03FIBRPL"
        },
        {
          "value": "Cotton/Polyester",
          "code": "GM03FIBRCG"
        },
        {
          "value": "Polypropylene",
          "code": "GM03FIBRPM"
        },
        {
          "value": "Cotton/Polyester/Elastane",
          "code": "GM03FIBRCH"
        },
        {
          "value": "Polyurethane",
          "code": "GM03FIBRPN"
        },
        {
          "value": "Cotton/Rayon",
          "code": "GM03FIBRCI"
        },
        {
          "value": "PVC",
          "code": "GM03FIBRPO"
        },
        {
          "value": "Cotton/Silk",
          "code": "GM03FIBRCJ"
        },
        {
          "value": "Qmiich",
          "code": "GM03FIBRQM"
        },
        {
          "value": "Cow",
          "code": "GM03FIBRCK"
        },
        {
          "value": "Raffia",
          "code": "GM03FIBRRA"
        },
        {
          "value": "Deer",
          "code": "GM03FIBRDA"
        },
        {
          "value": "Ramie",
          "code": "GM03FIBRRB"
        },
        {
          "value": "Egyptian Cotton",
          "code": "GM03FIBREA"
        },
        {
          "value": "Rayon",
          "code": "GM03FIBRRC"
        },
        {
          "value": "Elastane",
          "code": "GM03FIBREB"
        },
        {
          "value": "Rayon (Viscose)",
          "code": "GM03FIBRRD"
        },
        {
          "value": "Flax",
          "code": "GM03FIBRFA"
        },
        {
          "value": "Rayon/Elastane",
          "code": "GM03FIBRRE"
        },
        {
          "value": "Goat",
          "code": "GM03FIBRGA"
        },
        {
          "value": "Rayon/Nylon",
          "code": "GM03FIBRRF"
        },
        {
          "value": "Hair On Hide",
          "code": "GM03FIBRHA"
        },
        {
          "value": "Rayon/Nylon/Elastane",
          "code": "GM03FIBRRG"
        },
        {
          "value": "Haircalf",
          "code": "GM03FIBRHB"
        },
        {
          "value": "Rhino",
          "code": "GM03FIBRRH"
        },
        {
          "value": "Hemp",
          "code": "GM03FIBRHC"
        },
        {
          "value": "Rubber",
          "code": "GM03FIBRRI"
        },
        {
          "value": "Horse Hair",
          "code": "GM03FIBRHD"
        },
        {
          "value": "Sheepskin",
          "code": "GM03FIBRSA"
        },
        {
          "value": "Jute",
          "code": "GM03FIBRJA"
        },
        {
          "value": "Silk",
          "code": "GM03FIBRSB"
        },
        {
          "value": "Lamb",
          "code": "GM03FIBRLA"
        },
        {
          "value": "Sisal",
          "code": "GM03FIBRSC"
        },
        {
          "value": "Lambs Wool/Nylon",
          "code": "GM03FIBRLB"
        },
        {
          "value": "Snake",
          "code": "GM03FIBRSD"
        },
        {
          "value": "Leather",
          "code": "GM03FIBRLC"
        },
        {
          "value": "Supplex",
          "code": "GM03FIBRSE"
        },
        {
          "value": "Leather/Nylon",
          "code": "GM03FIBRLD"
        },
        {
          "value": "Supplex/Elastane",
          "code": "GM03FIBRSF"
        },
        {
          "value": "Linen",
          "code": "GM03FIBRLE"
        },
        {
          "value": "Turkish Cotton",
          "code": "GM03FIBRTA"
        },
        {
          "value": "Linen/Cotton",
          "code": "GM03FIBRLF"
        },
        {
          "value": "UGG Wool",
          "code": "GM03FIBRUA"
        },
        {
          "value": "Linen/Silk",
          "code": "GM03FIBRLG"
        },
        {
          "value": "Vinyl",
          "code": "GM03FIBRVA"
        },
        {
          "value": "Lurex",
          "code": "GM03FIBRLH"
        },
        {
          "value": "Viscose",
          "code": "GM03FIBRVB"
        },
        {
          "value": "Lyocell",
          "code": "GM03FIBRLI"
        },
        {
          "value": "Wool",
          "code": "GM03FIBRWA"
        },
        {
          "value": "Metallic Yarm",
          "code": "GM03FIBRMA"
        },
        {
          "value": "Wool Blend",
          "code": "GM03FIBRWB"
        },
        {
          "value": "Microcotton",
          "code": "GM03FIBRMB"
        },
        {
          "value": "Wool/Bamboo",
          "code": "GM03FIBRWC"
        },
        {
          "value": "Microfiber",
          "code": "GM03FIBRMC"
        },
        {
          "value": "Wool/Cashmere",
          "code": "GM03FIBRWD"
        },
        {
          "value": "Modal",
          "code": "GM03FIBRMD"
        },
        {
          "value": "Wool/Elastane",
          "code": "GM03FIBRWE"
        },
        {
          "value": "Modal/Elastane",
          "code": "GM03FIBRME"
        },
        {
          "value": "Wool/Nylon/Cashmere",
          "code": "GM03FIBRWF"
        },
        {
          "value": "Mohair",
          "code": "GM03FIBRMF"
        },
        {
          "value": "Wool/Silk",
          "code": "GM03FIBRWG"
        },
        {
          "value": "Neoprene",
          "code": "GM03FIBRNA"
        },
        {
          "value": "Other",
          "code": "GM03FIBR99"
        },
        {
          "value": "Nylon",
          "code": "GM03FIBRNB"
        },
        {
          "value": "Nylon/Elastane",
          "code": "GM03FIBRNC"
        },
        {
          "value": "Olefin",
          "code": "GM03FIBROA"
        }
      ]
    },
    {
      "codeListName": "Fur Animal Name",
      "values": [
        {
          "value": "Australian Brushtail Possum",
          "code": "GM03FANMAP"
        },
        {
          "value": "Otter",
          "code": "GM03FANMOU"
        },
        {
          "value": "Beaver",
          "code": "GM03FANMBV"
        },
        {
          "value": "Pony Hair",
          "code": "GM03FANMPH"
        },
        {
          "value": "Calf Hair",
          "code": "GM03FANMCH"
        },
        {
          "value": "Rabbit",
          "code": "GM03FANMRI"
        },
        {
          "value": "Fox",
          "code": "GM03FANMFX"
        },
        {
          "value": "Raccoon",
          "code": "GM03FANMRC"
        },
        {
          "value": "Golden Jackal",
          "code": "GM03FANMGJ"
        },
        {
          "value": "Sable",
          "code": "GM03FANMSG"
        },
        {
          "value": "Grey Wolf",
          "code": "GM03FANMGW"
        },
        {
          "value": "Skunk",
          "code": "GM03FANMSK"
        },
        {
          "value": "Marten",
          "code": "GM03FANMΜΑ"
        },
        {
          "value": "Other Fur Animal*",
          "code": "GM04FANM99"
        },
        {
          "value": "Mink",
          "code": "GM03FANMMK"
        }
      ]
    },
    {
      "codeListName": "Fur Treatment",
      "values": [
        {
          "value": "Artificially Colored",
          "code": "GM03FTMTAC"
        },
        {
          "value": "Natural (untreated)",
          "code": "GM03FTMTΝΑ"
        },
        {
          "value": "Bleached",
          "code": "GM03FTMTBM"
        },
        {
          "value": "Painted",
          "code": "GM03FTMTPT"
        },
        {
          "value": "Dyed",
          "code": "GM03FTMTDY"
        },
        {
          "value": "Other Fur Treatment",
          "code": "GM04FTMT99"
        }
      ]
    },
    {
      "codeListName": "Gauge",
      "values": [
        {
          "value": "16lbs Dozen",
          "code": "GM03GAUGSX"
        },
        {
          "value": "Opaque",
          "code": "GM03GAUGPQ"
        },
        {
          "value": "Fine",
          "code": "GM03GAUGFI"
        },
        {
          "value": "Semi-Opaque",
          "code": "GM03GAUGSE"
        },
        {
          "value": "Heavy",
          "code": "GM03GAUGHV"
        },
        {
          "value": "Sheer",
          "code": "GM03GAUGSH"
        },
        {
          "value": "Heavyweight",
          "code": "GM03GAUGHW"
        },
        {
          "value": "Super Opaque",
          "code": "GM03GAUGSU"
        },
        {
          "value": "Light",
          "code": "GM03GAUGLI"
        },
        {
          "value": "Other",
          "code": "GM04GAUG99"
        },
        {
          "value": "Medium",
          "code": "GM03GAUGMD"
        }
      ]
    },
    {
      "codeListName": "Gender",
      "values": [
        {
          "value": "Female",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Gender Neutral",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        }
      ]
    },
    {
      "codeListName": "Length Description",
      "values": [
        {
          "value": "Above Knee",
          "code": "GM03LNTHAK"
        },
        {
          "value": "Midi Short",
          "code": "GM03LNTHMS"
        },
        {
          "value": "Ankle",
          "code": "GM03LNTHAN"
        },
        {
          "value": "Mini",
          "code": "GM03LNTΗΜΝ"
        },
        {
          "value": "Basketball",
          "code": "GM03LNTHΒΑ"
        },
        {
          "value": "Regular/Full",
          "code": "GM03LNTHRF"
        },
        {
          "value": "Below Knee",
          "code": "GM03LNTHBK"
        },
        {
          "value": "Short",
          "code": "GM03LNTHST"
        },
        {
          "value": "Capri/Calf",
          "code": "GM03LNTHCC"
        },
        {
          "value": "Skimmer",
          "code": "GM03LNTHSK"
        },
        {
          "value": "Car",
          "code": "GM03LNTHCA"
        },
        {
          "value": "Tall",
          "code": "GM03LNTHΤΑ"
        },
        {
          "value": "Cropped",
          "code": "GM03LNTHCR"
        },
        {
          "value": "Tea/Ballet",
          "code": "GM03LNTHTB"
        },
        {
          "value": "Extra Long",
          "code": "GM03LNTHEL"
        },
        {
          "value": "Tunic",
          "code": "GM03LNTHTU"
        },
        {
          "value": "High-Low",
          "code": "GM03LNTHHL"
        },
        {
          "value": "Waist",
          "code": "GM03LNTHWA"
        },
        {
          "value": "Knee",
          "code": "GM03LNTHHKN"
        },
        {
          "value": "Walker",
          "code": "GM03LNTHWK"
        },
        {
          "value": "Long",
          "code": "GM03LNTHLN"
        },
        {
          "value": "Waltz",
          "code": "GM03LNTHWZ"
        },
        {
          "value": "Maxi",
          "code": "GM03LNTHMX"
        },
        {
          "value": "Other",
          "code": "GM04LNTH99"
        },
        {
          "value": "Mid",
          "code": "GM03LNTHMD"
        }
      ]
    },
    {
      "codeListName": "Lined",
      "values": [
        {
          "value": "Fully Lined",
          "code": "GM03LINDFL"
        },
        {
          "value": "Other",
          "code": "GM04LIND99"
        },
        {
          "value": "Semi-Lined",
          "code": "GM03LINDSL"
        }
      ]
    },
    {
      "codeListName": "Lining Material",
      "values": [
        {
          "value": "Antimicrobial",
          "code": "GM03LIMTAN"
        },
        {
          "value": "Nylon",
          "code": "GM03LIMTNY"
        },
        {
          "value": "Cotton",
          "code": "GM03LIMTCT"
        },
        {
          "value": "Organic Material",
          "code": "GM03LIMTOM"
        },
        {
          "value": "Fabric",
          "code": "GM03LIMTFD"
        },
        {
          "value": "Polyester",
          "code": "GM03LIMTPR"
        },
        {
          "value": "Faux Fur",
          "code": "GM03LIMTFB"
        },
        {
          "value": "PU",
          "code": "GM03LIMTPU"
        },
        {
          "value": "Faux Leather",
          "code": "GM03LIMTFL"
        },
        {
          "value": "PVC",
          "code": "GM03LIMTPV"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03LIMTFS"
        },
        {
          "value": "Quilted",
          "code": "GM03LIMTQT"
        },
        {
          "value": "Fleece",
          "code": "GM03LIMTFC"
        },
        {
          "value": "Shearling Lined",
          "code": "GM03LIMTSL"
        },
        {
          "value": "Gel",
          "code": "GM03LIMTGE"
        },
        {
          "value": "Sherpa",
          "code": "GM03LIMTSP"
        },
        {
          "value": "Leather",
          "code": "GM03LIMTLE"
        },
        {
          "value": "Straw",
          "code": "GM03LIMTST"
        },
        {
          "value": "Logo Lining",
          "code": "GM03LIMTLL"
        },
        {
          "value": "Synthetic",
          "code": "GM03LIMTSY"
        },
        {
          "value": "Memory Foam",
          "code": "GM03LIMTMF"
        },
        {
          "value": "Taffeta",
          "code": "GM03LIMTTA"
        },
        {
          "value": "Mesh",
          "code": "GM03LIMTME"
        },
        {
          "value": "Other",
          "code": "GM04LIMT99"
        }
      ]
    },
    {
      "codeListName": "Sleeve Type",
      "values": [
        {
          "value": "1/2 Sleeve",
          "code": "GM03SLVTHT"
        },
        {
          "value": "Roll-Tab (Long to elbow/short)",
          "code": "GM03SLVTRT"
        },
        {
          "value": "1/4 sleeve",
          "code": "GM03SLVTQS"
        },
        {
          "value": "Short",
          "code": "GM03SLVTST"
        },
        {
          "value": "3/4 Sleeve",
          "code": "GM03SLVTTT"
        },
        {
          "value": "Sleeveless",
          "code": "GM03SLVTS4"
        },
        {
          "value": "Cap",
          "code": "GM03SLVTCS"
        },
        {
          "value": "Spaghetti Strap",
          "code": "GM03SLVTSI"
        },
        {
          "value": "Elbow",
          "code": "GM03SLVTES"
        },
        {
          "value": "Other Sleeve Type*",
          "code": "GM04SLVT99"
        },
        {
          "value": "Long",
          "code": "GM03SLVTLO"
        },
        {
          "value": "Roll-Tab (3/4 to short)",
          "code": "GM03SLVTTR"
        }
      ]
    },
    {
      "codeListName": "Coat/Jacket Type",
      "values": [
        {
          "value": "Anorak",
          "code": "GM03COATAN"
        },
        {
          "value": "Pant/Car Coat",
          "code": "GM03COATPC"
        },
        {
          "value": "Barn Coat",
          "code": "GM03COATBC"
        },
        {
          "value": "Parka",
          "code": "GM03COATΡΑ"
        },
        {
          "value": "Blazer",
          "code": "GM03COAТВА"
        },
        {
          "value": "Peacoat",
          "code": "GM03COAΤΡΕ"
        },
        {
          "value": "Bolero",
          "code": "GM03COATBL"
        },
        {
          "value": "Poncho",
          "code": "GM03COAΤΡΝ"
        },
        {
          "value": "Bomber",
          "code": "GM03COATBM"
        },
        {
          "value": "Puffer",
          "code": "GM03COATPU"
        },
        {
          "value": "Cape",
          "code": "GM03COATCP"
        },
        {
          "value": "Sportscoat",
          "code": "GM03COATSP"
        },
        {
          "value": "Cardigan",
          "code": "GM03COATCA"
        },
        {
          "value": "Swing Coat",
          "code": "GM03COATSC"
        },
        {
          "value": "Field Jacket",
          "code": "GM03COATFK"
        },
        {
          "value": "Trench",
          "code": "GM03COATTR"
        },
        {
          "value": "Fit & Flare",
          "code": "GM03COATFF"
        },
        {
          "value": "Trucker",
          "code": "GM03COATTU"
        },
        {
          "value": "Hoodie",
          "code": "GM03COATHO"
        },
        {
          "value": "Vest",
          "code": "GM03COATVE"
        },
        {
          "value": "Military",
          "code": "GM03COATMI"
        },
        {
          "value": "Windbreaker",
          "code": "GM03COATWI"
        },
        {
          "value": "Motorcycle",
          "code": "GM03COATMT"
        },
        {
          "value": "Wrap",
          "code": "GM03COATWR"
        },
        {
          "value": "Overcoat",
          "code": "GM03COATOC"
        },
        {
          "value": "Other",
          "code": "GM04COAT99"
        }
      ]
    },
    {
      "codeListName": "Water Repellent",
      "values": [
        {
          "value": "Waterproof",
          "code": "ZZ03WATRPF"
        },
        {
          "value": "Other",
          "code": "ZZ04WATR99"
        },
        {
          "value": "Water Resistant",
          "code": "ZZ03WATRRE"
        }
      ]
    },
    {
      "codeListName": "Sweater/Pullover Type",
      "values": [
        {
          "value": "Babydoll",
          "code": "GM03SWPUBA"
        },
        {
          "value": "Hoodie",
          "code": "GM03SWPUHD"
        },
        {
          "value": "Blouse",
          "code": "GM03SWPUBL"
        },
        {
          "value": "Peasant",
          "code": "GM03SWPUPE"
        },
        {
          "value": "Box Top",
          "code": "GM03SWPUBT"
        },
        {
          "value": "Peplum",
          "code": "GM03SWPUPP"
        },
        {
          "value": "Bustier/Bra Top",
          "code": "GM03SWPUBB"
        },
        {
          "value": "Pullover",
          "code": "GM03SWPUPU"
        },
        {
          "value": "Button Front",
          "code": "GM03SWPUBF"
        },
        {
          "value": "Racerback",
          "code": "GM03SWPURA"
        },
        {
          "value": "Cami",
          "code": "GM03SWPUCA"
        },
        {
          "value": "Sweater",
          "code": "GM03SWPUSW"
        },
        {
          "value": "Camisole",
          "code": "GM03SWPUCM"
        },
        {
          "value": "Sweatshirt",
          "code": "GM03SWPUSS"
        },
        {
          "value": "Cardigan",
          "code": "GM03SWPUCR"
        },
        {
          "value": "Tank",
          "code": "GM03SWPUTA"
        },
        {
          "value": "Cocoon",
          "code": "GM03SWPUCC"
        },
        {
          "value": "T-Shirt",
          "code": "GM03SWPUTS"
        },
        {
          "value": "Dress Shirt",
          "code": "GM03SWPUDS"
        },
        {
          "value": "Tunic",
          "code": "GM03SWPUTU"
        },
        {
          "value": "Drop Waist",
          "code": "GM03SWPUDW"
        },
        {
          "value": "Vest",
          "code": "GM03SWPUVE"
        },
        {
          "value": "Faux Wrap",
          "code": "GM03SWPUFW"
        },
        {
          "value": "Wrap",
          "code": "GM03SWPUWR"
        },
        {
          "value": "Flyaway/Apron",
          "code": "GM03SWPUFA"
        },
        {
          "value": "Other",
          "code": "GM04SWPU99"
        }
      ]
    },
    {
      "codeListName": "Leg Type",
      "values": [
        {
          "value": "Boot Cut",
          "code": "GM03LGTYBC"
        },
        {
          "value": "Tapered",
          "code": "GM03LGTYΤΑ"
        },
        {
          "value": "Flare Leg",
          "code": "GM03LGTYFL"
        },
        {
          "value": "Wide Leg",
          "code": "GM03LGTYWI"
        },
        {
          "value": "Skinny Leg",
          "code": "GM03LGTYSK"
        },
        {
          "value": "Other",
          "code": "GM04LGTY99"
        },
        {
          "value": "Straight Leg",
          "code": "GM03LGTYST"
        }
      ]
    },
    {
      "codeListName": "Pants/Shorts Type",
      "values": [
        {
          "value": "5 Pocket/Jean",
          "code": "GM03PTSHFJ"
        },
        {
          "value": "Gaucho/Palazzo",
          "code": "GM03PTSHGP"
        },
        {
          "value": "Bermuda",
          "code": "GM03PTSHBE"
        },
        {
          "value": "Jogger",
          "code": "GM03PTSHJG"
        },
        {
          "value": "Boxer",
          "code": "GM03PTSHBX"
        },
        {
          "value": "Leggings",
          "code": "GM03PTSHLE"
        },
        {
          "value": "Capri",
          "code": "GM03PTSHCA"
        },
        {
          "value": "Pleated",
          "code": "GM03PTSHPL"
        },
        {
          "value": "Cargo",
          "code": "GM03PTSHCG"
        },
        {
          "value": "Skort",
          "code": "GM03PTSHSK"
        },
        {
          "value": "Carpenter",
          "code": "GM03PTSHCP"
        },
        {
          "value": "Sweatpant",
          "code": "GM03PTSHSW"
        },
        {
          "value": "Chino",
          "code": "GM03PTSHCH"
        },
        {
          "value": "Tap",
          "code": "GM03PTSHTΑ"
        },
        {
          "value": "Culotte",
          "code": "GM03PTSHCL"
        },
        {
          "value": "Track",
          "code": "GM03PTSHTR"
        },
        {
          "value": "Cut Off",
          "code": "GM03PTSHCT"
        },
        {
          "value": "Trouser",
          "code": "GM03PTSHTU"
        },
        {
          "value": "Flat Front",
          "code": "GM03PTSHFF"
        },
        {
          "value": "Other",
          "code": "GM04PTSH99"
        }
      ]
    },
    {
      "codeListName": "Waist Rise",
      "values": [
        {
          "value": "Classic",
          "code": "GM03WSDRCL"
        },
        {
          "value": "Mid",
          "code": "GM03WSDRMI"
        },
        {
          "value": "High",
          "code": "GM03WSDRHI"
        },
        {
          "value": "Other",
          "code": "GM04WSDR99"
        },
        {
          "value": "Low",
          "code": "GM03WSDRLW"
        }
      ]
    },
    {
      "codeListName": "Waistband Type",
      "values": [
        {
          "value": "Band Roll",
          "code": "GM03WBTPBR"
        },
        {
          "value": "Knit",
          "code": "GM03WBTPKN"
        },
        {
          "value": "Belt Hook",
          "code": "GM03WBTРВH"
        },
        {
          "value": "Maternity",
          "code": "GM03WBTPMT"
        },
        {
          "value": "Drawstring",
          "code": "GM03WBTPDS"
        },
        {
          "value": "D-ring",
          "code": "GM03WBTPDR"
        },
        {
          "value": "Rigid",
          "code": "GM03WBTPRG"
        },
        {
          "value": "Expander",
          "code": "GM03WBTРЕX"
        },
        {
          "value": "Self-Fabric Underwear",
          "code": "GM03WBTPSF"
        },
        {
          "value": "Full Elastic",
          "code": "GM03WBTPFE"
        },
        {
          "value": "Side Elastic",
          "code": "GM03WBTPSE"
        },
        {
          "value": "Half Elastic",
          "code": "GM03WBTPHE"
        },
        {
          "value": "Side Tab",
          "code": "GM03WBTPST"
        },
        {
          "value": "Hook and Loop",
          "code": "GM03WBTPVE"
        },
        {
          "value": "Stretch Elastic",
          "code": "GM03WBTPSR"
        },
        {
          "value": "Ino-Flex",
          "code": "GM03WBTPIF"
        },
        {
          "value": "Other",
          "code": "GM04WBTP99"
        },
        {
          "value": "Inside Adjustable",
          "code": "GM03WBTΡIA"
        }
      ]
    },
    {
      "codeListName": "Skirt Type",
      "values": [
        {
          "value": "A-line",
          "code": "GM03SKRTAL"
        },
        {
          "value": "Pencil",
          "code": "GM03SKRTPE"
        },
        {
          "value": "Circular",
          "code": "GM03SKRTCI"
        },
        {
          "value": "Skort",
          "code": "GM03SKRTSK"
        },
        {
          "value": "Faux Wrap",
          "code": "GM03SKRTFW"
        },
        {
          "value": "Straight",
          "code": "GM03SKRTST"
        },
        {
          "value": "Flared",
          "code": "GM03SKRTFL"
        },
        {
          "value": "Tiered",
          "code": "GM03SKRTTI"
        },
        {
          "value": "Full",
          "code": "GM03SKRTFU"
        },
        {
          "value": "Wrap",
          "code": "GM03SKRTWR"
        },
        {
          "value": "Mermaid/Trumpet",
          "code": "GM03SKRTMT"
        },
        {
          "value": "Other",
          "code": "GM04SKRT99"
        }
      ]
    },
    {
      "codeListName": "Sleepwear Type",
      "values": [
        {
          "value": "Bridal",
          "code": "GM03SLPTBR"
        },
        {
          "value": "PJ Set",
          "code": "GM03SLPTPJ"
        },
        {
          "value": "Caftan",
          "code": "GM03SLPTСA"
        },
        {
          "value": "Robe",
          "code": "GM03SLPTRO"
        },
        {
          "value": "Chemise",
          "code": "GM03SLPTCH"
        },
        {
          "value": "Sleep Pant",
          "code": "GM03SLPTSP"
        },
        {
          "value": "Gown",
          "code": "GM03SLPTGW"
        },
        {
          "value": "Sleep Shirt",
          "code": "GM03SLPTSH"
        },
        {
          "value": "Loungewear",
          "code": "GM03SLPTLN"
        },
        {
          "value": "Sleep Short",
          "code": "GM03SLPTSO"
        },
        {
          "value": "Maternity",
          "code": "GM03SLPTMA"
        },
        {
          "value": "Sleep Top",
          "code": "GM03SLPTST"
        },
        {
          "value": "One Piece",
          "code": "GM03SLPTOP"
        },
        {
          "value": "Other",
          "code": "GM03SLPT99"
        }
      ]
    },
    {
      "codeListName": "Swim Cover Up Type",
      "values": [
        {
          "value": "Beach Shirt",
          "code": "GM03SWCTBS"
        },
        {
          "value": "Pareo",
          "code": "GM03SWCТРА"
        },
        {
          "value": "Bottom",
          "code": "GM03SWCTВО"
        },
        {
          "value": "Sun Dress",
          "code": "GM03SWCTSD"
        },
        {
          "value": "Caftan",
          "code": "GM03SWCTCA"
        },
        {
          "value": "Top",
          "code": "GM03SWCTTO"
        },
        {
          "value": "Jumpsuit/Romper",
          "code": "GM03SWCTJU"
        },
        {
          "value": "Tunic",
          "code": "GM03SWCTTU"
        },
        {
          "value": "Kimono",
          "code": "GM03SWCTKІ"
        },
        {
          "value": "Other",
          "code": "GM04SWCT99"
        },
        {
          "value": "Maxi Dress",
          "code": "GM03SWCTMD"
        }
      ]
    },
    {
      "codeListName": "Adjustable Strap",
      "values": [
        {
          "value": "Fully Adjustable",
          "code": "GM03ADSTFA"
        },
        {
          "value": "Partially Adjustable",
          "code": "GM03ADSTPA"
        },
        {
          "value": "Non-Adjustable",
          "code": "GM03ADSTNA"
        },
        {
          "value": "Other",
          "code": "GM03ADST99"
        }
      ]
    },
    {
      "codeListName": "Panty Back Coverage",
      "values": [
        {
          "value": "Cheeky",
          "code": "GM03PNBCCH"
        },
        {
          "value": "Medium",
          "code": "GM03PNBCMD"
        },
        {
          "value": "Full",
          "code": "GM03PNBCFL"
        },
        {
          "value": "Other",
          "code": "GM03PNBC99"
        }
      ]
    },
    {
      "codeListName": "Swim Bottom Type",
      "values": [
        {
          "value": "Banded",
          "code": "GM03SWBТВА"
        },
        {
          "value": "Skirted",
          "code": "GM03SWBTSK"
        },
        {
          "value": "Boardshort",
          "code": "GM03SWBТВО"
        },
        {
          "value": "Tab Side",
          "code": "GM03SWBTTS"
        },
        {
          "value": "Brief",
          "code": "GM03SWBTBR"
        },
        {
          "value": "Tie Side",
          "code": "GM03SWBTTI"
        },
        {
          "value": "High Waist",
          "code": "GM03SWBTHW"
        },
        {
          "value": "Trunk",
          "code": "GM03SWBTTR"
        },
        {
          "value": "Hipster",
          "code": "GM03SWBTHI"
        },
        {
          "value": "Other",
          "code": "GM04SWBT99"
        }
      ]
    },
    {
      "codeListName": "Swim Top Type",
      "values": [
        {
          "value": "Bandeau",
          "code": "GM03SWTTBA"
        },
        {
          "value": "One Shoulder",
          "code": "GM03SWTTON"
        },
        {
          "value": "Bandini",
          "code": "GM03SWTTBN"
        },
        {
          "value": "Rashguard",
          "code": "GM03SWTTRA"
        },
        {
          "value": "Bralette",
          "code": "GM03SWTTBR"
        },
        {
          "value": "Tankini",
          "code": "GM03SWTTTA"
        },
        {
          "value": "Flutter",
          "code": "GM03SWTTFL"
        },
        {
          "value": "Triangle",
          "code": "GM03SWTTTR"
        },
        {
          "value": "Halter",
          "code": "GM03SWTTHA"
        },
        {
          "value": "Underwire",
          "code": "GM03SWTTUN"
        },
        {
          "value": "High Neck",
          "code": "GM03SWTTΗΝ"
        },
        {
          "value": "Other",
          "code": "GM04SWTT99"
        },
        {
          "value": "Off Shoulder",
          "code": "GM03SWTTOF"
        }
      ]
    },
    {
      "codeListName": "Swim One-Piece Type",
      "values": [
        {
          "value": "Bandeau",
          "code": "GM03SWOТВА"
        },
        {
          "value": "Scoop Neck",
          "code": "GM03SWOTSC"
        },
        {
          "value": "Halter",
          "code": "GM03SWOTHA"
        },
        {
          "value": "Square Neck",
          "code": "GM03SWOTSQ"
        },
        {
          "value": "High Neck",
          "code": "GM03SWOТHΝ"
        },
        {
          "value": "Surplice",
          "code": "GM03SWOTSU"
        },
        {
          "value": "Monokini",
          "code": "GM03SWOTMO"
        },
        {
          "value": "Swim Dress",
          "code": "GM03SWOTSW"
        },
        {
          "value": "Off-Shoulder",
          "code": "GM03SWOTOF"
        },
        {
          "value": "Tank",
          "code": "GM03SWOTTA"
        },
        {
          "value": "One Shoulder",
          "code": "GM03SWOTON"
        },
        {
          "value": "Underwire",
          "code": "GM03SWOTUN"
        },
        {
          "value": "Plunge",
          "code": "GM03SWOTPL"
        },
        {
          "value": "V-neck",
          "code": "GM03SWOTVN"
        },
        {
          "value": "Rashguard",
          "code": "GM03SWOTRA"
        },
        {
          "value": "Other",
          "code": "GM04SWOT09"
        }
      ]
    },
    {
      "codeListName": "Corporate/Philanthropic Certifications",
      "values": [
        {
          "value": "1% for the Planet",
          "code": "GM03COPHPL"
        },
        {
          "value": "NATURETEXTIL IVN certified BEST",
          "code": "GM03COPHΝΑ"
        },
        {
          "value": "BCorp Certified",
          "code": "GM03COPHBC"
        },
        {
          "value": "Nordic Swan",
          "code": "GM03COPHNS"
        },
        {
          "value": "Blue Angel",
          "code": "GM03COPΗΒΑ"
        },
        {
          "value": "Other",
          "code": "GM04COPH99"
        },
        {
          "value": "EU Ecolabel",
          "code": "GM03COPHEU"
        }
      ]
    },
    {
      "codeListName": "Bra Band Type",
      "values": [
        {
          "value": "Smoothing Back",
          "code": "GM03BRBNSB"
        },
        {
          "value": "Toed In",
          "code": "GM03BRBNTI"
        },
        {
          "value": "Smoothing Side",
          "code": "GM03BRBNSS"
        },
        {
          "value": "U Back/Leotard Back",
          "code": "GM03BRBNUB"
        },
        {
          "value": "Straight Back",
          "code": "GM03BRBNST"
        },
        {
          "value": "Other",
          "code": "GM03BRBN99"
        },
        {
          "value": "T-back",
          "code": "GM03BRBNTB"
        }
      ]
    },
    {
      "codeListName": "Bra Bust Type",
      "values": [
        {
          "value": "Average",
          "code": "GM03BRBTAV"
        },
        {
          "value": "Shallow",
          "code": "GM03BRBTSH"
        },
        {
          "value": "Full Figured",
          "code": "GM03BRBTFF"
        },
        {
          "value": "Other",
          "code": "GM03BRBT99"
        }
      ]
    },
    {
      "codeListName": "Bra Cup Coverage",
      "values": [
        {
          "value": "3/4",
          "code": "GM03BRCC34"
        },
        {
          "value": "Plunge",
          "code": "GM03BRCCPL"
        },
        {
          "value": "Balconette",
          "code": "GM03BRCСВА"
        },
        {
          "value": "Triangle",
          "code": "GM03BRCCTR"
        },
        {
          "value": "Demi",
          "code": "GM03BRCCDE"
        },
        {
          "value": "Other",
          "code": "GM03BRCC99"
        },
        {
          "value": "Full",
          "code": "GM03BRCCFL"
        }
      ]
    },
    {
      "codeListName": "Bra Cup Type",
      "values": [
        {
          "value": "Contour (padded cup)",
          "code": "GM03BRCTCO"
        },
        {
          "value": "Molded (no padded cup)",
          "code": "GM03BRCТΜΟ"
        },
        {
          "value": "Cut & Sewn",
          "code": "GM03BRCTCU"
        },
        {
          "value": "Push-Up",
          "code": "GM03BRCTPU"
        },
        {
          "value": "Gel Padding",
          "code": "GM03BRCTGP"
        },
        {
          "value": "Seamless",
          "code": "GM03BRCTSE"
        },
        {
          "value": "Liquid Padding",
          "code": "GM03BRCTLP"
        },
        {
          "value": "Spacer",
          "code": "GM03BRCTSP"
        },
        {
          "value": "Memory Foam",
          "code": "GM03BRCTMF"
        },
        {
          "value": "Other",
          "code": "GM03BRCT99"
        }
      ]
    },
    {
      "codeListName": "Bra Impact Level",
      "values": [
        {
          "value": "High",
          "code": "GM03BRILHI"
        },
        {
          "value": "Medium",
          "code": "GM03BRILMD"
        },
        {
          "value": "High +",
          "code": "GM03BRILHP"
        },
        {
          "value": "Other",
          "code": "GM03BRIL99"
        },
        {
          "value": "Low",
          "code": "GM03BRILLO"
        }
      ]
    },
    {
      "codeListName": "Bra Padding",
      "values": [
        {
          "value": "Integrated Padding",
          "code": "GM03BRPDIP"
        },
        {
          "value": "Other",
          "code": "GM03BRPD99"
        },
        {
          "value": "Removable Padding/Pocketed",
          "code": "GM03BRPDRP"
        }
      ]
    },
    {
      "codeListName": "Bra Specialty Type",
      "values": [
        {
          "value": "Backless",
          "code": "GM03BRSTBL"
        },
        {
          "value": "Post-Surgical",
          "code": "GM03BRSTPS"
        },
        {
          "value": "Mastectomy",
          "code": "GM03BRSTMA"
        },
        {
          "value": "Sleep",
          "code": "GM03BRSTSL"
        },
        {
          "value": "Maternity/Nursing",
          "code": "GM03BRSTMT"
        },
        {
          "value": "Other",
          "code": "GM03BRST99"
        }
      ]
    },
    {
      "codeListName": "Bra Type",
      "values": [
        {
          "value": "Bandeau",
          "code": "GM03BRTYBN"
        },
        {
          "value": "Minimizer",
          "code": "GM03BRTYΜΝ"
        },
        {
          "value": "Bralette",
          "code": "GM03BRTYBR"
        },
        {
          "value": "Sport",
          "code": "GM03BRTYSP"
        },
        {
          "value": "Bustier",
          "code": "GM03BRTYBU"
        },
        {
          "value": "Standard/Conventional",
          "code": "GM03BRTYSC"
        },
        {
          "value": "Convertible",
          "code": "GM03BRTYCN"
        },
        {
          "value": "Strapless",
          "code": "GM03BRTYST"
        },
        {
          "value": "Corset",
          "code": "GM03BRTYCO"
        },
        {
          "value": "Training",
          "code": "GM03BRTYTR"
        },
        {
          "value": "Halter",
          "code": "GM03BRTYНА"
        },
        {
          "value": "T-Shirt",
          "code": "GM03BRTYTS"
        },
        {
          "value": "Long Line",
          "code": "GM03BRTYLL"
        },
        {
          "value": "Other",
          "code": "GM03BRTY99"
        }
      ]
    },
    {
      "codeListName": "Shapewear Type",
      "values": [
        {
          "value": "Body Shaper (to the knee)",
          "code": "GM03SWRTBS"
        },
        {
          "value": "Open Bust Shaper",
          "code": "GM03SWRTOB"
        },
        {
          "value": "Bodysuit (to the ankle)",
          "code": "GM03SWRTBU"
        },
        {
          "value": "Shaping Slip",
          "code": "GM03SWRTSH"
        },
        {
          "value": "Camisole/Tank",
          "code": "GM03SWRTCA"
        },
        {
          "value": "Thigh Slimmer",
          "code": "GM03SWRTTS"
        },
        {
          "value": "Control Panty",
          "code": "GM03SWRTCP"
        },
        {
          "value": "Waist Trainer",
          "code": "GM03SWRTWT"
        },
        {
          "value": "Legging",
          "code": "GM03SWRTLG"
        },
        {
          "value": "Other",
          "code": "GM03SWRT99"
        }
      ]
    },
    {
      "codeListName": "Strap Placement",
      "values": [
        {
          "value": "Centered Back",
          "code": "GM03STPLCB"
        },
        {
          "value": "Wide Set Back",
          "code": "GM03STPLWB"
        },
        {
          "value": "Centered Front",
          "code": "GM03STPLCF"
        },
        {
          "value": "Wide Set Front",
          "code": "GM03STPLWF"
        },
        {
          "value": "Centered Front and Back",
          "code": "GM03STPLCT"
        },
        {
          "value": "Other",
          "code": "GM03STPL99"
        },
        {
          "value": "Racerback",
          "code": "GM03STPLRA"
        }
      ]
    },
    {
      "codeListName": "Control Level",
      "values": [
        {
          "value": "Extra Firm",
          "code": "GM03CONLEF"
        },
        {
          "value": "Medium",
          "code": "GM03CONLMD"
        },
        {
          "value": "Firm",
          "code": "GM03CONLFR"
        },
        {
          "value": "Other",
          "code": "GM03CONL99"
        },
        {
          "value": "Light",
          "code": "GM03CONLLT"
        }
      ]
    },
    {
      "codeListName": "Panty Type",
      "values": [
        {
          "value": "Bikini",
          "code": "GM03PNTYBI"
        },
        {
          "value": "Retro Thong",
          "code": "GM03PNTYRT"
        },
        {
          "value": "Boyshort",
          "code": "GM03PNTYΒΟ"
        },
        {
          "value": "Seamless",
          "code": "GM03PNTYSE"
        },
        {
          "value": "French Cut",
          "code": "GM03PNTYFC"
        },
        {
          "value": "Shorty",
          "code": "GM03PNTYSH"
        },
        {
          "value": "Full Brief",
          "code": "GM03PNTYFL"
        },
        {
          "value": "String",
          "code": "GM03PNTYST"
        },
        {
          "value": "Hi Cut",
          "code": "GM03PNTYНC"
        },
        {
          "value": "Tanga",
          "code": "GM03PNTΥΤΑ"
        },
        {
          "value": "High Waist Brief",
          "code": "GM03PNTYНB"
        },
        {
          "value": "Thong",
          "code": "GM03PNTYTH"
        },
        {
          "value": "High Waist Thong",
          "code": "GM03PNTYНТ"
        },
        {
          "value": "Other",
          "code": "GM03PNTY99"
        },
        {
          "value": "Hipster",
          "code": "GM03PNTYHP"
        }
      ]
    },
    {
      "codeListName": "Hosiery/Sock Type",
      "values": [
        {
          "value": "Arm Warmer",
          "code": "GM03HOSOAW"
        },
        {
          "value": "No Show",
          "code": "GM03HOSONS"
        },
        {
          "value": "Crew",
          "code": "GM03HOSOCR"
        },
        {
          "value": "Over the Calf",
          "code": "GM03HOSOOC"
        },
        {
          "value": "Footless Tights",
          "code": "GM03HOSOFT"
        },
        {
          "value": "Over the Knee",
          "code": "GM03HOSOOK"
        },
        {
          "value": "Knee High",
          "code": "GM03HOSOKH"
        },
        {
          "value": "Quarter",
          "code": "GM03HOSOQU"
        },
        {
          "value": "Leggings",
          "code": "GM03HOSOLG"
        },
        {
          "value": "Thigh High",
          "code": "GM03HOSOTH"
        },
        {
          "value": "Legwarmer",
          "code": "GM03HOSOLW"
        },
        {
          "value": "Tights",
          "code": "GM03HOSOTG"
        },
        {
          "value": "Liner",
          "code": "GM03HOSOLI"
        },
        {
          "value": "Trouser",
          "code": "GM03HOSOTR"
        },
        {
          "value": "Low Cut",
          "code": "GM03HOSOLC"
        },
        {
          "value": "Other",
          "code": "GM04HOSO99"
        }
      ]
    },
    {
      "codeListName": "Support Level",
      "values": [
        {
          "value": "Comfort Support",
          "code": "GM03SULVCA"
        },
        {
          "value": "Maximum Support",
          "code": "GM03SULVMA"
        },
        {
          "value": "Full Support",
          "code": "GM03SULVFA"
        },
        {
          "value": "Medium Support",
          "code": "GM03SULVMB"
        },
        {
          "value": "Light Support",
          "code": "GM03SULVLA"
        },
        {
          "value": "Other",
          "code": "GM03SULV99"
        }
      ]
    },
    {
      "codeListName": "Slip Type",
      "values": [
        {
          "value": "Full",
          "code": "GM03SLTPFL"
        },
        {
          "value": "Other",
          "code": "GM03SLTP99"
        },
        {
          "value": "Half",
          "code": "GM03SLTPHA"
        }
      ]
    }
  ],
  "Shoes": [
    {
      "codeListName": "Advertised Origin",
      "values": [
        {
          "value": "Imported",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Made in Canada",
          "code": "GM03ADVOMC"
        },
        {
          "value": "Made in U.S.A.",
          "code": "GM03ADVOMU"
        },
        {
          "value": "Made in U.S.A. and Imported",
          "code": "GM03ADVOUI"
        },
        {
          "value": "Made in U.S.A. or Imported",
          "code": "GM03ADVOUO"
        },
        {
          "value": "Made in another country*",
          "code": "GM04ADV099"
        }
      ]
    },
    {
      "codeListName": "Care Instructions",
      "values": [
        {
          "value": "Dishwasher Safe",
          "code": "GM03CAINDS"
        },
        {
          "value": "Machine Wash Hot",
          "code": "GM03CAINΜΗ"
        },
        {
          "value": "Do Not Iron",
          "code": "GM03CAINDN"
        },
        {
          "value": "Machine Wash Line Dry",
          "code": "GM03CAINML"
        },
        {
          "value": "Dry Clean",
          "code": "GM03CAINDC"
        },
        {
          "value": "Machine Wash Tumble Dry",
          "code": "GM03CAINMT"
        },
        {
          "value": "Hand Wash",
          "code": "GM03CAINHW"
        },
        {
          "value": "Machine Wash Warm",
          "code": "GM03CAINMW"
        },
        {
          "value": "Leather Method Dry Cleaning",
          "code": "GM03CAINLM"
        },
        {
          "value": "Spot Clean",
          "code": "GM03CAINSC"
        },
        {
          "value": "Machine Wash Cold",
          "code": "GM03CAINMC"
        },
        {
          "value": "Wash Separately",
          "code": "GM03CAINWS"
        },
        {
          "value": "Machine Wash Dry Flat",
          "code": "GM03CAINMD"
        },
        {
          "value": "Other",
          "code": "GM04CAIN99"
        }
      ]
    },
    {
      "codeListName": "Closure",
      "values": [
        {
          "value": "Adjustable/Pull",
          "code": "GM03CLOSAP"
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        },
        {
          "value": "Back",
          "code": "GM03CLOSBC"
        },
        {
          "value": "Latch",
          "code": "GM03CLOSLA"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Click Top",
          "code": "GM03CLOSCT"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "Elastic Lace with Toggle",
          "code": "GM03CLOSET"
        },
        {
          "value": "Swivel",
          "code": "GM03CLOSSW"
        },
        {
          "value": "O Ring",
          "code": "GM03CLOSDO"
        },
        {
          "value": "Tab",
          "code": "GM03CLOSTB"
        },
        {
          "value": "Fishhook",
          "code": "GM03CLOSFS"
        },
        {
          "value": "Tie",
          "code": "GM03CLOSTI"
        },
        {
          "value": "Flap",
          "code": "GM03CLOSFP"
        },
        {
          "value": "Tie Back/Halter",
          "code": "GM03CLOSTH"
        },
        {
          "value": "Foldover",
          "code": "GM03CLOSFO"
        },
        {
          "value": "Tie Front",
          "code": "GM03CLOSTF"
        },
        {
          "value": "French Wire",
          "code": "GM03CLOSFW"
        },
        {
          "value": "Tie Side",
          "code": "GM03CLOSTS"
        },
        {
          "value": "Frog/Button Loop",
          "code": "GM03CLOSFA"
        },
        {
          "value": "Toggle",
          "code": "GM03CLOSTO"
        },
        {
          "value": "Front Button/Zip",
          "code": "GM03CLOSFZ"
        },
        {
          "value": "Toggle Front",
          "code": "GM03CLOSTN"
        },
        {
          "value": "Front Hook/Zip",
          "code": "GM03CLOSFH"
        },
        {
          "value": "Top Zip",
          "code": "GM03CLOSTZ"
        },
        {
          "value": "Hidden Button Front",
          "code": "GM03CLOSHB"
        },
        {
          "value": "Tunnel Side Tie",
          "code": "GM03CLOSTQ"
        },
        {
          "value": "Hidden Snap Front",
          "code": "GM03CLOSHS"
        },
        {
          "value": "Turn Lock",
          "code": "GM03CLOSTL"
        },
        {
          "value": "Hidden Zip Front",
          "code": "GM03CLOSHZ"
        },
        {
          "value": "Wrap",
          "code": "GM03CLOSWR"
        },
        {
          "value": "Hinged",
          "code": "GM03CLOSHI"
        },
        {
          "value": "Zipper",
          "code": "GM03CLOSZI"
        },
        {
          "value": "Hinged/Foldover",
          "code": "GM03CLOSHE"
        },
        {
          "value": "Zipper Back",
          "code": "GM03CLOSZB"
        },
        {
          "value": "Hook",
          "code": "GM03CLOSHO"
        },
        {
          "value": "Zipper Back Partial",
          "code": "GM03CLOSZP"
        },
        {
          "value": "Hook and Loop",
          "code": "GM03CLOSHL"
        },
        {
          "value": "Zipper Front",
          "code": "GM03CLOSZE"
        },
        {
          "value": "Hook-and-eye",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back Front",
          "code": "GM03CLOSHD"
        },
        {
          "value": "Zipper Side",
          "code": "GM03CLOSZS"
        },
        {
          "value": "Keyhole Button",
          "code": "GM03CLOSKB"
        },
        {
          "value": "Zipper Around",
          "code": "GM03CLOSZA"
        },
        {
          "value": "Kiss-Lock",
          "code": "GM03CLOSKL"
        },
        {
          "value": "1/4 Zip",
          "code": "GM03CLOSZQ"
        },
        {
          "value": "Knot",
          "code": "GM03CLOSKN"
        },
        {
          "value": "1/2 Zip",
          "code": "GM03CLOSZH"
        },
        {
          "value": "Lace Up",
          "code": "GM03CLOSLU"
        },
        {
          "value": "Other Closure",
          "code": "GM04CLOS99"
        }
      ]
    },
    {
      "codeListName": "Fabric or Material",
      "values": [
        {
          "value": "14K Gold",
          "code": "GM03FBMC14"
        },
        {
          "value": "Marble/Wood",
          "code": "GM03FBMCMD"
        },
        {
          "value": "18K Gold",
          "code": "GM03FBMC18"
        },
        {
          "value": "Matte Jersey",
          "code": "GM03FBMCME"
        },
        {
          "value": "Agate",
          "code": "GM03FBMCAG"
        },
        {
          "value": "Melamine",
          "code": "GM03FBMCMF"
        },
        {
          "value": "Aluminum",
          "code": "GM03FBMCAL"
        },
        {
          "value": "Mercury Glass",
          "code": "GM03FBMCMG"
        },
        {
          "value": "Amethyst",
          "code": "GM03FBMCAM"
        },
        {
          "value": "Mesh",
          "code": "GM03FBMCMH"
        },
        {
          "value": "Anodized Aluminum",
          "code": "GM03FBMCAN"
        },
        {
          "value": "Metal",
          "code": "GM03FBMCMI"
        },
        {
          "value": "Beaded",
          "code": "GM03FBMCBD"
        },
        {
          "value": "Metal Alloy",
          "code": "GM03FBMCMJ"
        },
        {
          "value": "Birthstone",
          "code": "GM03FBMCBE"
        },
        {
          "value": "Metallic",
          "code": "GM03FBMCMK"
        },
        {
          "value": "Bi-stretch",
          "code": "GM03FBMCBF"
        },
        {
          "value": "Microfiber",
          "code": "GM03FBMCML"
        },
        {
          "value": "Bone",
          "code": "GM03FBMCBG"
        },
        {
          "value": "Microfleece",
          "code": "GM03FBMCMM"
        },
        {
          "value": "Boucle",
          "code": "GM03FBMCBH"
        },
        {
          "value": "Mikado",
          "code": "GM03FBMCMN"
        },
        {
          "value": "Brass",
          "code": "GM03FBMCBI"
        },
        {
          "value": "Mixed Materials",
          "code": "GM03FBMCMO"
        },
        {
          "value": "Broadcloth",
          "code": "GM03FBMCBJ"
        },
        {
          "value": "Mogador",
          "code": "GM03FBMCMP"
        },
        {
          "value": "Brocade",
          "code": "GM03FBMCBL"
        },
        {
          "value": "Moleskin",
          "code": "GM03FBMCMQ"
        },
        {
          "value": "Bronze",
          "code": "GM03FBMCBN"
        },
        {
          "value": "Mother-of-Pearl",
          "code": "GM03FBMCMR"
        },
        {
          "value": "Brushed Back Satin",
          "code": "GM03FBMCBS"
        },
        {
          "value": "Natural",
          "code": "GM03FBMCNA"
        },
        {
          "value": "Brushed Back Terry",
          "code": "GM03FBMCBT"
        },
        {
          "value": "Natural Fiber",
          "code": "GM03FBMCNB"
        },
        {
          "value": "Burlap",
          "code": "GM03FBMCBU"
        },
        {
          "value": "Nonstick",
          "code": "GM03FBMCNC"
        },
        {
          "value": "Canvas",
          "code": "GM03FBMCCA"
        },
        {
          "value": "Nubuck",
          "code": "GM03FBMCND"
        },
        {
          "value": "Cashmink",
          "code": "GM03FBMCCB"
        },
        {
          "value": "Onyx",
          "code": "GM03FBMCOA"
        },
        {
          "value": "Cast Aluminum",
          "code": "GM03FBMCCC"
        },
        {
          "value": "Opal",
          "code": "GM03FBMСОВ"
        },
        {
          "value": "Cast Iron",
          "code": "GM03FBMCCD"
        },
        {
          "value": "Organza",
          "code": "GM03FBMCOC"
        },
        {
          "value": "Ceramic",
          "code": "GM03FBMCCE"
        },
        {
          "value": "Ostrich",
          "code": "GM03FBMCOD"
        },
        {
          "value": "Challis",
          "code": "GM03FBMCCF"
        },
        {
          "value": "Ostrich Embossed",
          "code": "GM03FBMCOE"
        },
        {
          "value": "Chambray",
          "code": "GM03FBMCCG"
        },
        {
          "value": "Oxford",
          "code": "GM03FBMCOF"
        },
        {
          "value": "Charmeuse",
          "code": "GM03FBMCCH"
        },
        {
          "value": "Palladium",
          "code": "GM03FBMCPA"
        },
        {
          "value": "Chenille",
          "code": "GM03FBMCCI"
        },
        {
          "value": "Paper Braid",
          "code": "GM03FBMCPB"
        },
        {
          "value": "Chiffon/Sheer",
          "code": "GM03FBMCCJ"
        },
        {
          "value": "Patent Leather",
          "code": "GM03FBMCPC"
        },
        {
          "value": "Coated Canvas",
          "code": "GM03FBMCCK"
        },
        {
          "value": "Pearl",
          "code": "GM03FBMCPD"
        },
        {
          "value": "Composite",
          "code": "GM03FBMCCL"
        },
        {
          "value": "Percale",
          "code": "GM03FBMCPE"
        },
        {
          "value": "Confetti",
          "code": "GM03FBMCCM"
        },
        {
          "value": "Pinpoint",
          "code": "GM03FBMCPF"
        },
        {
          "value": "Copper",
          "code": "GM03FBMCCN"
        },
        {
          "value": "Pique",
          "code": "GM03FBMCPG"
        },
        {
          "value": "Coral",
          "code": "GM03FBMCCO"
        },
        {
          "value": "Plastic",
          "code": "GM03FBMCPH"
        },
        {
          "value": "Corduroy",
          "code": "GM03FBMCСР"
        },
        {
          "value": "Plastic/Acetate",
          "code": "GM03FBMCPI"
        },
        {
          "value": "Corian",
          "code": "GM03FBMCCQ"
        },
        {
          "value": "Plastic/Metal",
          "code": "GM03FBMCPJ"
        },
        {
          "value": "Cork",
          "code": "GM03FBMCCR"
        },
        {
          "value": "Plush",
          "code": "GM03FBMCPK"
        },
        {
          "value": "Crepe",
          "code": "GM03FBMCCS"
        },
        {
          "value": "Pointelle",
          "code": "GM03FBMCPL"
        },
        {
          "value": "Crinoline",
          "code": "GM03FBMCCT"
        },
        {
          "value": "Polycarbonate",
          "code": "GM03FBMCPM"
        },
        {
          "value": "Crochet",
          "code": "GM03FBMCCU"
        },
        {
          "value": "Ponte",
          "code": "GM03FBMCPN"
        },
        {
          "value": "Crochet/Openwork",
          "code": "GM03FBMCCV"
        },
        {
          "value": "Poplin",
          "code": "GM03FBMCPO"
        },
        {
          "value": "Croco",
          "code": "GM03FBMCCW"
        },
        {
          "value": "Porcelain",
          "code": "GM03FBMCPP"
        },
        {
          "value": "Croco Embossed",
          "code": "GM03FBMCCX"
        },
        {
          "value": "Portuguese Flannel",
          "code": "GM03FBMCPQ"
        },
        {
          "value": "Crystal",
          "code": "GM03FBMCCY"
        },
        {
          "value": "Propionate",
          "code": "GM03FBMCPR"
        },
        {
          "value": "Cubic Zirconia",
          "code": "GM03FBMCCZ"
        },
        {
          "value": "PU",
          "code": "GM03FBMCPS"
        },
        {
          "value": "Denim",
          "code": "GM03FBMCDA"
        },
        {
          "value": "Quartz",
          "code": "GM03FBMCQA"
        },
        {
          "value": "Diamond",
          "code": "GM03FBMCDB"
        },
        {
          "value": "Rattan",
          "code": "GM03FBMCRA"
        },
        {
          "value": "Dobby",
          "code": "GM03FBMCDC"
        },
        {
          "value": "Resin",
          "code": "GM03FBMCRB"
        },
        {
          "value": "Double Knit",
          "code": "GM03FBMCDD"
        },
        {
          "value": "Rhodium",
          "code": "GM03FBMCRC"
        },
        {
          "value": "Down",
          "code": "GM03FBMCDE"
        },
        {
          "value": "Ribbon",
          "code": "GM03FBMCRD"
        },
        {
          "value": "Down Fill",
          "code": "GM03FBMCDF"
        },
        {
          "value": "Rope",
          "code": "GM03FBMRE"
        },
        {
          "value": "Drop Needle",
          "code": "GM03FBMCDG"
        },
        {
          "value": "Saffiano",
          "code": "GM03FBMCSA"
        },
        {
          "value": "Earthenware",
          "code": "GM03FBMCEA"
        },
        {
          "value": "Sateen",
          "code": "GM03FBMCSB"
        },
        {
          "value": "Elephant Embossed",
          "code": "GM03FBMCEB"
        },
        {
          "value": "Satin",
          "code": "GM03FBMCSC"
        },
        {
          "value": "Enamel",
          "code": "GM03FBMCEC"
        },
        {
          "value": "Scuba",
          "code": "GM03FBMCSD"
        },
        {
          "value": "Enamel/Aluminum",
          "code": "GM03FBMCED"
        },
        {
          "value": "Seagrass",
          "code": "GM03FBMCSE"
        },
        {
          "value": "Enamel/Epoxy",
          "code": "GM03FBMCEF"
        },
        {
          "value": "Seersucker",
          "code": "GM03FBMCSF"
        },
        {
          "value": "Enamel/Iron",
          "code": "GM03FBMCEG"
        },
        {
          "value": "Sequin",
          "code": "GM03FBMCSG"
        },
        {
          "value": "Enamel/Steel",
          "code": "GM03FBMCЕН"
        },
        {
          "value": "Shantung",
          "code": "GM03FBMCSH"
        },
        {
          "value": "End-on-End",
          "code": "GM03FBMCEI"
        },
        {
          "value": "Shearling",
          "code": "GM03FBMCSI"
        },
        {
          "value": "Epoxy",
          "code": "GM03FBMCEJ"
        },
        {
          "value": "Sheeting",
          "code": "GM03FBMCSJ"
        },
        {
          "value": "Eyelet",
          "code": "GM03FBMСЕК"
        },
        {
          "value": "Shell",
          "code": "GM03FBMCSK"
        },
        {
          "value": "Fabric",
          "code": "GM03FBMCFA"
        },
        {
          "value": "Silicone",
          "code": "GM03FBMCSL"
        },
        {
          "value": "Faux Fur",
          "code": "GM03FBMCFB"
        },
        {
          "value": "Sinamay",
          "code": "GM03FBMCSM"
        },
        {
          "value": "Faux Leather",
          "code": "GM03FBMCFC"
        },
        {
          "value": "Slate",
          "code": "GM03FBMCSN"
        },
        {
          "value": "Faux Pearl",
          "code": "GM03FBMCFD"
        },
        {
          "value": "Slub",
          "code": "GM03FBMCSO"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03FBMCFE"
        },
        {
          "value": "Snake Embossed",
          "code": "GM03FBMCSP"
        },
        {
          "value": "Faux Suede",
          "code": "GM03FBMCFF"
        },
        {
          "value": "Snit",
          "code": "GM03FBMCSQ"
        },
        {
          "value": "Felt",
          "code": "GM03FBMCFG"
        },
        {
          "value": "Stainless Steel",
          "code": "GM03FBMCSR"
        },
        {
          "value": "Flannel",
          "code": "GM03FBMCFH"
        },
        {
          "value": "Steel",
          "code": "GM03FBMCST"
        },
        {
          "value": "Flat Knit",
          "code": "GM03FBMCFI"
        },
        {
          "value": "Sterling Silver",
          "code": "GM03FBMCSU"
        },
        {
          "value": "Fleece",
          "code": "GM03FBMCFJ"
        },
        {
          "value": "Stone",
          "code": "GM03FBMCSV"
        },
        {
          "value": "Foam",
          "code": "GM03FBMCFK"
        },
        {
          "value": "Stoneware",
          "code": "GM03FBMCSW"
        },
        {
          "value": "French Terry",
          "code": "GM03FBMCFL"
        },
        {
          "value": "Straw",
          "code": "GM03FBMCSX"
        },
        {
          "value": "Fresh Water Pearl",
          "code": "GM03FBMCFM"
        },
        {
          "value": "Styrofoam",
          "code": "GM03FBMCSY"
        },
        {
          "value": "Fur",
          "code": "GM03FBMCFN"
        },
        {
          "value": "Suede",
          "code": "GM03FBMCSZ"
        },
        {
          "value": "Gabardine",
          "code": "GM03FBMCGA"
        },
        {
          "value": "Sweater Yarn",
          "code": "GM03FBMCSS"
        },
        {
          "value": "Galvanized",
          "code": "GM03FBMCGB"
        },
        {
          "value": "Swiss Dot",
          "code": "GM03FBMCWI"
        },
        {
          "value": "Gauze",
          "code": "GM03FBMCGC"
        },
        {
          "value": "Synthetic",
          "code": "GM03FBMCYT"
        },
        {
          "value": "Genuine Stone",
          "code": "GM03FBMCGD"
        },
        {
          "value": "Taffeta",
          "code": "GM03FBMCТА"
        },
        {
          "value": "Georgette",
          "code": "GM03FBMCGE"
        },
        {
          "value": "Terra Cotta",
          "code": "GM03FBMCTB"
        },
        {
          "value": "Glass",
          "code": "GM03FBMCGF"
        },
        {
          "value": "Terry Cloth",
          "code": "GM03FBMCTC"
        },
        {
          "value": "Glitter",
          "code": "GM03FBMCGI"
        },
        {
          "value": "Thermal",
          "code": "GM03FBMCTD"
        },
        {
          "value": "Grenadine",
          "code": "GM03FBMCGG"
        },
        {
          "value": "Titanium",
          "code": "GM03FBMCTЕ"
        },
        {
          "value": "Grosgrain",
          "code": "GM03FBMCGH"
        },
        {
          "value": "Topaz",
          "code": "GM03FBMCTF"
        },
        {
          "value": "Hard Anodized",
          "code": "GM03FBMCHA"
        },
        {
          "value": "Tricot",
          "code": "GM03FBMCTG"
        },
        {
          "value": "Hatchi",
          "code": "GM03FBMCHB"
        },
        {
          "value": "Tri-Ply Stainless Steel",
          "code": "GM03FBMCTH"
        },
        {
          "value": "Heavy Gauge Steel",
          "code": "GM03FBMCHC"
        },
        {
          "value": "Tritan",
          "code": "GM03FBMCTI"
        },
        {
          "value": "High-Carbon Steel",
          "code": "GM03FBMCHD"
        },
        {
          "value": "Tulle",
          "code": "GM03FBMCT"
        },
        {
          "value": "Hopsack",
          "code": "GM03FBMCHE"
        },
        {
          "value": "Turquoise",
          "code": "GM03FBMCTK"
        },
        {
          "value": "Howlite",
          "code": "GM03FBMCHF"
        },
        {
          "value": "Tweed",
          "code": "GM03FBMCTL"
        },
        {
          "value": "Ironstone",
          "code": "GM03FBMCIA"
        },
        {
          "value": "Tweed/Boucle",
          "code": "GM03FBMCTM"
        },
        {
          "value": "Jacquard",
          "code": "GM03FBMCJA"
        },
        {
          "value": "Twill",
          "code": "GM03FBMCTN"
        },
        {
          "value": "Jade",
          "code": "GM03FBMCJB"
        },
        {
          "value": "Velour",
          "code": "GM03FBMCVA"
        },
        {
          "value": "Jasper",
          "code": "GM03FBMCJC"
        },
        {
          "value": "Velvet",
          "code": "GM03FBMCVB"
        },
        {
          "value": "Knit (Generic)",
          "code": "GM03FBMСKA"
        },
        {
          "value": "Velveteen",
          "code": "GM03FBMCVC"
        },
        {
          "value": "Knit Cable",
          "code": "GM03FBMCKB"
        },
        {
          "value": "Voile",
          "code": "GM03FBMCVD"
        },
        {
          "value": "Knit Fine Gauge",
          "code": "GM03FBMCKC"
        },
        {
          "value": "Waffle",
          "code": "GM03FBMCWA"
        },
        {
          "value": "Knit Intarsia",
          "code": "GM03FBMCKD"
        },
        {
          "value": "Wax",
          "code": "GM03FBMCWB"
        },
        {
          "value": "Knit Interlock",
          "code": "GM03FBMCKE"
        },
        {
          "value": "Wicker",
          "code": "GM03FBMCWC"
        },
        {
          "value": "Knit Jersey",
          "code": "GM03FBMCKF"
        },
        {
          "value": "Wire",
          "code": "GM03FBMCWD"
        },
        {
          "value": "Knit Ribbed",
          "code": "GM03FBMCKG"
        },
        {
          "value": "Wood",
          "code": "GM03FBMCWE"
        },
        {
          "value": "Knit/Woven",
          "code": "GM03FBMCKH"
        },
        {
          "value": "Wood Alternative",
          "code": "GM03FBMCWF"
        },
        {
          "value": "Knitted",
          "code": "GM03FBMCKI"
        },
        {
          "value": "Wool",
          "code": "GM03FBMCWG"
        },
        {
          "value": "Lace",
          "code": "GM03FBMCLA"
        },
        {
          "value": "Woven (generic)",
          "code": "GM03FBMCWH"
        },
        {
          "value": "Leather",
          "code": "GM03FBMCLB"
        },
        {
          "value": "Other",
          "code": "GM03FBMC99"
        },
        {
          "value": "Lizard Embossed",
          "code": "GM03FBMCLC"
        },
        {
          "value": "Magnesite",
          "code": "GM03FBMCMA"
        },
        {
          "value": "Magnet",
          "code": "GM03FBMCMB"
        },
        {
          "value": "Marble",
          "code": "GM03FBMCMC"
        }
      ]
    },
    {
      "codeListName": "Fur Animal Name",
      "values": [
        {
          "value": "Australian Brushtail Possum",
          "code": "GM03FANMAP"
        },
        {
          "value": "Otter",
          "code": "GM03FANMOU"
        },
        {
          "value": "Beaver",
          "code": "GM03FANMBV"
        },
        {
          "value": "Pony Hair",
          "code": "GM03FANMPH"
        },
        {
          "value": "Calf Hair",
          "code": "GM03FANMCH"
        },
        {
          "value": "Rabbit",
          "code": "GM03FANMRI"
        },
        {
          "value": "Fox",
          "code": "GM03FANMFX"
        },
        {
          "value": "Raccoon",
          "code": "GM03FANMRC"
        },
        {
          "value": "Golden Jackal",
          "code": "GM03FANMGJ"
        },
        {
          "value": "Sable",
          "code": "GM03FANMSG"
        },
        {
          "value": "Grey Wolf",
          "code": "GM03FANMGW"
        },
        {
          "value": "Skunk",
          "code": "GM03FANMSK"
        },
        {
          "value": "Marten",
          "code": "GM03FANMΜΑ"
        },
        {
          "value": "Other Fur Animal*",
          "code": "GM04FANM99"
        },
        {
          "value": "Mink",
          "code": "GM03FANMMK"
        }
      ]
    },
    {
      "codeListName": "Fur Treatment",
      "values": [
        {
          "value": "Artificially Colored",
          "code": "GM03FTMTAC"
        },
        {
          "value": "Natural (untreated)",
          "code": "GM03FTMTΝΑ"
        },
        {
          "value": "Bleached",
          "code": "GM03FTMTBM"
        },
        {
          "value": "Painted",
          "code": "GM03FTMTPT"
        },
        {
          "value": "Dyed",
          "code": "GM03FTMTDY"
        },
        {
          "value": "Other Fur Treatment",
          "code": "GM04FTMT99"
        }
      ]
    },
    {
      "codeListName": "Gender",
      "values": [
        {
          "value": "Female",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Gender Neutral",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        }
      ]
    },
    {
      "codeListName": "Heel Height Range",
      "values": [
        {
          "value": "Extra-High > 3 inch",
          "code": "GM03HLHTЕН"
        },
        {
          "value": "Low > .5 to 1 inch",
          "code": "GM03HLHTLW"
        },
        {
          "value": "Flat - 0 - .5 inch",
          "code": "GM03HLHTFL"
        },
        {
          "value": "Medium - > 1 inch - 2 inch",
          "code": "GM03HLHTMD"
        },
        {
          "value": "High > 2 inch 3 inch",
          "code": "GM03HLHTHI"
        },
        {
          "value": "Other",
          "code": "GM04HLHT99"
        }
      ]
    },
    {
      "codeListName": "Lining Material",
      "values": [
        {
          "value": "Antimicrobial",
          "code": "GM03LIMTAN"
        },
        {
          "value": "Nylon",
          "code": "GM03LIMTNY"
        },
        {
          "value": "Cotton",
          "code": "GM03LIMTCT"
        },
        {
          "value": "Organic Material",
          "code": "GM03LIMTOM"
        },
        {
          "value": "Fabric",
          "code": "GM03LIMTFD"
        },
        {
          "value": "Polyester",
          "code": "GM03LIMTPR"
        },
        {
          "value": "Faux Fur",
          "code": "GM03LIMTFB"
        },
        {
          "value": "PU",
          "code": "GM03LIMTPU"
        },
        {
          "value": "Faux Leather",
          "code": "GM03LIMTFL"
        },
        {
          "value": "PVC",
          "code": "GM03LIMTPV"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03LIMTFS"
        },
        {
          "value": "Quilted",
          "code": "GM03LIMTQT"
        },
        {
          "value": "Fleece",
          "code": "GM03LIMTFC"
        },
        {
          "value": "Shearling Lined",
          "code": "GM03LIMTSL"
        },
        {
          "value": "Gel",
          "code": "GM03LIMTGE"
        },
        {
          "value": "Sherpa",
          "code": "GM03LIMTSP"
        },
        {
          "value": "Leather",
          "code": "GM03LIMTLE"
        },
        {
          "value": "Straw",
          "code": "GM03LIMTST"
        },
        {
          "value": "Logo Lining",
          "code": "GM03LIMTLL"
        },
        {
          "value": "Synthetic",
          "code": "GM03LIMTSY"
        },
        {
          "value": "Memory Foam",
          "code": "GM03LIMTMF"
        },
        {
          "value": "Taffeta",
          "code": "GM03LIMTTA"
        },
        {
          "value": "Mesh",
          "code": "GM03LIMTME"
        },
        {
          "value": "Other",
          "code": "GM04LIMT99"
        }
      ]
    },
    {
      "codeListName": "Open/Closed Toe",
      "values": [
        {
          "value": "Closed",
          "code": "GM030PCLCL"
        },
        {
          "value": "Open",
          "code": "GM030PCLOP"
        }
      ]
    },
    {
      "codeListName": "Shoe Type",
      "values": [
        {
          "value": "Boots/Booties",
          "code": "GM03SETPBB"
        },
        {
          "value": "Pumps",
          "code": "GM03SETPPP"
        },
        {
          "value": "Clogs/Mules",
          "code": "GM03SETPCM"
        },
        {
          "value": "Sandals",
          "code": "GM03SETPSA"
        },
        {
          "value": "Flats",
          "code": "GM03SETPFL"
        },
        {
          "value": "Slippers",
          "code": "GM03SETPSL"
        },
        {
          "value": "Loafers",
          "code": "GM03SETPLM"
        },
        {
          "value": "Sneakers",
          "code": "GM03SETPSN"
        },
        {
          "value": "Oxfords",
          "code": "GM03SETPXF"
        },
        {
          "value": "Other",
          "code": "GM04SETP99"
        }
      ]
    },
    {
      "codeListName": "Sole Type",
      "values": [
        {
          "value": "Leather",
          "code": "GM03SOLTLS"
        },
        {
          "value": "Rubber",
          "code": "GM03SOLTRS"
        },
        {
          "value": "Synthetic",
          "code": "GM03SOLTSJ"
        },
        {
          "value": "Recycled",
          "code": "GM03SOLTRE"
        },
        {
          "value": "Natural Fiber",
          "code": "GM03SOLTNS"
        },
        {
          "value": "Other Sole Type",
          "code": "GM04SOLT99"
        }
      ]
    },
    {
      "codeListName": "Toe Shape",
      "values": [
        {
          "value": "Almond",
          "code": "GM03TOESAL"
        },
        {
          "value": "Round",
          "code": "GM03TOESRD"
        },
        {
          "value": "Chisel",
          "code": "GM03TOESCH"
        },
        {
          "value": "Snip",
          "code": "GM03TOESSN"
        },
        {
          "value": "Oblique",
          "code": "GM03TOESOB"
        },
        {
          "value": "Square",
          "code": "GM03TOESSQ"
        },
        {
          "value": "Pointy",
          "code": "GM03TOESPY"
        },
        {
          "value": "Other",
          "code": "GM04TOES99"
        }
      ]
    },
    {
      "codeListName": "Toe Style",
      "values": [
        {
          "value": "Apron Toe",
          "code": "GM03TOESAP"
        },
        {
          "value": "Split Toe",
          "code": "GM03TOESSP"
        },
        {
          "value": "Bike Toe",
          "code": "GM03TOESBI"
        },
        {
          "value": "Steel Toe",
          "code": "GM03TOESST"
        },
        {
          "value": "Cap Toe",
          "code": "GM03TOESCT"
        },
        {
          "value": "Tabi Toe",
          "code": "GM03TOESTA"
        },
        {
          "value": "Peep Toe",
          "code": "GM03TOESPT"
        },
        {
          "value": "Other",
          "code": "GM04TOES99"
        }
      ]
    },
    {
      "codeListName": "Boot Shaft Type",
      "values": [
        {
          "value": "Low shaft/Ankle",
          "code": "GM03BTSTAN"
        },
        {
          "value": "Over Knee XX",
          "code": "GM03BTSTOK"
        },
        {
          "value": "Knee High/Tall",
          "code": "GM03BTSTKH"
        },
        {
          "value": "Tall",
          "code": "GM03BTSTTL"
        },
        {
          "value": "Low Shaft",
          "code": "GM03BTSTLS"
        },
        {
          "value": "Other",
          "code": "GMOBTST99"
        },
        {
          "value": "Mid Calf",
          "code": "GM03BTSTMI"
        }
      ]
    },
    {
      "codeListName": "Sport",
      "values": [
        {
          "value": "Badminton",
          "code": "ZZ03SPRTBD"
        },
        {
          "value": "Hunting",
          "code": "ZZ03SPRTHU"
        },
        {
          "value": "Baseball",
          "code": "ZZ03SPRTBA"
        },
        {
          "value": "Lacrosse",
          "code": "ZZ03SPRTLA"
        },
        {
          "value": "Basketball",
          "code": "ZZ03SPRTBK"
        },
        {
          "value": "Racing",
          "code": "ZZ03SPRTRA"
        },
        {
          "value": "Bocce Ball",
          "code": "ZZ03SPRTBB"
        },
        {
          "value": "Racquetball",
          "code": "ZZ03SPRTRC"
        },
        {
          "value": "Bowling",
          "code": "ZZ03SPRTBW"
        },
        {
          "value": "Rowing",
          "code": "ZZ03SPRTRW"
        },
        {
          "value": "Boxing/Martial Arts",
          "code": "ZZ03SPRTBM"
        },
        {
          "value": "Running",
          "code": "ZZ03SPRTRU"
        },
        {
          "value": "Climbing",
          "code": "ZZ03SPRTCL"
        },
        {
          "value": "Skiing",
          "code": "ZZ03SPRTSK"
        },
        {
          "value": "Cross Country",
          "code": "ZZ03SPRTCC"
        },
        {
          "value": "Soccer",
          "code": "ZZ03SPRTSC"
        },
        {
          "value": "Cross-Training",
          "code": "ZZ03SPRTCT"
        },
        {
          "value": "Softball",
          "code": "ZZ03SPRTSF"
        },
        {
          "value": "Cycling",
          "code": "ZZ03SPRTCY"
        },
        {
          "value": "Tennis",
          "code": "ZZ03SPRTTE"
        },
        {
          "value": "Dance",
          "code": "ZZ03SPRTDA"
        },
        {
          "value": "Walking",
          "code": "ZZ03SPRTWK"
        },
        {
          "value": "Football",
          "code": "ZZ03SPRTFT"
        },
        {
          "value": "Water Skiing",
          "code": "ZZ03SPRTWA"
        },
        {
          "value": "Golf",
          "code": "ZZ03SPRTGF"
        },
        {
          "value": "Wrestling",
          "code": "ZZ03SPRTWR"
        },
        {
          "value": "Hiking",
          "code": "ZZ03SPRTHI"
        },
        {
          "value": "Yoga",
          "code": "ZZ03SPRTYG"
        },
        {
          "value": "Hockey",
          "code": "ZZ03SPRTΗΚ"
        },
        {
          "value": "Other",
          "code": "ZZ04SPRT99"
        }
      ]
    }
  ],
  "Bags": [
    {
      "codeListName": "Advertised Origin",
      "values": [
        {
          "value": "Imported",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Made in Canada",
          "code": "GM03ADVOMC"
        },
        {
          "value": "Made in U.S.A.",
          "code": "GM03ADVOMU"
        },
        {
          "value": "Made in U.S.A. and Imported",
          "code": "GM03ADVOUI"
        },
        {
          "value": "Made in U.S.A. or Imported",
          "code": "GM03ADVOUO"
        },
        {
          "value": "Made in another country*",
          "code": "GM04ADV099"
        }
      ]
    },
    {
      "codeListName": "Bag Type",
      "values": [
        {
          "value": "Backpack",
          "code": "GM03BGSTBA"
        },
        {
          "value": "Saddle Bag",
          "code": "GM03BGSTSB"
        },
        {
          "value": "Bucket Bag",
          "code": "GM03BGSTBB"
        },
        {
          "value": "Satchel",
          "code": "GM03BGSTSA"
        },
        {
          "value": "Clutch",
          "code": "GM03BGSTCL"
        },
        {
          "value": "Shopper",
          "code": "GM03BGSTSJ"
        },
        {
          "value": "Crossbody",
          "code": "GM03BGSTCR"
        },
        {
          "value": "Shoulder Bag",
          "code": "GM03BGSTSH"
        },
        {
          "value": "Diaper Bag",
          "code": "GM03BGSTDB"
        },
        {
          "value": "Tote",
          "code": "GM03BGSTTT"
        },
        {
          "value": "Duffel",
          "code": "GM03BGSTDU"
        },
        {
          "value": "Waist Bag",
          "code": "GM03BGSTWB"
        },
        {
          "value": "Hobo",
          "code": "GM03BGSTHB"
        },
        {
          "value": "Wristlet",
          "code": "GM03BGSTWR"
        },
        {
          "value": "Messenger Bag",
          "code": "GM03BGSTMB"
        },
        {
          "value": "Other",
          "code": "GM04BGST99"
        },
        {
          "value": "Pouch",
          "code": "GM03BGSTPH"
        }
      ]
    },
    {
      "codeListName": "Care Instructions",
      "values": [
        {
          "value": "Dishwasher Safe",
          "code": "GM03CAINDS"
        },
        {
          "value": "Machine Wash Hot",
          "code": "GM03CAINΜΗ"
        },
        {
          "value": "Do Not Iron",
          "code": "GM03CAINDN"
        },
        {
          "value": "Machine Wash Line Dry",
          "code": "GM03CAINML"
        },
        {
          "value": "Dry Clean",
          "code": "GM03CAINDC"
        },
        {
          "value": "Machine Wash Tumble Dry",
          "code": "GM03CAINMT"
        },
        {
          "value": "Hand Wash",
          "code": "GM03CAINHW"
        },
        {
          "value": "Machine Wash Warm",
          "code": "GM03CAINMW"
        },
        {
          "value": "Leather Method Dry Cleaning",
          "code": "GM03CAINLM"
        },
        {
          "value": "Spot Clean",
          "code": "GM03CAINSC"
        },
        {
          "value": "Machine Wash Cold",
          "code": "GM03CAINMC"
        },
        {
          "value": "Wash Separately",
          "code": "GM03CAINWS"
        },
        {
          "value": "Machine Wash Dry Flat",
          "code": "GM03CAINMD"
        },
        {
          "value": "Other",
          "code": "GM04CAIN99"
        }
      ]
    },
    {
      "codeListName": "Closure",
      "values": [
        {
          "value": "Adjustable/Pull",
          "code": "GM03CLOSAP"
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        },
        {
          "value": "Back",
          "code": "GM03CLOSBC"
        },
        {
          "value": "Latch",
          "code": "GM03CLOSLA"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Click Top",
          "code": "GM03CLOSCT"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "Elastic Lace with Toggle",
          "code": "GM03CLOSET"
        },
        {
          "value": "Swivel",
          "code": "GM03CLOSSW"
        },
        {
          "value": "O Ring",
          "code": "GM03CLOSDO"
        },
        {
          "value": "Tab",
          "code": "GM03CLOSTB"
        },
        {
          "value": "Fishhook",
          "code": "GM03CLOSFS"
        },
        {
          "value": "Tie",
          "code": "GM03CLOSTI"
        },
        {
          "value": "Flap",
          "code": "GM03CLOSFP"
        },
        {
          "value": "Tie Back/Halter",
          "code": "GM03CLOSTH"
        },
        {
          "value": "Foldover",
          "code": "GM03CLOSFO"
        },
        {
          "value": "Tie Front",
          "code": "GM03CLOSTF"
        },
        {
          "value": "French Wire",
          "code": "GM03CLOSFW"
        },
        {
          "value": "Tie Side",
          "code": "GM03CLOSTS"
        },
        {
          "value": "Frog/Button Loop",
          "code": "GM03CLOSFA"
        },
        {
          "value": "Toggle",
          "code": "GM03CLOSTO"
        },
        {
          "value": "Front Button/Zip",
          "code": "GM03CLOSFZ"
        },
        {
          "value": "Toggle Front",
          "code": "GM03CLOSTN"
        },
        {
          "value": "Front Hook/Zip",
          "code": "GM03CLOSFH"
        },
        {
          "value": "Top Zip",
          "code": "GM03CLOSTZ"
        },
        {
          "value": "Hidden Button Front",
          "code": "GM03CLOSHB"
        },
        {
          "value": "Tunnel Side Tie",
          "code": "GM03CLOSTQ"
        },
        {
          "value": "Hidden Snap Front",
          "code": "GM03CLOSHS"
        },
        {
          "value": "Turn Lock",
          "code": "GM03CLOSTL"
        },
        {
          "value": "Hidden Zip Front",
          "code": "GM03CLOSHZ"
        },
        {
          "value": "Wrap",
          "code": "GM03CLOSWR"
        },
        {
          "value": "Hinged",
          "code": "GM03CLOSHI"
        },
        {
          "value": "Zipper",
          "code": "GM03CLOSZI"
        },
        {
          "value": "Hinged/Foldover",
          "code": "GM03CLOSHE"
        },
        {
          "value": "Zipper Back",
          "code": "GM03CLOSZB"
        },
        {
          "value": "Hook",
          "code": "GM03CLOSHO"
        },
        {
          "value": "Zipper Back Partial",
          "code": "GM03CLOSZP"
        },
        {
          "value": "Hook and Loop",
          "code": "GM03CLOSHL"
        },
        {
          "value": "Zipper Front",
          "code": "GM03CLOSZE"
        },
        {
          "value": "Hook-and-eye",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back Front",
          "code": "GM03CLOSHD"
        },
        {
          "value": "Zipper Side",
          "code": "GM03CLOSZS"
        },
        {
          "value": "Keyhole Button",
          "code": "GM03CLOSKB"
        },
        {
          "value": "Zipper Around",
          "code": "GM03CLOSZA"
        },
        {
          "value": "Kiss-Lock",
          "code": "GM03CLOSKL"
        },
        {
          "value": "1/4 Zip",
          "code": "GM03CLOSZQ"
        },
        {
          "value": "Knot",
          "code": "GM03CLOSKN"
        },
        {
          "value": "1/2 Zip",
          "code": "GM03CLOSZH"
        },
        {
          "value": "Lace Up",
          "code": "GM03CLOSLU"
        },
        {
          "value": "Other Closure",
          "code": "GM04CLOS99"
        }
      ]
    },
    {
      "codeListName": "Fabric or Material",
      "values": [
        {
          "value": "14K Gold",
          "code": "GM03FBMC14"
        },
        {
          "value": "Marble/Wood",
          "code": "GM03FBMCMD"
        },
        {
          "value": "18K Gold",
          "code": "GM03FBMC18"
        },
        {
          "value": "Matte Jersey",
          "code": "GM03FBMCME"
        },
        {
          "value": "Agate",
          "code": "GM03FBMCAG"
        },
        {
          "value": "Melamine",
          "code": "GM03FBMCMF"
        },
        {
          "value": "Aluminum",
          "code": "GM03FBMCAL"
        },
        {
          "value": "Mercury Glass",
          "code": "GM03FBMCMG"
        },
        {
          "value": "Amethyst",
          "code": "GM03FBMCAM"
        },
        {
          "value": "Mesh",
          "code": "GM03FBMCMH"
        },
        {
          "value": "Anodized Aluminum",
          "code": "GM03FBMCAN"
        },
        {
          "value": "Metal",
          "code": "GM03FBMCMI"
        },
        {
          "value": "Beaded",
          "code": "GM03FBMCBD"
        },
        {
          "value": "Metal Alloy",
          "code": "GM03FBMCMJ"
        },
        {
          "value": "Birthstone",
          "code": "GM03FBMCBE"
        },
        {
          "value": "Metallic",
          "code": "GM03FBMCMK"
        },
        {
          "value": "Bi-stretch",
          "code": "GM03FBMCBF"
        },
        {
          "value": "Microfiber",
          "code": "GM03FBMCML"
        },
        {
          "value": "Bone",
          "code": "GM03FBMCBG"
        },
        {
          "value": "Microfleece",
          "code": "GM03FBMCMM"
        },
        {
          "value": "Boucle",
          "code": "GM03FBMCBH"
        },
        {
          "value": "Mikado",
          "code": "GM03FBMCMN"
        },
        {
          "value": "Brass",
          "code": "GM03FBMCBI"
        },
        {
          "value": "Mixed Materials",
          "code": "GM03FBMCMO"
        },
        {
          "value": "Broadcloth",
          "code": "GM03FBMCBJ"
        },
        {
          "value": "Mogador",
          "code": "GM03FBMCMP"
        },
        {
          "value": "Brocade",
          "code": "GM03FBMCBL"
        },
        {
          "value": "Moleskin",
          "code": "GM03FBMCMQ"
        },
        {
          "value": "Bronze",
          "code": "GM03FBMCBN"
        },
        {
          "value": "Mother-of-Pearl",
          "code": "GM03FBMCMR"
        },
        {
          "value": "Brushed Back Satin",
          "code": "GM03FBMCBS"
        },
        {
          "value": "Natural",
          "code": "GM03FBMCNA"
        },
        {
          "value": "Brushed Back Terry",
          "code": "GM03FBMCBT"
        },
        {
          "value": "Natural Fiber",
          "code": "GM03FBMCNB"
        },
        {
          "value": "Burlap",
          "code": "GM03FBMCBU"
        },
        {
          "value": "Nonstick",
          "code": "GM03FBMCNC"
        },
        {
          "value": "Canvas",
          "code": "GM03FBMCCA"
        },
        {
          "value": "Nubuck",
          "code": "GM03FBMCND"
        },
        {
          "value": "Cashmink",
          "code": "GM03FBMCCB"
        },
        {
          "value": "Onyx",
          "code": "GM03FBMCOA"
        },
        {
          "value": "Cast Aluminum",
          "code": "GM03FBMCCC"
        },
        {
          "value": "Opal",
          "code": "GM03FBMСОВ"
        },
        {
          "value": "Cast Iron",
          "code": "GM03FBMCCD"
        },
        {
          "value": "Organza",
          "code": "GM03FBMCOC"
        },
        {
          "value": "Ceramic",
          "code": "GM03FBMCCE"
        },
        {
          "value": "Ostrich",
          "code": "GM03FBMCOD"
        },
        {
          "value": "Challis",
          "code": "GM03FBMCCF"
        },
        {
          "value": "Ostrich Embossed",
          "code": "GM03FBMCOE"
        },
        {
          "value": "Chambray",
          "code": "GM03FBMCCG"
        },
        {
          "value": "Oxford",
          "code": "GM03FBMCOF"
        },
        {
          "value": "Charmeuse",
          "code": "GM03FBMCCH"
        },
        {
          "value": "Palladium",
          "code": "GM03FBMCPA"
        },
        {
          "value": "Chenille",
          "code": "GM03FBMCCI"
        },
        {
          "value": "Paper Braid",
          "code": "GM03FBMCPB"
        },
        {
          "value": "Chiffon/Sheer",
          "code": "GM03FBMCCJ"
        },
        {
          "value": "Patent Leather",
          "code": "GM03FBMCPC"
        },
        {
          "value": "Coated Canvas",
          "code": "GM03FBMCCK"
        },
        {
          "value": "Pearl",
          "code": "GM03FBMCPD"
        },
        {
          "value": "Composite",
          "code": "GM03FBMCCL"
        },
        {
          "value": "Percale",
          "code": "GM03FBMCPE"
        },
        {
          "value": "Confetti",
          "code": "GM03FBMCCM"
        },
        {
          "value": "Pinpoint",
          "code": "GM03FBMCPF"
        },
        {
          "value": "Copper",
          "code": "GM03FBMCCN"
        },
        {
          "value": "Pique",
          "code": "GM03FBMCPG"
        },
        {
          "value": "Coral",
          "code": "GM03FBMCCO"
        },
        {
          "value": "Plastic",
          "code": "GM03FBMCPH"
        },
        {
          "value": "Corduroy",
          "code": "GM03FBMCСР"
        },
        {
          "value": "Plastic/Acetate",
          "code": "GM03FBMCPI"
        },
        {
          "value": "Corian",
          "code": "GM03FBMCCQ"
        },
        {
          "value": "Plastic/Metal",
          "code": "GM03FBMCPJ"
        },
        {
          "value": "Cork",
          "code": "GM03FBMCCR"
        },
        {
          "value": "Plush",
          "code": "GM03FBMCPK"
        },
        {
          "value": "Crepe",
          "code": "GM03FBMCCS"
        },
        {
          "value": "Pointelle",
          "code": "GM03FBMCPL"
        },
        {
          "value": "Crinoline",
          "code": "GM03FBMCCT"
        },
        {
          "value": "Polycarbonate",
          "code": "GM03FBMCPM"
        },
        {
          "value": "Crochet",
          "code": "GM03FBMCCU"
        },
        {
          "value": "Ponte",
          "code": "GM03FBMCPN"
        },
        {
          "value": "Crochet/Openwork",
          "code": "GM03FBMCCV"
        },
        {
          "value": "Poplin",
          "code": "GM03FBMCPO"
        },
        {
          "value": "Croco",
          "code": "GM03FBMCCW"
        },
        {
          "value": "Porcelain",
          "code": "GM03FBMCPP"
        },
        {
          "value": "Croco Embossed",
          "code": "GM03FBMCCX"
        },
        {
          "value": "Portuguese Flannel",
          "code": "GM03FBMCPQ"
        },
        {
          "value": "Crystal",
          "code": "GM03FBMCCY"
        },
        {
          "value": "Propionate",
          "code": "GM03FBMCPR"
        },
        {
          "value": "Cubic Zirconia",
          "code": "GM03FBMCCZ"
        },
        {
          "value": "PU",
          "code": "GM03FBMCPS"
        },
        {
          "value": "Denim",
          "code": "GM03FBMCDA"
        },
        {
          "value": "Quartz",
          "code": "GM03FBMCQA"
        },
        {
          "value": "Diamond",
          "code": "GM03FBMCDB"
        },
        {
          "value": "Rattan",
          "code": "GM03FBMCRA"
        },
        {
          "value": "Dobby",
          "code": "GM03FBMCDC"
        },
        {
          "value": "Resin",
          "code": "GM03FBMCRB"
        },
        {
          "value": "Double Knit",
          "code": "GM03FBMCDD"
        },
        {
          "value": "Rhodium",
          "code": "GM03FBMCRC"
        },
        {
          "value": "Down",
          "code": "GM03FBMCDE"
        },
        {
          "value": "Ribbon",
          "code": "GM03FBMCRD"
        },
        {
          "value": "Down Fill",
          "code": "GM03FBMCDF"
        },
        {
          "value": "Rope",
          "code": "GM03FBMRE"
        },
        {
          "value": "Drop Needle",
          "code": "GM03FBMCDG"
        },
        {
          "value": "Saffiano",
          "code": "GM03FBMCSA"
        },
        {
          "value": "Earthenware",
          "code": "GM03FBMCEA"
        },
        {
          "value": "Sateen",
          "code": "GM03FBMCSB"
        },
        {
          "value": "Elephant Embossed",
          "code": "GM03FBMCEB"
        },
        {
          "value": "Satin",
          "code": "GM03FBMCSC"
        },
        {
          "value": "Enamel",
          "code": "GM03FBMCEC"
        },
        {
          "value": "Scuba",
          "code": "GM03FBMCSD"
        },
        {
          "value": "Enamel/Aluminum",
          "code": "GM03FBMCED"
        },
        {
          "value": "Seagrass",
          "code": "GM03FBMCSE"
        },
        {
          "value": "Enamel/Epoxy",
          "code": "GM03FBMCEF"
        },
        {
          "value": "Seersucker",
          "code": "GM03FBMCSF"
        },
        {
          "value": "Enamel/Iron",
          "code": "GM03FBMCEG"
        },
        {
          "value": "Sequin",
          "code": "GM03FBMCSG"
        },
        {
          "value": "Enamel/Steel",
          "code": "GM03FBMCЕН"
        },
        {
          "value": "Shantung",
          "code": "GM03FBMCSH"
        },
        {
          "value": "End-on-End",
          "code": "GM03FBMCEI"
        },
        {
          "value": "Shearling",
          "code": "GM03FBMCSI"
        },
        {
          "value": "Epoxy",
          "code": "GM03FBMCEJ"
        },
        {
          "value": "Sheeting",
          "code": "GM03FBMCSJ"
        },
        {
          "value": "Eyelet",
          "code": "GM03FBMСЕК"
        },
        {
          "value": "Shell",
          "code": "GM03FBMCSK"
        },
        {
          "value": "Fabric",
          "code": "GM03FBMCFA"
        },
        {
          "value": "Silicone",
          "code": "GM03FBMCSL"
        },
        {
          "value": "Faux Fur",
          "code": "GM03FBMCFB"
        },
        {
          "value": "Sinamay",
          "code": "GM03FBMCSM"
        },
        {
          "value": "Faux Leather",
          "code": "GM03FBMCFC"
        },
        {
          "value": "Slate",
          "code": "GM03FBMCSN"
        },
        {
          "value": "Faux Pearl",
          "code": "GM03FBMCFD"
        },
        {
          "value": "Slub",
          "code": "GM03FBMCSO"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03FBMCFE"
        },
        {
          "value": "Snake Embossed",
          "code": "GM03FBMCSP"
        },
        {
          "value": "Faux Suede",
          "code": "GM03FBMCFF"
        },
        {
          "value": "Snit",
          "code": "GM03FBMCSQ"
        },
        {
          "value": "Felt",
          "code": "GM03FBMCFG"
        },
        {
          "value": "Stainless Steel",
          "code": "GM03FBMCSR"
        },
        {
          "value": "Flannel",
          "code": "GM03FBMCFH"
        },
        {
          "value": "Steel",
          "code": "GM03FBMCST"
        },
        {
          "value": "Flat Knit",
          "code": "GM03FBMCFI"
        },
        {
          "value": "Sterling Silver",
          "code": "GM03FBMCSU"
        },
        {
          "value": "Fleece",
          "code": "GM03FBMCFJ"
        },
        {
          "value": "Stone",
          "code": "GM03FBMCSV"
        },
        {
          "value": "Foam",
          "code": "GM03FBMCFK"
        },
        {
          "value": "Stoneware",
          "code": "GM03FBMCSW"
        },
        {
          "value": "French Terry",
          "code": "GM03FBMCFL"
        },
        {
          "value": "Straw",
          "code": "GM03FBMCSX"
        },
        {
          "value": "Fresh Water Pearl",
          "code": "GM03FBMCFM"
        },
        {
          "value": "Styrofoam",
          "code": "GM03FBMCSY"
        },
        {
          "value": "Fur",
          "code": "GM03FBMCFN"
        },
        {
          "value": "Suede",
          "code": "GM03FBMCSZ"
        },
        {
          "value": "Gabardine",
          "code": "GM03FBMCGA"
        },
        {
          "value": "Sweater Yarn",
          "code": "GM03FBMCSS"
        },
        {
          "value": "Galvanized",
          "code": "GM03FBMCGB"
        },
        {
          "value": "Swiss Dot",
          "code": "GM03FBMCWI"
        },
        {
          "value": "Gauze",
          "code": "GM03FBMCGC"
        },
        {
          "value": "Synthetic",
          "code": "GM03FBMCYT"
        },
        {
          "value": "Genuine Stone",
          "code": "GM03FBMCGD"
        },
        {
          "value": "Taffeta",
          "code": "GM03FBMCТА"
        },
        {
          "value": "Georgette",
          "code": "GM03FBMCGE"
        },
        {
          "value": "Terra Cotta",
          "code": "GM03FBMCTB"
        },
        {
          "value": "Glass",
          "code": "GM03FBMCGF"
        },
        {
          "value": "Terry Cloth",
          "code": "GM03FBMCTC"
        },
        {
          "value": "Glitter",
          "code": "GM03FBMCGI"
        },
        {
          "value": "Thermal",
          "code": "GM03FBMCTD"
        },
        {
          "value": "Grenadine",
          "code": "GM03FBMCGG"
        },
        {
          "value": "Titanium",
          "code": "GM03FBMCTЕ"
        },
        {
          "value": "Grosgrain",
          "code": "GM03FBMCGH"
        },
        {
          "value": "Topaz",
          "code": "GM03FBMCTF"
        },
        {
          "value": "Hard Anodized",
          "code": "GM03FBMCHA"
        },
        {
          "value": "Tricot",
          "code": "GM03FBMCTG"
        },
        {
          "value": "Hatchi",
          "code": "GM03FBMCHB"
        },
        {
          "value": "Tri-Ply Stainless Steel",
          "code": "GM03FBMCTH"
        },
        {
          "value": "Heavy Gauge Steel",
          "code": "GM03FBMCHC"
        },
        {
          "value": "Tritan",
          "code": "GM03FBMCTI"
        },
        {
          "value": "High-Carbon Steel",
          "code": "GM03FBMCHD"
        },
        {
          "value": "Tulle",
          "code": "GM03FBMCT"
        },
        {
          "value": "Hopsack",
          "code": "GM03FBMCHE"
        },
        {
          "value": "Turquoise",
          "code": "GM03FBMCTK"
        },
        {
          "value": "Howlite",
          "code": "GM03FBMCHF"
        },
        {
          "value": "Tweed",
          "code": "GM03FBMCTL"
        },
        {
          "value": "Ironstone",
          "code": "GM03FBMCIA"
        },
        {
          "value": "Tweed/Boucle",
          "code": "GM03FBMCTM"
        },
        {
          "value": "Jacquard",
          "code": "GM03FBMCJA"
        },
        {
          "value": "Twill",
          "code": "GM03FBMCTN"
        },
        {
          "value": "Jade",
          "code": "GM03FBMCJB"
        },
        {
          "value": "Velour",
          "code": "GM03FBMCVA"
        },
        {
          "value": "Jasper",
          "code": "GM03FBMCJC"
        },
        {
          "value": "Velvet",
          "code": "GM03FBMCVB"
        },
        {
          "value": "Knit (Generic)",
          "code": "GM03FBMСKA"
        },
        {
          "value": "Velveteen",
          "code": "GM03FBMCVC"
        },
        {
          "value": "Knit Cable",
          "code": "GM03FBMCKB"
        },
        {
          "value": "Voile",
          "code": "GM03FBMCVD"
        },
        {
          "value": "Knit Fine Gauge",
          "code": "GM03FBMCKC"
        },
        {
          "value": "Waffle",
          "code": "GM03FBMCWA"
        },
        {
          "value": "Knit Intarsia",
          "code": "GM03FBMCKD"
        },
        {
          "value": "Wax",
          "code": "GM03FBMCWB"
        },
        {
          "value": "Knit Interlock",
          "code": "GM03FBMCKE"
        },
        {
          "value": "Wicker",
          "code": "GM03FBMCWC"
        },
        {
          "value": "Knit Jersey",
          "code": "GM03FBMCKF"
        },
        {
          "value": "Wire",
          "code": "GM03FBMCWD"
        },
        {
          "value": "Knit Ribbed",
          "code": "GM03FBMCKG"
        },
        {
          "value": "Wood",
          "code": "GM03FBMCWE"
        },
        {
          "value": "Knit/Woven",
          "code": "GM03FBMCKH"
        },
        {
          "value": "Wood Alternative",
          "code": "GM03FBMCWF"
        },
        {
          "value": "Knitted",
          "code": "GM03FBMCKI"
        },
        {
          "value": "Wool",
          "code": "GM03FBMCWG"
        },
        {
          "value": "Lace",
          "code": "GM03FBMCLA"
        },
        {
          "value": "Woven (generic)",
          "code": "GM03FBMCWH"
        },
        {
          "value": "Leather",
          "code": "GM03FBMCLB"
        },
        {
          "value": "Other",
          "code": "GM03FBMC99"
        },
        {
          "value": "Lizard Embossed",
          "code": "GM03FBMCLC"
        },
        {
          "value": "Magnesite",
          "code": "GM03FBMCMA"
        },
        {
          "value": "Magnet",
          "code": "GM03FBMCMB"
        },
        {
          "value": "Marble",
          "code": "GM03FBMCMC"
        }
      ]
    },
    {
      "codeListName": "Fur Animal Name",
      "values": [
        {
          "value": "Australian Brushtail Possum",
          "code": "GM03FANMAP"
        },
        {
          "value": "Otter",
          "code": "GM03FANMOU"
        },
        {
          "value": "Beaver",
          "code": "GM03FANMBV"
        },
        {
          "value": "Pony Hair",
          "code": "GM03FANMPH"
        },
        {
          "value": "Calf Hair",
          "code": "GM03FANMCH"
        },
        {
          "value": "Rabbit",
          "code": "GM03FANMRI"
        },
        {
          "value": "Fox",
          "code": "GM03FANMFX"
        },
        {
          "value": "Raccoon",
          "code": "GM03FANMRC"
        },
        {
          "value": "Golden Jackal",
          "code": "GM03FANMGJ"
        },
        {
          "value": "Sable",
          "code": "GM03FANMSG"
        },
        {
          "value": "Grey Wolf",
          "code": "GM03FANMGW"
        },
        {
          "value": "Skunk",
          "code": "GM03FANMSK"
        },
        {
          "value": "Marten",
          "code": "GM03FANMΜΑ"
        },
        {
          "value": "Other Fur Animal*",
          "code": "GM04FANM99"
        },
        {
          "value": "Mink",
          "code": "GM03FANMMK"
        }
      ]
    },
    {
      "codeListName": "Fur Treatment",
      "values": [
        {
          "value": "Artificially Colored",
          "code": "GM03FTMTAC"
        },
        {
          "value": "Natural (untreated)",
          "code": "GM03FTMTΝΑ"
        },
        {
          "value": "Bleached",
          "code": "GM03FTMTBM"
        },
        {
          "value": "Painted",
          "code": "GM03FTMTPT"
        },
        {
          "value": "Dyed",
          "code": "GM03FTMTDY"
        },
        {
          "value": "Other Fur Treatment",
          "code": "GM04FTMT99"
        }
      ]
    },
    {
      "codeListName": "Gender",
      "values": [
        {
          "value": "Female",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Gender Neutral",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        }
      ]
    },
    {
      "codeListName": "Adjustable Strap",
      "values": [
        {
          "value": "Fully Adjustable",
          "code": "GM03ADSTFA"
        },
        {
          "value": "Partially Adjustable",
          "code": "GM03ADSTPA"
        },
        {
          "value": "Non-Adjustable",
          "code": "GM03ADSTNA"
        },
        {
          "value": "Other",
          "code": "GM03ADST99"
        }
      ]
    },
    {
      "codeListName": "Lining Material",
      "values": [
        {
          "value": "Antimicrobial",
          "code": "GM03LIMTAN"
        },
        {
          "value": "Nylon",
          "code": "GM03LIMTNY"
        },
        {
          "value": "Cotton",
          "code": "GM03LIMTCT"
        },
        {
          "value": "Organic Material",
          "code": "GM03LIMTOM"
        },
        {
          "value": "Fabric",
          "code": "GM03LIMTFD"
        },
        {
          "value": "Polyester",
          "code": "GM03LIMTPR"
        },
        {
          "value": "Faux Fur",
          "code": "GM03LIMTFB"
        },
        {
          "value": "PU",
          "code": "GM03LIMTPU"
        },
        {
          "value": "Faux Leather",
          "code": "GM03LIMTFL"
        },
        {
          "value": "PVC",
          "code": "GM03LIMTPV"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03LIMTFS"
        },
        {
          "value": "Quilted",
          "code": "GM03LIMTQT"
        },
        {
          "value": "Fleece",
          "code": "GM03LIMTFC"
        },
        {
          "value": "Shearling Lined",
          "code": "GM03LIMTSL"
        },
        {
          "value": "Gel",
          "code": "GM03LIMTGE"
        },
        {
          "value": "Sherpa",
          "code": "GM03LIMTSP"
        },
        {
          "value": "Leather",
          "code": "GM03LIMTLE"
        },
        {
          "value": "Straw",
          "code": "GM03LIMTST"
        },
        {
          "value": "Logo Lining",
          "code": "GM03LIMTLL"
        },
        {
          "value": "Synthetic",
          "code": "GM03LIMTSY"
        },
        {
          "value": "Memory Foam",
          "code": "GM03LIMTMF"
        },
        {
          "value": "Taffeta",
          "code": "GM03LIMTTA"
        },
        {
          "value": "Mesh",
          "code": "GM03LIMTME"
        },
        {
          "value": "Other",
          "code": "GM04LIMT99"
        }
      ]
    }
  ],
  "Jewelry": [
    {
      "codeListName": "Advertised Origin",
      "values": [
        {
          "value": "Imported",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Made in Canada",
          "code": "GM03ADVOMC"
        },
        {
          "value": "Made in U.S.A.",
          "code": "GM03ADVOMU"
        },
        {
          "value": "Made in U.S.A. and Imported",
          "code": "GM03ADVOUI"
        },
        {
          "value": "Made in U.S.A. or Imported",
          "code": "GM03ADVOUO"
        },
        {
          "value": "Made in another country*",
          "code": "GM04ADV099"
        }
      ]
    },
    {
      "codeListName": "Bracelet Type",
      "values": [
        {
          "value": "Adjustable",
          "code": "JW03BRTTAD"
        },
        {
          "value": "Hinge",
          "code": "JW03BRTTHN"
        },
        {
          "value": "Bangle",
          "code": "JW03BRTTВА"
        },
        {
          "value": "Line",
          "code": "JW03BRTTLI"
        },
        {
          "value": "Bracelet Set",
          "code": "JW03BRTTBS"
        },
        {
          "value": "Open Cuff",
          "code": "JW03BRTTOC"
        },
        {
          "value": "Chain",
          "code": "JW03BRTTCH"
        },
        {
          "value": "Stretch",
          "code": "JW03BRTTST"
        },
        {
          "value": "Charm",
          "code": "JW03BRTTCM"
        },
        {
          "value": "Wrap",
          "code": "JW03BRTTWR"
        },
        {
          "value": "Coil",
          "code": "JW03BRTTCL"
        },
        {
          "value": "Other",
          "code": "JW04BRTT99"
        },
        {
          "value": "Cuff",
          "code": "JW03BRTTCF"
        }
      ]
    },
    {
      "codeListName": "Closure",
      "values": [
        {
          "value": "Adjustable/Pull",
          "code": "GM03CLOSAP"
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        },
        {
          "value": "Back",
          "code": "GM03CLOSBC"
        },
        {
          "value": "Latch",
          "code": "GM03CLOSLA"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Click Top",
          "code": "GM03CLOSCT"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "Elastic Lace with Toggle",
          "code": "GM03CLOSET"
        },
        {
          "value": "Swivel",
          "code": "GM03CLOSSW"
        },
        {
          "value": "O Ring",
          "code": "GM03CLOSDO"
        },
        {
          "value": "Tab",
          "code": "GM03CLOSTB"
        },
        {
          "value": "Fishhook",
          "code": "GM03CLOSFS"
        },
        {
          "value": "Tie",
          "code": "GM03CLOSTI"
        },
        {
          "value": "Flap",
          "code": "GM03CLOSFP"
        },
        {
          "value": "Tie Back/Halter",
          "code": "GM03CLOSTH"
        },
        {
          "value": "Foldover",
          "code": "GM03CLOSFO"
        },
        {
          "value": "Tie Front",
          "code": "GM03CLOSTF"
        },
        {
          "value": "French Wire",
          "code": "GM03CLOSFW"
        },
        {
          "value": "Tie Side",
          "code": "GM03CLOSTS"
        },
        {
          "value": "Frog/Button Loop",
          "code": "GM03CLOSFA"
        },
        {
          "value": "Toggle",
          "code": "GM03CLOSTO"
        },
        {
          "value": "Front Button/Zip",
          "code": "GM03CLOSFZ"
        },
        {
          "value": "Toggle Front",
          "code": "GM03CLOSTN"
        },
        {
          "value": "Front Hook/Zip",
          "code": "GM03CLOSFH"
        },
        {
          "value": "Top Zip",
          "code": "GM03CLOSTZ"
        },
        {
          "value": "Hidden Button Front",
          "code": "GM03CLOSHB"
        },
        {
          "value": "Tunnel Side Tie",
          "code": "GM03CLOSTQ"
        },
        {
          "value": "Hidden Snap Front",
          "code": "GM03CLOSHS"
        },
        {
          "value": "Turn Lock",
          "code": "GM03CLOSTL"
        },
        {
          "value": "Hidden Zip Front",
          "code": "GM03CLOSHZ"
        },
        {
          "value": "Wrap",
          "code": "GM03CLOSWR"
        },
        {
          "value": "Hinged",
          "code": "GM03CLOSHI"
        },
        {
          "value": "Zipper",
          "code": "GM03CLOSZI"
        },
        {
          "value": "Hinged/Foldover",
          "code": "GM03CLOSHE"
        },
        {
          "value": "Zipper Back",
          "code": "GM03CLOSZB"
        },
        {
          "value": "Hook",
          "code": "GM03CLOSHO"
        },
        {
          "value": "Zipper Back Partial",
          "code": "GM03CLOSZP"
        },
        {
          "value": "Hook and Loop",
          "code": "GM03CLOSHL"
        },
        {
          "value": "Zipper Front",
          "code": "GM03CLOSZE"
        },
        {
          "value": "Hook-and-eye",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back Front",
          "code": "GM03CLOSHD"
        },
        {
          "value": "Zipper Side",
          "code": "GM03CLOSZS"
        },
        {
          "value": "Keyhole Button",
          "code": "GM03CLOSKB"
        },
        {
          "value": "Zipper Around",
          "code": "GM03CLOSZA"
        },
        {
          "value": "Kiss-Lock",
          "code": "GM03CLOSKL"
        },
        {
          "value": "1/4 Zip",
          "code": "GM03CLOSZQ"
        },
        {
          "value": "Knot",
          "code": "GM03CLOSKN"
        },
        {
          "value": "1/2 Zip",
          "code": "GM03CLOSZH"
        },
        {
          "value": "Lace Up",
          "code": "GM03CLOSLU"
        },
        {
          "value": "Other Closure",
          "code": "GM04CLOS99"
        }
      ]
    },
    {
      "codeListName": "Consumer Life Stage",
      "values": [
        {
          "value": "Adult",
          "code": "GM03CNLSAD"
        },
        {
          "value": "Teen",
          "code": "GM03CNLSTE"
        },
        {
          "value": "All Ages",
          "code": "GM03CNLSAG"
        },
        {
          "value": "Toddler",
          "code": "GM03CNLTDD"
        },
        {
          "value": "Baby/Infant",
          "code": "GM03CNLSBI"
        },
        {
          "value": "Unclassified",
          "code": "GM03CNLSYA"
        },
        {
          "value": "Child",
          "code": "GM03CNLSCH"
        },
        {
          "value": "Unidentified",
          "code": "GM03CNLSUC"
        },
        {
          "value": "Child 1-2 Years",
          "code": "GM03CNLSCT"
        },
        {
          "value": "Young Adult",
          "code": "GM03CNLSYA"
        },
        {
          "value": "Child 2 Years Onwards",
          "code": "GM03CNLSCW"
        },
        {
          "value": "Other",
          "code": "GM04CNLS99"
        },
        {
          "value": "Preemie",
          "code": "GM03CNLSPR"
        }
      ]
    },
    {
      "codeListName": "Fabric or Material",
      "values": [
        {
          "value": "14K Gold",
          "code": "GM03FBMC14"
        },
        {
          "value": "Marble/Wood",
          "code": "GM03FBMCMD"
        },
        {
          "value": "18K Gold",
          "code": "GM03FBMC18"
        },
        {
          "value": "Matte Jersey",
          "code": "GM03FBMCME"
        },
        {
          "value": "Agate",
          "code": "GM03FBMCAG"
        },
        {
          "value": "Melamine",
          "code": "GM03FBMCMF"
        },
        {
          "value": "Aluminum",
          "code": "GM03FBMCAL"
        },
        {
          "value": "Mercury Glass",
          "code": "GM03FBMCMG"
        },
        {
          "value": "Amethyst",
          "code": "GM03FBMCAM"
        },
        {
          "value": "Mesh",
          "code": "GM03FBMCMH"
        },
        {
          "value": "Anodized Aluminum",
          "code": "GM03FBMCAN"
        },
        {
          "value": "Metal",
          "code": "GM03FBMCMI"
        },
        {
          "value": "Beaded",
          "code": "GM03FBMCBD"
        },
        {
          "value": "Metal Alloy",
          "code": "GM03FBMCMJ"
        },
        {
          "value": "Birthstone",
          "code": "GM03FBMCBE"
        },
        {
          "value": "Metallic",
          "code": "GM03FBMCMK"
        },
        {
          "value": "Bi-stretch",
          "code": "GM03FBMCBF"
        },
        {
          "value": "Microfiber",
          "code": "GM03FBMCML"
        },
        {
          "value": "Bone",
          "code": "GM03FBMCBG"
        },
        {
          "value": "Microfleece",
          "code": "GM03FBMCMM"
        },
        {
          "value": "Boucle",
          "code": "GM03FBMCBH"
        },
        {
          "value": "Mikado",
          "code": "GM03FBMCMN"
        },
        {
          "value": "Brass",
          "code": "GM03FBMCBI"
        },
        {
          "value": "Mixed Materials",
          "code": "GM03FBMCMO"
        },
        {
          "value": "Broadcloth",
          "code": "GM03FBMCBJ"
        },
        {
          "value": "Mogador",
          "code": "GM03FBMCMP"
        },
        {
          "value": "Brocade",
          "code": "GM03FBMCBL"
        },
        {
          "value": "Moleskin",
          "code": "GM03FBMCMQ"
        },
        {
          "value": "Bronze",
          "code": "GM03FBMCBN"
        },
        {
          "value": "Mother-of-Pearl",
          "code": "GM03FBMCMR"
        },
        {
          "value": "Brushed Back Satin",
          "code": "GM03FBMCBS"
        },
        {
          "value": "Natural",
          "code": "GM03FBMCNA"
        },
        {
          "value": "Brushed Back Terry",
          "code": "GM03FBMCBT"
        },
        {
          "value": "Natural Fiber",
          "code": "GM03FBMCNB"
        },
        {
          "value": "Burlap",
          "code": "GM03FBMCBU"
        },
        {
          "value": "Nonstick",
          "code": "GM03FBMCNC"
        },
        {
          "value": "Canvas",
          "code": "GM03FBMCCA"
        },
        {
          "value": "Nubuck",
          "code": "GM03FBMCND"
        },
        {
          "value": "Cashmink",
          "code": "GM03FBMCCB"
        },
        {
          "value": "Onyx",
          "code": "GM03FBMCOA"
        },
        {
          "value": "Cast Aluminum",
          "code": "GM03FBMCCC"
        },
        {
          "value": "Opal",
          "code": "GM03FBMСОВ"
        },
        {
          "value": "Cast Iron",
          "code": "GM03FBMCCD"
        },
        {
          "value": "Organza",
          "code": "GM03FBMCOC"
        },
        {
          "value": "Ceramic",
          "code": "GM03FBMCCE"
        },
        {
          "value": "Ostrich",
          "code": "GM03FBMCOD"
        },
        {
          "value": "Challis",
          "code": "GM03FBMCCF"
        },
        {
          "value": "Ostrich Embossed",
          "code": "GM03FBMCOE"
        },
        {
          "value": "Chambray",
          "code": "GM03FBMCCG"
        },
        {
          "value": "Oxford",
          "code": "GM03FBMCOF"
        },
        {
          "value": "Charmeuse",
          "code": "GM03FBMCCH"
        },
        {
          "value": "Palladium",
          "code": "GM03FBMCPA"
        },
        {
          "value": "Chenille",
          "code": "GM03FBMCCI"
        },
        {
          "value": "Paper Braid",
          "code": "GM03FBMCPB"
        },
        {
          "value": "Chiffon/Sheer",
          "code": "GM03FBMCCJ"
        },
        {
          "value": "Patent Leather",
          "code": "GM03FBMCPC"
        },
        {
          "value": "Coated Canvas",
          "code": "GM03FBMCCK"
        },
        {
          "value": "Pearl",
          "code": "GM03FBMCPD"
        },
        {
          "value": "Composite",
          "code": "GM03FBMCCL"
        },
        {
          "value": "Percale",
          "code": "GM03FBMCPE"
        },
        {
          "value": "Confetti",
          "code": "GM03FBMCCM"
        },
        {
          "value": "Pinpoint",
          "code": "GM03FBMCPF"
        },
        {
          "value": "Copper",
          "code": "GM03FBMCCN"
        },
        {
          "value": "Pique",
          "code": "GM03FBMCPG"
        },
        {
          "value": "Coral",
          "code": "GM03FBMCCO"
        },
        {
          "value": "Plastic",
          "code": "GM03FBMCPH"
        },
        {
          "value": "Corduroy",
          "code": "GM03FBMCСР"
        },
        {
          "value": "Plastic/Acetate",
          "code": "GM03FBMCPI"
        },
        {
          "value": "Corian",
          "code": "GM03FBMCCQ"
        },
        {
          "value": "Plastic/Metal",
          "code": "GM03FBMCPJ"
        },
        {
          "value": "Cork",
          "code": "GM03FBMCCR"
        },
        {
          "value": "Plush",
          "code": "GM03FBMCPK"
        },
        {
          "value": "Crepe",
          "code": "GM03FBMCCS"
        },
        {
          "value": "Pointelle",
          "code": "GM03FBMCPL"
        },
        {
          "value": "Crinoline",
          "code": "GM03FBMCCT"
        },
        {
          "value": "Polycarbonate",
          "code": "GM03FBMCPM"
        },
        {
          "value": "Crochet",
          "code": "GM03FBMCCU"
        },
        {
          "value": "Ponte",
          "code": "GM03FBMCPN"
        },
        {
          "value": "Crochet/Openwork",
          "code": "GM03FBMCCV"
        },
        {
          "value": "Poplin",
          "code": "GM03FBMCPO"
        },
        {
          "value": "Croco",
          "code": "GM03FBMCCW"
        },
        {
          "value": "Porcelain",
          "code": "GM03FBMCPP"
        },
        {
          "value": "Croco Embossed",
          "code": "GM03FBMCCX"
        },
        {
          "value": "Portuguese Flannel",
          "code": "GM03FBMCPQ"
        },
        {
          "value": "Crystal",
          "code": "GM03FBMCCY"
        },
        {
          "value": "Propionate",
          "code": "GM03FBMCPR"
        },
        {
          "value": "Cubic Zirconia",
          "code": "GM03FBMCCZ"
        },
        {
          "value": "PU",
          "code": "GM03FBMCPS"
        },
        {
          "value": "Denim",
          "code": "GM03FBMCDA"
        },
        {
          "value": "Quartz",
          "code": "GM03FBMCQA"
        },
        {
          "value": "Diamond",
          "code": "GM03FBMCDB"
        },
        {
          "value": "Rattan",
          "code": "GM03FBMCRA"
        },
        {
          "value": "Dobby",
          "code": "GM03FBMCDC"
        },
        {
          "value": "Resin",
          "code": "GM03FBMCRB"
        },
        {
          "value": "Double Knit",
          "code": "GM03FBMCDD"
        },
        {
          "value": "Rhodium",
          "code": "GM03FBMCRC"
        },
        {
          "value": "Down",
          "code": "GM03FBMCDE"
        },
        {
          "value": "Ribbon",
          "code": "GM03FBMCRD"
        },
        {
          "value": "Down Fill",
          "code": "GM03FBMCDF"
        },
        {
          "value": "Rope",
          "code": "GM03FBMRE"
        },
        {
          "value": "Drop Needle",
          "code": "GM03FBMCDG"
        },
        {
          "value": "Saffiano",
          "code": "GM03FBMCSA"
        },
        {
          "value": "Earthenware",
          "code": "GM03FBMCEA"
        },
        {
          "value": "Sateen",
          "code": "GM03FBMCSB"
        },
        {
          "value": "Elephant Embossed",
          "code": "GM03FBMCEB"
        },
        {
          "value": "Satin",
          "code": "GM03FBMCSC"
        },
        {
          "value": "Enamel",
          "code": "GM03FBMCEC"
        },
        {
          "value": "Scuba",
          "code": "GM03FBMCSD"
        },
        {
          "value": "Enamel/Aluminum",
          "code": "GM03FBMCED"
        },
        {
          "value": "Seagrass",
          "code": "GM03FBMCSE"
        },
        {
          "value": "Enamel/Epoxy",
          "code": "GM03FBMCEF"
        },
        {
          "value": "Seersucker",
          "code": "GM03FBMCSF"
        },
        {
          "value": "Enamel/Iron",
          "code": "GM03FBMCEG"
        },
        {
          "value": "Sequin",
          "code": "GM03FBMCSG"
        },
        {
          "value": "Enamel/Steel",
          "code": "GM03FBMCЕН"
        },
        {
          "value": "Shantung",
          "code": "GM03FBMCSH"
        },
        {
          "value": "End-on-End",
          "code": "GM03FBMCEI"
        },
        {
          "value": "Shearling",
          "code": "GM03FBMCSI"
        },
        {
          "value": "Epoxy",
          "code": "GM03FBMCEJ"
        },
        {
          "value": "Sheeting",
          "code": "GM03FBMCSJ"
        },
        {
          "value": "Eyelet",
          "code": "GM03FBMСЕК"
        },
        {
          "value": "Shell",
          "code": "GM03FBMCSK"
        },
        {
          "value": "Fabric",
          "code": "GM03FBMCFA"
        },
        {
          "value": "Silicone",
          "code": "GM03FBMCSL"
        },
        {
          "value": "Faux Fur",
          "code": "GM03FBMCFB"
        },
        {
          "value": "Sinamay",
          "code": "GM03FBMCSM"
        },
        {
          "value": "Faux Leather",
          "code": "GM03FBMCFC"
        },
        {
          "value": "Slate",
          "code": "GM03FBMCSN"
        },
        {
          "value": "Faux Pearl",
          "code": "GM03FBMCFD"
        },
        {
          "value": "Slub",
          "code": "GM03FBMCSO"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03FBMCFE"
        },
        {
          "value": "Snake Embossed",
          "code": "GM03FBMCSP"
        },
        {
          "value": "Faux Suede",
          "code": "GM03FBMCFF"
        },
        {
          "value": "Snit",
          "code": "GM03FBMCSQ"
        },
        {
          "value": "Felt",
          "code": "GM03FBMCFG"
        },
        {
          "value": "Stainless Steel",
          "code": "GM03FBMCSR"
        },
        {
          "value": "Flannel",
          "code": "GM03FBMCFH"
        },
        {
          "value": "Steel",
          "code": "GM03FBMCST"
        },
        {
          "value": "Flat Knit",
          "code": "GM03FBMCFI"
        },
        {
          "value": "Sterling Silver",
          "code": "GM03FBMCSU"
        },
        {
          "value": "Fleece",
          "code": "GM03FBMCFJ"
        },
        {
          "value": "Stone",
          "code": "GM03FBMCSV"
        },
        {
          "value": "Foam",
          "code": "GM03FBMCFK"
        },
        {
          "value": "Stoneware",
          "code": "GM03FBMCSW"
        },
        {
          "value": "French Terry",
          "code": "GM03FBMCFL"
        },
        {
          "value": "Straw",
          "code": "GM03FBMCSX"
        },
        {
          "value": "Fresh Water Pearl",
          "code": "GM03FBMCFM"
        },
        {
          "value": "Styrofoam",
          "code": "GM03FBMCSY"
        },
        {
          "value": "Fur",
          "code": "GM03FBMCFN"
        },
        {
          "value": "Suede",
          "code": "GM03FBMCSZ"
        },
        {
          "value": "Gabardine",
          "code": "GM03FBMCGA"
        },
        {
          "value": "Sweater Yarn",
          "code": "GM03FBMCSS"
        },
        {
          "value": "Galvanized",
          "code": "GM03FBMCGB"
        },
        {
          "value": "Swiss Dot",
          "code": "GM03FBMCWI"
        },
        {
          "value": "Gauze",
          "code": "GM03FBMCGC"
        },
        {
          "value": "Synthetic",
          "code": "GM03FBMCYT"
        },
        {
          "value": "Genuine Stone",
          "code": "GM03FBMCGD"
        },
        {
          "value": "Taffeta",
          "code": "GM03FBMCТА"
        },
        {
          "value": "Georgette",
          "code": "GM03FBMCGE"
        },
        {
          "value": "Terra Cotta",
          "code": "GM03FBMCTB"
        },
        {
          "value": "Glass",
          "code": "GM03FBMCGF"
        },
        {
          "value": "Terry Cloth",
          "code": "GM03FBMCTC"
        },
        {
          "value": "Glitter",
          "code": "GM03FBMCGI"
        },
        {
          "value": "Thermal",
          "code": "GM03FBMCTD"
        },
        {
          "value": "Grenadine",
          "code": "GM03FBMCGG"
        },
        {
          "value": "Titanium",
          "code": "GM03FBMCTЕ"
        },
        {
          "value": "Grosgrain",
          "code": "GM03FBMCGH"
        },
        {
          "value": "Topaz",
          "code": "GM03FBMCTF"
        },
        {
          "value": "Hard Anodized",
          "code": "GM03FBMCHA"
        },
        {
          "value": "Tricot",
          "code": "GM03FBMCTG"
        },
        {
          "value": "Hatchi",
          "code": "GM03FBMCHB"
        },
        {
          "value": "Tri-Ply Stainless Steel",
          "code": "GM03FBMCTH"
        },
        {
          "value": "Heavy Gauge Steel",
          "code": "GM03FBMCHC"
        },
        {
          "value": "Tritan",
          "code": "GM03FBMCTI"
        },
        {
          "value": "High-Carbon Steel",
          "code": "GM03FBMCHD"
        },
        {
          "value": "Tulle",
          "code": "GM03FBMCT"
        },
        {
          "value": "Hopsack",
          "code": "GM03FBMCHE"
        },
        {
          "value": "Turquoise",
          "code": "GM03FBMCTK"
        },
        {
          "value": "Howlite",
          "code": "GM03FBMCHF"
        },
        {
          "value": "Tweed",
          "code": "GM03FBMCTL"
        },
        {
          "value": "Ironstone",
          "code": "GM03FBMCIA"
        },
        {
          "value": "Tweed/Boucle",
          "code": "GM03FBMCTM"
        },
        {
          "value": "Jacquard",
          "code": "GM03FBMCJA"
        },
        {
          "value": "Twill",
          "code": "GM03FBMCTN"
        },
        {
          "value": "Jade",
          "code": "GM03FBMCJB"
        },
        {
          "value": "Velour",
          "code": "GM03FBMCVA"
        },
        {
          "value": "Jasper",
          "code": "GM03FBMCJC"
        },
        {
          "value": "Velvet",
          "code": "GM03FBMCVB"
        },
        {
          "value": "Knit (Generic)",
          "code": "GM03FBMСKA"
        },
        {
          "value": "Velveteen",
          "code": "GM03FBMCVC"
        },
        {
          "value": "Knit Cable",
          "code": "GM03FBMCKB"
        },
        {
          "value": "Voile",
          "code": "GM03FBMCVD"
        },
        {
          "value": "Knit Fine Gauge",
          "code": "GM03FBMCKC"
        },
        {
          "value": "Waffle",
          "code": "GM03FBMCWA"
        },
        {
          "value": "Knit Intarsia",
          "code": "GM03FBMCKD"
        },
        {
          "value": "Wax",
          "code": "GM03FBMCWB"
        },
        {
          "value": "Knit Interlock",
          "code": "GM03FBMCKE"
        },
        {
          "value": "Wicker",
          "code": "GM03FBMCWC"
        },
        {
          "value": "Knit Jersey",
          "code": "GM03FBMCKF"
        },
        {
          "value": "Wire",
          "code": "GM03FBMCWD"
        },
        {
          "value": "Knit Ribbed",
          "code": "GM03FBMCKG"
        },
        {
          "value": "Wood",
          "code": "GM03FBMCWE"
        },
        {
          "value": "Knit/Woven",
          "code": "GM03FBMCKH"
        },
        {
          "value": "Wood Alternative",
          "code": "GM03FBMCWF"
        },
        {
          "value": "Knitted",
          "code": "GM03FBMCKI"
        },
        {
          "value": "Wool",
          "code": "GM03FBMCWG"
        },
        {
          "value": "Lace",
          "code": "GM03FBMCLA"
        },
        {
          "value": "Woven (generic)",
          "code": "GM03FBMCWH"
        },
        {
          "value": "Leather",
          "code": "GM03FBMCLB"
        },
        {
          "value": "Other",
          "code": "GM03FBMC99"
        },
        {
          "value": "Lizard Embossed",
          "code": "GM03FBMCLC"
        },
        {
          "value": "Magnesite",
          "code": "GM03FBMCMA"
        },
        {
          "value": "Magnet",
          "code": "GM03FBMCMB"
        },
        {
          "value": "Marble",
          "code": "GM03FBMCMC"
        }
      ]
    },
    {
      "codeListName": "Gender",
      "values": [
        {
          "value": "Female",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Gender Neutral",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        }
      ]
    },
    {
      "codeListName": "Jewelry Type",
      "values": [
        {
          "value": "Costume",
          "code": "JW03JWLTCS"
        },
        {
          "value": "Fine",
          "code": "JW03JWLTFI"
        },
        {
          "value": "Fashion",
          "code": "JW03JWLTFA"
        },
        {
          "value": "Other",
          "code": "JW04JWLT99"
        }
      ]
    },
    {
      "codeListName": "Earring Type",
      "values": [
        {
          "value": "Button",
          "code": "JW03EATPBU"
        },
        {
          "value": "Ear Wrap",
          "code": "JW03EATPEW"
        },
        {
          "value": "Chandelier",
          "code": "JW03EATPCH"
        },
        {
          "value": "Hoop",
          "code": "JW03EATPΗΡ"
        },
        {
          "value": "Drop",
          "code": "JW03EATPDR"
        },
        {
          "value": "Stud",
          "code": "JW03EATPST"
        },
        {
          "value": "Ear Cuff",
          "code": "JW03EATPЕС"
        },
        {
          "value": "Other",
          "code": "JW04EATP99"
        },
        {
          "value": "Ear Jacket",
          "code": "JW03EATPEJ"
        }
      ]
    },
    {
      "codeListName": "Necklace Type",
      "values": [
        {
          "value": "Chain",
          "code": "JW03NKLCCA"
        },
        {
          "value": "Pearl Strand",
          "code": "JW03NKLCPS"
        },
        {
          "value": "Choker",
          "code": "JW03NKLCCH"
        },
        {
          "value": "Pendant",
          "code": "JW03NKLCPE"
        },
        {
          "value": "Collar",
          "code": "JW03NKLCCL"
        },
        {
          "value": "Y-Necklace",
          "code": "JW03NKLCYN"
        },
        {
          "value": "Locket",
          "code": "JW03NKLCLK"
        },
        {
          "value": "Other",
          "code": "JW04NKLC99"
        },
        {
          "value": "Multi Strand",
          "code": "JW03NKLCMS"
        }
      ]
    },
    {
      "codeListName": "Ring Type",
      "values": [
        {
          "value": "Band",
          "code": "JW03RINGBA"
        },
        {
          "value": "Stacked",
          "code": "JW03RINGST"
        },
        {
          "value": "Midi",
          "code": "JW03RINGMI"
        },
        {
          "value": "Toe",
          "code": "JW03RINGTE"
        },
        {
          "value": "Signet",
          "code": "JW03RINGSI"
        },
        {
          "value": "Other",
          "code": "JW04RING99"
        }
      ]
    },
    {
      "codeListName": "Band Type",
      "values": [
        {
          "value": "Bangle",
          "code": "JW03WBNDBA"
        },
        {
          "value": "Bracelet",
          "code": "JW03WBNDBR"
        },
        {
          "value": "Cuff",
          "code": "JW03WBNDCU"
        },
        {
          "value": "NATO Strap",
          "code": "JW03WBNDNA"
        },
        {
          "value": "Strap",
          "code": "JW03WBNDST"
        },
        {
          "value": "Other",
          "code": "JW04WBND99"
        }
      ]
    },
    {
      "codeListName": "Watch Case Shape",
      "values": [
        {
          "value": "Oval",
          "code": "JW03WACSVA"
        },
        {
          "value": "Square",
          "code": "JW03WACSSQ"
        },
        {
          "value": "Rectangular",
          "code": "JW03WACSRE"
        },
        {
          "value": "Other",
          "code": "JW04WACS99"
        },
        {
          "value": "Round",
          "code": "JW03WACSRN"
        }
      ]
    }
  ],
  "Beauty": [
    {
      "codeListName": "Advertised Origin",
      "values": [
        {
          "value": "Imported",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Made in Canada",
          "code": "GM03ADVOMC"
        },
        {
          "value": "Made in U.S.A.",
          "code": "GM03ADVOMU"
        },
        {
          "value": "Made in U.S.A. and Imported",
          "code": "GM03ADVOUI"
        },
        {
          "value": "Made in U.S.A. or Imported",
          "code": "GM03ADVOUO"
        },
        {
          "value": "Made in another country*",
          "code": "GM04ADV099"
        }
      ]
    },
    {
      "codeListName": "Beauty Type",
      "values": [
        {
          "value": "After Shave",
          "code": "GM03BETYAS"
        },
        {
          "value": "Mask",
          "code": "GM03BETYMK"
        },
        {
          "value": "Base Coat",
          "code": "GM03BETYBC"
        },
        {
          "value": "Make-up Brush",
          "code": "GM03BETYMB"
        },
        {
          "value": "BB/CC",
          "code": "GM03BETYBB"
        },
        {
          "value": "Make-up Brush Cleaner",
          "code": "GM03BETYMC"
        },
        {
          "value": "Blush/Bronzer",
          "code": "GM03BETYBL"
        },
        {
          "value": "Mirror",
          "code": "GM03BETYMI"
        },
        {
          "value": "Blade Sharpener",
          "code": "GM03BETYBR"
        },
        {
          "value": "Moisturizer",
          "code": "GM03BETYΜΟ"
        },
        {
          "value": "Beauty Spray",
          "code": "GM03BETYBS"
        },
        {
          "value": "Multi-use Palette",
          "code": "GM03BETYMP"
        },
        {
          "value": "Cleansing Brush",
          "code": "GM03BETYCB"
        },
        {
          "value": "Make-up Remover",
          "code": "GM03BETYMR"
        },
        {
          "value": "Curling Iron",
          "code": "GM03BETYCI"
        },
        {
          "value": "Manicure Set",
          "code": "GM03BETYMS"
        },
        {
          "value": "Cleanser",
          "code": "GM03BETYCL"
        },
        {
          "value": "Nail Polish",
          "code": "GM03BETYNP"
        },
        {
          "value": "Conditioner",
          "code": "GM03BETYCN"
        },
        {
          "value": "Perfume/Cologne",
          "code": "GM03BETYPC"
        },
        {
          "value": "Concealer",
          "code": "GM03BETYCO"
        },
        {
          "value": "Plumper",
          "code": "GM03BETYPL"
        },
        {
          "value": "Diffuser",
          "code": "GM03BETYDI"
        },
        {
          "value": "Powder",
          "code": "GM03BETYΡΟ"
        },
        {
          "value": "Curler",
          "code": "GM03BETYEC"
        },
        {
          "value": "Primer",
          "code": "GM03BETYPR"
        },
        {
          "value": "Eyebrow Enhancer",
          "code": "GM03BETYEE"
        },
        {
          "value": "Pencil Sharpener",
          "code": "GM03BETYPS"
        },
        {
          "value": "Electric Razor",
          "code": "GM03BETYER"
        },
        {
          "value": "Pre-Shave",
          "code": "GM03BETYPE"
        },
        {
          "value": "Eye Shadow",
          "code": "GM03BETYES"
        },
        {
          "value": "Razor",
          "code": "GM03BETYRA"
        },
        {
          "value": "Exfoliator",
          "code": "GM03BETYEX"
        },
        {
          "value": "Razor Blade",
          "code": "GM03BETYRB"
        },
        {
          "value": "False Eyelashes",
          "code": "GM03BETYFE"
        },
        {
          "value": "Shave Brush",
          "code": "GM03BETYSB"
        },
        {
          "value": "Flat Iron",
          "code": "GM03BETYFI"
        },
        {
          "value": "Shaving Cream",
          "code": "GM03BETYSC"
        },
        {
          "value": "Foundation",
          "code": "GM03BETYFO"
        },
        {
          "value": "Sun Care",
          "code": "GM03BETYSU"
        },
        {
          "value": "Gloss",
          "code": "GM03BETYGL"
        },
        {
          "value": "Serum",
          "code": "GM03BETYSE"
        },
        {
          "value": "Groomer",
          "code": "GM03BETYGR"
        },
        {
          "value": "Shampoo",
          "code": "GM03BETYSH"
        },
        {
          "value": "Hair Brush",
          "code": "GM03BETYHB"
        },
        {
          "value": "Shave Bowl",
          "code": "GM03BETYSL"
        },
        {
          "value": "Hair Dryer",
          "code": "GM03BETYHD"
        },
        {
          "value": "Sponge",
          "code": "GM03BETYSP"
        },
        {
          "value": "Hair Spray",
          "code": "GM03BETYHS"
        },
        {
          "value": "Shave Set",
          "code": "GM03BETYSS"
        },
        {
          "value": "Hair Trimmer",
          "code": "GM03BETYНТ"
        },
        {
          "value": "Styling Product",
          "code": "GM03BETYST"
        },
        {
          "value": "Laquer",
          "code": "GM03BETYLA"
        },
        {
          "value": "Top Coat",
          "code": "GM03BETYTC"
        },
        {
          "value": "Lip Balm",
          "code": "GM03BETYLB"
        },
        {
          "value": "Toner/Clarifyer",
          "code": "GM03BETYΥΤΟ"
        },
        {
          "value": "Lip Liner",
          "code": "GM03BETYLI"
        },
        {
          "value": "Tinted Moisturizer",
          "code": "GM03BETYTM"
        },
        {
          "value": "Lip Stick",
          "code": "GM03BETYLS"
        },
        {
          "value": "Tweezer",
          "code": "GM03BETYTW"
        },
        {
          "value": "Mascara",
          "code": "GM03BETΥΜΑ"
        },
        {
          "value": "Other",
          "code": "GM04BETY99"
        }
      ]
    },
    {
      "codeListName": "Gender",
      "values": [
        {
          "value": "Female",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Gender Neutral",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        }
      ]
    },
    {
      "codeListName": "Beauty Area of Use",
      "values": [
        {
          "value": "Body",
          "code": "GM03BAOUBD"
        },
        {
          "value": "Lip",
          "code": "GM03BAOULP"
        },
        {
          "value": "Brow",
          "code": "GM03BAOUBR"
        },
        {
          "value": "Multi",
          "code": "GM03BAOUMU"
        },
        {
          "value": "Cheek",
          "code": "GM03BAOUCH"
        },
        {
          "value": "Nall",
          "code": "GM03BAOUNA"
        },
        {
          "value": "Eye",
          "code": "GM03BAOUEY"
        },
        {
          "value": "Neck",
          "code": "GM03BAOUNE"
        },
        {
          "value": "Face",
          "code": "GM03BAOUFA"
        },
        {
          "value": "Pedi",
          "code": "GM03BAOUPE"
        },
        {
          "value": "Hair",
          "code": "GM03BAOUHR"
        },
        {
          "value": "Teeth",
          "code": "GM03BAOUTE"
        },
        {
          "value": "Hand",
          "code": "GM03BAOUHN"
        },
        {
          "value": "Other",
          "code": "GM04BAOU99"
        },
        {
          "value": "Lash",
          "code": "GM03BAOULA"
        }
      ]
    },
    {
      "codeListName": "Beauty Treatment Specialty",
      "values": [
        {
          "value": "After Sun",
          "code": "GM03BTSPAS"
        },
        {
          "value": "Redness/Rosacea",
          "code": "GM03BTSPRR"
        },
        {
          "value": "Anti-Acne",
          "code": "GM03BTSPAA"
        },
        {
          "value": "Repair",
          "code": "GM03BTSPRE"
        },
        {
          "value": "Cellulite",
          "code": "GM03BTSPCE"
        },
        {
          "value": "Self Tan",
          "code": "GM03BTSPST"
        },
        {
          "value": "Conditioning",
          "code": "GM03BTSPCD"
        },
        {
          "value": "Shaving",
          "code": "GM03BTSPSH"
        },
        {
          "value": "Day",
          "code": "GM03BTSPDA"
        },
        {
          "value": "Uneven Skin Tone",
          "code": "GM03BTSPUN"
        },
        {
          "value": "Firming/Lifting",
          "code": "GM03BTSPFL"
        },
        {
          "value": "Wrinkles",
          "code": "GM03BTSPWR"
        },
        {
          "value": "Moisturizing",
          "code": "GM03BTSPMS"
        },
        {
          "value": "Heat and Sun Protection",
          "code": "GM03BTSPHS"
        },
        {
          "value": "Anti-Frizz",
          "code": "GM03BTSPAF"
        },
        {
          "value": "Oil Control",
          "code": "GM03BTSPOC"
        },
        {
          "value": "Clarifying",
          "code": "GM03BTSPCL"
        },
        {
          "value": "Straightening",
          "code": "GM03BTSPSG"
        },
        {
          "value": "Color Protection",
          "code": "GM03BTSPCP"
        },
        {
          "value": "Texturizing",
          "code": "GM03BTSPTX"
        },
        {
          "value": "Curl Defining",
          "code": "GM03BTSPCD"
        },
        {
          "value": "Thinning and Hair Loss",
          "code": "GM03BTSPTH"
        },
        {
          "value": "Damage Repair",
          "code": "GM03BTSPDR"
        },
        {
          "value": "Volumizing",
          "code": "GM03BTSPVO"
        },
        {
          "value": "Dry Scalp",
          "code": "GM03BTSPDS"
        },
        {
          "value": "Other",
          "code": "GM04BTSP99"
        },
        {
          "value": "Dullness",
          "code": "GM03BTSPDU"
        },
        {
          "value": "Night",
          "code": "GM03BTSPNI"
        }
      ]
    },
    {
      "codeListName": "Formulation",
      "values": [
        {
          "value": "Capsules",
          "code": "GM03FORMCA"
        },
        {
          "value": "Mousse/Foam",
          "code": "GM03FORMMF"
        },
        {
          "value": "Cream",
          "code": "GM03FORMCR"
        },
        {
          "value": "Oil",
          "code": "GM03FORMIL"
        },
        {
          "value": "Cream-To-Powder",
          "code": "GM03FORMCP"
        },
        {
          "value": "Paste",
          "code": "GM03FORMPS"
        },
        {
          "value": "Gel",
          "code": "GM03FORMGL"
        },
        {
          "value": "Pressed Powder",
          "code": "GM03FORMPP"
        },
        {
          "value": "Liquid",
          "code": "GM03FORMLQ"
        },
        {
          "value": "Solid",
          "code": "GM03FORMSL"
        },
        {
          "value": "Loose Powder",
          "code": "GM03FORMLP"
        },
        {
          "value": "Wax",
          "code": "GM03FORMWX"
        },
        {
          "value": "Lotion",
          "code": "GM03FORMLT"
        },
        {
          "value": "Wipe",
          "code": "GM03FORMWP"
        },
        {
          "value": "Mist/Spray",
          "code": "GM03FORMMS"
        },
        {
          "value": "Other",
          "code": "GM04FORM99"
        }
      ]
    },
    {
      "codeListName": "Skin Type",
      "values": [
        {
          "value": "Aging",
          "code": "GM03SKTPAG"
        },
        {
          "value": "Oily",
          "code": "GM03SKTPLY"
        },
        {
          "value": "All",
          "code": "GM03SKTPAL"
        },
        {
          "value": "Sensitive",
          "code": "GM03SKTPSE"
        },
        {
          "value": "Combination",
          "code": "GM03SKTPCM"
        },
        {
          "value": "Other",
          "code": "GM04SKTP99"
        },
        {
          "value": "Dry",
          "code": "GM03SKTPDR"
        }
      ]
    },
    {
      "codeListName": "SPF Rating",
      "values": [
        {
          "value": "10",
          "code": "GM03SPFRRA"
        },
        {
          "value": "50",
          "code": "GM03SPFRRE"
        },
        {
          "value": "15",
          "code": "GM03SPFRRB"
        },
        {
          "value": "60",
          "code": "GM03SPFRRF"
        },
        {
          "value": "30",
          "code": "GM03SPFRRC"
        },
        {
          "value": "80",
          "code": "GM03SPFRRG"
        },
        {
          "value": "40",
          "code": "GM03SPFRRD"
        },
        {
          "value": "Other",
          "code": "GM04SPFR99"
        }
      ]
    },
    {
      "codeListName": "Scent Type",
      "values": [
        {
          "value": "Aquatic",
          "code": "GM03SCTPAQ"
        },
        {
          "value": "Oriental",
          "code": "GM03SCTPOR"
        },
        {
          "value": "Citrus",
          "code": "GM03SCTPСІ"
        },
        {
          "value": "Powdery",
          "code": "GM03SCTPPW"
        },
        {
          "value": "Earthy",
          "code": "GM03SCTPΕΑ"
        },
        {
          "value": "Spicy",
          "code": "GM03SCTPSP"
        },
        {
          "value": "Earthy and Woody",
          "code": "GM03SCTPEW"
        },
        {
          "value": "Sweet",
          "code": "GM03SCTPSW"
        },
        {
          "value": "Floral",
          "code": "GM03SCTPFL"
        },
        {
          "value": "Unscented",
          "code": "GM03SCTPUS"
        },
        {
          "value": "Fresh and Clean",
          "code": "GM03SCTPFC"
        },
        {
          "value": "Vanilla",
          "code": "GM03SCTPVA"
        },
        {
          "value": "Fruity",
          "code": "GM03SCTPFR"
        },
        {
          "value": "Warm and Spicy",
          "code": "GM03SCTPWS"
        },
        {
          "value": "Mixed",
          "code": "GM03SCTPΜΙ"
        },
        {
          "value": "Woody",
          "code": "GM03SCTPWD"
        },
        {
          "value": "Musk",
          "code": "GM03SCTPMU"
        },
        {
          "value": "Other",
          "code": "GM04SCTP99"
        }
      ]
    }
  ],
  "Accessories": [
    {
      "codeListName": "Advertised Origin",
      "values": [
        {
          "value": "Imported",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Made in Canada",
          "code": "GM03ADVOMC"
        },
        {
          "value": "Made in U.S.A.",
          "code": "GM03ADVOMU"
        },
        {
          "value": "Made in U.S.A. and Imported",
          "code": "GM03ADVOUI"
        },
        {
          "value": "Made in U.S.A. or Imported",
          "code": "GM03ADVOUO"
        },
        {
          "value": "Made in another country*",
          "code": "GM04ADV099"
        }
      ]
    },
    {
      "codeListName": "Care Instructions",
      "values": [
        {
          "value": "Dishwasher Safe",
          "code": "GM03CAINDS"
        },
        {
          "value": "Machine Wash Hot",
          "code": "GM03CAINΜΗ"
        },
        {
          "value": "Do Not Iron",
          "code": "GM03CAINDN"
        },
        {
          "value": "Machine Wash Line Dry",
          "code": "GM03CAINML"
        },
        {
          "value": "Dry Clean",
          "code": "GM03CAINDC"
        },
        {
          "value": "Machine Wash Tumble Dry",
          "code": "GM03CAINMT"
        },
        {
          "value": "Hand Wash",
          "code": "GM03CAINHW"
        },
        {
          "value": "Machine Wash Warm",
          "code": "GM03CAINMW"
        },
        {
          "value": "Leather Method Dry Cleaning",
          "code": "GM03CAINLM"
        },
        {
          "value": "Spot Clean",
          "code": "GM03CAINSC"
        },
        {
          "value": "Machine Wash Cold",
          "code": "GM03CAINMC"
        },
        {
          "value": "Wash Separately",
          "code": "GM03CAINWS"
        },
        {
          "value": "Machine Wash Dry Flat",
          "code": "GM03CAINMD"
        },
        {
          "value": "Other",
          "code": "GM04CAIN99"
        }
      ]
    },
    {
      "codeListName": "Fabric or Material",
      "values": [
        {
          "value": "14K Gold",
          "code": "GM03FBMC14"
        },
        {
          "value": "Marble/Wood",
          "code": "GM03FBMCMD"
        },
        {
          "value": "18K Gold",
          "code": "GM03FBMC18"
        },
        {
          "value": "Matte Jersey",
          "code": "GM03FBMCME"
        },
        {
          "value": "Agate",
          "code": "GM03FBMCAG"
        },
        {
          "value": "Melamine",
          "code": "GM03FBMCMF"
        },
        {
          "value": "Aluminum",
          "code": "GM03FBMCAL"
        },
        {
          "value": "Mercury Glass",
          "code": "GM03FBMCMG"
        },
        {
          "value": "Amethyst",
          "code": "GM03FBMCAM"
        },
        {
          "value": "Mesh",
          "code": "GM03FBMCMH"
        },
        {
          "value": "Anodized Aluminum",
          "code": "GM03FBMCAN"
        },
        {
          "value": "Metal",
          "code": "GM03FBMCMI"
        },
        {
          "value": "Beaded",
          "code": "GM03FBMCBD"
        },
        {
          "value": "Metal Alloy",
          "code": "GM03FBMCMJ"
        },
        {
          "value": "Birthstone",
          "code": "GM03FBMCBE"
        },
        {
          "value": "Metallic",
          "code": "GM03FBMCMK"
        },
        {
          "value": "Bi-stretch",
          "code": "GM03FBMCBF"
        },
        {
          "value": "Microfiber",
          "code": "GM03FBMCML"
        },
        {
          "value": "Bone",
          "code": "GM03FBMCBG"
        },
        {
          "value": "Microfleece",
          "code": "GM03FBMCMM"
        },
        {
          "value": "Boucle",
          "code": "GM03FBMCBH"
        },
        {
          "value": "Mikado",
          "code": "GM03FBMCMN"
        },
        {
          "value": "Brass",
          "code": "GM03FBMCBI"
        },
        {
          "value": "Mixed Materials",
          "code": "GM03FBMCMO"
        },
        {
          "value": "Broadcloth",
          "code": "GM03FBMCBJ"
        },
        {
          "value": "Mogador",
          "code": "GM03FBMCMP"
        },
        {
          "value": "Brocade",
          "code": "GM03FBMCBL"
        },
        {
          "value": "Moleskin",
          "code": "GM03FBMCMQ"
        },
        {
          "value": "Bronze",
          "code": "GM03FBMCBN"
        },
        {
          "value": "Mother-of-Pearl",
          "code": "GM03FBMCMR"
        },
        {
          "value": "Brushed Back Satin",
          "code": "GM03FBMCBS"
        },
        {
          "value": "Natural",
          "code": "GM03FBMCNA"
        },
        {
          "value": "Brushed Back Terry",
          "code": "GM03FBMCBT"
        },
        {
          "value": "Natural Fiber",
          "code": "GM03FBMCNB"
        },
        {
          "value": "Burlap",
          "code": "GM03FBMCBU"
        },
        {
          "value": "Nonstick",
          "code": "GM03FBMCNC"
        },
        {
          "value": "Canvas",
          "code": "GM03FBMCCA"
        },
        {
          "value": "Nubuck",
          "code": "GM03FBMCND"
        },
        {
          "value": "Cashmink",
          "code": "GM03FBMCCB"
        },
        {
          "value": "Onyx",
          "code": "GM03FBMCOA"
        },
        {
          "value": "Cast Aluminum",
          "code": "GM03FBMCCC"
        },
        {
          "value": "Opal",
          "code": "GM03FBMСОВ"
        },
        {
          "value": "Cast Iron",
          "code": "GM03FBMCCD"
        },
        {
          "value": "Organza",
          "code": "GM03FBMCOC"
        },
        {
          "value": "Ceramic",
          "code": "GM03FBMCCE"
        },
        {
          "value": "Ostrich",
          "code": "GM03FBMCOD"
        },
        {
          "value": "Challis",
          "code": "GM03FBMCCF"
        },
        {
          "value": "Ostrich Embossed",
          "code": "GM03FBMCOE"
        },
        {
          "value": "Chambray",
          "code": "GM03FBMCCG"
        },
        {
          "value": "Oxford",
          "code": "GM03FBMCOF"
        },
        {
          "value": "Charmeuse",
          "code": "GM03FBMCCH"
        },
        {
          "value": "Palladium",
          "code": "GM03FBMCPA"
        },
        {
          "value": "Chenille",
          "code": "GM03FBMCCI"
        },
        {
          "value": "Paper Braid",
          "code": "GM03FBMCPB"
        },
        {
          "value": "Chiffon/Sheer",
          "code": "GM03FBMCCJ"
        },
        {
          "value": "Patent Leather",
          "code": "GM03FBMCPC"
        },
        {
          "value": "Coated Canvas",
          "code": "GM03FBMCCK"
        },
        {
          "value": "Pearl",
          "code": "GM03FBMCPD"
        },
        {
          "value": "Composite",
          "code": "GM03FBMCCL"
        },
        {
          "value": "Percale",
          "code": "GM03FBMCPE"
        },
        {
          "value": "Confetti",
          "code": "GM03FBMCCM"
        },
        {
          "value": "Pinpoint",
          "code": "GM03FBMCPF"
        },
        {
          "value": "Copper",
          "code": "GM03FBMCCN"
        },
        {
          "value": "Pique",
          "code": "GM03FBMCPG"
        },
        {
          "value": "Coral",
          "code": "GM03FBMCCO"
        },
        {
          "value": "Plastic",
          "code": "GM03FBMCPH"
        },
        {
          "value": "Corduroy",
          "code": "GM03FBMCСР"
        },
        {
          "value": "Plastic/Acetate",
          "code": "GM03FBMCPI"
        },
        {
          "value": "Corian",
          "code": "GM03FBMCCQ"
        },
        {
          "value": "Plastic/Metal",
          "code": "GM03FBMCPJ"
        },
        {
          "value": "Cork",
          "code": "GM03FBMCCR"
        },
        {
          "value": "Plush",
          "code": "GM03FBMCPK"
        },
        {
          "value": "Crepe",
          "code": "GM03FBMCCS"
        },
        {
          "value": "Pointelle",
          "code": "GM03FBMCPL"
        },
        {
          "value": "Crinoline",
          "code": "GM03FBMCCT"
        },
        {
          "value": "Polycarbonate",
          "code": "GM03FBMCPM"
        },
        {
          "value": "Crochet",
          "code": "GM03FBMCCU"
        },
        {
          "value": "Ponte",
          "code": "GM03FBMCPN"
        },
        {
          "value": "Crochet/Openwork",
          "code": "GM03FBMCCV"
        },
        {
          "value": "Poplin",
          "code": "GM03FBMCPO"
        },
        {
          "value": "Croco",
          "code": "GM03FBMCCW"
        },
        {
          "value": "Porcelain",
          "code": "GM03FBMCPP"
        },
        {
          "value": "Croco Embossed",
          "code": "GM03FBMCCX"
        },
        {
          "value": "Portuguese Flannel",
          "code": "GM03FBMCPQ"
        },
        {
          "value": "Crystal",
          "code": "GM03FBMCCY"
        },
        {
          "value": "Propionate",
          "code": "GM03FBMCPR"
        },
        {
          "value": "Cubic Zirconia",
          "code": "GM03FBMCCZ"
        },
        {
          "value": "PU",
          "code": "GM03FBMCPS"
        },
        {
          "value": "Denim",
          "code": "GM03FBMCDA"
        },
        {
          "value": "Quartz",
          "code": "GM03FBMCQA"
        },
        {
          "value": "Diamond",
          "code": "GM03FBMCDB"
        },
        {
          "value": "Rattan",
          "code": "GM03FBMCRA"
        },
        {
          "value": "Dobby",
          "code": "GM03FBMCDC"
        },
        {
          "value": "Resin",
          "code": "GM03FBMCRB"
        },
        {
          "value": "Double Knit",
          "code": "GM03FBMCDD"
        },
        {
          "value": "Rhodium",
          "code": "GM03FBMCRC"
        },
        {
          "value": "Down",
          "code": "GM03FBMCDE"
        },
        {
          "value": "Ribbon",
          "code": "GM03FBMCRD"
        },
        {
          "value": "Down Fill",
          "code": "GM03FBMCDF"
        },
        {
          "value": "Rope",
          "code": "GM03FBMRE"
        },
        {
          "value": "Drop Needle",
          "code": "GM03FBMCDG"
        },
        {
          "value": "Saffiano",
          "code": "GM03FBMCSA"
        },
        {
          "value": "Earthenware",
          "code": "GM03FBMCEA"
        },
        {
          "value": "Sateen",
          "code": "GM03FBMCSB"
        },
        {
          "value": "Elephant Embossed",
          "code": "GM03FBMCEB"
        },
        {
          "value": "Satin",
          "code": "GM03FBMCSC"
        },
        {
          "value": "Enamel",
          "code": "GM03FBMCEC"
        },
        {
          "value": "Scuba",
          "code": "GM03FBMCSD"
        },
        {
          "value": "Enamel/Aluminum",
          "code": "GM03FBMCED"
        },
        {
          "value": "Seagrass",
          "code": "GM03FBMCSE"
        },
        {
          "value": "Enamel/Epoxy",
          "code": "GM03FBMCEF"
        },
        {
          "value": "Seersucker",
          "code": "GM03FBMCSF"
        },
        {
          "value": "Enamel/Iron",
          "code": "GM03FBMCEG"
        },
        {
          "value": "Sequin",
          "code": "GM03FBMCSG"
        },
        {
          "value": "Enamel/Steel",
          "code": "GM03FBMCЕН"
        },
        {
          "value": "Shantung",
          "code": "GM03FBMCSH"
        },
        {
          "value": "End-on-End",
          "code": "GM03FBMCEI"
        },
        {
          "value": "Shearling",
          "code": "GM03FBMCSI"
        },
        {
          "value": "Epoxy",
          "code": "GM03FBMCEJ"
        },
        {
          "value": "Sheeting",
          "code": "GM03FBMCSJ"
        },
        {
          "value": "Eyelet",
          "code": "GM03FBMСЕК"
        },
        {
          "value": "Shell",
          "code": "GM03FBMCSK"
        },
        {
          "value": "Fabric",
          "code": "GM03FBMCFA"
        },
        {
          "value": "Silicone",
          "code": "GM03FBMCSL"
        },
        {
          "value": "Faux Fur",
          "code": "GM03FBMCFB"
        },
        {
          "value": "Sinamay",
          "code": "GM03FBMCSM"
        },
        {
          "value": "Faux Leather",
          "code": "GM03FBMCFC"
        },
        {
          "value": "Slate",
          "code": "GM03FBMCSN"
        },
        {
          "value": "Faux Pearl",
          "code": "GM03FBMCFD"
        },
        {
          "value": "Slub",
          "code": "GM03FBMCSO"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03FBMCFE"
        },
        {
          "value": "Snake Embossed",
          "code": "GM03FBMCSP"
        },
        {
          "value": "Faux Suede",
          "code": "GM03FBMCFF"
        },
        {
          "value": "Snit",
          "code": "GM03FBMCSQ"
        },
        {
          "value": "Felt",
          "code": "GM03FBMCFG"
        },
        {
          "value": "Stainless Steel",
          "code": "GM03FBMCSR"
        },
        {
          "value": "Flannel",
          "code": "GM03FBMCFH"
        },
        {
          "value": "Steel",
          "code": "GM03FBMCST"
        },
        {
          "value": "Flat Knit",
          "code": "GM03FBMCFI"
        },
        {
          "value": "Sterling Silver",
          "code": "GM03FBMCSU"
        },
        {
          "value": "Fleece",
          "code": "GM03FBMCFJ"
        },
        {
          "value": "Stone",
          "code": "GM03FBMCSV"
        },
        {
          "value": "Foam",
          "code": "GM03FBMCFK"
        },
        {
          "value": "Stoneware",
          "code": "GM03FBMCSW"
        },
        {
          "value": "French Terry",
          "code": "GM03FBMCFL"
        },
        {
          "value": "Straw",
          "code": "GM03FBMCSX"
        },
        {
          "value": "Fresh Water Pearl",
          "code": "GM03FBMCFM"
        },
        {
          "value": "Styrofoam",
          "code": "GM03FBMCSY"
        },
        {
          "value": "Fur",
          "code": "GM03FBMCFN"
        },
        {
          "value": "Suede",
          "code": "GM03FBMCSZ"
        },
        {
          "value": "Gabardine",
          "code": "GM03FBMCGA"
        },
        {
          "value": "Sweater Yarn",
          "code": "GM03FBMCSS"
        },
        {
          "value": "Galvanized",
          "code": "GM03FBMCGB"
        },
        {
          "value": "Swiss Dot",
          "code": "GM03FBMCWI"
        },
        {
          "value": "Gauze",
          "code": "GM03FBMCGC"
        },
        {
          "value": "Synthetic",
          "code": "GM03FBMCYT"
        },
        {
          "value": "Genuine Stone",
          "code": "GM03FBMCGD"
        },
        {
          "value": "Taffeta",
          "code": "GM03FBMCТА"
        },
        {
          "value": "Georgette",
          "code": "GM03FBMCGE"
        },
        {
          "value": "Terra Cotta",
          "code": "GM03FBMCTB"
        },
        {
          "value": "Glass",
          "code": "GM03FBMCGF"
        },
        {
          "value": "Terry Cloth",
          "code": "GM03FBMCTC"
        },
        {
          "value": "Glitter",
          "code": "GM03FBMCGI"
        },
        {
          "value": "Thermal",
          "code": "GM03FBMCTD"
        },
        {
          "value": "Grenadine",
          "code": "GM03FBMCGG"
        },
        {
          "value": "Titanium",
          "code": "GM03FBMCTЕ"
        },
        {
          "value": "Grosgrain",
          "code": "GM03FBMCGH"
        },
        {
          "value": "Topaz",
          "code": "GM03FBMCTF"
        },
        {
          "value": "Hard Anodized",
          "code": "GM03FBMCHA"
        },
        {
          "value": "Tricot",
          "code": "GM03FBMCTG"
        },
        {
          "value": "Hatchi",
          "code": "GM03FBMCHB"
        },
        {
          "value": "Tri-Ply Stainless Steel",
          "code": "GM03FBMCTH"
        },
        {
          "value": "Heavy Gauge Steel",
          "code": "GM03FBMCHC"
        },
        {
          "value": "Tritan",
          "code": "GM03FBMCTI"
        },
        {
          "value": "High-Carbon Steel",
          "code": "GM03FBMCHD"
        },
        {
          "value": "Tulle",
          "code": "GM03FBMCT"
        },
        {
          "value": "Hopsack",
          "code": "GM03FBMCHE"
        },
        {
          "value": "Turquoise",
          "code": "GM03FBMCTK"
        },
        {
          "value": "Howlite",
          "code": "GM03FBMCHF"
        },
        {
          "value": "Tweed",
          "code": "GM03FBMCTL"
        },
        {
          "value": "Ironstone",
          "code": "GM03FBMCIA"
        },
        {
          "value": "Tweed/Boucle",
          "code": "GM03FBMCTM"
        },
        {
          "value": "Jacquard",
          "code": "GM03FBMCJA"
        },
        {
          "value": "Twill",
          "code": "GM03FBMCTN"
        },
        {
          "value": "Jade",
          "code": "GM03FBMCJB"
        },
        {
          "value": "Velour",
          "code": "GM03FBMCVA"
        },
        {
          "value": "Jasper",
          "code": "GM03FBMCJC"
        },
        {
          "value": "Velvet",
          "code": "GM03FBMCVB"
        },
        {
          "value": "Knit (Generic)",
          "code": "GM03FBMСKA"
        },
        {
          "value": "Velveteen",
          "code": "GM03FBMCVC"
        },
        {
          "value": "Knit Cable",
          "code": "GM03FBMCKB"
        },
        {
          "value": "Voile",
          "code": "GM03FBMCVD"
        },
        {
          "value": "Knit Fine Gauge",
          "code": "GM03FBMCKC"
        },
        {
          "value": "Waffle",
          "code": "GM03FBMCWA"
        },
        {
          "value": "Knit Intarsia",
          "code": "GM03FBMCKD"
        },
        {
          "value": "Wax",
          "code": "GM03FBMCWB"
        },
        {
          "value": "Knit Interlock",
          "code": "GM03FBMCKE"
        },
        {
          "value": "Wicker",
          "code": "GM03FBMCWC"
        },
        {
          "value": "Knit Jersey",
          "code": "GM03FBMCKF"
        },
        {
          "value": "Wire",
          "code": "GM03FBMCWD"
        },
        {
          "value": "Knit Ribbed",
          "code": "GM03FBMCKG"
        },
        {
          "value": "Wood",
          "code": "GM03FBMCWE"
        },
        {
          "value": "Knit/Woven",
          "code": "GM03FBMCKH"
        },
        {
          "value": "Wood Alternative",
          "code": "GM03FBMCWF"
        },
        {
          "value": "Knitted",
          "code": "GM03FBMCKI"
        },
        {
          "value": "Wool",
          "code": "GM03FBMCWG"
        },
        {
          "value": "Lace",
          "code": "GM03FBMCLA"
        },
        {
          "value": "Woven (generic)",
          "code": "GM03FBMCWH"
        },
        {
          "value": "Leather",
          "code": "GM03FBMCLB"
        },
        {
          "value": "Other",
          "code": "GM03FBMC99"
        },
        {
          "value": "Lizard Embossed",
          "code": "GM03FBMCLC"
        },
        {
          "value": "Magnesite",
          "code": "GM03FBMCMA"
        },
        {
          "value": "Magnet",
          "code": "GM03FBMCMB"
        },
        {
          "value": "Marble",
          "code": "GM03FBMCMC"
        }
      ]
    },
    {
      "codeListName": "Fiber",
      "values": [
        {
          "value": "Acetate",
          "code": "GM03FIBRAA"
        },
        {
          "value": "Paper",
          "code": "GM03FIBRPA"
        },
        {
          "value": "Acrylic",
          "code": "GM03FIBRAB"
        },
        {
          "value": "Pashmina",
          "code": "GM03FIBRPB"
        },
        {
          "value": "Alpaca",
          "code": "GM03FIBRAC"
        },
        {
          "value": "Pigskin",
          "code": "GM03FIBRPC"
        },
        {
          "value": "Angora",
          "code": "GM03FIBRAD"
        },
        {
          "value": "Pima Cotton",
          "code": "GM03FIBRPD"
        },
        {
          "value": "Bamboo",
          "code": "GM03FIBRBA"
        },
        {
          "value": "Pima Cotton Blend",
          "code": "GM03FIBRPE"
        },
        {
          "value": "Buffalo",
          "code": "GM03FIBRBB"
        },
        {
          "value": "Polyester",
          "code": "GM03FIBRPF"
        },
        {
          "value": "Cashmere",
          "code": "GM03FIBRCA"
        },
        {
          "value": "Polyester Blend",
          "code": "GM03FIBRPG"
        },
        {
          "value": "Cotton",
          "code": "GM03FIBRCB"
        },
        {
          "value": "Polyester/Cotton",
          "code": "GM03FIBRPH"
        },
        {
          "value": "Cotton Blend",
          "code": "GM03FIBRCC"
        },
        {
          "value": "Polyester/Elastane",
          "code": "GM03FIBRPI"
        },
        {
          "value": "Cotton/Cashmere",
          "code": "GM03FIBRCD"
        },
        {
          "value": "Polyester/Modal",
          "code": "GM03FIBRPJ"
        },
        {
          "value": "Cotton/Elastane",
          "code": "GM03FIBRCE"
        },
        {
          "value": "Polyester/Nylon",
          "code": "GM03FIBRPK"
        },
        {
          "value": "Cotton/Lyocell",
          "code": "GM03FIBRCF"
        },
        {
          "value": "Polyester/Rayon",
          "code": "GM03FIBRPL"
        },
        {
          "value": "Cotton/Polyester",
          "code": "GM03FIBRCG"
        },
        {
          "value": "Polypropylene",
          "code": "GM03FIBRPM"
        },
        {
          "value": "Cotton/Polyester/Elastane",
          "code": "GM03FIBRCH"
        },
        {
          "value": "Polyurethane",
          "code": "GM03FIBRPN"
        },
        {
          "value": "Cotton/Rayon",
          "code": "GM03FIBRCI"
        },
        {
          "value": "PVC",
          "code": "GM03FIBRPO"
        },
        {
          "value": "Cotton/Silk",
          "code": "GM03FIBRCJ"
        },
        {
          "value": "Qmiich",
          "code": "GM03FIBRQM"
        },
        {
          "value": "Cow",
          "code": "GM03FIBRCK"
        },
        {
          "value": "Raffia",
          "code": "GM03FIBRRA"
        },
        {
          "value": "Deer",
          "code": "GM03FIBRDA"
        },
        {
          "value": "Ramie",
          "code": "GM03FIBRRB"
        },
        {
          "value": "Egyptian Cotton",
          "code": "GM03FIBREA"
        },
        {
          "value": "Rayon",
          "code": "GM03FIBRRC"
        },
        {
          "value": "Elastane",
          "code": "GM03FIBREB"
        },
        {
          "value": "Rayon (Viscose)",
          "code": "GM03FIBRRD"
        },
        {
          "value": "Flax",
          "code": "GM03FIBRFA"
        },
        {
          "value": "Rayon/Elastane",
          "code": "GM03FIBRRE"
        },
        {
          "value": "Goat",
          "code": "GM03FIBRGA"
        },
        {
          "value": "Rayon/Nylon",
          "code": "GM03FIBRRF"
        },
        {
          "value": "Hair On Hide",
          "code": "GM03FIBRHA"
        },
        {
          "value": "Rayon/Nylon/Elastane",
          "code": "GM03FIBRRG"
        },
        {
          "value": "Haircalf",
          "code": "GM03FIBRHB"
        },
        {
          "value": "Rhino",
          "code": "GM03FIBRRH"
        },
        {
          "value": "Hemp",
          "code": "GM03FIBRHC"
        },
        {
          "value": "Rubber",
          "code": "GM03FIBRRI"
        },
        {
          "value": "Horse Hair",
          "code": "GM03FIBRHD"
        },
        {
          "value": "Sheepskin",
          "code": "GM03FIBRSA"
        },
        {
          "value": "Jute",
          "code": "GM03FIBRJA"
        },
        {
          "value": "Silk",
          "code": "GM03FIBRSB"
        },
        {
          "value": "Lamb",
          "code": "GM03FIBRLA"
        },
        {
          "value": "Sisal",
          "code": "GM03FIBRSC"
        },
        {
          "value": "Lambs Wool/Nylon",
          "code": "GM03FIBRLB"
        },
        {
          "value": "Snake",
          "code": "GM03FIBRSD"
        },
        {
          "value": "Leather",
          "code": "GM03FIBRLC"
        },
        {
          "value": "Supplex",
          "code": "GM03FIBRSE"
        },
        {
          "value": "Leather/Nylon",
          "code": "GM03FIBRLD"
        },
        {
          "value": "Supplex/Elastane",
          "code": "GM03FIBRSF"
        },
        {
          "value": "Linen",
          "code": "GM03FIBRLE"
        },
        {
          "value": "Turkish Cotton",
          "code": "GM03FIBRTA"
        },
        {
          "value": "Linen/Cotton",
          "code": "GM03FIBRLF"
        },
        {
          "value": "UGG Wool",
          "code": "GM03FIBRUA"
        },
        {
          "value": "Linen/Silk",
          "code": "GM03FIBRLG"
        },
        {
          "value": "Vinyl",
          "code": "GM03FIBRVA"
        },
        {
          "value": "Lurex",
          "code": "GM03FIBRLH"
        },
        {
          "value": "Viscose",
          "code": "GM03FIBRVB"
        },
        {
          "value": "Lyocell",
          "code": "GM03FIBRLI"
        },
        {
          "value": "Wool",
          "code": "GM03FIBRWA"
        },
        {
          "value": "Metallic Yarm",
          "code": "GM03FIBRMA"
        },
        {
          "value": "Wool Blend",
          "code": "GM03FIBRWB"
        },
        {
          "value": "Microcotton",
          "code": "GM03FIBRMB"
        },
        {
          "value": "Wool/Bamboo",
          "code": "GM03FIBRWC"
        },
        {
          "value": "Microfiber",
          "code": "GM03FIBRMC"
        },
        {
          "value": "Wool/Cashmere",
          "code": "GM03FIBRWD"
        },
        {
          "value": "Modal",
          "code": "GM03FIBRMD"
        },
        {
          "value": "Wool/Elastane",
          "code": "GM03FIBRWE"
        },
        {
          "value": "Modal/Elastane",
          "code": "GM03FIBRME"
        },
        {
          "value": "Wool/Nylon/Cashmere",
          "code": "GM03FIBRWF"
        },
        {
          "value": "Mohair",
          "code": "GM03FIBRMF"
        },
        {
          "value": "Wool/Silk",
          "code": "GM03FIBRWG"
        },
        {
          "value": "Neoprene",
          "code": "GM03FIBRNA"
        },
        {
          "value": "Other",
          "code": "GM03FIBR99"
        },
        {
          "value": "Nylon",
          "code": "GM03FIBRNB"
        },
        {
          "value": "Nylon/Elastane",
          "code": "GM03FIBRNC"
        },
        {
          "value": "Olefin",
          "code": "GM03FIBROA"
        }
      ]
    },
    {
      "codeListName": "Fur Animal Name",
      "values": [
        {
          "value": "Australian Brushtail Possum",
          "code": "GM03FANMAP"
        },
        {
          "value": "Otter",
          "code": "GM03FANMOU"
        },
        {
          "value": "Beaver",
          "code": "GM03FANMBV"
        },
        {
          "value": "Pony Hair",
          "code": "GM03FANMPH"
        },
        {
          "value": "Calf Hair",
          "code": "GM03FANMCH"
        },
        {
          "value": "Rabbit",
          "code": "GM03FANMRI"
        },
        {
          "value": "Fox",
          "code": "GM03FANMFX"
        },
        {
          "value": "Raccoon",
          "code": "GM03FANMRC"
        },
        {
          "value": "Golden Jackal",
          "code": "GM03FANMGJ"
        },
        {
          "value": "Sable",
          "code": "GM03FANMSG"
        },
        {
          "value": "Grey Wolf",
          "code": "GM03FANMGW"
        },
        {
          "value": "Skunk",
          "code": "GM03FANMSK"
        },
        {
          "value": "Marten",
          "code": "GM03FANMΜΑ"
        },
        {
          "value": "Other Fur Animal*",
          "code": "GM04FANM99"
        },
        {
          "value": "Mink",
          "code": "GM03FANMMK"
        }
      ]
    },
    {
      "codeListName": "Fur Treatment",
      "values": [
        {
          "value": "Artificially Colored",
          "code": "GM03FTMTAC"
        },
        {
          "value": "Natural (untreated)",
          "code": "GM03FTMTΝΑ"
        },
        {
          "value": "Bleached",
          "code": "GM03FTMTBM"
        },
        {
          "value": "Painted",
          "code": "GM03FTMTPT"
        },
        {
          "value": "Dyed",
          "code": "GM03FTMTDY"
        },
        {
          "value": "Other Fur Treatment",
          "code": "GM04FTMT99"
        }
      ]
    },
    {
      "codeListName": "Gender",
      "values": [
        {
          "value": "Female",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Gender Neutral",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        }
      ]
    },
    {
      "codeListName": "Glove Type",
      "values": [
        {
          "value": "Mitten",
          "code": "GM03GLTYΜΙ"
        },
        {
          "value": "Flip Top",
          "code": "GM03GLTYFL"
        },
        {
          "value": "Fingerless",
          "code": "GM03GLTYFI"
        },
        {
          "value": "Lobster Gel",
          "code": "GM03GLTYLG"
        },
        {
          "value": "Tech",
          "code": "GM03GLTYTE"
        },
        {
          "value": "Other",
          "code": "GM04GLTY99"
        },
        {
          "value": "Traditional",
          "code": "GM03GLTYTR"
        }
      ]
    },
    {
      "codeListName": "Lining Material",
      "values": [
        {
          "value": "Antimicrobial",
          "code": "GM03LIMTAN"
        },
        {
          "value": "Nylon",
          "code": "GM03LIMTNY"
        },
        {
          "value": "Cotton",
          "code": "GM03LIMTCT"
        },
        {
          "value": "Organic Material",
          "code": "GM03LIMTOM"
        },
        {
          "value": "Fabric",
          "code": "GM03LIMTFD"
        },
        {
          "value": "Polyester",
          "code": "GM03LIMTPR"
        },
        {
          "value": "Faux Fur",
          "code": "GM03LIMTFB"
        },
        {
          "value": "PU",
          "code": "GM03LIMTPU"
        },
        {
          "value": "Faux Leather",
          "code": "GM03LIMTFL"
        },
        {
          "value": "PVC",
          "code": "GM03LIMTPV"
        },
        {
          "value": "Faux Shearling",
          "code": "GM03LIMTFS"
        },
        {
          "value": "Quilted",
          "code": "GM03LIMTQT"
        },
        {
          "value": "Fleece",
          "code": "GM03LIMTFC"
        },
        {
          "value": "Shearling Lined",
          "code": "GM03LIMTSL"
        },
        {
          "value": "Gel",
          "code": "GM03LIMTGE"
        },
        {
          "value": "Sherpa",
          "code": "GM03LIMTSP"
        },
        {
          "value": "Leather",
          "code": "GM03LIMTLE"
        },
        {
          "value": "Straw",
          "code": "GM03LIMTST"
        },
        {
          "value": "Logo Lining",
          "code": "GM03LIMTLL"
        },
        {
          "value": "Synthetic",
          "code": "GM03LIMTSY"
        },
        {
          "value": "Memory Foam",
          "code": "GM03LIMTMF"
        },
        {
          "value": "Taffeta",
          "code": "GM03LIMTTA"
        },
        {
          "value": "Mesh",
          "code": "GM03LIMTME"
        },
        {
          "value": "Other",
          "code": "GM04LIMT99"
        }
      ]
    },
    {
      "codeListName": "Hat Type",
      "values": [
        {
          "value": "Balaclava",
          "code": "GM03HATSBL"
        },
        {
          "value": "Floppy",
          "code": "GM03HATSFL"
        },
        {
          "value": "Baseball Cap",
          "code": "GM03HATSBS"
        },
        {
          "value": "Newsboy",
          "code": "GM03HATSNW"
        },
        {
          "value": "Beanie",
          "code": "GM03HATSBE"
        },
        {
          "value": "Panama",
          "code": "GM03HATSPN"
        },
        {
          "value": "Beret",
          "code": "GM03HATSBR"
        },
        {
          "value": "Slouchy",
          "code": "GM03HATSSL"
        },
        {
          "value": "Boater",
          "code": "GM03HATSBA"
        },
        {
          "value": "Snap Back",
          "code": "GM03HATSSN"
        },
        {
          "value": "Bonnet",
          "code": "GM03HATSBN"
        },
        {
          "value": "Sun Hat",
          "code": "GM03HATSSH"
        },
        {
          "value": "Bowler",
          "code": "GM03HATSBW"
        },
        {
          "value": "Trapper",
          "code": "GM03HATSTR"
        },
        {
          "value": "Bucket Hat",
          "code": "GM03HATSBH"
        },
        {
          "value": "Trucker",
          "code": "GM03HATSTU"
        },
        {
          "value": "Cowboy",
          "code": "GM03HATSCW"
        },
        {
          "value": "Visor",
          "code": "GM03HATSVS"
        },
        {
          "value": "Ear Muffs",
          "code": "GM03HATSEM"
        },
        {
          "value": "Wide Brim",
          "code": "GM03HATSWB"
        },
        {
          "value": "Fedora",
          "code": "GM03HATSFD"
        },
        {
          "value": "Other",
          "code": "GM04HATS99"
        }
      ]
    },
    {
      "codeListName": "Neckwear Type",
      "values": [
        {
          "value": "Bandana",
          "code": "GM03NECKBN"
        },
        {
          "value": "Neck Tie",
          "code": "GM03NECKNT"
        },
        {
          "value": "Boa",
          "code": "GM03NECKВА"
        },
        {
          "value": "Oblong Scarf",
          "code": "GM03NECKBS"
        },
        {
          "value": "Bolo",
          "code": "GM03NECKBL"
        },
        {
          "value": "Sarong/Pareo",
          "code": "GM03NECKSP"
        },
        {
          "value": "Bow Tie",
          "code": "GM03NECKBT"
        },
        {
          "value": "Square Scarf",
          "code": "GM03NECKSS"
        },
        {
          "value": "Clip-On Tie",
          "code": "GM03NECKCT"
        },
        {
          "value": "Stole",
          "code": "GM03NECKST"
        },
        {
          "value": "Cravat",
          "code": "GM03NECKCR"
        },
        {
          "value": "Wrap/Shawl",
          "code": "GM03NECKWS"
        },
        {
          "value": "Infinity Scarf",
          "code": "JW03NKLCMS"
        },
        {
          "value": "Other",
          "code": "GM04NECK99"
        },
        {
          "value": "Muffler",
          "code": "GM03NECKMU"
        }
      ]
    },
    {
      "codeListName": "Scarf Type",
      "values": [
        {
          "value": "Blanket",
          "code": "GM03SCTYBL"
        },
        {
          "value": "Oblong",
          "code": "GM03SCTYOB"
        },
        {
          "value": "Bandana/Neckerchief",
          "code": "GM03SCTYΒΑ"
        },
        {
          "value": "Poncho",
          "code": "GM03SCTYΡΟ"
        },
        {
          "value": "Boa",
          "code": "GM03SCTYBO"
        },
        {
          "value": "Pull-through",
          "code": "GM03SCTYPU"
        },
        {
          "value": "Buff",
          "code": "GM03SCTYBU"
        },
        {
          "value": "Shawl",
          "code": "GM03SCTYSH"
        },
        {
          "value": "Cowl",
          "code": "GM03SCTYCO"
        },
        {
          "value": "Snood",
          "code": "GM03SCTYSN"
        },
        {
          "value": "Evening",
          "code": "GM03SCTYEV"
        },
        {
          "value": "Square",
          "code": "GM03SCTYSQ"
        },
        {
          "value": "Gaiter",
          "code": "GM03SCTYGA"
        },
        {
          "value": "Stole",
          "code": "GM03SCTYST"
        },
        {
          "value": "Head Scarf",
          "code": "GM03SCTYHS"
        },
        {
          "value": "Triangle",
          "code": "GM03SCTYTR"
        },
        {
          "value": "Infinity",
          "code": "GM03SCTYIN"
        },
        {
          "value": "Turban",
          "code": "GM03SCTYTU"
        },
        {
          "value": "Muffler",
          "code": "GM03SCTYMU"
        },
        {
          "value": "Wrap",
          "code": "GM03SCTYWR"
        },
        {
          "value": "Necklace",
          "code": "GM03SCTYNE"
        },
        {
          "value": "Other",
          "code": "GM04SCTY99"
        }
      ]
    },
    {
      "codeListName": "Belt Type",
      "values": [
        {
          "value": "Braided",
          "code": "GM03BETYBR"
        },
        {
          "value": "Ratchet",
          "code": "GM03BETYRA"
        },
        {
          "value": "Chain",
          "code": "GM03BETYCH"
        },
        {
          "value": "Sash",
          "code": "GM03BETYSA"
        },
        {
          "value": "Cinch",
          "code": "GM03BETYCI"
        },
        {
          "value": "Strap",
          "code": "GM03BETYST"
        },
        {
          "value": "Cummerbund",
          "code": "GM03BETYCU"
        },
        {
          "value": "Stretch",
          "code": "GM03BETYSH"
        },
        {
          "value": "Hip",
          "code": "GM03BETYНІ"
        },
        {
          "value": "Suspenders",
          "code": "GM03BETYSU"
        },
        {
          "value": "Lace-up",
          "code": "GM03BETYLU"
        },
        {
          "value": "Yoke",
          "code": "GM03BETYYO"
        },
        {
          "value": "Military",
          "code": "GM03BETYMI"
        },
        {
          "value": "Other",
          "code": "GM04BETY99"
        },
        {
          "value": "Obi",
          "code": "GM03BETYOB"
        }
      ]
    },
    {
      "codeListName": "Closure",
      "values": [
        {
          "value": "Adjustable/Pull",
          "code": "GM03CLOSAP"
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        },
        {
          "value": "Back",
          "code": "GM03CLOSBC"
        },
        {
          "value": "Latch",
          "code": "GM03CLOSLA"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Click Top",
          "code": "GM03CLOSCT"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "Elastic Lace with Toggle",
          "code": "GM03CLOSET"
        },
        {
          "value": "Swivel",
          "code": "GM03CLOSSW"
        },
        {
          "value": "O Ring",
          "code": "GM03CLOSDO"
        },
        {
          "value": "Tab",
          "code": "GM03CLOSTB"
        },
        {
          "value": "Fishhook",
          "code": "GM03CLOSFS"
        },
        {
          "value": "Tie",
          "code": "GM03CLOSTI"
        },
        {
          "value": "Flap",
          "code": "GM03CLOSFP"
        },
        {
          "value": "Tie Back/Halter",
          "code": "GM03CLOSTH"
        },
        {
          "value": "Foldover",
          "code": "GM03CLOSFO"
        },
        {
          "value": "Tie Front",
          "code": "GM03CLOSTF"
        },
        {
          "value": "French Wire",
          "code": "GM03CLOSFW"
        },
        {
          "value": "Tie Side",
          "code": "GM03CLOSTS"
        },
        {
          "value": "Frog/Button Loop",
          "code": "GM03CLOSFA"
        },
        {
          "value": "Toggle",
          "code": "GM03CLOSTO"
        },
        {
          "value": "Front Button/Zip",
          "code": "GM03CLOSFZ"
        },
        {
          "value": "Toggle Front",
          "code": "GM03CLOSTN"
        },
        {
          "value": "Front Hook/Zip",
          "code": "GM03CLOSFH"
        },
        {
          "value": "Top Zip",
          "code": "GM03CLOSTZ"
        },
        {
          "value": "Hidden Button Front",
          "code": "GM03CLOSHB"
        },
        {
          "value": "Tunnel Side Tie",
          "code": "GM03CLOSTQ"
        },
        {
          "value": "Hidden Snap Front",
          "code": "GM03CLOSHS"
        },
        {
          "value": "Turn Lock",
          "code": "GM03CLOSTL"
        },
        {
          "value": "Hidden Zip Front",
          "code": "GM03CLOSHZ"
        },
        {
          "value": "Wrap",
          "code": "GM03CLOSWR"
        },
        {
          "value": "Hinged",
          "code": "GM03CLOSHI"
        },
        {
          "value": "Zipper",
          "code": "GM03CLOSZI"
        },
        {
          "value": "Hinged/Foldover",
          "code": "GM03CLOSHE"
        },
        {
          "value": "Zipper Back",
          "code": "GM03CLOSZB"
        },
        {
          "value": "Hook",
          "code": "GM03CLOSHO"
        },
        {
          "value": "Zipper Back Partial",
          "code": "GM03CLOSZP"
        },
        {
          "value": "Hook and Loop",
          "code": "GM03CLOSHL"
        },
        {
          "value": "Zipper Front",
          "code": "GM03CLOSZE"
        },
        {
          "value": "Hook-and-eye",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back Front",
          "code": "GM03CLOSHD"
        },
        {
          "value": "Zipper Side",
          "code": "GM03CLOSZS"
        },
        {
          "value": "Keyhole Button",
          "code": "GM03CLOSKB"
        },
        {
          "value": "Zipper Around",
          "code": "GM03CLOSZA"
        },
        {
          "value": "Kiss-Lock",
          "code": "GM03CLOSKL"
        },
        {
          "value": "1/4 Zip",
          "code": "GM03CLOSZQ"
        },
        {
          "value": "Knot",
          "code": "GM03CLOSKN"
        },
        {
          "value": "1/2 Zip",
          "code": "GM03CLOSZH"
        },
        {
          "value": "Lace Up",
          "code": "GM03CLOSLU"
        },
        {
          "value": "Other Closure",
          "code": "GM04CLOS99"
        }
      ]
    }
  ]
}

// Returns the full master-list options for a category (empty array if unknown).
export function getCategoryOptions(category: string): CategoryOptions {
  return GS1_CATEGORY_OPTIONS[category as ProductCategory] ?? []
}
