// EmployeesPage.js
// tiles with name, id, orders completed 
// gravatar images?..

/* api requests needed: employee names (or list of id's and call for name based on id if we want to get info based on id not name),
  employee image (either on same list as names in dictionary form or gathered from name),
  all employee information for name (could also be from id if that's easier) */
import React, { useState } from 'react';

const EmployeesPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = ["Laine", "Matthew", "Brinley", "Nhat", "Carolina", "Tatiana"];

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1' }}>
        <h1>Employees Page</h1>
        <div className="employee-tiles">
          {employees.map((employee, index) => (
            <div key={index} className="employee-tile" style={{ width: '50%', marginBottom: '20px', cursor: 'pointer', border: '1px solid #ccc', padding: '10px' }} onClick={() => handleEmployeeClick(employee)}>
              <img src="placeholder.jpg" alt="Employee" style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
              <div>{employee}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: '1', marginLeft: '20px' }}>
        <h2>Employee Information</h2>
        {selectedEmployee && (
          <div>
            <h3>{selectedEmployee}</h3>
            <p>info goes here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
