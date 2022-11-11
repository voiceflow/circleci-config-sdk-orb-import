import { parseOrbManifest } from "@circleci/circleci-config-parser";
import { orb } from "@circleci/circleci-config-sdk";
import { OrbImportManifest } from "@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types";
import { fetch } from "undici";
import { parse } from "yaml";
import OrbImport = orb.OrbImport;

export interface OrbVersionRef {
  owner: string;
  orb: string;
  version: string;
}

export type OrbImportRef = { alias: string } & OrbVersionRef;

/// Downloads the manifest for the given orb and generates the `OrbImport` for use in the SDK
export async function importOrb({
  alias,
  owner,
  orb,
  version,
}: OrbImportRef): Promise<OrbImport> {
  const source = await fetchOrbSource({ owner, orb, version });
  const manifest = await generateOrbManifestFromSource(source);
  return new OrbImport(alias, owner, orb, version, undefined, manifest);
}

// Fetches the YAML source for the specified orb
export async function fetchOrbSource({
  owner,
  orb,
  version,
}: OrbVersionRef): Promise<string> {
  const orbVersionRef = `${owner}/${orb}@${version}`;
  const response = await fetch("https://circleci.com/graphql-unstable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ($orbVersionRef: String!) {
          orbVersion(orbVersionRef: $orbVersionRef) {
            source
          }
        }
      `,
      variables: { orbVersionRef },
    }),
  });
  return ((await response.json()) as any).data.orbVersion.source;
}

// Generates the orb manifest from the orb source YAML
export function generateOrbManifestFromSource(
  sourceYaml: string
): OrbImportManifest {
  const source = parse(sourceYaml);
  /* eslint-disable no-restricted-syntax */
  for (const componentType of ["jobs", "commands", "executors"]) {
    // eslint-disable-next-line guard-for-in
    for (const componentName in source[componentType]) {
      const parameterList = source[componentType][componentName].parameters;
      source[componentType][componentName] = parameterList || {};
    }
  }
  /* eslint-enable no-restricted-syntax */
  return parseOrbManifest(source) as OrbImportManifest;
}
