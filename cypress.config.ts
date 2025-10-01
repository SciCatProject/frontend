import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

export default defineConfig({
  env: {
    baseUrl: "http://localhost:3000/api/v3",
    loginEndpoint: "/auth/login",
    tokenPrefix: "Bearer",
    username: "admin",
    password: "27f5fd86ae68fe740eef42b8bbd1d7d5",
    secondaryUsername: "archiveManager",
    secondaryPassword: "6d3b76392e6f41b087c11f8b77e3f9de",
    guestUsername: "user1",
    guestUserEmail: "user1@your.site",
    guestPassword: "a609316768619f154ef58db4d847b75e",
  },
  e2e: {
    baseUrl: "http://localhost:4200",
    viewportWidth: 1280,
    defaultCommandTimeout: 10000,
    retries: 1,
  },
  video: true,
  videosFolder: "cypress/videos",
  // workaround to delete videos of passed tests
  // https://docs.cypress.io/app/guides/screenshots-and-videos#Only-upload-videos-for-specs-with-failing-or-retried-tests
  setupNodeEvents(on, config) {
    on(
      "after:spec",
      (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === "failed"),
          );
          if (!failures) {
            const videosDir = path.resolve(
              config.projectRoot,
              config.videosFolder,
            );
            const target = path.resolve(results.video);
            const rel = path.relative(videosDir, target);

            // Ensure the video is inside the videos folder
            if (!rel.startsWith("..") && !path.isAbsolute(rel)) {
              try {
                fs.unlinkSync(target);
              } catch {}
            }
          }
        }
      },
    );
  },
});
