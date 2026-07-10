import { motion } from 'motion/react';
import { ArrowRight, Building2, Factory, Home, MapPin, Zap } from 'lucide-react';
import YellowStitchShaderBackground from './YellowStitchShaderBackground';
interface GalleryViewProps {
  setCurrentView: (view: string) => void;
}

const galleryProjects = [
  {
    title: 'Logistics Hub Rooftop Array',
    location: 'Phoenix, AZ',
    type: 'Commercial',
    capacity: '1.8 MW',
    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80',
    icon: Factory,
  },
  {
    title: 'Executive Residence Solar Canopy',
    location: 'Austin, TX',
    type: 'Residential',
    capacity: '42 kW',
    image:
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80',
    icon: Home,
  },
  {
    title: 'Manufacturing Plant Energy Retrofit',
    location: 'Columbus, OH',
    type: 'Industrial',
    capacity: '3.4 MW',
    image:
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1400&q=80',
    icon: Building2,
  },
  {
    title: 'Battery-Ready Ground Mount Field',
    location: 'Riverside, CA',
    type: 'Utility',
    capacity: '5.2 MW',
    image:
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80',
    icon: Zap,
  },
];

export default function GalleryView({ setCurrentView }: GalleryViewProps) {
  return (
    <div className="relative min-h-screen text-deep-navy w-full overflow-hidden">
      <YellowStitchShaderBackground />
      <div className="relative z-10 pt-24 pb-20">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <h1 className="font-display text-scale-h1 font-bold uppercase tracking-wide">
                Project Gallery
              </h1>
              <p className="font-sans text-scale-body-lg text-slate-gray mt-5 leading-relaxed">
                A field view of high-performance solar infrastructure across commercial rooftops,
                residential estates, industrial retrofits, and utility-scale arrays.
              </p>
              <div className="w-16 h-1.5 bg-warm-gold rounded mt-6" />
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryProjects.map((project, index) => {
              const Icon = project.icon;

              return (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-sky-blue/20 shadow-soft"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/40 to-transparent" />

                  <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-between p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 rounded bg-soft-white/90 px-3 py-2 text-xs font-bold uppercase tracking-wider text-deep-navy backdrop-blur-md shadow-sm">
                        <Icon className="h-4 w-4 text-warm-gold stroke-[2]" />
                        <span>{project.type}</span>
                      </div>
                      <div className="font-mono text-sm font-bold text-soft-white drop-shadow-md">{project.capacity}</div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm text-sky-blue/90">
                        <MapPin className="h-4 w-4 text-warm-gold stroke-[2]" />
                        <span>{project.location}</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-soft-white drop-shadow-md">
                        {project.title}
                      </h2>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-16 mt-14">
          <div className="rounded-2xl border border-sky-blue/20 bg-sky-blue/10 p-8 md:p-10 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-soft">
            <div>
              <h2 className="font-display text-scale-h3 font-bold text-deep-navy">Planning a site like these?</h2>
              <p className="font-sans text-sm text-slate-gray mt-2 max-w-2xl">
                Our engineering team can model your roofline, load profile, and battery-ready
                expansion path into a custom proposal.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-signature btn-primary flex items-center gap-2 shadow-soft flex-shrink-0"
            >
              Start Proposal
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
