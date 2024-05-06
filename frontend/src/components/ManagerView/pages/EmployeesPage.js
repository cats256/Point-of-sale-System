// EmployeesPage.js
// tiles with name, id, orders completed
// gravatar images?..
import {
    getEmployees,
    updateSalary,
    deleteEmployee,
    addEmployee,
    getHighestEmployeeId,
    updateEmail,
    updatePosition,
} from "../../../network/api";
// import { updateSalary } from "../../../network/api";

/* api requests needed: employee names (or list of id's and call for name based on id if we want to get info based on id not name),
  employee image (either on same list as names in dictionary form or gathered from name),
  all employee information for name (could also be from id if that's easier) */
import React, { useEffect, useState, useCallback } from "react";
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
    const [newEmail, setNewEmail] = useState("");
    const [changePosition, setChangePosition] = useState(false);
    const [reasonForDeletion, setReasonForDeletion] = useState("");
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [newEmployeeName, setNewEmployeeName] = useState("");
    const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
    const [newEmployeeSalary, setNewEmployeeSalary] = useState("");
    const [newEmployeeManager, setNewEmployeeManager] = useState(false);
    const [showEdit, setShowEdit] = useState(false);


    const fetchData = useCallback(async () => {
        const employees_ = await getEmployees();
        const employee_names = [];
        const employee_images = [];

        employees_.forEach((employee) => {
            employee_names.push(employee["name"]);
            const imagelink =
                "https://gravatar.com/avatar/" + hashEmail(employee["email"]);
            employee_images.push(imagelink);
        });

        setEmployeeNames(employee_names);
        setEmployeeImages(employee_images);
        setEmployees(employees_);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // const CryptoJS = require('crypto-js');

    const hashEmail = (email) => {
        const trimmedEmail = email.trim().toLowerCase();
        const hashedEmail = sha256(trimmedEmail).toString(); //CryptoJS.SHA256(trimmedEmail).toString(CryptoJS.enc.Hex);
        return hashedEmail;
    };

    const handleEmployeeClick = (employee, num) => {
        setSelectedEmployee(employee);
        setSelectedEmployeeNum(num);
        setShowEdit(false);
        if (employees[num]["manager"]) {
            setEmployeeJob("Manager");
        } else {
            setEmployeeJob("Employee");
        }
    };

    const toggleEdit = () => {
        setShowEdit(!showEdit);
    };
    
    const toggleChangePosition = () => {
        setChangePosition(!changePosition);
    };  

    const handleUpdateSalary = (employeeId, newSalary) => {
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
                updateSalary(employeeData)
                    .then(() => {
                        setNewSalary("");
                        fetchData();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        // Handle error if needed
                    });
            } 
            else {
                alert("Please enter a valid number for the salary.");
            }
        } else {
            alert("Please enter a new salary.");
        }
    };

    const handleUpdateEmail = (employeeId, newEmail) => {
        if (newEmail !== null) {
            // Construct employee data
            const employeeData = {
                id: employeeId,
                email: newEmail,
            };
            // Update salary
            updateEmail(employeeData)
                .then(() => {
                    setNewEmail("");
                    fetchData();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // Handle error if needed
                });
        } else {
            alert("Please enter a new email.");
        }
    };

    const handleUpdatePosition = () => {
        const isManager = employees[selectedEmployeeNum]["manager"];
        const newManagerStatus = !isManager;
    
        // Construct employee data with updated manager status
        const employeeData = {
            id: employees[selectedEmployeeNum]["id"],
            manager: newManagerStatus,
        };
    
        // Update employee's manager status if changePosition is true
        if (changePosition) {
            updatePosition(employeeData)
                .then(() => {
                    // Refresh data after update
                    setChangePosition(false); // Reset checkbox state
                    fetchData();
                })
                .catch((error) => {
                    console.error("Error updating position:", error);
                    // Handle error if needed
                });
        }
    };

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDeleteEmployee = async () => {
        if (reasonForDeletion !== "") {
            const employeeId = employees[selectedEmployeeNum]["id"];
            const deleted_employee = {
                id: employeeId,
            };
            await deleteEmployee(deleted_employee);
            // Assuming deleteEmployee is a function that deletes the employee with provided id and reason
            // You can handle the deletion process according to your backend implementation
            // After deletion, you may want to update the UI accordingly
            setSelectedEmployee(null);
            setSelectedEmployeeNum(null);
            setShowDeleteConfirmation(false);
            setReasonForDeletion("");
            fetchData();
        } else {
            alert("Please provide a reason for the deletion.");
        }
    };

    const handleAddEmployee = async () => {
        // Make sure all fields are filled
        if (newEmployeeName && newEmployeeEmail && newEmployeeSalary) {
            // Assuming you have a function to add an employee to the database
            // You can call an API or use another method to send this data to the server
            const newEmployeeIdAwait = await getHighestEmployeeId();
            // console.log(newEmployeeIdAwait.highest_id);
            const newEmployeeId = parseInt(newEmployeeIdAwait.highest_id) +1;
            const employeeData = {
                id: newEmployeeId,
                name: newEmployeeName,
                email: newEmployeeEmail,
                salary: newEmployeeSalary,
                manager: newEmployeeManager,
            };
            addEmployee(employeeData).then(() => {
                fetchData();
                setNewEmployeeName("");
                setNewEmployeeEmail("");
                setNewEmployeeSalary("");
            });
        } 
        else {
            alert("Please fill in all fields.");
        }
    };

    return (
        <div style={{ marginLeft: "15%", display: "flex" }}>
            <div style={{ flex: "1"  }}>
                <h1>Employees Page</h1>
                <div className="employee-tiles" style={{ overflowY: "auto", maxHeight: "80vh"  }}>
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
                                alt={`Employee ${employee}`}
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
                            <div style={{ marginTop: "10px" }}>
                                <button onClick={handleDeleteConfirmation}>
                                    Delete
                                </button>
                                {showDeleteConfirmation && (
                                    <div style={{ marginTop: "10px" }}>
                                        <input
                                            type="text"
                                            placeholder="Reason for deletion"
                                            value={reasonForDeletion}
                                            onChange={(e) =>
                                                setReasonForDeletion(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button onClick={handleDeleteEmployee}>
                                            Confirm Delete
                                        </button>
                                    </div>
                                )}
                                <button onClick={toggleEdit}>Edit</button>
                                    {showEdit && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Enter new salary"
                                                value={newSalary}
                                                onChange={(e) => setNewSalary(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleUpdateSalary(
                                                            employees[selectedEmployeeNum]["id"],
                                                            newSalary
                                                        );
                                                    }
                                                }}
                                            />
                                            <button
                                                style={{ marginLeft: "10px" }}
                                                onClick={() =>
                                                    handleUpdateSalary(
                                                        employees[selectedEmployeeNum]["id"],
                                                        newSalary
                                                    )
                                                }
                                            >
                                                Update Salary
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Enter new email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleUpdateEmail(
                                                            employees[selectedEmployeeNum]["id"],
                                                            newEmail
                                                        );
                                                    }
                                                }}
                                            />
                                            <button
                                                style={{ marginLeft: "10px" }}
                                                onClick={() =>
                                                    handleUpdateEmail(
                                                        employees[selectedEmployeeNum]["id"],
                                                        newEmail
                                                    )
                                                }
                                            >
                                                Update Email
                                            </button>
                                            <label>
                                                Change Position:
                                                <input
                                                    type="checkbox"
                                                    checked={changePosition}
                                                    onChange={toggleChangePosition}
                                                />
                                            </label>
                                            <button
                                                style={{ marginLeft: "10px" }}
                                                onClick={handleUpdatePosition}
                                            >
                                                Update Position
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
                <div
                    style={{
                        position: "fixed",
                        width: "40%",
                        bottom: "5%",
                        height: "28%",
                        right: "5%",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        padding: "1%",
                        // borderRadius: "5px",
                        // boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3>Add Employee</h3>
                    <div
                        style={{
                            // marginBottom: "2%",
                            // padding: "5%",
                            marginTop: "1%",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            value={newEmployeeName}
                            onChange={(e) => setNewEmployeeName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newEmployeeEmail}
                            onChange={(e) =>
                                setNewEmployeeEmail(e.target.value)
                            }
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={newEmployeeSalary}
                            onChange={(e) =>
                                setNewEmployeeSalary(e.target.value)
                            }
                        />
                    </div>
                    <div
                        style={{
                            // marginTop: "1%",
                            // padding: "5%",
                            marginBottom: "1%",
                        }}
                    >
                        <label
                            style={
                                {
                                    // padding: "5%",
                                }
                            }
                        >
                            Are they a manager?
                            <input
                                type="checkbox"
                                checked={newEmployeeManager}
                                onChange={(e) =>
                                    setNewEmployeeManager(e.target.checked)
                                }
                            />
                        </label>
                    </div>
                    <div>
                        <button
                            onClick={handleAddEmployee}
                            style={{
                                backgroundColor: "#333",
                                color: "#fff",
                                padding: "10px 20px",
                                borderRadius: "5px",
                            }}
                        >
                            Add Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
