export type RatingDimension = 'PUNCTUALITY' | 'CRAFTSMANSHIP' | 'CLEANLINESS' | 'PRICING_CLARITY';

export interface RatingCategoryScore {
  dimension: RatingDimension;
  label: string;
  rating: number; // 1 to 5
}

export interface TipBreakdown {
  tipPaise: number;
  conveniencePaise: number;
  netTechnicianPayoutPaise: number;
  formattedTip: string;
  formattedNetPayout: string;
}

export interface TechnicianReviewSubmission {
  jobId: string;
  technicianId: string;
  technicianName: string;
  ratings: Record<RatingDimension, number>;
  selectedTags: string[];
  feedbackComment: string;
  tipPaise: number;
  submittedAtIso: string;
}

/**
 * Calculates weighted composite score across all rating dimensions.
 */
export function calculateWeightedRating(ratings: Record<RatingDimension, number>): number {
  const weights: Record<RatingDimension, number> = {
    PUNCTUALITY: 0.2,
    CRAFTSMANSHIP: 0.45,
    CLEANLINESS: 0.2,
    PRICING_CLARITY: 0.15,
  };

  let totalScore = 0;
  for (const dim of Object.keys(weights) as RatingDimension[]) {
    const score = Math.max(1, Math.min(5, ratings[dim] ?? 5));
    totalScore += score * weights[dim];
  }

  return Math.round(totalScore * 10) / 10;
}

/**
 * Computes 100% direct-to-artisan UPI tip transfer with 0 platform commission.
 */
export function calculateTipPayout(tipPaise: number): TipBreakdown {
  const safeTip = Math.max(0, tipPaise);
  // UrbanFix guarantees 100% of tip goes directly to the service partner
  const conveniencePaise = 0;
  const netPayout = safeTip;

  return {
    tipPaise: safeTip,
    conveniencePaise,
    netTechnicianPayoutPaise: netPayout,
    formattedTip: `₹${(safeTip / 100).toFixed(0)}`,
    formattedNetPayout: `₹${(netPayout / 100).toFixed(0)}`,
  };
}

/**
 * Validates post-service review input before committing to server.
 */
export function validateReviewSubmission(
  submission: Partial<TechnicianReviewSubmission>
): { isValid: boolean; error?: string } {
  if (!submission.jobId) {
    return { isValid: false, error: 'Job ID reference is required.' };
  }
  if (!submission.ratings || Object.keys(submission.ratings).length === 0) {
    return { isValid: false, error: 'Please rate at least one category.' };
  }
  return { isValid: true };
}

export const QUICK_FEEDBACK_TAGS = [
  '⚡ On-Time Arrival',
  '🧰 Expert Diagnosis',
  '🧼 Cleaned Post-Work',
  '💰 Fair Upfront Pricing',
  '😷 Wore Safety Gear',
  '⏱️ Speedy Turnaround',
];
