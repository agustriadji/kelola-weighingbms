import { RBACSeeder } from './rbac-seeder'
import { MasterDataSeeder } from './master-data-seeder'

export class DatabaseSeeder {
  static async run() {
    try {
      console.log('🚀 Starting database seeding...')
      
      // Run seeders in order
      await RBACSeeder.run()
      await MasterDataSeeder.run()
      
      console.log('🎉 All seeders completed successfully!')
      
    } catch (error) {
      console.error('💥 Database seeding failed:', error)
      process.exit(1)
    }
  }
}

// Run seeder if called directly
if (require.main === module) {
  DatabaseSeeder.run()
    .then(() => {
      console.log('✨ Seeding finished!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding error:', error)
      process.exit(1)
    })
}