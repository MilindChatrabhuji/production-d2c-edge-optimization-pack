-- Cloudflare D1 SQL Schema for Domestic D2C E-Commerce Edge Optimization Pack
-- Package: @nexus/d2c-edge-optimization-pack
-- Version: 1.0.0

-- 1. Edge Proxy Configurations Table
CREATE TABLE IF NOT EXISTS edge_proxy_configurations (
  id TEXT PRIMARY KEY,
  store_domain TEXT NOT NULL,
  origin_url TEXT NOT NULL,
  platform TEXT NOT NULL, -- Shopify / WooCommerce / CustomHeadless
  default_ttl_seconds INTEGER DEFAULT 3600,
  stale_revalidate_seconds INTEGER DEFAULT 86400,
  early_hints_enabled INTEGER DEFAULT 1,
  target_max_ttfb_ms INTEGER DEFAULT 50,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Latency Benchmarks Table
CREATE TABLE IF NOT EXISTS latency_benchmarks (
  id TEXT PRIMARY KEY,
  store_domain TEXT NOT NULL,
  url_path TEXT NOT NULL,
  edge_pop TEXT NOT NULL, -- e.g. BOM1 (Mumbai), DEL1 (Delhi)
  cache_status TEXT NOT NULL, -- EDGE_CACHE_HIT / MISS / BYPASS
  origin_latency_ms INTEGER NOT NULL,
  edge_latency_ms INTEGER NOT NULL,
  reduction_percent REAL NOT NULL,
  ttfb_under_50ms INTEGER DEFAULT 1,
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cart Abandonment & Checkout Speed Logs
CREATE TABLE IF NOT EXISTS cart_events (
  id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  customer_session_id TEXT,
  cart_total_usd REAL NOT NULL,
  idle_minutes INTEGER DEFAULT 0,
  urgency_tier TEXT DEFAULT 'LOW',
  incentive_offered_percent INTEGER DEFAULT 0,
  pre_warmed_token_hash TEXT,
  recovery_webhook_dispatched INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cache Invalidation History Table
CREATE TABLE IF NOT EXISTS cache_purge_logs (
  id TEXT PRIMARY KEY,
  purge_type TEXT NOT NULL, -- BY_TAGS / BY_URLS / PURGE_EVERYTHING
  targets_json TEXT NOT NULL,
  initiated_by TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  status TEXT DEFAULT 'SUCCESS',
  purged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Healthcare D2C Regulatory Audits Table
CREATE TABLE IF NOT EXISTS healthcare_compliance_audits (
  id TEXT PRIMARY KEY,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  regulatory_category TEXT NOT NULL,
  compliance_score_percent INTEGER NOT NULL,
  is_approved_d2c INTEGER DEFAULT 1,
  clinical_citations_count INTEGER DEFAULT 0,
  audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. D2C Edge Retainer Subscriptions Table
CREATE TABLE IF NOT EXISTS d2c_retainer_subscriptions (
  id TEXT PRIMARY KEY,
  client_brand_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  tier_name TEXT NOT NULL, -- SPEED_SPRINT ($500), MANAGED ($1,500), ENTERPRISE ($3,000)
  monthly_rate_usd REAL NOT NULL,
  payment_channel TEXT NOT NULL, -- UPI / PAYPAL
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_benchmarks_domain ON latency_benchmarks(store_domain);
CREATE INDEX IF NOT EXISTS idx_benchmarks_pop ON latency_benchmarks(edge_pop);
CREATE INDEX IF NOT EXISTS idx_carts_id ON cart_events(cart_id);
