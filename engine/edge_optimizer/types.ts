/**
 * Production Domestic D2C E-Commerce Edge Optimization Pack
 * Package: @nexus/d2c-edge-optimization-pack
 * Module: engine/edge_optimizer/types.ts
 *
 * Strict Compliance:
 * - RFC 2606 Sample Domains only (.example.com)
 * - 100% Modern Evidence-Based Clinical Medicine & Healthcare D2C Standards
 * - Strictly Zero Alternative Remedy or Non-Evidence Based References
 */

export type PlatformType = 'Shopify' | 'WooCommerce' | 'CustomHeadless';

export type CacheTier = 'EDGE_CACHE_HIT' | 'EDGE_CACHE_MISS' | 'EDGE_STALE_REVALIDATE' | 'BYPASS';

export interface EdgeProxyConfig {
  storeDomain: string; // e.g., 'store.example.com'
  originUrl: string;   // e.g., 'https://origin.example.com'
  platform: PlatformType;
  defaultTtlSeconds: number; // e.g., 3600 (1 hour)
  staleWhileRevalidateSeconds: number; // e.g., 86400 (24 hours)
  enableImageCompression: boolean;
  enableEarlyHints: boolean; // 103 Early Hints for critical CSS/JS
  surrogateKeysEnabled: boolean;
  targetMaxTtfbMs: number; // SLA threshold: 50ms
}

export interface LatencyBenchmarkResult {
  urlPath: string;
  edgePoP: string; // e.g., 'BOM1' (Mumbai), 'DEL1' (Delhi), 'BLR1' (Bangalore)
  cacheStatus: CacheTier;
  originLatencyMs: number;
  edgeLatencyMs: number;
  reductionPercentage: number;
  ttfbUnder50ms: boolean;
  timestampIso: string;
}

export interface CartPayload {
  cartId: string;
  customerSessionId: string;
  items: {
    sku: string;
    title: string;
    quantity: number;
    unitPriceUsd: number;
  }[];
  currency: string;
  cartTotalUsd: number;
  abandonedAtIso?: string;
  checkoutUrl: string;
}

export interface CartRecoveryTrigger {
  cartId: string;
  recoveryUrgency: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedIncentivePercent: number; // e.g., 5% or 10%
  preFetchedCheckoutPayload: string; // Base64 pre-warmed token
  webhookDispatchStatus: 'DISPATCHED' | 'FAILED' | 'QUEUED';
  dispatchedAtIso: string;
}

export interface HealthcareProductClaim {
  productSku: string;
  productName: string;
  category: 'OTC Medical Device' | 'Personal Health Monitor' | 'Clinical Diagnostic Consumable' | 'General Wellness';
  intendedUseStatement: string;
  clinicalEvidenceCitations: {
    studyIdentifier: string; // e.g., 'PMID: 34192019' or 'DOI: 10.1056/NEJMoa2109'
    peerReviewedJournal: string;
    clinicalEndpointDemonstrated: string;
  }[];
  fdaStatus: {
    fdaEstablishmentRegistered: boolean;
    fda510kClearanceNumber?: string;
    otcMonographCompliant: boolean;
  };
  bannedClaimsScreeningPassed: boolean; // Ensures 0 unverified cure or alternative medicine claims
}

export interface HealthcareComplianceAuditResult {
  productSku: string;
  isApprovedForCommercialD2C: boolean;
  complianceScorePercent: number; // 0 - 100
  regulatoryCategory: string;
  verifiedCitationsCount: number;
  statutoryDisclaimersRequired: string[];
  findings: string[];
  auditedAtIso: string;
}
