import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { calculateServiceCost, formatPaiseToINR, ServiceBookingInputs } from '../utils/serviceBookingEngine';
import { colors, spacing, borderRadius, typography } from '../theme';

export interface ServiceBookingCardProps {
  serviceTitle?: string;
  categoryName?: string;
  technicianName?: string;
  rating?: number;
  inputs?: Partial<ServiceBookingInputs>;
  onBookNow?: () => void;
}

export const ServiceBookingCard: React.FC<ServiceBookingCardProps> = ({
  serviceTitle = 'Inverter AC Deep Jet Cleaning & Gas Check',
  categoryName = 'Appliance Repair & Servicing',
  technicianName = 'Vikram Sharma (Urban Verified)',
  rating = 4.88,
  inputs,
  onBookNow,
}) => {
  const defaultInputs: ServiceBookingInputs = {
    baseLaborPaise: 59900, // ₹599 labor
    partsCostPaise: 15000, // ₹150 foam jet chemicals
    surgeMultiplier: 1.0,
    discountVoucherPaise: 10000, // ₹100 discount coupon
    taxRatePercent: 18.0,
    ...inputs,
  };

  const cost = calculateServiceCost(defaultInputs);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.category}>{categoryName.toUpperCase()}</Text>
          <Text style={styles.title}>{serviceTitle}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {rating}</Text>
        </View>
      </View>

      {/* Technician Pill */}
      <View style={styles.techPill}>
        <Text style={styles.techLabel}>Assigned Expert:</Text>
        <Text style={styles.techName}>{technicianName}</Text>
      </View>

      {/* Price Breakdown Hero */}
      <View style={styles.costBox}>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Base Labor & Inspection</Text>
          <Text style={styles.costVal}>{formatPaiseToINR(cost.laborCostPaise)}</Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Consumables & Parts</Text>
          <Text style={styles.costVal}>{formatPaiseToINR(cost.partsCostPaise)}</Text>
        </View>

        {cost.discountAppliedPaise > 0 && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: colors.success }]}>Promo Discount</Text>
            <Text style={[styles.costVal, { color: colors.success }]}>
              -{formatPaiseToINR(cost.discountAppliedPaise)}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>TOTAL ESTIMATE</Text>
            <Text style={styles.warrantyText}>Includes {cost.warrantyPeriodDays}-Day Warranty</Text>
          </View>
          <Text style={styles.totalPrice}>{formatPaiseToINR(cost.finalTotalPaise)}</Text>
        </View>
      </View>

      {/* Book CTA */}
      <TouchableOpacity style={styles.ctaButton} onPress={onBookNow} activeOpacity={0.85}>
        <Text style={styles.ctaText}>Select Time Slot (ETA ~{cost.estimatedArrivalMins}m)</Text>
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
    marginBottom: spacing.xs,
  },
  titleGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  category: {
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
  ratingBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  ratingText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.accent,
  },
  techPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginVertical: spacing.sm,
  },
  techLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginRight: 4,
  },
  techName: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  costBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  costLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  costVal: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  warrantyText: {
    fontSize: 10,
    color: colors.success,
  },
  totalPrice: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ctaText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

export default ServiceBookingCard;
