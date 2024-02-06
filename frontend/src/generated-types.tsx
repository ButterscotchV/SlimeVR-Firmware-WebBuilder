/* Generated by restful-react */

import React from "react";
import {
  Get,
  GetProps,
  useGet,
  UseGetProps,
  Mutate,
  MutateProps,
  useMutate,
  UseMutateProps,
} from "restful-react";
export const SPEC_VERSION = "1.0";
export interface BoardPins {
  imuSDA: string;
  imuSCL: string;
  led?: string;
}

export interface FirmwareBoardDTO {
  type:
    | "BOARD_SLIMEVR"
    | "BOARD_SLIMEVR_DEV"
    | "BOARD_NODEMCU"
    | "BOARD_WEMOSD1MINI"
    | "BOARD_TTGO_TBASE"
    | "BOARD_WEMOSWROOM02"
    | "BOARD_WROOM32"
    | "BOARD_ESP01"
    | "BOARD_LOLIN_C3_MINI"
    | "BOARD_BEETLE32C3"
    | "BOARD_ES32C3DEVKITM1";
  pins?: BoardPins;
  ledInverted?: boolean;
  enableLed?: boolean;
}

export interface IMUConfigDTO {
  type:
    | "IMU_MPU9250"
    | "IMU_MPU6500"
    | "IMU_BNO080"
    | "IMU_BNO085"
    | "IMU_BNO055"
    | "IMU_BNO086"
    | "IMU_MPU6050"
    | "IMU_BMI160"
    | "IMU_ICM20948"
    | "IMU_BMI270"
    | "IMU_MPU6500_NODMP"
    | "IMU_MPU6050_NODMP"
    | "IMU_LSM6DSV"
    | "IMU_LSM6DS3TRC"
    | "IMU_ICM42688P";
  rotation: number;
  imuINT?: string;
}

export interface BatteryDTO {
  type:
    | "BAT_EXTERNAL"
    | "BAT_INTERNAL"
    | "BAT_MCP3021"
    | "BAT_INTERNAL_MCP3021";
  resistance: number;
  r1: number;
  r2: number;
  pin: string;
}

export interface BuildFirmwareDTO {
  version: string;
  board: FirmwareBoardDTO;
  imus: IMUConfigDTO[];
  battery?: BatteryDTO;
  swapAddresses?: boolean;
}

export interface FirmwareFile {
  url: string;
  offset: number;
}

export interface Firmware {
  id: string;
  releaseID: string;
  buildStatus: "BUILDING" | "DONE" | "FAILED";
  buildConfig: BuildFirmwareDTO;
  firmwareFiles?: FirmwareFile[];
  creationDate: string;
  updateDate: string;
}

export interface BuildResponse {
  id: string;
  status: "BUILDING" | "DONE" | "FAILED";
  firmwareFiles?: FirmwareFile[];
}

export interface BoardTypeBoard {
  boardType:
    | "BOARD_SLIMEVR"
    | "BOARD_SLIMEVR_DEV"
    | "BOARD_NODEMCU"
    | "BOARD_WEMOSD1MINI"
    | "BOARD_TTGO_TBASE"
    | "BOARD_WEMOSWROOM02"
    | "BOARD_WROOM32"
    | "BOARD_ESP01"
    | "BOARD_LOLIN_C3_MINI"
    | "BOARD_BEETLE32C3"
    | "BOARD_ES32C3DEVKITM1";
}

export interface ReleaseDTO {
  id: string;
  url: string;
  name: string;
  zipball_url: string;
  prerelease: boolean;
  draft: boolean;
}

export interface Imudto {
  type:
    | "IMU_MPU9250"
    | "IMU_MPU6500"
    | "IMU_BNO080"
    | "IMU_BNO085"
    | "IMU_BNO055"
    | "IMU_BNO086"
    | "IMU_MPU6050"
    | "IMU_BMI160"
    | "IMU_ICM20948"
    | "IMU_BMI270"
    | "IMU_MPU6500_NODMP"
    | "IMU_MPU6050_NODMP"
    | "IMU_LSM6DSV"
    | "IMU_LSM6DS3TRC"
    | "IMU_ICM42688P";
  hasIntPin: boolean;
}

export type FirmwareControllerGetFirmwaresProps = Omit<
  GetProps<void, Firmware[], void, void>,
  "path"
