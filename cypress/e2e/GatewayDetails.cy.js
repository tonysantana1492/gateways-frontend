describe("<DetailsGateway />", () => {
  beforeEach(() => {
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
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
            ],
          },
        });
      }
    );

    // Visit DetailsGateway page
    cy.visit("/gateways/details/123456");
  });

  it("Gateway Detail render ok", () => {
    // Form render ok
    cy.get("[data-cy=form]").should("exist");

    // Title of the form render ok
    cy.get("[data-cy=title]")
      .should("exist")
      .invoke("text")
      .should("equal", "Gateway Details");

    // Peripheral item detail render ok
    cy.get("[data-cy=6377bf781a5e3d5be0a91b19]").should("exist");

    // Button Add Peripheral render ok
    cy.get("[data-cy=addCircleIcon]").should("exist");

    // Form Add Peripheral not shuold be render
    cy.get("[data-cy=addPeripheralForm]").should("not.exist");
  });

  it("Validation and alerts edit gateway form", () => {
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

    cy.intercept("PUT", "http://localhost:5000/**", (req) => {
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

  it("Edit a gateway succesfully", () => {
    cy.get("[data-cy=serial] input").clear();
    cy.get("[data-cy=name] input").clear();
    cy.get("[data-cy=ipv4] input").clear();
    cy.get("[data-cy=serial]").type("CG-2105");
    cy.get("[data-cy=name]").type("Gateway 1");
    cy.get("[data-cy=ipv4]").type("127.0.0.1");

    // Edit a Gateway
    cy.intercept("PUT", "http://localhost:5000/**", (req) => {
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

  it("Peripheral limit exceeded", () => {
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
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
              {
                uid: 1234,
                vendor: "Peripheral 1.1",
                status: "offline",
                _id: "6377bf781a5e3d5be0a91b19",
                date: "2022-11-18T17:23:04.696+00:00",
              },
            ],
          },
        });
      }
    );

    cy.visit("/gateways/details/123456");

    // Button Add Peripheral render ok
    cy.get("[data-cy=addCircleIcon]").should("not.exist");
  });

  it("Delete a Peripheral", () => {
    cy.get("[data-cy=6377bf781a5e3d5be0a91b19]").should("exist");
    cy.get("[data-cy=6377bf781a5e3d5be0a91b19]")
      .get("[data-cy=deleteBtn]")
      .should("exist");

    // Delete backend- request
    cy.intercept("DELETE", "http://localhost:5000/**", (req) => {
      req.reply({
        statusCode: 204,
        body: {
          message: "Peripheral was deleted successfully!",
        },
      });
    });

    cy.get("[data-cy=deleteBtn]").first().click();
  });

  it("Add a Peripheral", () => {
    cy.get("[data-cy=addCircleIcon]").first().click();

    // Button Add Peripheral not shuold be render
    cy.get("[data-cy=addCircleIcon]").should("not.exist");

    // Form Add Peripheral render ok
    cy.get("[data-cy=addPeripheralForm]").should("exist");

    // Click Cancel button of the Add Peripheral Form
    cy.get("[data-cy=cancelBtn]").first().click();

    cy.get("[data-cy=addCircleIcon]").should("exist");
    cy.get("[data-cy=addPeripheralForm]").should("not.exist");
  });

  it("Validation and alerts add peripheral form", () => {
    cy.get("[data-cy=addCircleIcon]").first().click();

    // Form Add Peripheral render ok
    cy.get("[data-cy=addPeripheralForm]").should("exist");

    // Check for empty fields alert
    cy.get("[data-cy=uidAdd]").type("12365", { parseInt: true });
    cy.get("[data-cy=vendorAdd]").type("Musala");
    cy.get("[data-cy=uidAdd]").clear();
    cy.get("[data-cy=vendorAdd]").clear();

    cy.get("[data-cy=uidAdd] p")
      .should("exist")
      .invoke("text")
      .should("equal", "You must enter a UID.");
    cy.get("[data-cy=vendorAdd] p")
      .should("exist")
      .invoke("text")
      .should("equal", "You must enter a vendor.");

    cy.get("[data-cy=addpPeripheralFormBtn]").should("be.disabled");

    // Check for short length alert
    cy.get("[data-cy=uidAdd]")
      .clear()
      .type("1111111111111111111111111111111111111111111111111");
    cy.get("[data-cy=vendorAdd]")
      .clear()
      .type("111111111111111111111111111111111111111111");

    cy.get("[data-cy=uidAdd] p")
      .should("exist")
      .invoke("text")
      .should("equal", "Should be 20 chars maximum.");
    cy.get("[data-cy=vendorAdd] p")
      .should("exist")
      .invoke("text")
      .should("equal", "Should be 20 chars maximum.");

    cy.get("[data-cy=addpPeripheralFormBtn]").should("be.disabled");

    // Add a new peripheral succesfully
    cy.get("[data-cy=uidAdd]").clear().type("12345");
    cy.get("[data-cy=vendorAdd]").clear().type("Musala");

    cy.get("[data-cy=addpPeripheralFormBtn]").should("not.be.disabled");

    cy.intercept("POST", "http://localhost:5000/**", (req) => {
      const { operationName } = req.body;

      req.reply({
        statusCode: 201,
        body: {
            uid: 1234,
            vendor: "Peripheral test",
            status: "offline",
            _id: "6377bf781a5e3d5be0a91b19",
            date: "2022-11-18T17:23:04.696+00:00",
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

    cy.get("[data-cy=addpPeripheralFormBtn]").click();
  });
});
