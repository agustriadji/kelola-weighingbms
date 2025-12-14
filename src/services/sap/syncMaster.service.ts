import { fetchJSON } from '@/utils/http';
import { materialRepository } from '@/repositories/material.repository';
import { supplierRepository } from '@/repositories/supplier.repository';
import { vehicleRepository } from '@/repositories/vehicle.repository';
import { driverRepository } from '@/repositories/driver.repository';

const SAP_URL = process.env.SAP_URL || 'http://localhost:3001/SAP';

/* ==========================
   MATERIALS SYNC
   ========================== */
export const syncMaterials = async () => {
  const repo = await materialRepository();
  const data = await fetchJSON(`${SAP_URL}/MATERIALS`);

  for (const m of data.DATA) {
    const exist = await repo.findOne({ where: { code: m.MATNR } });

    const payload = {
      code: m.MATNR,
      name: m.MAKTX,
      shrinkageThreshold: m.SHRINKAGE_TOL,
    };

    if (exist) {
      await repo.update(exist.id, payload);
    } else {
      await repo.save(repo.create(payload));
    }
  }

  console.log('[SYNC] MATERIALS UPDATED');
};

/* ==========================
   SUPPLIERS SYNC
   ========================== */
export const syncSuppliers = async () => {
  const repo = await supplierRepository();
  const data = await fetchJSON(`${SAP_URL}/SUPPLIERS`);

  for (const s of data.DATA) {
    const exist = await repo.findOne({ where: { code: s.LIFNR } });

    const payload = {
      code: s.LIFNR,
      name: s.NAME1,
    };

    if (exist) {
      await repo.update(exist.id, payload);
    } else {
      await repo.save(repo.create(payload));
    }
  }

  console.log('[SYNC] SUPPLIERS UPDATED');
};

/* ==========================
   VEHICLES SYNC
   ========================== */
export const syncVehicles = async () => {
  const repo = await vehicleRepository();
  const data = await fetchJSON(`${SAP_URL}/VEHICLES`);

  for (const v of data.DATA) {
    const exist = await repo.findOne({ where: { id: v.VEHICLE_ID } });

    const payload = {
      id: v.VEHICLE_ID,
      plateNo: v.PLATE_NO,
    };

    if (exist) {
      await repo.update(exist.id, payload);
    } else {
      await repo.save(repo.create(payload));
    }
  }

  console.log('[SYNC] VEHICLES UPDATED');
};

/* ==========================
   DRIVERS SYNC
   ========================== */
export const syncDrivers = async () => {
  const repo = await driverRepository();
  const data = await fetchJSON(`${SAP_URL}/DRIVERS`);

  for (const d of data.DATA) {
    const exist = await repo.findOne({ where: { id: d.DRIVER_ID } });

    const payload = {
      id: d.DRIVER_ID,
      name: d.NAME,
    };

    if (exist) {
      await repo.update(exist.id, payload);
    } else {
      await repo.save(repo.create(payload));
    }
  }

  console.log('[SYNC] DRIVERS UPDATED');
};
