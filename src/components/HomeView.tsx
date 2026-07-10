import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Award, CheckCircle, Users, Activity, ChevronDown, Sparkles, Home, Building2, Sun, Wrench, ShieldCheck, ArrowRight, X } from 'lucide-react';
import SavingsCalculator from './SavingsCalculator';
import ContactView from './ContactView';
import { PropertyType } from '../types';

interface HomeViewProps {
  setCurrentView: (view: string) => void;
  setChatbotOpen: (open: boolean) => void;
  setChatbotWelcomeMessage: (message: string) => void;
  onSelectProposalData: (data: any) => void;
}

export default function HomeView({
  setCurrentView,
  setChatbotOpen,
  setChatbotWelcomeMessage,
  onSelectProposalData,
}: HomeViewProps) {
  const calculatorSectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '30%']);

  const handleScrollToCalculator = () => {
    if (calculatorSectionRef.current) {
      calculatorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGetProposal = (data: {
    propertyType: PropertyType;
    monthlyBill: number;
    roofArea: number;
    systemSize: number;
    cost: number;
    savings: number;
    payback: number;
  }) => {
    onSelectProposalData(data);
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestConsultation = () => {
    setChatbotWelcomeMessage("Hello! Let's arrange a free, personalized technical consultation for your project. To start, what is your name and property address?");
    setChatbotOpen(true);
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img
            style={{ y: backgroundY }}
            className="w-full h-[130%] object-cover select-none pointer-events-none filter brightness-90 absolute top-[-15%]"
            referrerPolicy="no-referrer"
            alt="A sprawling, high-end commercial solar power plant stretching to the horizon under a bright, clear sky"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8imxHTHFkVL44-R-BJdRQZku8feefeXPdKE6N5LmPiEjlQP2Kvhe_fces_pLVHHAnyGqIIfrvdgzwgDfqqlx5_iyVhVSxuLT1rgzamXdbCWJb1gZ63isOxK0iboljVcsh02yJVJlaiRAG5zqBwwrVj9CJdPL7SRuBusp83mfoK4ebxJ8t4hApN-yA81lqbM8ECmzqN4MlMWuJ_PH-aj5WN9J4DWpxGAdPYFGOTrU5ZZg-2cSpjkdGDUQ8QXAeVi0mUypKfKEsSWM"
          />
          <div className="absolute inset-0 bg-sky-blue/40 backdrop-blur-[2px] bg-gradient-to-b from-soft-white/60 to-sky-blue/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 w-full text-center text-deep-navy py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-sky-blue/20 border border-sky-blue/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-deep-navy">
              <Sparkles className="h-3 w-3 text-deep-navy" />
              <span>Looking for a trusted solar company?</span>
            </div>

            <h1 className="font-display text-scale-h1 font-bold tracking-tight leading-tight uppercase">
              Welcome to <br />
              <span className="text-deep-navy tracking-wide relative inline-block">
                Power Pulse Energy
              </span>
            </h1>

            <div className="font-sans text-scale-body-lg max-w-3xl mx-auto text-slate-gray leading-relaxed space-y-4">
              <p>
                Your reliable partner for residential, commercial, industrial, and agricultural solar solutions. 
              </p>
              <p>
                We help homeowners, factories, farms, villas, rural areas, and large-scale projects switch to clean, affordable, and sustainable solar power.
              </p>
              <p className="font-bold text-deep-navy uppercase tracking-wider text-sm mt-4">
                Reduce your electricity bills. Gain energy independence. Power your future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={handleRequestConsultation}
                className="w-full sm:w-auto btn-signature btn-primary"
              >
                Get Free Consultation
              </button>
              <button
                onClick={handleScrollToCalculator}
                className="w-full sm:w-auto btn-signature btn-secondary"
              >
                Get Solar Estimate
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce hidden md:block"
            onClick={handleScrollToCalculator}
          >
            <ChevronDown className="h-8 w-8 text-deep-navy/50 hover:text-deep-navy transition-colors" />
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 bg-soft-white relative">
        <motion.div 
          className="max-w-7xl mx-auto px-6 md:px-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Box 1 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="p-8 rounded-2xl bg-white border border-sky-blue/20 shadow-soft transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-sky-blue/20 flex items-center justify-center mb-6">
                <Wrench className="h-7 w-7 text-deep-navy stroke-[1.5]" />
              </div>
              <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">
                Complete Solar Panel Installation Services
              </h3>
              <p className="text-slate-gray font-sans text-scale-body mb-6">
                We provide end-to-end solar panel installation, including:
              </p>
              <ul className="space-y-3">
                {['Site survey & energy analysis', 'Custom solar system design', 'Government subsidy guidance', 'Professional installation', 'Net metering assistance', 'After-installation support'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-deep-navy shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-sans text-slate-gray font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-sky-blue/20">
                <p className="font-bold text-sm text-deep-navy italic">From rooftop systems to ground-mounted mega projects — we handle it all.</p>
              </div>
            </motion.div>

            {/* Box 2 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="p-8 rounded-2xl bg-white border border-sky-blue/20 shadow-soft transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-sky-blue/20 flex items-center justify-center mb-6">
                <Home className="h-7 w-7 text-deep-navy stroke-[1.5]" />
              </div>
              <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">
                Residential Solar Solutions
              </h3>
              <p className="text-slate-gray font-sans text-scale-body mb-6">
                Perfect for any residential models:
              </p>
              <ul className="space-y-3 mb-10">
                {['Independent houses', 'Villas', 'Rural homes'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-deep-navy shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-sans text-slate-gray font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Box 3 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="p-8 rounded-2xl bg-white border border-sky-blue/20 shadow-soft transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-sky-blue/20 flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-deep-navy stroke-[1.5]" />
              </div>
              <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">
                Commercial & Industrial Solar Projects
              </h3>
              <p className="text-slate-gray font-sans text-scale-body mb-6">
                Businesses across India are switching to solar to reduce operational costs. We install solar systems for:
              </p>
              <ul className="space-y-3">
                {['Commercial buildings', 'Factories', 'Warehouses', 'Shopping complexes', 'Processing units'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-deep-navy shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-sans text-slate-gray font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-sky-blue/20">
                <p className="font-bold text-sm text-deep-navy italic">Lower your electricity expenses and improve long-term profitability.</p>
              </div>
            </motion.div>

            {/* Box 4 */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="p-8 rounded-2xl bg-white border border-sky-blue/20 shadow-soft transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-sky-blue/20 flex items-center justify-center mb-6">
                <Sun className="h-7 w-7 text-deep-navy stroke-[1.5]" />
              </div>
              <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">
                Agricultural Solar & PM Kusum Support
              </h3>
              <p className="text-slate-gray font-sans text-scale-body mb-6">
                We support farmers with:
              </p>
              <ul className="space-y-3">
                {['Solar water pumps', 'Agricultural solar systems', 'PM Kusum Yojana guidance', 'Rural solar electrification'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-deep-navy shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-sans text-slate-gray font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-sky-blue/20">
                <p className="font-bold text-sm text-deep-navy italic">Solar power helps reduce diesel costs and ensures reliable irrigation.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Calculator Section */}
      <section
        ref={calculatorSectionRef}
        id="calculator"
        className="py-24 bg-sky-blue/10 relative overflow-hidden scroll-mt-20 border-b border-sky-blue/20"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
             <h2 className="font-display text-scale-h2 font-bold uppercase text-deep-navy mb-4">Calculate Your Savings</h2>
             <p className="font-sans text-scale-body-lg text-slate-gray">Estimate your potential energy savings by switching to solar power with us.</p>
          </motion.div>
          <SavingsCalculator onGetProposal={handleGetProposal} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-soft-white text-deep-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-scale-h2 font-bold uppercase mb-6">
              Why Choose <span className="text-warm-gold">Power Pulse Energy?</span>
            </h2>
            <p className="font-sans text-scale-body-lg text-slate-gray">
              We are a growing solar energy company in India committed to quality and trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Transparent pricing',
              'Customized solar solutions',
              'End-to-end project execution',
              'Net Metering Assistance',
              'Fast Execution',
              'Dedicated Support',
              'Government scheme assistance',
              'Fast installation',
              'Dedicated customer support'
            ].map((reason, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="flex items-center gap-4 bg-sky-blue/5 border border-sky-blue/20 p-5 rounded-lg hover:bg-sky-blue/10 transition-colors shadow-soft"
              >
                <ShieldCheck className="h-6 w-6 text-deep-navy shrink-0 stroke-[1.5]" />
                <span className="font-sans font-bold tracking-wide text-sm text-deep-navy">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-sky-blue/20 text-center border-t border-sky-blue/30 relative overflow-hidden isolate">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=2000')", zIndex: -1 }}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 relative z-10"
        >
          <h2 className="font-display text-scale-h2 font-bold uppercase text-deep-navy mb-6">
            Get a Free Solar Consultation Today
          </h2>
          <p className="font-sans text-scale-body-lg text-slate-gray mb-10">
            Looking for the best solar panel installation company? <br className="hidden md:block"/>
            Contact Power Pulse Energy and get a customized solar quote today.
          </p>
          <button
            onClick={handleRequestConsultation}
            className="inline-flex items-center justify-center gap-3 btn-signature btn-primary shadow-soft"
          >
            <span>Contact Us Now</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </section>


    </div>
  );
}

