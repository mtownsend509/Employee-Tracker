const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const database = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        //password: removed for github
        database: 'departments_db',
    }
);

function start() {

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Close App'],
            name: 'startChoice'
        }
        ]).then((response) => {
            if (response.startChoice == 'View all departments') {
                database.query("Select * FROM departments", function (err, results) {
                    console.table(results);
                    start();
                });
            } else if (response.startChoice == 'View all roles') {
                database.query("select roles.id, roles.job_title as Role, roles.salary, departments.department_name as Department from roles join departments on roles.department_id = departments.id;", function (err, results) {
                    console.table(results);
                    start();
                });
            } else if (response.startChoice == 'View all employees') {
                database.query("Select e.id, e.first_name, e.last_name, f.last_name as Manager, roles.job_title as Role, roles.salary, departments.department_name as Department FROM employees e join roles on e.roles_id = roles.id join departments on roles.department_id = departments.id join employees f on e.manager_id = f.id;", function (err, results) {
                    console.table(results);
                    start();
                });
            } else if (response.startChoice == 'Add a department') {
                addDepartment();
            } else if (response.startChoice == 'Add a role') {
                addRole();
            } else if (response.startChoice == 'Add an employee') {
                addEmployee();
            } else if (response.startChoice == 'Update an employee role') {
                updateEmployee();
            } else {
                database.end();
            }
        });
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please enter new department name',
                name: 'department'
            }
        ])
        .then((response) => {
            database.query(`INSERT INTO departments (department_name) VALUES ('${response.department}')`, (err) => {
                console.log('New department added!');
                start();
            })
        })
};

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the new role title',
                name: 'role'
            },
            {
                type: 'input',
                message: `Enter the role's salary`,
                name: 'salary'
            },
            {
                type: 'input',
                message: 'Enter department role works in',
                name: 'department'
            }
        ])
        .then((response) => {
            var deptID = '';
            database.query(`SELECT id FROM departments where department_name = '${response.department}'`, (err, result) => {
                deptID = result[0].id;
                database.query(`INSERT INTO roles (job_title, salary, department_id) VALUES ('${response.role}', ${response.salary}, ${deptID})`, (err) => {
                    console.log('New Role added!');
                    console.log(response);
                    start();
                })
            })
        })
};

function addEmployee () {
    inquirer
        .prompt([
            {
                type: 'input',
                message: `Enter the employee's first name`,
                name: 'firstName'
            },
            {
                type: 'input',
                message: `Enter the employee's last name`,
                name: 'lastName'
            },
            {
                type: 'input',
                message: `Enter the employee's role`,
                name: 'role'
            },
            {
                type: 'input',
                message: `Enter the employee's manager's employee ID`,
                name: 'manager'
            }
        ])
        .then((response) => {
            var roleID = '';
            database.query(`SELECT id FROM roles where job_title = '${response.role}'`, (err, result) => {
                roleID = result[0].id;
                console.log(result);
                database.query(`INSERT INTO employees (first_name, last_name, manager_id, roles_id) VALUES ('${response.firstName}', '${response.lastName}', ${response.manager}, ${roleID})`, (err) => {
                    console.log('New Employee added!');
                    start();
                })
            })
        })
};

function updateEmployee() {
    database.query("Select employees.id, employees.first_name, employees.last_name, roles.job_title, roles.salary FROM employees join roles on employees.roles_id = roles.id;", (err, result) => {
        var employeeList = [];
        var rolesList = [];
        for (i=0; i<result.length; i++) {
            employeeList.push(`${result[i].last_name}`);
        }
        database.query("Select job_title from roles", (err, result) => {
            for (i=0; i<result.length; i++) {
                rolesList.push(`${result[i].job_title}`);
            }
            console.log(rolesList);
            inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'select employee to update',
                    choices: employeeList,
                    name: 'employee'
                },
                {
                    type:'list',
                    message: 'Select new role',
                    choices: rolesList,
                    name: 'employeeRole'
                }
            ])
            .then((response) => {
                var employee = response.employee;
                console.log(employee);
                database.query(`Select id from roles where job_title = '${response.employeeRole}'`, (err, result) => {
                    console.log(result[0].id);
                    database.query(`Update employees set roles_id = ${result[0].id} where last_name = '${employee}'`, (err) => {
                        console.log('worked?')
                        start();
                    })
                })
            })
        })
    })
}

start();