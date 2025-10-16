// Type definitions for IOTA DID Explorer

export interface DIDCreationResult {
  did: string;
  document: Record<string, unknown>;
}

export interface CredentialData {
  name: string;
  degree: string;
  university: string;
}

export interface VerificationResult {
  isValid: boolean;
  credential?: Record<string, unknown>;
  error?: string;
}

export interface DIDInfo {
  did: string;
  created: string;
  documentJson?: string;
}

