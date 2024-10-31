import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../components/firmware-tool/ErrorPane";
import { useSerial } from "./serial";
import { decode, encode } from "universal-base64url";
import { FlashOptions } from "esptool-js";
import { FirmwareFile } from "../firmwareApi/firmwareSchemas";
import {
  fetchFirmwareControllerGetDefaultConfig,
  useFirmwareControllerBuildAll,
} from "../firmwareApi/firmwareComponents";
import { downloadZip } from "client-zip";

export const defaultFormValues = {
  release: null,
  board: {
    type: null,
    pins: {
      imuSDA: null,
      imuSCL: null,
      led: null,
    },
    ledInverted: true,
    enableLed: true,
  },
  imus: [
    {
      enabled: true,
      type: null,
      rotation: 0,
      imuINT: null,
    },
    {
      enabled: true,
      type: null,
      rotation: 0,
      imuINT: null,
    },
  ],
  battery: {
    type: null,
    resistance: null,
    r1: null,
    r2: null,
    pin: null,
  },
  swapAddresses: false,
  debug: {
    use6Axis: true,
    optimizeUpdates: true,
    complianceMode: true,
    bmi160UseTempcal: true,
    bmi160TempcalDebug: false,
    bmi160UseSenscal: true,
  },
  wifi: {
    ssid: null,
    password: null,
  },
};

