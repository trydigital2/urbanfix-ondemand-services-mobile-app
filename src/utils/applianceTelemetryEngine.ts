export type ApplianceType = 'INVERTER_AC' | 'RO_WATER_PURIFIER' | 'WASHING_MACHINE' | 'REFRIGERATOR';
export type MaintenanceUrgency = 'HEALTHY' | 'MAINTENANCE_DUE' | 'CRITICAL_ACTION_REQUIRED';

export interface TelemetryReading {
  metricName: string;
  currentValue: number;
  normalThresholdMax: number;
  unit: string;
  isAbnormal: boolean;
}

export interface ApplianceHealthRecord {
  applianceId: string;
  customName: string;
  type: ApplianceType;
  brandModel: string;
  installationDateIso: string;
  operatingHours: number;
  healthIndexScore: number; // 0 to 100
  urgency: MaintenanceUrgency;
  predictedBreakdownDays: number;
  telemetryMetrics: TelemetryReading[];
  recommendedServiceTag: string;
  estimatedServiceCostPaise: number;
}

/**
 * Calculates remaining useful life (RUL) and maintenance urgency from IoT sensors.
 */
export function calculateApplianceHealth(
  operatingHours: number,
  readings: TelemetryReading[],
  type: ApplianceType
): { healthScore: number; urgency: MaintenanceUrgency; predictedDays: number } {
  const abnormalCount = readings.filter((r) => r.isAbnormal).length;
  // Deduct 25 points per abnormal metric, plus usage aging
  const ageDeduction = Math.min(30, Math.round((operatingHours / 4000) * 30));
  const healthScore = Math.max(15, 100 - (abnormalCount * 25) - ageDeduction);

  let urgency: MaintenanceUrgency = 'HEALTHY';
  let predictedDays = 120;

  if (healthScore < 45 || abnormalCount >= 2) {
    urgency = 'CRITICAL_ACTION_REQUIRED';
    predictedDays = 7;
  } else if (healthScore < 75 || abnormalCount === 1) {
    urgency = 'MAINTENANCE_DUE';
    predictedDays = 28;
  }

  return { healthScore, urgency, predictedDays };
}

export function getSampleApplianceRecords(): ApplianceHealthRecord[] {
  return [
    {
      applianceId: 'APP-AC-LIVING-01',
      customName: 'Master Living Room Split AC',
      type: 'INVERTER_AC',
      brandModel: 'Daikin 1.5 Ton Inverter',
      installationDateIso: '2024-03-15T00:00:00Z',
      operatingHours: 3200,
      healthIndexScore: 58,
      urgency: 'MAINTENANCE_DUE',
      predictedBreakdownDays: 21,
      recommendedServiceTag: 'Deep Foam Jet Wash & Gas Recalibration',
      estimatedServiceCostPaise: 89900,
      telemetryMetrics: [
        { metricName: 'Compressor Vibration', currentValue: 4.8, normalThresholdMax: 3.2, unit: 'mm/s', isAbnormal: true },
        { metricName: 'Coil Differential Temp', currentValue: 11.2, normalThresholdMax: 14.0, unit: '°C', isAbnormal: false },
        { metricName: 'Peak Current Draw', currentValue: 6.8, normalThresholdMax: 7.5, unit: 'Amps', isAbnormal: false },
      ],
    },
  ];
}
