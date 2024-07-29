import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    lbBaseUrl: "http://localhost:8080/api/v3",
    lbLoginEndpoint: "/Users/login",
    lbTokenPrefix: "Bearer ",
    viewportWidth: 1280,
    username: "admin",
    password: "27f5fd86ae68fe740eef42b8bbd1d7d5",
    secondaryUsername: "archiveManager",
    secondaryPassword: "6d3b76392e6f41b087c11f8b77e3f9de",
    guestUsername: "user1",
    guestUserEmail: "user1@your.site",
    guestPassword: "a609316768619f154ef58db4d847b75e",
    defaultCommandTimeout: 10000,
    retries: 1,
  },
});
