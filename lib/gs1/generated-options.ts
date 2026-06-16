// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-gs1-options.mjs from
// GS1_Extended_Attribute_Code_Lists_Fixed.csv.
// Run `node scripts/generate-gs1-options.mjs` to regenerate.
//
// Contains the FULL set of CSV-derived allowed values, scoped to each category's
// relevant Code List Names only. Server-only by convention: imported by API routes,
// never by client components (the client receives a single category via the
// /api/attribute-options route).
// =============================================================================

import type { ProductCategory, CategoryOptions } from "./types"

// Relevant Code List Names per category (the routing used to filter the CSV).
export const CATEGORY_CODE_LISTS: Record<ProductCategory, string[]> = {
  "Shoes": [
    "Shoe Type",
    "Shoe Style",
    "Closure",
    "Heel Type",
    "Heel Height Range",
    "Heel Material",
    "Toe Shape",
    "Sole Type",
    "Outsole Type",
    "Occasion",
    "Gender",
    "Water Repellent"
  ],
  "Apparel": [
    "Code List for Dress Type",
    "Sleeve Type",
    "Collar/Neck Type",
    "Closure",
    "Occasion",
    "Gender",
    "Code List for Fit",
    "Code Type for Length Description",
    "Primary Detail Type",
    "Primary Detail Placement",
    "Primary Detail Application"
  ],
  "Bags": [
    "Bag Type",
    "Closure",
    "Lining Material",
    "Special Embellishment",
    "Primary Detail Application",
    "Primary Detail Placement",
    "Occasion",
    "Gender"
  ],
  "Jewelry": [
    "Jewelry Type",
    "Jewelry Sets",
    "Earring Type",
    "Necklace Type",
    "Ring Type",
    "Bracelet Type",
    "Band Type",
    "Metal",
    "Closure",
    "Occasion",
    "Gender"
  ],
  "Beauty": [
    "Beauty Area of Use",
    "Beauty Treatment Specialty",
    "Skin Type",
    "Scent Type",
    "SPF Rating",
    "Code List for Formulation"
  ],
  "Home": [
    "Bedding Size",
    "Bedding Type",
    "Code List for Cookware Type",
    "Code List for Dinnerware Category",
    "Code List for Flatware Type",
    "Rug Type",
    "Towel Type",
    "Tableware Type",
    "Shape",
    "Care Instructions Code"
  ]
}