>;

export const FirmwareControllerGetFirmwares = (
  props: FirmwareControllerGetFirmwaresProps,
) => <Get<void, Firmware[], void, void> path={`/firmwares`} {...props} />;

export type UseFirmwareControllerGetFirmwaresProps = Omit<
  UseGetProps<void, Firmware[], void, void>,
  "path"
>;

export const useFirmwareControllerGetFirmwares = (
  props: UseFirmwareControllerGetFirmwaresProps,
) => useGet<void, Firmware[], void, void>(`/firmwares`, props);

export type FirmwareControllerBuildAllProps = Omit<
  MutateProps<BuildResponse, void, void, BuildFirmwareDTO, void>,
  "path" | "verb"
>;

/**
 * Build a specific configuration of the firmware
 */
export const FirmwareControllerBuildAll = (
  props: FirmwareControllerBuildAllProps,
) => (
  <Mutate<BuildResponse, void, void, BuildFirmwareDTO, void>
    verb="POST"
    path={`/firmwares/build`}
    {...props}
  />
);

export type UseFirmwareControllerBuildAllProps = Omit<
  UseMutateProps<BuildResponse, void, void, BuildFirmwareDTO, void>,
  "path" | "verb"
>;

/**
 * Build a specific configuration of the firmware
 */
export const useFirmwareControllerBuildAll = (
  props: UseFirmwareControllerBuildAllProps,
) =>
  useMutate<BuildResponse, void, void, BuildFirmwareDTO, void>(
    "POST",
    `/firmwares/build`,
    props,
  );

export interface FirmwareControllerBuildStatusPathParams {
  id: string;
}

export type FirmwareControllerBuildStatusProps = Omit<
  GetProps<void, unknown, void, FirmwareControllerBuildStatusPathParams>,
  "path"
> &
  FirmwareControllerBuildStatusPathParams;

export const FirmwareControllerBuildStatus = ({
  id,
  ...props
}: FirmwareControllerBuildStatusProps) => (
  <Get<void, unknown, void, FirmwareControllerBuildStatusPathParams>
    path={`/firmwares/build-status/${id}`}
    {...props}
  />
);

export type UseFirmwareControllerBuildStatusProps = Omit<
  UseGetProps<void, unknown, void, FirmwareControllerBuildStatusPathParams>,
  "path"
> &
  FirmwareControllerBuildStatusPathParams;

export const useFirmwareControllerBuildStatus = ({
  id,
  ...props
}: UseFirmwareControllerBuildStatusProps) =>
  useGet<void, unknown, void, FirmwareControllerBuildStatusPathParams>(
    (paramsInPath: FirmwareControllerBuildStatusPathParams) =>
      `/firmwares/build-status/${paramsInPath.id}`,
    { pathParams: { id }, ...props },
  );

export type FirmwareControllerGetBoardsTypesProps = Omit<
  GetProps<BoardTypeBoard[], unknown, void, void>,
  "path"
>;

export const FirmwareControllerGetBoardsTypes = (
  props: FirmwareControllerGetBoardsTypesProps,
) => (
  <Get<BoardTypeBoard[], unknown, void, void>
    path={`/firmwares/boards`}
    {...props}
  />
);

export type UseFirmwareControllerGetBoardsTypesProps = Omit<
  UseGetProps<BoardTypeBoard[], unknown, void, void>,
  "path"
>;

export const useFirmwareControllerGetBoardsTypes = (
  props: UseFirmwareControllerGetBoardsTypesProps,
) => useGet<BoardTypeBoard[], unknown, void, void>(`/firmwares/boards`, props);

export type FirmwareControllerGetVersionsProps = Omit<
  GetProps<ReleaseDTO[], unknown, void, void>,
  "path"
>;

export const FirmwareControllerGetVersions = (
  props: FirmwareControllerGetVersionsProps,
) => (
  <Get<ReleaseDTO[], unknown, void, void>
    path={`/firmwares/versions`}
    {...props}
  />
);

export type UseFirmwareControllerGetVersionsProps = Omit<
  UseGetProps<ReleaseDTO[], unknown, void, void>,
  "path"
>;

export const useFirmwareControllerGetVersions = (
  props: UseFirmwareControllerGetVersionsProps,
) => useGet<ReleaseDTO[], unknown, void, void>(`/firmwares/versions`, props);

