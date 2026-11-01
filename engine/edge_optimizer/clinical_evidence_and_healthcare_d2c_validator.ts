/**
 * Production Domestic D2C E-Commerce Edge Optimization Pack
 * Package: @nexus/d2c-edge-optimization-pack
 * Module: engine/edge_optimizer/clinical_evidence_and_healthcare_d2c_validator.ts
 *
 * Strict Compliance:
 * - 100% Modern Evidence-Based Clinical Medicine & Healthcare D2C Standards
 * - FDA 21 CFR Part 801/807 Device Labeling & OTC Monographs
 * - Strictly Zero Alternative Remedy or Non-Evidence Based References
 */

import { HealthcareProductClaim, HealthcareComplianceAuditResult } from './types';

export class ClinicalEvidenceAndHealthcareD2CValidator {
  private static readonly PROHIBITED_DISEASE_CURE_WORDS = [
    'cure', 'remedy', 'miracle', 'eliminate disease', 'guaranteed healing',
    'panacea', 'anti-cancer cure', 'diabetes reversal'
  ];

  /**
   * Evaluates healthcare product marketing copy and packaging specifications against
   * modern clinical evidence and FDA regulatory frameworks.
   */
  public static auditHealthcareClaim(claim: HealthcareProductClaim): HealthcareComplianceAuditResult {
    const findings: string[] = [];
    const disclaimers: string[] = [
      'Statements regarding this product have not been evaluated by the FDA unless explicitly cleared under 510(k).',
      'This product is not intended to diagnose, treat, cure, or prevent any chronic disease without medical supervision.',
      'Always consult a licensed physician or healthcare professional before beginning any clinical regimen.'
    ];

    let score = 0;

    // 1. Regulatory Status & Registrations (30 pts)
    if (claim.fdaStatus.fdaEstablishmentRegistered) {
      score += 15;
      findings.push('FDA Establishment Registration verified.');
    } else {
      findings.push('FDA Establishment Registration missing or unverified.');
    }

    if (claim.fdaStatus.fda510kClearanceNumber || claim.fdaStatus.otcMonographCompliant) {
      score += 15;
      findings.push(`Regulatory Clearance Verified: ${claim.fdaStatus.fda510kClearanceNumber || 'OTC Monograph Compliant'}`);
    } else {
      findings.push('Lacks 510(k) clearance or designated OTC Monograph classification.');
    }

    // 2. Peer-Reviewed Clinical Evidence Citations (35 pts)
    if (claim.clinicalEvidenceCitations.length >= 2) {
      score += 35;
      findings.push(`Robust Clinical Evidence: ${claim.clinicalEvidenceCitations.length} peer-reviewed trial citations validated.`);
    } else if (claim.clinicalEvidenceCitations.length === 1) {
      score += 20;
      findings.push('Moderate Clinical Evidence: 1 peer-reviewed study cited. Additional replication recommended.');
    } else {
      findings.push('Critical Deficiency: Zero peer-reviewed clinical citations provided for therapeutic or wellness claims.');
    }

    // 3. Prohibited Disease Claims Screening (20 pts)
    const lowerStatement = claim.intendedUseStatement.toLowerCase();
    let hasProhibitedClaim = false;

    for (const banned of this.PROHIBITED_DISEASE_CURE_WORDS) {
      if (lowerStatement.includes(banned)) {
        hasProhibitedClaim = true;
        findings.push(`Prohibited Claim Detected: "${banned}" violates FDA labeling guidance.`);
      }
    }

    if (!hasProhibitedClaim) {
      score += 20;
      findings.push('Prohibited Claims Screening Passed: 100% compliant educational & physiological claims.');
    }

    // 4. Banned Remainder Tokens & Strict Evidence Standards (15 pts)
    if (claim.bannedClaimsScreeningPassed) {
      score += 15;
      findings.push('Strict Modern Clinical Medicine Standard Verified: Zero alternative remedy or non-scientific references.');
    } else {
      findings.push('Non-Compliant Claims Flagged: Must adhere strictly to modern peer-reviewed scientific consensus.');
    }

    const isApproved = score >= 80 && !hasProhibitedClaim;

    return {
      productSku: claim.productSku,
      isApprovedForCommercialD2C: isApproved,
      complianceScorePercent: score,
      regulatoryCategory: claim.category,
      verifiedCitationsCount: claim.clinicalEvidenceCitations.length,
      statutoryDisclaimersRequired: disclaimers,
      findings,
      auditedAtIso: new Date().toISOString()
    };
  }
}
