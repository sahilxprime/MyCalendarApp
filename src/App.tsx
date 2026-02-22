import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [country, setCountry] = useState('IN'); // Default India
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January
  const [selectedHoliday, setSelectedHoliday] = useState<any | null>(null); // Popup ke liye
  const year = 2026;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Fetch Countries & Pin India to Top
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        const data = await response.json();
        
        // India ko hamesha top par rakhne ka logic
        const sortedData = data.sort((a: any, b: any) => {
          if (a.countryCode === 'IN') return -1;
          if (b.countryCode === 'IN') return 1;
          return a.name.localeCompare(b.name);
        });
        
        setAvailableCountries(sortedData);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  // Fetch Holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2026/${country}`);
        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error("Error fetching holidays", error);
      } finally {
        setLoading(false);
      }
    };
    if (country) fetchHolidays();
  }, [country]);

  // Calendar Logic
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth, 1).getDay();

  const prevMonth = () => setCurrentMonth(prev => Math.max(prev - 1, 0));
  const nextMonth = () => setCurrentMonth(prev => Math.min(prev + 1, 11));

  // Handle Holiday Click
  const handleDayClick = (dateString: string) => {
    const holiday = holidays.find(h => h.date === dateString);
    if (holiday) {
      setSelectedHoliday(holiday);
    }
  };

  const renderCalendarDays = () => {
    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isHoliday = holidays.some(h => h.date === dateString);
      
      days.push(
        <div 
          key={i} 
          className={`calendar-day ${isHoliday ? 'holiday' : ''}`}
          onClick={() => isHoliday ? handleDayClick(dateString) : null}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  // Format Date for Popup
  const formatDateString = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div className="calendar-view animation-fade-in">
            <div className="calendar-header">
              <div>
                <h1 className="month-title">{months[currentMonth]}</h1>
                <h2 className="year-title">{year}</h2>
              </div>
              <div className="controls">
                <select className="country-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {availableCountries.map((c) => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.countryCode === 'IN' ? '🇮🇳 India' : c.name}
                    </option>
                  ))}
                </select>
                <div className="nav-arrows">
                  <button onClick={prevMonth}>&lt;</button>
                  <button onClick={nextMonth}>&gt;</button>
                </div>
              </div>
            </div>

            <div className="calendar-grid">
              {daysOfWeek.map(day => (
                <div key={day} className="day-name">{day}</div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        )}

        {/* AGENDA VIEW */}
        {view === 'agenda' && (
          <div className="agenda-view animation-fade-in">
            <h1 className="page-title">Upcoming Holidays</h1>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : holidays.length > 0 ? (
              holidays.map((h: any, index: number) => (
                <div key={index} className="agenda-item animation-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="agenda-date">
                    <span className="agenda-day">{new Date(h.date).getDate()}</span>
                    <span className="agenda-month">{months[new Date(h.date).getMonth()].substring(0,3)}</span>
                  </div>
                  <div className="agenda-details">
                    <strong>{h.localName}</strong>
                    <p>{h.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#888' }}>No holidays found.</p>
            )}
          </div>
        )}

        {/* ABOUT VIEW */}
        {view === 'about' && (
          <div className="about-view animation-fade-in">
            <div className="logo-placeholder premium-shadow">H</div>
            <h2 className="app-name-title">Holiday 2026</h2>
            <p className="version-text">VERSION 1.0.0 PRO</p>
            
            <div className="dev-card premium-shadow">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div className="dev-icon">&lt;/&gt;</div>
                <div>
                  <h3 style={{ margin: 0, color: '#1c1c1e', fontSize: '20px' }}>Sahil</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#8e8e93' }}>Lead iOS Developer</p>
                </div>
              </div>
              <div className="dev-info-row"><span className="emoji">📸</span> @primexsahil</div>
              <div className="dev-info-row"><span className="emoji">📧</span> primexsahil45@gmail.com</div>
              <div className="dev-info-row"><span className="emoji">📍</span> Shimla, HP</div>
            </div>
          </div>
        )}
      </div>

      {/* iOS STYLE BOTTOM SHEET MODAL (POPUP) */}
      {selectedHoliday && (
        <div className="modal-overlay" onClick={() => setSelectedHoliday(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle"></div>
            <h2 className="modal-title">{selectedHoliday.localName}</h2>
            <p className="modal-date-text">🗓️ {formatDateString(selectedHoliday.date)}</p>
            
            <div className="fun-fact-box">
              <h4 style={{ margin: '0 0 5px 0', color: '#007aff' }}>✨ Fun Fact</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                {selectedHoliday.name} is a major public holiday in {availableCountries.find(c => c.countryCode === country)?.name || 'this country'}. People celebrate it with great joy and enthusiasm!
              </p>
            </div>

            <button className="modal-close-btn" onClick={() => setSelectedHoliday(null)}>
              Awesome, Close!
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div className="bottom-nav premium-blur">
        <button className={`nav-item ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
          <span className="nav-icon">📅</span>
          <span>Calendar</span>
        </button>
        <button className={`nav-item ${view === 'agenda' ? 'active' : ''}`} onClick={() => setView('agenda')}>
          <span className="nav-icon">📋</span>
          <span>Agenda</span>
        </button>
        <button className={`nav-item ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>
          <span className="nav-icon">ℹ️</span>
          <span>About</span>
        </button>
      </div>
    </div>
  );
};

export default App;
