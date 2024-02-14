/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type BoardPins = {
  imuSDA: string;
  imuSCL: string;
  /**
   * @default 2
   */
  led?: string;
};

export type FirmwareBoardDTO = {
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
  /**
   * @default true
   */
  ledInverted?: boolean;
  /**
   * @default true
   */
  enableLed?: boolean;
};

export type IMUConfigDTO = {
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
    | "IMU_ICM42688";
  rotation: number;
  imuINT?: string;
};

export type BatteryDTO = {
  type:
    | "BAT_EXTERNAL"
    | "BAT_INTERNAL"
    | "BAT_MCP3021"
    | "BAT_INTERNAL_MCP3021";
  /**
   * @default 180
   */
  resistance: number;
  /**
   * @default 100
   */
  r1: number;
  /**
   * @default 220
   */
  r2: number;
  pin: string;
};

export type BuildFirmwareDTO = {
  version: string;
  board: FirmwareBoardDTO;
  imus: IMUConfigDTO[];
  battery?: BatteryDTO;
  swapAddresses?: boolean;
};

export type FirmwareFile = {
  url: string;
  offset: number;
};

export type Firmware = {
  id: string;
  releaseID: string;
  buildStatus: "BUILDING" | "DONE" | "FAILED";
  buildConfig: BuildFirmwareDTO;
  firmwareFiles?: FirmwareFile[];
  /**
   * @format date-time
   */
  creationDate: string;
  /**
   * @format date-time
   */
  updateDate: string;
};

export type BuildResponse = {
  id: string;
  status: "BUILDING" | "DONE" | "FAILED";
  firmwareFiles?: FirmwareFile[];
};

export type BoardTypeBoard = {
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
};

export type ReleaseDTO = {
  id: string;
  url: string;
  name: string;
  zipball_url: string;
  prerelease: boolean;
  draft: boolean;
};

export type Imudto = {
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
    | "IMU_ICM42688";
  hasIntPin: boolean;
};
