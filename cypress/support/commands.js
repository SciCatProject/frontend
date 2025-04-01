import { testData } from "../fixtures/testData";

const lbBaseUrl = Cypress.env("baseUrl");
const loginEndpoint = Cypress.env("loginEndpoint");
const accessTokenPrefix = Cypress.env("tokenPrefix");

Cypress.Commands.add("getToken", () => {
  return cy.getCookie("id").then((id) => `${accessTokenPrefix} ${id.value}`);
});

Cypress.Commands.add("login", (username, password) => {
  cy.request("POST", lbBaseUrl + loginEndpoint, {
    username,
    password,
    rememberMe: true,
  })
    .its("body")
    .as("user");

  cy.get("@user").then((user) => {
    cy.setCookie("created", user.created);
    cy.setCookie("id", user.id);
    cy.setCookie("ttl", user.ttl.toString());
    cy.setCookie("user", encodeURIComponent(JSON.stringify(user.user)));
    cy.setCookie("userId", user.userId);
  });
});

Cypress.Commands.add("createPolicy", (ownerGroup) => {
  cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
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
  cy.getToken().then((token) => {
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
    cy.getToken().then((token) => {
      cy.get("@policies").then((policies) => {
        policies.forEach((policy) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + "/Policies/" + encodeURIComponent(policy.id),
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
  (
    type,
    datasetName = testData.rawDataset.datasetName,
    proposalId = "20170266",
    dataFileSize = "small",
  ) => {
    cy.getCookie("user").then((userCookie) => {
      const user = JSON.parse(decodeURIComponent(userCookie.value));

      cy.getToken().then((token) => {
        if (type === "raw") {
          const dataset = { ...testData.rawDataset, datasetName, proposalId };
          cy.log("Raw Dataset 1: " + JSON.stringify(dataset, null, 2));
          cy.log("User: " + JSON.stringify(user, null, 2));

          cy.request({
            method: "POST",
            url: lbBaseUrl + "/datasets",
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
            url: lbBaseUrl + "/datasets",
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
  return cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
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

Cypress.Commands.add("createInstrument", (instrument) => {
  return cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      cy.log("Instrument: " + JSON.stringify(instrument, null, 2));
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/Instruments",
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: instrument,
      });
    });
  });
});

Cypress.Commands.add("updateProposal", (proposalId, updateProposalDto) => {
  return cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      cy.log(
        "Update proposal DTO: " + JSON.stringify(updateProposalDto, null, 2),
      );
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "PATCH",
        url: `${lbBaseUrl}/Proposals/${encodeURIComponent(proposalId)}`,
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: updateProposalDto,
      });
    });
  });
});

Cypress.Commands.add("deleteProposal", (id) => {
  cy.getToken().then((token) => {
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
  cy.getToken().then((token) => {
    const filter = { where: { datasetName: "Cypress Dataset" } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/datasets?filter=" +
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
          url: lbBaseUrl + "/datasets/" + encodeURIComponent(dataset.pid),
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
  cy.getToken().then((token) => {
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
      cy.getToken().then((token) => {
        proposals.forEach((proposal) => {
          cy.request({
            method: "DELETE",
            url:
              lbBaseUrl +
              "/proposals/" +
              encodeURIComponent(proposal.proposalId),
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

Cypress.Commands.add("removeInstruments", () => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getToken().then((token) => {
    cy.request({
      method: "GET",
      url: lbBaseUrl + "/instruments",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .its("body")
      .as("instruments");

    cy.get("@instruments").then((instruments) => {
      cy.login(
        Cypress.env("secondaryUsername"),
        Cypress.env("secondaryPassword"),
      );
      cy.getToken().then((token) => {
        instruments.forEach((instrument) => {
          cy.request({
            method: "DELETE",
            url:
              lbBaseUrl +
              "/instruments/" +
              encodeURIComponent(instrument.pid),
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

Cypress.Commands.add("removeSamples", () => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getToken().then((token) => {
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
    cy.getToken().then((token) => {
      cy.get("@samples").then((samples) => {
        samples.forEach((sample) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + "/Samples/" + sample.sampleId,
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

Cypress.Commands.add("initializeElasticSearch", (index) => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getToken().then((token) => {
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
  cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      const dataset = testData.rawDataset;
      dataset.datasetName = datasetName;
      cy.log("Raw Dataset 1: " + JSON.stringify(dataset, null, 2));
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/datasets",
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
  cy.getToken().then((token) => {
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

Cypress.Commands.add("uploadDatasetAttachments", (number = 1, wait = 500) => {
  cy.get(".mat-mdc-tab-link").contains("Attachments").click();

  for (let i = 0; i < number; i++) {
    const randomContent = `data:image/png;base64,${Cypress._.times(100, () =>
      Math.floor(Math.random()).toString(16),
    ).join("")}`;

    const fileName = `random-image-${Date.now()}-${i}.png`;

    cy.get(".dropzone").selectFile(
      {
        contents: Cypress.Buffer.from(randomContent, "base64"),
        fileName: fileName,
        mimeType: "image/png",
      },
      {
        action: "drag-drop",
        force: true,
      },
    );
    cy.wait(wait);
  }
});

Cypress.Commands.add("removeDatasetsForElasticSearch", (datasetName) => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getToken().then((token) => {
    const filter = { where: { datasetName } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/datasets?filter=" +
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
    cy.getToken().then((token) => {
      cy.get("@datasets").then((datasets) => {
        datasets.forEach((dataset) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + "/datasets/" + encodeURIComponent(dataset.pid),
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
