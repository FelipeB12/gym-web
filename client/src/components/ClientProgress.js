import React from 'react';

const ClientProgress = () => {
  // Sample data for the table
  const bodyParts = ['Chest', 'Back', 'Arm', 'Glutes', 'Thigh', 'Calf'];
  const dates = ['Date 1', 'Date 2', 'Date 3', 'Date 4']; // Example dates

  return (
    <div className="progress-container">
      <h1>Progress Tracker</h1>
      <table className="progress-table">
        <thead>
          <tr>
            <th>Body Part</th>
            <th>Height</th>
            <th>Weight</th>
            <th>FAT%</th>
            {dates.map((date, index) => (
              <th key={index}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyParts.map((part, index) => (
            <tr key={index}>
              <td>{part}</td>
              <td><input type="text" placeholder="Height" /></td>
              <td><input type="text" placeholder="Weight" /></td>
              <td><input type="text" placeholder="FAT%" /></td>
              {dates.map((_, dateIndex) => (
                <td key={dateIndex}><input type="text" placeholder="..." /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientProgress;
