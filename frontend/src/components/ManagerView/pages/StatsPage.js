// statspage.js
// npm install react-datepicker

// can use this to display dates: {currentDate.toDateString()} and {comparisonDate.toDateString()}


import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StatsPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [comparisonDate, setComparisonDate] = useState(new Date());

  const handleDateChange = (date, type) => {
    if (type === 'current') {
      setCurrentDate(date);
    } else if (type === 'comparison') {
      setComparisonDate(date);
    }
  };

  return (
    <div>
      <h1>Stats Page</h1>
      <div>
        <p>Current Date: <DatePicker selected={currentDate} onChange={(date) => handleDateChange(date, 'current')} /></p>
        <p>Comparison Date: <DatePicker selected={comparisonDate} onChange={(date) => handleDateChange(date, 'comparison')} /></p>
      </div>
    </div>
  );
};

export default StatsPage;
