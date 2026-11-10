import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  evaluateTechnicianDispatch,
  GeoCoordinates,
  DispatchStatus,
} from '../utils/technicianDispatchEngine';
import { colors, spacing, borderRadius, typography } from '../theme';

export interface TechnicianDispatchCardProps {
  technicianLocation?: GeoCoordinates;
  userLocation?: GeoCoordinates;
  status?: DispatchStatus;
  onCallTechnician?: () => void;
}

export const TechnicianDispatchCard: React.FC<TechnicianDispatchCardProps> = ({
  technicianLocation = { latitude: 28.5355, longitude: 77.391 },
  userLocation = { latitude: 28.5672, longitude: 77.412 },
  status = 'DISPATCHED',
  onCallTechnician,
}) => {
  const dispatch = evaluateTechnicianDispatch(technicianLocation, userLocation, 'MODERATE', status);

  const getStatusColor = () => {
    switch (dispatch.status) {
      case 'ARRIVED':
      case 'IN_PROGRESS':
        return colors.success;
      case 'DISPATCHED':
        return colors.primary;
      default:
        return colors.warning;
    }
  };

  const statusColor = getStatusColor();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.label}>LIVE DISPATCH TRACKER</Text>
          <Text style={styles.title}>{dispatch.technicianName}</Text>
          <Text style={styles.techMeta}>ID: {dispatch.technicianId} • 4.9 ★ (340+ Jobs)</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{dispatch.status}</Text>
        </View>
      </View>

      {/* ETA Hero Banner */}
      <View style={styles.heroBox}>
        <View style={styles.etaCol}>
          <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
          <Text style={styles.etaTime}>{dispatch.etaFormatted}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.distanceCol}>
          <Text style={styles.etaLabel}>DISTANCE</Text>
          <Text style={styles.distanceVal}>{dispatch.distanceKm} km</Text>
          <Text style={styles.trafficTag}>{dispatch.trafficLevel} TRAFFIC</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.callButton} onPress={onCallTechnician} activeOpacity={0.85}>
          <Text style={styles.callText}>Call Technician</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  label: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  techMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.heavy,
  },
  heroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  etaCol: {
    flex: 1,
  },
  etaLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  etaTime: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  distanceCol: {
    alignItems: 'flex-end',
  },
  distanceVal: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  trafficTag: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
    marginTop: 2,
  },
  actionsRow: {
    marginTop: spacing.xs,
  },
  callButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  callText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

export default TechnicianDispatchCard;
