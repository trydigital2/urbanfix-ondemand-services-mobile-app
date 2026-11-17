import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  RatingDimension,
  QUICK_FEEDBACK_TAGS,
  calculateWeightedRating,
  calculateTipPayout,
} from '../utils/technicianReviewEngine';

interface TechnicianReviewCardProps {
  jobId: string;
  technicianName: string;
  serviceName: string;
  onReviewSubmitted?: (rating: number, tipPaise: number) => void;
}

const TIP_OPTIONS = [0, 5000, 10000, 20000]; // 0, ₹50, ₹100, ₹200

export const TechnicianReviewCard: React.FC<TechnicianReviewCardProps> = ({
  jobId,
  technicianName,
  serviceName,
  onReviewSubmitted,
}) => {
  const [ratings, setRatings] = useState<Record<RatingDimension, number>>({
    PUNCTUALITY: 5,
    CRAFTSMANSHIP: 5,
    CLEANLINESS: 5,
    PRICING_CLARITY: 5,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([QUICK_FEEDBACK_TAGS[0], QUICK_FEEDBACK_TAGS[1]]);
  const [selectedTipPaise, setSelectedTipPaise] = useState<number>(10000); // default ₹100 tip
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const compositeRating = calculateWeightedRating(ratings);
  const tipInfo = calculateTipPayout(selectedTipPaise);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRatingChange = (dim: RatingDimension, val: number) => {
    setRatings((prev) => ({ ...prev, [dim]: val }));
  };

  const submitReview = () => {
    setIsSubmitted(true);
    Alert.alert(
      'Thank You for Rating!',
      `You gave ${technicianName} a ${compositeRating}★ rating with a ${tipInfo.formattedTip} tip. 100% of the tip is deposited directly to their UPI account.`,
      [{ text: 'Done' }]
    );
    if (onReviewSubmitted) {
      onReviewSubmitted(compositeRating, selectedTipPaise);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>JOB COMPLETED • RATE ARTISAN</Text>
        </View>
        <Text style={styles.jobIdText}>#{jobId}</Text>
      </View>

      <Text style={styles.title}>How was your service experience?</Text>
      <Text style={styles.serviceText}>
        {serviceName} by <Text style={styles.techHighlight}>{technicianName}</Text>
      </Text>

      {/* Overall Score */}
      <View style={styles.scoreRow}>
        <Text style={styles.starDisplay}>★ {compositeRating.toFixed(1)}</Text>
        <Text style={styles.scoreRemark}>
          {compositeRating >= 4.8 ? 'Exceptional Craftsmanship' : 'Good Performance'}
        </Text>
      </View>

      {/* Dimensional Ratings */}
      <View style={styles.dimensionsBox}>
        {(['CRAFTSMANSHIP', 'PUNCTUALITY', 'CLEANLINESS', 'PRICING_CLARITY'] as RatingDimension[]).map(
          (dim) => (
            <View key={dim} style={styles.dimRow}>
              <Text style={styles.dimLabel}>
                {dim === 'CRAFTSMANSHIP' ? 'Work Quality' : dim === 'PRICING_CLARITY' ? 'Pricing' : dim}
              </Text>
              <View style={styles.starSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRatingChange(dim, star)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.starChar,
                        star <= ratings[dim] ? styles.starFilled : styles.starEmpty,
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )
        )}
      </View>

      {/* Quick Praise Tags */}
      <Text style={styles.sectionSubtitle}>Highlights</Text>
      <View style={styles.tagsContainer}>
        {QUICK_FEEDBACK_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tagPill, isSelected && styles.tagPillSelected]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagPillText, isSelected && styles.tagPillTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Direct Artisan Tip */}
      <Text style={styles.sectionSubtitle}>Add a Tip for {technicianName.split(' ')[0]}</Text>
      <Text style={styles.tipNote}>100% of your tip goes directly to the professional's account</Text>
      <View style={styles.tipsRow}>
        {TIP_OPTIONS.map((tipAmount) => {
          const isSelected = selectedTipPaise === tipAmount;
          return (
            <TouchableOpacity
              key={tipAmount}
              style={[styles.tipButton, isSelected && styles.tipButtonSelected]}
              onPress={() => setSelectedTipPaise(tipAmount)}
            >
              <Text style={[styles.tipButtonText, isSelected && styles.tipButtonTextSelected]}>
                {tipAmount === 0 ? 'No Tip' : `₹${tipAmount / 100}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitted && styles.submitButtonDisabled]}
        disabled={isSubmitted}
        onPress={submitReview}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitted ? '✓ Feedback & Tip Submitted' : `Submit Feedback (${tipInfo.formattedTip} Tip)`}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  jobIdText: {
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
  serviceText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  techHighlight: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: 8,
  },
  starDisplay: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: '#D97706',
  },
  scoreRemark: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#92400E',
  },
  dimensionsBox: {
    backgroundColor: colors.surfaceSecondary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  dimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  dimLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  starSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  starChar: {
    fontSize: 16,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#CBD5E1',
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  tipNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  tagPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagPillSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: colors.primary,
  },
  tagPillText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tagPillTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  tipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.base,
  },
  tipButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tipButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  tipButtonTextSelected: {
    color: colors.white,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#10B981',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
