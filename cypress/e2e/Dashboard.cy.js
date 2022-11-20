describe("<Dashboard />", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:5000/api/gateways", (req) => {
      const { operationName } = req.body;

      req.reply({
        statusCode: 200,
        body: [
          {
            id: "123456",
            serial: "CG-2105",
            name: "Gateway 1",
            ipv4: "127.0.0.1",
            peripherals: [
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
            ],
          },
          {
            id: "234567",
            serial: "ZG-4105",
            name: "Gateway 2",
            ipv4: "127.0.0.1",
            peripherals: [
              {
                uid: 2345,
                vendor: "Peripheral 2.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
            ],
          },
        ],
      });
    });
    // Visit Dashboard page
    cy.visit("/");
  });

  it("Check Header Title", () => {
    cy.get("[data-cy=headerTitle]")
      .should("exist")
      .invoke("text")
      .should("equal", "Gateway Test");
  });

  it("Check Search Component", () => {
    cy.get("[data-cy=searchGatewayInput]").should("exist");

    // Check if search work
    cy.get("[data-cy=searchGatewayInput]").type("CG-2105");
    cy.get("[data-cy=123456]").should("exist");
    cy.get("[data-cy=234567]").should("not.exist");
    cy.get("[data-cy=searchGatewayInput]").clear();
    cy.get("[data-cy=234567]").should("exist");
  });

  it("Delete a Gateway", () => {
    cy.get("[data-cy=123456]").should("exist");
    cy.get("[data-cy=123456]").get("[data-cy=deleteBtn]").should("exist");

    // Delete backend- request
    cy.intercept("DELETE", "http://localhost:5000/**", (req) => {
      req.reply({
        statusCode: 204,
        body: {
          message: "Gateway was deleted successfully!",
        },
      });
    });

    cy.get("[data-cy=deleteBtn]").first().click();
  });

  it("Click New Gateway button", () => {
    cy.get("[data-cy=newGatewayBtn]").click();

    // Check Login render and button form disabled
    cy.get("[data-cy=newGatewayFormTitle]")
      .should("exist")
      .invoke("text")
      .should("equal", "New Gateway");
    cy.get("[data-cy=saveBtn]").should("be.disabled");
  });

  it("Click Gateway Detail", () => {
    cy.intercept(
      "GET",
      "http://localhost:5000/api/gateways/123456/peripherals",
      (req) => {
        const { operationName } = req.body;

        req.reply({
          statusCode: 200,
          body: {
            id: "123456",
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
      }
    );

    cy.get("[data-cy=123456]").should("exist");
    cy.get("[data-cy=123456]").click();

    // Check Login render and button form disabled
    cy.get("[data-cy=title]")
      .should("exist")
      .invoke("text")
      .should("equal", "Gateway Details");
    cy.get("[data-cy=form]").should("exist");
  });
});
