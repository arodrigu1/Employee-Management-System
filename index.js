const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "12345678",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  startTracker();
});

function startTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Update an Employee's Role",
        "Delete an Employee",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "Update an Employee's Role":
          updateEmployeeRole();
          break;

        case "Delete an Employee":
          deleteEmployee();
          break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "Please enter new department name."
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name
        },
        function(err) {
          if (err) throw err;
          console.log("A new department has been created!");
          startTracker();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Please enter the title of the new role."
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter the salary of the new role."
      },
      {
        name: "department",
        type: "input",
        message:
          "Which department does the role belong to? (Please enter the department ID)"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department
        },
        function(err) {
          if (err) throw err;
          console.log("A new role has been created!");
          startTracker();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Please enter the employee's first name."
      },
      {
        name: "last_name",
        type: "input",
        message: "Please enter the employee's last name."
      },
      {
        name: "role",
        type: "input",
        message: "What is the new employee's role? (Please enter the role ID)"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role
        },
        function(err) {
          if (err) throw err;
          console.log("The new employee has been created!");
          startTracker();
        }
      );
    });
}

function viewDepartments() {
  connection.query("select * from department", function(err, result) {
    if (err) throw err;
    console.table(result);
    startTracker();
  });
}

function viewRoles() {
  connection.query("select * from role", function(err, result) {
    if (err) throw err;
    console.table(result);
    startTracker();
  });
}

function viewEmployees() {
  connection.query("select * from employee", function(err, result) {
    if (err) throw err;
    console.table(result);
    startTracker();
  });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "input",
        message:
          "Which employee's role would you like to update? (Please enter the employee ID)"
      },
      {
        name: "role",
        type: "input",
        message: "What is the employee's new role? (Please enter the role ID)"
      }
    ])
    .then(function(answer) {
      connection.query(
        "UPDATE employee SET ? where ?",
        [
          {
            role_id: answer.role
          },
          {
            id: answer.employee
          }
        ],
        function(err) {
          if (err) throw err;
          console.log("Employee has been updated!");
          startTracker();
        }
      );
    });
}

function deleteEmployee() {
    inquirer
      .prompt({
        name: "employee",
        type: "input",
        message:
          "Which employee would you like to delete? (Please enter the employee's ID)"
      })
      .then(function(answer) {
        connection.query(
          "DELETE from employee where ?",
          {
            id: answer.employee
          },
          function(err, result) {
            if (err) throw err;
            console.log("Employee has been deleted!");
            startTracker();
          }
       );
    });
}