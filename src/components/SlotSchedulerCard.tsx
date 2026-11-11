import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  generateAvailableSlots,
  calculateSlotTotal,
  BookingTimeSlot,
} from '../utils/slotSchedulerEngine';
import { colors, spacing, borderRadius, typography } from '../theme';

export interface SlotSchedulerCardProps {
  baseServiceCostPaise?: number;
  onSlotSelected?: (slot: BookingTimeSlot, isExpress: boolean) => void;
}

export const SlotSchedulerCard: React.FC<SlotSchedulerCardProps> = ({
  baseServiceCostPaise = 59900, // ₹599
  onSlotSelected,
}) => {
  const schedule = generateAvailableSlots();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const activeDay = schedule[selectedDayIndex] || schedule[0];

  const [selectedSlotId, setSelectedSlotId] = useState<string>(activeDay.slots[0]?.id || '');
  const [isExpress, setIsExpress] = useState(false);

  const currentSlot =
    activeDay.slots.find((s) => s.id === selectedSlotId) || activeDay.slots[0];
  const priceResult = calculateSlotTotal(
    baseServiceCostPaise,
    currentSlot?.priceModifierPaise || 0,
    isExpress
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.label}>SERVICE SCHEDULING</Text>
          <Text style={styles.title}>Select Date & Preferred Slot</Text>
        </View>
        <TouchableOpacity
          style={[styles.expressToggle, isExpress && styles.expressToggleActive]}
          onPress={() => setIsExpress(!isExpress)}
          activeOpacity={0.8}
        >
          <Text style={[styles.expressText, isExpress && styles.expressTextActive]}>
            ⚡ 30m Express {isExpress ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Day Selector Pills */}
      <View style={styles.dayRow}>
        {schedule.map((day, idx) => (
          <TouchableOpacity
            key={day.dateIso}
            style={[styles.dayPill, selectedDayIndex === idx && styles.dayPillActive]}
            onPress={() => {
              setSelectedDayIndex(idx);
              setSelectedSlotId(day.slots[0]?.id || '');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.dayText, selectedDayIndex === idx && styles.dayTextActive]}>
              {day.dayLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Available Slots Grid */}
      <View style={styles.slotsGrid}>
        {activeDay.slots.map((slot) => {
          const isSelected = slot.id === selectedSlotId;
          return (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotItem, isSelected && styles.slotItemActive]}
              onPress={() => {
                setSelectedSlotId(slot.id);
                if (onSlotSelected) onSlotSelected(slot, isExpress);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.slotTime, isSelected && styles.slotTimeActive]}>
                {slot.timeWindow}
              </Text>

              <View style={styles.slotMeta}>
                {slot.isFillingFast && (
                  <Text style={styles.fillingFastText}>🔥 Filling Fast</Text>
                )}
                {slot.priceModifierPaise !== 0 && (
                  <Text
                    style={[
                      styles.modifierText,
                      slot.priceModifierPaise < 0 ? styles.discountText : styles.surgeText,
                    ]}
                  >
                    {slot.priceModifierPaise < 0
                      ? `-₹${Math.abs(slot.priceModifierPaise / 100)}`
                      : `+₹${slot.priceModifierPaise / 100}`}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary Box */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Payable</Text>
          <Text style={styles.summaryAmount}>₹{Math.round(priceResult.finalCostPaise / 100)}</Text>
        </View>
        <Text style={styles.summarySub}>{priceResult.summaryText}</Text>
      </View>

      {/* Action CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => {
          if (currentSlot && onSlotSelected) onSlotSelected(currentSlot, isExpress);
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>
          Confirm Appointment ({activeDay.dayLabel.split(' ')[0]} • {currentSlot?.timeWindow.split('-')[0]})
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
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
  expressToggle: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  expressToggleActive: {
    backgroundColor: colors.accent,
  },
  expressText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  expressTextActive: {
    color: colors.textPrimary,
  },
  dayRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  dayPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    marginRight: spacing.sm,
  },
  dayPillActive: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  dayTextActive: {
    color: colors.white,
  },
  slotsGrid: {
    marginTop: spacing.sm,
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  slotItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSecondary,
  },
  slotTime: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  slotTimeActive: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  slotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillingFastText: {
    fontSize: 10,
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
    marginRight: 6,
  },
  modifierText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  discountText: {
    color: colors.success,
  },
  surgeText: {
    color: colors.warning,
  },
  summaryBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  summaryAmount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  summarySub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ctaText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

export default SlotSchedulerCard;
