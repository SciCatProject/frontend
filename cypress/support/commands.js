import { testData } from "../fixtures/testData";

const lbBaseUrl = Cypress.env("lbBaseUrl");
const loginEndpoint = Cypress.env("lbLoginEndpoint");
const accessTokenPrefix = Cypress.env("lbTokenPrefix");

Cypress.Commands.add("login", (username, password) => {
  cy.request("POST", lbBaseUrl + loginEndpoint, {
    username,
    password,
    rememberMe: true,
  })
    .its("body")
    .as("user");

  cy.get("@user").then((user) => {
    cy.setCookie("$LoopBackSDK$created", user.created);
    cy.setCookie("$LoopBackSDK$id", accessTokenPrefix + user.id);
    cy.setCookie("$LoopBackSDK$ttl", user.ttl.toString());
    cy.setCookie(
      "$LoopBackSDK$user",
      encodeURIComponent(JSON.stringify(user.user)),
    );
    cy.setCookie("$LoopBackSDK$userId", user.userId);
  });
});

Cypress.Commands.add("createPolicy", (ownerGroup) => {
  cy.getCookie("$LoopBackSDK$user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
      const token = idCookie.value;

      const policy = testData.policy;
      policy.manager = ["_cypress", user.email];
      policy.ownerGroup = ownerGroup;

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/Policies",
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: policy,
      });
    });
  });
});

Cypress.Commands.add("removePolicies", () => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getCookie("$LoopBackSDK$id").then((cookie) => {
    const token = cookie.value;

    const filter = { where: { ownerGroup: "cypress" } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/Policies?filter=" +
        encodeURIComponent(JSON.stringify(filter)),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .its("body")
      .as("policies");

    cy.login(
      Cypress.env("secondaryUsername"),
      Cypress.env("secondaryPassword"),
    );
    cy.getCookie("$LoopBackSDK$id").then((deletionCookie) => {
      const deletionToken = deletionCookie.value;
      cy.get("@policies").then((policies) => {
        policies.forEach((policy) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + "/Policies/" + encodeURIComponent(policy.id),
            headers: {
              Authorization: deletionToken,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
        });
      });
    });
  });
});
Cypress.Commands.add("finishedLoading", (type) => {
  cy.contains("Loading")
    .should("not.exist")
    .get('[data-cy="spinner"]')
    .should("not.exist");
});

Cypress.Commands.add("isLoading", (type) => {
  cy.intercept(lbBaseUrl, (req) => {
    req.on("response", (res) => res.delay(100)); // enough delay so that spinner appears
    cy.get('[data-cy="spinner"]');
  });

  cy.get('[data-cy="spinner"]').should("not.exist");
});

Cypress.Commands.add(
  "createDataset",
  (type, proposalId = "20170266", dataFileSize = "small") => {
    cy.getCookie("$LoopBackSDK$user").then((userCookie) => {
      const user = JSON.parse(decodeURIComponent(userCookie.value));

      cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
        const token = idCookie.value;

        if (type === "raw") {
          const dataset = testData.rawDataset;
          dataset.proposalId = proposalId;
          cy.log("Raw Dataset 1: " + JSON.stringify(dataset, null, 2));
          cy.log("User: " + JSON.stringify(user, null, 2));

          cy.request({
            method: "POST",
            url: lbBaseUrl + "/Datasets",
            headers: {
              Authorization: token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: dataset,
          }).then((response) => {
            const origDataBlock =
              dataFileSize === "small"
                ? testData.origDataBlockSmall
                : testData.origDataBlockLarge;
            origDataBlock.datasetId = response.body.pid;

            cy.request({
              method: "POST",
              url: lbBaseUrl + `/OrigDatablocks`,
              headers: {
                Authorization: token,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: origDataBlock,
            });
          });
        } else if (type === "derived") {
          const dataset = testData.derivedDataset;
          dataset.investigator = user.email;
          dataset.owner = user.username;
          dataset.ownerEmail = user.email;
          dataset.contactEmail = user.email;
          dataset.createdBy = user.username;
          dataset.updatedBy = user.username;

          cy.request({
            method: "POST",
            url: lbBaseUrl + "/Datasets",
            headers: {
              Authorization: token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: dataset,
          });
        }
      });
    });
  },
);
Cypress.Commands.add("createProposal", (proposal) => {
  return cy.getCookie("$LoopBackSDK$user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
      const token = idCookie.value;
      cy.log("Proposal: " + JSON.stringify(proposal, null, 2));
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/Proposals",
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: proposal,
      });
    });
  });
});

