/**
 * UNTP Context URLs
 * Based on UN/CEFACT Digital Product Passport standard
 */

export const UNTP_CONTEXTS = {
  W3C_VC: 'https://www.w3.org/2018/credentials/v1',
  UNTP_DPP: 'https://test.uncefact.org/vocabulary/untp/dpp/0.5.0/',
  UNTP_DCC: 'https://test.uncefact.org/vocabulary/untp/dcc/0.5.0/',
};

export const UNTP_TYPES = {
  DIGITAL_PRODUCT_PASSPORT: 'DigitalProductPassport',
  DIGITAL_CONFORMITY_CREDENTIAL: 'DigitalConformityCredential',
  PRODUCT_PASSPORT: 'ProductPassport',
  PRODUCT: 'Product',
  CONFORMITY_ATTESTATION: 'ConformityAttestation',
  CLAIM: 'Claim',
  MATERIAL: 'Material',
};

/**
 * Get base context array for UNTP credentials
 */
export function getUNTPContext(type: 'dpp' | 'dcc' = 'dpp'): string[] {
  const contexts = [UNTP_CONTEXTS.W3C_VC];
  
  if (type === 'dpp') {
    contexts.push(UNTP_CONTEXTS.UNTP_DPP);
  } else if (type === 'dcc') {
    contexts.push(UNTP_CONTEXTS.UNTP_DCC);
  }
  
  return contexts;
}

/**
 * Get credential types array for UNTP credentials
 */
export function getUNTPTypes(type: 'dpp' | 'dcc' = 'dpp'): string[] {
  const baseTypes = ['VerifiableCredential'];
  
  if (type === 'dpp') {
    baseTypes.push(UNTP_TYPES.DIGITAL_PRODUCT_PASSPORT);
  } else if (type === 'dcc') {
    baseTypes.push(UNTP_TYPES.DIGITAL_CONFORMITY_CREDENTIAL);
  }
  
  return baseTypes;
}

