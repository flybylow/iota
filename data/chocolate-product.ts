/**
 * Chocolate Product Data Model
 * Represents the digital product passport for a chocolate bar
 */

export const chocolateProduct = {
  // Product Identity
  did: "did:iota:smr:0xch2025001abc123def456789012345678901234567890123456789012345678",
  name: "Organic Dark Chocolate 70%",
  batchNumber: "CH-2025-001",
  gtin: "8712345678901",
  
  // Product Info
  type: "chocolate_bar",
  weight: "100g",
  ingredients: [
    { name: "Cocoa mass", percentage: 70, origin: "Ecuador" },
    { name: "Cane sugar", percentage: 25, origin: "France" },
    { name: "Cocoa butter", percentage: 5, origin: "Belgium" }
  ],
  
  // Sustainability
  certifications: ["EU Organic", "Fair Trade", "Rainforest Alliance"],
  carbonFootprint: 850, // grams CO2
  recyclablePackaging: true,
  
  // Journey metadata
  productionDate: "2025-10-15",
  expiryDate: "2026-10-15",
  manufacturerCountry: "Belgium",
  
  // QR Code data (simplified for demo)
  qrCodeUrl: "https://dpp.example.com/product/CH-2025-001"
};

export type ChocolateProduct = typeof chocolateProduct;

