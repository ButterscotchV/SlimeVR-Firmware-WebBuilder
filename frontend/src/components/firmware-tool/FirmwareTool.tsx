import { Alert, Container, Link, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { ConfigurationForm } from "./ConfigrationForm";
import { ErrorPane } from "./ErrorPane";
import { FinishStep } from "./FinisStep";
import { ProgressStep } from "./ProgressStep";
import { useSerial } from "../../hooks/serial";
import { useFirmwareTool } from "../../hooks/firmware-tool";


const steps = ['Configuration', 'Building', 'Downloading', 'Flashing', 'Done'];

const link = (href: string, text: string, prefix: string = "https://") => {
    return <Link target="_blank" rel="noopener" href={`${prefix}${href}`}>{text}</Link>
}
const ghLink = (owner: string, branch: string, repo: string = "SlimeVR-Tracker-ESP") => {
    return link(`github.com/${owner}/${repo}/tree/${branch}`, `${owner}/${branch}`)
}


export function FirmwareTool() {

    const { serialSupported } = useSerial();
    const { flash, activeStep, error, buildConfig, form, statusValue, statusMessage, toConfig } = useFirmwareTool();


    const doAnother = () => {
        flash()
    }

    return (
        <Container component="main" maxWidth="md" sx={{ my: 3 }}>
            {!serialSupported &&
                <Alert variant="filled" severity="error" sx={{ my: 2 }}>
                    This Browser does not support the WebSerial API.
                    <p>Please use a different browser. (Chrome, Microsoft Edge or Opera)</p>
                </Alert>
            }
            <Alert variant="filled" severity="warning" sx={{ my: 2 }}>
                This is an experimental version of the SlimeVR Firmware Tool run by Butterscotch, you can find the official one {link("slimevr-firmware-tool.futurabeast.com/", "here")}.
            </Alert>
            <Alert variant="outlined" severity="info" sx={{ my: 2 }}>
                SlimeVR/vX.X.X - SlimeVR stable release(s)
                <p>{ghLink("SlimeVR", "main")} - SlimeVR development branch</p>
                <p>{ghLink("deiteris", "qmc-mag-new")} - For use with the MPU6050/MPU6500 + QMC5883L external magnetometer configuration</p>
                <p>{ghLink("deiteris", "hmc-mag")} - For use with the MPU6050/MPU6500 + HMC5883L external magnetometer configuration</p>
                <p>{ghLink("TheBug233", "qmc-axis-aligned-en", "SlimeVR-Tracker-ESP-For-Kitkat")} - Forked from "deiteris/qmc-mag-new", but XYZ axis aligned</p>
                <p>{ghLink("Lupinixx", "mpu6050-fifo")} - Attempts to use a FIFO + VQF filter for MPU6050/MPU6500</p>
                <p>{ghLink("ButterscotchV", "v0.3.3-bno-patched")} - Release SlimeVR/v0.3.3 with BNO patched</p>
                <p>{ghLink("ButterscotchV", "mag-enabled-stable")} - The latest stable firmware release with 9 DoF ICM-20948 and BNO0xx (magnetometer enabled)</p>
                <p>{ghLink("ButterscotchV", "mag-enabled-main")} - Based off SlimeVR/main with 9 DoF ICM-20948 and BNO0xx (magnetometer enabled)</p>
                <p>{ghLink("ButterscotchV", "alt-port-stable")} - The latest stable firmware release with "trackerPort" set to 6970 instead of 6969</p>
                <p>{ghLink("ButterscotchV", "alt-port-main")} - Based off SlimeVR/main with "trackerPort" set to 6970 instead of 6969</p>
                <p>{ghLink("nekomona", "unify-fusion")} - Unifying sensor fusion code</p>
                <p>{ghLink("l0ud", "main", "SlimeVR-Tracker-ESP-BMI270")} - Adds support for the BMI270 and includes ESP32-C3 fixes</p>
                <p>{ghLink("furrycoding", "mpu6050_nodmp")} - Adds a new sensor that uses MPU-6050 without the DMP (sensor fusion in software)</p>
            </Alert>
            <Alert variant="filled" severity="warning" sx={{ my: 2 }}>
                IMPORTANT: {ghLink("SlimeVR", "v0.3.3")} is now being redirected to {ghLink("ButterscotchV", "v0.3.3-bno-patched")}. Using BNOs with v0.3.3 is still not recommended, but it should work with the patch. The original release can still be found on the SlimeVR repository.
            </Alert>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 3 }, p: { xs: 1, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Configure your firmware
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }} orientation="vertical">
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {error && <ErrorPane error={error}></ErrorPane>}
                                
                                {!error &&
                                    <>
                                        {activeStep === 0 && <ConfigurationForm form={form} nextStep={buildConfig}/>}
                                        {(activeStep > 0 && activeStep < 4) && <ProgressStep value={statusValue} message={statusMessage} showRickOption={activeStep === 3}></ProgressStep>}
                                        {(activeStep === 4) && <FinishStep doAnother={doAnother} toConfig={toConfig}/>}
                                    </>
                                }
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </Paper>
        </Container>
    )
}