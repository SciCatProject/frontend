import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:4200",
    lbBaseUrl: "http://localhost:3000/api/v3",
    lbLoginEndpoint: "/Users/login",
    lbTokenPrefix: "Bearer ",
    viewportWidth: 1280,
    username: "admin",
    password: "veIKtDrHHqlDEZL51bbpo2XCDYvcMmu",
    secondaryUsername: "archiveManager",
    secondaryPassword: "veIKtDrHHqlDEZL51bbpo2XCDYvcMmu",
    guestUsername: "user1",
    guestUserEmail: "user1@your.site",
    guestPassword: "a609316768619f154ef58db4d847b75e",
    defaultCommandTimeout: 10000,
    retries: 1,
  },
});
