import { testData } from "../fixtures/testData";
import { getHeader } from "./utils";

const lbBaseUrl = Cypress.env("baseUrl");
const lbBaseUrlV4 = Cypress.env("baseUrlV4");
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
        headers: getHeader(token),
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
      headers: getHeader(token),
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
            headers: getHeader(token),
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

Cypress.Commands.add("createDataset", (overwrites = {}) => {
  const { type = "raw", dataFileSize = "small", ...rest } = overwrites;
  cy.log("Create Dataset");
  cy.log("Type :" + type);
  cy.log("Size :" + dataFileSize);

  cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      if (type === "raw") {
        const dataset = {
          ...testData.rawDataset,
          ...rest,
        };
        cy.log("Raw Dataset 1: " + JSON.stringify(dataset, null, 2));
        cy.log("User: " + JSON.stringify(user, null, 2));

        cy.request({
          method: "POST",
          url: lbBaseUrl + "/datasets",
          headers: getHeader(token),
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
            headers: getHeader(token),
            body: origDataBlock,
          });
        });
      } else if (type === "derived") {
        const dataset = { ...testData.derivedDataset, ...rest };
        dataset.investigator = user.email;
        dataset.owner = user.username;
        dataset.ownerEmail = user.email;
        dataset.contactEmail = user.email;
        dataset.createdBy = user.username;
        dataset.updatedBy = user.username;

        cy.request({
          method: "POST",
          url: lbBaseUrl + "/datasets",
          headers,
          body: dataset,
        });
      }
    });
  });
});
Cypress.Commands.add("createProposal", (overwrites = {}) => {
  return cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      const proposal = {
        ...testData.proposal,
        ...overwrites,
      };
      cy.log("Proposal: " + JSON.stringify(proposal, null, 2));
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/Proposals",
        headers: getHeader(token),
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
        headers: getHeader(token),
        body: instrument,
      });
    });
  });
});

Cypress.Commands.add("createSample", (sample) => {
  return cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      cy.log("Sample: " + JSON.stringify(sample, null, 2));
      cy.log("User: " + JSON.stringify(user, null, 2));

      cy.request({
        method: "POST",
        url: lbBaseUrl + "/Samples",
        headers: getHeader(token),
        body: sample,
      });
    });
  });
});

Cypress.Commands.add("createJob", (overwrites = {}) => {
  return cy.getCookie("user").then((userCookie) => {
    const user = JSON.parse(decodeURIComponent(userCookie.value));

    cy.getToken().then((token) => {
      const job = {
        ...testData.job,
        ...overwrites,
      };

      cy.request({
        method: "POST",
        url: lbBaseUrlV4 + "/jobs",
        headers: getHeader(token),
        body: job,
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
        headers: getHeader(token),
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
      headers: getHeader(token),
    });
  });
});

Cypress.Commands.add("removeDatasets", () => {
  cy.log("Removing datasets");
  cy.log("Loggin in as " + Cypress.env("secondaryUsername"));
  cy.login(Cypress.env("secondaryUsername"), Cypress.env("secondaryPassword"));
  cy.getToken().then((token) => {
    const filter = { where: {} };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/datasets?filter=" +
        encodeURIComponent(JSON.stringify(filter)),
      headers: getHeader(token),
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
      headers: getHeader(token),
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
            headers: getHeader(token),
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
      headers: getHeader(token),
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
              lbBaseUrl + "/instruments/" + encodeURIComponent(instrument.pid),
            headers: getHeader(token),
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
      headers: getHeader(token),
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
            headers: getHeader(token),
          });
        });
      });
    });
  });
});

Cypress.Commands.add("removeJobs", () => {
  cy.login(Cypress.env("username"), Cypress.env("password"));
  cy.getToken().then((token) => {
    const fields = { type: "all_access" };
    const limits = { limit: 10, skip: 0, sort: { type: "asc" } };

    cy.request({
      method: "GET",
      url:
        lbBaseUrl +
        "/jobs/fullquery?fields=" +
        encodeURIComponent(JSON.stringify(fields)) +
        "&limits=" +
        encodeURIComponent(JSON.stringify(limits)),
      headers: getHeader(token),
    })
      .its("body")
      .as("jobs");

    cy.login(
      Cypress.env("secondaryUsername"),
      Cypress.env("secondaryPassword"),
    );
    cy.getToken().then((token) => {
      cy.get("@jobs").then((jobs) => {
        jobs.forEach((job) => {
          cy.request({
            method: "DELETE",
            url: lbBaseUrl + `/jobs/${encodeURIComponent(job.id)}`,
            headers: getHeader(token),
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
      headers: getHeader(token),
    }).then(() => {
      cy.request({
        method: "POST",
        url:
          lbBaseUrl + "/elastic-search" + "/sync-database" + "?index=" + index,
        headers: getHeader(token),
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
        headers: getHeader(token),
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
      headers: getHeader(token),
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
      headers: getHeader(token),
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
            headers: getHeader(token),
          });
        });
      });
    });
  });
});
