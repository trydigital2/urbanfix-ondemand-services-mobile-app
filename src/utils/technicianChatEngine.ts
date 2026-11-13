export type MessageSender = 'CUSTOMER' | 'TECHNICIAN' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface DiagnosticAttachment {
  id: string;
  thumbnailUrl: string;
  symptomCategory: 'WATER_LEAK' | 'ELECTRICAL_SHORT' | 'MOTOR_FAILURE' | 'STRUCTURAL_CRACK';
  caption: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fileSizeBytes: number;
}

export interface QuoteAdjustmentProposal {
  proposalId: string;
  originalPrice: number;
  partsSurcharge: number;
  laborSurcharge: number;
  totalRevisedPrice: number;
  itemizedPartsDescription: string;
  status: ProposalStatus;
  proposedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  senderName: string;
  body: string;
  timestampFormatted: string;
  status: MessageStatus;
  attachments?: DiagnosticAttachment[];
  quoteProposal?: QuoteAdjustmentProposal;
}

/**
 * Calculates itemized revised total for on-site diagnostic quotation adjustments.
 */
export function calculateRevisedQuote(
  originalPrice: number,
  partsSurcharge: number,
  laborSurcharge: number
): { originalPrice: number; partsSurcharge: number; laborSurcharge: number; totalRevisedPrice: number } {
  const parts = Math.max(0, partsSurcharge);
  const labor = Math.max(0, laborSurcharge);
  const total = originalPrice + parts + labor;

  return {
    originalPrice,
    partsSurcharge: parts,
    laborSurcharge: labor,
    totalRevisedPrice: Math.round(total),
  };
}

/**
 * Creates a formal quote revision proposal item attached to a message.
 */
export function createQuoteProposal(
  originalPrice: number,
  partsSurcharge: number,
  laborSurcharge: number,
  partsDescription: string
): QuoteAdjustmentProposal {
  const calculation = calculateRevisedQuote(originalPrice, partsSurcharge, laborSurcharge);

  return {
    proposalId: `PROP-${Date.now().toString(36).toUpperCase()}`,
    originalPrice: calculation.originalPrice,
    partsSurcharge: calculation.partsSurcharge,
    laborSurcharge: calculation.laborSurcharge,
    totalRevisedPrice: calculation.totalRevisedPrice,
    itemizedPartsDescription: partsDescription,
    status: 'PENDING',
    proposedAt: 'Just now',
  };
}

/**
 * Provides initial realistic message seed for interactive diagnostic chat.
 */
export function getInitialDiagnosticChat(): ChatMessage[] {
  return [
    {
      id: 'msg-1',
      sender: 'SYSTEM',
      senderName: 'UrbanFix Automated Guard',
      body: 'Verified Artisan Rajesh Kumar has been dispatched. You can share symptom photos for upfront diagnosis.',
      timestampFormatted: '10:14 AM',
      status: 'READ',
    },
    {
      id: 'msg-2',
      sender: 'CUSTOMER',
      senderName: 'Homeowner',
      body: 'Hi Rajesh, the split AC is blowing warm air and making a constant rattling noise from the compressor.',
      timestampFormatted: '10:16 AM',
      status: 'READ',
      attachments: [
        {
          id: 'att-1',
          thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200',
          symptomCategory: 'MOTOR_FAILURE',
          caption: 'Outdoor compressor condenser unit vibration',
          severity: 'HIGH',
          fileSizeBytes: 2450000,
        },
      ],
    },
    {
      id: 'msg-3',
      sender: 'TECHNICIAN',
      senderName: 'Rajesh Kumar (AC Specialist)',
      body: 'I inspected your photo. The run capacitor (45µF) has bulged and the copper suction pipe shows oil traces indicating refrigerant leak. I recommend replacing the dual capacitor and refilling gas.',
      timestampFormatted: '10:19 AM',
      status: 'READ',
      quoteProposal: {
        proposalId: 'PROP-98042',
        originalPrice: 499,
        partsSurcharge: 650,
        laborSurcharge: 150,
        totalRevisedPrice: 1299,
        itemizedPartsDescription: 'Heavy-Duty 45µF Capacitor + R32 Refrigerant Top-up (500g)',
        status: 'PENDING',
        proposedAt: '10:19 AM',
      },
    },
  ];
}
