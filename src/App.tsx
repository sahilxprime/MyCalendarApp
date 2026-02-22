import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); 
  const [view, setView] = useState('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [country, setCountry] = useState('IN'); 
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<any | null>(null); 
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✨ Naya Animation State
  const [slideDirection, setSlideDirection] = useState('fade'); 
  const year = 2026;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 👆 Swipe Logic Setup
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null; 
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; 

    if (distance > minSwipeDistance) {
      triggerNextMonth(); // Swipe Left
    } else if (distance < -minSwipeDistance) {
      triggerPrevMonth(); // Swipe Right
    }
  };

  // ✨ Fail-Safe Month Changers
  const triggerNextMonth = () => {
    if (currentMonth >= 11) return;
    triggerHaptic();
    setSlideDirection('slide-left'); 
    setCurrentMonth(prev => prev + 1);
  };

  const triggerPrevMonth = () => {
    if (currentMonth <= 0) return;
    triggerHaptic();
    setSlideDirection('slide-right'); 
    setCurrentMonth(prev => prev - 1);
  };

  const triggerHaptic = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(40);
    } catch (e) {
      console.log("Haptic blocked");
    }
  };

  const getZodiacSign = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒ Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "♓ Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈ Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉ Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "♊ Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "♋ Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌ Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍ Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "♎ Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "♏ Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "♐ Sagittarius";
    return "♑ Capricorn";
  };

  const getDaysLeft = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDate = new Date(dateString);
    holidayDate.setHours(0, 0, 0, 0);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "🔥 Today!";
    if (diffDays < 0) return "Passed";
    return `⏳ In ${diffDays} days`;
  };

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
      { date: '2026-01-01', localName: 'New Year\'s Day', name: 'New Year\'s Day' },
      { date: '2026-01-14', localName: 'Makar Sankranti', name: 'Makar Sankranti/Pongal/Magh Bihu' },
      { date: '2026-01-26', localName: 'Republic Day', name: 'Republic Day' },
      { date: '2026-03-04', localName: 'Holi', name: 'Holi' },
      { date: '2026-08-15', localName: 'Independence Day', name: 'Independence Day' },
      { date: '2026-10-20', localName: 'Diwali', name: 'Diwali (Deepavali)' },
      { date: '2026-12-25', localName: 'Christmas Day', name: 'Christmas Day' }
    ] // Shortened for space, you can paste your full list back here
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        const apiData = await response.json();
        const mergedData = [...apiData, ...asianCountries];
        const sortedData = mergedData.sort((a: any, b: any) => {
          if (a.countryCode === 'IN') return -1;
          if (b.countryCode === 'IN') return 1;
          return a.name.localeCompare(b.name);
        });
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

  const handleDayClick = (dateString: string) => {
    triggerHaptic();
    const holiday = holidays.find(h => h.date === dateString);
    if (holiday) setSelectedHoliday(holiday);
  };

  const handleNavClick = (newView: string) => {
    triggerHaptic();
    setView(newView);
  };

  const handleShare = () => {
    triggerHaptic();
    const shareText = `Hey! 🗓️ ${selectedHoliday.localName} is on ${formatDateString(selectedHoliday.date)}. It's a ${getZodiacSign(selectedHoliday.date)} day! Let's celebrate! 🚀`;
    if (navigator.share) {
      navigator.share({ title: selectedHoliday.localName, text: shareText });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
    }
  };

  const renderCalendarDays = () => {
    let days = [];
    const realToday = new Date(); 
    const currentFirstDay = new Date(year, currentMonth, 1).getDay();
    const currentDaysInMonth = new Date(year, currentMonth + 1, 0).getDate();

    for (let i = 0; i < currentFirstDay; i++) {
      days.push(<div key={`empty-${currentMonth}-${i}`} className="calendar-day empty"></div>);
    }
    for (let i = 1; i <= currentDaysInMonth; i++) {
      const dateString = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isHoliday = holidays.some(h => h.date === dateString);
      const isToday = realToday.getFullYear() === year && realToday.getMonth() === currentMonth && realToday.getDate() === i;
      
      days.push(
        <div 
          key={`day-${currentMonth}-${i}`} 
          className={`calendar-day ${isHoliday ? 'holiday' : ''} ${isToday ? 'today' : ''} haptic-btn`}
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

  const filteredHolidays = holidays.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.localName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="main-content">
        
        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div 
            className="calendar-view"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="calendar-header">
              {/* ✨ React KEY forces animation without breaking UI */}
              <div key={`title-${currentMonth}`} className={`calendar-anim-wrapper ${slideDirection}`}>
                <h1 className="month-title">{months[currentMonth]}</h1>
                <h2 className="year-title">{year}</h2>
              </div>
              <div className="controls">
                <button className="theme-toggle haptic-btn" onClick={() => { triggerHaptic(); setIsDarkMode(!isDarkMode); }}>
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                <select className="country-select haptic-btn" value={country} onChange={(e) => { triggerHaptic(); setCountry(e.target.value); }}>
                  {availableCountries.map((c) => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {c.countryCode === 'IN' ? '🇮🇳 India' : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✨ React KEY automatically triggers smooth entry */}
            <div key={`grid-${currentMonth}`} className={`calendar-anim-wrapper ${slideDirection}`}>
              <div className="calendar-grid">
                {daysOfWeek.map(day => (
                  <div key={day} className="day-name">{day}</div>
                ))}
                {renderCalendarDays()}
              </div>
            </div>
          </div>
        )}

        {/* ... (Keep your Agenda and About views exactly as they were) ... */}
        {view === 'agenda' && (
           <div className="agenda-view animation-fade-in">
             <h1 className="page-title">Upcoming Holidays</h1>
             <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Search holidays working.</p>
           </div>
        )}

      </div>
      
      {/* ... (Keep Bottom Nav exactly as it was) ... */}
      <div className="bottom-nav premium-blur">
        <button className={`nav-item haptic-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => handleNavClick('calendar')}>
          <span>Calendar</span>
        </button>
      </div>

    </div>
  );
};

export default App;
