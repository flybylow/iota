/**
 * Supply Chain Stakeholder Data
 * Represents all parties involved in the chocolate supply chain
 */

export const stakeholders = {
  farmer: {
    did: "did:iota:0xfarmermaria0012345678901234567890123456789012345678901234567890",
    name: "Maria's Cocoa Farm",
    role: "Supplier",
    location: "Manabí Province, Ecuador",
    country: "Ecuador",
    coordinates: { lat: -1.0546, lng: -80.4534 },
    certifications: ["EU Organic", "Fair Trade"],
    established: "2010",
    description: "Family-owned organic cocoa farm producing premium Nacional variety cocoa beans"
  },
  
  factory: {
    did: "did:iota:0xfactorychocolate12345678901234567890123456789012345678901234567",
    name: "Chocolate Dreams Factory",
    role: "Manufacturer",
    location: "Bruges, Belgium",
    country: "Belgium",
    certifications: ["ISO 22000", "BRC Food Safety"],
    capacity: "50,000 bars/day",
    established: "1995",
    description: "Premium Belgian chocolate manufacturer specializing in organic dark chocolate"
  },
  
  lab: {
    did: "did:iota:0xlabeurofins012345678901234567890123456789012345678901234567",
    name: "Eurofins Food Testing Lab",
    role: "Quality Control",
    location: "Brussels, Belgium",
    country: "Belgium",
    accreditation: ["ISO 17025"],
    tests: ["Heavy metals", "Pesticides", "Allergens", "Microbiological"],
    established: "1987",
    description: "Independent food safety testing laboratory with EU accreditation"
  },
  
  retailer: {
    did: "did:iota:0xretailergreenmarket123456789012345678901234567890123456789012",
    name: "GreenMarket Supermarket",
    role: "Retailer",
    location: "Amsterdam, Netherlands",
    country: "Netherlands",
    chainSize: "200 stores",
    established: "2005",
    description: "Sustainable supermarket chain specializing in organic and fair-trade products"
  },
  
  consumer: {
    role: "Consumer",
    description: "End consumer verifying product authenticity and supply chain"
  }
};

export type Stakeholder = typeof stakeholders.farmer;
export type StakeholderType = keyof typeof stakeholders;

