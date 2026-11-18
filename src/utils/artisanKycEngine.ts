export type VerificationStatus = 'VERIFIED' | 'IN_REVIEW' | 'EXPIRED' | 'REJECTED';

export interface ArtisanCredential {
  credentialType: 'GOVERNMENT_ID' | 'POLICE_CLEARANCE' | 'TRADE_CERTIFICATION' | 'INSURANCE_BOND';
  issuer: string;
  verificationIdMasked: string;
  verifiedOnIso: string;
  status: VerificationStatus;
}

export interface ArtisanSafetyProfile {
  technicianId: string;
  fullName: string;
  tradeSpecialization: string;
  compositeTrustScore: number; // 0 to 100
  totalJobsCompleted: number;
  repeatHireRatePercent: number;
  credentials: ArtisanCredential[];
  safetyChecklist: {
    safetyShoesInspected: boolean;
    electricalInsulatedToolkit: boolean;
    identityBadgeScanned: boolean;
    covidVaccinationVerified: boolean;
  };
}

/**
 * Calculates weighted composite trust index (0-100) based on verified credentials, job history & safety compliance.
 */
export function calculateArtisanTrustScore(
  credentials: ArtisanCredential[],
  totalJobs: number,
  averageRating: number,
  safetyItemsChecked: number
): number {
  const verifiedCount = credentials.filter((c) => c.status === 'VERIFIED').length;
  const credentialScore = Math.min(40, verifiedCount * 10); // max 40 pts

  const experienceScore = Math.min(25, Math.round((totalJobs / 100) * 25)); // max 25 pts
  const ratingScore = Math.min(25, Math.round(((averageRating - 3.0) / 2.0) * 25)); // max 25 pts
  const safetyScore = Math.min(10, safetyItemsChecked * 2.5); // max 10 pts

  return Math.min(100, Math.max(0, credentialScore + experienceScore + ratingScore + safetyScore));
}

export function getSampleArtisanSafetyProfile(): ArtisanSafetyProfile {
  const credentials: ArtisanCredential[] = [
    {
      credentialType: 'GOVERNMENT_ID',
      issuer: 'UIDAI Aadhaar Verified',
      verificationIdMasked: 'XXXX-XXXX-8912',
      verifiedOnIso: '2026-08-10T10:00:00Z',
      status: 'VERIFIED',
    },
    {
      credentialType: 'POLICE_CLEARANCE',
      issuer: 'State Police Department Criminal Record Check',
      verificationIdMasked: 'PCC-DL-2026-4412',
      verifiedOnIso: '2026-09-15T14:30:00Z',
      status: 'VERIFIED',
    },
    {
      credentialType: 'TRADE_CERTIFICATION',
      issuer: 'National Skill Development Council (HVAC Master)',
      verificationIdMasked: 'NSDC-CERT-9901',
      verifiedOnIso: '2026-07-20T09:00:00Z',
      status: 'VERIFIED',
    },
    {
      credentialType: 'INSURANCE_BOND',
      issuer: '₹5,00,000 Property Damage Protection Cover',
      verificationIdMasked: 'COV-URBAN-9102',
      verifiedOnIso: '2026-10-01T12:00:00Z',
      status: 'VERIFIED',
    },
  ];

  return {
    technicianId: 'TECH-VIKRAM-001',
    fullName: 'Vikram Sharma',
    tradeSpecialization: 'Master HVAC & Inverter AC Specialist',
    compositeTrustScore: calculateArtisanTrustScore(credentials, 412, 4.92, 4),
    totalJobsCompleted: 412,
    repeatHireRatePercent: 88,
    credentials,
    safetyChecklist: {
      safetyShoesInspected: true,
      electricalInsulatedToolkit: true,
      identityBadgeScanned: true,
      covidVaccinationVerified: true,
    },
  };
}
