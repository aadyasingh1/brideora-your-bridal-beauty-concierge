#!/bin/bash

# 🚀 Brideora Backend Setup - Quick Start Script
# This script helps you execute the next steps

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🚀 BRIDEORA BACKEND SETUP - QUICK START                       ║"
echo "║  Phase 1: Code Implementation ✅ COMPLETE                      ║"
echo "║  Phase 2: Configuration & Setup (YOU ARE HERE)                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Copy environment template${NC}"
echo "Command: cp .env.local.example .env.local"
echo "Action: Copy and fill with your credentials"
echo ""

echo -e "${BLUE}Step 2: Get required credentials${NC}"
echo "□ Supabase: https://supabase.com (Project URL + API Keys)"
echo "□ Razorpay: https://razorpay.com (Key ID + Secret)"
echo "□ Gmail: myaccount.google.com/apppasswords"
echo "□ Gemini: https://ai.google.dev"
echo "□ WhatsApp: https://business.facebook.com (optional)"
echo ""

echo -e "${BLUE}Step 3: Edit .env.local${NC}"
echo "nano .env.local    # or open in your editor"
echo ""

echo -e "${BLUE}Step 4: Create Supabase database${NC}"
echo "□ Go to Supabase Dashboard"
echo "□ SQL Editor → New Query"
echo "□ Paste: DATABASE_SCHEMA.sql"
echo "□ Execute"
echo ""

echo -e "${BLUE}Step 5: Start development server${NC}"
echo "Command: npm run dev"
echo ""

echo -e "${BLUE}Step 6: Test API${NC}"
echo "curl -X POST http://localhost:8080/api/vendors/register \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\":\"Test\",\"email\":\"test@test.com\",...}'"
echo ""

echo -e "${BLUE}Step 7: Create N8N workflows${NC}"
echo "□ Read: N8N_COMPLETE_SETUP.md"
echo "□ Create 12 workflows at: https://aaadyasingh1.app.n8n.cloud/"
echo ""

echo -e "${GREEN}═════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📖 DOCUMENTATION${NC}"
echo ""
echo "Quick reference:        QUICK_REFERENCE.md"
echo "Setup checklist:        IMPLEMENTATION_CHECKLIST.md"
echo "N8N workflows:          N8N_COMPLETE_SETUP.md"
echo "Full integration guide: BACKEND_INTEGRATION_GUIDE.md"
echo "Execution summary:      EXECUTION_SUMMARY.md"
echo ""

echo -e "${GREEN}✅ WHAT'S READY${NC}"
echo "✓ 13 database tables"
echo "✓ 12 API endpoints (9 main + 3 webhook)"
echo "✓ 4 core libraries (n8n, razorpay, notifications, supabase)"
echo "✓ React hooks for workflows"
echo "✓ Complete documentation"
echo "✓ Payment verification"
echo "✓ Multi-channel notifications"
echo ""

echo -e "${YELLOW}⏱️  TIME ESTIMATE${NC}"
echo "Environment setup:     5 minutes"
echo "Database creation:     10 minutes"
echo "Razorpay config:       5 minutes"
echo "API testing:           15 minutes"
echo "N8N workflow setup:    2-3 hours"
echo "Total:                 ~4-5 hours"
echo ""

echo -e "${GREEN}═════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ready to start? Follow IMPLEMENTATION_CHECKLIST.md"
echo ""
echo "Questions? Check QUICK_REFERENCE.md for troubleshooting"
echo ""
