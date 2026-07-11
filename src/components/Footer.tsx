import { Zap, Shield, HelpCircle, FileText, Download } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  openChatbot: () => void;
}

export default function Footer({ openChatbot }: FooterProps) {
  return (
    <footer className="w-full py-10 lg:py-16 bg-deep-navy border-t border-sky-blue/20 text-soft-white font-sans text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-6 lg:px-16 max-w-7xl mx-auto">
        
        {/* Links Column 2: Legal */}
        <div>
          <h4 className="font-bold text-warm-gold uppercase tracking-wider text-xs mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Privacy Policy: Power Pulse Energy maintains the highest standards of data protection and privacy for our enterprise and residential clients. No data is shared with third parties.');
                }}
                className="btn-signature btn-ghost-inverted flex items-center gap-2 w-full !justify-start text-left"
              >
                <Shield className="h-4 w-4 text-warm-gold flex-shrink-0" />
                <span>Privacy Policy</span>
              </a>
            </li>
            <li>
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Terms of Service: By using our solar estimator or consultation portals, you agree to receive professional renewable energy engineering advice from Power Pulse Energy representatives.');
                }}
                className="btn-signature btn-ghost-inverted flex items-center gap-2 w-full !justify-start text-left"
              >
                <FileText className="h-4 w-4 text-warm-gold flex-shrink-0" />
                <span>Terms of Service</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 3: Resources */}
        <div>
          <h4 className="font-bold text-warm-gold uppercase tracking-wider text-xs mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#install"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Our comprehensive Installation Guide PDF is compiled uniquely for each project system size (kW) to verify structural and electrical integration compliance.');
                }}
                className="btn-signature btn-ghost-inverted flex items-center gap-2 w-full !justify-start text-left"
              >
                <Download className="h-4 w-4 text-warm-gold flex-shrink-0" />
                <span>Installation Guide</span>
              </a>
            </li>
            <li>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openChatbot();
                }}
                className="btn-signature btn-ghost-inverted flex items-center gap-2 w-full !justify-start text-left"
              >
                <HelpCircle className="h-4 w-4 text-warm-gold flex-shrink-0" />
                <span>Support Center (AI Assistant)</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 mt-8 lg:mt-12 pt-8 border-t border-sky-blue/20 text-sky-blue/60 text-center">
        © {new Date().getFullYear()} Power Pulse Energy. All rights reserved.
      </div>
    </footer>
  );
}
