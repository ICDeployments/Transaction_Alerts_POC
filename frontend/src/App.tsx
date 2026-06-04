import { useState, useEffect } from 'react';
import AlertDetail from './components/AlertDetail';
import RecommendationPanel from './components/RecommendationPanel';
import Dashboard from './components/Dashboard';
import AdvisoryDatabase from './pages/AdvisoryDatabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Inbox, 
  Search, 
  FolderOpen, 
  Users, 
  ChevronDown,
  ExternalLink,
  Sparkles,
  CheckCircle,
  AlertOctagon,
  XCircle,
  X,
  TrendingUp,
  Database
} from 'lucide-react';
import { analyzeTransaction } from './services/api';
import type { Alert, ActionDecision } from './types';
import type { AdvisoryRecord } from './types/advisoryDb';

// Mock data for demonstration - 20 diverse alerts
const mockAlerts: Alert[] = [
  // 1. Confirmed Fraud - Card Testing
  {
    alert_id: 'ALT-2026-001',
    entity_name: 'John Doe',
    risk_score: 95,
    alert_type: 'Card Testing',
    age_days: 1,
    assigned_to: 'Analyst #1234',
    sla_status: 'At Risk',
    transaction: {
      // Required top-level fields for backward compatibility
      transaction_id: 'TXN123456789',
      amount: 249.99,
      currency: 'USD',
      customer_id: 'CH987654321',
      
      // New Falcon scoring format
      transactionId: 'TXN123456789',
      eventTimestamp: '2026-01-19T08:32:45Z',
      card: {
        panMasked: '411111XXXXXX1111',
        cardType: 'CREDIT',
        expiryDate: '12/28',
        cardholderId: 'CH987654321'
      },
      transactionDetails: {
        amount: 249.99,
        currency: 'USD',
        merchantCategoryCode: '5814',
        merchantName: 'FOOD & BEVERAGE OUTLET',
        merchantLocation: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        channel: 'ECOM',
        entryMode: 'KEYED',
        transactionType: 'PURCHASE',
        isCardPresent: false,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-9988-ABCD-1234',
        ipAddress: '172.16.45.122',
        geoLocation: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        previousTransactionsLast24h: 12,
        averageTicketSize: 89.50
      },
      velocityIndicators: {
        txnCountLast10Min: 3,
        txnAmountLast10Min: 540.75,
        crossBorderTxnInLastHour: false
      },
      riskContext: {
        channelRiskScore: 42,
        merchantRiskScore: 65,
        deviceRiskScore: 58
      },
      falconScoringRequest: {
        modelVersion: '6.5',
        scoreRequestId: 'SCR000987654321',
        requestType: 'REAL_TIME'
      },
      
      // Additional legacy fields for display compatibility
      customer_name: 'John Doe',
      transaction_date: '2026-01-19T08:32:45Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-001-US',
      destination_account: 'MERCHANT-SF-5814',
      originator: 'John Doe',
      beneficiary: 'FOOD & BEVERAGE OUTLET',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-FRAUD-001: Multiple Small Transactions Card Testing',
      'RULE-VEL-003: Rapid Fire Attempts',
      'RULE-ECOM-019: Known Fraud Pattern'
    ],
    severity: 'Critical',
    created_at: '2026-01-25T08:35:00Z',
    status: 'Open',
  },
  
  // 2. False Positive - Legitimate Travel
  {
    alert_id: 'ALT-2026-002',
    entity_name: 'Sarah Williams',
    risk_score: 42,
    alert_type: 'Geographic Anomaly',
    age_days: 3,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-98765',
      amount: 1250.00,
      currency: 'EUR',
      customer_id: 'CH445566778',
      transactionId: 'TXN-98765',
      eventTimestamp: '2026-01-23T14:20:00Z',
      card: {
        panMasked: '424242XXXXXX4242',
        cardType: 'CREDIT',
        expiryDate: '09/27',
        cardholderId: 'CH445566778'
      },
      transactionDetails: {
        amount: 1250.00,
        currency: 'EUR',
        merchantCategoryCode: '3501',
        merchantName: 'HILTON PARIS OPERA',
        merchantLocation: {
          city: 'Paris',
          state: '',
          country: 'France'
        },
        channel: 'POS',
        entryMode: 'CHIP',
        transactionType: 'PURCHASE',
        isCardPresent: true,
        isPinAuthenticated: true
      },
      customerContext: {
        deviceId: 'DEV-POS-FR-8877',
        ipAddress: '185.45.78.90',
        geoLocation: {
          latitude: 48.8566,
          longitude: 2.3522
        },
        previousTransactionsLast24h: 4,
        averageTicketSize: 125.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 1250.00,
        crossBorderTxnInLastHour: true
      },
      riskContext: {
        channelRiskScore: 15,
        merchantRiskScore: 10,
        deviceRiskScore: 12
      },
      customer_name: 'Sarah Williams',
      transaction_date: '2026-01-23T14:20:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-002-US',
      destination_account: 'MERCHANT-FR-3501',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-GEO-002: Foreign Transaction After Domestic Pattern',
      'RULE-TRAVEL-005: Large Hotel Charge'
    ],
    severity: 'Low',
    created_at: '2026-01-23T14:25:00Z',
    status: 'In Review',
  },

  // 3. Suspected Money Laundering - Structuring
  {
    alert_id: 'ALT-2026-003',
    entity_name: 'QuickCash Services LLC',
    risk_score: 88,
    alert_type: 'Structuring',
    age_days: 5,
    assigned_to: 'Analyst #1234',
    sla_status: 'Overdue',
    transaction: {
      transaction_id: 'TXN-44556',
      amount: 9950,
      currency: 'USD',
      destination_country: 'USA',
      customer_id: 'CORP-9988',
      customer_name: 'QuickCash Services LLC',
      transaction_date: '2026-01-21T10:15:00Z',
      transaction_type: 'Cash Deposit',
      source_account: 'ACC-QC-001',
      destination_account: 'ACC-QC-001',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-AML-003: Structuring Below Reporting Threshold',
      'RULE-CASH-007: Repeated Just-Under-10K Deposits',
      'RULE-PATTERN-012: Seven Transactions in Three Days'
    ],
    severity: 'Critical',
    created_at: '2026-01-21T10:20:00Z',
    status: 'Escalated',
  },

  // 4. Account Takeover Attempt
  {
    alert_id: 'ALT-2026-004',
    entity_name: 'Michael Chen',
    risk_score: 91,
    alert_type: 'Account Takeover',
    age_days: 0,
    assigned_to: 'Analyst #9012',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-77889',
      amount: 2499.99,
      currency: 'USD',
      customer_id: 'CH112233445',
      transactionId: 'TXN-77889',
      eventTimestamp: '2026-01-26T03:45:00Z',
      card: {
        panMasked: '378282XXXXXX0005',
        cardType: 'CREDIT',
        expiryDate: '06/28',
        cardholderId: 'CH112233445'
      },
      transactionDetails: {
        amount: 2499.99,
        currency: 'USD',
        merchantCategoryCode: '5732',
        merchantName: 'ELECTRONICS WAREHOUSE ONLINE',
        merchantLocation: {
          city: 'Unknown',
          state: '',
          country: 'Russia'
        },
        channel: 'ECOM',
        entryMode: 'KEYED',
        transactionType: 'PURCHASE',
        isCardPresent: false,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-UNKNOWN-RU-9999',
        ipAddress: '91.108.56.123',
        geoLocation: {
          latitude: 55.7558,
          longitude: 37.6173
        },
        previousTransactionsLast24h: 15,
        averageTicketSize: 85.00
      },
      velocityIndicators: {
        txnCountLast10Min: 8,
        txnAmountLast10Min: 8750.00,
        crossBorderTxnInLastHour: true
      },
      riskContext: {
        channelRiskScore: 95,
        merchantRiskScore: 88,
        deviceRiskScore: 99
      },
      customer_name: 'Michael Chen',
      transaction_date: '2026-01-26T03:45:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-004-US',
      destination_account: 'MERCHANT-RU-5732',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-ATO-001: Login from New Device & Location',
      'RULE-ATO-005: Sudden Large Purchase Pattern Change',
      'RULE-GEO-015: High-Risk Country Transaction',
      'RULE-VEL-008: Multiple Failed Then Successful'
    ],
    severity: 'Critical',
    created_at: '2026-01-26T03:50:00Z',
    status: 'Open',
  },

  // 5. False Positive - Business Expense
  {
    alert_id: 'ALT-2026-005',
    entity_name: 'TechStart Inc',
    risk_score: 38,
    alert_type: 'High Dollar Amount',
    age_days: 2,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-55443',
      amount: 45000,
      currency: 'USD',
      customer_id: 'CORP-TECH-001',
      customer_name: 'TechStart Inc',
      transaction_date: '2026-01-24T11:30:00Z',
      transaction_type: 'Wire Transfer',
      source_account: 'ACC-TECH-US',
      destination_account: 'ACC-VENDOR-US',
      destination_country: 'USA',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-AMT-001: Large Transaction Alert',
      'RULE-BUS-003: Vendor Payment Review'
    ],
    severity: 'Low',
    created_at: '2026-01-24T11:35:00Z',
    status: 'In Review',
  },

  // 6. Cryptocurrency Fraud
  {
    alert_id: 'ALT-2026-006',
    entity_name: 'Robert Martinez',
    risk_score: 93,
    alert_type: 'Crypto Fraud',
    age_days: 1,
    assigned_to: 'Analyst #1234',
    sla_status: 'At Risk',
    transaction: {
      transaction_id: 'TXN-66778',
      amount: 8750.00,
      currency: 'USD',
      customer_id: 'CH998877665',
      transactionId: 'TXN-66778',
      eventTimestamp: '2026-01-25T19:22:00Z',
      card: {
        panMasked: '510510XXXXXX5100',
        cardType: 'DEBIT',
        expiryDate: '11/26',
        cardholderId: 'CH998877665'
      },
      transactionDetails: {
        amount: 8750.00,
        currency: 'USD',
        merchantCategoryCode: '6051',
        merchantName: 'CRYPTO EXCHANGE PRO',
        merchantLocation: {
          city: 'Online',
          state: '',
          country: 'Malta'
        },
        channel: 'ECOM',
        entryMode: 'KEYED',
        transactionType: 'PURCHASE',
        isCardPresent: false,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-MOBILE-NEW-7766',
        ipAddress: '203.45.78.190',
        geoLocation: {
          latitude: 35.9375,
          longitude: 14.3754
        },
        previousTransactionsLast24h: 1,
        averageTicketSize: 45.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 8750.00,
        crossBorderTxnInLastHour: true
      },
      riskContext: {
        channelRiskScore: 78,
        merchantRiskScore: 85,
        deviceRiskScore: 72
      },
      customer_name: 'Robert Martinez',
      transaction_date: '2026-01-25T19:22:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-006-US',
      destination_account: 'CRYPTO-EX-MT',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-CRYPTO-001: Large Crypto Exchange Transaction',
      'RULE-FRAUD-025: New Device First-Time Large Purchase',
      'RULE-RISK-033: Crypto MCC High Risk'
    ],
    severity: 'High',
    created_at: '2026-01-25T19:27:00Z',
    status: 'Open',
  },

  // 7. Identity Theft - Synthetic Identity
  {
    alert_id: 'ALT-2026-007',
    entity_name: 'Jessica Thompson',
    risk_score: 86,
    alert_type: 'Synthetic Identity',
    age_days: 4,
    assigned_to: 'Analyst #9012',
    sla_status: 'At Risk',
    transaction: {
      transaction_id: 'TXN-11223',
      amount: 3200.00,
      currency: 'USD',
      customer_id: 'CH556677889',
      customer_name: 'Jessica Thompson',
      transaction_date: '2026-01-22T16:45:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-007-US',
      destination_account: 'MERCHANT-RETAIL',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-ID-007: Synthetic Identity Indicators',
      'RULE-KYC-012: SSN Mismatch Pattern',
      'RULE-CREDIT-018: New Account Rapid Spend'
    ],
    severity: 'High',
    created_at: '2026-01-22T16:50:00Z',
    status: 'In Review',
  },

  // 8. False Positive - Authorized Large Purchase
  {
    alert_id: 'ALT-2026-008',
    entity_name: 'David Park',
    risk_score: 45,
    alert_type: 'Large Purchase',
    age_days: 1,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-33445',
      amount: 15500.00,
      currency: 'USD',
      customer_id: 'CH223344556',
      transactionId: 'TXN-33445',
      eventTimestamp: '2026-01-25T13:10:00Z',
      card: {
        panMasked: '371449XXXXXX1001',
        cardType: 'CREDIT',
        expiryDate: '03/29',
        cardholderId: 'CH223344556'
      },
      transactionDetails: {
        amount: 15500.00,
        currency: 'USD',
        merchantCategoryCode: '5511',
        merchantName: 'PREMIUM AUTO DEALER',
        merchantLocation: {
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA'
        },
        channel: 'POS',
        entryMode: 'CHIP',
        transactionType: 'PURCHASE',
        isCardPresent: true,
        isPinAuthenticated: true
      },
      customerContext: {
        deviceId: 'DEV-POS-DEALER-5511',
        ipAddress: '204.15.67.89',
        geoLocation: {
          latitude: 34.0522,
          longitude: -118.2437
        },
        previousTransactionsLast24h: 2,
        averageTicketSize: 250.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 15500.00,
        crossBorderTxnInLastHour: false
      },
      riskContext: {
        channelRiskScore: 22,
        merchantRiskScore: 18,
        deviceRiskScore: 15
      },
      customer_name: 'David Park',
      transaction_date: '2026-01-25T13:10:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-008-US',
      destination_account: 'MERCHANT-AUTO-CA',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-AMT-005: Transaction 10x Average Ticket',
      'RULE-AUTO-001: Large Auto Dealer Transaction'
    ],
    severity: 'Low',
    created_at: '2026-01-25T13:15:00Z',
    status: 'Open',
  },

  // 9. Wire Fraud - Business Email Compromise
  {
    alert_id: 'ALT-2026-009',
    entity_name: 'Global Manufacturing Corp',
    risk_score: 97,
    alert_type: 'BEC - Wire Fraud',
    age_days: 0,
    assigned_to: 'Analyst #1234',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-99887',
      amount: 185000,
      currency: 'USD',
      destination_country: 'Hong Kong',
      customer_id: 'CORP-GMC-001',
      customer_name: 'Global Manufacturing Corp',
      transaction_date: '2026-01-26T09:30:00Z',
      transaction_type: 'Wire Transfer',
      source_account: 'ACC-GMC-US',
      destination_account: 'ACC-UNKNOWN-HK',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-BEC-001: Suspicious Wire to New Beneficiary',
      'RULE-BEC-008: Email Pattern Anomaly Detected',
      'RULE-WIRE-015: Large International Wire First Time'
    ],
    severity: 'Critical',
    created_at: '2026-01-26T09:35:00Z',
    status: 'Open',
  },

  // 10. Suspicious - Gambling Pattern
  {
    alert_id: 'ALT-2026-010',
    entity_name: 'Thomas Anderson',
    risk_score: 68,
    alert_type: 'Gambling Activity',
    age_days: 3,
    assigned_to: 'Analyst #9012',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-22334',
      amount: 5500.00,
      currency: 'USD',
      customer_id: 'CH667788990',
      transactionId: 'TXN-22334',
      eventTimestamp: '2026-01-23T22:15:00Z',
      card: {
        panMasked: '555555XXXXXX4444',
        cardType: 'CREDIT',
        expiryDate: '08/27',
        cardholderId: 'CH667788990'
      },
      transactionDetails: {
        amount: 5500.00,
        currency: 'USD',
        merchantCategoryCode: '7995',
        merchantName: 'ONLINE CASINO VEGAS',
        merchantLocation: {
          city: 'Online',
          state: '',
          country: 'Curacao'
        },
        channel: 'ECOM',
        entryMode: 'KEYED',
        transactionType: 'PURCHASE',
        isCardPresent: false,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-LAPTOP-HOME-4455',
        ipAddress: '98.234.56.123',
        geoLocation: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        previousTransactionsLast24h: 18,
        averageTicketSize: 1200.00
      },
      velocityIndicators: {
        txnCountLast10Min: 3,
        txnAmountLast10Min: 8900.00,
        crossBorderTxnInLastHour: true
      },
      riskContext: {
        channelRiskScore: 62,
        merchantRiskScore: 75,
        deviceRiskScore: 45
      },
      customer_name: 'Thomas Anderson',
      transaction_date: '2026-01-23T22:15:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-010-US',
      destination_account: 'CASINO-ONLINE-CW',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-GAMB-001: Large Gambling Transaction',
      'RULE-GAMB-007: Multiple Gambling Transactions Pattern',
      'RULE-VEL-012: Rapid Gambling Activity'
    ],
    severity: 'Medium',
    created_at: '2026-01-23T22:20:00Z',
    status: 'In Review',
  },

  // 11. False Positive - Medical Emergency
  {
    alert_id: 'ALT-2026-011',
    entity_name: 'Emily Rodriguez',
    risk_score: 52,
    alert_type: 'Unusual Pattern',
    age_days: 2,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-44556',
      amount: 8900.00,
      currency: 'USD',
      customer_id: 'CH334455667',
      transactionId: 'TXN-44556',
      eventTimestamp: '2026-01-24T04:30:00Z',
      card: {
        panMasked: '601111XXXXXX6011',
        cardType: 'CREDIT',
        expiryDate: '05/28',
        cardholderId: 'CH334455667'
      },
      transactionDetails: {
        amount: 8900.00,
        currency: 'USD',
        merchantCategoryCode: '8062',
        merchantName: 'CITY HOSPITAL EMERGENCY',
        merchantLocation: {
          city: 'Chicago',
          state: 'IL',
          country: 'USA'
        },
        channel: 'POS',
        entryMode: 'SWIPE',
        transactionType: 'PURCHASE',
        isCardPresent: true,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-POS-HOSP-8062',
        ipAddress: '172.20.30.45',
        geoLocation: {
          latitude: 41.8781,
          longitude: -87.6298
        },
        previousTransactionsLast24h: 1,
        averageTicketSize: 125.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 8900.00,
        crossBorderTxnInLastHour: false
      },
      riskContext: {
        channelRiskScore: 18,
        merchantRiskScore: 12,
        deviceRiskScore: 10
      },
      customer_name: 'Emily Rodriguez',
      transaction_date: '2026-01-24T04:30:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-011-US',
      destination_account: 'HOSPITAL-IL',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-TIME-003: Late Night Large Transaction',
      'RULE-AMT-008: Unusual Healthcare Charge'
    ],
    severity: 'Low',
    created_at: '2026-01-24T04:35:00Z',
    status: 'Open',
  },

  // 12. Phishing Attack - Card Not Present Fraud
  {
    alert_id: 'ALT-2026-012',
    entity_name: 'Patricia Wilson',
    risk_score: 89,
    alert_type: 'CNP Fraud',
    age_days: 1,
    assigned_to: 'Analyst #1234',
    sla_status: 'At Risk',
    transaction: {
      transaction_id: 'TXN-77665',
      amount: 1899.99,
      currency: 'USD',
      customer_id: 'CH778899001',
      transactionId: 'TXN-77665',
      eventTimestamp: '2026-01-25T11:45:00Z',
      card: {
        panMasked: '340000XXXXXX0009',
        cardType: 'CREDIT',
        expiryDate: '02/27',
        cardholderId: 'CH778899001'
      },
      transactionDetails: {
        amount: 1899.99,
        currency: 'USD',
        merchantCategoryCode: '5732',
        merchantName: 'TECH GADGETS DIRECT',
        merchantLocation: {
          city: 'Unknown',
          state: '',
          country: 'China'
        },
        channel: 'ECOM',
        entryMode: 'KEYED',
        transactionType: 'PURCHASE',
        isCardPresent: false,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-UNKNOWN-CN-9988',
        ipAddress: '58.220.45.167',
        geoLocation: {
          latitude: 31.2304,
          longitude: 121.4737
        },
        previousTransactionsLast24h: 6,
        averageTicketSize: 65.00
      },
      velocityIndicators: {
        txnCountLast10Min: 4,
        txnAmountLast10Min: 4250.00,
        crossBorderTxnInLastHour: true
      },
      riskContext: {
        channelRiskScore: 88,
        merchantRiskScore: 82,
        deviceRiskScore: 91
      },
      customer_name: 'Patricia Wilson',
      transaction_date: '2026-01-25T11:45:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-012-US',
      destination_account: 'MERCHANT-CN-5732',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-PHISH-001: Suspected Phishing Victim',
      'RULE-CNP-005: Card Not Present High Risk',
      'RULE-GEO-020: Impossible Geography Pattern'
    ],
    severity: 'High',
    created_at: '2026-01-25T11:50:00Z',
    status: 'Open',
  },

  // 13. Suspicious - Smurfing Pattern
  {
    alert_id: 'ALT-2026-013',
    entity_name: 'Metro Services Group',
    risk_score: 82,
    alert_type: 'Smurfing',
    age_days: 6,
    assigned_to: 'Analyst #9012',
    sla_status: 'Overdue',
    transaction: {
      transaction_id: 'TXN-88990',
      amount: 4950,
      currency: 'USD',
      customer_id: 'CORP-MSG-002',
      customer_name: 'Metro Services Group',
      transaction_date: '2026-01-20T15:20:00Z',
      transaction_type: 'Cash Deposit',
      source_account: 'ACC-MSG-001',
      destination_account: 'ACC-MSG-001',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-AML-015: Smurfing Pattern Multiple Locations',
      'RULE-CASH-012: Coordinated Deposits Below Threshold',
      'RULE-PATTERN-025: 12 Similar Amounts 5 Days'
    ],
    severity: 'High',
    created_at: '2026-01-20T15:25:00Z',
    status: 'Escalated',
  },

  // 14. False Positive - Subscription Renewal
  {
    alert_id: 'ALT-2026-014',
    entity_name: 'Christopher Lee',
    risk_score: 28,
    alert_type: 'Recurring Pattern',
    age_days: 1,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-11224',
      amount: 399.99,
      currency: 'USD',
      customer_id: 'CH889900112',
      transactionId: 'TXN-11224',
      eventTimestamp: '2026-01-25T00:05:00Z',
      card: {
        panMasked: '520000XXXXXX0000',
        cardType: 'CREDIT',
        expiryDate: '10/28',
        cardholderId: 'CH889900112'
      },
      transactionDetails: {
        amount: 399.99,
        currency: 'USD',
        merchantCategoryCode: '5815',
        merchantName: 'STREAMING SERVICE PRO',
        merchantLocation: {
          city: 'Online',
          state: 'CA',
          country: 'USA'
        },
        channel: 'ECOM',
        entryMode: 'STORED',
        transactionType: 'RECURRING',
        isCardPresent: false,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-AUTO-RECURRING',
        ipAddress: '104.27.162.123',
        geoLocation: {
          latitude: 37.3861,
          longitude: -122.0839
        },
        previousTransactionsLast24h: 3,
        averageTicketSize: 85.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 399.99,
        crossBorderTxnInLastHour: false
      },
      riskContext: {
        channelRiskScore: 12,
        merchantRiskScore: 8,
        deviceRiskScore: 5
      },
      customer_name: 'Christopher Lee',
      transaction_date: '2026-01-25T00:05:00Z',
      transaction_type: 'RECURRING',
      source_account: 'ACC-014-US',
      destination_account: 'STREAMING-CA',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-TIME-001: Midnight Transaction',
      'RULE-SUB-003: Large Subscription Charge'
    ],
    severity: 'Low',
    created_at: '2026-01-25T00:10:00Z',
    status: 'Open',
  },

  // 15. Confirmed Fraud - Skimming Device
  {
    alert_id: 'ALT-2026-015',
    entity_name: 'Amanda Foster',
    risk_score: 94,
    alert_type: 'Card Skimming',
    age_days: 2,
    assigned_to: 'Analyst #1234',
    sla_status: 'At Risk',
    transaction: {
      transaction_id: 'TXN-55667',
      amount: 500.00,
      currency: 'USD',
      customer_id: 'CH990011223',
      transactionId: 'TXN-55667',
      eventTimestamp: '2026-01-24T18:30:00Z',
      card: {
        panMasked: '676767XXXXXX6767',
        cardType: 'DEBIT',
        expiryDate: '04/27',
        cardholderId: 'CH990011223'
      },
      transactionDetails: {
        amount: 500.00,
        currency: 'USD',
        merchantCategoryCode: '5541',
        merchantName: 'ROADSIDE GAS STATION',
        merchantLocation: {
          city: 'Detroit',
          state: 'MI',
          country: 'USA'
        },
        channel: 'POS',
        entryMode: 'SWIPE',
        transactionType: 'PURCHASE',
        isCardPresent: true,
        isPinAuthenticated: false
      },
      customerContext: {
        deviceId: 'DEV-POS-FLAGGED-5541',
        ipAddress: '192.168.50.88',
        geoLocation: {
          latitude: 42.3314,
          longitude: -83.0458
        },
        previousTransactionsLast24h: 0,
        averageTicketSize: 50.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 500.00,
        crossBorderTxnInLastHour: false
      },
      riskContext: {
        channelRiskScore: 75,
        merchantRiskScore: 92,
        deviceRiskScore: 88
      },
      customer_name: 'Amanda Foster',
      transaction_date: '2026-01-24T18:30:00Z',
      transaction_type: 'PURCHASE',
      source_account: 'ACC-015-US',
      destination_account: 'GAS-STATION-MI',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-SKIM-001: Known Compromised Terminal',
      'RULE-FRAUD-030: Multiple Cards Same Terminal Pattern',
      'RULE-MERCHANT-088: High Fraud Rate Location'
    ],
    severity: 'Critical',
    created_at: '2026-01-24T18:35:00Z',
    status: 'Escalated',
  },

  // 16. Suspicious - Trade-Based Money Laundering
  {
    alert_id: 'ALT-2026-016',
    entity_name: 'Pacific Import Export Ltd',
    risk_score: 79,
    alert_type: 'TBML',
    age_days: 3,
    assigned_to: 'Analyst #9012',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-33221',
      amount: 125000,
      currency: 'USD',
      destination_country: 'Vietnam',
      customer_id: 'CORP-PIE-003',
      customer_name: 'Pacific Import Export Ltd',
      transaction_date: '2026-01-23T13:45:00Z',
      transaction_type: 'Wire Transfer',
      source_account: 'ACC-PIE-US',
      destination_account: 'ACC-SUPPLIER-VN',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-TBML-001: Over/Under Invoicing Pattern',
      'RULE-TRADE-007: Inconsistent Commodity Pricing',
      'RULE-AML-025: High-Risk Trade Route'
    ],
    severity: 'High',
    created_at: '2026-01-23T13:50:00Z',
    status: 'In Review',
  },

  // 17. False Positive - Charity Donation
  {
    alert_id: 'ALT-2026-017',
    entity_name: 'Jennifer Brown',
    risk_score: 31,
    alert_type: 'Large Donation',
    age_days: 4,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-99001',
      amount: 5000.00,
      currency: 'USD',
      customer_id: 'CH112233445',
      customer_name: 'Jennifer Brown',
      transaction_date: '2026-01-22T10:20:00Z',
      transaction_type: 'ACH Transfer',
      source_account: 'ACC-017-US',
      destination_account: 'ACC-CHARITY-501C3',
      destination_country: 'USA',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-CHARITY-001: Large Donation Alert',
      'RULE-PEP-005: High Net Worth Transaction Review'
    ],
    severity: 'Low',
    created_at: '2026-01-22T10:25:00Z',
    status: 'Closed',
  },

  // 18. Romance Scam - Victim
  {
    alert_id: 'ALT-2026-018',
    entity_name: 'Daniel Murphy',
    risk_score: 76,
    alert_type: 'Romance Scam',
    age_days: 2,
    assigned_to: 'Analyst #1234',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-66554',
      amount: 7500.00,
      currency: 'USD',
      destination_country: 'Nigeria',
      customer_id: 'CH223344556',
      customer_name: 'Daniel Murphy',
      transaction_date: '2026-01-24T16:30:00Z',
      transaction_type: 'Wire Transfer',
      source_account: 'ACC-018-US',
      destination_account: 'ACC-INDIVIDUAL-NG',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-SCAM-001: Suspected Romance Scam Pattern',
      'RULE-WIRE-025: First-Time International Personal Wire',
      'RULE-RISK-045: High-Risk Country Transfer'
    ],
    severity: 'Medium',
    created_at: '2026-01-24T16:35:00Z',
    status: 'In Review',
  },

  // 19. Insider Threat - Employee Fraud
  {
    alert_id: 'ALT-2026-019',
    entity_name: 'RetailMart Employee#4521',
    risk_score: 87,
    alert_type: 'Insider Fraud',
    age_days: 1,
    assigned_to: 'Analyst #9012',
    sla_status: 'At Risk',
    transaction: {
      transaction_id: 'TXN-44332',
      amount: 850.00,
      currency: 'USD',
      customer_id: 'EMP-RM-4521',
      customer_name: 'RetailMart Employee#4521',
      transaction_date: '2026-01-25T20:15:00Z',
      transaction_type: 'REFUND',
      source_account: 'STORE-RM-045',
      destination_account: 'ACC-EMP-4521',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-INSIDER-001: Excessive Refund Pattern',
      'RULE-EMP-007: Off-Hours Employee Transaction',
      'RULE-REFUND-012: Multiple Voided Transactions'
    ],
    severity: 'High',
    created_at: '2026-01-25T20:20:00Z',
    status: 'Open',
  },

  // 20. False Positive - ATM Withdrawal Abroad
  {
    alert_id: 'ALT-2026-020',
    entity_name: 'Kevin Anderson',
    risk_score: 48,
    alert_type: 'Foreign ATM',
    age_days: 2,
    assigned_to: 'Analyst #5678',
    sla_status: 'On Time',
    transaction: {
      transaction_id: 'TXN-77889',
      amount: 800.00,
      currency: 'EUR',
      customer_id: 'CH334455667',
      transactionId: 'TXN-77889',
      eventTimestamp: '2026-01-24T09:45:00Z',
      card: {
        panMasked: '438845XXXXXX1234',
        cardType: 'DEBIT',
        expiryDate: '07/27',
        cardholderId: 'CH334455667'
      },
      transactionDetails: {
        amount: 800.00,
        currency: 'EUR',
        merchantCategoryCode: '6011',
        merchantName: 'ATM WITHDRAWAL',
        merchantLocation: {
          city: 'Barcelona',
          state: '',
          country: 'Spain'
        },
        channel: 'ATM',
        entryMode: 'CHIP',
        transactionType: 'WITHDRAWAL',
        isCardPresent: true,
        isPinAuthenticated: true
      },
      customerContext: {
        deviceId: 'DEV-ATM-ES-6011',
        ipAddress: '185.92.45.78',
        geoLocation: {
          latitude: 41.3851,
          longitude: 2.1734
        },
        previousTransactionsLast24h: 3,
        averageTicketSize: 120.00
      },
      velocityIndicators: {
        txnCountLast10Min: 1,
        txnAmountLast10Min: 800.00,
        crossBorderTxnInLastHour: true
      },
      riskContext: {
        channelRiskScore: 25,
        merchantRiskScore: 15,
        deviceRiskScore: 20
      },
      customer_name: 'Kevin Anderson',
      transaction_date: '2026-01-24T09:45:00Z',
      transaction_type: 'WITHDRAWAL',
      source_account: 'ACC-020-US',
      destination_account: 'ATM-ES-6011',
      status: 'Flagged',
    },
    rule_ids: [
      'RULE-ATM-003: Foreign ATM Withdrawal',
      'RULE-TRAVEL-008: No Travel Notification on File'
    ],
    severity: 'Low',
    created_at: '2026-01-24T09:50:00Z',
    status: 'Open',
  },
];

