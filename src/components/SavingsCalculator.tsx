import { useState, useEffect } from 'react';
import { Sun, DollarSign, PiggyBank, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyType } from '../types';

interface SavingsCalculatorProps {
  onGetProposal?: (data: {
    propertyType: PropertyType;
    monthlyBill: number;
    roofArea: number;
    systemSize: number;
    cost: number;
    savings: number;
    payback: number;
  }) => void;
}

export default function SavingsCalculator({ onGetProposal }: SavingsCalculatorProps) {
  const [propertyType, setPropertyType] = useState<PropertyType>('commercial');
  const [monthlyBill, setMonthlyBill] = useState(4500);
  const [roofArea, setRoofArea] = useState(12000);

  // Set initial ranges & defaults when propertyType changes
  useEffect(() => {
    if (propertyType === 'residential') {
      setMonthlyBill(250);
      setRoofArea(1500);
    } else {
      setMonthlyBill(4500);
      setRoofArea(12000);
    }
  }, [propertyType]);

  // Derived calculation formulas
  const calculateMetrics = () => {
    // Required kW to offset the monthly electricity bill
    // Assumes electric rate is $0.15 per kWh, and 1 kW produces ~125 kWh per month on average.
    const rawRequiredSize = (monthlyBill / 0.15) / 125;

    // Standard panel density: ~15W per sq ft usable area, or 1 kW per 66 sq ft.
    const maxCapacityFromRoof = roofArea / 66;

    // Recommended system size: lower of the two, rounded to nearest 5 kW
    let recommendedSystemSize = Math.min(rawRequiredSize, maxCapacityFromRoof);
    recommendedSystemSize = Math.max(5, Math.round(recommendedSystemSize / 5) * 5);

    // Costs: $1,900/kW for commercial, $2,800/kW for residential (pre-incentives)
    const costPerKw = propertyType === 'commercial' ? 1900 : 2800;
    const estimatedCost = recommendedSystemSize * costPerKw;

    // Annual production: 1,500 kWh per kW annually, offsetting bill at $0.15/kWh
    // Annual savings cannot exceed the total annual electric bill
    const annualProductionVal = recommendedSystemSize * 1500 * 0.15;
    const maxAnnualBill = monthlyBill * 12;
    const annualSavings = Math.round(Math.min(annualProductionVal, maxAnnualBill));

    // Payback period in years, accounting for 30% Federal Investment Tax Credit (ITC)
    const netCostAfterIitc = estimatedCost * 0.70;
    const paybackPeriod = Number((netCostAfterIitc / annualSavings).toFixed(1));

    return {
      recommendedSystemSize,
      estimatedCost,
      annualSavings,
      paybackPeriod: isNaN(paybackPeriod) || !isFinite(paybackPeriod) ? 0 : paybackPeriod,
    };
  };

  const { recommendedSystemSize, estimatedCost, annualSavings, paybackPeriod } = calculateMetrics();

  const handleProposalClick = () => {
    if (onGetProposal) {
      onGetProposal({
        propertyType,
        monthlyBill,
        roofArea,
        systemSize: recommendedSystemSize,
        cost: estimatedCost,
        savings: annualSavings,
        payback: paybackPeriod,
      });
    }
  };

  // Ranges depend on selected property type
  const billMax = propertyType === 'commercial' ? 20000 : 1500;
  const billMin = propertyType === 'commercial' ? 500 : 50;
  const areaMax = propertyType === 'commercial' ? 100000 : 10000;
  const areaMin = propertyType === 'commercial' ? 500 : 200;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column: Sliders */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">
            Calculate Your Potential Savings
          </h2>
          <p className="font-sans text-scale-body-lg text-slate-gray leading-relaxed">
            Use our precision calculator to estimate the required capacity and potential ROI for your facility. Designed for accuracy in both residential and enterprise applications.
          </p>
        </div>

        <div className="bg-soft-white p-6 md:p-8 rounded-2xl shadow-soft border border-sky-blue/20">
          <div className="space-y-6">
            
            {/* Property Type Toggle */}
            <div>
              <label className="font-sans text-xs uppercase tracking-wider block mb-4 text-slate-gray font-bold">
                Property Type
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPropertyType('commercial')}
                  className={`flex-1 w-full btn-signature ${
                    propertyType === 'commercial' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Commercial
                </button>
                <button
                  onClick={() => setPropertyType('residential')}
                  className={`flex-1 w-full btn-signature ${
                    propertyType === 'residential' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Residential
                </button>
              </div>
            </div>

            {/* Monthly Bill Slider */}
            <div>
              <div className="flex justify-between font-bold text-xs uppercase tracking-wider mb-2 text-slate-gray">
                <span>Average Monthly Bill</span>
                <span className="text-deep-navy font-mono text-sm">
                  ${monthlyBill.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={billMin}
                max={billMax}
                step={propertyType === 'commercial' ? 250 : 25}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full accent-warm-gold h-2 bg-sky-blue/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-gray/70 font-mono mt-1">
                <span>${billMin.toLocaleString()}</span>
                <span>${billMax.toLocaleString()}</span>
              </div>
            </div>

            {/* Roof Area Slider */}
            <div>
              <div className="flex justify-between font-bold text-xs uppercase tracking-wider mb-2 text-slate-gray">
                <span>Available Roof Area (sq ft)</span>
                <span className="text-deep-navy font-mono text-sm">
                  {roofArea.toLocaleString()} sq ft
                </span>
              </div>
              <input
                type="range"
                min={areaMin}
                max={areaMax}
                step={propertyType === 'commercial' ? 500 : 100}
                value={roofArea}
                onChange={(e) => setRoofArea(Number(e.target.value))}
                className="w-full accent-warm-gold h-2 bg-sky-blue/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-gray/70 font-mono mt-1">
                <span>{areaMin.toLocaleString()} sq ft</span>
                <span>{areaMax.toLocaleString()} sq ft</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Projections Display Box */}
      <div className="lg:col-span-5">
        <div className="bg-soft-white p-8 rounded-2xl shadow-soft border border-sky-blue/20 space-y-6">
          <div className="pb-4 border-b border-sky-blue/20">
            <h3 className="font-display text-xl font-bold tracking-tight text-deep-navy flex items-center gap-2">
              <span>Estimated Projection</span>
              <span className="text-xs bg-sky-blue/20 text-deep-navy py-1 px-2 rounded font-mono font-normal">
                Live
              </span>
            </h3>
          </div>

          <div className="space-y-6">
            
            {/* Metric 1: System Size */}
            <div className="flex justify-between items-end pb-4 border-b border-sky-blue/20 group">
              <div>
                <div className="text-xs text-slate-gray uppercase tracking-wider font-semibold mb-1">
                  Recommended System
                </div>
                <div className="text-2xl font-bold font-mono text-deep-navy group-hover:text-warm-gold transition-colors duration-200">
                  {recommendedSystemSize} kW
                </div>
              </div>
              <Sun className="h-7 w-7 text-deep-navy stroke-[1.5] group-hover:text-warm-gold group-hover:scale-110 transition-all duration-200" />
            </div>

            {/* Metric 2: System Cost */}
            <div className="flex justify-between items-end pb-4 border-b border-sky-blue/20 group">
              <div>
                <div className="text-xs text-slate-gray uppercase tracking-wider font-semibold mb-1">
                  Estimated Cost (Pre-Incentive)
                </div>
                <div className="text-2xl font-bold font-mono text-deep-navy group-hover:text-warm-gold transition-colors duration-200">
                  ${estimatedCost.toLocaleString()}
                </div>
              </div>
              <DollarSign className="h-7 w-7 text-deep-navy stroke-[1.5] group-hover:text-warm-gold group-hover:scale-110 transition-all duration-200" />
            </div>

            {/* Metric 3: Annual Savings */}
            <div className="flex justify-between items-end pb-4 border-b border-sky-blue/20 group">
              <div>
                <div className="text-xs text-slate-gray uppercase tracking-wider font-semibold mb-1">
                  Annual Savings
                </div>
                <div className="text-2xl font-bold font-mono text-deep-navy group-hover:text-warm-gold transition-colors duration-200">
                  ${annualSavings.toLocaleString()}
                </div>
              </div>
              <PiggyBank className="h-7 w-7 text-deep-navy stroke-[1.5] group-hover:text-warm-gold group-hover:scale-110 transition-all duration-200" />
            </div>

            {/* Metric 4: Payback Period */}
            <div className="flex justify-between items-end group">
              <div>
                <div className="text-xs text-slate-gray uppercase tracking-wider font-semibold mb-1">
                  Estimated Payback Period
                </div>
                <div className="text-2xl font-bold font-mono text-deep-navy group-hover:text-warm-gold transition-colors duration-200">
                  {paybackPeriod} Years
                </div>
              </div>
              <TrendingUp className="h-7 w-7 text-deep-navy stroke-[1.5] group-hover:text-warm-gold group-hover:scale-110 transition-all duration-200" />
            </div>

          </div>

          <div className="pt-4">
            <button
              onClick={handleProposalClick}
              className="w-full btn-signature btn-primary flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Get Detailed Proposal</span>
            </button>
            <p className="text-[10px] text-slate-gray font-mono text-center mt-3">
              Calculations include 30% Federal Investment Tax Credit (ITC). Net cost: ${(estimatedCost * 0.70).toLocaleString()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
