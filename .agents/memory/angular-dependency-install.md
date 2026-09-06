---
name: Angular dependency install
description: Dependency-install constraints discovered while setting up the imported Angular project.
---

The imported Angular project currently has a package-lock that does not match package.json, and a normal npm install is blocked by the Replit package firewall on a stale transitive tar archive. Do not bypass the firewall; refresh the dependency graph through the supported package-management flow before relying on a local build.

**Why:** A clean install cannot complete in the current state, so build verification and preview startup are blocked independently of the application code.

**How to apply:** Before the next runtime verification, update the Angular dependency graph/lockfile using safe current versions, then reinstall and run the Angular build.