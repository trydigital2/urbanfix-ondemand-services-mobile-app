import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  ChatMessage,
  getInitialDiagnosticChat,
  ProposalStatus,
} from '../utils/technicianChatEngine';
import { colors, spacing, borderRadius, typography } from '../theme';

export interface TechnicianChatCardProps {
  initialMessages?: ChatMessage[];
  ticketNumber?: string;
  onSendMessage?: (text: string) => void;
  onProposalResponse?: (proposalId: string, status: ProposalStatus) => void;
}

export const TechnicianChatCard: React.FC<TechnicianChatCardProps> = ({
  initialMessages,
  ticketNumber = 'UF-88421',
  onSendMessage,
  onProposalResponse,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages || getInitialDiagnosticChat()
  );
  const [inputText, setInputText] = useState<string>('');
  const [proposalState, setProposalState] = useState<Record<string, ProposalStatus>>({
    'PROP-98042': 'PENDING',
  });

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'CUSTOMER',
      senderName: 'Homeowner',
      body: inputText.trim(),
      timestampFormatted: 'Just now',
      status: 'SENT',
    };

    setMessages((prev) => [...prev, newMessage]);
    if (onSendMessage) {
      onSendMessage(inputText.trim());
    }
    setInputText('');
  };

  const handleProposalAction = (proposalId: string, status: ProposalStatus) => {
    setProposalState((prev) => ({ ...prev, [proposalId]: status }));
    if (onProposalResponse) {
      onProposalResponse(proposalId, status);
    }
  };

  const quickReplies = [
    'Yes, approved. Bring genuine parts.',
    'Is the 30-day warranty included?',
    'What is your estimated arrival?',
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.techInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RK</Text>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.techMeta}>
            <View style={styles.titleRow}>
              <Text style={styles.techName}>Rajesh Kumar</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>PRO ✓</Text>
              </View>
            </View>
            <Text style={styles.ticketText}>Ticket #{ticketNumber} • AC Repair Specialist</Text>
          </View>
        </View>

        <View style={styles.secureBadge}>
          <Text style={styles.secureText}>ESCROW PROTECTED</Text>
        </View>
      </View>

      {/* Message Thread */}
      <View style={styles.chatThread}>
        {messages.map((msg) => {
          if (msg.sender === 'SYSTEM') {
            return (
              <View key={msg.id} style={styles.systemBubble}>
                <Text style={styles.systemText}>{msg.body}</Text>
              </View>
            );
          }

          const isCustomer = msg.sender === 'CUSTOMER';

          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isCustomer ? styles.messageRowRight : styles.messageRowLeft,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isCustomer ? styles.bubbleCustomer : styles.bubbleTechnician,
                ]}
              >
                <Text style={[styles.senderLabel, isCustomer && styles.senderLabelCustomer]}>
                  {msg.senderName}
                </Text>
                <Text style={[styles.bubbleText, isCustomer && styles.bubbleTextCustomer]}>
                  {msg.body}
                </Text>

                {/* Diagnostic Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <View style={styles.attachmentBox}>
                    {msg.attachments.map((att) => (
                      <View key={att.id} style={styles.attachmentCard}>
                        <View style={styles.attachmentTagRow}>
                          <View style={styles.symptomTag}>
                            <Text style={styles.symptomText}>{att.symptomCategory.replace('_', ' ')}</Text>
                          </View>
                          <Text style={styles.severityText}>SEVERITY: {att.severity}</Text>
                        </View>
                        <Text style={styles.attachmentCaption}>📸 {att.caption}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Pre-service Quotation Proposal Card */}
                {msg.quoteProposal && (
                  <View style={styles.proposalBox}>
                    <View style={styles.proposalHeader}>
                      <Text style={styles.proposalTitle}>REVISED ESTIMATE PROPOSAL</Text>
                      <View style={styles.proposalBadge}>
                        <Text style={styles.proposalBadgeText}>ON-SITE DIAGNOSIS</Text>
                      </View>
                    </View>

                    <Text style={styles.partsDesc}>
                      {msg.quoteProposal.itemizedPartsDescription}
                    </Text>

                    <View style={styles.priceBreakdown}>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Base Service Fee:</Text>
                        <Text style={styles.priceVal}>₹{msg.quoteProposal.originalPrice}</Text>
                      </View>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Parts & Materials:</Text>
                        <Text style={styles.priceVal}>+₹{msg.quoteProposal.partsSurcharge}</Text>
                      </View>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Labor Surcharge:</Text>
                        <Text style={styles.priceVal}>+₹{msg.quoteProposal.laborSurcharge}</Text>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Revised Price:</Text>
                        <Text style={styles.totalVal}>
                          ₹{msg.quoteProposal.totalRevisedPrice}
                        </Text>
                      </View>
                    </View>

                    {/* Proposal Action Buttons */}
                    {proposalState[msg.quoteProposal.proposalId] === 'PENDING' ? (
                      <View style={styles.proposalActions}>
                        <TouchableOpacity
                          style={[styles.btn, styles.btnAccept]}
                          onPress={() =>
                            handleProposalAction(msg.quoteProposal!.proposalId, 'ACCEPTED')
                          }
                          activeOpacity={0.85}
                        >
                          <Text style={styles.btnAcceptText}>Accept Revised Quote</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btn, styles.btnDecline]}
                          onPress={() =>
                            handleProposalAction(msg.quoteProposal!.proposalId, 'REJECTED')
                          }
                          activeOpacity={0.85}
                        >
                          <Text style={styles.btnDeclineText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.resolutionBadge,
                          proposalState[msg.quoteProposal.proposalId] === 'ACCEPTED'
                            ? styles.resolutionAccepted
                            : styles.resolutionDeclined,
                        ]}
                      >
                        <Text style={styles.resolutionText}>
                          {proposalState[msg.quoteProposal.proposalId] === 'ACCEPTED'
                            ? '✓ Quotation Accepted by Customer'
                            : '✗ Quotation Declined by Customer'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.metaRow}>
                  <Text style={[styles.timestamp, isCustomer && styles.timestampCustomer]}>
                    {msg.timestampFormatted}
                  </Text>
                  {isCustomer && (
                    <Text style={styles.readReceipt}>
                      {msg.status === 'READ' ? '✓✓' : '✓'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Quick Reply Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplyScroll}>
        {quickReplies.map((reply, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.quickChip}
            onPress={() => {
              setInputText(reply);
            }}
          >
            <Text style={styles.quickChipText}>{reply}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input Box */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
          <Text style={styles.attachIcon}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type message to technician..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnText}>Send</Text>
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
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  techInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    position: 'relative',
  },
  avatarText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  techMeta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    marginLeft: 6,
  },
  verifiedText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  ticketText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  secureBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  secureText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  chatThread: {
    marginVertical: spacing.xs,
  },
  systemBubble: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginVertical: spacing.xs,
  },
  systemText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  bubbleCustomer: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleTechnician: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 2,
  },
  senderLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginBottom: 2,
  },
  senderLabelCustomer: {
    color: colors.primaryLight,
  },
  bubbleText: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  bubbleTextCustomer: {
    color: colors.white,
  },
  attachmentBox: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  attachmentCard: {
    padding: 2,
  },
  attachmentTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  symptomTag: {
    backgroundColor: colors.primaryLight + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  symptomText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
  },
  severityText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  attachmentCaption: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  proposalBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  proposalTitle: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  proposalBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  proposalBadgeText: {
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  partsDesc: {
    fontSize: 11,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  priceBreakdown: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  priceVal: {
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  proposalActions: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  btnAccept: {
    backgroundColor: colors.primary,
  },
  btnAcceptText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  btnDecline: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnDeclineText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
  },
  resolutionBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    marginTop: 4,
    alignItems: 'center',
  },
  resolutionAccepted: {
    backgroundColor: colors.success + '20',
  },
  resolutionDeclined: {
    backgroundColor: colors.error + '20',
  },
  resolutionText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 9,
    color: colors.textMuted,
  },
  timestampCustomer: {
    color: colors.white + '90',
  },
  readReceipt: {
    fontSize: 9,
    color: colors.primaryLight,
    marginLeft: 4,
  },
  quickReplyScroll: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
  },
  quickChip: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  quickChipText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attachBtn: {
    padding: spacing.xs,
  },
  attachIcon: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  sendBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
