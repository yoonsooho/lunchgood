import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5789",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