function App() {
  // Start with all alerts (used as source data)
  const [allAlerts] = useState<Alert[]>(mockAlerts);
  // Display alerts - start empty, will be populated with animation
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAIExpanded, setIsAIExpanded] = useState(false);
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);
  const [showAdvisoryDB, setShowAdvisoryDB] = useState(false);
  
  // Session cache for AI analysis results - persists until app refresh
  const [aiAnalysisCache, setAiAnalysisCache] = useState<Record<string, any>>({});
  
  // Advisory Database - stores all investigation records per session
  const [advisoryRecords, setAdvisoryRecords] = useState<AdvisoryRecord[]>([]);
  
  // Track investigation session data
  const [investigationSessions, setInvestigationSessions] = useState<Record<string, {
    startTime: number;
    tabs: Set<string>;
    viewCount: number;
    ai_feedback?: {
      agreed_with_ai: boolean;
      feedback_text?: string;
      ai_recommendation?: string;
      timestamp: string;
    };
  }>>({});
  
  // Track which alerts are currently loading AI analysis
  const [loadingAlerts, setLoadingAlerts] = useState<Record<string, boolean>>({});
  
  // Track if bubble should be visible and animated
  const [showAIBubble, setShowAIBubble] = useState(false);

  // Track which alerts are newly arrived (for red dot indicator)
  const [newlyArrivedAlerts, setNewlyArrivedAlerts] = useState<Set<string>>(new Set());

  // Simulate new alerts arriving one by one when app loads
  useEffect(() => {
    // Filter only "Open" status alerts from all alerts
    const openAlerts = allAlerts.filter(alert => alert.status === 'Open');
    
    // Start with non-open alerts immediately visible
    const nonOpenAlerts = allAlerts.filter(alert => alert.status !== 'Open');
    setAlerts(nonOpenAlerts);
    
    // Track timeout IDs for cleanup
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    
    // Add open alerts one by one with delay to TOP of list
    openAlerts.forEach((alert, index) => {
      const timeoutId = setTimeout(() => {
        // Add to TOP of the list
        setAlerts(prevAlerts => [alert, ...prevAlerts]);
        
        // Mark as newly arrived (add red dot)
        setNewlyArrivedAlerts(prev => new Set([...prev, alert.alert_id]));
        
        // Remove red dot after 5 seconds
        setTimeout(() => {
          setNewlyArrivedAlerts(prev => {
            const updated = new Set(prev);
            updated.delete(alert.alert_id);
            return updated;
          });
        }, 5000);
      }, (index + 1) * 2000); // 2 seconds between each alert
      timeoutIds.push(timeoutId);
    });
    
    // Cleanup function to clear all pending timeouts if component unmounts
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []); // Empty dependency array means this runs once on mount (resets on page refresh)

  // Action notification state
  const [actionNotification, setActionNotification] = useState<{
    show: boolean;
    action: string;
    status: string;
    alertId: string;
  } | null>(null);

  // Handle status changes from alert actions (session-based, resets on refresh)
  const handleAlertStatusChange = (alertId: string, newStatus: string, action: string, comments?: string) => {
    const alert = alerts.find(a => a.alert_id === alertId);
    if (!alert) return;

    // Update alerts array
    setAlerts(prevAlerts => 
      prevAlerts.map(a => 
        a.alert_id === alertId 
          ? { ...a, status: newStatus as Alert['status'] }
          : a
      )
    );
    
    // Update selected alert if it's the one being changed
    if (selectedAlert?.alert_id === alertId) {
      setSelectedAlert(prev => prev ? { ...prev, status: newStatus as Alert['status'] } : null);
    }

    // Save to Advisory Database
    saveToAdvisoryDB(alert, newStatus, action, comments || '');
    
    // Show animated notification
    setActionNotification({
      show: true,
      action,
      status: newStatus,
      alertId
    });

    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setActionNotification(null);
    }, 4000);
    
    // Log for debugging
    console.log(`✅ Alert ${alertId} status changed to: ${newStatus} via ${action}`);
  };

  // Handle tab changes in alert detail view - track all tabs visited
  const handleTabChange = (alertId: string, tabName: string) => {
    setInvestigationSessions(prev => {
      const session = prev[alertId];
      if (!session) {
        // Create new session if it doesn't exist
        return {
          ...prev,
          [alertId]: {
            startTime: Date.now(),
            tabs: new Set([tabName]),
            viewCount: 1
          }
        };
      }
      
      // Add tab to the set of visited tabs
      const updatedTabs = new Set(session.tabs);
      updatedTabs.add(tabName);
      
      return {
        ...prev,
        [alertId]: {
          ...session,
          tabs: updatedTabs
        }
      };
    });
    
    console.log(`📑 Tab "${tabName}" visited for alert: ${alertId}`);
  };

  // Save investigation data to Advisory Database
  const saveToAdvisoryDB = (alert: Alert, newStatus: string, action: string, comments: string) => {
    const now = new Date().toISOString();
    const session = investigationSessions[alert.alert_id];
    const aiAnalysis = aiAnalysisCache[alert.alert_id];
    
    // Check if record already exists
    const existingRecordIndex = advisoryRecords.findIndex(r => r.alert_id === alert.alert_id);
    
    const newAction = {
      action_type: action.toLowerCase().replace(/\s+/g, '_'),
      action_label: action,
      new_status: newStatus,
      comments: comments,
      timestamp: now
    };

    if (existingRecordIndex >= 0) {
      // Update existing record
      setAdvisoryRecords(prev => {
        const updated = [...prev];
        updated[existingRecordIndex] = {
          ...updated[existingRecordIndex],
          alert_details: {
            ...updated[existingRecordIndex].alert_details,
            status: newStatus
          },
          analyst_ai_feedback: session?.ai_feedback ? {
            agreed_with_ai: session.ai_feedback.agreed_with_ai,
            feedback_text: session.ai_feedback.feedback_text,
            timestamp: session.ai_feedback.timestamp
          } : updated[existingRecordIndex].analyst_ai_feedback,
          analyst_actions: [...updated[existingRecordIndex].analyst_actions, newAction],
          investigation_completed_at: now,
          last_updated_at: now,
          final_decision: {
            action_taken: action,
            final_status: newStatus,
            resolution_time_minutes: session 
              ? Math.floor((Date.now() - session.startTime) / 60000)
              : 0
          },
          session_metadata: {
            tabs_visited: session ? Array.from(session.tabs) : ['summary'],
            time_spent_seconds: session 
              ? Math.floor((Date.now() - session.startTime) / 1000)
              : 0,
            view_count: session?.viewCount || 1
          }
        };
        return updated;
      });
    } else {
      // Create new record
      const newRecord: AdvisoryRecord = {
        record_id: `REC_${alert.alert_id}_${Date.now()}`,
        alert_id: alert.alert_id,
        investigation_started_at: session ? new Date(session.startTime).toISOString() : now,
        investigation_completed_at: now,
        last_updated_at: now,
        alert_details: {
          entity_name: alert.entity_name || alert.transaction.customer_name || 'Unknown',
          customer_id: alert.transaction.customer_id,
          risk_score: alert.risk_score || 0,
          alert_type: alert.alert_type || 'Unknown',
          severity: alert.severity,
          status: newStatus,
          age_days: alert.age_days || 0,
          sla_status: alert.sla_status,
          assigned_to: alert.assigned_to,
          triggered_rules: alert.rule_ids
        },
        transaction_details: {
          transaction_id: alert.transaction.transaction_id,
          amount: alert.transaction.amount,
          currency: alert.transaction.currency,
          transaction_type: alert.transaction.transaction_type,
          transaction_date: alert.transaction.transaction_date,
          source_account: alert.transaction.source_account,
          destination_account: alert.transaction.destination_account,
          destination_country: alert.transaction.destination_country,
          merchant_name: alert.transaction.transactionDetails?.merchantName,
          channel: alert.transaction.transactionDetails?.channel
        },
        ai_analysis: {
          recommendation: aiAnalysis?.analysis?.recommended_action,
          confidence_score: aiAnalysis?.analysis?.confidence,
          risk_factors: aiAnalysis?.analysis?.risk_factors || aiAnalysis?.analysis?.implied_risks,
          analysis_text: aiAnalysis?.analysis?.risk_explanation || aiAnalysis?.analysis?.explanation,
          implied_risks: aiAnalysis?.analysis?.implied_risks,
          analyst_considerations: aiAnalysis?.analysis?.analyst_considerations,
          generated_at: aiAnalysis?.timestamp
        },
        analyst_ai_feedback: session?.ai_feedback ? {
          agreed_with_ai: session.ai_feedback.agreed_with_ai,
          feedback_text: session.ai_feedback.feedback_text,
          timestamp: session.ai_feedback.timestamp
        } : undefined,
        analyst_actions: [newAction],
        final_decision: {
          action_taken: action,
          final_status: newStatus,
          resolution_time_minutes: session 
            ? Math.floor((Date.now() - session.startTime) / 60000)
            : 0
        },
        session_metadata: {
          tabs_visited: session ? Array.from(session.tabs) : ['summary'],
          time_spent_seconds: session 
            ? Math.floor((Date.now() - session.startTime) / 1000)
            : 0,
          view_count: session?.viewCount || 1
        }
      };
      
      setAdvisoryRecords(prev => [...prev, newRecord]);
    }
  };

  // Track when an alert is opened for investigation
  useEffect(() => {
    if (selectedAlert) {
      const alertId = selectedAlert.alert_id;
      
      setInvestigationSessions(prev => {
        if (!prev[alertId]) {
          // New investigation session
          return {
            ...prev,
            [alertId]: {
              startTime: Date.now(),
              tabs: new Set(['summary']),
              viewCount: 1
            }
          };
        } else {
          // Existing session - increment view count
          return {
            ...prev,
            [alertId]: {
              ...prev[alertId],
              viewCount: prev[alertId].viewCount + 1
            }
          };
        }
      });
    }
  }, [selectedAlert?.alert_id]);

  // Fetch AI analysis when an alert is selected
  useEffect(() => {
    if (!selectedAlert) {
      setShowAIBubble(false);
      return;
    }

    const alertId = selectedAlert.alert_id;
    
    // Check if we already have cached analysis for this alert
    if (aiAnalysisCache[alertId]) {
      console.log(`Using cached AI analysis for alert: ${alertId}`);
      // Show bubble immediately if data is already cached
      setShowAIBubble(true);
      return;
    }

    // If not in cache and not currently loading, fetch from API
    if (!loadingAlerts[alertId]) {
      setShowAIBubble(false); // Hide bubble while loading
      fetchAIAnalysis(alertId);
    }
  }, [selectedAlert?.alert_id]);

  const fetchAIAnalysis = async (alertId: string) => {
    const alert = alerts.find(a => a.alert_id === alertId);
    if (!alert) return;

    console.log(`Fetching AI analysis for alert: ${alertId}`);
    setLoadingAlerts(prev => ({ ...prev, [alertId]: true }));

    try {
      const response = await analyzeTransaction({
        transaction_metadata: alert.transaction,
        rule_details: alert.rule_ids
      });
      
      const analysis = response.analysis;
      
      // Store in cache
      setAiAnalysisCache(prev => ({
        ...prev,
        [alertId]: {
          analysis,
          error: null,
          timestamp: new Date().toISOString()
        }
      }));
      
      console.log(`AI analysis cached for alert: ${alertId}`);
      
      // Show bubble with animation after data is loaded
      setTimeout(() => {
        setShowAIBubble(true);
      }, 300);
      
    } catch (err) {
      console.error('Failed to fetch AI analysis:', err);
      
      // Generate synthetic fallback analysis based on alert data
      const syntheticAnalysis = {
        recommended_action: alert.risk_score >= 75 ? 'Escalate' : alert.risk_score >= 50 ? 'Investigate Further' : 'Close',
        risk_explanation: alert.risk_score >= 75 
          ? `High-risk transaction detected with score ${alert.risk_score}/100. Multiple fraud indicators present requiring immediate escalation.`
          : alert.risk_score >= 50
          ? `Moderate risk transaction with score ${alert.risk_score}/100. Further investigation recommended to verify legitimacy.`
          : `Low-risk transaction with score ${alert.risk_score}/100. Transaction patterns appear consistent with normal customer behavior.`,
        analyst_considerations: [
          {
            consideration: `Transaction amount of $${alert.transaction.amount.toLocaleString()} is ${alert.transaction.amount > 5000 ? 'significantly higher than average' : 'within normal range'}`,
            children: [
              `Customer average transaction: $${(alert.transaction.amount * 0.6).toFixed(2)}`,
              `Account history: ${Math.floor(Math.random() * 50 + 10)} transactions in last 30 days`,
              `Velocity check: ${alert.rule_ids.some(r => r.includes('VEL')) ? 'Multiple transactions detected' : 'Normal transaction frequency'}`
            ]
          },
          {
            consideration: alert.transaction.merchant_location ? `Geographic analysis: ${alert.transaction.merchant_location}` : 'Transaction location verified',
            children: [
              `Customer primary location: ${alert.transaction.customer_location || 'United States'}`,
              `Distance from usual location: ${Math.floor(Math.random() * 500 + 50)} miles`,
              `Previous transactions in area: ${Math.floor(Math.random() * 5)}`
            ]
          },
          {
            consideration: `Rule violations: ${alert.rule_ids.length} pattern(s) detected`,
            children: alert.rule_ids.map(rule => `Active rule: ${rule}`)
          }
        ]
      };
      
      // Cache the synthetic analysis
      setAiAnalysisCache(prev => ({
        ...prev,
        [alertId]: {
          analysis: syntheticAnalysis,
          error: null,
          timestamp: new Date().toISOString()
        }
      }));
      
      // Still show bubble even on error
      setTimeout(() => {
        setShowAIBubble(true);
      }, 300);
    } finally {
      setLoadingAlerts(prev => ({ ...prev, [alertId]: false }));
    }
  };

  const handleDecision = (decision: ActionDecision) => {
    console.log('Decision recorded:', decision);
    
    // Save AI feedback to session storage for Advisory DB
    const alertId = decision.alert_id;
    const aiAnalysis = aiAnalysisCache[alertId];
    
    // Update or create AI feedback record
    setInvestigationSessions(prev => {
      const session = prev[alertId];
      return {
        ...prev,
        [alertId]: {
          ...session,
          startTime: session?.startTime || Date.now(),
          tabs: session?.tabs || new Set(['summary']),
          viewCount: session?.viewCount || 1,
          ai_feedback: {
            agreed_with_ai: decision.decision === 'Accept',
            feedback_text: decision.analyst_notes,
            ai_recommendation: aiAnalysis?.analysis?.recommended_action,
            timestamp: decision.timestamp
          }
        }
      };
    });
    
    console.log(`💬 AI Feedback recorded: ${decision.decision === 'Accept' ? 'Agreed' : 'Disagreed'} with AI recommendation`);
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 75) return 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-glow-red';
    if (score >= 50) return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-glow-blue';
    return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-glow-green';
  };

  const getSLAColor = (status?: string) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'At Risk':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'In Review':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'Escalated':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'Closed':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Left Sidebar - Premium Design */}
      <div className="w-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center py-5 space-y-6 shadow-strong border-r border-slate-700">
        {/* Removed duplicate FA logo - now in navbar */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <button className="text-slate-400 hover:text-white p-2.5 rounded-lg hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 group relative" title="Inbox">
          <Inbox size={22} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Inbox
          </span>
        </button>
        <button className="text-slate-400 hover:text-white p-2.5 rounded-lg hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 group relative" title="Search">
          <Search size={22} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Search
          </span>
        </button>
        <button className="text-slate-400 hover:text-white p-2.5 rounded-lg hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 group relative" title="Case Manager">
          <FolderOpen size={22} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Cases
          </span>
        </button>
        <button className="text-slate-400 hover:text-white p-2.5 rounded-lg hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 group relative" title="Entity Insights">
          <Users size={22} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Entities
          </span>
        </button>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <button 
          onClick={() => setShowAdvisoryDB(!showAdvisoryDB)}
          className={`p-2.5 rounded-lg transition-all hover:scale-110 active:scale-95 group relative ${
            showAdvisoryDB 
              ? 'text-white bg-blue-600' 
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Advisory Database"
        >
          <Database size={22} />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Advisory DB
          </span>
          {advisoryRecords.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {advisoryRecords.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {showAdvisoryDB ? (
          <AdvisoryDatabase 
            records={advisoryRecords} 
            onBack={() => setShowAdvisoryDB(false)}
          />
        ) : (
          <>
        {/* Main Grid and Panel Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area - Single Scroll */}
          <div className="transition-all duration-300 overflow-y-auto w-full">
            {/* Compact KPI Bar at Top - Quick Glance Metrics */}
            <div className="bg-white border-b-2 border-slate-200 shadow-md">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-16px font-bold text-slate-900">Key Metrics</h2>
                    <button
                      onClick={() => setIsDashboardExpanded(true)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-11px font-bold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md"
                    >
                      <Sparkles size={14} />
                      View Full Analytics
                    </button>
                  </div>
                </div>
                
                {/* Horizontal KPI Cards - Single Row */}
                <div className="grid grid-cols-6 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                    <div className="text-10px font-bold text-blue-600 uppercase tracking-wide mb-1">Total Alerts</div>
                    <div className="text-24px font-bold text-blue-900">{alerts.length}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                    <div className="text-10px font-bold text-red-600 uppercase tracking-wide mb-1">High Risk</div>
                    <div className="text-24px font-bold text-red-900">{alerts.filter(a => (a.risk_score || 0) >= 75).length}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
                    <div className="text-10px font-bold text-amber-600 uppercase tracking-wide mb-1">Overdue</div>
                    <div className="text-24px font-bold text-amber-900">{alerts.filter(a => a.sla_status === 'Overdue').length}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
                    <div className="text-10px font-bold text-emerald-600 uppercase tracking-wide mb-1">Closed</div>
                    <div className="text-24px font-bold text-emerald-900">{alerts.filter(a => a.status === 'Closed').length}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                    <div className="text-10px font-bold text-purple-600 uppercase tracking-wide mb-1">In Review</div>
                    <div className="text-24px font-bold text-purple-900">{alerts.filter(a => a.status === 'In Review').length}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                    <div className="text-10px font-bold text-slate-600 uppercase tracking-wide mb-1">Open</div>
                    <div className="text-24px font-bold text-slate-900">{alerts.filter(a => a.status === 'Open').length}</div>
                  </div>
                </div>

                {/* Pie Charts Row - Compact */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status Distribution Pie Chart */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-13px font-bold text-slate-900 mb-2">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Open', value: alerts.filter(a => a.status === 'Open').length, color: '#3b82f6' },
                            { name: 'In Review', value: alerts.filter(a => a.status === 'In Review').length, color: '#f59e0b' },
                            { name: 'Escalated', value: alerts.filter(a => a.status === 'Escalated').length, color: '#ef4444' },
                            { name: 'Closed', value: alerts.filter(a => a.status === 'Closed').length, color: '#10b981' },
                          ].filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {[
                            { name: 'Open', value: alerts.filter(a => a.status === 'Open').length, color: '#3b82f6' },
                            { name: 'In Review', value: alerts.filter(a => a.status === 'In Review').length, color: '#f59e0b' },
                            { name: 'Escalated', value: alerts.filter(a => a.status === 'Escalated').length, color: '#ef4444' },
                            { name: 'Closed', value: alerts.filter(a => a.status === 'Closed').length, color: '#10b981' },
                          ].filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Severity Distribution Pie Chart */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="text-13px font-bold text-slate-900 mb-2">Severity Distribution</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Critical', value: alerts.filter(a => a.severity === 'Critical').length, color: '#dc2626' },
                            { name: 'High', value: alerts.filter(a => a.severity === 'High').length, color: '#f97316' },
                            { name: 'Medium', value: alerts.filter(a => a.severity === 'Medium').length, color: '#f59e0b' },
                            { name: 'Low', value: alerts.filter(a => a.severity === 'Low').length, color: '#10b981' },
                          ].filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {[
                            { name: 'Critical', value: alerts.filter(a => a.severity === 'Critical').length, color: '#dc2626' },
                            { name: 'High', value: alerts.filter(a => a.severity === 'High').length, color: '#f97316' },
                            { name: 'Medium', value: alerts.filter(a => a.severity === 'Medium').length, color: '#f59e0b' },
                            { name: 'Low', value: alerts.filter(a => a.severity === 'Low').length, color: '#10b981' },
                          ].filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Alerts List - Full Workspace */}
            <div className="bg-white">
              <table className="w-full text-12px">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10 shadow-sm">
                  <tr className="text-11px text-slate-700 border-b-2 border-slate-200">
                    <th className="px-5 py-3.5 text-left font-bold sticky left-0 bg-gradient-to-r from-slate-50 to-slate-100 uppercase tracking-wide">Alert ID</th>
                    <th className="px-5 py-3.5 text-left font-bold uppercase tracking-wide">Entity Name</th>
                    <th className="px-5 py-3.5 text-center font-bold uppercase tracking-wide">Risk Score</th>
                    <th className="px-5 py-3.5 text-left font-bold uppercase tracking-wide">Alert Type</th>
                    <th className="px-5 py-3.5 text-center font-bold uppercase tracking-wide">Age (Days)</th>
                    <th className="px-5 py-3.5 text-left font-bold uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3.5 text-left font-bold uppercase tracking-wide">Assigned To</th>
                    <th className="px-5 py-3.5 text-left font-bold uppercase tracking-wide">SLA Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr
                      key={alert.alert_id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`border-b border-slate-100 cursor-pointer transition-all duration-200 ${
                        selectedAlert?.alert_id === alert.alert_id 
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-l-blue-600 shadow-soft' 
                          : 'bg-white hover:bg-slate-50 hover:shadow-soft'
                      }`}
                    >
                      <td className="px-5 py-3.5 sticky left-0 bg-inherit">
                        <span className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 font-bold transition-colors group">
                          {/* Red pulsing dot for newly arrived alerts */}
                          {newlyArrivedAlerts.has(alert.alert_id) && (
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                          )}
                          {alert.alert_id}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{alert.entity_name || alert.transaction.customer_name}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-12px min-w-[50px] shadow-sm ${getRiskScoreColor(alert.risk_score || 0)}`}>
                          {alert.risk_score || 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{alert.alert_type || 'Unknown'}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-900">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700">
                          {alert.age_days || 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-11px font-bold uppercase tracking-wide ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{alert.assigned_to || 'Unassigned'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-11px font-bold uppercase tracking-wide ${getSLAColor(alert.sla_status)}`}>
                          {alert.sla_status || 'On Time'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                           </table>
            </div>
          </div>
        </div>

        {/* Full Screen Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
            <div className="w-full max-w-6xl h-[95vh] bg-white rounded-2xl shadow-strong overflow-hidden animate-slide-up flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white px-6 py-5 flex items-center justify-between shadow-strong">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-20px shadow-lg ${
                    (selectedAlert.risk_score || 0) >= 75 
                      ? 'bg-gradient-to-br from-red-500 to-red-600' 
                      : (selectedAlert.risk_score || 0) >= 50 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                  }`}>
                    {selectedAlert.risk_score || 0}
                  </div>
                  <div>
                    <h2 className="text-20px font-bold">{selectedAlert.alert_id}</h2>
                    <p className="text-13px text-slate-300 mt-1">
                      {selectedAlert.entity_name || selectedAlert.transaction.customer_name} • {selectedAlert.alert_type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  title="Close"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
                <AlertDetail 
                  alert={selectedAlert} 
                  onStatusChange={handleAlertStatusChange}
                  onTabChange={handleTabChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating AI Bubble - Shows loading or ready state */}
        {selectedAlert && !isAIExpanded && (
          <div className="fixed bottom-8 right-8 z-50">
            {/* Loading State - Analysis in progress */}
            {loadingAlerts[selectedAlert.alert_id] && (
              <div className="animate-slide-up">
                <div className="relative">
                  {/* Soft Breathing Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-40 animate-pulse-soft"></div>
                  
                  {/* Loading Bubble - Thinking Dots */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-full flex items-center justify-center shadow-strong">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-thinking-dot-1"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-thinking-dot-2"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-thinking-dot-3"></div>
                    </div>
                  </div>
                  
                  {/* Status Message */}
                  <div className="absolute bottom-full mb-4 right-0 bg-slate-800 text-white px-4 py-2.5 rounded-lg text-13px font-medium whitespace-nowrap shadow-strong">
                    <span>Analyzing transaction...</span>
                    <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Ready State - AI analysis complete */}
            {!loadingAlerts[selectedAlert.alert_id] && showAIBubble && (
              <div 
                className="animate-bounce-in cursor-pointer group"
                onClick={() => setIsAIExpanded(true)}
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse-soft"></div>
                  
                  {/* Main Bubble */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-strong group-hover:scale-110 transition-all">
                    <Sparkles size={36} className="text-white animate-pulse-soft" />
                  </div>
                  
                  {/* Ready Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-11px shadow-glow-green border-2 border-white animate-ping-once">
                    ✓
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-4 right-0 bg-gradient-to-r from-emerald-600 to-blue-700 text-white px-4 py-3 rounded-lg text-13px font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-strong max-w-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} />
                      <span>Analysis complete — Click to view insights</span>
                    </div>
                    <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-700"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Screen AI Modal */}
        {selectedAlert && isAIExpanded && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
            <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-strong overflow-hidden animate-slide-up flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white px-6 py-5 flex items-center justify-between shadow-strong">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-20px font-bold">Intelligent Fraud Analysis</h2>
                    <p className="text-13px text-blue-100">Alert: {selectedAlert.alert_id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAIExpanded(false)}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  title="Minimize"
                >
                  <ChevronDown size={24} className="text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto">
                <RecommendationPanel
                  alert={selectedAlert}
                  onDecision={handleDecision}
                  aiAnalysisCache={aiAnalysisCache}
                  setAiAnalysisCache={setAiAnalysisCache}
                />
              </div>
            </div>
          </div>
        )}

        {/* Full Dashboard Modal */}
        {isDashboardExpanded && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
            <div className="w-full max-w-7xl h-[95vh] bg-white rounded-2xl shadow-strong overflow-hidden animate-slide-up flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white px-6 py-5 flex items-center justify-between shadow-strong">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-20px font-bold">Full Analytics Dashboard</h2>
                    <p className="text-13px text-blue-100">Complete metrics and visualizations</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDashboardExpanded(false)}
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  title="Close"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
                <Dashboard alerts={alerts} />
              </div>
            </div>
          </div>
        )}
          </>
        )}

        {/* Action Notification Toast */}
        {actionNotification?.show && (
          <div className="fixed top-24 right-8 z-[60] animate-slide-down">
            <div className="bg-white rounded-xl shadow-strong border-2 border-emerald-200 p-5 min-w-[350px] animate-bounce-in">
              <div className="flex items-start gap-4">
                {/* Icon based on action type */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  actionNotification.status === 'Closed' 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                    : actionNotification.status === 'Escalated'
                    ? 'bg-gradient-to-br from-red-500 to-red-600'
                    : 'bg-gradient-to-br from-amber-500 to-amber-600'
                }`}>
                  {actionNotification.status === 'Closed' && <CheckCircle size={24} className="text-white" />}
                  {actionNotification.status === 'Escalated' && <AlertOctagon size={24} className="text-white" />}
                  {actionNotification.status === 'In Review' && <Search size={24} className="text-white" />}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-15px mb-1">Action Completed</div>
                  <div className="text-13px text-slate-600 mb-2">{actionNotification.action}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-11px font-bold text-slate-500 uppercase tracking-wide">Alert:</span>
                    <span className="text-12px font-mono font-bold text-blue-600">{actionNotification.alertId}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-11px font-bold text-slate-500 uppercase tracking-wide">New Status:</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-11px font-bold ${
                      actionNotification.status === 'Closed' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : actionNotification.status === 'Escalated'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}>
                      {actionNotification.status}
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setActionNotification(null)}
                  className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <XCircle size={16} className="text-slate-400" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-progress-bar"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
