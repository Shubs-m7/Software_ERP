import { Project } from "@/types/project"
import { Partner } from "@/types/partner"
import { LedgerGroup } from "@/types/ledger-group"
import { Ledger } from "@/types/ledger"
import { CostCentre } from "@/types/cost-centre"
import { UnifiedTransaction } from "@/types/unified-transaction"
import { User, UserRole } from "@/types/user"
import { Voucher } from "@/types/voucher"

export const parkingDashboardData = {
  stats: [
    { title: "Total Collection", value: "₹4,25,000", change: "+12.5%", trend: "up" },
    { title: "Cash", value: "₹1,85,000", change: "+5.2%", trend: "up" },
    { title: "UPI", value: "₹2,40,000", change: "+18.1%", trend: "up" },
    { title: "Expenses", value: "₹42,500", change: "-2.1%", trend: "down" },
    { title: "Cash in Hand", value: "₹1,42,500", change: "+4.3%", trend: "up" },
  ],
  collectionTrend: [
    { name: "Mon", amount: 45000 },
    { name: "Tue", amount: 52000 },
    { name: "Wed", amount: 48000 },
    { name: "Thu", amount: 61000 },
    { name: "Fri", amount: 55000 },
    { name: "Sat", amount: 82000 },
    { name: "Sun", amount: 82500 },
  ],
  expenseTrend: [
    { name: "Mon", amount: 5000 },
    { name: "Tue", amount: 4500 },
    { name: "Wed", amount: 6200 },
    { name: "Thu", amount: 5800 },
    { name: "Fri", amount: 7100 },
    { name: "Sat", amount: 7500 },
    { name: "Sun", amount: 6400 },
  ],
  siteWiseCollection: [
    { name: "Terminal-1", amount: 150000 },
    { name: "Terminal-2", amount: 125000 },
    { name: "City Mall", amount: 85000 },
    { name: "Railway PK", amount: 65000 },
  ],
  monthWisePnL: [
    { name: "Jan", amount: 450000 },
    { name: "Feb", amount: 520000 },
    { name: "Mar", amount: 480000 },
    { name: "Apr", amount: 610000 },
  ]
}

export const baluDashboardData = {
  stats: [
    { title: "Total Dispatch", value: "1,250", unit: "Tons", change: "+8.4%", trend: "up" },
    { title: "Total Billing", value: "₹24,50,000", change: "+12.1%", trend: "up" },
    { title: "Cash Received", value: "₹18,20,000", change: "+5.7%", trend: "up" },
    { title: "Outstanding", value: "₹6,30,000", change: "-2.3%", trend: "down" },
    { title: "Net Profit", value: "₹4,85,000", change: "+15.3%", trend: "up" },
  ],
  dispatchTrend: [
    { name: "Mon", tons: 120 },
    { name: "Tue", tons: 150 },
    { name: "Wed", tons: 180 },
    { name: "Thu", tons: 160 },
    { name: "Fri", tons: 210 },
    { name: "Sat", tons: 190 },
    { name: "Sun", tons: 240 },
  ],
  billingVsCollection: [
    { name: "Mon", billing: 45000, collection: 38000 },
    { name: "Tue", billing: 52000, collection: 48000 },
    { name: "Wed", billing: 48000, collection: 50000 },
    { name: "Thu", billing: 61000, collection: 55000 },
    { name: "Fri", billing: 55000, collection: 52000 },
    { name: "Sat", billing: 82000, collection: 75000 },
    { name: "Sun", billing: 82500, collection: 80000 },
  ]
}


export const projectsData: Project[] = [
  {
    id: "p1",
    name: "City Mall Underground Parking",
    type: "PARKING",
    startDate: "2024-01-15",
    status: "Active",
    reportingMode: "Non-Cost Centre",
  },
  {
    id: "p2",
    name: "Hubli Construction Site",
    type: "BALU",
    startDate: "2024-03-10",
    status: "Active",
    reportingMode: "Cost Centre",
  },
  {
    id: "p3",
    name: "Airport Terminal-1 Parking",
    type: "PARKING",
    startDate: "2023-11-20",
    status: "Active",
    reportingMode: "Non-Cost Centre",
  },
  {
    id: "p4",
    name: "Gandhinagar Site-A",
    type: "BALU",
    startDate: "2024-04-01",
    status: "Inactive",
    reportingMode: "Non-Cost Centre",
  },
]

export const partnersData: Partner[] = [
  { id: "par1", name: "Steel Corp India", mobile: "9876543210", email: "rajesh@steelcorp.in", shareRatio: 40, openingCapital: 500000, status: "Active" },
  { id: "par2", name: "Global Logistics", mobile: "8765432109", email: "amit@globallog.com", shareRatio: 30, openingCapital: 250000, status: "Active" },
  { id: "par3", name: "Quick Services", mobile: "7654321098", email: "sneha@quick.com", shareRatio: 30, openingCapital: 100000, status: "Inactive" },
]

export const ledgerGroupsData: LedgerGroup[] = [
  { id: "lg1", name: "Direct Income - Sales", nature: "Income", status: "Active", reportCategory: "Direct Income", isDirect: true, displayOrder: 1 },
  { id: "lg2", name: "Other Income", nature: "Income", status: "Active", reportCategory: "Indirect Income", isDirect: false, displayOrder: 2 },
  { id: "lg3", name: "Site Operational Expenses", nature: "Expense", status: "Active", reportCategory: "Direct Expense", isDirect: true, displayOrder: 3 },
  { id: "lg4", name: "Staff & Admin Expenses", nature: "Expense", status: "Active", reportCategory: "Indirect Expense", isDirect: false, displayOrder: 4 },
  { id: "lg5", name: "Furniture & Fixtures", nature: "Asset", status: "Active", reportCategory: "Asset", isDirect: false, displayOrder: 5 },
  { id: "lg6", name: "Capital Accounts", nature: "Liability", status: "Active", reportCategory: "Liability", isDirect: false, displayOrder: 6 },
]

