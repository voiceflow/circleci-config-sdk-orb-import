// TODO: Remove this file once https://github.com/CircleCI-Public/visual-config-editor/issues/296 is fixed
import { orb, parameters } from "@circleci/circleci-config-sdk";
import {
  CommandParameterLiteral,
  ExecutorParameterLiteral,
  JobParameterLiteral,
} from "@circleci/circleci-config-sdk/dist/src/lib/Components/Parameters/types/CustomParameterLiterals.types";
import OrbImport = orb.OrbImport;
import OrbRef = orb.OrbRef;
import CustomParametersList = parameters.CustomParametersList;

export const noParamJob = (
  name: string,
  orbImport: OrbImport
): OrbRef<JobParameterLiteral> =>
  new OrbRef(name, new CustomParametersList([]), orbImport);

export const noParamExecutor = (
  name: string,
  orbImport: OrbImport
): OrbRef<ExecutorParameterLiteral> =>
  new OrbRef(name, new CustomParametersList([]), orbImport);

export const noParamCommand = (
  name: string,
  orbImport: OrbImport
): OrbRef<CommandParameterLiteral> =>
  new OrbRef(name, new CustomParametersList([]), orbImport);