export type FirmwareControllerGetIMUSTypesProps = Omit<
  GetProps<Imudto[], unknown, void, void>,
  "path"
>;

export const FirmwareControllerGetIMUSTypes = (
  props: FirmwareControllerGetIMUSTypesProps,
) => <Get<Imudto[], unknown, void, void> path={`/firmwares/imus`} {...props} />;

export type UseFirmwareControllerGetIMUSTypesProps = Omit<
  UseGetProps<Imudto[], unknown, void, void>,
  "path"
>;

export const useFirmwareControllerGetIMUSTypes = (
  props: UseFirmwareControllerGetIMUSTypesProps,
) => useGet<Imudto[], unknown, void, void>(`/firmwares/imus`, props);

export type FirmwareControllerGetBatteriesTypesProps = Omit<
  GetProps<string[], unknown, void, void>,
  "path"
>;

export const FirmwareControllerGetBatteriesTypes = (
  props: FirmwareControllerGetBatteriesTypesProps,
) => (
  <Get<string[], unknown, void, void>
    path={`/firmwares/batteries`}
    {...props}
  />
);

export type UseFirmwareControllerGetBatteriesTypesProps = Omit<
  UseGetProps<string[], unknown, void, void>,
  "path"
>;

export const useFirmwareControllerGetBatteriesTypes = (
  props: UseFirmwareControllerGetBatteriesTypesProps,
) => useGet<string[], unknown, void, void>(`/firmwares/batteries`, props);

export interface FirmwareControllerGetDefaultConfigPathParams {
  board: string;
}

export type FirmwareControllerGetDefaultConfigProps = Omit<
  GetProps<
    BuildFirmwareDTO,
    unknown,
    void,
    FirmwareControllerGetDefaultConfigPathParams
  >,
  "path"
> &
  FirmwareControllerGetDefaultConfigPathParams;

export const FirmwareControllerGetDefaultConfig = ({
  board,
  ...props
}: FirmwareControllerGetDefaultConfigProps) => (
  <Get<
    BuildFirmwareDTO,
    unknown,
    void,
    FirmwareControllerGetDefaultConfigPathParams
  >
    path={`/firmwares/default-config/${board}`}
    {...props}
  />
);

export type UseFirmwareControllerGetDefaultConfigProps = Omit<
  UseGetProps<
    BuildFirmwareDTO,
    unknown,
    void,
    FirmwareControllerGetDefaultConfigPathParams
  >,
  "path"
> &
  FirmwareControllerGetDefaultConfigPathParams;

export const useFirmwareControllerGetDefaultConfig = ({
  board,
  ...props
}: UseFirmwareControllerGetDefaultConfigProps) =>
  useGet<
    BuildFirmwareDTO,
    unknown,
    void,
    FirmwareControllerGetDefaultConfigPathParams
  >(
    (paramsInPath: FirmwareControllerGetDefaultConfigPathParams) =>
      `/firmwares/default-config/${paramsInPath.board}`,
    { pathParams: { board }, ...props },
  );

export interface FirmwareControllerGetFirmwarePathParams {
  id: string;
}

export type FirmwareControllerGetFirmwareProps = Omit<
  GetProps<
    void,
    void | Firmware,
    void,
    FirmwareControllerGetFirmwarePathParams
  >,
  "path"
> &
  FirmwareControllerGetFirmwarePathParams;

export const FirmwareControllerGetFirmware = ({
  id,
  ...props
}: FirmwareControllerGetFirmwareProps) => (
  <Get<void, void | Firmware, void, FirmwareControllerGetFirmwarePathParams>
    path={`/firmwares/${id}`}
    {...props}
  />
);

export type UseFirmwareControllerGetFirmwareProps = Omit<
  UseGetProps<
    void,
    void | Firmware,
    void,
    FirmwareControllerGetFirmwarePathParams
  >,
  "path"
> &
  FirmwareControllerGetFirmwarePathParams;

export const useFirmwareControllerGetFirmware = ({
  id,
  ...props
}: UseFirmwareControllerGetFirmwareProps) =>
  useGet<void, void | Firmware, void, FirmwareControllerGetFirmwarePathParams>(
    (paramsInPath: FirmwareControllerGetFirmwarePathParams) =>
      `/firmwares/${paramsInPath.id}`,
    { pathParams: { id }, ...props },
  );
