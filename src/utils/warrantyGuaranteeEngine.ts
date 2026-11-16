export type WarrantyStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'CLAIM_IN_REVIEW' | 'REWORK_SCHEDULED';

export interface ServiceWarrantyPolicy {
  policyId: string;
  serviceId: string;
  serviceName: string;
  technicianName: string;
  serviceCompletedDate: string; // ISO 8601
  warrantyDurationDays: number;
  coverageScope: string[];
  maxClaimAmountPaise: number;
}

export interface WarrantyClaimRequest {
  claimId: string;
  policyId: string;
  issueDescription: string;
  symptomTag: 'WATER_LEAKAGE' | 'NOISE_VIBRATION' | 'COOLING_FAILURE' | 'ELECTRICAL_FAULT';
  filedAt: string;
  reworkSlotPreferred: string;
  photoAttachmentsCount: number;
}

export interface WarrantyCalculationResult {
  status: WarrantyStatus;
  daysRemaining: number;
  hoursRemainingInSla: number;
  isEligibleForFreeRework: boolean;
  expiryFormatted: string;
  slaDeadlineFormatted: string;
}

/**
 * Calculates remaining warranty validity, expiry date, and SLA response deadline.
 */
export function calculateWarrantyStatus(
  serviceCompletedDateIso: string,
  warrantyDurationDays: number = 30,
  referenceDateIso?: string
): WarrantyCalculationResult {
  const completedTime = new Date(serviceCompletedDateIso).getTime();
  const nowTime = referenceDateIso ? new Date(referenceDateIso).getTime() : Date.now();
  
  const warrantyDurationMs = warrantyDurationDays * 24 * 60 * 60 * 1000;
  const expiryTime = completedTime + warrantyDurationMs;
  const diffMs = expiryTime - nowTime;

  const daysRemaining = Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));

  let status: WarrantyStatus;
  if (diffMs <= 0) {
    status = 'EXPIRED';
  } else if (daysRemaining <= 5) {
    status = 'EXPIRING_SOON';
  } else {
    status = 'ACTIVE';
  }

  // SLA guarantee: 4-hour technician response window on rework claims
  const slaDeadlineTime = nowTime + 4 * 60 * 60 * 1000;
  const hoursRemainingInSla = Math.max(0, Math.round((slaDeadlineTime - nowTime) / (60 * 60 * 1000)));

  const expiryDate = new Date(expiryTime);
  const expiryFormatted = `${expiryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  const slaDate = new Date(slaDeadlineTime);
  const slaDeadlineFormatted = `${slaDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return {
    status,
    daysRemaining,
    hoursRemainingInSla,
    isEligibleForFreeRework: status === 'ACTIVE' || status === 'EXPIRING_SOON',
    expiryFormatted,
    slaDeadlineFormatted,
  };
}

/**
 * Validates a warranty claim submission.
 */
export function validateWarrantyClaim(
  claim: Partial<WarrantyClaimRequest>
): { isValid: boolean; error?: string } {
  if (!claim.policyId) {
    return { isValid: false, error: 'Policy ID is required to file a warranty claim.' };
  }
  if (!claim.issueDescription || claim.issueDescription.trim().length < 15) {
    return {
      isValid: false,
      error: 'Please describe the recurring symptom in at least 15 characters.',
    };
  }
  if (!claim.symptomTag) {
    return { isValid: false, error: 'Please choose an applicable symptom category.' };
  }
  return { isValid: true };
}

/**
 * Returns default active service warranty policies for demonstration.
 */
export function getSampleWarrantyPolicies(): ServiceWarrantyPolicy[] {
  return [
    {
      policyId: 'WAR-AC-2026-9812',
      serviceId: 'SRV-88219',
      serviceName: 'Inverter AC Deep Jet Cleaning & Gas Recalibration',
      technicianName: 'Vikram Sharma (Urban Verified Master)',
      serviceCompletedDate: '2026-11-04T11:30:00Z',
      warrantyDurationDays: 30,
      coverageScope: [
        'Free technician re-visit within 4 hours',
        'Re-cleaning if cooling coil chokes within 30 days',
        'Leakage re-inspection without labor charge',
      ],
      maxClaimAmountPaise: 120000,
    },
    {
      policyId: 'WAR-RO-2026-4410',
      serviceId: 'SRV-88102',
      serviceName: 'RO Membrane & Copper Zinc Carbon Replacement',
      technicianName: 'Rajesh Verma (5-Star Water Systems Specialist)',
      serviceCompletedDate: '2026-10-22T14:15:00Z',
      warrantyDurationDays: 30,
      coverageScope: [
        'Free TDS recalibration',
        'Booster pump leakage guarantee',
        'Zero technician visit charges on rework',
      ],
      maxClaimAmountPaise: 85000,
    },
  ];
}
