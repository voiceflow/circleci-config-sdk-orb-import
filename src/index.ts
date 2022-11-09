import { orb } from "@circleci/circleci-config-sdk";
import { OrbImportManifest } from "@circleci/circleci-config-sdk/dist/src/lib/Orb/types/Orb.types";
import { fetch } from "undici";
import OrbImport = orb.OrbImport;

export async function importOrb(
  alias: string,
  namespace: string,
  orb: string,
  version: string
): Promise<OrbImport> {
  const manifest = await fetchOrbManifest(`${namespace}/${orb}@${version}`);
  return new OrbImport(alias, namespace, orb, version, "", manifest);
}

async function fetchOrbManifest(orbId: string): Promise<OrbImportManifest> {
  const endpoint = "https://orb-indexer-proxy.herokuapp.com";
  const response = await fetch(
    `${endpoint}/orbs?orb=${encodeURIComponent(orbId)}`
  );
  return response.json() as Promise<OrbImportManifest>;
}


// TODO: Remove this export once https://github.com/CircleCI-Public/visual-config-editor/issues/296 is fixed
export * from './no-parameters'