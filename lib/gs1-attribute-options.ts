// Curated, category-specific GS1 extended-attribute options.
//
// Source of truth: GS1_Extended_Attribute_Code_Lists_Fixed.csv (repo root).
// These values were curated MANUALLY from that CSV for the prototype — there is no
// runtime CSV parser yet, and the full CSV is intentionally NOT loaded into the client
// or sent to any model. Each category includes only a practical subset of relevant Code
// List Names and values. Obvious CSV spacing/OCR artifacts have been normalized in the
// display names and values below, while the original GS1 codes are preserved verbatim.

export type ProductCategory = "Shoes" | "Apparel" | "Bags" | "Jewelry" | "Beauty" | "Home"

export type GS1AttributeOption = {
  codeListName: string
  values: {
    value: string
    code: string
  }[]
}

// Shared Closure subset (the CSV "Closure" list mixes many categories; we keep a small,
// clean subset and reuse it where a closure attribute is relevant).
const CLOSURE_OPTIONS: GS1AttributeOption = {
  codeListName: "Closure",
  values: [
    { value: "Adjustable/Pull", code: "GM03CLOSAP" },
    { value: "Back Button/Zip", code: "GM03CLOSBB" },
    { value: "Back Hook/Zip", code: "GM03CLOSBH" },
    { value: "Leverback", code: "GM03CLOSLB" },
    { value: "Lift-Lock", code: "GM03CLOSLL" },
    { value: "Link/Clasp", code: "GM03CLOSLC" },
  ],
}

const OCCASION_OPTIONS: GS1AttributeOption = {
  codeListName: "Occasion",
  values: [
    { value: "Active/Workout", code: "GM03OCCNAW" },
    { value: "Evening", code: "GM03OCCNEV" },
    { value: "Anniversary", code: "GM03OCCNAN" },
    { value: "Fashion", code: "GM03OCCNFA" },
    { value: "Athleisure", code: "GM03OCCNAL" },
    { value: "Flower Girl", code: "GM03OCCNFG" },
  ],
}

const GENDER_OPTIONS: GS1AttributeOption = {
  codeListName: "Gender",
  values: [
    { value: "Female", code: "ZZ03GENDFE" },
    { value: "Male", code: "ZZ03GENDMA" },
    { value: "Unisex", code: "ZZ03GENDUN" },
    { value: "Other", code: "ZZ04GEND99" },
  ],
}

const PRIMARY_DETAIL_PLACEMENT_OPTIONS: GS1AttributeOption = {
  codeListName: "Primary Detail Placement",
  values: [
    { value: "All Over", code: "GM03PDPLAA" },
    { value: "Front Pocket", code: "GM03PDPLFP" },
    { value: "Back Bottom", code: "GM03PDPLBB" },
    { value: "Front Right", code: "GM03PDPLFR" },
    { value: "Back Center", code: "GM03PDPLBC" },
    { value: "Front Top", code: "GM03PDPLFT" },
  ],
}

const PRIMARY_DETAIL_APPLICATION_OPTIONS: GS1AttributeOption = {
  codeListName: "Primary Detail Application",
  values: [
    { value: "Applique", code: "GM03PDAPAP" },
    { value: "Logo Pin", code: "GM03PDAPLP" },
    { value: "Banded", code: "GM03PDAPBA" },
    { value: "Metallic Ink", code: "GM03PDAPMI" },
    { value: "Bling", code: "GM03PDAPBL" },
    { value: "Patch", code: "GM03PDAPPA" },
  ],
}

