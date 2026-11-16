import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  ServiceWarrantyPolicy,
  WarrantyCalculationResult,
  calculateWarrantyStatus,
} from '../utils/warrantyGuaranteeEngine';

interface WarrantyGuaranteeCardProps {
  policy: ServiceWarrantyPolicy;
  onFileClaimPress?: (policyId: string) => void;
}

export const WarrantyGuaranteeCard: React.FC<WarrantyGuaranteeCardProps> = ({
  policy,
  onFileClaimPress,
}) => {
  const [claimFiled, setClaimFiled] = useState(false);
  const warrantyInfo: WarrantyCalculationResult = calculateWarrantyStatus(
    policy.serviceCompletedDate,
    policy.warrantyDurationDays
  );

  const getStatusBadgeStyle = () => {
    switch (warrantyInfo.status) {
      case 'ACTIVE':
        return { bg: '#ECFDF5', text: '#059669', label: '30-DAY ACTIVE WARRANTY' };
      case 'EXPIRING_SOON':
        return { bg: '#FFFBEB', text: '#D97706', label: 'EXPIRING SOON' };
      case 'EXPIRED':
      default:
        return { bg: '#FEF2F2', text: '#DC2626', label: 'WARRANTY EXPIRED' };
    }
  };

  const statusBadge = getStatusBadgeStyle();

  const handleClaim = () => {
    setClaimFiled(true);
    Alert.alert(
      'Free Rework Claim Initiated',
      `Your claim for ${policy.serviceName} has been logged. An UrbanFix technician will reach out within ${warrantyInfo.hoursRemainingInSla} hours.`,
      [{ text: 'Understood' }]
    );
    if (onFileClaimPress) {
      onFileClaimPress(policy.policyId);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: statusBadge.bg }]}>
          <Text style={[styles.badgeText, { color: statusBadge.text }]}>
            {statusBadge.label}
          </Text>
        </View>
        <Text style={styles.policyIdText}>#{policy.policyId}</Text>
      </View>

      <Text style={styles.serviceTitle}>{policy.serviceName}</Text>
      <Text style={styles.technicianText}>Serviced by: {policy.technicianName}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Days Left</Text>
          <Text style={styles.statValue}>{warrantyInfo.daysRemaining} Days</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Valid Until</Text>
          <Text style={styles.statValue}>{warrantyInfo.expiryFormatted}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Max Cover</Text>
          <Text style={styles.statValue}>₹{(policy.maxClaimAmountPaise / 100).toFixed(0)}</Text>
        </View>
      </View>

      <View style={styles.coverageBox}>
        <Text style={styles.coverageHeading}>Guarantee Scope:</Text>
        {policy.coverageScope.map((scopeItem, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>✓</Text>
            <Text style={styles.bulletText}>{scopeItem}</Text>
          </View>
        ))}
      </View>

      {warrantyInfo.isEligibleForFreeRework && (
        <TouchableOpacity
          style={[styles.claimButton, claimFiled && styles.claimButtonDisabled]}
          disabled={claimFiled}
          onPress={handleClaim}
          activeOpacity={0.8}
        >
          <Text style={styles.claimButtonText}>
            {claimFiled ? '✓ Claim Under 4h SLA Review' : 'Claim Free Technician Rework'}
          </Text>
        </TouchableOpacity>
      )}
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  policyIdText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  serviceTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  technicianText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.medium,
  },
  statValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  coverageBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  coverageHeading: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  bulletDot: {
    fontSize: 12,
    color: colors.success,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.xs,
  },
  bulletText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    flex: 1,
  },
  claimButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: '#10B981',
  },
  claimButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
