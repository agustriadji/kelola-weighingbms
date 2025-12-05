# WBMS User Scenario Guide

Complete workflow guide for Weighing Bridge Management System operations.

## 🎯 Overview

This guide covers the complete transaction workflow from document registration to weighing operations using role-based access control.

## 👥 User Roles

| Role                 | Username            | Password  | Responsibilities                       |
| -------------------- | ------------------- | --------- | -------------------------------------- |
| Operator Registering | `operator_register` | `oper123` | Document creation & registration       |
| Operator Weighing    | `operator_weighing` | `oper123` | Weighing operations & truck processing |

## 📋 Scenario 1: Document Registration (Operator Registering)

### Step 1: Login as Operator Registering

```
URL: http://localhost:3001/login
Username: operator_register
Password: oper123
```

### Step 2: Create Transaction Documents

#### A. Create Incoming Document

1. Navigate to **Inbound** → **Incoming**
2. Click **"Create New Incoming"**
3. Fill required fields:
   ```
   Vehicle Number: B1234ABC
   Driver Name: John Doe
   Driver ID: ID123456
   Container Number: CONT001
   Transporter: PT Transport Jaya
   PO Number: PO-2024-001
   Supplier: PT Supplier ABC
   Material: Palm Oil
   DO Number: DO-001
   Seal Number: SEAL-001
   ```
4. Click **"Submit"**
5. Status: `QUEUE_IN` (truck enters parking list)

#### B. Create Outgoing Document

1. Navigate to **Inbound** → **Outgoing**
2. Click **"Create New Outgoing"**
3. Fill required fields:
   ```
   Vehicle Number: B5678DEF
   Driver Name: Jane Smith
   Transporter: PT Logistik Maju
   Contract Number: CONT-2024-001
   Relation Name: PT Customer XYZ
   Material: Refined Oil
   DO Number: DO-OUT-001
   SI Number: SI-001
   Vessel Name: MV Ocean Star
   ```
4. Click **"Submit"**
5. Status: `QUEUE_IN` (truck enters parking list)

#### C. Create Misc Document

1. Navigate to **Inbound** → **Misc**
2. Click **"Create New Misc"**
3. Fill required fields:
   ```
   Vehicle Number: B9999ZZZ
   Driver Name: Bob Wilson
   Transporter: PT Service Pro
   Material: Equipment
   DO Number: DO-MISC-001
   ```
4. Click **"Submit"**
5. Status: `QUEUE_IN` (truck enters parking list)

### Result: Trucks in Parking List

After document creation, all trucks will appear in the **Parking List** with status `QUEUE_IN`, ready for weighing operations.

---

## ⚖️ Scenario 2: Weighing Operations (Operator Weighing)

### Step 1: Login as Operator Weighing

```
URL: http://localhost:3001/login
Username: operator_weighing
Password: oper123
```

### Step 2: Access Weighing Interface

1. Navigate to **Weighing** → **Dashboard**
2. View **Truck Parking List** showing all trucks with status `QUEUE_IN`

### Step 3: Select Truck for Processing

1. From **Truck Parking List**, click **"Process"** on desired truck
2. System automatically reads transaction data:
   ```
   ✅ Vehicle Information: B1234ABC
   ✅ Driver Details: John Doe
   ✅ Material: Palm Oil
   ✅ Document: DO-001
   ✅ Transaction Type: INCOMING
   ```
3. Truck status changes to `WEIGHING_IN`
4. **Ready for weighing operations**

### Step 4: Start Weighing Process

1. Click **"START WEIGHING"** button
2. System begins real-time weight simulation:
   ```
   Current Weight: 35,247 kg
   Status: Stable ✅
   Weight Type: BRUTO
   ```
3. **Auto-capture when stable**: System automatically saves BRUTO weight
4. Truck moves to **Unloading List** with status `YARD`

### Step 5: Weighing Results

```
✅ BRUTO Weight: 35,247 kg (captured)
⏳ TARRA Weight: Pending (after unloading)
⏳ NETTO Weight: Will be calculated (BRUTO - TARRA)
```

### Current Status: Unloading Phase

- Truck is now in **Unloading List**
- Status: `YARD` (yard processing)
- Waiting for unloading completion
- Ready for TARRA weighing (Weighing Out)

---

## 🚧 Scenario 3: Weighing Out Process (In Progress)

> **Note**: Weighing Out functionality is currently under development

### Planned Workflow:

1. **After Unloading**: Truck returns for TARRA weighing
2. **Weighing Out**: Capture empty vehicle weight
3. **NETTO Calculation**: System calculates NETTO = BRUTO - TARRA
4. **Shrinkage Analysis**: Compare with expected weight
5. **Final Status**: `FINISHED` with complete weight data

---

## 📊 System Status Flow

```
Document Creation → QUEUE_IN → Parking List
       ↓
Select Truck → WEIGHING_IN → Start Weighing
       ↓
BRUTO Captured → YARD → Unloading List
       ↓
[IN PROGRESS] Weighing Out → FINISHED
```

## 🔍 Monitoring & Tracking

### Real-time Dashboard Features:

- **Live Weight Display**: Current weight with stability indicator
- **Transaction Status**: Real-time status updates
- **Queue Management**: Visual truck queue with processing order
- **Weight History**: Historical data for each vehicle
- **Shrinkage Alerts**: Automatic warnings for weight discrepancies

### Permission-Based Access:

- **Operator Registering**: Can only create and view documents
- **Operator Weighing**: Can only process weighing operations
- **Supervisors**: Can view all operations and reports
- **Admin**: Full system access and user management

## 🚨 Important Notes

1. **Role Separation**: Each role has specific permissions for security
2. **Auto-capture**: System automatically saves stable weight readings
3. **Real-time Updates**: All status changes are reflected immediately
4. **Audit Trail**: Complete logging of all operations and user actions
5. **Weight Validation**: System validates weight stability before capture

## 📞 Support

For operational issues:

- Check truck status in respective lists
- Verify user permissions for specific operations
- Contact system administrator for access issues
- Review audit logs for transaction history

---

**Last Updated**: Current system supports full INCOMING/OUTGOING/MISC registration and BRUTO weighing. TARRA weighing (Weighing Out) is in development phase.
