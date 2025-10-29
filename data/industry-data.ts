/**
 * Industry-Specific Data Models
 * Complete product and stakeholder data for all 4 industries
 */

export const industryData = {
  'food-beverage': {
    product: {
      did: "did:iota:0x:0xch2025001abc123def456789012345678901234567890123456789012345678",
      name: "Organic Dark Chocolate 70%",
      batchNumber: "CH-2025-001",
      gtin: "8712345678901",
      type: "chocolate_bar",
      weight: "100g",
      ingredients: [
        { name: "Cocoa mass", percentage: 70, origin: "Ecuador" },
        { name: "Cane sugar", percentage: 25, origin: "France" },
        { name: "Cocoa butter", percentage: 5, origin: "Belgium" }
      ],
      certifications: ["EU Organic", "Fair Trade", "Rainforest Alliance"],
      carbonFootprint: 850,
      recyclablePackaging: true,
      productionDate: "2025-10-15",
      expiryDate: "2026-10-15",
      manufacturerCountry: "Belgium",
      qrCodeUrl: "https://dpp.example.com/product/CH-2025-001"
    },
    stakeholders: {
      farmer: {
        did: "did:iota:0x:0xfarmermaria001234567890123456789012345678901234567890123456789",
        name: "Maria's Organic Cocoa Farm",
        role: "Supplier",
        location: "Manabí Province, Ecuador",
        country: "Ecuador",
        coordinates: { lat: -1.0546, lng: -80.4534 },
        certifications: ["EU Organic", "Fair Trade"],
        established: "2010",
        description: "Family-owned organic cocoa farm producing premium Nacional variety cocoa beans"
      },
      factory: {
        did: "did:iota:0x:0xfactorychoco12345678901234567890123456789012345678901234567",
        name: "Chocolate Dreams Factory",
        role: "Manufacturer",
        location: "Bruges, Belgium",
        country: "Belgium",
        coordinates: { lat: 51.2093, lng: 3.2247 },
        certifications: ["ISO 22000", "BRC Food Safety"],
        capacity: "50,000 bars/day",
        established: "1995",
        description: "Premium Belgian chocolate manufacturer specializing in organic dark chocolate"
      },
      consumer: {
        role: "Consumer",
        description: "End consumer verifying product authenticity and supply chain"
      }
    },
    labels: {
      originStep: "Farmer",
      productionStep: "Factory",
      originIcon: "🌱",
      productionIcon: "🏭",
      batchLabel: "Cocoa Batch Details",
      originCredential: "OrganicOriginCertification",
      productionCredential: "ProductionCertification"
    }
  },

  'battery': {
    product: {
      did: "did:iota:0x:0xbatt2025001xyz987fed654321098765432109876543210987654321098765",
      name: "EV Lithium-Ion Battery 100kWh",
      batchNumber: "BATT-2025-001",
      gtin: "8712345678902",
      type: "ev_battery",
      capacity: "100 kWh",
      chemistry: "NMC 811 (Nickel Manganese Cobalt)",
      voltage: "400V",
      weight: "450 kg",
      materials: [
        { name: "Lithium", percentage: 7, origin: "Chile" },
        { name: "Nickel", percentage: 33, origin: "Indonesia" },
        { name: "Manganese", percentage: 14, origin: "South Africa" },
        { name: "Cobalt", percentage: 6, origin: "DRC (conflict-free certified)" },
        { name: "Other materials", percentage: 40, origin: "Various" }
      ],
      certifications: ["EU Battery Passport", "RMI Conflict-Free", "ISO 14001"],
      carbonFootprint: 12500,
      recycledContent: 25,
      expectedLifespan: "10 years / 300,000 km",
      recyclablePercentage: 95,
      productionDate: "2025-09-20",
      manufacturerCountry: "Germany",
      qrCodeUrl: "https://dpp.example.com/battery/BATT-2025-001"
    },
    stakeholders: {
      miner: {
        did: "did:iota:0x:0xminerlithium123456789012345678901234567890123456789012345678",
        name: "Lithium Minerals Co.",
        role: "Raw Material Supplier",
        location: "Atacama Desert, Chile",
        country: "Chile",
        coordinates: { lat: -23.6345, lng: -68.9029 },
        certifications: ["ISO 14001", "Conflict-Free Certified"],
        established: "2008",
        description: "Sustainable lithium extraction from salt flats with water conservation practices"
      },
      manufacturer: {
        did: "did:iota:0x:0xbatteurobatt123456789012345678901234567890123456789012345",
        name: "EuroBatt GmbH",
        role: "Battery Manufacturer",
        location: "Stuttgart, Germany",
        country: "Germany",
        certifications: ["EU Battery Passport Compliant", "ISO 9001", "IATF 16949"],
        capacity: "5 GWh/year",
        established: "2018",
        description: "Leading European EV battery manufacturer with 95% recyclability"
      },
      consumer: {
        role: "Vehicle Owner",
        description: "Electric vehicle owner verifying battery origin and sustainability"
      }
    },
    labels: {
      originStep: "Miner",
      productionStep: "Manufacturer",
      originIcon: "⛏️",
      productionIcon: "🔋",
      batchLabel: "Lithium Batch Details",
      originCredential: "LithiumOriginCertification",
      productionCredential: "BatteryProductionCertification"
    }
  },

  'fashion': {
    product: {
      did: "did:iota:0x:0xfash2025001qwe456rty789uio012pas345dfg678hjk901klz234mxc567",
      name: "Organic Cotton T-Shirt",
      batchNumber: "TEXT-2025-001",
      gtin: "8712345678903",
      type: "apparel",
      material: "100% Organic Cotton",
      size: "Medium",
      weight: "180g",
      color: "Natural White",
      materials: [
        { name: "Organic Cotton", percentage: 100, origin: "India" }
      ],
      certifications: ["GOTS Certified", "Fair Trade", "OEKO-TEX Standard 100"],
      carbonFootprint: 5200,
      waterUsage: "2,700 liters",
      dyeChemicals: "None (natural color)",
      laborCertifications: ["Fair Wear Foundation", "SA8000"],
      recyclablePercentage: 100,
      productionDate: "2025-09-10",
      manufacturerCountry: "Portugal",
      qrCodeUrl: "https://dpp.example.com/textile/TEXT-2025-001"
    },
    stakeholders: {
      farmer: {
        did: "did:iota:0x:0xfarmercotton123456789012345678901234567890123456789012345",
        name: "Cotton Farmers Cooperative",
        role: "Cotton Supplier",
        location: "Gujarat, India",
        country: "India",
        coordinates: { lat: 22.3039, lng: 70.8022 },
        certifications: ["GOTS Organic", "Fair Trade"],
        established: "2005",
        description: "Organic cotton farming cooperative supporting 500+ small-scale farmers"
      },
      factory: {
        did: "did:iota:0x:0xfactorytextile12345678901234567890123456789012345678901",
        name: "EcoTextile Factory",
        role: "Garment Manufacturer",
        location: "Porto, Portugal",
        country: "Portugal",
        certifications: ["GOTS Certified", "Fair Wear Foundation", "ISO 14001"],
        capacity: "2 million units/year",
        established: "2012",
        description: "Sustainable garment production with renewable energy and zero wastewater discharge"
      },
      consumer: {
        role: "Consumer",
        description: "Fashion-conscious consumer verifying sustainability and labor practices"
      }
    },
    labels: {
      originStep: "Farm",
      productionStep: "Factory",
      originIcon: "🌾",
      productionIcon: "👕",
      batchLabel: "Cotton Batch Details",
      originCredential: "OrganicCottonCertification",
      productionCredential: "GarmentProductionCertification"
    }
  },

  'electronics': {
    product: {
      did: "did:iota:0x:0xelec2025001asd789ghj456bnm123vxz098poi765qwe432lkj109zxc876",
      name: "Smartphone X Pro",
      batchNumber: "PHONE-2025-001",
      gtin: "8712345678904",
      type: "smartphone",
      model: "X Pro 5G",
      storage: "256GB",
      weight: "195g",
      components: [
        { name: "Display (OLED)", origin: "South Korea" },
        { name: "Processor (5nm)", origin: "Taiwan" },
        { name: "Battery", origin: "China" },
        { name: "Camera Module", origin: "Japan" },
        { name: "Rare Earth Elements", origin: "Australia (conflict-free)" }
      ],
      certifications: ["RoHS Compliant", "EPEAT Gold", "Energy Star"],
      carbonFootprint: 85000,
      conflictMineralsCheck: "Passed - All minerals conflict-free certified",
      repairabilityScore: "8/10",
      expectedLifespan: "5 years",
      recyclablePercentage: 75,
      eWasteInstructions: "Return to authorized recycler - contains recoverable materials",
      productionDate: "2025-08-15",
      manufacturerCountry: "Taiwan",
      qrCodeUrl: "https://dpp.example.com/electronics/PHONE-2025-001"
    },
    stakeholders: {
      supplier: {
        did: "did:iota:0x:0xsupplierrare123456789012345678901234567890123456789012345",
        name: "Rare Earth Minerals Ltd",
        role: "Component Supplier",
        location: "Perth, Australia",
        country: "Australia",
        coordinates: { lat: -31.9505, lng: 115.8605 },
        certifications: ["RMI Conflict-Free", "ISO 14001"],
        established: "2010",
        description: "Ethical rare earth element extraction with environmental rehabilitation programs"
      },
      manufacturer: {
        did: "did:iota:0x:0xmfgtechassembly1234567890123456789012345678901234567890",
        name: "TechAssembly Inc",
        role: "Electronics Manufacturer",
        location: "Taipei, Taiwan",
        country: "Taiwan",
        certifications: ["ISO 9001", "RBA (Responsible Business Alliance)", "Carbon Neutral Facility"],
        capacity: "10 million units/year",
        established: "2000",
        description: "Advanced electronics assembly with 100% renewable energy and right-to-repair support"
      },
      consumer: {
        role: "Consumer",
        description: "Tech consumer verifying ethical sourcing and repairability"
      }
    },
    labels: {
      originStep: "Supplier",
      productionStep: "Assembly",
      originIcon: "🔩",
      productionIcon: "📱",
      batchLabel: "Component Batch Details",
      originCredential: "ComponentOriginCertification",
      productionCredential: "AssemblyCertification"
    }
  }
};

export type IndustryId = keyof typeof industryData;
export type IndustryData = typeof industryData[IndustryId];

