import { useState } from 'react';
import { Calendar as CalendarIcon, List, Info } from 'lucide-react';
import { CalendarView } from './components/CalendarView';
import { AgendaView } from './components/AgendaView';
import { AboutView } from './components/AboutView';

function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'agenda' | 'about'>('calendar');

  return (
    <div className="w-full min-h-screen bg-ios-bg text-ios-text font-sans selection:bg-ios-blue/30 selection:text-ios-blue">
      {/* Main Content Area */}
      <main className="px-4 max-w-md mx-auto h-full min-h-screen overflow-x-hidden">
        {activeTab === 'calendar' && <CalendarView />}

        {activeTab === 'agenda' && (
          <div className="pt-8">
            <h1 className="text-3xl font-bold mb-6 tracking-tight px-2">Upcoming</h1>
            <AgendaView />
          </div>
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* iOS Style Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-ios-card/85 backdrop-blur-2xl border-t border-ios-gray-light z-50 transition-colors duration-300">
        {/* iOS home indicator safe area pseudo-padding */}
        <div className="flex justify-around items-center h-[88px] pb-6 pt-2 max-w-md mx-auto px-6">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${activeTab === 'calendar' ? 'text-ios-blue' : 'text-ios-gray hover:text-ios-gray/80'
              }`}
          >
            <CalendarIcon size={26} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${activeTab === 'agenda' ? 'text-ios-blue' : 'text-ios-gray hover:text-ios-gray/80'
              }`}
          >
            <List size={26} strokeWidth={activeTab === 'agenda' ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${activeTab === 'about' ? 'text-ios-blue' : 'text-ios-gray hover:text-ios-gray/80'
              }`}
          >
            <Info size={26} strokeWidth={activeTab === 'about' ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">About</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
