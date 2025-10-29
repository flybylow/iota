// Type definitions for IOTA DID Explorer

export interface DIDCreationResult {
  did: string;
  document: Record<string, unknown>;
  privateKey?: number[];
  needsPublishing?: boolean;
  keyStored?: boolean;
  onChain?: boolean;
  transactionId?: string;
  note?: string;
}

export interface CredentialData {
  type?: string;
  [key: string]: unknown; // Allow any credential data fields
}

export interface VerificationResult {
  isValid: boolean;
  credential?: Record<string, unknown>;
  error?: string;
  onChain?: boolean;
  note?: string;
  didDocument?: Record<string, unknown>;
  resolutionAttempted?: boolean;
}

export interface DIDInfo {
  did: string;
  created: string;
  documentJson?: string;
}

