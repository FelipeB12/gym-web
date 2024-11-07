import React, { useState } from 'react';

const ClientProgress = () => {
  const exampleDates = ['01/11/2024', '01/09/2024', '01/07/2024', '01/05/2024'];
  const bodyParts = ['Chest', 'Back', 'Arm', 'Glutes', 'Thigh', 'Calf'];
  
  // State to track which row is expanded
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (index) => {
    // Toggle the expanded row
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="progress-container">
      <h3>Tu progreso en el tiempo</h3>
      <table className="progress-table">
        <thead>
          <tr>
            <th>Fechas</th>
          </tr>
        </thead>
        <tbody>
          {exampleDates.map((date, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }}>
                <td>{date}</td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td colSpan="2">
                    <table className="inner-table">
                      <thead>
                        <tr>
                          <th>Músculo</th>
                          <th>Medida en cm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bodyParts.map((part, partIndex) => (
                          <tr key={partIndex}>
                            <td>{part}</td>
                            <td>50</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientProgress;