export function fillMissingValues(target: any, defaults: any) {
  const result = Array.isArray(defaults) ? [...defaults] : { ...defaults };
  for (const key in target) {
    if (typeof target[key] === "object" && typeof result[key] === "object") {
      result[key] = fillMissingValues(target[key], result[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

const lf = new Intl.ListFormat("en");
const branchRestrictions: any = {};
const oldBranches = [
  "SlimeVR/v0.4.0",
  "SlimeVR/v0.3.3",
  "SlimeVR/v0.3.2",
  "ButterscotchV/v0.3.3-bno-patched",
  "ButterscotchV/alt-port-stable",
  "wigwagwent/BMI_senscal",
];
const unsupportedBranches: any = {
  IMU_BMI270: oldBranches,
  IMU_LSM6DS3TRC: oldBranches,
  IMU_LSM6DSV: oldBranches,
  IMU_LSM6DSO: oldBranches,
  IMU_LSM6DSR: oldBranches,
  IMU_MPU6050_SF: oldBranches,
};

type DownloadedFile = { infos: FirmwareFile; binary: ArrayBuffer };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useFirmwareTool() {
  const form = useForm({ defaultValues: defaultFormValues });

  const { serialConnect, espRef, disconnect, setWifi } = useSerial();

  const formValue = form.watch();

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;

    try {
      if (params.has("config")) {
        const str = decode(params.get("config") as string);

        const config = JSON.parse(str);

        // Migrate old "version" field to "release"
        if (config.version) {
          config.release = config.version;
          config.version = undefined;
        }

        // Set the initial form from the config in-case fetching fails
        form.reset(config, { keepDirty: false, keepTouched: false });

        // Update the form when the defaults are fetched
        fetchFirmwareControllerGetDefaultConfig({
          pathParams: { board: config.board.type },
        }).then((data) => {
          if (!data) return;
          form.reset(
            fillMissingValues(
              config,
              fillMissingValues(data, defaultFormValues),
            ),
            {
              keepDirty: false,
              keepTouched: false,
            },
          );
        });
      }
    } catch (e) {
      setError({
        title: "Could not load config",
        message: "",
        action: () => {
          setError(null);
          setActiveStep(0);
          window.history.replaceState(null, "", window.location.pathname);
        },
        actionText: "Reset configuration",
        consoleOutput: String(e),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formValue && formValue.board.type && formValue.release) {
      const { wifi, ...data } = formValue;
      const json = encode(JSON.stringify(data));
      window.history.replaceState(null, "", `?config=${json}`);
    }
  }, [formValue]);

  const wifi = form.watch("wifi");

  // const [wifi, setWifiSettings] = useState<{ ssid: string, password:string } | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<ErrorMessage | null>(null);
  const downloadedFilesRef = useRef<DownloadedFile[] | null>(null);
  const [statusValue, setStatusValue] = useState<number | null>(null);

  const { mutateAsync } = useFirmwareControllerBuildAll({});

  // Workaround to use the esptool-js flash function
  function arrayBufferToBinaryString(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  }

  const flash = async () => {
    if (!downloadedFilesRef.current)
      throw new Error("Download files not defined");

    setActiveStep(3);
    setStatusValue(0);

    setStatusMessage(`Connecting to ESP`);

    try {
      await serialConnect();

      if (!espRef.current) throw new Error("Invalid state. No stub ref.");

      const fileCount = downloadedFilesRef.current.length;
      const filePercents: number[] = [];
      setStatusValue(0);

      try {
        const flashOptions: FlashOptions = {
          fileArray: downloadedFilesRef.current.map((file) => {
            return {
              data: arrayBufferToBinaryString(file.binary),
              address: file.infos.offset,
            };
          }),
          flashSize: "keep",
          flashMode: "keep",
          flashFreq: "keep",
          eraseAll: false,
          compress: true,
          reportProgress: (
            fileIndex: number,
            written: number,
            total: number,
          ) => {
            filePercents[fileIndex] = (written / total) * 100;
            const percentage =
              filePercents.reduce((a, b) => a + b, 0) / fileCount;
            setStatusValue(percentage);
            setStatusMessage(`Flashing firmware (${percentage.toFixed(1)}%)`);
          },
        };
        await espRef.current.writeFlash(flashOptions);
      } catch (e) {
        console.error(e);
        setError({
          title: "Lost connection to serial",
          message: "Something went wrong while flashing the firmware.",
          action: () => {
            setError(null);
            flash();
          },
          actionText: "Retry",
          consoleOutput: String(e),
        });
        await disconnect();
        return;
      }

      setActiveStep(4);
      if (wifi?.ssid) {
        setStatusMessage(`Setting WiFi credentials`);
        setStatusValue(null);
        await sleep(1000);

        try {
          await setWifi(wifi.ssid, wifi?.password ?? "");
        } catch (e) {
          console.error(e);
          if (e instanceof Error && e.cause === "Invalid credentials") {
            setError({
              title: "Could not connect to WiFi, invalid credentials",
              message: "Check the configuration.",
              action: () => {
                setError(null);
                setActiveStep(0);
              },
              actionText: "Return to configuration",
              consoleOutput: String(e),
            });
          } else {
            setError({
              title: "Lost connection to serial",
              message:
                "Something went wrong while setting the WiFi credentials",
              action: () => {
                setError(null);
                flash();
              },
              actionText: "Retry",
              consoleOutput: String(e),
            });
          }
          await disconnect();
          return;
        }
      }
      await disconnect();
      setActiveStep(5);
    } catch (e) {
      setError({
        title: "Unable to connect to serial",
        message:
          "Check that you have the right drivers. You can also hold the Boot button on your ESP if you have one.",
        action: () => {
          setError(null);
          flash();
        },
        actionText: "Retry",
        consoleOutput: String(e),
      });
      await disconnect();
      throw e;
    }
  };

  const downloadBuild = async (
    _id: string,
    firmwareFiles: FirmwareFile[],
    saveZip: boolean,
  ) => {
    setActiveStep(2);

    setStatusMessage("Downloading firmware");

    const firmwaresBytes = await Promise.all(
      firmwareFiles.map(({ url }) =>
        fetch(`${import.meta.env.VITE_SLIMEVR_S3}/${url}`).then((res) =>
          res.arrayBuffer(),
        ),
      ),
    );

    downloadedFilesRef.current = firmwareFiles.map((file, index) => ({
      infos: file,
      binary: firmwaresBytes[index],
    }));

    if (saveZip) {
      const firmwareBlob = await downloadZip([
        {
          name: "file-offsets.json",
          input: JSON.stringify(
            firmwareFiles.map((file, index) => ({
              file: `firmware-part-${index}.bin`,
              offset: file.offset,
            })),
          ),
        },
        ...firmwaresBytes.map((bytes, index) => ({
          name: `firmware-part-${index}.bin`,
          input: bytes,
        })),
      ]).blob();

      // Make and click a temporary link to download the Blob
      const link = document.createElement("a");
      link.href = URL.createObjectURL(firmwareBlob);
      link.download = "firmware.zip";
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();

      setActiveStep(5);
    } else {
      flash();
    }
  };

  const buildConfig = async (buildSettings: any, saveZip: boolean) => {
    const { wifi, ...data }: any = buildSettings;

    setStatusMessage("Validating configuration");
    setActiveStep(1);

    const release = `${buildSettings.release.owner}/${buildSettings.release.version}`;
    for (const imu of buildSettings.imus?.map(
      (imu: { type: string }) => imu.type,
    ) ?? []) {
      const imuBranchRestrictions: string[] | undefined =
        branchRestrictions[imu];
      if (imuBranchRestrictions && !imuBranchRestrictions.includes(release)) {
        setError({
          title: "Invalid configuration",
          message: `${imu} is only supported by ${lf.format(imuBranchRestrictions)}.`,
          action: () => {
            setError(null);
            setActiveStep(0);
          },
          actionText: "Go back to configuration",
        });
        return;
      }

      const imuUnsupportedBranches: string[] | undefined =
        unsupportedBranches[imu];
      if (imuUnsupportedBranches && imuUnsupportedBranches.includes(release)) {
        setError({
          title: "Invalid configuration",
          message: `${imu} is not supported by ${lf.format(imuUnsupportedBranches)}.`,
          action: () => {
            setError(null);
            setActiveStep(0);
          },
          actionText: "Go back to configuration",
        });
        return;
      }
    }

    const connectError = {
      title: "Unable to connect to serial",
      message:
        "Check that you have the right drivers. You can also hold the boot button on your esp if you have one. Also check that you dont have any program like SlimeVR server or Cura Open.",
      action: () => {
        setError(null);
        buildConfig(buildSettings, saveZip);
      },
      actionText: "Retry",
    };

    if (!saveZip) {
      setStatusMessage("Connecting to ESP");
      try {
        await serialConnect();
      } catch (e) {
        setError({ ...connectError, consoleOutput: String(e) });
        return;
      }
    }

    setStatusMessage("Start building");
    const res = await mutateAsync({ body: data }).catch((e) => {
      // Seems this is usually required lol
      e.toString = Error.prototype.toString;
      setError({
        title: "Unable to build the firmware",
        message: "Unknown server error.",
        action: () => {
          setError(null);
          buildConfig(buildSettings, saveZip);
        },
        actionText: "Retry",
        consoleOutput: String(e),
      });
      throw e;
    });

    try {
      const buildFailedError = {
        title: "Unable to build the firmware",
        message: "Check the configuration.",
        action: () => {
          setError(null);
          setActiveStep(0);
        },
        actionText: "Go back to configuration",
      };

      if (res.status === "BUILDING") {
        const events = new EventSource(
          `${import.meta.env.VITE_API_BASE}/firmwares/build-status/${res.id}`,
        );
        events.onmessage = ({ data }) => {
          const {
            buildStatus,
            id,
            message,
            firmwareFiles,
          }: {
            buildStatus: string;
            id: string;
            message: string;
            firmwareFiles?: FirmwareFile[];
          } = JSON.parse(data);

          setStatusMessage(message);
          if (buildStatus === "DONE") {
            downloadBuild(id, firmwareFiles!, saveZip);
          } else if (buildStatus === "FAILED") {
            setError(buildFailedError);
          }
        };
      } else if (res.status === "DONE") {
        downloadBuild(res.id, res.firmwareFiles!, saveZip);
      } else if (res.status === "FAILED") {
        setError(buildFailedError);
      }
    } catch (e) {
      setError({ ...connectError, consoleOutput: String(e) });
      throw e;
    }
  };

  return {
    form,
    activeStep,
    statusMessage,
    error,
    statusValue,
    buildConfig,
    flash,
    toConfig: () => {
      setActiveStep(0);
      setError(null);
    },
  };
}
