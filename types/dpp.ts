/**
 * Digital Product Passport Type Definitions
 */

export interface OriginCertificationData {
  certificationBody: string;
  certificationNumber: string;
  origin: {
    country: string;
    region: string;
    farm: string;
    coordinates: { lat: number; lng: number };
  };
  harvestDate: string;
  batchWeight: number; // kg
  cocoaVariety: string;
  fermentationDays: number;
  dryingMethod: string;
}

export interface ProductionCertificationData {
  manufacturer: string;
  productionDate: string;
  batchNumber: string;
  recipe: {
    cocoaMass: number;
    sugar: number;
    cocoaButter: number;
  };
  qualityChecks: Array<{
    test: string;
    result: string;
  }>;
  packaging: string;
  unitsProduced: number;
}

export interface QualityTestData {
  laboratory: string;
  testDate: string;
  batchNumber: string;
  tests: Array<{
    name: string;
    result: string;
    standard: string;
    passed: boolean;
  }>;
  overallResult: 'passed' | 'failed';
}

export interface SupplyChainStep {
  stakeholder: string;
  stakeholderDID: string;
  role: string;
  credentialType: string;
  date: string;
  verified: boolean;
  data: OriginCertificationData | ProductionCertificationData | QualityTestData | Record<string, unknown>;
}

export interface DPPCredential {
  jwt: string;
  issuer: string;
  issuerDID: string;
  subject: string;
  credentialType: string;
  issuedAt: string;
  certificationData: OriginCertificationData | ProductionCertificationData | QualityTestData | Record<string, unknown>;
  previousCredentials?: string[]; // For credential chaining
}

