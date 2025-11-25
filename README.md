> [!CAUTION]
> Update Nov 24, 2025: This repository has been archived and will not accept further changes.

# Orb Import for CircleCI Config SDK

[![NPM Version](https://img.shields.io/npm/v/@voiceflow/circleci-config-sdk-orb-import)](https://www.npmjs.com/package/@voiceflow/circleci-config-sdk-orb-import)
[![License](https://img.shields.io/badge/license-ISC-green)](./LICENSE)

This package allows you to import and use external orbs with the [CircleCI Config SDK](https://github.com/CircleCI-Public/circleci-config-sdk-ts).

## Installation

Using npm:
```
   npm install @voiceflow/circleci-config-sdk-orb-import 
```

Using yarn:
```
    yarn add @voiceflow/circleci-config-sdk-orb-import 
```

## Usage

This package provides a single function, `importOrb`, to fetch the manifest for an external orb and return them as an `OrbImport` compatible with the [CircleCI Config SDK](https://github.com/CircleCI-Public/circleci-config-sdk-ts).

```typescript
import * as CircleCI from "@circleci/circleci-config-sdk";
import { importOrb } from "circleci-config-sdk-orb-import";

// Instantiate a new Config
const config = new CircleCI.Config();

// Use the importOrb function to fetch a given external orb
// This is equivalent to putting `node: circleci/node@5.0.3` in the `.circleci/config.yml` file
const node = await importOrb({
  alias: "node",
  namespace: "circleci",
  orb: "node",
  version: "5.0.3",
});

// Add the imported orb to the generated config
config.importOrb(node);

// Use an executor from the orb in your jobs
const exampleExecutor = new CircleCI.reusable.ReusedExecutor(
  node.executors["default"],
  {
    tag: "16",
  }
);

const exampleJob = new CircleCI.Job("install-node", exampleExecutor, [
  new CircleCI.commands.Checkout(),
  // Use a command from the orb in your jobs
  new CircleCI.reusable.ReusedCommand(node.commands["install-packages"], {
    "check-cache": "always",
    "pkg-manager": "yarn-berry",
  }),
]);
config.addJob(exampleJob);

const exampleWorkflow = new CircleCI.Workflow("example", [
  exampleJob,
  // Use a job from the orb in your workflows
  new CircleCI.workflow.WorkflowJob(node.jobs["run"], {
    "yarn-run": "build",
  }),
]);
config.addWorkflow(exampleWorkflow);
```

The above config generates the following YAML config:
```yaml
version: 2.1
setup: false
jobs:
  install-node:
    executor:
      name: node/default
      tag: "16"
    steps:
      - checkout
      - node/install-packages:
          check-cache: always
          pkg-manager: yarn-berry
workflows:
  example:
    jobs:
      - install-node
      - node/run:
          yarn-run: build
orbs:
  node: circleci/node@5.0.3

```

## Compatibility

This version has been tested with version `0.10.1` of the CircleCI Config SDK. Compatibility with other versions cannot be guaranteed.

## License

Licensed under ISC