export const GS1_CATEGORY_ATTRIBUTE_OPTIONS: Record<ProductCategory, GS1AttributeOption[]> = {
  Shoes: [
    {
      codeListName: "Shoe Type",
      values: [
        { value: "Boots/Booties", code: "GM03SETPBB" },
        { value: "Pumps", code: "GM03SETPPP" },
        { value: "Clogs/Mules", code: "GM03SETPCM" },
        { value: "Sandals", code: "GM03SETPSA" },
        { value: "Flats", code: "GM03SETPFL" },
        { value: "Loafers/Mocs", code: "GM03SETPLM" },
        { value: "Slippers", code: "GM03SETPSL" },
      ],
    },
    {
      codeListName: "Shoe Style",
      values: [
        { value: "Alpine Boot", code: "GM03SHOEAB" },
        { value: "Hiking", code: "GM03SHOEHK" },
        { value: "Ankle Strap", code: "GM03SHOEAS" },
        { value: "High Top", code: "GM03SHOEHT" },
        { value: "Athleisure", code: "GM03SHOEAT" },
        { value: "Huarache", code: "GM03SHOEHU" },
      ],
    },
    CLOSURE_OPTIONS,
    {
      codeListName: "Heel Type",
      values: [
        { value: "Block", code: "GM03HLTYBL" },
        { value: "No Heel", code: "GM03HLTYNH" },
        { value: "Cone", code: "GM03HLTYCN" },
        { value: "Novelty", code: "GM03HLTYNV" },
        { value: "Demi-Wedge", code: "GM03HLTYDW" },
        { value: "Stacked", code: "GM03HLTYSA" },
      ],
    },
    {
      codeListName: "Heel Height Range",
      values: [
        { value: "Flat - 0-.5 inch", code: "GM03HLHTFL" },
        { value: "Low - >.5 to 1 inch", code: "GM03HLHTLW" },
        { value: "Medium - >1 inch - 2 inch", code: "GM03HLHTMD" },
        { value: "High - >2 inch - 3 inch", code: "GM03HLHTHI" },
        { value: "Extra-High - >3 inch", code: "GM03HLHTEH" },
      ],
    },
    {
      codeListName: "Heel Material",
      values: [
        { value: "Cork", code: "GM03HLMTCK" },
        { value: "Rope", code: "GM03HLMTRP" },
        { value: "Embellished", code: "GM03HLMTEM" },
        { value: "Synthetic", code: "GM03HLMTSY" },
        { value: "Leather", code: "GM03HLMTLE" },
        { value: "Wood", code: "GM03HLMTWD" },
      ],
    },
    {
      codeListName: "Toe Shape",
      values: [
        { value: "Almond", code: "GM03TOESAL" },
        { value: "Round", code: "GM03TOESRD" },
        { value: "Apron Toe", code: "GM03TOESAP" },
        { value: "Snip", code: "GM03TOESSN" },
        { value: "Cap Toe", code: "GM03TOESCT" },
        { value: "Split Toe", code: "GM03TOESSP" },
      ],
    },
    {
      codeListName: "Sole Type",
      values: [
        { value: "Leather", code: "GM03SOLTLS" },
        { value: "Rubber", code: "GM03SOLTRS" },
        { value: "Synthetic", code: "GM03SOLTSJ" },
        { value: "Recycled", code: "GM03SOLTRE" },
        { value: "Natural Fiber", code: "GM03SOLTNS" },
      ],
    },
    {
      codeListName: "Outsole Type",
      values: [
        { value: "Dimpled", code: "GM03OUTSDP" },
        { value: "Non-Slip", code: "GM03OUTSNS" },
        { value: "Driver", code: "GM03OUTSDR" },
        { value: "Tooth", code: "GM03OUTSTT" },
        { value: "Embossed", code: "GM03OUTSEM" },
        { value: "Tread", code: "GM03OUTSTR" },
      ],
    },
    OCCASION_OPTIONS,
    GENDER_OPTIONS,
    {
      codeListName: "Water Repellent",
      values: [
        { value: "Waterproof", code: "ZZ03WATRPF" },
        { value: "Water Resistant", code: "ZZ03WATRRE" },
        { value: "Other", code: "ZZ04WATR99" },
      ],
    },
  ],
  Apparel: [
    {
      codeListName: "Code List for Dress Type",
      values: [
        { value: "A-line", code: "GM03DRTPAL" },
        { value: "Pencil", code: "GM03DRTPPE" },
        { value: "Babydoll", code: "GM03DRTPBA" },
        { value: "Peplum", code: "GM03DRTPPL" },
        { value: "Blouson", code: "GM03DRTPBL" },
        { value: "Popover", code: "GM03DRTPPV" },
      ],
    },
    {
      codeListName: "Sleeve Type",
      values: [
        { value: "1/2 Sleeve", code: "GM03SLVTHT" },
        { value: "Roll-Tab (Long to elbow/short)", code: "GM03SLVTRT" },
        { value: "1/4 Sleeve", code: "GM03SLVTQS" },
        { value: "Short", code: "GM03SLVTST" },
        { value: "3/4 Sleeve", code: "GM03SLVTTT" },
        { value: "Sleeveless", code: "GM03SLVTS4" },
      ],
    },
    {
      codeListName: "Collar/Neck Type",
      values: [
        { value: "Ballet", code: "GM03CLNTBL" },
        { value: "Plunge", code: "GM03CLNTPJ" },
        { value: "Banded", code: "GM03CLNTBC" },
        { value: "Point", code: "GM03CLNTPO" },
        { value: "Boat or Bateau", code: "GM03CLNTBE" },
        { value: "Polo", code: "GM03CLNTPU" },
      ],
    },
    CLOSURE_OPTIONS,
    OCCASION_OPTIONS,
    GENDER_OPTIONS,
    {
      codeListName: "Code List for Fit",
      values: [
        { value: "Relaxed", code: "GM03FITTRE" },
        { value: "Structured", code: "GM03FITTST" },
        { value: "Other", code: "GM04FITT99" },
      ],
    },
    {
      codeListName: "Code Type for Length Description",
      values: [
        { value: "Above Knee", code: "GM03LNTHAK" },
        { value: "Midi Short", code: "GM03LNTHMS" },
        { value: "Ankle", code: "GM03LNTHAN" },
        { value: "Mini", code: "GM03LNTHMN" },
        { value: "Regular/Full", code: "GM03LNTHRF" },
        { value: "Below Knee", code: "GM03LNTHBK" },
      ],
    },
    {
      codeListName: "Primary Detail Type",
      values: [
        { value: "Brand", code: "GM03PDTPBR" },
        { value: "Player Name", code: "GM03PDTPPN" },
        { value: "League", code: "GM03PDTPLE" },
        { value: "Script", code: "GM03PDTPSC" },
        { value: "Letter", code: "GM03PDTPLT" },
        { value: "Team", code: "GM03PDTPTE" },
      ],
    },
    PRIMARY_DETAIL_PLACEMENT_OPTIONS,
    PRIMARY_DETAIL_APPLICATION_OPTIONS,
  ],
  Bags: [
    {
      codeListName: "Bag Type",
      values: [
        { value: "Backpack", code: "GM03BGSTBA" },
        { value: "Saddle Bag", code: "GM03BGSTSB" },
        { value: "Bucket Bag", code: "GM03BGSTBB" },
        { value: "Satchel", code: "GM03BGSTSA" },
        { value: "Clutch", code: "GM03BGSTCL" },
        { value: "Shopper", code: "GM03BGSTSJ" },
      ],
    },
    CLOSURE_OPTIONS,
    {
      codeListName: "Lining Material",
      values: [
        { value: "Antimicrobial", code: "GM03LIMTAN" },
        { value: "Nylon", code: "GM03LIMTNY" },
        { value: "Cotton", code: "GM03LIMTCT" },
        { value: "Organic Material", code: "GM03LIMTOM" },
        { value: "Fabric", code: "GM03LIMTFD" },
        { value: "Polyester", code: "GM03LIMTPR" },
      ],
    },
    {
      codeListName: "Special Embellishment",
      values: [
        { value: "Beads", code: "GM03SPEMBE" },
        { value: "Logo", code: "GM03SPEMLG" },
        { value: "Belting", code: "GM03SPEMBL" },
        { value: "Bows", code: "GM03SPEMBW" },
        { value: "Metal Ornament", code: "GM03SPEMMR" },
        { value: "Braiding", code: "GM03SPEMBR" },
      ],
    },
    PRIMARY_DETAIL_APPLICATION_OPTIONS,
    PRIMARY_DETAIL_PLACEMENT_OPTIONS,
    OCCASION_OPTIONS,
    GENDER_OPTIONS,
  ],
  Jewelry: [
    {
      codeListName: "Jewelry Type",
      values: [
        { value: "Costume", code: "JW03JWLTCS" },
        { value: "Fine", code: "JW03JWLTFI" },
        { value: "Fashion", code: "JW03JWLTFA" },
        { value: "Other", code: "JW04JWLT99" },
      ],
    },
    {
      codeListName: "Jewelry Sets",
      values: [
        { value: "Bracelet/Ears", code: "JW03JWSTBE" },
        { value: "Neck/Ears/Bracelet", code: "JW03JWSTNB" },
        { value: "Neck/Ears", code: "JW03JWSTNE" },
        { value: "Other", code: "JW04JWST" },
      ],
    },
    {
      codeListName: "Earring Type",
      values: [
        { value: "Button", code: "JW03EATPBU" },
        { value: "Ear Wrap", code: "JW03EATPEW" },
        { value: "Chandelier", code: "JW03EATPCH" },
        { value: "Hoop", code: "JW03EATPHP" },
        { value: "Drop", code: "JW03EATPDR" },
        { value: "Stud", code: "JW03EATPST" },
      ],
    },
    {
      codeListName: "Necklace Type",
      values: [
        { value: "Chain", code: "JW03NKLCCA" },
        { value: "Pearl Strand", code: "JW03NKLCPS" },
        { value: "Choker", code: "JW03NKLCCH" },
        { value: "Pendant", code: "JW03NKLCPE" },
        { value: "Collar", code: "JW03NKLCCL" },
        { value: "Y-Necklace", code: "JW03NKLCYN" },
      ],
    },
    {
      codeListName: "Ring Type",
      values: [
        { value: "Band", code: "JW03RINGBA" },
        { value: "Stacked", code: "JW03RINGST" },
        { value: "Midi", code: "JW03RINGMI" },
        { value: "Toe", code: "JW03RINGTE" },
        { value: "Signet", code: "JW03RINGSI" },
        { value: "Other", code: "JW04RING99" },
      ],
    },
    {
      codeListName: "Bracelet Type",
      values: [
        { value: "Adjustable", code: "JW03BRTTAD" },
        { value: "Hinge", code: "JW03BRTTHN" },
        { value: "Bangle", code: "JW03BRTTBA" },
        { value: "Line", code: "JW03BRTTLI" },
        { value: "Bracelet Set", code: "JW03BRTTBS" },
        { value: "Open Cuff", code: "JW03BRTTOC" },
      ],
    },
    {
      codeListName: "Band Type",
      values: [
        { value: "Bangle", code: "JW03WBNDBA" },
        { value: "Bracelet", code: "JW03WBNDBR" },
        { value: "Cuff", code: "JW03WBNDCU" },
        { value: "NATO Strap", code: "JW03WBNDNA" },
        { value: "Strap", code: "JW03WBNDST" },
        { value: "Other", code: "JW04WBND99" },
      ],
    },
    {
      codeListName: "Metal",
      values: [
        { value: "Aluminum", code: "JW03METLAI" },
        { value: "Platinum", code: "JW03METLPT" },
        { value: "Brass", code: "JW03METLBR" },
        { value: "Rhodium", code: "JW03METLRH" },
        { value: "Bronze", code: "JW03METLBZ" },
        { value: "Rose Gold", code: "JW03METLRG" },
      ],
    },
    CLOSURE_OPTIONS,
    OCCASION_OPTIONS,
    GENDER_OPTIONS,
  ],
  Beauty: [
    {
      codeListName: "Beauty Area of Use",
      values: [
        { value: "Body", code: "GM03BAOUBD" },
        { value: "Lip", code: "GM03BAOULP" },
        { value: "Brow", code: "GM03BAOUBR" },
        { value: "Multi", code: "GM03BAOUMU" },
        { value: "Cheek", code: "GM03BAOUCH" },
        { value: "Nail", code: "GM03BAOUNA" },
      ],
    },
    {
      // Normalized from CSV artifact "Bea uty Treatment Specialty"
      codeListName: "Beauty Treatment Specialty",
      values: [
        { value: "After Sun", code: "GM03BTSPAS" },
        { value: "Redness/Rosacea", code: "GM03BTSPRR" },
        { value: "Anti-Acne", code: "GM03BTSPAA" },
        { value: "Repair", code: "GM03BTSPRE" },
        { value: "Cellulite", code: "GM03BTSPCE" },
        { value: "Self Tan", code: "GM03BTSPST" },
      ],
    },
    {
      codeListName: "Skin Type",
      values: [
        { value: "Aging", code: "GM03SKTPAG" },
        { value: "Oily", code: "GM03SKTPLY" },
        { value: "All", code: "GM03SKTPAL" },
        { value: "Sensitive", code: "GM03SKTPSE" },
        { value: "Combination", code: "GM03SKTPCM" },
        { value: "Other", code: "GM04SKTP99" },
      ],
    },
    {
      codeListName: "Scent Type",
      values: [
        { value: "Aquatic", code: "GM03SCTPAQ" },
        { value: "Oriental", code: "GM03SCTPOR" },
        { value: "Citrus", code: "GM03SCTPCI" },
        { value: "Powdery", code: "GM03SCTPPW" },
        { value: "Earthy", code: "GM03SCTPEA" },
        { value: "Spicy", code: "GM03SCTPSP" },
      ],
    },
    {
      codeListName: "SPF Rating",
      values: [
        { value: "10", code: "GM03SPFRRA" },
        { value: "15", code: "GM03SPFRRB" },
        { value: "30", code: "GM03SPFRRC" },
        { value: "50", code: "GM03SPFRRE" },
        { value: "60", code: "GM03SPFRRF" },
        { value: "80", code: "GM03SPFRRG" },
      ],
    },
    {
      codeListName: "Code List for Formulation",
      values: [
        { value: "Capsules", code: "GM03FORMCA" },
        { value: "Mousse/Foam", code: "GM03FORMMF" },
        { value: "Cream", code: "GM03FORMCR" },
        { value: "Oil", code: "GM03FORMIL" },
        { value: "Cream-To-Powder", code: "GM03FORMCP" },
        { value: "Paste", code: "GM03FORMPS" },
      ],
    },
  ],
  Home: [
    {
      codeListName: "Bedding Size",
      values: [
        { value: "Baby/Swaddle", code: "GM03BDSZBS" },
        { value: "Jumbo", code: "GM03BDSZJU" },
        { value: "Body", code: "GM03BDSZBD" },
        { value: "King", code: "GM03BDSZKI" },
        { value: "California King", code: "GM03BDSZCK" },
        { value: "Queen", code: "GM03BDSZQU" },
      ],
    },
    {
      codeListName: "Bedding Type",
      values: [
        { value: "Bedspread", code: "GM03BEDTBS" },
        { value: "Pillowcase", code: "GM03BEDTPC" },
        { value: "Comforter", code: "GM03BEDTCM" },
        { value: "Sham", code: "GM03BEDTSH" },
        { value: "Duvet Cover", code: "GM03BEDTDC" },
        { value: "Sheet Set", code: "GM03BEDTSS" },
      ],
    },
    {
      codeListName: "Code List for Cookware Type",
      values: [
        { value: "Cake Pan", code: "GM03COOKCP" },
        { value: "Pie Pan", code: "GM03COOKPP" },
        { value: "Casserole Dish", code: "GM03COOKCD" },
        { value: "Pizza Pan", code: "GM03COOKPI" },
        { value: "Cookie Sheet", code: "GM03COOKCS" },
        { value: "Pressure Cooker", code: "GM03COOKPC" },
      ],
    },
    {
      codeListName: "Code List for Dinnerware Category",
      values: [
        { value: "Everyday", code: "GM03DNRCEV" },
        { value: "Fine China", code: "GM03DNRCFC" },
        { value: "Other", code: "GM04DNRC99" },
      ],
    },
    {
      codeListName: "Code List for Flatware Type",
      values: [
        { value: "Butter Knife", code: "GM03FLATBU" },
        { value: "Pasta Server", code: "GM03FLATPA" },
        { value: "Cake Knife", code: "GM03FLATCA" },
        { value: "Pierced Serving Spoon", code: "GM03FLATPI" },
        { value: "Carving Fork", code: "GM03FLATCR" },
        { value: "Salad Fork", code: "GM03FLATSA" },
      ],
    },
    {
      codeListName: "Rug Type",
      values: [
        { value: "Accent", code: "GM03RUGTAC" },
        { value: "Outdoor", code: "GM03RUGTUT" },
        { value: "Bath", code: "GM03RUGTBA" },
        { value: "Rug Pad", code: "GM03RUGTRP" },
        { value: "Dining Room", code: "GM03RUGTDR" },
        { value: "Runners", code: "GM03RUGTRU" },
      ],
    },
    {
      codeListName: "Towel Type",
      values: [
        { value: "Bath", code: "GM03TOWLBA" },
        { value: "Towel Set", code: "GM03TOWLTS" },
        { value: "Beach", code: "GM03TOWLBE" },
        { value: "Wash", code: "GM03TOWLWA" },
        { value: "Hand", code: "GM03TOWLHA" },
        { value: "Other", code: "GM04TOWL99" },
      ],
    },
    {
      codeListName: "Tableware Type",
      values: [
        { value: "Dinnerware", code: "GM03TBLTDI" },
        { value: "Glassware", code: "GM03TBLTGL" },
        { value: "Flatware", code: "GM03TBLTFL" },
        { value: "Other", code: "GM04TBLT99" },
      ],
    },
    {
      codeListName: "Shape",
      values: [
        { value: "Bedrest", code: "GM03SHPEBE" },
        { value: "Rectangular", code: "GM03SHPERE" },
        { value: "Bolster", code: "GM03SHPEBL" },
        { value: "Round", code: "GM03SHPERO" },
        { value: "Breakfast/Boudoir", code: "GM03SHPEBB" },
        { value: "Shaped/Novelty", code: "GM03SHPESN" },
      ],
    },
    {
      codeListName: "Care Instructions Code",
      values: [
        { value: "Dishwasher Safe", code: "GM03CAINDS" },
        { value: "Machine Wash Hot", code: "GM03CAINMH" },
        { value: "Do Not Iron", code: "GM03CAINDN" },
        { value: "Machine Wash Line Dry", code: "GM03CAINML" },
        { value: "Dry Clean", code: "GM03CAINDC" },
        { value: "Machine Wash Tumble Dry", code: "GM03CAINMT" },
      ],
    },
  ],
}

