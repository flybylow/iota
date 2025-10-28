/**
 * UNTP Digital Product Passport Visual Renderer
 * Displays structured UNTP fields from the credential
 */

import React from 'react';
import { CheckCircle2, Package, Factory, Leaf, MapPin, Scale, Calendar } from 'lucide-react';

interface UNTPData {
  '@context'?: string[];
  type?: string[];
  credentialSubject?: {
    product?: {
      name: string;
      description?: string;
      countryOfOrigin: string;
      manufacturer: {
        name: string;
        did?: string;
      };
    };
    conformityClaim?: Array<{
      topic: string;
      claimedValue: unknown[];
      standardOrRegulation?: string;
    }>;
    materialsProvenance?: Array<{
      name: string;
      originCountry: string;
      massFraction: number;
    }>;
    harvestInformation?: {
      harvestDate: string;
      batchWeight: number;
      variety: string;
    };
    processingInformation?: {
      fermentationDays: number;
      dryingMethod: string;
    };
  };
}

interface UNTPSectionProps {
  untpCredential: Record<string, unknown>;
  showTitle?: boolean;
}

export function UNTPSection({ untpCredential, showTitle = true }: UNTPSectionProps) {
  const data = untpCredential as UNTPData;
  const subject = data.credentialSubject;

  if (!subject) return null;

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">UNTP Digital Product Passport</h3>
        </div>
      )}

      {/* Product Information */}
      {subject.product && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            Product Information
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-300">Name:</span>
              <span className="text-white font-medium">{subject.product.name}</span>
            </div>
            {subject.product.description && (
              <div className="flex justify-between">
                <span className="text-zinc-300">Description:</span>
                <span className="text-white">{subject.product.description}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-zinc-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Origin:
              </span>
              <span className="text-white">{subject.product.countryOfOrigin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-300 flex items-center gap-1">
                <Factory className="w-3 h-3" />
                Manufacturer:
              </span>
              <span className="text-white">{subject.product.manufacturer.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Harvest Information */}
      {subject.harvestInformation && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            Harvest Information
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-300 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Harvest Date:
              </span>
              <span className="text-white">{new Date(subject.harvestInformation.harvestDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-300">Variety:</span>
              <span className="text-white">{subject.harvestInformation.variety}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-300 flex items-center gap-1">
                <Scale className="w-3 h-3" />
                Batch Weight:
              </span>
              <span className="text-white font-medium">{subject.harvestInformation.batchWeight} kg</span>
            </div>
          </div>
        </div>
      )}

      {/* Processing Information */}
      {subject.processingInformation && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-orange-400 mb-2">
            Processing Information
          </h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-300">Fermentation:</span>
              <span className="text-white">{subject.processingInformation.fermentationDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-300">Drying Method:</span>
              <span className="text-white">{subject.processingInformation.dryingMethod}</span>
            </div>
          </div>
        </div>
      )}

      {/* Conformity Claims */}
      {subject.conformityClaim && subject.conformityClaim.length > 0 && (
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Certification Claims
          </h4>
          <div className="space-y-2 text-xs">
            {subject.conformityClaim.map((claim, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-[#3a3a3a] rounded p-2">
                <div className="font-medium text-white mb-1">{claim.topic}</div>
                {claim.standardOrRegulation && (
                  <div className="text-zinc-400 text-[10px]">Standard: {claim.standardOrRegulation}</div>
                )}
                <div className="text-green-400 mt-1">✓ Certified</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials Provenance */}
      {subject.materialsProvenance && subject.materialsProvenance.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-yellow-400 mb-2">Material Provenance</h4>
          <div className="space-y-2 text-xs">
            {subject.materialsProvenance.map((material, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-zinc-300">{material.name}:</span>
                <span className="text-white">
                  {material.massFraction}% from {material.originCountry}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

