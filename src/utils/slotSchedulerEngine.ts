export type SlotDemandTier = 'STANDARD' | 'POPULAR' | 'SURGE_PEAK' | 'DISCOUNT_OFFPEAK';

export interface BookingTimeSlot {
  id: string;
  timeWindow: string; // e.g. "09:00 AM - 11:00 AM"
  availableTechniciansCount: number;
  demandTier: SlotDemandTier;
  priceModifierPaise: number; // e.g. +₹50 surge or -₹30 offpeak
  isFillingFast: boolean;
  isAvailable: boolean;
}

export interface DaySchedule {
  dateIso: string;
  dayLabel: string; // "Today", "Tomorrow", "Thu, 13 Nov"
  slots: BookingTimeSlot[];
}

export interface ExpressDispatchConfig {
  isExpressEnabled: boolean;
  guaranteedArrivalMins: number; // 30 mins
  expressSurchargePaise: number; // ₹9900 = ₹99
}

export function generateAvailableSlots(): DaySchedule[] {
  return [
    {
      dateIso: '2026-11-11',
      dayLabel: 'Today (Wed)',
      slots: [
        {
          id: 'slot_today_1',
          timeWindow: '05:00 PM - 07:00 PM',
          availableTechniciansCount: 3,
          demandTier: 'SURGE_PEAK',
          priceModifierPaise: 4900, // +₹49 surge
          isFillingFast: true,
          isAvailable: true,
        },
        {
          id: 'slot_today_2',
          timeWindow: '07:00 PM - 09:00 PM',
          availableTechniciansCount: 1,
          demandTier: 'POPULAR',
          priceModifierPaise: 0,
          isFillingFast: true,
          isAvailable: true,
        },
      ],
    },
    {
      dateIso: '2026-11-12',
      dayLabel: 'Tomorrow (Thu)',
      slots: [
        {
          id: 'slot_tomorrow_1',
          timeWindow: '09:00 AM - 11:00 AM',
          availableTechniciansCount: 5,
          demandTier: 'STANDARD',
          priceModifierPaise: 0,
          isFillingFast: false,
          isAvailable: true,
        },
        {
          id: 'slot_tomorrow_2',
          timeWindow: '11:00 AM - 01:00 PM',
          availableTechniciansCount: 6,
          demandTier: 'DISCOUNT_OFFPEAK',
          priceModifierPaise: -3000, // -₹30 discount
          isFillingFast: false,
          isAvailable: true,
        },
        {
          id: 'slot_tomorrow_3',
          timeWindow: '02:00 PM - 04:00 PM',
          availableTechniciansCount: 4,
          demandTier: 'STANDARD',
          priceModifierPaise: 0,
          isFillingFast: false,
          isAvailable: true,
        },
        {
          id: 'slot_tomorrow_4',
          timeWindow: '05:00 PM - 07:00 PM',
          availableTechniciansCount: 2,
          demandTier: 'POPULAR',
          priceModifierPaise: 2900, // +₹29
          isFillingFast: true,
          isAvailable: true,
        },
      ],
    },
  ];
}

export function calculateSlotTotal(
  baseServiceCostPaise: number,
  slotPriceModifierPaise: number,
  isExpress: boolean = false,
  expressSurchargePaise: number = 9900
): {
  finalCostPaise: number;
  expressApplied: boolean;
  summaryText: string;
} {
  let total = baseServiceCostPaise + slotPriceModifierPaise;
  if (isExpress) {
    total += expressSurchargePaise;
  }

  return {
    finalCostPaise: Math.max(0, total),
    expressApplied: isExpress,
    summaryText: isExpress
      ? 'Express Priority Dispatch: Technician arrives within 30 mins'
      : 'Standard Scheduled Slot Confirmed',
  };
}