export const ledgersData: Ledger[] = [
  { id: "l1", name: "HDFC Bank A/c", groupId: "lg1", nature: "Asset", openingBalance: 500000, balanceType: "Dr", status: "Active", type: "Bank" },
  { id: "l2", name: "Main Cash", groupId: "lg1", nature: "Asset", openingBalance: 50000, balanceType: "Dr", status: "Active", type: "Cash" },
  { id: "l3", name: "Electricity Expenses", groupId: "lg3", nature: "Expense", openingBalance: 0, balanceType: "Dr", status: "Active", type: "General", projectId: "p1" },
]

export const costCentresData: CostCentre[] = [
  { id: "cc1", name: "Marketing Dept", status: "Active", code: "MKT-01", projectId: "p1" },
  { id: "cc2", name: "Project Hubli Ops", status: "Active", code: "HBL-OP", projectId: "p2" },
  { id: "cc3", name: "HR Operations", status: "Active", code: "HR-ADM", projectId: "p1" },
]

const today = new Date().toISOString().split('T')[0]

export const dailyTransactionsData: UnifiedTransaction[] = [
  {
    id: "TX1001",
    time: "09:45 AM",
    date: today,
    type: "Collection",
    project: "City Mall Underground Parking",
    details: "Shift A Cash Collection",
    amount: 45000,
    paymentMode: "Cash",
    status: "Success",
    businessType: "PARKING"
  },
  {
    id: "TX1002",
    time: "10:20 AM",
    date: today,
    type: "Expense",
    project: "City Mall Underground Parking",
    details: "Electricity Bill - March",
    amount: 12500,
    paymentMode: "Bank Transfer",
    status: "Success",
    businessType: "PARKING"
  },
  {
    id: "TX1003",
    time: "11:15 AM",
    date: today,
    type: "Dispatch",
    project: "Hubli Construction Site",
    details: "Vehicle GJ 01 AB 1234 - 25T",
    amount: 32000,
    paymentMode: "UPI",
    status: "Pending",
    businessType: "BALU"
  },
  {
    id: "TX1004",
    time: "12:30 PM",
    date: today,
    type: "Collection",
    project: "Airport Terminal-1 Parking",
    details: "ETC Collection Batch #09",
    amount: 128000,
    paymentMode: "UPI",
    status: "Success",
    businessType: "PARKING",
    isEdited: true,
    editedBy: "Admin Priya",
    editedAt: "02:45 PM"
  },
  {
    id: "TX1005",
    time: "02:10 PM",
    date: today,
    type: "Expense",
    project: "Airport Terminal-1 Parking",
    details: "Staff Refreshments",
    amount: 850,
    paymentMode: "Cash",
    status: "Success",
    businessType: "PARKING"
  }
]

export const roles: UserRole[] = [
  {
    id: "r1",
    name: "Super Admin",
    permissions: {
      masters: { view: true, create: true, edit: true, delete: true },
      transactions: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, edit: true, delete: true },
      dashboard: { view: true, create: true, edit: true, delete: true },
      users: { view: true, create: true, edit: true, delete: true }
    },
    isActive: true
  },
  {
    id: "r2",
    name: "Site Manager",
    permissions: {
      masters: { view: true, create: false, edit: false, delete: false },
      transactions: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
      dashboard: { view: true, create: false, edit: false, delete: false },
      users: { view: false, create: false, edit: false, delete: false }
    },
    isActive: true
  }
]

export const usersData: User[] = [
  {
    id: "u1",
    name: "Aditya Sharma",
    email: "aditya@erp-enterprise.com",
    mobile: "9876543210",
    password: "password123",
    roleId: "r1",
    allowedProjectIds: [], // Empty means all for Super Admin logic or unrestricted
    isActive: true,
    createdAt: today
  },
  {
    id: "u2",
    name: "Priya Varma",
    email: "priya@erp-enterprise.com",
    mobile: "8765432109",
    password: "password123",
    roleId: "r2",
    allowedProjectIds: ["p1", "p3"], // Restricted to Parking sites
    isActive: true,
    createdAt: today
  },
  {
    id: "u3",
    name: "Rohan Das",
    email: "rohan@erp-enterprise.com",
    mobile: "7654321098",
    password: "password123",
    roleId: "r2",
    allowedProjectIds: ["p2"], // Restricted to Balu Site
    isActive: true,
    createdAt: today
  }
]

export const changeRequestsData: any[] = [
  {
    id: "cr-1",
    entryId: "tx-101",
    entryType: "Parking Entry",
    user: "Rohan Das",
    reason: "Incorrect vehicle type selected (Car instead of LCV).",
    status: "PENDING",
    requestedAt: "Today, 11:30 AM"
  },
  {
    id: "cr-2",
    entryId: "bd-502",
    entryType: "Balu Dispatch",
    user: "Meera Nair",
    reason: "Mistyped tonnage (25T instead of 2.5T).",
    status: "PENDING",
    requestedAt: "Today, 10:15 AM"
  },
  {
    id: "cr-3",
    entryId: "tx-098",
    entryType: "Parking Entry",
    user: "Rohan Das",
    reason: "Wrong payment mode selected (CASH instead of UPI).",
    status: "APPROVED",
    requestedAt: "Yesterday, 4:45 PM"
  }
]

export const vouchers: Voucher[] = []
