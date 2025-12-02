import { getDb } from '../client';
import { Supplier } from '@/entities/Supplier.entity';
import { Material } from '@/entities/Material.entity';
import { Vehicle } from '@/entities/Vehicle.entity';
import { Driver } from '@/entities/Driver.entity';
import { Weighbridge } from '@/entities/Weighbridge.entity';

export class MasterDataSeeder {
  static async run() {
    try {
      const db = await getDb();

      console.log('🌱 Starting Master Data seeding...');

      await this.seedSuppliers(db);
      await this.seedMaterials(db);
      await this.seedVehicles(db);
      await this.seedDrivers(db);
      await this.seedWeighbridges(db);

      console.log('✅ Master Data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Master Data seeding failed:', error);
      throw error;
    }
  }

  private static async seedSuppliers(db: any) {
    const repo = db.getRepository(Supplier);

    const suppliers = [
      { code: 'SUP001', name: 'PT Supplier Satu', sap_id: 'SAP001' },
      { code: 'SUP002', name: 'CV Supplier Dua', sap_id: 'SAP002' },
      { code: 'SUP003', name: 'PT Supplier Tiga', sap_id: 'SAP003' },
    ];

    for (const data of suppliers) {
      const existing = await repo.findOne({ where: { code: data.code } });
      if (!existing) {
        const supplier = new Supplier();
        Object.assign(supplier, data);
        await repo.save(supplier);
        console.log(`🏢 Created supplier: ${data.name}`);
      }
    }
  }

  private static async seedMaterials(db: any) {
    const repo = db.getRepository(Material);

    const materials = [
      { code: 'MAT001', description: 'Raw Material A', sap_id: 'SAPMAT001', uom: 'KG' },
      { code: 'MAT002', description: 'Raw Material B', sap_id: 'SAPMAT002', uom: 'TON' },
      { code: 'MAT003', description: 'Finished Product A', sap_id: 'SAPMAT003', uom: 'KG' },
      { code: 'MAT004', description: 'Finished Product B', sap_id: 'SAPMAT004', uom: 'TON' },
    ];

    for (const data of materials) {
      const existing = await repo.findOne({ where: { code: data.code } });
      if (!existing) {
        const material = new Material();
        Object.assign(material, data);
        await repo.save(material);
        console.log(`📦 Created material: ${data.description}`);
      }
    }
  }

  private static async seedVehicles(db: any) {
    const repo = db.getRepository(Vehicle);

    const vehicles = [
      { plate: 'B1234AB', type: 'TRUCK', owner: 'PT Transport Satu' },
      { plate: 'B5678CD', type: 'TRUCK', owner: 'CV Transport Dua' },
      { plate: 'D9012EF', type: 'TRAILER', owner: 'PT Transport Tiga' },
    ];

    for (const data of vehicles) {
      const existing = await repo.findOne({ where: { plate: data.plate } });
      if (!existing) {
        const vehicle = new Vehicle();
        Object.assign(vehicle, data);
        await repo.save(vehicle);
        console.log(`🚛 Created vehicle: ${data.plate}`);
      }
    }
  }

  private static async seedDrivers(db: any) {
    const repo = db.getRepository(Driver);

    const drivers = [
      { name: 'Budi Santoso', sim: '081234567890' },
      { name: 'Ahmad Wijaya', sim: '081987654321' },
      { name: 'Siti Nurhaliza', sim: '081122334455' },
    ];

    for (const data of drivers) {
      const existing = await repo.findOne({ where: { name: data.name } });
      if (!existing) {
        const driver = new Driver();
        Object.assign(driver, data);
        await repo.save(driver);
        console.log(`👤 Created driver: ${data.name}`);
      }
    }
  }

  private static async seedWeighbridges(db: any) {
    const repo = db.getRepository(Weighbridge);

    const weighbridges = [
      { name: 'Weighbridge 1', location: 'Gate A', indicator_topic: '/wb1/weight' },
      { name: 'Weighbridge 2', location: 'Gate B', indicator_topic: '/wb2/weight' },
    ];

    for (const data of weighbridges) {
      const existing = await repo.findOne({ where: { name: data.name } });
      if (!existing) {
        const weighbridge = new Weighbridge();
        Object.assign(weighbridge, data);
        await repo.save(weighbridge);
        console.log(`⚖️ Created weighbridge: ${data.name}`);
      }
    }
  }
}
