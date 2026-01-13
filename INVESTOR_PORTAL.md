# Investor Portal - User Guide

## Overview

The Zigma Investor Portal provides secure access for investors to manage their investment portfolio, track performance, and access important documents.

## Access

Navigate to: `/investor/dashboard` after logging in

## Features

### 📊 Portfolio Overview
- **Total Invested**: View your total capital invested across all funds
- **Current Value**: Real-time portfolio valuation
- **Total Returns**: Track gains/losses with percentage returns
- **Active Investments**: Count of current investment positions

### 💼 Investment Dashboard

View all your investments in one place:
- Fund name and details
- Amount invested
- Number of shares owned
- Current market value
- Return percentage
- Investment date

### 📈 Transaction History

Complete transaction log including:
- Investment purchases
- Dividend payments
- Capital distributions
- Transaction dates and amounts
- Export functionality for tax purposes

### 📄 Document Management

**Upload Documents:**
- Identity verification (ID, Passport)
- Signed agreements
- Tax forms
- Other required documentation

**Download Documents:**
- Annual statements
- Investment agreements
- Tax documents (1099, K-1, etc.)
- Monthly/quarterly reports

### 🔔 Notifications

Stay informed with:
- Dividend payment alerts
- Annual report availability
- Important announcements
- Compliance requirements

### 👤 Profile Management

Update your personal information:
- Full name
- Email address
- Phone number
- Investor ID (read-only)

## Navigation

The investor portal uses a simplified sidebar with 4 main sections:
1. **Portfolio** - Dashboard overview
2. **Transactions** - Complete transaction history
3. **Documents** - Upload/download center
4. **Profile** - Personal information

## Security Features

✅ Secure login via Email/Password or Google OAuth
✅ Session-based authentication with Supabase
✅ Role-based access control (investors see only their data)
✅ Protected routes requiring authentication

## Data Privacy

- Investors can only view their own investment data
- Personal information is encrypted
- Document uploads are secure
- Transaction history is private

## Support

For issues or questions about your investments, contact:
- Email: support@zigma.com
- Phone: +1 (555) 123-4567

---

**Note**: This is currently using mock data. To connect to real data, implement Supabase queries in the `fetchInvestorData()` function in `InvestorPortal.tsx`.

## Next Steps for Development

1. **Database Schema**: Create tables for:
   - `investor_portfolios`
   - `investor_transactions`
   - `investor_documents`
   
2. **Row Level Security (RLS)**: Ensure investors can only access their own records

3. **File Upload**: Implement document upload with Supabase Storage

4. **Real-time Updates**: Add subscriptions for live portfolio updates

5. **Notifications System**: Create notification table and delivery system
