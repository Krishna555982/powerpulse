import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Home, Sun, Factory, CheckCircle2, ArrowRight, X } from 'lucide-react';
import YellowStitchShaderBackground from './YellowStitchShaderBackground';
interface ServicesViewProps {
  setCurrentView: (view: string) => void;
  setChatbotOpen: (open: boolean) => void;
  setChatbotWelcomeMessage: (message: string) => void;
}

export default function ServicesView({
  setCurrentView,
  setChatbotOpen,
  setChatbotWelcomeMessage,
}: ServicesViewProps) {
  
  const [selectedService, setSelectedService] = useState<{
    title: string;
    desc: string;
    subText: string;
    points: string[];
    icon: any;
  } | null>(null);

  const handleServiceInquiry = (serviceName: string) => {
    setChatbotWelcomeMessage(`Hello! I'd be happy to discuss our "${serviceName}" services. Do you have specific monthly energy requirements or details about your site that we should analyze?`);
    setChatbotOpen(true);
    setSelectedService(null);
  };

  const servicesList = [
    {
      icon: Home,
      title: 'Residential Solar Installation',
      desc: 'Power Pulse Energy provides affordable and high-efficiency residential solar panel installation. Our rooftop solar systems help homeowners reduce electricity bills and achieve energy independence.',
      subText: 'We design systems based on your home\'s: Roof size, Energy consumption, Budget, and Local electricity rates.',
      points: ['Save up to 70% on electricity bills', 'Increase property value', 'Get support for government solar schemes'],
    },
    {
      icon: Building2,
      title: 'Commercial Solar Company',
      desc: 'Looking for a reliable commercial solar company? We provide customized solar solutions for your business. Our commercial solar systems help reduce operating costs and improve sustainability goals.',
      subText: 'We design for long term reliability, that fits every sector.',
      points: ['Office buildings', 'Retail outlets & Hotels', 'Warehouses & Institutions'],
    },
    {
      icon: Factory,
      title: 'Industrial Solar Projects',
      desc: 'Factories consume high electricity. Solar reduces long-term costs. Switch to industrial solar power and stabilize your production costs.',
      subText: '',
      points: ['Large-capacity rooftop solar', 'Ground-mounted solar plants', 'Industrial energy optimization'],
    },
    {
      icon: Sun,
      title: 'PM Kusum Solar & Agricultural Solutions',
      desc: 'Power Pulse Energy assists farmers under the PM Kusum Solar Scheme. Empower your farm with reliable solar energy.',
      subText: '',
      points: ['Solar pump installation', 'Government subsidy guidance', 'Application assistance', 'System setup'],
    },
  ];

  return (
    <div className="relative min-h-screen text-deep-navy w-full">
      <YellowStitchShaderBackground />
      <div className="relative z-10 pt-24 pb-16">
        
        {/* Services Header */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="font-display text-scale-h1 font-bold uppercase text-deep-navy tracking-wide">
                Our Solar Solutions
              </h1>
              <p className="font-sans text-scale-body-lg text-slate-gray max-w-2xl mx-auto leading-relaxed">
                We provide comprehensive, tailored renewable energy solutions. From affordable residential installations to large-scale industrial projects, Power Pulse Energy is your dedicated partner.
              </p>
              <div className="w-16 h-1.5 bg-warm-gold mx-auto rounded" />
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 max-w-7xl mx-auto px-6 md:px-16">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
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
            {servicesList.map((srv, index) => {
              const IconComponent = srv.icon;
              return (
                <motion.div
                  key={srv.title}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                  }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                  onClick={() => setSelectedService(srv)}
                  className="p-8 rounded-2xl border border-sky-blue/20 bg-white/60 backdrop-blur-md hover:bg-white transition-all duration-300 group flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-6">
                    {/* Service Icon */}
                    <div className="w-12 h-12 rounded-lg bg-sky-blue/10 border border-sky-blue/20 flex items-center justify-center text-deep-navy group-hover:bg-sky-blue/20 transition-all duration-300">
                      <IconComponent className="h-6 w-6 stroke-[1.5]" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-display text-scale-h3 font-bold text-deep-navy tracking-tight">
                        {srv.title}
                      </h3>
                      <p className="font-sans text-scale-body text-slate-gray leading-relaxed line-clamp-3">
                        {srv.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Call to Action Bar */}
        <section className="bg-sky-blue/10 backdrop-blur-md py-16 mx-6 md:mx-16 rounded-2xl text-deep-navy overflow-hidden relative shadow-soft border border-sky-blue/20 mt-8">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0B2D4A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="font-display text-scale-h2 font-bold">
                Ready to construct your sustainable future?
              </h2>
              <p className="font-sans text-scale-body-lg text-slate-gray max-w-lg">
                Contact our engineering and sales representatives today. We will model your facility layout to produce a high-fidelity system design.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-signature btn-primary shadow-soft flex-shrink-0"
            >
              Get Detailed Proposal
            </button>
          </div>
        </section>

      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-soft-white border border-sky-blue/20 rounded-2xl shadow-soft overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 bg-white/80 backdrop-blur-md border-b border-sky-blue/20 flex justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-blue/10 border border-sky-blue/20 flex items-center justify-center text-deep-navy flex-shrink-0 shadow-sm">
                    <selectedService.icon className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-display text-scale-h3 font-bold text-deep-navy tracking-tight leading-tight">
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-slate-gray hover:text-deep-navy hover:bg-sky-blue/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-4">
                  <p className="font-sans text-scale-body text-slate-gray leading-relaxed">
                    {selectedService.desc}
                  </p>
                  {selectedService.subText && (
                    <p className="font-sans text-sm text-slate-gray leading-relaxed italic bg-sky-blue/5 p-4 rounded-lg border border-sky-blue/10 shadow-sm">
                      {selectedService.subText}
                    </p>
                  )}
                </div>

                {selectedService.points.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-deep-navy uppercase tracking-wider text-xs mb-4">Key Benefits & Features</h4>
                    <ul className="space-y-3">
                      {selectedService.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm text-slate-gray font-sans bg-sky-blue/5 p-3 rounded-lg border border-sky-blue/10 hover:bg-white hover:shadow-soft transition-all">
                          <CheckCircle2 className="h-5 w-5 text-deep-navy flex-shrink-0 stroke-[1.5]" />
                          <span className="pt-0.5">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-t border-sky-blue/20 flex justify-end">
                <button
                  onClick={() => handleServiceInquiry(selectedService.title)}
                  className="w-full sm:w-auto btn-signature btn-primary shadow-soft gap-2"
                >
                  <span>Inquire About This Service</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

