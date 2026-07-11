import { motion } from 'motion/react';
import { Rocket, Eye, ShieldAlert, Check, HelpCircle } from 'lucide-react';
import YellowStitchShaderBackground from './YellowStitchShaderBackground';
interface AboutViewProps {
  setChatbotOpen: (open: boolean) => void;
  setChatbotWelcomeMessage: (message: string) => void;
}

export default function AboutView({ setChatbotOpen, setChatbotWelcomeMessage }: AboutViewProps) {
  const triggerPhilosopySupport = (topic: string) => {
    setChatbotWelcomeMessage(`Hello! I'd love to chat about our ${topic} and how our engineering values translate to your project goals. What details are you curious about?`);
    setChatbotOpen(true);
  };

  return (
    <div className="relative min-h-screen text-deep-navy w-full">
      <YellowStitchShaderBackground />
      <div className="relative z-10">
        
        {/* Intro Hero Section */}
        <section className="pt-24 lg:pt-32 pb-12 lg:pb-16 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7 space-y-6"
            >
              <h1 className="font-display text-scale-h1 font-bold tracking-tight uppercase leading-tight text-deep-navy">
                About <br />
                <span className="text-warm-gold">Power Pulse Energy</span>
              </h1>
              <div className="font-sans text-scale-body-lg text-slate-gray leading-relaxed space-y-4">
                <p>
                  Power Pulse Energy was founded with a clear vision — to make solar energy affordable and accessible. We as a growing solar energy company provide residential, commercial, industrial, and agricultural solar solutions. We help customers reduce electricity costs and transition to clean renewable energy with complete project support.
                </p>
                <p>
                  Though we started just a year ago, our team brings strong technical knowledge and field experience in solar panel installation and renewable energy systems.
                </p>
                <p className="font-bold text-deep-navy uppercase tracking-wider text-sm">
                  Our mission is to support India's renewable energy growth while helping customers save money.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => triggerPhilosopySupport('solar solutions')}
                  className="btn-signature btn-primary flex items-center justify-center gap-2 shadow-soft"
                >
                  <Rocket className="h-4 w-4" />
                  <span>Talk to an Expert</span>
                </button>
              </div>
            </motion.div>

            {/* Right Media Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="md:col-span-5 relative h-[350px] md:h-[500px] rounded overflow-hidden shadow-soft border border-sky-blue/20 bg-white"
            >
              <img
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                alt="A large, modern industrial solar farm stretching across a wide landscape at dawn"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz78rPAmL_vRUA8uvPEFyodF9FuLQlMA1jofWVHqhwOa14ls62eDPkaCNr8NcnXcDAXsNeKLFedWboezfGWtRL2heXx0_t__XPah5Z1fZwG2wPhPKulsLCXfOJDXkCTB3P82VePgm7yUl32pqe-iGRxkcYutejv9G-5HuTNu90irsOsAHOSG3jzPXCt5SoksKw7AanBSEw208qkOG7p2IKw8SQdRGmcbtUH1M_pD-JQaAFLJOmYwCZuxLUSB_mMWqXv-C8bxJ7R8M"
              />
              <div className="absolute inset-0 bg-sky-blue/10"></div>
            </motion.div>

          </div>
        </section>

        {/* Philosophy Bento Bento Section */}
        <section className="py-12 lg:py-16 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-scale-h2 font-bold text-deep-navy mb-4 uppercase">
              Our Core Philosophy
            </h2>
            <div className="w-24 h-1.5 bg-warm-gold rounded" />
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            
            {/* Card 1: Mission */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-sky-blue/20 shadow-soft hover:bg-white transition-all duration-300 group relative flex flex-col justify-between"
            >
              <div>
                <Rocket className="text-deep-navy h-10 w-10 mb-6 block group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" />
                <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">Our Mission</h3>
                <p className="font-sans text-scale-body text-slate-gray leading-relaxed">
                  To deliver cost-effective solar solutions that promote energy independence and sustainability.
                </p>
              </div>
              <button
                onClick={() => triggerPhilosopySupport('Mission')}
                className="mt-6 btn-signature btn-ghost flex items-center gap-1.5 self-start group/btn"
              >
                <span>Deep Dive</span>
                <HelpCircle className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </motion.div>

            {/* Card 2: Vision */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="bg-sky-blue/10 p-8 rounded-2xl border border-sky-blue/20 shadow-soft hover:bg-sky-blue/20 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <Eye className="text-deep-navy h-10 w-10 mb-6 block group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" />
                <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">Our Vision</h3>
                <p className="font-sans text-scale-body text-slate-gray leading-relaxed">
                  To become one of the trusted solar installation companies through quality, transparency, and customer satisfaction.
                </p>
              </div>
              <button
                onClick={() => triggerPhilosopySupport('Vision')}
                className="mt-6 btn-signature btn-ghost flex items-center gap-1.5 self-start group/btn"
              >
                <span>Deep Dive</span>
                <HelpCircle className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </motion.div>

            {/* Card 3: We Serve */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
              className="bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-sky-blue/20 shadow-soft hover:bg-white transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <ShieldAlert className="text-deep-navy h-10 w-10 mb-6 block group-hover:scale-110 transition-transform duration-300 stroke-[1.5]" />
                <h3 className="font-display text-scale-h3 font-bold text-deep-navy mb-4">Who We Serve</h3>
                
                <ul className="space-y-3 font-sans text-scale-body text-slate-gray leading-relaxed">
                  {[
                    'Homeowners & Villas',
                    'Commercial buildings',
                    'Factories & Warehouses',
                    'Farms & Rural areas',
                    'Large-scale projects',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="p-0.5 rounded bg-sky-blue/30 text-deep-navy flex-shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => triggerPhilosopySupport('Clients')}
                className="mt-6 btn-signature btn-ghost flex items-center gap-1.5 self-start group/btn"
              >
                <span>Learn More</span>
                <HelpCircle className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </motion.div>

          </motion.div>
        </section>

        {/* Our Team Section */}
        <section className="py-12 lg:py-16 px-6 lg:px-16 max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-display text-scale-h2 font-bold text-deep-navy mb-4 uppercase">
              Our Team
            </h2>
            <div className="w-24 h-1.5 bg-warm-gold rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Alex Mercer',
                role: 'Chief Executive Officer',
                img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
              },
              {
                name: 'Sarah Jenkins',
                role: 'Chief Technology Officer',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
              },
              {
                name: 'Emily Davis',
                role: 'Head of Human Resources',
                img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
              },
              {
                name: 'Michael Chen',
                role: 'Lead Engineer',
                img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'
              }
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-sky-blue/20 rounded-2xl overflow-hidden shadow-soft group hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center flex-grow flex flex-col justify-center bg-soft-white border-t border-sky-blue/20">
                  <h3 className="font-display text-lg font-bold text-deep-navy uppercase tracking-tight">{member.name}</h3>
                  <p className="font-sans text-xs text-slate-gray font-bold uppercase tracking-widest mt-2">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
