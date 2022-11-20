describe("<NewGateway />", () => {
  it("<NewGateway /> Validation and alerts", () => {

	cy.intercept("GET", "http://localhost:5000/**", (req) => {
      const { operationName } = req.body;

      req.reply({
        statusCode: 200,
        body: {
          id: "121212",
          serial: "CG-2105",
          name: "Gateway 1",
          ipv4: "127.0.0.1",
          peripherals: [
            {
              uid: 1234,
              vendor: "Peripheral test",
              status: "offline",
              _id: "6377bf781a5e3d5be0a91b19",
              date: "2022-11-18T17:23:04.696+00:00",
            },
          ],
        },
      });
    });

	// Visit Dashboard page
	cy.visit("/");

    // Visit home and redirect to login
    cy.visit("/gateways/new");

    // Check Login render and button form disabled
    cy.get("[data-cy=newGatewayFormTitle]")
      .should("exist")
      .invoke("text")
      .should("equal", "New Gateway");
    cy.get("[data-cy=saveBtn]").should("be.disabled");

    // Check for empty fields alert
    cy.get("[data-cy=serial]").type("CG-2536");
    cy.get("[data-cy=name]").type("Gateway 1");
    cy.get("[data-cy=ipv4]").type("127.0.0.1");
    cy.get("[data-cy=serial]").clear();
    cy.get("[data-cy=name]").clear();
    cy.get("[data-cy=ipv4]").clear();

    cy.get("[data-cy=serial] p")
      .should("exist")
      .invoke("text")
      .should("equal", "You must enter a serial.");
    cy.get("[data-cy=name] p")
      .should("exist")
      .invoke("text")
      .should("equal", "You must enter a name.");
    cy.get("[data-cy=ipv4] p")
      .should("exist")
      .invoke("text")
      .should("equal", "Please enter an IP.");
    cy.get("[data-cy=saveBtn]").should("be.disabled");

    // Check for incorrect ipv4 alert
    cy.get("[data-cy=ipv4]").type("bad ip");
    cy.get("[data-cy=ipv4] p")
      .should("exist")
      .invoke("text")
      .should("equal", "You must enter a v4 valid IP.");
    cy.get("[data-cy=saveBtn]").should("be.disabled");

    // Check for short length alert
    cy.get("[data-cy=serial]")
      .clear()
      .type("1111111111111111111111111111111111111111111111111");
    cy.get("[data-cy=name]")
      .clear()
      .type("111111111111111111111111111111111111111111");

    cy.get("[data-cy=serial] p")
      .should("exist")
      .invoke("text")
      .should("equal", "Should be 40 chars maximum.");
    cy.get("[data-cy=name] p")
      .should("exist")
      .invoke("text")
      .should("equal", "Should be 40 chars maximum.");
    cy.get("[data-cy=saveBtn]").should("be.disabled");

    // Try to create a gateway with a serial already declared
    cy.get("[data-cy=serial]").clear().type("CG-2536");
    cy.get("[data-cy=name]").clear().type("Gateway 1");
    cy.get("[data-cy=ipv4]").clear().type("127.0.0.1");

    cy.intercept("POST", "http://localhost:5000/**", (req) => {
      const { operationName } = req.body;

      req.reply({
        statusCode: 400,
        body: {
          message: "#400: Gateway validation error.",
          fields: { serial: "Gateway serial already exist." },
        },
      });
    });

    cy.get("[data-cy=saveBtn]").click();
    cy.get("[data-cy=serial] p")
      .should("exist")
      .invoke("text")
      .should("equal", "Gateway serial already exist.");
  });

  // Create a gateway succesfully
  it("<NewGateway /> Successfully create a gateway", () => {
    cy.get("[data-cy=serial] input").clear();
    cy.get("[data-cy=name] input").clear();
    cy.get("[data-cy=ipv4] input").clear();
    cy.get("[data-cy=serial]").type("CG-2105");
    cy.get("[data-cy=name]").type("Gateway 1");
    cy.get("[data-cy=ipv4]").type("127.0.0.1");

    // Create a new Gateway
    cy.intercept("POST", "http://localhost:5000/**", (req) => {
      const { operationName } = req.body;

      req.reply({
        statusCode: 201,
        body: {
          id: "121212",
          serial: "CG-2105",
          name: "Gateway 1",
          ipv4: "127.0.0.1",
        },
      });
    });

    cy.intercept("GET", "http://localhost:5000/**", (req) => {
      const { operationName } = req.body;

      req.reply({
        statusCode: 200,
        body: {
          id: "121212",
          serial: "CG-2105",
          name: "Gateway 1",
          ipv4: "127.0.0.1",
          peripherals: [
            {
              uid: 1234,
              vendor: "Peripheral test",
              status: "offline",
              _id: "6377bf781a5e3d5be0a91b19",
              date: "2022-11-18T17:23:04.696+00:00",
            },
          ],
        },
      });
    });

    cy.get("[data-cy=saveBtn]").click();
  });
});
