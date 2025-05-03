const { execSync } = require('child_process');
const path = require('path');

async function seedData() {
  try {
    console.log('Starting database seeding process...');

    // Run mana migrations
    console.log('Running mana migrations...');
    const manaPath = path.resolve(__dirname, '../apps/mana');
    execSync('npx knex migrate:latest', {
      cwd: manaPath,
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: 'postgres://postgres:password@localhost:5432/mana'
      }
    });

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
