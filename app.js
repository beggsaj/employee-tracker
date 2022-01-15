//dependiences 
const mysql = require('mysql2')
const inquirer = require('inquirer')
const consoleTable = require('console.table')

//setting up the connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Leothedog23!',
    database: 'employee_db'
})

connection.connect(err => {
    if (err) throw err
    console.log('connected')
    userInput()
})

//beginning of user input questions to determine additional info needed
const userInput = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'choices',
        message: 'What do you want to do?',
        choices: [
            'view all departments',
            'view all employees',
            'view all roles',
            'add employee',
            'add department',
            'add role',
            'update an employee role',
            'complete updates'
        ]
    }]).then(function (val) {
        switch (val.choices) {
            case 'view all departments':
                viewDepartments()
                break
            case 'view all employees':
                viewEmployees()
                break
            case 'view all roles':
                viewRoles()
                break
            case 'add employee':
                addEmployee()
                break
            case 'add department':
                addDepartment()
                break
            case 'add role':
                addRoles()
                break
            case 'update an employee role':
                updateRole()
                break
            case 'complete updates':
                finishQuestions()
                break
        }
    })
}

//displays all depts
function viewDepartments() {
    var query = 'SELECT * FROM department'
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('Departments:', res);
        userInput()
    })
}

//displays all employees
function viewEmployees() {
    var query = 'SELECT * FROM employee'
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('Employees:', res);
        userInput()
    })
}

//displays all roles
function viewRoles() {
    var query = 'SELECT * FROM role_info'
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('Roles:', res);
        userInput()
    })
}

//adds new employees
function addEmployee() {
    connection.query('SELECT * FROM role_info', function (err, res) {
        if (err) throw err
        inquirer.prompt([{
                name: 'first_name',
                type: 'input',
                message: 'first name:'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'last name:'
            },
            {
                name: 'manager_id',
                type: 'input',
                message: 'manager id:'
            },
            {
                name: 'role',
                type: 'list',
                choices: function () {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                },
                message: "new employee's role?"
            }
        ]).then(function (answer) {
            let role_id;
            for (let i = 0; i < res.length; i++) {
                if (res[i].title == answer.role) {
                    role_id = res[i].id;
                    console.log(role_id)
                }
            }
            connection.query(
                'INSERT INTO employee SET ?', {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    manager_id: answer.manager_id,
                    role_id: role_id,
                },
                function (err) {
                    if (err) throw err
                    console.table(res);
                    userInput()
                }
            )
        })
    })
}

//adds new depts
function addDepartment() {
    inquirer.prompt([{
        name: 'addDepartment',
        type: 'input',
        message: 'name?'
    }]).then(function (answer) {
        connection.query(
            'INSERT INTO department SET ?', {
                department_name: answer.addDepartment
            })
        var query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err
            console.log('success!')
            console.table(res)
            userInput()
        })
    })
}

//adds new roles
function addRoles() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err

        inquirer.prompt([{
                name: 'addRole',
                type: 'input',
                message: 'what is the new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'what is the salary?'
            },
            {
                name: 'department',
                type: 'list',
                choices: function () {
                    var deptArry = []
                    for (let i = 0; i < res.length; i++) {
                        deptArry.push(res[i].department_name)
                    }
                    return deptArry
                },
            }
        ]).then(function (answer) {
            let department_id
            for (let i = 0; i < res.length; i++) {
                if (res[i].department_id == answer.department_name) {
                    department_id = res[i].id
                    console.log(department_id)
                }
            }
            connection.query(
                'INSERT INTO role_info SET ?', {
                    title: answer.addRole,
                    salary: answer.salary,
                    department_id: department_id,
                },
                function (err, res) {
                    if (err) throw err
                    console.log('success!')
                    console.table(res)
                    userInput()
                }
            )

        })
    })
}

//updates existing role IDs
function updateRole() {
    connection.query("SELECT employee.last_name, role_info.title FROM employee JOIN role_info ON employee.role_id = role_info.id;", function (err, res) {
        console.log(res)
        if (err) throw err
        inquirer.prompt([{
                    type: "input",
                    message: "Enter employee's ID to be updated",
                    name: "updateEmployID"
                },
                {
                    type: "input",
                    message: "Enter the new role ID for employee",
                    name: "newRoleID"
                },
            ])
            .then(function (res) {
                const updateEmploy = res.updateEmploy;
                const newRole = res.newRole;
                const queryUpdate = `UPDATE employee SET role_id = "${newRoleID}" WHERE id = "${updateEmployID}"`;
                connection.query(queryUpdate, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.table(res);
                    userInput();
                })
            });
    })
}

function finishQuestions(){
    connection.end()
}