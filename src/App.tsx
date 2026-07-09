import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import ContactView from './components/ContactView';
import GalleryView from './components/GalleryView';
import Chatbot from './components/Chatbot';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotWelcomeMessage, setChatbotWelcomeMessage] = useState(
    'Hello! How can we power your enterprise today?'
  );
  const [selectedProposalData, setSelectedProposalData] = useState<any>(null);

  // Helper to clear proposal pre-filled data
  const handleClearProposalData = () => {
    setSelectedProposalData(null);
  };

  // Helper to determine the component to render
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            setCurrentView={setCurrentView}
            setChatbotOpen={setChatbotOpen}
            setChatbotWelcomeMessage={setChatbotWelcomeMessage}
            onSelectProposalData={setSelectedProposalData}
          />
        );
      case 'about':
        return (
          <AboutView
            setChatbotOpen={setChatbotOpen}
            setChatbotWelcomeMessage={setChatbotWelcomeMessage}
          />
        );
      case 'services':
        return (
          <ServicesView
            setCurrentView={setCurrentView}
            setChatbotOpen={setChatbotOpen}
            setChatbotWelcomeMessage={setChatbotWelcomeMessage}
          />
        );
      case 'contact':
        return (
          <ContactView
            proposalData={selectedProposalData}
            clearProposalData={handleClearProposalData}
            setChatbotOpen={setChatbotOpen}
            setChatbotWelcomeMessage={setChatbotWelcomeMessage}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <HomeView
            setCurrentView={setCurrentView}
            setChatbotOpen={setChatbotOpen}
            setChatbotWelcomeMessage={setChatbotWelcomeMessage}
            onSelectProposalData={setSelectedProposalData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-soft-white text-deep-navy font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      {/* Header / Navigation */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Transition Stage */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      <Footer
        setCurrentView={setCurrentView}
        openChatbot={() => {
          setChatbotWelcomeMessage('Hello! How can we assist with your solar infrastructure needs today?');
          setChatbotOpen(true);
        }}
      />

      {/* Floating Interactive Chatbot */}
      <Chatbot
        isOpen={chatbotOpen}
        setIsOpen={setChatbotOpen}
        initialMessage={chatbotWelcomeMessage}
      />
    </div>
  );
}
