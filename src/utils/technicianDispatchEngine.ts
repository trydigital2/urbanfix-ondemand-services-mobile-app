export type DispatchStatus = 'UNASSIGNED' | 'DISPATCHED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED';

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface TechnicianDispatchState {
  technicianId: string;
  technicianName: string;
  status: DispatchStatus;
  distanceKm: number;
  estimatedArrivalMins: number;
  etaFormatted: string;
  trafficLevel: 'LIGHT' | 'MODERATE' | 'HEAVY';
}

/**
 * Calculates Haversine distance in kilometers between two geo coordinates.
 */
export function calculateHaversineDistanceKm(
  start: GeoCoordinates,
  end: GeoCoordinates
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(end.latitude - start.latitude);
  const dLon = toRad(end.longitude - start.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(start.latitude)) *
      Math.cos(toRad(end.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Calculates real-time technician dispatch arrival time taking traffic multiplier into account.
 */
export function evaluateTechnicianDispatch(
  technicianLocation: GeoCoordinates,
  userLocation: GeoCoordinates,
  trafficLevel: 'LIGHT' | 'MODERATE' | 'HEAVY' = 'MODERATE',
  status: DispatchStatus = 'DISPATCHED'
): TechnicianDispatchState {
  const distanceKm = calculateHaversineDistanceKm(technicianLocation, userLocation);

  // Average 25 km/h urban two-wheeler speed in city traffic
  let trafficMultiplier = 1.0;
  if (trafficLevel === 'MODERATE') trafficMultiplier = 1.25;
  if (trafficLevel === 'HEAVY') trafficMultiplier = 1.6;

  const baseMinutes = (distanceKm / 25) * 60;
  const totalEtaMinutes = Math.max(5, Math.round(baseMinutes * trafficMultiplier));

  return {
    technicianId: 'TECH-4981',
    technicianName: 'Sanjay Kumar (Master Electrician)',
    status,
    distanceKm,
    estimatedArrivalMins: totalEtaMinutes,
    etaFormatted: `${totalEtaMinutes} mins away`,
    trafficLevel,
  };
}
