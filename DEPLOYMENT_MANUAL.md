# EDGE DEPLOYMENT MANUAL: DOMESTIC D2C STOREFRONT EDGE OPTIMIZATION

**Package:** `@nexus/d2c-edge-optimization-pack`  
**Platform:** Cloudflare Workers Edge Network + Cloudflare D1 Database  
**Runtime:** V8 JavaScript / TypeScript Isolated Workers  

---

## 1. PREREQUISITES & ENVIRONMENT CONFIGURATION

1. **Node.js Environment:** Ensure Node.js v18.0.0 or higher is installed.
2. **Cloudflare Wrangler CLI:**
   ```bash
   npm install -g wrangler
   wrangler whoami
   ```
3. **Cloudflare D1 Database Provisioning:**
   ```bash
   npx wrangler d1 create nexus_d2c_production_db
   ```
   Update `engine/edge_d2c_gateway/wrangler.toml` with your database id.

---

## 2. DATABASE SCHEMA MIGRATION

Execute the SQL schema to create telemetry, benchmark, and cart event tables:
```bash
cd engine/edge_d2c_gateway
npx wrangler d1 execute nexus_d2c_production_db --file=../../monetization_d2c_kit/schema.sql
```

Verify tables created:
```bash
npx wrangler d1 execute nexus_d2c_production_db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 3. EDGE WORKER COMPILATION & DEPLOYMENT

Deploy the edge gateway directly to the Cloudflare global network:
```bash
cd engine/edge_d2c_gateway
npx wrangler deploy
```

Expected Deployment Output:
```text
Total Upload: ~14 KiB / gzip: ~4.5 KiB
Uploaded d2c-edge-optimizer-gateway (2.2 sec)
Deployed d2c-edge-optimizer-gateway triggers (1.9 sec)
  https://d2c-edge-optimizer-gateway.example.workers.dev
```

---

## 4. ENDPOINT VERIFICATION TESTS

### 4.1 Health Check Test
```bash
curl -s https://d2c-edge-optimizer-gateway.example.workers.dev/health
```
Expected response:
```json
{
  "status": "HEALTHY",
  "service": "Production Domestic D2C E-Commerce Edge Optimization Gateway",
  "version": "1.0.0",
  "catalogId": "WAY-86-PRODUCT-88",
  "edgePoP": "BOM1-Mumbai"
}
```

### 4.2 Edge Latency Benchmark Test
```bash
curl -X POST https://d2c-edge-optimizer-gateway.example.workers.dev/api/v1/proxy/benchmark \
  -H "Content-Type: application/json" \
  -d '{"storeDomain":"clinical-store.example.com","platform":"Shopify","urlPath":"/products/monitor"}'
```

### 4.3 Webhook Ingestion & Cache Purge Test
```bash
curl -X POST https://d2c-edge-optimizer-gateway.example.workers.dev/api/v1/webhooks/shopify \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Topic: inventory_levels/update" \
  -d '{"inventory_item_id":88412,"sku":"SKU-HEALTH-88","available":42}'
```

---
*Manual compiled by Nexus Engineering Team. 100% Zero-Defect Standard.*
