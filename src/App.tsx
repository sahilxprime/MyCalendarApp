import { useEffect, useState } from 'react';
import { fetchHolidays } from './utils/api';
import './App.css'; // <--- YE LINE ZAROORI HAI
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
        const data = await fetchHolidays();
        setHolidays(data);
        console.log("Holidays Data aagaya: ", data);
      } catch (error) {
        console.error("Holidays laane mein error aayi: ", error);
      }
    };

    loadHolidays();
  }, []);
  return (
    <div className="app-main-container">
      <main className="main-content">
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'agenda' && (
          <div className="agenda-header">
            <h1 className="text-3xl font-bold mb-6 tracking-tight px-2">Upcoming</h1>
            <AgendaView />
          </div>
        )}
        {activeTab === 'about' && <AboutView />}
      </main>

      <nav className="bottom-nav">
        <div className="nav-container">
          <button onClick={() => setActiveTab('calendar')} className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}>
            <CalendarIcon size={26} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
            <span>Calendar</span>
          </button>
          <button onClick={() => setActiveTab('agenda')} className={`nav-btn ${activeTab === 'agenda' ? 'active' : ''}`}>
            <List size={26} strokeWidth={activeTab === 'agenda' ? 2.5 : 2} />
            <span>Agenda</span>
          </button>
          <button onClick={() => setActiveTab('about')} className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}>
            <Info size={26} strokeWidth={activeTab === 'about' ? 2.5 : 2} />
            <span>About</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
