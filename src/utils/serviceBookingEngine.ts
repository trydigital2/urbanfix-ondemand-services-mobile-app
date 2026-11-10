export interface ServiceBookingInputs {
  baseLaborPaise: number;
  partsCostPaise: number;
  surgeMultiplier: number; // e.g. 1.0 (standard) to 1.5 (peak hours)
  discountVoucherPaise: number;
  taxRatePercent?: number; // 18% GST standard on professional services
}

export interface ServiceBookingCostBreakdown {
  laborCostPaise: number;
  partsCostPaise: number;
  subtotalPaise: number;
  discountAppliedPaise: number;
  taxPaise: number;
  finalTotalPaise: number;
  warrantyPeriodDays: number;
  estimatedArrivalMins: number;
}

export function calculateServiceCost(inputs: ServiceBookingInputs): ServiceBookingCostBreakdown {
  const {
    baseLaborPaise,
    partsCostPaise,
    surgeMultiplier = 1.0,
    discountVoucherPaise = 0,
    taxRatePercent = 18.0,
  } = inputs;

  const laborCost = Math.round(baseLaborPaise * surgeMultiplier);
  const subtotal = laborCost + partsCostPaise;
  const discountApplied = Math.min(subtotal, discountVoucherPaise);
  const taxableAmount = Math.max(0, subtotal - discountApplied);
  const tax = Math.round((taxableAmount * taxRatePercent) / 100);
  const finalTotal = taxableAmount + tax;

  return {
    laborCostPaise: laborCost,
    partsCostPaise,
    subtotalPaise: subtotal,
    discountAppliedPaise: discountApplied,
    taxPaise: tax,
    finalTotalPaise: finalTotal,
    warrantyPeriodDays: 30, // 30-day service guarantee
    estimatedArrivalMins: 35,
  };
}

export function formatPaiseToINR(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}
