import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    lbBaseUrl: "http://localhost:3000/api/v3",
    lbLoginEndpoint: "/Users/login?include=user",
    lbTokenPrefix: "Bearer ",
    viewportWidth: 1280,
    username: "admin",
    password: "am2jf70TPNZsSan",
    secondaryUsername: "archiveManager",
    secondaryPassword: "aman",
    guestUsername: "user1",
    guestUserEmail: "user1@your.site",
    guestPassword: "a609316768619f154ef58db4d847b75e",
    defaultCommandTimeout: 10000,
    retries: 1,
  },
});
