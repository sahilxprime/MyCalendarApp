import { useEffect, useState } from 'react';
import { fetchHolidays } from './utils/api';
import './App.css';
import { Calendar as CalendarIcon, List, Info } from 'lucide-react';
import { CalendarView } from './components/CalendarView';
import { AgendaView } from './components/AgendaView';
import { AboutView } from './components/AboutView';

function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'agenda' | 'about'>('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        // Automatically current year nikalne ke liye
        const currentYear = new Date().getFullYear(); 
        const data = await fetchHolidays(currentYear, 'IN');
        setHolidays(data);
        console.log(`${currentYear} ke Holidays load ho gaye.`);
      } catch (error) {
        console.error("Holidays laane mein error aayi: ", error);
      }
    };

    loadHolidays();
  }, []);

    loadHolidays();
  }, []);

  // Error Fix 2: Code ko pata chal gaya ki holidays use ho raha hai
  console.log("Current Holidays state:", holidays);

  return (
    <div className="app-main-container">
      <main className="main-content">
        {activeTab === 'calendar' && <CalendarView holidays={holidays} />}
        {activeTab === 'agenda' && (
          <div className="agenda-header">
            <h1 className="text-3xl font-bold mb-6 tracking-tight px-2">Upcoming</h1>
            <AgendaView holidays={holidays} />
          </div>
        )}
        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon size={24} />
          <span>Calendar</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
        >
          <List size={24} />
          <span>Agenda</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={24} />
          <span>About</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
