import { useState } from 'react';
import { 
  Share2, Mail, FileDown, MessageCircle, Zap, MapPin, 
  Building2, Home, Factory, Calculator, DollarSign, 
  TrendingUp, SunMedium, Activity, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type CalculationMethod = 'bill' | 'units' | 'area';
type Location = 'TG' | 'AP';
type CustomerType = 'residential' | 'commercial' | 'industrial';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function FormattedNumber({ value, prefix = '', suffix = '', decimals = 0 }: AnimatedNumberProps) {
  const formatted = value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return <span>{prefix}{formatted}{suffix}</span>;
}

export default function SavingsCalculator() {
  // Form State
  const [method, setMethod] = useState<CalculationMethod>('bill');
  const [inputValue, setInputValue] = useState<number>(5000);
  const [location, setLocation] = useState<Location>('TG');
  const [customerType, setCustomerType] = useState<CustomerType>('residential');
  const [applySubsidy, setApplySubsidy] = useState<boolean>(true);
  const [unitCost, setUnitCost] = useState<number>(5.5);
  const [areaUnit, setAreaUnit] = useState<'sqft' | 'sqm'>('sqft');
  
  // View State
  const [isCalculated, setIsCalculated] = useState(false);

  // Calculations
  const calculateMetrics = () => {
    let monthlyUnits = 0;
    let plantSizeKwp = 0; // kWp
    
    // Constants
    const unitsPerKwpMonthly = 138; // approx 4.6 units/day * 30
    const dailyPeakSunHours = 5.7;

    if (method === 'bill') {
      monthlyUnits = inputValue / unitCost;
      plantSizeKwp = monthlyUnits / unitsPerKwpMonthly;
    } else if (method === 'units') {
      monthlyUnits = inputValue;
      plantSizeKwp = monthlyUnits / unitsPerKwpMonthly;
    } else if (method === 'area') {
      const areaInSqFt = areaUnit === 'sqm' ? inputValue * 10.764 : inputValue;
      plantSizeKwp = areaInSqFt / 100; // ~100 sqft per 1 kWp
      monthlyUnits = plantSizeKwp * unitsPerKwpMonthly;
    }

    // Cap/Floor bounds for realism
    plantSizeKwp = Math.max(0.5, plantSizeKwp);
    monthlyUnits = plantSizeKwp * unitsPerKwpMonthly;

    const dailyGeneration = plantSizeKwp * (unitsPerKwpMonthly / 30);
    const annualGeneration = monthlyUnits * 12;
    const lifetimeGeneration = annualGeneration * 28; // approx 30 years with degradation

    const monthlySavings = monthlyUnits * unitCost;
    const annualSavings = annualGeneration * unitCost;
    const lifetimeSavings = lifetimeGeneration * unitCost;

    const costPerKwp = customerType === 'residential' ? 60000 : 50000;
    const systemCost = plantSizeKwp * costPerKwp;
    
    let subsidyAmount = 0;
    if (customerType === 'residential' && applySubsidy) {
      if (plantSizeKwp <= 2) {
        subsidyAmount = plantSizeKwp * 30000;
      } else if (plantSizeKwp <= 3) {
        subsidyAmount = 60000 + (plantSizeKwp - 2) * 18000;
      } else {
        subsidyAmount = 78000;
      }
    }
    
    const netInvestment = systemCost - subsidyAmount;
    
    const paybackPeriod = netInvestment / annualSavings;
    const annualRoi = (annualSavings / netInvestment) * 100;

    return {
      plantSizeKwp,
      dailyGeneration,
      dailyPeakSunHours,
      generation: {
        monthly: monthlyUnits,
        annual: annualGeneration,
        lifetime: lifetimeGeneration,
      },
      savings: {
        monthly: monthlySavings,
        annual: annualSavings,
        lifetime: lifetimeSavings,
      },
      systemCost,
      subsidyAmount,
      netInvestment,
      paybackPeriod,
      annualRoi
    };
  };

  const metrics = calculateMetrics();

  const handleCalculate = () => {
    setIsCalculated(true);
    // Scroll slightly so the report is visible on mobile if needed
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  const formatLakhs = (val: number) => {
    if (val >= 100000) {
      return (val / 100000).toFixed(2) + ' L';
    }
    return val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  return (
    <div className="w-full relative px-2 py-4 flex justify-center">
      <div 
        className="w-full max-w-[1600px] flex flex-col lg:flex-row gap-8 items-start justify-center transition-all duration-700"
      >
        {/* LEFT COLUMN: CALCULATOR */}
        <motion.div 
          layout
          transition={{ type: 'spring', bounce: 0.1, duration: 0.7 }}
          className={`w-full ${isCalculated ? "lg:w-[45%]" : "max-w-3xl"}`}
        >
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-soft border border-sky-blue/20 relative z-10 h-full">
            
            {/* STEP 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-sky-blue/30 text-deep-navy font-bold flex items-center justify-center text-sm">1</div>
                <h3 className="font-display text-lg font-bold text-deep-navy">How would you like to calculate?</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <button
                  onClick={() => { setMethod('bill'); setInputValue(5000); }}
                  className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${
                    method === 'bill' 
                    ? 'border-warm-gold bg-warm-gold/10 text-deep-navy' 
                    : 'border-slate-200 text-slate-400 hover:border-sky-blue/50'
                  }`}
                >
                  Monthly Bill
                </button>
                <button
                  onClick={() => { setMethod('units'); setInputValue(600); }}
                  className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${
                    method === 'units' 
                    ? 'border-warm-gold bg-warm-gold/10 text-deep-navy' 
                    : 'border-slate-200 text-slate-400 hover:border-sky-blue/50'
                  }`}
                >
                  Monthly Units
                </button>
                <button
                  onClick={() => { setMethod('area'); setInputValue(1000); }}
                  className={`p-3 rounded-xl border-2 font-bold transition-all text-sm ${
                    method === 'area' 
                    ? 'border-warm-gold bg-warm-gold/10 text-deep-navy' 
                    : 'border-slate-200 text-slate-400 hover:border-sky-blue/50'
                  }`}
                >
                  Roof Area
                </button>
              </div>

              <div className="bg-sky-blue/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-xs block">
                    Enter your average {method === 'bill' ? 'monthly bill (₹)' : method === 'units' ? 'monthly consumption (kWh)' : 'available roof area'}
                  </label>
                  {method === 'area' && (
                    <div className="flex bg-white w-fit rounded-lg p-0.5 border border-slate-200 mt-2">
                      <button onClick={() => setAreaUnit('sqft')} className={`px-2 py-1 text-[10px] rounded-md font-bold uppercase transition-colors ${areaUnit === 'sqft' ? 'bg-sky-blue/20 text-deep-navy' : 'text-slate-400 hover:text-slate-600'}`}>sq.ft</button>
                      <button onClick={() => setAreaUnit('sqm')} className={`px-2 py-1 text-[10px] rounded-md font-bold uppercase transition-colors ${areaUnit === 'sqm' ? 'bg-sky-blue/20 text-deep-navy' : 'text-slate-400 hover:text-slate-600'}`}>sq.metres</button>
                    </div>
                  )}
                </div>
                <div className="relative w-full sm:w-1/3">
                  {method === 'bill' && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-navy font-bold">₹</span>}
                  <input 
                    type="number" 
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-deep-navy focus:outline-none focus:border-warm-gold focus:ring-2 focus:ring-warm-gold/20 ${method === 'bill' ? 'pl-8' : 'pr-16'}`}
                  />
                  {method === 'units' && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none">kWh</span>}
                  {method === 'area' && <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none">{areaUnit === 'sqft' ? 'sq.ft' : 'sq.m'}</span>}
                </div>
              </div>
            </div>

            <hr className="border-slate-100 mb-8" />

            {/* STEP 2 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-sky-blue/30 text-deep-navy font-bold flex items-center justify-center text-sm">2</div>
                <h3 className="font-display text-lg font-bold text-deep-navy">Location & Customer Type</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider text-xs mb-2">
                    Select Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value as Location)}
                      className="w-full bg-white border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 font-bold text-deep-navy appearance-none focus:outline-none focus:border-warm-gold cursor-pointer text-sm"
                    >
                      <option value="TG">Telangana</option>
                      <option value="AP">Andhra Pradesh</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider text-xs mb-2">
                    Customer Type
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'residential', icon: Home, label: 'Res' },
                      { id: 'commercial', icon: Building2, label: 'Com' },
                      { id: 'industrial', icon: Factory, label: 'Ind' }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setCustomerType(type.id as CustomerType)}
                          className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 font-bold transition-all ${
                            customerType === type.id 
                            ? 'border-warm-gold bg-warm-gold/10 text-deep-navy' 
                            : 'border-slate-200 text-slate-400 hover:border-sky-blue/50'
                          }`}
                          title={type.id.charAt(0).toUpperCase() + type.id.slice(1)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-[10px] uppercase">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  {customerType === 'residential' && (
                    <div className="mt-3 bg-sky-blue/5 p-3 rounded-xl border border-sky-blue/20">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={applySubsidy}
                          onChange={(e) => setApplySubsidy(e.target.checked)}
                          className="mt-0.5 rounded text-sky-blue focus:ring-sky-blue border-slate-300"
                        />
                        <span className="text-xs text-deep-navy font-bold leading-tight">Apply PM Surya Ghar Subsidy</span>
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
                        PM Surya Ghar Muft Bijli Yojana subsidy applies to DCR panels for residential customers only.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-slate-100 mb-8" />

            {/* STEP 3 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-sky-blue/30 text-deep-navy font-bold flex items-center justify-center text-sm">3</div>
                <h3 className="font-display text-lg font-bold text-deep-navy">Electricity Unit Cost</h3>
              </div>
              
              <div className="bg-sky-blue/10 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">Price per kWh</span>
                  <div className="flex items-center gap-2">
                    <span className="text-deep-navy font-bold text-lg">₹</span>
                    <input 
                      type="number"
                      step="0.1"
                      value={unitCost}
                      onChange={(e) => setUnitCost(Number(e.target.value))}
                      className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-deep-navy text-lg text-center focus:outline-none focus:border-warm-gold"
                    />
                  </div>
                </div>
                
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.1"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-warm-gold"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                  <span>₹2.0</span>
                  <span>₹15.0</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <button 
              onClick={handleCalculate}
              className={`w-full font-bold text-lg py-4 rounded-2xl shadow-soft transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                isCalculated ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-warm-gold hover:bg-yellow-500 text-deep-navy shadow-[0_10px_30px_-10px_rgba(251,191,36,0.4)]'
              }`}
            >
              {isCalculated ? 'Recalculate Savings' : (
                <>
                  <SunMedium className="h-5 w-5" />
                  Calculate My Solar Savings
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: REPORT */}
        <AnimatePresence>
          {isCalculated && (
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.95, width: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, width: '100%' }}
              exit={{ opacity: 0, x: 50, scale: 0.95, width: 0 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.1 }}
              className="w-full lg:w-[55%]"
            >
              <div className="bg-sky-blue/5 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-soft border border-sky-blue/30 space-y-6">
                
                {/* Share Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sky-blue/20">
                  <div className="flex items-center gap-2 text-sm font-bold text-deep-navy">
                    <Share2 className="h-4 w-4" /> Share Report
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#20b858] transition-colors">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg> WhatsApp
                    </button>
                    <button className="flex items-center gap-1.5 bg-sky-blue/10 text-deep-navy px-3 py-1.5 rounded-full text-xs font-bold hover:bg-sky-blue/20 transition-colors">
                      <Mail className="h-3 w-3" /> Email
                    </button>
                    <button className="flex items-center gap-1.5 bg-deep-navy text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-deep-navy/90 transition-colors">
                      <FileDown className="h-3 w-3" /> PDF
                    </button>
                  </div>
                </div>

                {/* Plant Size Hero Card (Website Theme: Navy & Sky Blue) */}
                <div className="bg-gradient-to-br from-deep-navy to-sky-blue rounded-3xl p-6 relative overflow-hidden shadow-lg text-white">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">Recommended Plant Size</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl md:text-7xl font-black tracking-tight text-white">{metrics.plantSizeKwp.toFixed(2)}</span>
                        <span className="text-xl font-bold text-warm-gold">kWp</span>
                      </div>
                      <p className="text-white/80 mt-1 text-xs">
                        Based on your {method === 'bill' ? 'monthly bill' : method === 'units' ? 'monthly units' : 'roof area'}
                      </p>
                    </div>

                    <div className="space-y-2 w-full md:w-auto">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center md:text-left">
                        <p className="text-[10px] font-bold uppercase text-white/80 mb-0.5">Daily Generation</p>
                        <p className="text-lg font-bold text-white">{metrics.dailyGeneration.toFixed(1)} kWh</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center md:text-left">
                        <p className="text-[10px] font-bold uppercase text-white/80 mb-0.5">Peak Sun Hours</p>
                        <p className="text-lg font-bold text-white">{metrics.dailyPeakSunHours} hrs/day</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Electricity Generation */}
                <div>
                  <div className="flex items-center gap-2 mb-3 border-b border-sky-blue/20 pb-2">
                    <Zap className="h-4 w-4 text-warm-gold" />
                    <h3 className="font-bold text-slate-500 tracking-wider text-xs uppercase">Electricity Generation</h3>
                  </div>
                  
                  <div className="bg-white border border-sky-blue/20 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-blue"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none translate-y-[1px]">Monthly</span>
                        </div>
                        <p className="text-2xl font-black text-deep-navy mb-0.5"><FormattedNumber value={metrics.generation.monthly} decimals={0} /> kWh</p>
                        <p className="text-[10px] text-slate-400">per month</p>
                      </div>
                      <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-deep-navy"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none translate-y-[1px]">Annual</span>
                        </div>
                        <p className="text-2xl font-black text-deep-navy mb-0.5"><FormattedNumber value={metrics.generation.annual} decimals={0} /> kWh</p>
                        <p className="text-[10px] text-slate-400">per year</p>
                      </div>
                      <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-warm-gold"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none translate-y-[1px]">30-Year</span>
                        </div>
                        <p className="text-2xl font-black text-deep-navy mb-0.5"><FormattedNumber value={metrics.generation.lifetime} decimals={0} /> kWh</p>
                        <p className="text-[10px] text-slate-400">lifetime total</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Savings */}
                <div>
                  <div className="flex items-center gap-2 mb-3 border-b border-sky-blue/20 pb-2">
                    <span className="text-sm font-bold text-warm-gold">₹</span>
                    <h3 className="font-bold text-slate-500 tracking-wider text-xs uppercase">Financial Savings</h3>
                  </div>
                  
                  <div className="bg-white border border-sky-blue/20 rounded-2xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-blue"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none translate-y-[1px]">Monthly</span>
                        </div>
                        <p className="text-2xl font-black text-deep-navy mb-0.5">₹<FormattedNumber value={metrics.savings.monthly} decimals={0} /></p>
                        <p className="text-[10px] text-slate-400">per month</p>
                      </div>
                      <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-deep-navy"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none translate-y-[1px]">Annual</span>
                        </div>
                        <p className="text-2xl font-black text-deep-navy mb-0.5">₹<FormattedNumber value={metrics.savings.annual} decimals={0} /></p>
                        <p className="text-[10px] text-slate-400">per year</p>
                      </div>
                      <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-warm-gold"></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none translate-y-[1px]">30-Year</span>
                        </div>
                        <p className="text-2xl font-black text-deep-navy mb-0.5">₹{formatLakhs(metrics.savings.lifetime)}</p>
                        <p className="text-[10px] text-slate-400">lifetime savings</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Cost & ROI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-sky-blue/20 rounded-2xl p-5">
                    <div className={`flex justify-between items-center text-slate-500 text-xs ${metrics.subsidyAmount > 0 ? 'mb-2' : 'mb-3 border-b border-slate-100 pb-2'}`}>
                      <span>System Cost</span>
                      <span className="font-bold text-deep-navy">₹<FormattedNumber value={metrics.systemCost} decimals={0}/></span>
                    </div>
                    {metrics.subsidyAmount > 0 && (
                      <div className="flex justify-between items-center mb-3 text-emerald-600 text-xs border-b border-slate-100 pb-2">
                        <span>Subsidy Applicable</span>
                        <span className="font-bold">-₹<FormattedNumber value={metrics.subsidyAmount} decimals={0}/></span>
                      </div>
                    )}
                    <div className="bg-sky-blue/10 rounded-xl p-4 text-center mt-2">
                      <span className="font-black text-deep-navy text-sm block mb-1">Your Net Investment</span>
                      <span className="font-black text-2xl text-deep-navy">₹<FormattedNumber value={metrics.netInvestment} decimals={0}/></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-sky-blue/20 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-sm">
                      <p className="text-2xl font-black text-sky-blue mb-1">{metrics.paybackPeriod.toFixed(1)} Yrs</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Payback</p>
                    </div>
                    
                    <div className="bg-white border border-sky-blue/20 rounded-2xl p-4 text-center flex flex-col justify-center items-center shadow-sm">
                      <p className="text-2xl font-black text-warm-gold mb-1">{metrics.annualRoi.toFixed(1)}%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Annual ROI</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
