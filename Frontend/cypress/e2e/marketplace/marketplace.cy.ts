describe("End-to-End Marketplace Test", () => {
  beforeEach(() => {
    // First, set up a window event listener to ensure the window.ethereum object
    // is stubbed before the MetaMask connection code runs
    cy.visit("http://localhost:3010", {
      onBeforeLoad(win) {
        // Stub the ethereum object that MetaMask injects into the window
        Object.defineProperty(win, "ethereum", {
          value: {
            isMetaMask: true,
            request: cy.stub().callsFake(({ method }) => {
              // Return proper response based on the MetaMask method
              if (
                method === "eth_requestAccounts" ||
                method === "eth_accounts"
              ) {
                return Promise.resolve([
                  "0x1234567890123456789012345678901234567890",
                ]);
              }
              // Handle chainId request
              if (method === "eth_chainId") {
                return Promise.resolve("0x1"); // Ethereum Mainnet
              }
              // Handle balance requests
              if (method === "eth_getBalance") {
                return Promise.resolve("0x0de0b6b3a7640000"); // 1 ETH in hex
              }
              // Handle contract calls
              if (method === "eth_call") {
                // For token balanceOf calls, return a non-zero balance
                return Promise.resolve(
                  "0x0000000000000000000000000000000000000000000000056bc75e2d63100000",
                ); // 100 tokens
              }
              // Handle eth_sendTransaction
              if (method === "eth_sendTransaction") {
                return Promise.resolve(
                  "0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234",
                );
              }
              // Handle net_version
              if (method === "net_version") {
                return Promise.resolve("1"); // Ethereum Mainnet
              }
              // Default for other methods - return hex string instead of null
              return Promise.resolve("0x");
            }),
            on: cy.stub(),
            removeListener: cy.stub(),
            autoRefreshOnNetworkChange: false,
          },
          writable: true,
        });
      },
    });
  });

  it("Should navigate through the application and test marketplace", () => {
    // Step 1: Connect with MetaMask on the root page
    cy.contains("Connect with MetaMask").click();

    // Wait for authentication to complete - button should show connecting state
    cy.contains("Connecting...").should("be.visible");

    // Add longer timeouts to account for authentication and redirection
    cy.url({ timeout: 15000 }).should("include", "/welcome");

    // Additional verification that we're on the welcome page
    cy.location("pathname", { timeout: 15000 }).should("eq", "/welcome");

    // Ensure the welcome page content is loaded before proceeding
    cy.contains("WAR OF KOLORS", { timeout: 10000 }).should("be.visible");

    // Step 2: Enter a username if the field is present
    cy.get('input[name="username"]', { timeout: 5000 }).then(($input) => {
      if ($input.length) {
        cy.wrap($input).type("TestUser");
      }
    });

    // Step 3: Click Play Game button to navigate to MainGame
    cy.contains("Play Game").click();

    // Wait for MainGame page to load
    cy.url().should("include", "/MainGame");

    // Step 4: Wait for the game canvas to be loaded
    cy.get("canvas", { timeout: 10000 }).should("be.visible");

    // Wait for game to initialize properly
    cy.wait(3000);

    // Step 5: Click on marketplace icon and navigate to marketplace scene
    cy.get("canvas").then(($canvas) => {
      // The marketplace icon is positioned at coordinates (75, 75)
      const canvasElement = $canvas[0];

      // Get the position of the canvas relative to the viewport
      const rect = canvasElement.getBoundingClientRect();

      // Calculate the position to click (75, 75 in game coordinates)
      const x = rect.left + 75;
      const y = rect.top + 75;

      // Click at the calculated position
      cy.window().then((win) => {
        // Using a custom event to track scene changes
        const sceneChangeDetected = new Promise((resolve) => {
          // Create a temporary listener to detect when scene changes to Marketplace
          win.addEventListener(
            "phaser-scene-change",
            (event) => {
              const customEvent = event as CustomEvent;
              if (customEvent.detail === "Marketplace") {
                resolve(true);
              }
            },
            { once: true },
          );

          // After 5 seconds, resolve anyway to prevent test hanging
          setTimeout(() => resolve(false), 5000);
        });

        // Perform the click
        cy.get("body").click(x, y);

        // Wait for scene change or timeout
        cy.wrap(sceneChangeDetected).then((changed) => {
          // Assert that we navigated to the Marketplace scene
          expect(changed).to.equal(true);
        });
      });
    });
  });
});
