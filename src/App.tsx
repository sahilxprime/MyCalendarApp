import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [country, setCountry] = useState('IN'); 
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0); 
  const [selectedHoliday, setSelectedHoliday] = useState<any | null>(null); 
  const year = 2026;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 🌟 CUSTOM ASIAN COUNTRIES (Kyunki public API mein ye nahi hote)
  const asianCountries = [
    { countryCode: 'IN', name: 'India' },
    { countryCode: 'PK', name: 'Pakistan' },
    { countryCode: 'NP', name: 'Nepal' },
    { countryCode: 'BT', name: 'Bhutan' },
    { countryCode: 'BD', name: 'Bangladesh' },
    { countryCode: 'LK', name: 'Sri Lanka' }
  ];

  const customHolidays: { [key: string]: any[] } = {
    'IN': [
      { date: '2026-01-01', localName: 'New Year', name: 'New Year\'s Day' },
      { date: '2026-01-26', localName: 'Republic Day', name: 'Republic Day' },
      { date: '2026-03-03', localName: 'Holi', name: 'Festival of Colors' },
      { date: '2026-03-20', localName: 'Eid al-Fitr', name: 'End of Ramadan' },
      { date: '2026-04-03', localName: 'Good Friday', name: 'Good Friday' },
      { date: '2026-08-15', localName: 'Independence Day', name: 'Independence Day' },
      { date: '2026-10-02', localName: 'Gandhi Jayanti', name: 'Mahatma Gandhi\'s Birthday' },
      { date: '2026-11-08', localName: 'Diwali', name: 'Festival of Lights' },
      { date: '2026-12-25', localName: 'Christmas Day', name: 'Christmas Day' }
    ],
    'PK': [
      { date: '2026-02-05', localName: 'Kashmir Day', name: 'Kashmir Solidarity Day' },
      { date: '2026-03-23', localName: 'Pakistan Day', name: 'Pakistan Day' },
      { date: '2026-04-20', localName: 'Eid-ul-Fitr', name: 'Eid-ul-Fitr' },
      { date: '2026-08-14', localName: 'Independence Day', name: 'Independence Day' },
      { date: '2026-12-25', localName: 'Quaid-e-Azam Day', name: 'Quaid-e-Azam Day' }
    ],
    'NP': [
      { date: '2026-02-18', localName: 'Democracy Day', name: 'Democracy Day' },
      { date: '2026-04-14', localName: 'Nepali New Year', name: 'Nepali New Year' },
      { date: '2026-09-19', localName: 'Constitution Day', name: 'Constitution Day' }
    ],
    'BT': [
      { date: '2026-02-21', localName: 'King\'s Birthday', name: 'King\'s Birthday' },
      { date: '2026-12-17', localName: 'National Day', name: 'National Day' }
    ]
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        const apiData = await response.json();
        
        // Merge API countries with our Custom Asian Countries
        const mergedData = [...apiData, ...asianCountries];

        // Ensure India is at the very top, followed by alphabetical order
        const sortedData = mergedData.sort((a: any, b: any) => {
          if (a.countryCode === 'IN') return -1;
          if (b.countryCode === 'IN') return 1;
          return a.name.localeCompare(b.name);
        });
        
        // Remove duplicates if any
        const uniqueData = sortedData.filter((v,i,a)=>a.findIndex(v2=>(v2.countryCode===v.countryCode))===i);
        setAvailableCountries(uniqueData);
      } catch (error) {
        setAvailableCountries(asianCountries);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        if (customHolidays[country]) {
          setHolidays(customHolidays[country]);
        } else {
          const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/2026/${country}`);
          if (response.ok) {
            const data = await response.json();
            setHolidays(data);
          } else {
            setHolidays([]);
          }
        }
      } catch (error) {
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };
    if (country) fetchHolidays();
  }, [country]);

  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth, 1).getDay();

  const prevMonth = () => setCurrentMonth(prev => Math.max(prev - 1, 0));
  const nextMonth = () => setCurrentMonth(prev => Math.min(prev + 1, 11));

  const handleDayClick = (dateString: string) => {
    const holiday = holidays.find(h => h.date === dateString);
    if (holiday) setSelectedHoliday(holiday);
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
              <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>No holidays found for this year.</p>
            )}
          </div>
        )}

        {/* ABOUT VIEW */}
        {view === 'about' && (
          <div className="about-view animation-fade-in">
            <div className="logo-placeholder premium-shadow">
              <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <h2 className="app-name-title">Holiday 2026</h2>
            <p className="version-text">VERSION 1.0.0 PRO</p>
            
            <div className="dev-card premium-shadow">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div className="dev-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-1.3 0-2.4.9-2.9 2.1"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                </div>
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

      {/* POPUP MODAL */}
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

      {/* 🌟 PRO BOTTOM NAVIGATION WITH iOS SVG ICONS */}
      <div className="bottom-nav premium-blur">
        <button className={`nav-item ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>Calendar</span>
        </button>
        <button className={`nav-item ${view === 'agenda' ? 'active' : ''}`} onClick={() => setView('agenda')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>Agenda</span>
        </button>
        <button className={`nav-item ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>About</span>
        </button>
      </div>
    </div>
  );
};

export default App;
