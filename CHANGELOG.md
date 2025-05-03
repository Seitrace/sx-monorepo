# Changelog

## [Unreleased]
- Removed all non-SEI networks to focus exclusively on SEI network support
  - Removed Starknet mainnet and sepolia networks
  - Removed offchain mainnet and goerli networks
- Added database seeding functionality
  - Added seed script for initializing databases
  - Added 'yarn seed' command to run database migrations
- Added block range limit to SEI indexer
  - Limited block fetching to 100 blocks per request to prevent "Request Entity Too Large" errors
