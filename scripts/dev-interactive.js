const { execSync, fork } = require('child_process');
const path = require('path');
const { checkbox } = require('@inquirer/prompts');

const SERVICES = {
  ui: {
    env: {}
  },
  api: {
    env: {
      ENABLED_NETWORKS: 'sei',
      VITE_ENABLED_NETWORKS: 'sei',
      VITE_METADATA_NETWORK: 'sei',
      VITE_UNIFIED_API_TESTNET_URL: 'http://localhost:3000',
      VITE_UNIFIED_API_URL: 'http://localhost:3000',
    }
  },
  mana: {
    env: {
      VITE_MANA_URL: 'http://localhost:3001'
    }
  }
};

const DOCKER_CMD = `docker compose -f scripts/docker-compose.yml up -d`;

function runTurboWithFilters(serviceTypes) {
  const turboPath = path.resolve('node_modules', '.bin', 'turbo');
  const filterArgs = serviceTypes.flatMap(filter => [
    '--filter',
    `${filter}...`
  ]);
  const args = ['run', 'dev', ...filterArgs];

  const extraEnv = serviceTypes.reduce((acc, serviceType) => {
    return { ...acc, ...SERVICES[serviceType].env };
  }, {});

  const child = fork(turboPath, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...extraEnv
    }
  });

  child.on('error', error => {
    console.error(`Error executing turbo: ${error.message}`);
  });

  child.on('exit', code => {
    if (code !== 0) {
      console.error(`Turbo process exited with code ${code}`);
    } else {
      console.log(
        `Turbo process finished successfully with filters: ${serviceTypes.join(', ')}`
      );
    }
  });
}

async function run() {
  try {
    console.log('Starting interactive development script...');
    const answer = await checkbox({
      message: 'Select services to run locally',
      choices: [
        { name: 'UI', value: 'ui' },
        { name: 'API (only sei)', value: 'api' },
        { name: 'Mana', value: 'mana' }
      ]
    });

    console.log('Selected services:', answer);

    if (answer.includes('api') || answer.includes('mana')) {
      console.log('Starting Docker for backend services...');
      execSync(DOCKER_CMD);
      console.log('Docker started');
    }

    if (answer.length === 0) {
      console.log('No services selected, exiting...');
      process.exit(0);
    }

    console.log('Starting services with Turbo...');
    runTurboWithFilters(answer);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

run();
