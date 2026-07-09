import { Zap, Shield, HelpCircle, FileText, Download } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  setCurrentView: (view: string) => void;
  openChatbot: () => void;
}

export default function Footer({ setCurrentView, openChatbot }: FooterProps) {
  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-16 bg-deep-navy border-t border-sky-blue/20 text-soft-white font-sans text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-16 max-w-7xl mx-auto">
        
        {/* Branding */}
        <div className="col-span-1 md:col-span-1">
          <div className="mb-6 inline-block relative h-24 w-[280px]">
            <Logo className="absolute left-0 top-1/2 -translate-y-1/2 h-[260px] w-[280px] max-w-none -ml-4" />
          </div>
          <p className="text-sky-blue/80 mb-6 max-w-xs leading-relaxed">
            Precision engineering and industry-leading renewable energy infrastructure for a sustainable future.
          </p>
        </div>

        {/* Links Column 1: Navigation */}
        <div>
          <h4 className="font-bold text-warm-gold uppercase tracking-wider text-xs mb-4">Navigation</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleNavClick('home')}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Home & Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('about')}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                About Our Philosophy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('services')}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Solar Services
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('gallery')}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Project Gallery
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('contact')}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Get Quote & Proposal
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Legal */}
        <div>
          <h4 className="font-bold text-warm-gold uppercase tracking-wider text-xs mb-4">Legal</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-warm-gold" />
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Privacy Policy: Power Pulse Energy maintains the highest standards of data protection and privacy for our enterprise and residential clients. No data is shared with third parties.');
                }}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Privacy Policy
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-warm-gold" />
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Terms of Service: By using our solar estimator or consultation portals, you agree to receive professional renewable energy engineering advice from Power Pulse Energy representatives.');
                }}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Resources */}
        <div>
          <h4 className="font-bold text-warm-gold uppercase tracking-wider text-xs mb-4">Resources</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Download className="h-4 w-4 text-warm-gold" />
              <a
                href="#install"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Our comprehensive Installation Guide PDF is compiled uniquely for each project system size (kW) to verify structural and electrical integration compliance.');
                }}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Installation Guide
              </a>
            </li>
            <li className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-warm-gold" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openChatbot();
                }}
                className="btn-signature btn-ghost-inverted justify-start text-left w-full"
              >
                Support Center (AI Assistant)
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 mt-12 pt-8 border-t border-sky-blue/20 text-sky-blue/60 text-center">
        © {new Date().getFullYear()} Power Pulse Energy. All rights reserved.
      </div>
    </footer>
  );
}
