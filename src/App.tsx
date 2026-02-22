import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); 
  const [view, setView] = useState('calendar');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [country, setCountry] = useState('IN'); 
  const [availableCountries, setAvailableCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<any | null>(null); 
  
  // 🌟 NEW: Dark Mode State & Search State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const year = 2026;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 📳 NEW: iOS Style Haptic Feedback (Vibration)
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40); // Soft vibration
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

  // ⏳ NEW: Countdown Timer Logic
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
      { date: '2026-01-14', localName: 'Makar Sankranti/Pongal', name: 'Makar Sankranti/Pongal/Magh Bihu' },
      { date: '2026-01-23', localName: 'Vasant Panchami', name: 'Vasant Panchami/Subhas Chandra Bose Jayanti' },
      { date: '2026-01-26', localName: 'Republic Day', name: 'Republic Day' },
      { date: '2026-01-30', localName: 'Gandhi Punyatithi', name: 'Gandhi Punyatithi' },
      { date: '2026-02-01', localName: 'Guru Ravidas Jayanti', name: 'Guru Ravidas Jayanti' },
      { date: '2026-02-12', localName: 'Maharishi Dayanand Saraswati Jayanti', name: 'Maharishi Dayanand Saraswati Jayanti' },
      { date: '2026-02-15', localName: 'Maha Shivaratri', name: 'Maha Shivaratri' },
      { date: '2026-02-19', localName: 'Shivaji Jayanti', name: 'Shivaji Jayanti' },
      { date: '2026-03-03', localName: 'Holika Dahan', name: 'Holika Dahan/Chhoti Holi' },
      { date: '2026-03-04', localName: 'Holi', name: 'Holi' },
      { date: '2026-03-20', localName: 'Eid al-Fitr', name: 'Eid al-Fitr (Tentative)' },
      { date: '2026-03-31', localName: 'Ram Navami', name: 'Ram Navami' },
      { date: '2026-04-02', localName: 'Mahavir Jayanti', name: 'Mahavir Jayanti' },
      { date: '2026-04-03', localName: 'Good Friday', name: 'Good Friday' },
      { date: '2026-04-14', localName: 'Ambedkar Jayanti', name: 'Ambedkar Jayanti' },
      { date: '2026-05-01', localName: 'Labour Day', name: 'May Day/Labour Day' },
      { date: '2026-05-12', localName: 'Buddha Purnima', name: 'Buddha Purnima' },
      { date: '2026-05-28', localName: 'Eid al-Adha', name: 'Eid al-Adha/Bakrid (Tentative)' },
      { date: '2026-06-26', localName: 'Muharram', name: 'Muharram (Tentative)' },
      { date: '2026-07-06', localName: 'Ashura', name: 'Muharram/Ashura (Tentative)' },
      { date: '2026-08-07', localName: 'National Handloom Day', name: 'National Handloom Day' },
      { date: '2026-08-15', localName: 'Independence Day', name: 'Independence Day' },
      { date: '2026-08-16', localName: 'Janmashtami', name: 'Janmashtami' },
      { date: '2026-08-26', localName: 'Milad-un-Nabi', name: 'Milad-un-Nabi' },
      { date: '2026-08-28', localName: 'Raksha Bandhan', name: 'Raksha Bandhan' },
      { date: '2026-09-04', localName: 'Janmashtami (Alt)', name: 'Janmashtami (Alternative date)' },
      { date: '2026-09-14', localName: 'Ganesh Chaturthi', name: 'Ganesh Chaturthi' },
      { date: '2026-10-01', localName: 'Dussehra Mahanavami', name: 'Dussehra Mahanavami' },
      { date: '2026-10-02', localName: 'Gandhi Jayanti', name: 'Gandhi Jayanti' },
      { date: '2026-10-02', localName: 'Vijayadashami', name: 'Vijayadashami' },
      { date: '2026-10-20', localName: 'Diwali', name: 'Diwali (Deepavali)' },
      { date: '2026-10-21', localName: 'Govardhan Puja', name: 'Diwali (Day 2/Govardhan Puja)' },
      { date: '2026-10-22', localName: 'Bhaiya Dooj', name: 'Bhaiya Dooj' },
      { date: '2026-11-05', localName: 'Guru Nanak Jayanti', name: 'Guru Nanak Jayanti' },
      { date: '2026-11-24', localName: 'Guru Nanak\'s Birthday', name: 'Guru Nanak\'s Birthday (Alternative Date)' },
      { date: '2026-12-25', localName: 'Christmas Day', name: 'Christmas Day' },
      { date: '2026-12-31', localName: 'New Year\'s Eve', name: 'New Year\'s Eve' }
    ]
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

  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth, 1).getDay();

  const prevMonth = () => { triggerHaptic(); setCurrentMonth(prev => Math.max(prev - 1, 0)); };
  const nextMonth = () => { triggerHaptic(); setCurrentMonth(prev => Math.min(prev + 1, 11)); };

  const handleDayClick = (dateString: string) => {
    triggerHaptic();
    const holiday = holidays.find(h => h.date === dateString);
    if (holiday) setSelectedHoliday(holiday);
  };

  const handleNavClick = (newView: string) => {
    triggerHaptic();
    setView(newView);
  };

  // 📲 NEW: Native Sharing Logic
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

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isHoliday = holidays.some(h => h.date === dateString);
      const isToday = realToday.getFullYear() === year && realToday.getMonth() === currentMonth && realToday.getDate() === i;
      
      days.push(
        <div 
          key={i} 
          className={`calendar-day ${isHoliday ? 'holiday' : ''} ${isToday ? 'today' : ''}`}
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

  // 🔍 NEW: Filter Holidays for Search Bar
  const filteredHolidays = holidays.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.localName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
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
                {/* 🌙 Theme Toggle Button */}
                <button className="theme-toggle" onClick={() =>
