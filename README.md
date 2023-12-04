### OpenCCIP Subgraph

This graph is to index listed NFTs in OpenCCIP Marketplace and record all activities of the NFTs across all chains such as

- Ethereum Sepolia
- Optimism Goerli
- Avalanche Fuji
- Polygon Mumbai
- Base Goerli
- BNB Smart Chain Testnet

Thanks to [CRC1Syncable](https://github.com/Nava-Labs/openccip-contracts/tree/dev#crc1syncable). By using this way we are a step ahead for building Cross Chain Graph

## 🛠️ Other cool things that we build in Constellation 2023 🛠️

The main library consists of:

- **[CRC1](https://github.com/Nava-Labs/openccip-contracts/blob/dev/src/ccip/CRC1/CRC1.sol)** (Chainlink Request for Comment)
  - The foundational contract for building cross-chain applications using **Chainlink CCIP**. Enables functionalities like message sending, receiving, and processing across chains.
  - Supports Multihop functionality across all chains and Message Bundling for bulk operations by default.
- **[CRC1Syncable](https://github.com/Nava-Labs/openccip-contracts/blob/dev/src/ccip/CRC1/extensions/CRC1Syncable.sol)**
  - An extension of CRC1, designed for applications that require consistent states across contracts on various chains.
  - Manages cross-chain data synchronization and state harmonization.
- **[Trustable](https://github.com/Nava-Labs/openccip-contracts/blob/dev/src/ccip/CRC1/Trustable.sol)**
  - Provides a security layer for CRC1, ensuring secure cross-chain operations.
- **[CRC20](https://github.com/Nava-Labs/openccip-contracts/tree/dev/src/ccip/CRC20)** (Source and Destination)
  - A framework for ERC20 tokens to operate across multiple chains, integrating with the CRC1 contract.
  - Split into [CRC20Source](https://github.com/Nava-Labs/openccip-contracts/blob/dev/src/ccip/CRC20/CRC20Source.sol) and [CRC20Destination](https://github.com/Nava-Labs/openccip-contracts/blob/dev/src/ccip/CRC20/CRC20Destination.sol) for token wrapping and deployment on various chains.
- **[FeeAutomation](https://github.com/Nava-Labs/openccip-contracts/blob/dev/src/ccip/CRC1/utils/FeeAutomation.sol)**
  - Utilize **Chainlink Automation** to maintain fee allocation in a cross-chain dApp.
  - Avoid maintaining $LINK balance manually.
  - Action triggered every time cross-chain app sends CCIP message, emitted MessageSent(bytes32,bytes) event.
- **[OpenCCIP SDK](https://github.com/Nava-Labs/openccip-sdk) - Dijkstra's Algorithm**:
  - Following the principle of Dijkstra's Shortest Path Algorithm, we assigned "weight" to each possible direct lane supported by CCIP which is calculated based on each blockchain _Time-To-Finality_, _5-day average gas price_, and _Transaction per Second_.
  - With the assigned "weight", the best route can be found. To make things easy from the front end, we build this into an SDK, so the front end only needs to pass the "from" and "to" chains. The SDK will find the best possible routes, which then will be passed to the smart contract for the cross-chain transaction to be executed.
