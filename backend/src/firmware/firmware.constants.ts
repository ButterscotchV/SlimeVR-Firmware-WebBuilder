// In the format of [owner, [repo, [branches]]]
import firmares from "./firmwares.json";
import boardDefaults from "./board-defaults.json";
export const AVAILABLE_FIRMWARE_REPOS = firmares;
export const BOARD_DEFAULTS = boardDefaults;

export function getFirmwareBranches(
  owner: string,
  repo: string,
): [{ branch: string; description: string }] | undefined {
  return AVAILABLE_FIRMWARE_REPOS[owner]?.[repo];
}

export function getFirmwareBranch(
  owner: string,
  repo: string,
  branch: string,
): { branch: string; description: string } | undefined {
  return getFirmwareBranches(owner, repo)?.find((b) => b.branch === branch);
}
