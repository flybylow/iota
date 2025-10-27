/**
 * UNTP Digital Product Passport Builder
 * 
 * Builds UNTP-compliant DPP credentials for IOTA Identity
 */

import { getUNTPContext, getUNTPTypes, UNTP_TYPES } from './contexts';
import type { OriginCertificationData } from '@/types/dpp';

export interface UNTPProductData {
  name: string;
  description?: string;
  imageUrl?: string;
  countryOfOrigin: string;
  manufacturer: {
    name: string;
    did?: string;
  };
  materials?: Array<{
    name: string;
    originCountry: string;
    massFraction: number;
    recycledAmount?: number;
  }>;
  certifications?: Array<{
    topic: string; // e.g., "environment.emissions"
    standard: string;
    value: { value: number; unit: string };
    evidenceUrl?: string;
    evidenceHash?: string;
  }>;
}

/**
 * Build UNTP-compliant DPP credential
 */
export function buildUNTPDPPCredential(
  issuerDID: string,
  subjectDID: string,
  productData: UNTPProductData,
  harvestData: OriginCertificationData
): Record<string, unknown> {
  return {
    '@context': getUNTPContext('dpp'),
    type: getUNTPTypes('dpp'),
    issuer: issuerDID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      type: UNTP_TYPES.PRODUCT_PASSPORT,
      id: subjectDID,
      
      // Product Information
      product: {
        type: UNTP_TYPES.PRODUCT,
        id: subjectDID, // Or could use GS1 GTIN
        name: productData.name,
        description: productData.description || '',
        productImage: productData.imageUrl,
        countryOfOrigin: productData.countryOfOrigin,
        manufacturer: {
          id: productData.manufacturer.did || issuerDID,
          name: productData.manufacturer.name,
        },
      },
      
      // Granularity (item-level passport)
      granularityLevel: 'item',
      
      // Organic Certification Claims
      conformityClaim: buildOrganicClaims(harvestData),
      
      // Material Composition
      materialsProvenance: productData.materials || [],
      
      // Harvest Information (from existing data)
      harvestInformation: {
        harvestDate: harvestData.harvestDate,
        batchWeight: harvestData.batchWeight,
        variety: harvestData.cocoaVariety,
      },
      
      // Processing Information
      processingInformation: {
        fermentationDays: harvestData.fermentationDays,
        dryingMethod: harvestData.dryingMethod,
      },
    },
  };
}

/**
 * Build conformity claims from certification data
 */
function buildOrganicClaims(certData: OriginCertificationData): Record<string, unknown>[] {
  const claims = [];
  
  // Add organic certification claim
  if (certData.certificationBody) {
    claims.push({
      type: UNTP_TYPES.CLAIM,
      topic: 'environment.certification.organic',
      standardOrRegulation: certData.certificationBody,
      claimedValue: [{ value: true }],
      conformityEvidence: [{
        linkURL: certData.certificationNumber,
        linkName: 'Certification',
        hashDigest: certData.certificationNumber,
      }],
    });
  }
  
  // Add origin claim
  if (certData.origin) {
    claims.push({
      type: UNTP_TYPES.CLAIM,
      topic: 'provenance.countryOfOrigin',
      claimedValue: [{ value: certData.origin.country }],
    });
  }
  
  return claims;
}

/**
 * Add sustainability claim
 */
export function addSustainabilityClaim(
  dpp: Record<string, unknown>,
  topic: string,
  value: { value: number | boolean | string; unit?: string },
  standard?: string
): void {
  const credentialSubject = dpp.credentialSubject as Record<string, unknown>;
  if (!('conformityClaim' in credentialSubject) || !credentialSubject.conformityClaim) {
    credentialSubject.conformityClaim = [];
  }
  
  (credentialSubject.conformityClaim as unknown[]).push({
    type: UNTP_TYPES.CLAIM,
    topic,
    standardOrRegulation: standard,
    claimedValue: [value],
  });
}

/**
 * Add material provenance
 */
export function addMaterialProvenance(
  dpp: Record<string, unknown>,
  material: {
    name: string;
    originCountry: string;
    massFraction: number;
    recycledAmount?: number;
  }
): void {
  const credentialSubject = dpp.credentialSubject as Record<string, unknown>;
  if (!('materialsProvenance' in credentialSubject) || !credentialSubject.materialsProvenance) {
    credentialSubject.materialsProvenance = [];
  }
  
  (credentialSubject.materialsProvenance as unknown[]).push({
    type: UNTP_TYPES.MATERIAL,
    name: material.name,
    originCountry: material.originCountry,
    massFraction: material.massFraction,
    recycledAmount: material.recycledAmount || 0,
  });
}

