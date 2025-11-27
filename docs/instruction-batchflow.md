# WBMS Batch Flow Instructions

## Overview
Complete step-by-step guide for operating the Weighing Bridge Management System (WBMS) batch workflow.

## Prerequisites
- User must be logged in with appropriate permissions
- Master data (Suppliers, Materials, Vehicles) must be available
- PostgreSQL database running
- JWT authentication active

## Batch Workflow Steps

### 1. LOGIN TO SYSTEM

**URL**: `http://localhost:3000/login`

**Default Users**:
```
Username: admin     | Password: admin123     | Role: Admin
Username: supervisor| Password: super123     | Role: Supervisor  
Username: operator  | Password: oper123      | Role: Operator
Username: viewer    | Password: view123      | Role: Viewer
```

**Steps**:
1. Enter username and password
2. Select Filter Jenis (any option)
3. Click "LOGIN"
4. System redirects to `/dashboard`

---

### 2. CREATE BATCH

**Location**: Dashboard → WeighingDisplay Component

**Required Fields**:
- **Batch Name**: Unique identifier (e.g., "BATCH-001")
- **Vehicle**: Select from dropdown
- **Supplier**: Select from dropdown  
- **Material**: Select from dropdown
- **Driver Name**: Enter driver name
- **Ticket Number**: Enter ticket number

**Steps**:
1. Fill all required fields in the form
2. Click **"CREATE BATCH"** button
3. System creates batch with status `pending`
4. **Current Batch Status** box appears showing:
   - Batch name and status "PENDING" (yellow background)
   - Vehicle and supplier information
   - Button changes to **"START WEIGHING"**

**API Call**:
```
POST /api/batch/create
{
  "batchName": "BATCH-001",
  "vehicleId": "1",
  "supplierId": "1",
  "materialId": "1", 
  "driverName": "John Doe",
  "ticketNumber": "TN-123456"
}
```

---

### 3. START WEIGHING PROCESS

**Trigger**: Click **"START WEIGHING"** button

**What Happens**:
1. Batch status changes from `pending` → `ongoing`
2. **Current Batch Status** box turns green with "ONGOING" status
3. **Weight Capture Status** box appears showing:
   - BRUTO: Waiting...
   - TARRA: Waiting...  
   - NETTO: Waiting...
4. Real-time weight simulation begins (updates every 2 seconds)
5. Button changes to **"END BATCH"**

**Weight Simulation Logic**:
- Base weight: 35,000 + random(1000) kg
- 70% chance of stable reading
- Auto-capture when stable:
  - **BRUTO**: First stable reading (vehicle + load)
  - **TARRA**: Second stable reading < 70% of BRUTO (empty vehicle)
  - **NETTO**: Automatically calculated (BRUTO - TARRA)

**API Call**:
```
POST /api/batch/start
{
  "id": 1
}
```

---

### 4. WEIGHT CAPTURE MONITORING

**During Ongoing Status**:

**Visual Indicators**:
- Main weight display shows current weight in real-time
- **STABLE/UNSTABLE** indicator shows reading stability
- **Weight Capture Status** shows progress:
  - Gray boxes: Waiting for capture
  - Green boxes: Successfully captured

**Auto-Capture Process**:
1. **BRUTO Capture**: First stable reading automatically captured
2. **TARRA Capture**: When weight drops below 70% of BRUTO and stable
3. **NETTO Calculation**: BRUTO - TARRA (automatic)

**Manual Input**:
- **Expected Netto**: Enter expected weight for shrinkage calculation
- This field is crucial for accurate shrinkage analysis

---

### 5. END BATCH PROCESS

**Trigger**: Click **"END BATCH"** button

**Prerequisites**:
- BRUTO and TARRA weights captured
- Expected Netto entered (optional but recommended)

**What Happens**:
1. Batch status changes from `ongoing` → `finished`
2. **Shrinkage Analysis** performed:
   ```
   Shrinkage Value = Expected Netto - Actual Netto
   Shrinkage % = (Shrinkage Value / Expected Netto) × 100
   Warning = Shrinkage % > 0.2%
   ```
3. **Shrinkage Analysis** box appears showing:
   - Shrinkage value in Kg
   - Shrinkage percentage
   - Warning if exceeds 0.2% threshold
4. **Current Batch Status** disappears
5. Button changes back to **"CREATE BATCH"**
6. All weight fields reset to 0

**API Call**:
```
POST /api/batch/end
{
  "id": 1,
  "expectedNetto": 20000,
  "actualNetto": 19950
}
```

---

### 6. SHRINKAGE ANALYSIS INTERPRETATION

**Green Box (Within Tolerance)**:
- Shrinkage ≤ 0.2%
- ✅ WITHIN TOLERANCE
- Normal operation

**Red Box (Warning)**:
- Shrinkage > 0.2%
- ⚠️ EXCEEDS THRESHOLD
- Potential fraud/quality issue
- Alert popup appears

**Example Calculations**:
```
Expected: 20,000 kg
Actual: 19,950 kg
Shrinkage Value: 50 kg
Shrinkage %: 0.25%
Result: WARNING (exceeds 0.2%)
```

---

### 7. ADDITIONAL FEATURES

**Vehicle History Table**:
- Shows historical weight data for selected vehicle
- Displays previous BRUTO, TARRA, NETTO values
- Updates when vehicle is selected

**Tarra History Table**:
- Shows tarra weight statistics for vehicle
- Initial, minimum, maximum tarra weights
- Helps identify vehicle weight consistency

**Weight History**:
- Real-time log of weight readings during ongoing batch
- Shows timestamp and stability status
- Limited to last 10 readings

---

### 8. WORKFLOW STATES

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   NO BATCH  │───▶│   PENDING    │───▶│   ONGOING   │───▶│   FINISHED   │
│             │    │              │    │             │    │              │
│ CREATE      │    │ START        │    │ END         │    │ CREATE NEW   │
│ BATCH       │    │ WEIGHING     │    │ BATCH       │    │ BATCH        │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

---

### 9. TROUBLESHOOTING

**Common Issues**:

1. **Button not appearing**:
   - Check user permissions (need `create_weighing`)
   - Verify login status and token validity

2. **Weight not capturing**:
   - Ensure batch status is "ongoing"
   - Wait for "STABLE" indicator
   - Check real-time simulation is running

3. **Shrinkage calculation wrong**:
   - Verify Expected Netto is entered
   - Check BRUTO and TARRA values are captured
   - Ensure NETTO = BRUTO - TARRA

4. **API errors**:
   - Check JWT token in localStorage
   - Verify database connection
   - Check console for error messages

**Debug Steps**:
1. Open browser console (F12)
2. Check for error messages
3. Verify API responses in Network tab
4. Check localStorage for token

---

### 10. PERMISSIONS REQUIRED

**By Role**:
- **Admin**: Full access to all operations
- **Supervisor**: Can create, start, and end batches
- **Operator**: Can create, start, and end batches  
- **Viewer**: Read-only access (no batch operations)

**Required Permissions**:
- `view_dashboard`: Access dashboard
- `view_weighing`: View weighing interface
- `create_weighing`: Create and manage batches

---

## Summary

The WBMS batch flow provides a complete weighing operation cycle with:
- ✅ Secure authentication and authorization
- ✅ Real-time weight simulation and capture
- ✅ Automatic shrinkage calculation and fraud detection
- ✅ Historical data tracking and analysis
- ✅ User-friendly interface with clear status indicators

Follow this guide step-by-step for successful weighing operations.