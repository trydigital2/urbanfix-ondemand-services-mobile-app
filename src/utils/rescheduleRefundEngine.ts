export type RefundTier = 'FULL_REFUND_FREE' | 'PARTIAL_REFUND_80' | 'CONVENIENCE_DEDUCTED';

export interface RescheduleOption {
  dateFormatted: string; // e.g. "Tomorrow, 21 Nov"
  slots: string[]; // ["10:00 AM - 12:00 PM", "02:00 PM - 04:00 PM"]
}

export interface CancellationRefundPolicyResult {
  hoursBeforeSlot: number;
  tier: RefundTier;
  refundPercentage: number;
  totalPaidPaise: number;
  refundablePaise: number;
  penaltyPaise: number;
  formattedRefund: string;
  isFreeRescheduleAllowed: boolean;
}

/**
 * Calculates fair cancellation refund according to UrbanFix customer charter.
 * >4 hours: 100% full refund
 * 1-4 hours: 80% refund (20% technician dispatch buffer)
 * <1 hour: Fixed convenience fee deduction
 */
export function calculateCancellationRefund(
  totalPaidPaise: number,
  hoursBeforeScheduledSlot: number
): CancellationRefundPolicyResult {
  let tier: RefundTier = 'FULL_REFUND_FREE';
  let refundPercentage = 100;
  let penaltyPaise = 0;

  if (hoursBeforeScheduledSlot >= 4.0) {
    tier = 'FULL_REFUND_FREE';
    refundPercentage = 100;
    penaltyPaise = 0;
  } else if (hoursBeforeScheduledSlot >= 1.0) {
    tier = 'PARTIAL_REFUND_80';
    refundPercentage = 80;
    penaltyPaise = Math.round(totalPaidPaise * 0.2);
  } else {
    tier = 'CONVENIENCE_DEDUCTED';
    refundPercentage = 60;
    penaltyPaise = Math.round(totalPaidPaise * 0.4);
  }

  const refundablePaise = totalPaidPaise - penaltyPaise;

  return {
    hoursBeforeSlot: hoursBeforeScheduledSlot,
    tier,
    refundPercentage,
    totalPaidPaise,
    refundablePaise,
    penaltyPaise,
    formattedRefund: `₹${(refundablePaise / 100).toFixed(0)}`,
    isFreeRescheduleAllowed: true, // Always free to reschedule up to 7 days
  };
}

export function getSampleRescheduleSlots(): RescheduleOption[] {
  return [
    { dateFormatted: 'Fri, 21 Nov', slots: ['10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '05:00 PM - 07:00 PM'] },
    { dateFormatted: 'Sat, 22 Nov', slots: ['09:00 AM - 11:00 AM', '01:00 PM - 03:00 PM', '04:00 PM - 06:00 PM'] },
  ];
}