// Full CSV-derived allowed values per category, by Code List Name.
export const GS1_CATEGORY_OPTIONS: Record<ProductCategory, CategoryOptions> = {
  "Shoes": [
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
          "value": "Flats GM03SE TPFL Slippers",
          "code": "GM03SETPSL"
        },
        {
          "value": "Loafers/Mocs",
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
      "codeListName": "Shoe Style",
      "values": [
        {
          "value": "Alpine Boot",
          "code": "GM03SHOEAB"
        },
        {
          "value": "Hiking",
          "code": "GM03SHOEHK"
        },
        {
          "value": "Ankle Strap",
          "code": "GM03SHOEAS"
        },
        {
          "value": "High Top",
          "code": "GM03SHOEHT"
        },
        {
          "value": "Athleisure",
          "code": "GM03SHOEAT"
        },
        {
          "value": "Huarache",
          "code": "GM03SHOEHU"
        },
        {
          "value": "Ballet",
          "code": "GM03SHOEBA"
        },
        {
          "value": "Instep Strap",
          "code": "GM03SHOEIS"
        },
        {
          "value": "Baseball",
          "code": "GM03SHOEBB"
        },
        {
          "value": "Insulate d",
          "code": "GM03SHOEIN"
        },
        {
          "value": "Basketball",
          "code": "GM03SHOEBK"
        },
        {
          "value": "Loafer",
          "code": "GM03SHOELF"
        },
        {
          "value": "Biker Boot",
          "code": "GM03SHOEBI"
        },
        {
          "value": "Low Top",
          "code": "GM03SHOELT"
        },
        {
          "value": "Boat Shoe",
          "code": "GM03SHOEBS"
        },
        {
          "value": "Jellies",
          "code": "GM03SHOEJE"
        },
        {
          "value": "Bootie",
          "code": "GM03SHOEBT"
        },
        {
          "value": "Mary Jane",
          "code": "GM03SHOEMJ"
        },
        {
          "value": "Caged",
          "code": "GM03SHOECA"
        },
        {
          "value": "Military & Police",
          "code": "GM03SHOEMP"
        },
        {
          "value": "Chelsea",
          "code": "GM03SHOECH"
        },
        {
          "value": "Moccasin",
          "code": "GM03SHOEMC"
        },
        {
          "value": "Chukka",
          "code": "GM03SHOECK"
        },
        {
          "value": "Monk Strap",
          "code": "GM03SHOEMS"
        },
        {
          "value": "Cleats",
          "code": "GM03SHOECL"
        },
        {
          "value": "Penny Loafer",
          "code": "GM03SHOEPE"
        },
        {
          "value": "Climbing",
          "code": "GM03SHOECM"
        },
        {
          "value": "Platform",
          "code": "GM03SHOEPL"
        },
        {
          "value": "Combat Boot",
          "code": "GM03SHOECB"
        },
        {
          "value": "Rain Boot",
          "code": "GM03SHOERA"
        },
        {
          "value": "Comfort",
          "code": "GM03SHOECF"
        },
        {
          "value": "Riding Boot",
          "code": "GM03SHOERI"
        },
        {
          "value": "Cowboy",
          "code": "GM03SHOECW"
        },
        {
          "value": "Running",
          "code": "GM03SHOE"
        },
        {
          "value": "Cross -Fit",
          "code": "GM03SHOECR"
        },
        {
          "value": "Slide",
          "code": "GM03SHOESL"
        },
        {
          "value": "Cross -Training",
          "code": "GM03SHOECT"
        },
        {
          "value": "Sling Back",
          "code": "GM03SHOESB"
        },
        {
          "value": "Cycling",
          "code": "GM03SHOECY"
        },
        {
          "value": "Slipper",
          "code": "GM03SHOESP"
        },
        {
          "value": "Dance",
          "code": "GM03SHOEDA"
        },
        {
          "value": "Smoking Slipper",
          "code": "GM03SHOESM"
        },
        {
          "value": "D'Orsay",
          "code": "GM03SHOEDR"
        },
        {
          "value": "Sneaker",
          "code": "GM03SHOESN"
        },
        {
          "value": "Driver",
          "code": "GM03SHOEDV"
        },
        {
          "value": "Snow Boot",
          "code": "GM03SHOESW"
        },
        {
          "value": "Espadrille",
          "code": "GM03SHOEES"
        },
        {
          "value": "Soccer",
          "code": "GM03SHOESR"
        },
        {
          "value": "Fisherman",
          "code": "GM03SHOEFI"
        },
        {
          "value": "Steel Toe",
          "code": "GM03SHOEST"
        },
        {
          "value": "Flatform",
          "code": "GM03SHOEFL"
        },
        {
          "value": "Tennis",
          "code": "GM03SHOETE"
        },
        {
          "value": "Flip-Flop",
          "code": "GM03SHOEFP"
        },
        {
          "value": "Thong",
          "code": "GM03SHOETH"
        },
        {
          "value": "Football",
          "code": "GM03SHOEFT"
        },
        {
          "value": "Walking",
          "code": "GM03SHOEWA"
        },
        {
          "value": "Gladiator",
          "code": "GM03SHOEGL"
        },
        {
          "value": "Water Shoe",
          "code": "GM03SHOEWS"
        },
        {
          "value": "Golf GM03SH OEGF Wingtip",
          "code": "GM03SHOEWT"
        },
        {
          "value": "Hand-Sewn",
          "code": "GM03SHOEHS"
        },
        {
          "value": "Other",
          "code": "GM04SHOE99"
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
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Click Top GM03CL OSCT Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
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
          "code": "GM03CLOSZF"
        },
        {
          "value": "Hook-and-eye Front",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back",
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
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        }
      ]
    },
    {
      "codeListName": "Heel Type",
      "values": [
        {
          "value": "Block",
          "code": "GM03HLTYBL"
        },
        {
          "value": "No Heel",
          "code": "GM03HLTYNH"
        },
        {
          "value": "Cone",
          "code": "GM03HLTYCN"
        },
        {
          "value": "Novelty",
          "code": "GM03HLTYNV"
        },
        {
          "value": "Demi-Wedge",
          "code": "GM03HLTYDW"
        },
        {
          "value": "Stacked",
          "code": "GM03HLTYSA"
        },
        {
          "value": "Flare GM03HL TYFL Stiletto",
          "code": "GM03HLTYSL"
        },
        {
          "value": "Kitten",
          "code": "GM03HLTYKI"
        },
        {
          "value": "Wedge",
          "code": "GM03HLTYWE"
        },
        {
          "value": "Louis",
          "code": "GM03HLTYLU"
        },
        {
          "value": "Other",
          "code": "GM04HLTY99"
        }
      ]
    },
    {
      "codeListName": "Heel Height Range",
      "values": [
        {
          "value": "Extra -High > 3 inch",
          "code": "GM03HLHTEH"
        },
        {
          "value": "Low - >.5 to 1 inch",
          "code": "GM03HLHTLW"
        },
        {
          "value": "Flat - 0-.5 inch",
          "code": "GM03HLHTFL"
        },
        {
          "value": "Medium - > 1 inch - 2 inch",
          "code": "GM03HLHTMD"
        },
        {
          "value": "High > 2 inch - 3 inch GM03HLH THI Other",
          "code": "GM04HLHT99"
        }
      ]
    },
    {
      "codeListName": "Heel Material",
      "values": [
        {
          "value": "Cork",
          "code": "GM03HLMTCK"
        },
        {
          "value": "Rope",
          "code": "GM03HLMTRP"
        },
        {
          "value": "Embellished",
          "code": "GM03HLMTEM"
        },
        {
          "value": "Synthetic",
          "code": "GM03HLMTSY"
        },
        {
          "value": "Leather",
          "code": "GM03HLMTLE"
        },
        {
          "value": "Wood",
          "code": "GM03HLMTWD"
        },
        {
          "value": "Metal Rand",
          "code": "GM03HLMTMR"
        },
        {
          "value": "Other",
          "code": "GM04HLMT99"
        },
        {
          "value": "Metallic",
          "code": "GM03HLMTME"
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
          "value": "Apron Toe",
          "code": "GM03TOESAP"
        },
        {
          "value": "Snip",
          "code": "GM03TOESSN"
        },
        {
          "value": "Cap Toe",
          "code": "GM03TOESCT"
        },
        {
          "value": "Split Toe",
          "code": "GM03TOESSP"
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
          "value": "Open Toe",
          "code": "GM03TOESOT"
        },
        {
          "value": "Steel Toe",
          "code": "GM03TOESST"
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
      "codeListName": "Outsole Type",
      "values": [
        {
          "value": "Dimpled",
          "code": "GM03OUTSDP"
        },
        {
          "value": "Non-Slip",
          "code": "GM03OUTSNS"
        },
        {
          "value": "Driver",
          "code": "GM03OUTSDR"
        },
        {
          "value": "Tooth",
          "code": "GM03OUTSTT"
        },
        {
          "value": "Embossed",
          "code": "GM03OUTSEM"
        },
        {
          "value": "Tread",
          "code": "GM03OUTSTR"
        },
        {
          "value": "Heavy Lug",
          "code": "GM03OUTSHV"
        },
        {
          "value": "Other",
          "code": "GM04OUTS99"
        },
        {
          "value": "Light Lug",
          "code": "GM03OUTSLL"
        }
      ]
    },
    {
      "codeListName": "Occasion",
      "values": [
        {
          "value": "Active/Workout",
          "code": "GM03OCCNAW"
        },
        {
          "value": "Evening",
          "code": "GM03OCCNEV"
        },
        {
          "value": "Anniversary",
          "code": "GM03OCCNAN"
        },
        {
          "value": "Fashion",
          "code": "GM03OCCNFA"
        },
        {
          "value": "Athleisure",
          "code": "GM03OCCNAL"
        },
        {
          "value": "Flower Girl",
          "code": "GM03OCCNFG"
        },
        {
          "value": "Athletic",
          "code": "GM03OCCNAT"
        },
        {
          "value": "Formal",
          "code": "GM03OCCNFR"
        },
        {
          "value": "Baby Shower",
          "code": "GM03OCCNBS"
        },
        {
          "value": "Graduation",
          "code": "GM03OCCNGG"
        },
        {
          "value": "Beach/Pool",
          "code": "GM03OCCNBP"
        },
        {
          "value": "Groom",
          "code": "GM03OCCNGM"
        },
        {
          "value": "Birthday",
          "code": "GM03OCCNBI"
        },
        {
          "value": "Homecoming",
          "code": "GM03OCCNHM"
        },
        {
          "value": "Bride",
          "code": "GM03OCCNBR"
        },
        {
          "value": "Lounge",
          "code": "GM03OCCNLN"
        },
        {
          "value": "Bridesmaid",
          "code": "GM03OCCNBD"
        },
        {
          "value": "Mother of the Bride",
          "code": "GM03OCCNMB"
        },
        {
          "value": "Career",
          "code": "GM03OCCNCR"
        },
        {
          "value": "Outdoor",
          "code": "GM03OCCNUT"
        },
        {
          "value": "Casual",
          "code": "GM03OCCNCS"
        },
        {
          "value": "Performance",
          "code": "GM03OCCNPE"
        },
        {
          "value": "Christening/Baptism",
          "code": "GM03OCCNCB"
        },
        {
          "value": "Prom",
          "code": "GM03OCCNPR"
        },
        {
          "value": "Cocktail",
          "code": "GM03OCCNCT"
        },
        {
          "value": "Resort",
          "code": "GM03OCCNRE"
        },
        {
          "value": "Comfort",
          "code": "GM03OCCNCF"
        },
        {
          "value": "Ring Bearer",
          "code": "GM03OCCNRB"
        },
        {
          "value": "Communion",
          "code": "GM03OCCNCM"
        },
        {
          "value": "Safety",
          "code": "GM03OCCNSA"
        },
        {
          "value": "Daytime",
          "code": "GM03OCCNDT"
        },
        {
          "value": "Wedding",
          "code": "GM03OCCNSU"
        },
        {
          "value": "Dress",
          "code": "GM03OCCND"
        },
        {
          "value": "R Work/Uniform",
          "code": "GM03OCCNW"
        },
        {
          "value": "Easter",
          "code": "GM03OCCNEA"
        },
        {
          "value": "Other",
          "code": "GM04OCCN99"
        },
        {
          "value": "Engagement",
          "code": "GM03OCCNEN"
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
          "value": "Unisex",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        },
        {
          "value": "Other",
          "code": "ZZ04GEND99"
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
        },
        {
          "value": "Code",
          "code": "GM03CLNTBL"
        },
        {
          "value": "Advertised Origin",
          "code": "GM03ADVOIM"
        },
        {
          "value": "Boot Shaft Type",
          "code": "GM03BTSTTL"
        },
        {
          "value": "Closure",
          "code": "GM03CLOSZS"
        },
        {
          "value": "Gender",
          "code": "ZZ03GENDFE"
        },
        {
          "value": "Heel Height Range",
          "code": "GM03HLHTLW"
        },
        {
          "value": "Heel Material",
          "code": "GM03HLMTLE"
        },
        {
          "value": "Heel Type",
          "code": "GM03HLTYSA"
        },
        {
          "value": "Lined",
          "code": "GM03LINDFL"
        },
        {
          "value": "Lining Material",
          "code": "GM03LIMTLE"
        },
        {
          "value": "Shoe Type",
          "code": "GM03SETPBB"
        },
        {
          "value": "Sole Type",
          "code": "GM03SOLTSJ"
        },
        {
          "value": "Toe Shape",
          "code": "GM03TOESPY"
        },
        {
          "value": "Dinnerware Category",
          "code": "GM03DNRCFC"
        },
        {
          "value": "PID04 –",
          "code": "GM03ADVOMU"
        },
        {
          "value": "PID04 -",
          "code": "GM04BGST99"
        }
      ]
    }
  ],
  "Apparel": [
    {
      "codeListName": "Code List for Dress Type",
      "values": [
        {
          "value": "A-line",
          "code": "GM03DRTPAL"
        },
        {
          "value": "Pencil",
          "code": "GM03DRTPPE"
        },
        {
          "value": "Babydoll",
          "code": "GM03DRTPBA"
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
          "code": "GM03DRTPBC"
        },
        {
          "value": "Sheath",
          "code": "GM03DRTPSE"
        },
        {
          "value": "Caftan",
          "code": "GM03DRTPCA"
        },
        {
          "value": "Shift",
          "code": "GM03DRTPSI"
        },
        {
          "value": "Circular",
          "code": "GM03DRTPCI"
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
          "code": "GM03DRTPTP"
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
          "code": "GM03DRTPMA"
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
          "value": "Other Sleeve Type",
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
          "code": "GM03CLNTPO"
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
          "value": "Button -Down",
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
          "value": "¼-Zip Mock",
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
          "code": "GM03CLNTHN"
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
          "code": "GM03CLNTS"
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
          "code": "GM03CLNTYN"
        },
        {
          "value": "Peter Pan",
          "code": "GM03CLNTPA"
        },
        {
          "value": "Other Collar",
          "code": "GM04CLNT99"
        },
        {
          "value": "Platter",
          "code": "GM03CLNTPE"
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
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Click Top GM03CL OSCT Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
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
          "code": "GM03CLOSZF"
        },
        {
          "value": "Hook-and-eye Front",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back",
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
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        }
      ]
    },
    {
      "codeListName": "Occasion",
      "values": [
        {
          "value": "Active/Workout",
          "code": "GM03OCCNAW"
        },
        {
          "value": "Evening",
          "code": "GM03OCCNEV"
        },
        {
          "value": "Anniversary",
          "code": "GM03OCCNAN"
        },
        {
          "value": "Fashion",
          "code": "GM03OCCNFA"
        },
        {
          "value": "Athleisure",
          "code": "GM03OCCNAL"
        },
        {
          "value": "Flower Girl",
          "code": "GM03OCCNFG"
        },
        {
          "value": "Athletic",
          "code": "GM03OCCNAT"
        },
        {
          "value": "Formal",
          "code": "GM03OCCNFR"
        },
        {
          "value": "Baby Shower",
          "code": "GM03OCCNBS"
        },
        {
          "value": "Graduation",
          "code": "GM03OCCNGG"
        },
        {
          "value": "Beach/Pool",
          "code": "GM03OCCNBP"
        },
        {
          "value": "Groom",
          "code": "GM03OCCNGM"
        },
        {
          "value": "Birthday",
          "code": "GM03OCCNBI"
        },
        {
          "value": "Homecoming",
          "code": "GM03OCCNHM"
        },
        {
          "value": "Bride",
          "code": "GM03OCCNBR"
        },
        {
          "value": "Lounge",
          "code": "GM03OCCNLN"
        },
        {
          "value": "Bridesmaid",
          "code": "GM03OCCNBD"
        },
        {
          "value": "Mother of the Bride",
          "code": "GM03OCCNMB"
        },
        {
          "value": "Career",
          "code": "GM03OCCNCR"
        },
        {
          "value": "Outdoor",
          "code": "GM03OCCNUT"
        },
        {
          "value": "Casual",
          "code": "GM03OCCNCS"
        },
        {
          "value": "Performance",
          "code": "GM03OCCNPE"
        },
        {
          "value": "Christening/Baptism",
          "code": "GM03OCCNCB"
        },
        {
          "value": "Prom",
          "code": "GM03OCCNPR"
        },
        {
          "value": "Cocktail",
          "code": "GM03OCCNCT"
        },
        {
          "value": "Resort",
          "code": "GM03OCCNRE"
        },
        {
          "value": "Comfort",
          "code": "GM03OCCNCF"
        },
        {
          "value": "Ring Bearer",
          "code": "GM03OCCNRB"
        },
        {
          "value": "Communion",
          "code": "GM03OCCNCM"
        },
        {
          "value": "Safety",
          "code": "GM03OCCNSA"
        },
        {
          "value": "Daytime",
          "code": "GM03OCCNDT"
        },
        {
          "value": "Wedding",
          "code": "GM03OCCNSU"
        },
        {
          "value": "Dress",
          "code": "GM03OCCND"
        },
        {
          "value": "R Work/Uniform",
          "code": "GM03OCCNW"
        },
        {
          "value": "Easter",
          "code": "GM03OCCNEA"
        },
        {
          "value": "Other",
          "code": "GM04OCCN99"
        },
        {
          "value": "Engagement",
          "code": "GM03OCCNEN"
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
          "value": "Unisex",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        },
        {
          "value": "Other",
          "code": "ZZ04GEND99"
        }
      ]
    },
    {
      "codeListName": "Code List for Fit",
      "values": [
        {
          "value": "Relaxed",
          "code": "GM03FITTRE"
        },
        {
          "value": "Other",
          "code": "GM04FITT99"
        },
        {
          "value": "Structured",
          "code": "GM03FITTST"
        }
      ]
    },
    {
      "codeListName": "Code Type for Length Description",
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
          "value": "Ankle GM03L NTHAN Mini",
          "code": "GM03LNTHMN"
        },
        {
          "value": "Basketball",
          "code": "GM03LNTHBA"
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
          "code": "GM03LNTHTA"
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
          "code": "GM03LNTHKN"
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
      "codeListName": "Primary Detail Type",
      "values": [
        {
          "value": "Brand",
          "code": "GM03PDTPBR"
        },
        {
          "value": "Player Name",
          "code": "GM03PDTPPN"
        },
        {
          "value": "League",
          "code": "GM03PDTPLE"
        },
        {
          "value": "Script",
          "code": "GM03PDTPSC"
        },
        {
          "value": "Letter",
          "code": "GM03PDTPLT"
        },
        {
          "value": "Team",
          "code": "GM03PDTPTE"
        },
        {
          "value": "Mascot",
          "code": "GM03PDTPMA"
        },
        {
          "value": "Wordmark",
          "code": "GM03PDTPWM"
        },
        {
          "value": "Number",
          "code": "GM03PDTPNU"
        },
        {
          "value": "Other",
          "code": "GM04PDTP99"
        },
        {
          "value": "Patch",
          "code": "GM03PDTPPA"
        }
      ]
    },
    {
      "codeListName": "Primary Detail Placement",
      "values": [
        {
          "value": "All Over",
          "code": "GM03PDPLAA"
        },
        {
          "value": "Front Pocket",
          "code": "GM03PDPLFP"
        },
        {
          "value": "Back Bottom",
          "code": "GM03PDPLBB"
        },
        {
          "value": "Front Right",
          "code": "GM03PDPLFR"
        },
        {
          "value": "Back Center",
          "code": "GM03PDPLBC"
        },
        {
          "value": "Front Top",
          "code": "GM03PDPLFT"
        },
        {
          "value": "Back Left",
          "code": "GM03PDPLBL"
        },
        {
          "value": "Full Body",
          "code": "GM03PDPLFD"
        },
        {
          "value": "Back Pocket",
          "code": "GM03PDPLBP"
        },
        {
          "value": "Full Front",
          "code": "GM03PDPLFF"
        },
        {
          "value": "Back Right",
          "code": "GM03PDPLBR"
        },
        {
          "value": "Hem",
          "code": "GM03PDPLHE"
        },
        {
          "value": "Back Top",
          "code": "GM03PDPLBT"
        },
        {
          "value": "Left Leg",
          "code": "GM03PDPLLL"
        },
        {
          "value": "Bill",
          "code": "GM03PDPLBI"
        },
        {
          "value": "Left Sleeve",
          "code": "GM03PDPLLS"
        },
        {
          "value": "Collar",
          "code": "GM03PDPLCL"
        },
        {
          "value": "Leg",
          "code": "GM03PDPLLE"
        },
        {
          "value": "Cuff",
          "code": "GM03PDPLCU"
        },
        {
          "value": "Right Leg",
          "code": "GM03PDPLRL"
        },
        {
          "value": "Front Bot tom",
          "code": "GM03PDPLFB"
        },
        {
          "value": "Right Sleeve",
          "code": "GM03PDPLRS"
        },
        {
          "value": "Front Center",
          "code": "GM03PDPLFC"
        },
        {
          "value": "Sleeve",
          "code": "GM03PDPLSL"
        },
        {
          "value": "Front Left",
          "code": "GM03PDPLFL"
        },
        {
          "value": "Other",
          "code": "GM04PDPL99"
        }
      ]
    },
    {
      "codeListName": "Primary Detail Application",
      "values": [
        {
          "value": "Applique",
          "code": "GM03PDAPAP"
        },
        {
          "value": "Logo Pin",
          "code": "GM03PDAPLP"
        },
        {
          "value": "Banded",
          "code": "GM03PDAPBA"
        },
        {
          "value": "Metallic Ink",
          "code": "GM03PDAPMI"
        },
        {
          "value": "Bling",
          "code": "GM03PDAPBL"
        },
        {
          "value": "Patch",
          "code": "GM03PDAPPA"
        },
        {
          "value": "Cut",
          "code": "GM03PDAPCU"
        },
        {
          "value": "Printed",
          "code": "GM03PDAPPR"
        },
        {
          "value": "Decal",
          "code": "GM03PDAPDE"
        },
        {
          "value": "Printed Tackle Twill",
          "code": "GM03PDAPPT"
        },
        {
          "value": "Embossed",
          "code": "GM03PDAPEM"
        },
        {
          "value": "Raised Embroidery",
          "code": "GM03PDAPRE"
        },
        {
          "value": "Etched",
          "code": "GM03PDAPET"
        },
        {
          "value": "Reactive Glaze",
          "code": "GM03PDAPRG"
        },
        {
          "value": "Fabric Applique",
          "code": "GM03PDAPFA"
        },
        {
          "value": "Reflective Applique",
          "code": "GM03PDAPRA"
        },
        {
          "value": "Felt Applique",
          "code": "GM03PDAPFE"
        },
        {
          "value": "Reflective Screen Print",
          "code": "GM03PDAPRS"
        },
        {
          "value": "Flat Embroidered",
          "code": "GM03PDAPFM"
        },
        {
          "value": "Rhinestone",
          "code": "GM03PDAPRH"
        },
        {
          "value": "Foil",
          "code": "GM03PDAPFL"
        },
        {
          "value": "Screen Print",
          "code": "GM03PDAPSP"
        },
        {
          "value": "Glitter",
          "code": "GM03PDAPGL"
        },
        {
          "value": "Sequins",
          "code": "GM03PDAPSE"
        },
        {
          "value": "Hand Painted",
          "code": "GM03PDAPHP"
        },
        {
          "value": "Tackle Twill",
          "code": "GM03PDAPTT"
        },
        {
          "value": "Heat Seal",
          "code": "GM03PDAPHS"
        },
        {
          "value": "Woven",
          "code": "GM03PDAPWV"
        },
        {
          "value": "High-Density Ink",
          "code": "GM03PDAPHD"
        },
        {
          "value": "Other",
          "code": "GM04PDAP99"
        },
        {
          "value": "Jacquard Knit",
          "code": "GM03PDAPJN"
        }
      ]
    }
  ],
  "Bags": [
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
      "codeListName": "Closure",
      "values": [
        {
          "value": "Adjustable/Pull",
          "code": "GM03CLOSAP"
        },
        {
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Click Top GM03CL OSCT Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
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
          "code": "GM03CLOSZF"
        },
        {
          "value": "Hook-and-eye Front",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back",
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
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
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
          "value": "Sherp a",
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
      "codeListName": "Special Embellishment",
      "values": [
        {
          "value": "Beads",
          "code": "GM03SPEMBE"
        },
        {
          "value": "Logo",
          "code": "GM03SPEMLG"
        },
        {
          "value": "Belting",
          "code": "GM03SPEMBL"
        },
        {
          "value": "Bows",
          "code": "GM03SPEMBW"
        },
        {
          "value": "Metal Ornament",
          "code": "GM03SPEMMR"
        },
        {
          "value": "Braiding",
          "code": "GM03SPEMBR"
        },
        {
          "value": "Nailheads",
          "code": "GM03SPEMNA"
        },
        {
          "value": "Broguing",
          "code": "GM03SPEMBG"
        },
        {
          "value": "Penny Keeper",
          "code": "GM03SPEMPK"
        },
        {
          "value": "Buckle(s)",
          "code": "GM03SPEMBU"
        },
        {
          "value": "Perforation",
          "code": "GM03SPEMPE"
        },
        {
          "value": "Chain",
          "code": "GM03SPEMCH"
        },
        {
          "value": "Piping",
          "code": "GM03SPEMPI"
        },
        {
          "value": "Contrast Stitching",
          "code": "GM03SPEMCS"
        },
        {
          "value": "Pleated",
          "code": "GM03SPEMPL"
        },
        {
          "value": "Crochet",
          "code": "GM03SPEMCR"
        },
        {
          "value": "Quilting",
          "code": "GM03SPEMQU"
        },
        {
          "value": "Cuff",
          "code": "GM03SPEMCF"
        },
        {
          "value": "Rhinestones",
          "code": "GM03SPEMRH"
        },
        {
          "value": "Cut-outs",
          "code": "GM03SPEMCU"
        },
        {
          "value": "Ruffles",
          "code": "GM03SPEMRU"
        },
        {
          "value": "Embroidery",
          "code": "GM03SPEMEM"
        },
        {
          "value": "Sequins",
          "code": "GM03SPEMSE"
        },
        {
          "value": "Feathers",
          "code": "GM03SPEMFE"
        },
        {
          "value": "Speed Lacing",
          "code": "GM03SPEMSL"
        },
        {
          "value": "Filigree",
          "code": "GM03SPEMFI"
        },
        {
          "value": "Stones",
          "code": "GM03SPEM"
        },
        {
          "value": "Flower",
          "code": "GM03SPEMFL"
        },
        {
          "value": "Studded",
          "code": "GM03SPEMST"
        },
        {
          "value": "Fringe",
          "code": "GM03SPEMFR"
        },
        {
          "value": "Tassels",
          "code": "GM03SPEMTA"
        },
        {
          "value": "Glitter",
          "code": "GM03SPEMGL"
        },
        {
          "value": "Tortoise",
          "code": "GM03SPEMTS"
        },
        {
          "value": "Grommets",
          "code": "GM03SPEMGR"
        },
        {
          "value": "Wood",
          "code": "GM03SPEMWD"
        },
        {
          "value": "Harness",
          "code": "GM03SPEMHA"
        },
        {
          "value": "Zipper",
          "code": "GM03SPEMZI"
        },
        {
          "value": "Jewels",
          "code": "GM03SPEMJE"
        },
        {
          "value": "Other",
          "code": "GM04SPEM99"
        },
        {
          "value": "Knotting",
          "code": "GM03SPEMKN"
        },
        {
          "value": "Lace",
          "code": "GM03SPEMLA"
        }
      ]
    },
    {
      "codeListName": "Primary Detail Application",
      "values": [
        {
          "value": "Applique",
          "code": "GM03PDAPAP"
        },
        {
          "value": "Logo Pin",
          "code": "GM03PDAPLP"
        },
        {
          "value": "Banded",
          "code": "GM03PDAPBA"
        },
        {
          "value": "Metallic Ink",
          "code": "GM03PDAPMI"
        },
        {
          "value": "Bling",
          "code": "GM03PDAPBL"
        },
        {
          "value": "Patch",
          "code": "GM03PDAPPA"
        },
        {
          "value": "Cut",
          "code": "GM03PDAPCU"
        },
        {
          "value": "Printed",
          "code": "GM03PDAPPR"
        },
        {
          "value": "Decal",
          "code": "GM03PDAPDE"
        },
        {
          "value": "Printed Tackle Twill",
          "code": "GM03PDAPPT"
        },
        {
          "value": "Embossed",
          "code": "GM03PDAPEM"
        },
        {
          "value": "Raised Embroidery",
          "code": "GM03PDAPRE"
        },
        {
          "value": "Etched",
          "code": "GM03PDAPET"
        },
        {
          "value": "Reactive Glaze",
          "code": "GM03PDAPRG"
        },
        {
          "value": "Fabric Applique",
          "code": "GM03PDAPFA"
        },
        {
          "value": "Reflective Applique",
          "code": "GM03PDAPRA"
        },
        {
          "value": "Felt Applique",
          "code": "GM03PDAPFE"
        },
        {
          "value": "Reflective Screen Print",
          "code": "GM03PDAPRS"
        },
        {
          "value": "Flat Embroidered",
          "code": "GM03PDAPFM"
        },
        {
          "value": "Rhinestone",
          "code": "GM03PDAPRH"
        },
        {
          "value": "Foil",
          "code": "GM03PDAPFL"
        },
        {
          "value": "Screen Print",
          "code": "GM03PDAPSP"
        },
        {
          "value": "Glitter",
          "code": "GM03PDAPGL"
        },
        {
          "value": "Sequins",
          "code": "GM03PDAPSE"
        },
        {
          "value": "Hand Painted",
          "code": "GM03PDAPHP"
        },
        {
          "value": "Tackle Twill",
          "code": "GM03PDAPTT"
        },
        {
          "value": "Heat Seal",
          "code": "GM03PDAPHS"
        },
        {
          "value": "Woven",
          "code": "GM03PDAPWV"
        },
        {
          "value": "High-Density Ink",
          "code": "GM03PDAPHD"
        },
        {
          "value": "Other",
          "code": "GM04PDAP99"
        },
        {
          "value": "Jacquard Knit",
          "code": "GM03PDAPJN"
        }
      ]
    },
    {
      "codeListName": "Primary Detail Placement",
      "values": [
        {
          "value": "All Over",
          "code": "GM03PDPLAA"
        },
        {
          "value": "Front Pocket",
          "code": "GM03PDPLFP"
        },
        {
          "value": "Back Bottom",
          "code": "GM03PDPLBB"
        },
        {
          "value": "Front Right",
          "code": "GM03PDPLFR"
        },
        {
          "value": "Back Center",
          "code": "GM03PDPLBC"
        },
        {
          "value": "Front Top",
          "code": "GM03PDPLFT"
        },
        {
          "value": "Back Left",
          "code": "GM03PDPLBL"
        },
        {
          "value": "Full Body",
          "code": "GM03PDPLFD"
        },
        {
          "value": "Back Pocket",
          "code": "GM03PDPLBP"
        },
        {
          "value": "Full Front",
          "code": "GM03PDPLFF"
        },
        {
          "value": "Back Right",
          "code": "GM03PDPLBR"
        },
        {
          "value": "Hem",
          "code": "GM03PDPLHE"
        },
        {
          "value": "Back Top",
          "code": "GM03PDPLBT"
        },
        {
          "value": "Left Leg",
          "code": "GM03PDPLLL"
        },
        {
          "value": "Bill",
          "code": "GM03PDPLBI"
        },
        {
          "value": "Left Sleeve",
          "code": "GM03PDPLLS"
        },
        {
          "value": "Collar",
          "code": "GM03PDPLCL"
        },
        {
          "value": "Leg",
          "code": "GM03PDPLLE"
        },
        {
          "value": "Cuff",
          "code": "GM03PDPLCU"
        },
        {
          "value": "Right Leg",
          "code": "GM03PDPLRL"
        },
        {
          "value": "Front Bot tom",
          "code": "GM03PDPLFB"
        },
        {
          "value": "Right Sleeve",
          "code": "GM03PDPLRS"
        },
        {
          "value": "Front Center",
          "code": "GM03PDPLFC"
        },
        {
          "value": "Sleeve",
          "code": "GM03PDPLSL"
        },
        {
          "value": "Front Left",
          "code": "GM03PDPLFL"
        },
        {
          "value": "Other",
          "code": "GM04PDPL99"
        }
      ]
    },
    {
      "codeListName": "Occasion",
      "values": [
        {
          "value": "Active/Workout",
          "code": "GM03OCCNAW"
        },
        {
          "value": "Evening",
          "code": "GM03OCCNEV"
        },
        {
          "value": "Anniversary",
          "code": "GM03OCCNAN"
        },
        {
          "value": "Fashion",
          "code": "GM03OCCNFA"
        },
        {
          "value": "Athleisure",
          "code": "GM03OCCNAL"
        },
        {
          "value": "Flower Girl",
          "code": "GM03OCCNFG"
        },
        {
          "value": "Athletic",
          "code": "GM03OCCNAT"
        },
        {
          "value": "Formal",
          "code": "GM03OCCNFR"
        },
        {
          "value": "Baby Shower",
          "code": "GM03OCCNBS"
        },
        {
          "value": "Graduation",
          "code": "GM03OCCNGG"
        },
        {
          "value": "Beach/Pool",
          "code": "GM03OCCNBP"
        },
        {
          "value": "Groom",
          "code": "GM03OCCNGM"
        },
        {
          "value": "Birthday",
          "code": "GM03OCCNBI"
        },
        {
          "value": "Homecoming",
          "code": "GM03OCCNHM"
        },
        {
          "value": "Bride",
          "code": "GM03OCCNBR"
        },
        {
          "value": "Lounge",
          "code": "GM03OCCNLN"
        },
        {
          "value": "Bridesmaid",
          "code": "GM03OCCNBD"
        },
        {
          "value": "Mother of the Bride",
          "code": "GM03OCCNMB"
        },
        {
          "value": "Career",
          "code": "GM03OCCNCR"
        },
        {
          "value": "Outdoor",
          "code": "GM03OCCNUT"
        },
        {
          "value": "Casual",
          "code": "GM03OCCNCS"
        },
        {
          "value": "Performance",
          "code": "GM03OCCNPE"
        },
        {
          "value": "Christening/Baptism",
          "code": "GM03OCCNCB"
        },
        {
          "value": "Prom",
          "code": "GM03OCCNPR"
        },
        {
          "value": "Cocktail",
          "code": "GM03OCCNCT"
        },
        {
          "value": "Resort",
          "code": "GM03OCCNRE"
        },
        {
          "value": "Comfort",
          "code": "GM03OCCNCF"
        },
        {
          "value": "Ring Bearer",
          "code": "GM03OCCNRB"
        },
        {
          "value": "Communion",
          "code": "GM03OCCNCM"
        },
        {
          "value": "Safety",
          "code": "GM03OCCNSA"
        },
        {
          "value": "Daytime",
          "code": "GM03OCCNDT"
        },
        {
          "value": "Wedding",
          "code": "GM03OCCNSU"
        },
        {
          "value": "Dress",
          "code": "GM03OCCND"
        },
        {
          "value": "R Work/Uniform",
          "code": "GM03OCCNW"
        },
        {
          "value": "Easter",
          "code": "GM03OCCNEA"
        },
        {
          "value": "Other",
          "code": "GM04OCCN99"
        },
        {
          "value": "Engagement",
          "code": "GM03OCCNEN"
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
          "value": "Unisex",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        },
        {
          "value": "Other",
          "code": "ZZ04GEND99"
        }
      ]
    }
  ],
  "Jewelry": [
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
          "value": "Fashion JW03JW LTFA Other",
          "code": "JW04JWLT99"
        }
      ]
    },
    {
      "codeListName": "Jewelry Sets",
      "values": [
        {
          "value": "Bracelet/Ears",
          "code": "JW03JWSTBE"
        },
        {
          "value": "Neck/Ears/Bracelet",
          "code": "JW03JWSTNB"
        },
        {
          "value": "Neck/Ears",
          "code": "JW03JWSTNE"
        },
        {
          "value": "Other",
          "code": "JW04JWST"
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
          "code": "JW03EATPHP"
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
          "code": "JW03EATPEC"
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
          "value": "Penda nt",
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
          "code": "JW03BRTTBA"
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
      "codeListName": "Metal",
      "values": [
        {
          "value": "Aluminum",
          "code": "JW03METLAI"
        },
        {
          "value": "Platinum",
          "code": "JW03METLPT"
        },
        {
          "value": "Brass",
          "code": "JW03METLBR"
        },
        {
          "value": "Rhodium",
          "code": "JW03METLRH"
        },
        {
          "value": "Bronze",
          "code": "JW03METLBZ"
        },
        {
          "value": "Rose Gold",
          "code": "JW03METLRG"
        },
        {
          "value": "Cast Iron",
          "code": "JW03METLCI"
        },
        {
          "value": "Silver",
          "code": "JW03METLAG"
        },
        {
          "value": "Copper",
          "code": "JW03METLCU"
        },
        {
          "value": "Gold",
          "code": "JW03METLAU"
        },
        {
          "value": "Titanium",
          "code": "JW03METLTI"
        },
        {
          "value": "Gold Plated",
          "code": "JW03METLGP"
        },
        {
          "value": "White Gold",
          "code": "JW03METLWG"
        },
        {
          "value": "Nickel",
          "code": "JW03METLNI"
        },
        {
          "value": "Other",
          "code": "JW04METL99"
        },
        {
          "value": "Palladium",
          "code": "JW03METLPD"
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
          "value": "Leverback",
          "code": "GM03CLOSLB"
        },
        {
          "value": "Back Button/Zip",
          "code": "GM03CLOSBB"
        },
        {
          "value": "Lift-Lock",
          "code": "GM03CLOSLL"
        },
        {
          "value": "Back Hook/Zip",
          "code": "GM03CLOSBH"
        },
        {
          "value": "Link/Clasp",
          "code": "GM03CLOSLC"
        },
        {
          "value": "Barrel",
          "code": "GM03CLOSBA"
        },
        {
          "value": "Lobster Claw",
          "code": "GM03CLOSLW"
        },
        {
          "value": "Box Tab Insert",
          "code": "GM03CLOSBT"
        },
        {
          "value": "Magnetic",
          "code": "GM03CLOSMG"
        },
        {
          "value": "Buckle",
          "code": "GM03CLOSBU"
        },
        {
          "value": "Pierced Post",
          "code": "GM03CLOSPP"
        },
        {
          "value": "Button",
          "code": "GM03CLOSBN"
        },
        {
          "value": "Push-Lock",
          "code": "GM03CLOSPL"
        },
        {
          "value": "Button Back",
          "code": "GM03CLOSBK"
        },
        {
          "value": "Side Button/Zip",
          "code": "GM03CLOSSB"
        },
        {
          "value": "Button Front",
          "code": "GM03CLOSBF"
        },
        {
          "value": "Side Hook/Zip",
          "code": "GM03CLOSSZ"
        },
        {
          "value": "Button Front Partial",
          "code": "GM03CLOSBP"
        },
        {
          "value": "Snap",
          "code": "GM03CLOSSN"
        },
        {
          "value": "Button Shoulder",
          "code": "GM03CLOSBS"
        },
        {
          "value": "Snap Back",
          "code": "GM03CLOSSM"
        },
        {
          "value": "Clasp",
          "code": "GM03CLOSCL"
        },
        {
          "value": "Snap Front",
          "code": "GM03CLOSSF"
        },
        {
          "value": "Click Top GM03CL OSCT Snap Front Partial",
          "code": "GM03CLOSS2"
        },
        {
          "value": "Clip On",
          "code": "GM03CLOSCO"
        },
        {
          "value": "Snap Legs",
          "code": "GM03CLOSSE"
        },
        {
          "value": "Drawstring",
          "code": "GM03CLOSDS"
        },
        {
          "value": "Snap Shoulder",
          "code": "GM03CLOSSS"
        },
        {
          "value": "Drawstring Front",
          "code": "GM03CLOSDF"
        },
        {
          "value": "Snap Post",
          "code": "GM03CLOSSA"
        },
        {
          "value": "Drawstring Elastic",
          "code": "GM03CLOSDE"
        },
        {
          "value": "String",
          "code": "GM03CLOSSR"
        },
        {
          "value": "D Ring",
          "code": "GM03CLOSDR"
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
          "code": "GM03CLOSZF"
        },
        {
          "value": "Hook-and-eye Front",
          "code": "GM03CLOSHC"
        },
        {
          "value": "Zipper Front Partial",
          "code": "GM03CLOSZR"
        },
        {
          "value": "Hook-and-eye Back",
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
        },
        {
          "value": "Lace-up Front",
          "code": "GM03CLOSLF"
        }
      ]
    },
    {
      "codeListName": "Occasion",
      "values": [
        {
          "value": "Active/Workout",
          "code": "GM03OCCNAW"
        },
        {
          "value": "Evening",
          "code": "GM03OCCNEV"
        },
        {
          "value": "Anniversary",
          "code": "GM03OCCNAN"
        },
        {
          "value": "Fashion",
          "code": "GM03OCCNFA"
        },
        {
          "value": "Athleisure",
          "code": "GM03OCCNAL"
        },
        {
          "value": "Flower Girl",
          "code": "GM03OCCNFG"
        },
        {
          "value": "Athletic",
          "code": "GM03OCCNAT"
        },
        {
          "value": "Formal",
          "code": "GM03OCCNFR"
        },
        {
          "value": "Baby Shower",
          "code": "GM03OCCNBS"
        },
        {
          "value": "Graduation",
          "code": "GM03OCCNGG"
        },
        {
          "value": "Beach/Pool",
          "code": "GM03OCCNBP"
        },
        {
          "value": "Groom",
          "code": "GM03OCCNGM"
        },
        {
          "value": "Birthday",
          "code": "GM03OCCNBI"
        },
        {
          "value": "Homecoming",
          "code": "GM03OCCNHM"
        },
        {
          "value": "Bride",
          "code": "GM03OCCNBR"
        },
        {
          "value": "Lounge",
          "code": "GM03OCCNLN"
        },
        {
          "value": "Bridesmaid",
          "code": "GM03OCCNBD"
        },
        {
          "value": "Mother of the Bride",
          "code": "GM03OCCNMB"
        },
        {
          "value": "Career",
          "code": "GM03OCCNCR"
        },
        {
          "value": "Outdoor",
          "code": "GM03OCCNUT"
        },
        {
          "value": "Casual",
          "code": "GM03OCCNCS"
        },
        {
          "value": "Performance",
          "code": "GM03OCCNPE"
        },
        {
          "value": "Christening/Baptism",
          "code": "GM03OCCNCB"
        },
        {
          "value": "Prom",
          "code": "GM03OCCNPR"
        },
        {
          "value": "Cocktail",
          "code": "GM03OCCNCT"
        },
        {
          "value": "Resort",
          "code": "GM03OCCNRE"
        },
        {
          "value": "Comfort",
          "code": "GM03OCCNCF"
        },
        {
          "value": "Ring Bearer",
          "code": "GM03OCCNRB"
        },
        {
          "value": "Communion",
          "code": "GM03OCCNCM"
        },
        {
          "value": "Safety",
          "code": "GM03OCCNSA"
        },
        {
          "value": "Daytime",
          "code": "GM03OCCNDT"
        },
        {
          "value": "Wedding",
          "code": "GM03OCCNSU"
        },
        {
          "value": "Dress",
          "code": "GM03OCCND"
        },
        {
          "value": "R Work/Uniform",
          "code": "GM03OCCNW"
        },
        {
          "value": "Easter",
          "code": "GM03OCCNEA"
        },
        {
          "value": "Other",
          "code": "GM04OCCN99"
        },
        {
          "value": "Engagement",
          "code": "GM03OCCNEN"
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
          "value": "Unisex",
          "code": "ZZ03GENDUN"
        },
        {
          "value": "Male",
          "code": "ZZ03GENDMA"
        },
        {
          "value": "Other",
          "code": "ZZ04GEND99"
        }
      ]
    }
  ],
  "Beauty": [
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
          "value": "Nail",
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
          "value": "Other",
          "code": "GM04BTSP99"
        },
        {
          "value": "Night",
          "code": "GM03BTSPNI"
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
          "code": "GM03SCTPCI"
        },
        {
          "value": "Powdery",
          "code": "GM03SCTPPW"
        },
        {
          "value": "Earthy",
          "code": "GM03SCTPEA"
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
          "code": "GM03SCTPMI"
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
      "codeListName": "Code List for Formulation",
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
          "value": "Cream -To-Powder",
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
    }
  ],
  "Home": [
    {
      "codeListName": "Bedding Size",
      "values": [
        {
          "value": "Baby/Swa ddle",
          "code": "GM03BDSZBS"
        },
        {
          "value": "Jumbo",
          "code": "GM03BDSZJU"
        },
        {
          "value": "Body",
          "code": "GM03BDSZBD"
        },
        {
          "value": "King",
          "code": "GM03BDSZKI"
        },
        {
          "value": "California King",
          "code": "GM03BDSZCK"
        },
        {
          "value": "Queen",
          "code": "GM03BDSZQU"
        },
        {
          "value": "Contour",
          "code": "GM03BDSZCN"
        },
        {
          "value": "Standard",
          "code": "GM03BDSZST"
        },
        {
          "value": "Crib",
          "code": "GM03BDSZCR"
        },
        {
          "value": "Throw",
          "code": "GM03BDSZTH"
        },
        {
          "value": "Euro",
          "code": "GM03BDSZEU"
        },
        {
          "value": "Twin",
          "code": "GM03BDSZTW"
        },
        {
          "value": "Full/Queen",
          "code": "GM03BDSZFQ"
        },
        {
          "value": "Twin Extra Long",
          "code": "GM03BDSZTX"
        },
        {
          "value": "Full/Standard",
          "code": "GM03BDSZFS"
        },
        {
          "value": "Other",
          "code": "GM04BDSZ99"
        }
      ]
    },
    {
      "codeListName": "Bedding Type",
      "values": [
        {
          "value": "Bedspread",
          "code": "GM03BEDTBS"
        },
        {
          "value": "Pillowcase",
          "code": "GM03BEDTPC"
        },
        {
          "value": "Comforter",
          "code": "GM03BEDTCM"
        },
        {
          "value": "Sham",
          "code": "GM03BEDTSH"
        },
        {
          "value": "Duvet Cover",
          "code": "GM03BEDTDC"
        },
        {
          "value": "Sheet Set",
          "code": "GM03BEDTSS"
        },
        {
          "value": "Fitted Sheet",
          "code": "GM03BEDTFI"
        },
        {
          "value": "Other",
          "code": "GM04BEDT99"
        },
        {
          "value": "Flat Sheet",
          "code": "GM03BEDTFL"
        }
      ]
    },
    {
      "codeListName": "Code List for Cookware Type",
      "values": [
        {
          "value": "Cake Pan",
          "code": "GM03COOKCP"
        },
        {
          "value": "Pie Pan",
          "code": "GM03COOKPP"
        },
        {
          "value": "Casserole Dish",
          "code": "GM03COOKCD"
        },
        {
          "value": "Pizza Pan",
          "code": "GM03COOKPI"
        },
        {
          "value": "Cookie Sheet",
          "code": "GM03COOKCS"
        },
        {
          "value": "Pressure Cooker",
          "code": "GM03COOKPC"
        },
        {
          "value": "Cupcake/Muffin Pan GM03CO OKCM Roaster",
          "code": "GM03COOKRR"
        },
        {
          "value": "Dutch Oven",
          "code": "GM03COOKDU"
        },
        {
          "value": "Saucepan",
          "code": "GM03COOKSA"
        },
        {
          "value": "Frying Pan",
          "code": "GM03COOKFP"
        },
        {
          "value": "Sauté Pan",
          "code": "GM03COOKSE"
        },
        {
          "value": "Griddle",
          "code": "GM03COOKGR"
        },
        {
          "value": "Set",
          "code": "GM03COOKST"
        },
        {
          "value": "Lids and accessory",
          "code": "GM03COOKLA"
        },
        {
          "value": "Specialty",
          "code": "GM03COOKSP"
        },
        {
          "value": "Multi-Cooker/Stockpot",
          "code": "GM03COOKMS"
        },
        {
          "value": "Other",
          "code": "GM04COOK99"
        }
      ]
    },
    {
      "codeListName": "Code List for Dinnerware Category",
      "values": [
        {
          "value": "Everyday",
          "code": "GM03DNRCEV"
        },
        {
          "value": "Other",
          "code": "GM04DNRC99"
        },
        {
          "value": "Fine China",
          "code": "GM03DNRCFC"
        }
      ]
    },
    {
      "codeListName": "Code List for Flatware Type",
      "values": [
        {
          "value": "Butter Knife",
          "code": "GM03FLATBU"
        },
        {
          "value": "Pasta Server",
          "code": "GM03FLATPA"
        },
        {
          "value": "Cake Knife",
          "code": "GM03FLATCA"
        },
        {
          "value": "Pierced Serving Spoon",
          "code": "GM03FLATPI"
        },
        {
          "value": "Carving Fork",
          "code": "GM03FLATCR"
        },
        {
          "value": "Salad Fork",
          "code": "GM03FLATSA"
        },
        {
          "value": "Cocktail Fork",
          "code": "GM03FLATCC"
        },
        {
          "value": "Serving Fork",
          "code": "GM03FLATSF"
        },
        {
          "value": "Cocktail Spoon",
          "code": "GM03FLATCS"
        },
        {
          "value": "Serving Spoon",
          "code": "GM03FLATSS"
        },
        {
          "value": "Dessert Server",
          "code": "GM03FLATDE"
        },
        {
          "value": "Soup Spoon",
          "code": "GM03FLATSP"
        },
        {
          "value": "Dinner Fork",
          "code": "GM03FLATDI"
        },
        {
          "value": "Spoon",
          "code": "GM03FLATSN"
        },
        {
          "value": "Fork",
          "code": "GM03FLATFK"
        },
        {
          "value": "Spreader Knife",
          "code": "GM03FLATSK"
        },
        {
          "value": "Ice Tea Spoon",
          "code": "GM03FLATIC"
        },
        {
          "value": "Steak Knife",
          "code": "GM03FLATST"
        },
        {
          "value": "Knife",
          "code": "GM03FLATKN"
        },
        {
          "value": "Sugar Spoon",
          "code": "GM03FLATSU"
        },
        {
          "value": "Ladle",
          "code": "GM03FLATLD"
        },
        {
          "value": "Tablespoon",
          "code": "GM03FLATTA"
        },
        {
          "value": "Lasagna Server",
          "code": "GM03FLATLS"
        },
        {
          "value": "Teaspoon",
          "code": "GM03FLATTE"
        },
        {
          "value": "Luncheon Fork",
          "code": "GM03FLATLF"
        },
        {
          "value": "Tongs",
          "code": "GM03FLATTG"
        },
        {
          "value": "Luncheon Knife",
          "code": "GM03FLATLK"
        },
        {
          "value": "Other",
          "code": "GM04FLAT99"
        }
      ]
    },
    {
      "codeListName": "Rug Type",
      "values": [
        {
          "value": "Accent",
          "code": "GM03RUGTAC"
        },
        {
          "value": "Outdoor",
          "code": "GM03RUGTUT"
        },
        {
          "value": "Bath",
          "code": "GM03RUGTBA"
        },
        {
          "value": "Rug Pad",
          "code": "GM03RUGTRP"
        },
        {
          "value": "Dining Room",
          "code": "GM03RUGTDR"
        },
        {
          "value": "Runners",
          "code": "GM03RUGTRU"
        },
        {
          "value": "Doormat GM03RU GTDM Other",
          "code": "GM04RUGT99"
        },
        {
          "value": "Kitchen",
          "code": "GM03RUGTKI"
        }
      ]
    },
    {
      "codeListName": "Towel Type",
      "values": [
        {
          "value": "Bath",
          "code": "GM03TOWLBA"
        },
        {
          "value": "Towel Set",
          "code": "GM03TOWLTS"
        },
        {
          "value": "Beach",
          "code": "GM03TOWLBE"
        },
        {
          "value": "Wash",
          "code": "GM03TOWLWA"
        },
        {
          "value": "Hand",
          "code": "GM03TOWLHA"
        },
        {
          "value": "Other",
          "code": "GM04TOWL99"
        },
        {
          "value": "Kitchen",
          "code": "GM03TOWLKI"
        }
      ]
    },
    {
      "codeListName": "Tableware Type",
      "values": [
        {
          "value": "Dinnerware",
          "code": "GM03TBLTDI"
        },
        {
          "value": "Glassware",
          "code": "GM03TBLTGL"
        },
        {
          "value": "Flatware",
          "code": "GM03TBLTFL"
        },
        {
          "value": "Other",
          "code": "GM04TBLT99"
        }
      ]
    },
    {
      "codeListName": "Shape",
      "values": [
        {
          "value": "Bedrest",
          "code": "GM03SHPEBE"
        },
        {
          "value": "Rectangular",
          "code": "GM03SHPERE"
        },
        {
          "value": "Bolster",
          "code": "GM03SHPEBL"
        },
        {
          "value": "Round",
          "code": "GM03SHPERO"
        },
        {
          "value": "Breakfast /Boudoir",
          "code": "GM03SHPEBB"
        },
        {
          "value": "Shaped/Novelty",
          "code": "GM03SHPESN"
        },
        {
          "value": "Figure/Shaped",
          "code": "GM03SHPEFS"
        },
        {
          "value": "Soft Square",
          "code": "GM03SHPESS"
        },
        {
          "value": "Lumbar",
          "code": "GM03SHPELU"
        },
        {
          "value": "Square",
          "code": "GM03SHPESQ"
        },
        {
          "value": "Neckroll",
          "code": "GM03SHPENE"
        },
        {
          "value": "Triangle",
          "code": "GM03SHPETR"
        },
        {
          "value": "Oval/Oblong",
          "code": "GM03SHPEVB"
        },
        {
          "value": "Other",
          "code": "GM04SHPE99"
        }
      ]
    },
    {
      "codeListName": "Care Instructions Code",
      "values": [
        {
          "value": "Dishwasher Safe",
          "code": "GM03CAINDS"
        },
        {
          "value": "Machine Wash Hot",
          "code": "GM03CAINMH"
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
    }
  ]
}

// Returns the full CSV-derived options for a category (empty array if unknown).
export function getCategoryOptions(category: string): CategoryOptions {
  return GS1_CATEGORY_OPTIONS[category as ProductCategory] ?? []
}
