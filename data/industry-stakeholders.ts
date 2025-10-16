/**
 * Industry-Specific Stakeholder Data
 * Changes based on selected industry type
 */

export const industryStakeholders = {
  food: {
    farmer: {
      did: "did:iota:smr:0xfarmermaria001234567890123456789012345678901234567890123456789",
      name: "Maria's Organic Cocoa Farm",
      role: "Supplier",
      location: "Manabí Province, Ecuador",
      country: "Ecuador",
      coordinates: { lat: -1.0546, lng: -80.4534 },
      certifications: ["EU Organic", "Fair Trade"],
      established: "2010",
      description: "Family-owned organic cocoa farm producing premium Nacional variety cocoa beans",
      batchDetails: {
        harvestDate: "2025-10-01",
        batchWeight: 2500,
        variety: "Nacional",
        certNumber: "EU-ORG-2025-12345"
      }
    },
    factory: {
      did: "did:iota:smr:0xfactorychoco12345678901234567890123456789012345678901234567",
      name: "Chocolate Dreams Factory",
      role: "Manufacturer",
      location: "Bruges, Belgium",
      country: "Belgium",
      certifications: ["ISO 22000", "BRC Food Safety"],
      capacity: "50,000 bars/day",
      established: "1995"
    }
  },
  
  battery: {
    farmer: {
      did: "did:iota:smr:0xmineruthenium890123456789012345678901234567890123456789012",
      name: "Sustainable Lithium Mine",
      role: "Raw Material Supplier",
      location: "Atacama Desert, Chile",
      country: "Chile",
      coordinates: { lat: -23.6980, lng: -68.6230 },
      certifications: ["ISO 14001", "Responsible Mining"],
      established: "2015",
      description: "Sustainable lithium extraction facility with environmental certifications",
      batchDetails: {
        harvestDate: "2025-10-01",
        batchWeight: 5000,
        variety: "Battery-grade Lithium",
        certNumber: "RM-LI-2025-67890"
      }
    },
    factory: {
      did: "did:iota:smr:0xbatteryfactory78901234567890123456789012345678901234567890",
      name: "GreenPower Battery Manufacturing",
      role: "Manufacturer",
      location: "Stuttgart, Germany",
      country: "Germany",
      certifications: ["ISO 9001", "Battery Passport Compliant"],
      capacity: "100,000 units/year",
      established: "2018"
    }
  },
  
  textile: {
    farmer: {
      did: "did:iota:smr:0xfarmcotton012345678901234567890123456789012345678901234567",
      name: "Ethical Cotton Cooperative",
      role: "Supplier",
      location: "Tamil Nadu, India",
      country: "India",
      coordinates: { lat: 11.1271, lng: 78.6569 },
      certifications: ["GOTS Organic", "Fair Trade"],
      established: "2008",
      description: "Farmer cooperative growing certified organic cotton with fair labor practices",
      batchDetails: {
        harvestDate: "2025-10-01",
        batchWeight: 3000,
        variety: "Organic Cotton",
        certNumber: "GOTS-IN-2025-45678"
      }
    },
    factory: {
      did: "did:iota:smr:0xtextilefactory567890123456789012345678901234567890123456",
      name: "EcoThreads Textile Mill",
      role: "Manufacturer",
      location: "Barcelona, Spain",
      country: "Spain",
      certifications: ["OEKO-TEX", "Bluesign"],
      capacity: "200,000 garments/month",
      established: "2012"
    }
  },
  
  electronics: {
    farmer: {
      did: "did:iota:smr:0xminerare345678901234567890123456789012345678901234567890",
      name: "Conflict-Free Minerals Co.",
      role: "Raw Material Supplier",
      location: "Perth, Australia",
      country: "Australia",
      coordinates: { lat: -31.9505, lng: 115.8605 },
      certifications: ["RMI Certified", "Conflict-Free"],
      established: "2010",
      description: "Responsible sourcing of rare earth minerals for electronics manufacturing",
      batchDetails: {
        harvestDate: "2025-10-01",
        batchWeight: 1000,
        variety: "Rare Earth Elements",
        certNumber: "RMI-AU-2025-12345"
      }
    },
    factory: {
      did: "did:iota:smr:0xelectronicsfac456789012345678901234567890123456789012345",
      name: "TechAssembly Ltd.",
      role: "Manufacturer",
      location: "Shenzhen, China",
      country: "China",
      certifications: ["ISO 14001", "RBA Certified"],
      capacity: "500,000 devices/month",
      established: "2005"
    }
  }
};

export type IndustryType = keyof typeof industryStakeholders;

