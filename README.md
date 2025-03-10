# War of Kolors on Core Blockchain

War of Kolors (WOK) is a blockchain-based, play-to-earn (P2E) game inspired by the traditional Pinoy color game. It integrates NFTs, decentralized finance (DeFi), and gaming mechanics to create an engaging battle experience where players use Champions to compete in the War Arena and earn rewards.

Vision
To revolutionize blockchain gaming by blending strategy, luck, and decentralized ownership.

Mission
To provide a fair, transparent, and rewarding gaming experience where players truly own their assets and can earn while playing.

## Table of Contents

- [War of Kolors on Core Blockchain](#war-of-kolors-on-core-blockchain)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
  - [Running the Application](#running-the-application)
  - [Interacting with the dApp](#interacting-with-the-dapp)
  - [Backend Overview](#backend-overview)
  - [Frontend Overview](#frontend-overview)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MetaMask](https://metamask.io/) browser extension
- Basic understanding of Ethereum smart contracts and React

## Project Structure

The repository is organized as follows:

- `Backend/`: Express.js application for the game's frontend.
- `Frontend/`: Next.js application for the game's frontend.

## Setup Instructions

1. **Clone the Repository**

   ```bash
   https://github.com/sipd-wok/war_of_kolors.git
   cd war_of_kolors
   ```

2. **Install Dependencies**

   Nvigate to the `Backend` directory and install its dependencies:

   ```bash
   cd Backend
   npm install
   ```

   Then, navigate to the `Frontend` directory and install its dependencies:

   ```bash
    # Navigate to the Frontend directory and install dependencies.

    # 1.  Make sure you are in the 'war_of_kolors' project root.
    #     If you are not, navigate there first.
    #     You can check your current directory with:
    pwd  # (Linux/macOS)  or  cd  # (Windows) - without arguments

    # 2.  If you are already inside the 'Frontend' directory, go up one level:
    #     (Only do this step if you are INSIDE 'Backend' or 'war_of_kolors/Backend')
    cd ..

    # 3. Go into the 'Frontend' directory:
    cd Frontend

    # 4. Install the project's dependencies:
    npm install
   ````

## Running the Application

1. **Start the Backend Application**

   1. Navigate to the `Backend` directory and build the Nextjs application:

   ```bash
   cd Backend
   npm start
   ```

   The application will be available at `http://localhost:3000`.

2. **Start the Frontend Application**

   1. Open new terminal. (Do not close or stop the terminal that's running the Backend)

   2. Navigate to the `Frontend` directory and build the Nextjs application:

   ```bash
   # Make sure that you are in the war_of_kolors directory first
   cd Frontend
   npm run build
   ```

   3. Start the Nextjs application:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3010`.

## Interacting with the dApp

1. **Connect Wallet**

   - Open the application in your browser.
   - Click on the "Connect Wallet" button.
   - Approve the connection in your MetaMask extension.

2. **Champion Acquisition**
   
   -Go to the Marketplace.
   -Click on the Marketplace section.
   -Browse available Doors containing Champions.
   -Select a Door ( Choose from Bronze, Silver, Gold, or Rainbow.)
   -Each Door assigns a random color when opened: Red, Blue, Green, White, Yellow, or Pink.
   -Each Door also provides a Luck Multiplier:
   -Bronze: 0.01 - 0.05 (Price: 10,000 $WOK)
   -Silver: 0.05 - 0.1 (Price: 20,000 $WOK)
   -Gold: 0.1 - 0.15 (Price: 30,000 $WOK)
   -Rainbow: 0.1 - 0.15 (Price: 50,000 $WOK)
   -Purchase Using $WOK
   -Battle System
   -Go to the Battle Section

4. **Join Room**
   
   - Click "Create Room" to create room.
   - Click "Join Room" to join room.
   - _NOTE: The game needs at least 2 players to proceed. You can open another browser and connect another wallet to play multiplayer._

6. **Main Gameplay Mechanics**

   -Each match includes six Champions, one per color.
   -A fee in $WOK may be required for entry.
   -Battle Mechanics
   -Each Champion's stats start at 10.
   -When your color appears, your health increase by +1.
   -When your color does not appear, your health decrease by -1.
   -The first Champion to reach 15 health wins all bets.
   -If a Champion’s life reaches 0, they are disqualified (DQ).
   -Luck Potion
   -Winners receive $WOK and in-game items.
   -Rewards can be used for upgrades or withdrawn.

## Backend Overview

The backend is built with Express.js and is located in the `Backend` directory.

## Frontend Overview

The frontend is built with Nextjs and is located in the `Frontend` directory. It interacts with the wallet using the ethers.js library and provides a user-friendly interface for players. The main game is powered by Phaser.
