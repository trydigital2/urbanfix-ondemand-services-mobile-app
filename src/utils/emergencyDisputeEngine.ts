export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_SAFETY_SOS';
export type DisputeResolutionState = 'OPEN' | 'INVESTIGATING' | 'REWORK_ORDERED' | 'REFUNDED' | 'CLOSED';

export interface EmergencyDisputeTicket {
  ticketId: string;
  bookingId: string;
  customerName: string;
  technicianName: string;
  severity: IncidentSeverity;
  incidentType: 'PROPERTY_DAMAGE' | 'SAFETY_HARASSMENT' | 'UNFINISHED_JOB' | 'OVERCHARGING';
  description: string;
  state: DisputeResolutionState;
  escalatedToSafetySquad: boolean;
  compensationClaimPaise: number;
  approvedRefundPaise: number;
  slaResolutionDeadlineIso: string;
  filedAtIso: string;
}

/**
 * Calculates insurance dispute resolution SLA and escrow refund disbursement.
 */
export function calculateDisputeResolutionMetrics(
  severity: IncidentSeverity,
  compensationClaimPaise: number
): { responseSlaMinutes: number; maxCoverPaise: number; requiresPhysicalInspection: boolean } {
  let responseSlaMinutes = 120; // 2 hours
  const maxCoverPaise = 50000000; // ₹5,00,000 maximum damage protection
  let requiresPhysicalInspection = false;

  switch (severity) {
    case 'CRITICAL_SAFETY_SOS':
      responseSlaMinutes = 5; // 5-min urgent safety callback
      break;
    case 'HIGH':
      responseSlaMinutes = 30; // 30-min manager intervention
      requiresPhysicalInspection = true;
      break;
    case 'MEDIUM':
      responseSlaMinutes = 60;
      break;
    case 'LOW':
      responseSlaMinutes = 180;
      break;
  }

  return {
    responseSlaMinutes,
    maxCoverPaise,
    requiresPhysicalInspection,
  };
}

export function getSampleDisputeTicket(): EmergencyDisputeTicket {
  return {
    ticketId: 'DSP-URBAN-8842',
    bookingId: 'BK-AC-9102',
    customerName: 'Ananya Roy',
    technicianName: 'Vikram Sharma',
    severity: 'MEDIUM',
    incidentType: 'PROPERTY_DAMAGE',
    description: 'Minor water pipe seepage during indoor AC drain pipe fitting.',
    state: 'INVESTIGATING',
    escalatedToSafetySquad: false,
    compensationClaimPaise: 450000, // ₹4,500 claim
    approvedRefundPaise: 450000,
    slaResolutionDeadlineIso: '2026-11-18T08:00:00Z',
    filedAtIso: '2026-11-18T06:00:00Z',
  };
}
