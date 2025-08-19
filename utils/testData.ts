// This file contains fake NFC data for test mode

export const fakeNfcData = {
  "project_meta": {
    "Control Voltage": "24 VDC",
    "Created On": "4/29/2025",
    "Enclosure Rating": "Type 12",
    "Input Current": "20 Amps",
    "Input Frequency": "60 Hz",
    "Input Phase": "Single Phase",
    "Input Voltage": "208 VAC",
    "Manufacturer": "VTR Feeder Solutions",
    "Output Power": "3.24 kW",
    "Project Description": "Staubli US Tradeshow Feeder",
    "Project Name": "Vibratory Robo Feeder",
    "Project Number": "25-014"
  },
  "boolean_percentages": {
    "FeederStatusBits.HopperVibratoryEnabled": 49.0237,
    "FeederStatusBits.PartTroughDiverterAdvanced": 47.4259,
    "FeederStatusBits.PartTroughDiverterRetracted": 51.6279,
    "FeederStatusBits.PickTrough.Trough1Enabled": 47.8960,
    "FeederStatusBits.PickTrough.Trough2Enabled": 48.3022,
    "FeederStatusBits.PurgeChuteAdvanced": 0,
    "FeederStatusBits.PurgeChuteRetracted": 100,
    "FeederStatusBits.ReturnElevatorForward": 3.2258,
    "RobotStatusBits.StaubliMotorsOk": 96.7742,
    "RobotStatusBits.StaubliPlace.Position1": 49.4071,
    "RobotStatusBits.StaubliPlace.Position2": 0,
    "RobotStatusBits.StaubliPlace.Position3": 0,
    "RobotStatusBits.VisionLight.Light1": 96.7742,
    "RobotStatusBits.VisionLight.Light2": 96.7742,
    "SystemStatusBits.AirPressureOk": 98.3607,
    "SystemStatusBits.AutoMode": 66.7742,
    "SystemStatusBits.ControlPowerOn": 96.7742,
    "SystemStatusBits.EStopOk": 100,
    "SystemStatusBits.GuardDoorOpen.GuardDoor1": 1.6129,
    "SystemStatusBits.GuardDoorOpen.GuardDoor2": 0,
    "SystemStatusBits.GuardDoorOpen.GuardDoor3": 1.6129,
    "SystemStatusBits.GuardDoorOpen.GuardDoor4": 0,
    "SystemStatusBits.PurgeMode": 0,
    "SystemStatusBits.SystemFaulted": 90.6393
  },
  "fault_counts": {
    "FaultBits.MainAirPressureNotOk": 1,
    "WarningBits.HopperLowLevelWarning": 1
  },
  "float_averages": {
    "Floats.HopperVibratory.Temperature": 28.4827,
    "Floats.HopperVibratory.VibrationX": 1.2266,
    "Floats.HopperVibratory.VibrationY": 2.1873,
    "Floats.HopperVibratory.VibrationZ": 5.3801,
    "Floats.Performance.CycleTime": 1.1926,
    "Floats.Performance.PartsPerMinute": 50.3769,
    "Floats.Performance.SystemTotalParts": 1207.1687
  }
};


export const fakeNfcFloatData ={
  start: "2025-08-13T14:56:30Z",
  interval: 30,
  values: [
    1.28,1.15,1.15,1.16,1.16,1.17,1.15,1.16,1.19,1.15,1.21,1.17,1.17,1.16,
    1.15,1.16,1.14,1.15,1.19,1.16,1.15,1.14,1.16,1.14,1.15,1.18,1.16,1.18,
    1.18,1.18,1.17,1.20,1.20,1.20,1.17,1.17,1.16,1.15,1.18,1.16,1.18,1.14,
    1.14,1.16,1.15,1.13,1.29,1.19,1.17,1.26,1.16,1.19,1.23,1.16,1.16,1.16,
    1.16,1.16,1.27,1.16,1.15,1.18,1.22,1.16,1.18,1.16,1.17,1.15,1.15,1.14,
    1.21,1.18,1.22,1.14,1.17,1.16,1.13,1.21,1.14,1.15,1.15,1.25,1.20,1.19,
    1.22,1.21,1.15,1.20,1.15,1.22,1.21,1.18,1.23,1.23,1.20,1.15,1.16,1.20,
    1.32,1.16,1.16,1.19,1.14,1.25,1.25,1.18,1.14,1.15,1.13,1.15,1.15,1.17,
    1.16,1.20,1.21,1.17,1.16,1.15,1.20,1.18,1.16,1.17,1.16,1.17,1.19,1.19,
    1.16,1.15,1.15,1.16,1.25,1.15,1.20,1.15,1.15,1.16,1.24,1.15,1.16,1.17,
    1.27,1.15,1.18,1.14,1.15,1.19,1.19,1.16,1.20,1.19,1.17,1.20,1.16,1.14,
    1.17,1.17,1.15,1.13,1.17,1.16,1.24,1.19,1.19,1.14,1.27,1.18,1.15,1.14,
    1.19,1.16,1.23,1.16,1.21,1.16,1.16,1.15,1.14,1.25,1.23,1.20,1.18,1.14,
    1.16,1.17,1.15,1.16,1.17,1.15,1.14,1.17,1.17,1.12,1.12,1.12,1.12,1.12,
    1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,
    1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,
    1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,
    1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,1.12,
    1.12,1.12,1.12,1.12,1.12,1.12,1.12,1580.93,9.42,9.42,32.30,1.14,1.14,
    1.14,39.73,1.17,1.16,1.45,1.15,1.15,1.15,1.15,1.14,1.28,1.21,1.17,1.20,
    1.15,1.25,1.14,1.15,1.15,1.21,1.22,1.15,1.20,1.18,1.21,1.22,1.18,1.15,
    1.26,1.18,1.19,1.15,1.20,1.14,1.17,1.13,1.20,1.14,1.16,1.17,1.16,1.16,
    1.14,1.22,1.17,1.15,1.21,1.16,1.20,1.16,1.21,1.23,1.16,1.16,1.19,1.15,
    1.14,1.20,1.16,1.15,1.16
  ]
};
