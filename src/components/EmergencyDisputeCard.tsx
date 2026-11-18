import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  EmergencyDisputeTicket,
  calculateDisputeResolutionMetrics,
  getSampleDisputeTicket,
} from '../utils/emergencyDisputeEngine';

export const EmergencyDisputeCard: React.FC = () => {
  const [ticket, setTicket] = useState<EmergencyDisputeTicket>(getSampleDisputeTicket());
  const metrics = calculateDisputeResolutionMetrics(ticket.severity, ticket.compensationClaimPaise);

  const handleSosTrigger = () => {
    setTicket((prev) => ({
      ...prev,
      severity: 'CRITICAL_SAFETY_SOS',
      escalatedToSafetySquad: true,
    }));

    Alert.alert(
      '🚨 SOS Emergency Safety Alert Dispatched',
      'UrbanFix Safety Incident Response Squad has been alerted. An executive will call your mobile number within 5 minutes.'
    );
  };

  const handleApproveEscrow = () => {
    setTicket((prev) => ({
      ...prev,
      state: 'REFUNDED',
    }));
    Alert.alert(
      'Compensation Released',
      `₹${(ticket.approvedRefundPaise / 100).toFixed(0)} credited directly back to customer UPI bank account.`
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, ticket.escalatedToSafetySquad && styles.badgeSos]}>
          <Text style={[styles.badgeText, ticket.escalatedToSafetySquad && styles.badgeTextSos]}>
            {ticket.escalatedToSafetySquad ? '🚨 CRITICAL SOS ACTIVE' : 'DISPUTE & RESOLUTION'}
          </Text>
        </View>
        <Text style={styles.ticketIdText}>#{ticket.ticketId}</Text>
      </View>

      <Text style={styles.title}>Incident Arbitration & Escrow Protection</Text>
      <Text style={styles.subtitle}>Booking Ref: {ticket.bookingId} • Technician: {ticket.technicianName}</Text>

      {/* Incident Overview Box */}
      <View style={styles.incidentBox}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Incident Category:</Text>
          <Text style={styles.metaVal}>{ticket.incidentType.replace('_', ' ')}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Status:</Text>
          <Text style={[styles.metaVal, { color: colors.warning }]}>{ticket.state}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Claim Amount:</Text>
          <Text style={[styles.metaVal, { color: colors.primary }]}>
            ₹{(ticket.compensationClaimPaise / 100).toFixed(0)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Response SLA:</Text>
          <Text style={styles.metaVal}>{metrics.responseSlaMinutes} minutes</Text>
        </View>
      </View>

      <Text style={styles.descHeading}>Claim Description</Text>
      <Text style={styles.descText}>{ticket.description}</Text>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSosTrigger} activeOpacity={0.8}>
          <Text style={styles.sosButtonText}>🚨 Trigger SOS Panic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.refundButton, ticket.state === 'REFUNDED' && styles.refundButtonDone]}
          onPress={handleApproveEscrow}
          disabled={ticket.state === 'REFUNDED'}
          activeOpacity={0.8}
        >
          <Text style={styles.refundButtonText}>
            {ticket.state === 'REFUNDED' ? '✓ ₹4,500 Refunded' : 'Approve Refund'}
          </Text>
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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeSos: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: '#D97706',
    letterSpacing: 0.5,
  },
  badgeTextSos: {
    color: '#DC2626',
  },
  ticketIdText: {
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
  incidentBox: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metaVal: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  descHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  descText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sosButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  sosButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  refundButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  refundButtonDone: {
    backgroundColor: '#10B981',
  },
  refundButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
