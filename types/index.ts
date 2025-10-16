// Type definitions for IOTA DID Explorer

export interface DIDCreationResult {
  did: string;
  document: Record<string, unknown>;
  privateKey?: number[];
  needsPublishing?: boolean;
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
  onChain?: boolean;
}

export interface DIDInfo {
  did: string;
  created: string;
  documentJson?: string;
}

