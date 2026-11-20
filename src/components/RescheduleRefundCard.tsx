import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  CancellationRefundPolicyResult,
  calculateCancellationRefund,
  getSampleRescheduleSlots,
} from '../utils/rescheduleRefundEngine';

export const RescheduleRefundCard: React.FC = () => {
  const [hoursLeft, setHoursLeft] = useState<number>(5.5); // 5.5 hours before appointment
  const [selectedDate, setSelectedDate] = useState<string>('Fri, 21 Nov');
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM - 04:00 PM');
  const [statusAction, setStatusAction] = useState<string | null>(null);

  const refundInfo: CancellationRefundPolicyResult = calculateCancellationRefund(
    89900, // ₹899 paid
    hoursLeft
  );

  const slotsData = getSampleRescheduleSlots();

  const handleReschedule = () => {
    setStatusAction('RESCHEDULED');
    Alert.alert(
      'Service Rescheduled (0 Fee)',
      `Your technician appointment has been moved to ${selectedDate} at ${selectedSlot}.`
    );
  };

  const handleCancel = () => {
    setStatusAction('CANCELLED');
    Alert.alert(
      'Booking Cancelled',
      `100% full refund of ${refundInfo.formattedRefund} initiated to your original payment method.`
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🛡️ FAIR CANCELLATION CHARTER</Text>
        </View>
        <Text style={styles.hoursText}>{hoursLeft}h until service</Text>
      </View>

      <Text style={styles.title}>Appointment Rescheduling & Refunds</Text>
      <Text style={styles.subtitle}>
        Free cancellation up to 4 hours prior. Rescheduling is 100% free anytime.
      </Text>

      {/* Refund Window Tracker */}
      <View style={styles.refundTierBox}>
        <View style={styles.refundTierCol}>
          <Text style={styles.refundTierLabel}>Current Refund Eligible</Text>
          <Text style={styles.refundTierAmount}>{refundInfo.refundPercentage}% Refund</Text>
          <Text style={styles.refundTierSub}>{refundInfo.formattedRefund} return</Text>
        </View>
        <View style={styles.refundTierDivider} />
        <View style={styles.refundTierCol}>
          <Text style={styles.refundTierLabel}>Reschedule Fee</Text>
          <Text style={[styles.refundTierAmount, { color: '#059669' }]}>₹0 Free</Text>
          <Text style={styles.refundTierSub}>Any slot this week</Text>
        </View>
      </View>

      {/* Select Next Free Slot */}
      <Text style={styles.sectionHeading}>Pick Alternative Free Reschedule Slot</Text>
      <View style={styles.slotsRow}>
        {slotsData[0].slots.map((s) => {
          const isSelected = s === selectedSlot;
          return (
            <TouchableOpacity
              key={s}
              style={[styles.slotPill, isSelected && styles.slotPillActive]}
              onPress={() => setSelectedSlot(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.slotPillText, isSelected && styles.slotPillTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.rescheduleBtn}
          onPress={handleReschedule}
          activeOpacity={0.8}
        >
          <Text style={styles.rescheduleBtnText}>Confirm Reschedule (₹0)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>Cancel ({refundInfo.formattedRefund} Refund)</Text>
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
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#059669',
    letterSpacing: 0.5,
  },
  hoursText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.heavy,
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
  refundTierBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  refundTierCol: {
    alignItems: 'center',
    flex: 1,
  },
  refundTierLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  refundTierAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginTop: 2,
  },
  refundTierSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  refundTierDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  slotsRow: {
    gap: 6,
    marginBottom: spacing.md,
  },
  slotPill: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  slotPillActive: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  slotPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  slotPillTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rescheduleBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  rescheduleBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