// Returns the curated attribute options for a category (empty array if unknown).
export function getOptionsForCategory(category: string): GS1AttributeOption[] {
  return GS1_CATEGORY_ATTRIBUTE_OPTIONS[category as ProductCategory] ?? []
}

// Returns the allowed values for a specific Code List Name within a category.
export function getValuesForCodeList(category: string, codeListName: string): { value: string; code: string }[] {
  return getOptionsForCategory(category).find(o => o.codeListName === codeListName)?.values ?? []
}

// Looks up the GS1 code for a given category + Code List Name + value (undefined if not found).
export function getCodeForValue(category: string, codeListName: string, value: string): string | undefined {
  return getValuesForCodeList(category, codeListName).find(v => v.value === value)?.code
}

// ── Mock extraction scenarios ───────────────────────────────────────────────
// A small, fixed set of "suggested" attributes per category. Values are grounded in the
// curated map above (codes are resolved from it at build time below). confidence + reason
// are illustrative only. Attributes that usually cannot be determined from an image alone
// (origin, care codes, water repellency, SPF, scent, material composition, sizing) are
// listed as unresolvedAttributes instead of suggestions.

export type MockSuggestionSeed = {
  codeListName: string
  value: string
  confidence: number
  reason: string
}

export type MockExtractionResponse = {
  category: string
  attributes: {
    codeListName: string
    attributeValue: string
    code: string
    confidence: number
    reason: string
  }[]
  unresolvedAttributes: {
    codeListName: string
    reason: string
  }[]
}

