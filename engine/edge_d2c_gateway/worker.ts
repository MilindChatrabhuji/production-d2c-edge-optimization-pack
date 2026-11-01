/**
 * Production Domestic D2C E-Commerce Edge Optimization Pack
 * Package: @nexus/d2c-edge-optimization-pack
 * Module: engine/edge_d2c_gateway/worker.ts
 *
 * Cloudflare Workers Edge Gateway for D2C Storefront Acceleration,
 * Sub-50ms TTFB Reverse Proxy, Webhook Purge, and Cart Optimization.
 */

import { Sub50msStorefrontEdgeProxyRouter } from '../edge_optimizer/sub50ms_storefront_edge_proxy_router';
import { CartAbandonmentAndCheckoutSpeedBooster } from '../edge_optimizer/cart_abandonment_and_checkout_speed_booster';
import { ClinicalEvidenceAndHealthcareD2CValidator } from '../edge_optimizer/clinical_evidence_and_healthcare_d2c_validator';
import { ShopifyWooCommerceEdgeWebhookRouter } from './shopify_woocommerce_edge_webhook_router';
import { DynamicInventoryAndCdnCacheInvalidator } from './dynamic_inventory_and_cdn_cache_invalidator';
import { EdgeProxyConfig, CartPayload, HealthcareProductClaim } from '../edge_optimizer/types';

export interface Env {
  DB?: any; // Cloudflare D1 Database binding
  ENVIRONMENT?: string;
  SHOPIFY_WEBHOOK_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Shopify-Topic, X-Shopify-Hmac-Sha256',
      'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    try {
      // 1. Health Check
      if (url.pathname === '/health' || url.pathname === '/api/v1/health') {
        return new Response(
          JSON.stringify({
            status: 'HEALTHY',
            service: 'Production Domestic D2C E-Commerce Edge Optimization Gateway',
            version: '1.0.0',
            catalogId: 'WAY-86-PRODUCT-88',
            edgePoP: 'BOM1-Mumbai',
            targetSla: 'SUB_50MS_TTFB',
            timestamp: new Date().toISOString()
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // 2. Latency & TTFB Benchmark
      if (url.pathname === '/api/v1/proxy/benchmark' && method === 'POST') {
        const body: any = await request.json();
        const config: EdgeProxyConfig = {
          storeDomain: body.storeDomain || 'store.example.com',
          originUrl: body.originUrl || 'https://origin.example.com',
          platform: body.platform || 'Shopify',
          defaultTtlSeconds: 3600,
          staleWhileRevalidateSeconds: 86400,
          enableImageCompression: true,
          enableEarlyHints: true,
          surrogateKeysEnabled: true,
          targetMaxTtfbMs: 50
        };

        const router = new Sub50msStorefrontEdgeProxyRouter(config);
        const benchmark = router.benchmarkLatency(body.urlPath || '/products/clinical-vital-monitor', true);
        const headers = router.generateEdgeCachingHeaders(body.urlPath || '/products/clinical-vital-monitor', ['prod_88', 'catalog']);

        return new Response(JSON.stringify({ status: 'SUCCESS', benchmark, generatedHeaders: headers }), {
          headers: corsHeaders,
          status: 200
        });
      }

      // 3. Cart Abandonment & Checkout Speed Pre-Warming
      if (url.pathname === '/api/v1/cart/abandonment/evaluate' && method === 'POST') {
        const cart = (await request.json()) as CartPayload;
        const trigger = CartAbandonmentAndCheckoutSpeedBooster.evaluateAbandonmentRisk(cart, 25);
        const message = CartAbandonmentAndCheckoutSpeedBooster.formatRecoveryNotification(
          trigger,
          'Valued Healthcare Client',
          cart.checkoutUrl || 'https://store.example.com/checkouts/c1'
        );

        return new Response(JSON.stringify({ status: 'SUCCESS', recoveryTrigger: trigger, notificationPreview: message }), {
          headers: corsHeaders,
          status: 200
        });
      }

      // 4. Healthcare D2C Regulatory & Clinical Evidence Audit
      if (url.pathname === '/api/v1/compliance/healthcare/audit' && method === 'POST') {
        const claim = (await request.json()) as HealthcareProductClaim;
        const audit = ClinicalEvidenceAndHealthcareD2CValidator.auditHealthcareClaim(claim);

        return new Response(JSON.stringify({ status: 'SUCCESS', auditResult: audit }), {
          headers: corsHeaders,
          status: 200
        });
      }

      // 5. Ingest Shopify Webhook & Dynamic Cache Invalidation
      if (url.pathname === '/api/v1/webhooks/shopify' && method === 'POST') {
        const topic = request.headers.get('X-Shopify-Topic') || 'inventory_levels/update';
        const body: any = await request.json();

        const event = ShopifyWooCommerceEdgeWebhookRouter.parseWebhook('Shopify', topic, body);
        const purgeReceipt = await DynamicInventoryAndCdnCacheInvalidator.executePurge({
          purgeType: 'BY_TAGS',
          targets: event.surrogateCacheTagsToPurge,
          initiatedBy: 'Shopify-Edge-Webhook'
        });

        return new Response(JSON.stringify({ status: 'SUCCESS', event, purgeReceipt }), {
          headers: corsHeaders,
          status: 200
        });
      }

      // 6. On-Demand Edge Cache Purge Endpoint
      if (url.pathname === '/api/v1/cache/purge' && method === 'POST') {
        const body: any = await request.json();
        const receipt = await DynamicInventoryAndCdnCacheInvalidator.executePurge({
          purgeType: body.purgeType || 'BY_TAGS',
          targets: body.targets || ['catalog_home'],
          initiatedBy: 'Manual-Edge-Purge'
        });

        return new Response(JSON.stringify({ status: 'SUCCESS', purgeReceipt: receipt }), {
          headers: corsHeaders,
          status: 200
        });
      }

      return new Response(
        JSON.stringify({
          error: 'Endpoint not found',
          availableEndpoints: [
            '/health',
            '/api/v1/proxy/benchmark',
            '/api/v1/cart/abandonment/evaluate',
            '/api/v1/compliance/healthcare/audit',
            '/api/v1/webhooks/shopify',
            '/api/v1/cache/purge'
          ]
        }),
        { headers: corsHeaders, status: 404 }
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Internal edge gateway error', details: err.message }), {
        headers: corsHeaders,
        status: 500
      });
    }
  }
};
