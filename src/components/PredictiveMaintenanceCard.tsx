import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  ApplianceHealthRecord,
  getSampleApplianceRecords,
} from '../utils/applianceTelemetryEngine';

export const PredictiveMaintenanceCard: React.FC = () => {
  const [appliance, setAppliance] = useState<ApplianceHealthRecord>(getSampleApplianceRecords()[0]);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  const handlePreemptiveBook = () => {
    setIsBooked(true);
    Alert.alert(
      'Pre-emptive Service Scheduled!',
      `Technician booked for ${appliance.customName}. Our verified engineer will arrive with genuine spares before compressor failure.`
    );
  };

  const isWarning = appliance.urgency !== 'HEALTHY';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, isWarning && styles.badgeWarning]}>
          <Text style={[styles.badgeText, isWarning && styles.badgeTextWarning]}>
            {appliance.urgency.replace(/_/g, ' ')}
          </Text>
        </View>
        <Text style={styles.applianceIdText}>#{appliance.applianceId}</Text>
      </View>

      <Text style={styles.title}>{appliance.customName}</Text>
      <Text style={styles.subtitle}>
        {appliance.brandModel} • {appliance.operatingHours} operating hours
      </Text>

      {/* Health Meter */}
      <View style={styles.healthMeterBox}>
        <View style={styles.healthCircle}>
          <Text style={styles.healthVal}>{appliance.healthIndexScore}</Text>
          <Text style={styles.healthMax}>/100</Text>
        </View>
        <View style={styles.healthInfoCol}>
          <Text style={styles.healthTitle}>Predictive RUL Breakdown Alert</Text>
          <Text style={styles.healthDesc}>
            Failure risk in <Text style={styles.daysHighlight}>{appliance.predictedBreakdownDays} days</Text> if unserviced
          </Text>
        </View>
      </View>

      {/* Telemetry Sensor Readouts */}
      <Text style={styles.sectionHeading}>Live IoT Diagnostic Sensors</Text>
      <View style={styles.sensorGrid}>
        {appliance.telemetryMetrics.map((m, idx) => (
          <View key={idx} style={[styles.sensorItem, m.isAbnormal && styles.sensorItemAbnormal]}>
            <Text style={styles.sensorName}>{m.metricName}</Text>
            <Text style={[styles.sensorVal, m.isAbnormal && styles.sensorValAbnormal]}>
              {m.currentValue} {m.unit}
            </Text>
            <Text style={styles.sensorNormal}>Max: {m.normalThresholdMax} {m.unit}</Text>
          </View>
        ))}
      </View>

      {/* Recommended Fix */}
      <View style={styles.recommendBox}>
        <Text style={styles.recLabel}>Recommended Pre-emptive Service:</Text>
        <Text style={styles.recTitle}>{appliance.recommendedServiceTag}</Text>
        <Text style={styles.recPrice}>
          Estimated: ₹{(appliance.estimatedServiceCostPaise / 100).toFixed(0)}
        </Text>
      </View>

      {/* Pre-emptive Booking Button */}
      <TouchableOpacity
        style={[styles.bookBtn, isBooked && styles.bookBtnDone]}
        onPress={handlePreemptiveBook}
        disabled={isBooked}
        activeOpacity={0.8}
      >
        <Text style={styles.bookBtnText}>
          {isBooked ? '✓ Pre-emptive Visit Confirmed' : 'Book Proactive Service & Save ₹3,500 Breakdown Cost'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#059669',
    letterSpacing: 0.5,
  },
  badgeTextWarning: {
    color: '#D97706',
  },
  applianceIdText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  healthMeterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  healthCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthVal: {
    fontSize: 15,
    fontWeight: typography.fontWeight.heavy,
    color: colors.white,
    lineHeight: 16,
  },
  healthMax: {
    fontSize: 8,
    color: '#FEF3C7',
  },
  healthInfoCol: {
    flex: 1,
  },
  healthTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#92400E',
  },
  healthDesc: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
  },
  daysHighlight: {
    fontWeight: typography.fontWeight.bold,
    color: '#DC2626',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sensorGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
  },
  sensorItem: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sensorItemAbnormal: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  sensorName: {
    fontSize: 9,
    color: colors.textMuted,
  },
  sensorVal: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sensorValAbnormal: {
    color: '#DC2626',
  },
  sensorNormal: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 1,
  },
  recommendBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  recLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  recTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 1,
  },
  recPrice: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  bookBtnDone: {
    backgroundColor: '#10B981',
  },
  bookBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});