const MOCK_SCENARIOS: Record<ProductCategory, { seeds: MockSuggestionSeed[]; unresolved: { codeListName: string; reason: string }[] }> = {
  Shoes: {
    seeds: [
      { codeListName: "Shoe Type", value: "Sandals", confidence: 0.91, reason: "Open upper with foot straps consistent with a sandal silhouette." },
      { codeListName: "Shoe Style", value: "Athleisure", confidence: 0.83, reason: "Sporty-casual styling visible in the upper." },
      { codeListName: "Toe Shape", value: "Round", confidence: 0.8, reason: "Rounded toe box visible in the profile." },
      { codeListName: "Occasion", value: "Fashion", confidence: 0.74, reason: "General styling suggests fashion/casual use." },
      { codeListName: "Gender", value: "Unisex", confidence: 0.69, reason: "Neutral colorway and last shape; verify." },
    ],
    unresolved: [
      { codeListName: "Water Repellent", reason: "Water repellency cannot be determined from an image alone." },
      { codeListName: "Care Instructions Code", reason: "Requires a care label or product data." },
      { codeListName: "Advertised Origin", reason: "Requires label, packaging, or product data." },
    ],
  },
  Apparel: {
    seeds: [
      { codeListName: "Code List for Dress Type", value: "A-line", confidence: 0.87, reason: "Fitted bodice flaring toward the hem indicates an A-line dress." },
      { codeListName: "Sleeve Type", value: "Sleeveless", confidence: 0.82, reason: "No sleeve coverage visible at the shoulder." },
      { codeListName: "Collar/Neck Type", value: "Boat or Bateau", confidence: 0.72, reason: "Wide horizontal neckline across the collarbone." },
      { codeListName: "Code List for Fit", value: "Relaxed", confidence: 0.7, reason: "Loose drape through the body." },
      { codeListName: "Gender", value: "Female", confidence: 0.66, reason: "Silhouette suggests women's apparel; verify." },
    ],
    unresolved: [
      { codeListName: "Care Instructions Code", reason: "Requires a care label or product data." },
      { codeListName: "Advertised Origin", reason: "Requires label, packaging, or source data." },
      { codeListName: "Material Composition", reason: "Fabric content cannot be confirmed from an image alone." },
    ],
  },
  Bags: {
    seeds: [
      { codeListName: "Bag Type", value: "Satchel", confidence: 0.9, reason: "Structured body with top handles consistent with a satchel." },
      { codeListName: "Special Embellishment", value: "Logo", confidence: 0.78, reason: "Visible branded hardware/logo on the front." },
      { codeListName: "Occasion", value: "Fashion", confidence: 0.73, reason: "Styling suggests everyday fashion use." },
      { codeListName: "Gender", value: "Female", confidence: 0.65, reason: "Styling suggests women's accessory; verify." },
    ],
    unresolved: [
      { codeListName: "Lining Material", reason: "Interior lining is not visible in the image." },
      { codeListName: "Care Instructions Code", reason: "Requires a care label or product data." },
      { codeListName: "Advertised Origin", reason: "Requires label, packaging, or product data." },
    ],
  },
  Jewelry: {
    seeds: [
      { codeListName: "Jewelry Type", value: "Fashion", confidence: 0.85, reason: "Styling and materials suggest fashion jewelry." },
      { codeListName: "Earring Type", value: "Hoop", confidence: 0.8, reason: "Continuous circular loop form visible." },
      { codeListName: "Metal", value: "Rose Gold", confidence: 0.7, reason: "Warm pink-gold surface tone." },
      { codeListName: "Gender", value: "Female", confidence: 0.66, reason: "Styling suggests women's jewelry; verify." },
    ],
    unresolved: [
      { codeListName: "Metal Composition", reason: "Karat/alloy requires a hallmark or product spec." },
      { codeListName: "Care Instructions Code", reason: "Requires product data." },
      { codeListName: "Advertised Origin", reason: "Requires label, packaging, or product data." },
    ],
  },
  Beauty: {
    seeds: [
      { codeListName: "Beauty Area of Use", value: "Lip", confidence: 0.84, reason: "Product form and packaging indicate lip application." },
      { codeListName: "Code List for Formulation", value: "Cream", confidence: 0.76, reason: "Creamy texture visible in the product shot." },
    ],
    unresolved: [
      { codeListName: "SPF Rating", reason: "SPF value requires the product label." },
      { codeListName: "Scent Type", reason: "Scent cannot be determined from an image alone." },
      { codeListName: "Skin Type", reason: "Targeted skin type requires label claims or product data." },
      { codeListName: "Advertised Origin", reason: "Requires label, packaging, or product data." },
    ],
  },
  Home: {
    seeds: [
      { codeListName: "Bedding Type", value: "Comforter", confidence: 0.86, reason: "Quilted, padded top layer consistent with a comforter." },
      { codeListName: "Shape", value: "Rectangular", confidence: 0.78, reason: "Standard rectangular form factor visible." },
    ],
    unresolved: [
      { codeListName: "Bedding Size", reason: "Exact size requires product data, not visible scale." },
      { codeListName: "Care Instructions Code", reason: "Requires a care label or product data." },
      { codeListName: "Material Composition", reason: "Fill/fabric content cannot be confirmed from an image alone." },
    ],
  },
}

// Builds a mock extraction response for a category, grounding each suggested attribute's
// code in the curated map. Seeds whose value can't be resolved are skipped defensively.
export function getMockExtraction(category: string): MockExtractionResponse {
  const scenario = MOCK_SCENARIOS[category as ProductCategory]
  if (!scenario) {
    return { category, attributes: [], unresolvedAttributes: [] }
  }
  const attributes = scenario.seeds
    .map(seed => {
      const code = getCodeForValue(category, seed.codeListName, seed.value)
      if (!code) return null
      return {
        codeListName: seed.codeListName,
        attributeValue: seed.value,
        code,
        confidence: seed.confidence,
        reason: seed.reason,
      }
    })
    .filter((a): a is NonNullable<typeof a> => a !== null)
  return { category, attributes, unresolvedAttributes: scenario.unresolved }
}
