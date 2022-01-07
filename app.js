const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

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
            'complete updates',
            'update an employee role'
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
        }
    })
}


function viewDepartments() {
    var query = 'SELECT * FROM department'
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('Departments:', res);
        userInput()
    })
}

function viewEmployees() {
    var query = 'SELECT * FROM employee'
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('Employees:', res);
        userInput()
    })
}

function viewRoles() {
    var query = 'SELECT * FROM role_info'
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table('Roles:', res);
        userInput()
    })
}

function addEmployee() {
    connection.query('SELECT * FROM role_info', function (err, res) {
        if (err) throw err
        inquirer.prompt([{
                name: 'first_name',
                type: 'input',
                message: 'first name'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'last name'
            },
            {
                name: 'manager_id',
                type: 'input',
                message: 'manager id'
            },
            {
                name: 'role',
                type: 'input',
                message: 'job title'
            }
        ]).then(function (answer) {
            let role_id
            for (let i = 0; i < res.length; i++) {
                if (res[i].title == answer.role) {
                    role_id = res[i].id
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
                    console.log('success!')
                    userInput()
                }
            )
        })
    })
}

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
            console.table('All Departments', res)
            userInput()
        })
    })
}

function addRoles() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err

        inquirer.prompt([{
                    name: 'addRole',
                    type: 'input',
                    message: 'what role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'salary?'
                },
                {
                    name: 'department',
                    type: 'input',
                    message: 'what department?'
                }
            ]).then(function (answer) {
                    let department_id
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].department_id == answer.department) {
                            department_id = res[i].id
                            console.log(department_id)
                        }
                    }
            connection.query(
                'INSERT INTO role_info SET ?',
                {
                    title: answer.addRole,
                    salary: answer.salary,
                    department_id: department_id,
                },
                function (err, res) {
                    if(err)throw err
                    console.log('success!')
                    console.table('All Roles:', res)
                    userInput()
                }
            )

            })
    })
}

var roleArr = []
function roleOptions(){
    connection.query("SELECT * FROM role", function(err,res){
        if (err) throw err
        for (var i = 0; i < res.length; i++){
            roleArr.push(res[i].title)
        }
    })
    return roleArr
}

function updateRole() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id;", function(err, res){
        if (err) throw err
        console.log(res)
        inquirer.prompt([
            {
                name: 'lastName',
                type: 'rawlist',
                choices: function() {
                    var lastName = []
                    for (var i=0; i < res.length; i++) {
                        lastName.push(res[i].last_name)
                    }
                    return lastName
                },
                message: 'what is the last name?',
            },
            {
                name: 'role',
                type: 'rawlist',
                message: 'what is the new role?',
                choices: roleOptions()
            },
        ])
        .then(function(val){
            var roleId = roleOptions().indexOf(val.role)+1
            connection.query("UPDATE employee SET WHERE ?",
            {
                last_name: val.lastName
            },
            {
                role_id: roleId
            },
            function(err){
                if (err) throw err
                console.table(val)
                userInput()
            })
        })
    })
}