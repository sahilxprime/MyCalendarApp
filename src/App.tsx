import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [country, setCountry] = useState('IN');
  const [loading, setLoading] = useState(false);

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
    fetchHolidays();
  }, [country]);

  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ margin: 0, color: '#007aff' }}>2026</h1>
              <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
                <option value="IN">India 🇮🇳</option>
                <option value="US">USA 🇺🇸</option>
                <option value="GB">UK 🇬🇧</option>
              </select>
            </div>
            <div style={{ textAlign: 'center', marginTop: '60px', color: '#666' }}>
              <h3>Welcome to Holiday 2026</h3>
              <p>Go to Agenda to see the list of holidays.</p>
            </div>
          </div>
        )}

        {/* AGENDA VIEW */}
        {view === 'agenda' && (
          <div>
            <h1 style={{ color: '#28a745', marginBottom: '20px' }}>Upcoming Holidays</h1>
            {loading ? (
              <p style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>Holidays load ho rahe hain...</p>
            ) : holidays.length > 0 ? (
              holidays.map((h: any, index: number) => (
                <div key={index} style={{ padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#fcfcfc', borderRadius: '8px', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '16px', color: '#333' }}>{h.localName}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>{h.date}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#888' }}>No holidays found.</p>
            )}
          </div>
        )}

        {/* ABOUT VIEW */}
        {view === 'about' && (
          <div style={{ textAlign: 'center', paddingTop: '30px' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#007aff', borderRadius: '20px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>H</div>
            <h2 style={{ marginTop: '15px', color: '#333' }}>Holiday 2026</h2>
            <p style={{ color: '#888', fontSize: '14px' }}>VERSION 1.0.0</p>
            
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '20px', margin: '30px 10px', textAlign: 'left', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e1f0ff', color: '#007aff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontWeight: 'bold' }}>&lt;/&gt;</div>
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
          <span style={{ fontSize: '22px' }}>📅</span>
          <span>Calendar</span>
        </button>
        <button className={`nav-item ${view === 'agenda' ? 'active' : ''}`} onClick={() => setView('agenda')}>
          <span style={{ fontSize: '22px' }}>📋</span>
          <span>Agenda</span>
        </button>
        <button className={`nav-item ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>
          <span style={{ fontSize: '22px' }}>ℹ️</span>
          <span>About</span>
        </button>
      </div>
    </div>
  );
};

export default App;
