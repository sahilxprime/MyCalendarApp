import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [country, setCountry] = useState('IN'); // Default India
  const [availableCountries, setAvailableCountries] = useState<any[]>([]); // Naya: Saari countries ke liye
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January
  const year = 2026;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 1. Duniya ki saari countries fetch karne ka logic
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        const data = await response.json();
        setAvailableCountries(data);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    fetchCountries();
  }, []);

  // 2. Select ki gayi country ke holidays fetch karna
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
    if (country) {
      fetchHolidays();
    }
  }, [country]);

  // Calendar Logic
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth, 1).getDay();

  const prevMonth = () => setCurrentMonth(prev => Math.max(prev - 1, 0));
  const nextMonth = () => setCurrentMonth(prev => Math.min(prev + 1, 11));

  const renderCalendarDays = () => {
    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isHoliday = holidays.some(h => h.date === dateString);
      days.push(
        <div key={i} className={`calendar-day ${isHoliday ? 'holiday' : ''}`}>
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div className="calendar-view">
            <div className="calendar-header">
              <div>
                <h1 className="month-title">{months[currentMonth]}</h1>
                <h2 className="year-title">{year}</h2>
              </div>
              <div className="controls">
                
                {/* GLOBAL COUNTRY SELECTOR */}
                <select className="country-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {availableCountries.length > 0 ? (
                    availableCountries.map((c) => (
                      <option key={c.countryCode} value={c.countryCode}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option value="IN">India</option>
                  )}
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
          <div className="agenda-view">
            <h1 style={{ color: '#007aff', marginBottom: '20px' }}>Upcoming Holidays</h1>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#888' }}>Loading holidays...</p>
            ) : holidays.length > 0 ? (
              holidays.map((h: any, index: number) => (
                <div key={index} className="agenda-item">
                  <strong style={{ fontSize: '16px', color: '#1c1c1e' }}>{h.localName}</strong>
                  <p>{h.date}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#888' }}>No holidays found.</p>
            )}
          </div>
        )}

        {/* ABOUT VIEW */}
        {view === 'about' && (
          <div className="about-view">
            <div className="logo-placeholder">H</div>
            <h2 style={{ textAlign: 'center', marginTop: '15px' }}>Holiday 2026</h2>
            <p style={{ textAlign: 'center', color: '#888', fontSize: '14px' }}>VERSION 1.0.0</p>
            
            <div className="dev-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div className="dev-icon">&lt;/&gt;</div>
                <div>
                  <h3 style={{ margin: 0, color: '#333' }}>Sahil</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Lead Developer</p>
                </div>
              </div>
              <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>📸 @primexsahil</p>
              <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>📧 primexsahil45@gmail.com</p>
              <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>📍 Shimla, HP</p>
            </div>
          </div>
        )}
      </div>

      <div className="bottom-nav">
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
