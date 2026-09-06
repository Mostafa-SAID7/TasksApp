---
name: Angular dependency install
description: Dependency-install constraints discovered while setting up the imported Angular project.
---

The imported Angular project initially had a package-lock mismatch, and a normal npm install is blocked by the Replit package firewall on the transitive tar archive (both the existing 6.x resolution and a newer 7.x resolution were rejected). Do not bypass the firewall; refresh the dependency graph through the supported package-management flow before relying on a local build.

**Why:** A clean install cannot complete in the current state, so build verification and preview startup are blocked independently of the application code.

**How to apply:** Before the next runtime verification, update the Angular dependency graph/lockfile using safe current versions, then reinstall and run the Angular build.