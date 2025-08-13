// utils/testData.ts

export const fakeNfcData = {
  project_meta: {
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
  boolean_percentages: {
    "FeederStatusBits.HopperVibratoryEnabled": 49.02,
    "FeederStatusBits.PartTroughDiverterAdvanced": 47.33,
    "FeederStatusBits.PartTroughDiverterRetracted": 51.71,
    "FeederStatusBits.PickTrough.Trough1Enabled": 47.70,
    "FeederStatusBits.PickTrough.Trough2Enabled": 48.34,
    "FeederStatusBits.PurgeChuteAdvanced": 0,
    "FeederStatusBits.PurgeChuteRetracted": 100,
    "FeederStatusBits.ReturnElevatorForward": 3.23,
    "RobotStatusBits.StaubliMotorsOk": 96.77,
    "RobotStatusBits.StaubliPlace.Position1": 49.61,
    "RobotStatusBits.StaubliPlace.Position2": 0,
    "RobotStatusBits.StaubliPlace.Position3": 0,
    "RobotStatusBits.VisionLight.Light1": 96.77,
    "RobotStatusBits.VisionLight.Light2": 96.77,
    "SystemStatusBits.AirPressureOk": 98.36,
    "SystemStatusBits.AutoMode": 96.77,
    "SystemStatusBits.ControlPowerOn": 96.77,
    "SystemStatusBits.EStopOk": 100,
    "SystemStatusBits.GuardDoorOpen.GuardDoor1": 1.61,
    "SystemStatusBits.GuardDoorOpen.GuardDoor2": 0,
    "SystemStatusBits.GuardDoorOpen.GuardDoor3": 1.61,
    "SystemStatusBits.GuardDoorOpen.GuardDoor4": 0,
    "SystemStatusBits.PurgeMode": 0,
    "SystemStatusBits.SystemFaulted": 1.64
  },
  fault_counts: {
    "FaultBits.MainAirPressureNotOk": 1,
    "WarningBits.HopperLowLevelWarning": 1
  },
  float_averages: {
    "Floats.HopperVibratory.Temperature": 28.49,
    "Floats.HopperVibratory.VibrationX": 1.23,
    "Floats.HopperVibratory.VibrationY": 2.18,
    "Floats.HopperVibratory.VibrationZ": 5.37,
    "Floats.Performance.CycleTime": 1.19,
    "Floats.Performance.PartsPerMinute": 50.38,
    "Floats.Performance.SystemTotalParts": 1220.36
  }
};
