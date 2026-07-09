export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export type PropertyType = 'commercial' | 'residential';

export interface CalculatorState {
  propertyType: PropertyType;
  monthlyBill: number;
  roofArea: number;
}

export interface CalculatorResult {
  recommendedSystemSize: number; // in kW
  estimatedCost: number; // USD
  annualSavings: number; // USD
  paybackPeriod: number; // years
}
