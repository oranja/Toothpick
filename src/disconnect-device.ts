import { getPreferenceValues, showToast, Toast } from "@raycast/api";
import { ratio } from "fuzzball";
import { disconnectDevice } from "./helpers/devices";
import { getDevices } from "./services/devices";

export default async (props: { arguments: { nameOrMacAddress: string } }) => {
  const { fuzzyRatio } = getPreferenceValues();
  if (isNaN(parseFloat(fuzzyRatio))) {
    showToast({ style: Toast.Style.Failure, title: "Invalid fuzzy ratio. Check extension preferences." });
    return;
  }

  const devices = getDevices();
  const device = devices.find(
    (device) =>
      ratio(device.name, props.arguments.nameOrMacAddress) > fuzzyRatio ||
      device.macAddress === props.arguments.nameOrMacAddress
  );

  if (device === undefined) {
    showToast({ style: Toast.Style.Failure, title: "Device not found." });
  } else {
    disconnectDevice(device.macAddress);
  }
};