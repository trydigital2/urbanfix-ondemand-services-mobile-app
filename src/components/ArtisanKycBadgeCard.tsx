import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  ArtisanSafetyProfile,
  getSampleArtisanSafetyProfile,
} from '../utils/artisanKycEngine';

interface ArtisanKycBadgeCardProps {
  profile?: ArtisanSafetyProfile;
}

export const ArtisanKycBadgeCard: React.FC<ArtisanKycBadgeCardProps> = ({
  profile = getSampleArtisanSafetyProfile(),
}) => {
  const handleViewCertificate = (issuer: string, certId: string) => {
    Alert.alert('Verified Credential', `${issuer}\nLicense Ref: ${certId}\nStatus: Cryptographically Verified.`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🛡️ VERIFIED ARTISAN PROFILE</Text>
        </View>
        <Text style={styles.techIdText}>#{profile.technicianId}</Text>
      </View>

      <Text style={styles.artisanName}>{profile.fullName}</Text>
      <Text style={styles.specializationText}>{profile.tradeSpecialization}</Text>

      {/* Trust Score Banner */}
      <View style={styles.trustBanner}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreVal}>{profile.compositeTrustScore}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <View style={styles.trustDetails}>
          <Text style={styles.trustTitle}>UrbanFix Trust & Safety Index</Text>
          <Text style={styles.trustSubtitle}>
            {profile.totalJobsCompleted} jobs • {profile.repeatHireRatePercent}% repeat hire rate
          </Text>
        </View>
      </View>

      {/* Verified Credentials */}
      <Text style={styles.sectionHeading}>Clearances & Credentials</Text>
      <View style={styles.credList}>
        {profile.credentials.map((cred, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.credRow}
            onPress={() => handleViewCertificate(cred.issuer, cred.verificationIdMasked)}
            activeOpacity={0.7}
          >
            <Text style={styles.checkIcon}>✓</Text>
            <View style={styles.credInfo}>
              <Text style={styles.credIssuer}>{cred.issuer}</Text>
              <Text style={styles.credMasked}>Ref: {cred.verificationIdMasked}</Text>
            </View>
            <Text style={styles.badgeVerified}>VERIFIED</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Protocol Verification */}
      <View style={styles.safetyBox}>
        <Text style={styles.safetyTitle}>Daily On-Site Safety Protocol</Text>
        <View style={styles.safetyGrid}>
          <Text style={styles.safetyItem}>✓ Insulated Tools (1000V)</Text>
          <Text style={styles.safetyItem}>✓ Steel-Toe Safety Boots</Text>
          <Text style={styles.safetyItem}>✓ Active Background Check</Text>
          <Text style={styles.safetyItem}>✓ ₹5L Damage Guarantee</Text>
        </View>
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
  techIdText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  artisanName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  specializationText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 12,
  },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreVal: {
    fontSize: 14,
    fontWeight: typography.fontWeight.heavy,
    color: colors.white,
    lineHeight: 16,
  },
  scoreMax: {
    fontSize: 8,
    color: '#C7D2FE',
  },
  trustDetails: {
    flex: 1,
  },
  trustTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
  },
  trustSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  credList: {
    marginBottom: spacing.md,
  },
  credRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  checkIcon: {
    fontSize: 12,
    color: colors.success,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
  },
  credInfo: {
    flex: 1,
  },
  credIssuer: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  credMasked: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badgeVerified: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  safetyBox: {
    backgroundColor: '#F8FAFC',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  safetyTitle: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  safetyGrid: {
    gap: 4,
  },
  safetyItem: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
