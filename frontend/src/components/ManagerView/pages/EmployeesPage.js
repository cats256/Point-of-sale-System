// EmployeesPage.js
// tiles with name, id, orders completed
// gravatar images?..
import { getEmployees, updateSalary } from "../../../network/api";
// import { updateSalary } from "../../../network/api";

/* api requests needed: employee names (or list of id's and call for name based on id if we want to get info based on id not name),
  employee image (either on same list as names in dictionary form or gathered from name),
  all employee information for name (could also be from id if that's easier) */
import React, { useEffect, useState } from "react";
import sha256 from "crypto-js/sha256";

const EmployeesPage = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployeeNum, setSelectedEmployeeNum] = useState(null);

    // const employees = ["Laine", "Matthew", "Brinley", "Nhat", "Carolina", "Tatiana"];
    const [employeeNames, setEmployeeNames] = useState([]);
    const [employeeImages, setEmployeeImages] = useState([]);
    const [employeeJob, setEmployeeJob] = useState("");
    const [employees, setEmployees] = useState([]);
    const [newSalary, setNewSalary] = useState();

    // const CryptoJS = require('crypto-js');

    const hashEmail = (email) => {
        const trimmedEmail = email.trim().toLowerCase();
        const hashedEmail = sha256(trimmedEmail).toString(); //CryptoJS.SHA256(trimmedEmail).toString(CryptoJS.enc.Hex);
        return hashedEmail;
    };

    const handleEmployeeClick = (employee, num) => {
        setSelectedEmployee(employee);
        setSelectedEmployeeNum(num);
        if (employees[num]["manager"]) {
            setEmployeeJob("Manager");
        } else {
            setEmployeeJob("Employee");
        }
    };

    const handleUpdateSalary = (employeeId, newSalary) => {
        // const newSalary = prompt("Enter the new salary:");
        if (newSalary !== null) {
            const parsedNewSalary = parseInt(newSalary);
            setNewSalary("");
            if (!isNaN(parsedNewSalary)) {
                // Construct employee data
                const employeeData = {
                    id: employeeId,
                    salary: parsedNewSalary,
                };
                // Update salary
                // console.log(employeeData);
                updateSalary(employeeData)
                    .then(() => {
                        setNewSalary("");
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error if needed
                    });
            } else {
                alert("Please enter a valid number for the salary.");
            }
        } else {
            alert("Please enter a new salary.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const employees_ = await getEmployees();
            //console.log(employees);
            const employee_names = [];
            const employee_images = [];

            employees_.forEach((employee) => {
                employee_names.push(employee["name"]);
                const imagelink =
                    "https://gravatar.com/avatar/" +
                    hashEmail(employee["email"]);
                // console.log(imagelink);
                employee_images.push(imagelink);
                //console.log(employee["name"]);
            });

            setEmployeeNames(employee_names);
            setEmployeeImages(employee_images);
            setEmployees(employees_);
        };

        fetchData();
    }, []);

    return (
        <div style={{ marginLeft: "15%", display: "flex" }}>
            <div style={{ flex: "1" }}>
                <h1>Employees Page</h1>
                <div className="employee-tiles">
                    {employeeNames.map((employee, index) => (
                        <div
                            key={index}
                            className="employee-tile"
                            style={{
                                width: "40%",
                                marginBottom: "20px",
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                padding: "1%",
                            }}
                            onClick={() => handleEmployeeClick(employee, index)}
                        >
                            <img
                                src={employeeImages[index]}
                                alt="Employee"
                                style={{
                                    width: "20%",
                                    height: "20%",
                                    marginBottom: "10px",
                                }}
                            />
                            <div>{employee}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                style={{
                    flex: "1",
                    marginLeft: "10%",
                    position: "fixed",
                    top: "10%",
                    width: "30%",
                    right: "10%",
                }}
            >
                <h2>Employee Information</h2>
                {selectedEmployee && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "5%",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "left" }}>
                            <img
                                src={employeeImages[selectedEmployeeNum]}
                                alt="Employee"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    marginRight: "20px",
                                }}
                            />
                            <h3 style={{ margin: 0, textAlign: "center" }}>
                                {selectedEmployee}
                            </h3>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                            <div
                                style={{
                                    marginBottom: "10px",
                                    borderBottom: "1px solid #ccc",
                                    paddingBottom: "5px",
                                }}
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    Salary:
                                </span>{" "}
                                {employees[selectedEmployeeNum]["salary"]}
                                {/* <button style={{ marginLeft: "10px" }} onClick={handleUpdateSalary(selectedEmployee)}>Update</button> */}
                                <div style={{ marginBottom: "10px" }}>
                                    <input
                                        type="text"
                                        placeholder="Enter new salary"
                                        value={newSalary}
                                        onChange={(e) =>
                                            setNewSalary(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUpdateSalary(
                                                    employees[
                                                        selectedEmployeeNum
                                                    ]["id"],
                                                    newSalary
                                                );
                                            }
                                        }}
                                    />
                                    <button
                                        style={{ marginLeft: "10px" }}
                                        onClick={() =>
                                            handleUpdateSalary(
                                                employees[selectedEmployeeNum][
                                                    "id"
                                                ],
                                                newSalary
                                            )
                                        }
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                            <div
                                style={{
                                    marginBottom: "10px",
                                    borderBottom: "1px solid #ccc",
                                    paddingBottom: "5px",
                                }}
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    Email:
                                </span>{" "}
                                {employees[selectedEmployeeNum]["email"]}
                            </div>
                            <div>
                                <span style={{ fontWeight: "bold" }}>
                                    Position:{" "}
                                </span>{" "}
                                {employeeJob}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeesPage;