Cypress.Commands.add("deleteProposal", (id) => {
  cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
    const token = idCookie.value;

    cy.request({
      method: "DELETE",
      url: lbBaseUrl + `/Proposals/${encodeURIComponent(id)}`,
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  });
});

Cypress.Commands.add("removeDatasets", () => {
  cy.login(Cypress.env("secondaryUsername"), Cypress.env("secondaryPassword"));
  cy.getCookie("$LoopBackSDK$id").then((cookie) => {
    const token = cookie.value;

    const filter = { where: { datasetName: "Cypress Dataset" } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/Datasets?filter=" +
        encodeURIComponent(JSON.stringify(filter)),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .its("body")
      .as("datasets");

    cy.get("@datasets").then((datasets) => {
      datasets.forEach((dataset) => {
        cy.request({
          method: "DELETE",
          url: lbBaseUrl + "/Datasets/" + encodeURIComponent(dataset.pid),
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      });
    });
  });
});

Cypress.Commands.add("removeProposals", () => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getCookie("$LoopBackSDK$id").then((cookie) => {
    const token = cookie.value;

    const filter = { where: { title: testData.proposal.title } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/proposals?filters=" +
        encodeURIComponent(JSON.stringify(filter)),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .its("body")
      .as("proposals");

    cy.get("@proposals").then((proposals) => {
      cy.login(
        Cypress.env("secondaryUsername"),
        Cypress.env("secondaryPassword"),
      );
      cy.getCookie("$LoopBackSDK$id").then((cookie) => {
        const archiveManagerToken = cookie.value;
        proposals.forEach((proposal) => {
          cy.request({
            method: "DELETE",
            url:
              lbBaseUrl +
              "/proposals/" +
              encodeURIComponent(proposal.proposalId),
            headers: {
              Authorization: archiveManagerToken,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
        });
      });
    });
  });
});

Cypress.Commands.add("removeSamples", () => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getCookie("$LoopBackSDK$id").then((cookie) => {
    const token = cookie.value;

    const filter = { where: { description: "Cypress Sample" } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/Samples?filter=" +
        encodeURIComponent(JSON.stringify(filter)),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .its("body")
      .as("samples");

    cy.login(
      Cypress.env("secondaryUsername"),
      Cypress.env("secondaryPassword"),
    );
    cy.getCookie("$LoopBackSDK$id").then((deletionCookie) => {
      const deletionToken = deletionCookie.value;
      cy.get("@samples").then((samples) => {
        samples.forEach((sample) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + "/Samples/" + sample.sampleId,
            headers: {
              Authorization: deletionToken,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
        });
      });
    });
  });
});

Cypress.Commands.add("initializeElasticSearch", (index) => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
    const token = idCookie.value;

    cy.request({
      method: "POST",
      url: lbBaseUrl + "/elastic-search" + "/create-index" + "?index=" + index,
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(() => {
      cy.request({
        method: "POST",
        url:
          lbBaseUrl + "/elastic-search" + "/sync-database" + "?index=" + index,
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    });
  });
});

Cypress.Commands.add("createDatasetForElasticSearch", (datasetName) => {
  cy.getCookie("$LoopBackSDK$user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
      const token = idCookie.value;

      const dataset = testData.rawDataset;
      dataset.datasetName = datasetName;
      cy.log("Raw Dataset 1: " + JSON.stringify(dataset, null, 2));
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/Datasets",
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: dataset,
      });
    });
  });
});

Cypress.Commands.add("removeElasticSearchIndex", (index) => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getCookie("$LoopBackSDK$id").then((idCookie) => {
    const token = idCookie.value;
    cy.request({
      method: "POST",
      url: lbBaseUrl + "/elastic-search" + "/delete-index" + "?index=" + index,
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  });
});

Cypress.Commands.add("removeDatasetsForElasticSearch", (datasetName) => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getCookie("$LoopBackSDK$id").then((cookie) => {
    const token = cookie.value;

    const filter = { where: { datasetName } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/Datasets?filter=" +
        encodeURIComponent(JSON.stringify(filter)),
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .its("body")
      .as("datasets");

    cy.login(
      Cypress.env("secondaryUsername"),
      Cypress.env("secondaryPassword"),
    );
    cy.getCookie("$LoopBackSDK$id").then((deletionCookie) => {
      const token = deletionCookie.value;
      cy.get("@datasets").then((datasets) => {
        datasets.forEach((dataset) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + "/Datasets/" + encodeURIComponent(dataset.pid),
            headers: {
              Authorization: token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
        });
      });
    });
  });
});
