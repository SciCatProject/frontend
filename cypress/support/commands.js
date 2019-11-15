import "cypress-file-upload";

const lbBaseUrl = Cypress.config("lbBaseUrl");

Cypress.Commands.add("login", (username, password) => {
  cy.request("POST", lbBaseUrl + "/Users/login?include=user", {
    username,
    password,
    rememberMe: true
  })
    .its("body")
    .as("user");

  cy.get("@user").then(user => {
    cy.setCookie("$LoopBackSDK$created", user.created);
    cy.setCookie("$LoopBackSDK$id", user.id);
    cy.setCookie("$LoopBackSDK$ttl", user.ttl.toString());
    cy.setCookie(
      "$LoopBackSDK$user",
      encodeURIComponent(JSON.stringify(user.user))
    );
    cy.setCookie("$LoopBackSDK$userId", user.userId);
  });
});

Cypress.Commands.add("createDataset", type => {
  cy.getCookie("$LoopBackSDK$user").then(userCookie => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getCookie("$LoopBackSDK$id").then(idCookie => {
      const token = idCookie.value;

      if (type === "raw") {
        cy.fixture("rawDataset").then(dataset => {
          dataset.principalInvestigator = user.email;
          dataset.owner = user.username;
          dataset.ownerEmail = user.email;
          dataset.contactEmail = user.email;
          dataset.createdBy = user.username;
          dataset.updatedBy = user.username;

          cy.request(
            "POST",
            lbBaseUrl + "/Datasets?access_token=" + token,
            dataset
          );
        });
      } else if (type === "derived") {
        cy.fixture("derivedDataset").then(dataset => {
          dataset.investigator = user.email;
          dataset.owner = user.username;
          dataset.ownerEmail = user.email;
          dataset.contactEmail = user.email;
          dataset.createdBy = user.username;
          dataset.updatedBy = user.username;

          cy.request(
            "POST",
            lbBaseUrl + "/Datasets?access_token=" + token,
            dataset
          );
        });
      }
    });
  });
});

Cypress.Commands.add("removeDatasets", () => {
  cy.getCookie("$LoopBackSDK$id").then(cookie => {
    const token = cookie.value;

    const filter = { where: { datasetName: "Cypress Dataset" } };

    cy.request(
      "GET",
      lbBaseUrl +
        "/Datasets?filter=" +
        encodeURIComponent(JSON.stringify(filter)) +
        "&access_token=" +
        token
    )
      .its("body")
      .as("datasets");

    cy.get("@datasets").then(datasets => {
      datasets.forEach(dataset => {
        cy.request(
          "DELETE",
          lbBaseUrl +
            "/Datasets/" +
            encodeURIComponent(dataset.pid) +
            "?access_token=" +
            token
        );
      });
    });
  });
});

Cypress.Commands.add("removeSamples", () => {
  cy.getCookie("$LoopBackSDK$id").then(cookie => {
    const token = cookie.value;

    const filter = { where: { description: "Cypress Sample" } };

    cy.request(
      "GET",
      lbBaseUrl +
        "/Samples?filter=" +
        encodeURIComponent(JSON.stringify(filter)) +
        "&access_token=" +
        token
    )
      .its("body")
      .as("samples");

    cy.get("@samples").then(samples => {
      samples.forEach(sample => {
        cy.request(
          "DELETE",
          lbBaseUrl + "/Samples/" + sample.sampleId + "?access_token=" + token
        );
      });
    });
  });
});
