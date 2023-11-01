import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:80",
    lbBaseUrl: "http://localhost:80/api/v3",
    lbLoginEndpoint: "/Users/login",
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
