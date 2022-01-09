USE employee_db;

INSERT INTO department (department_name)
VALUES 
('Finance'),
('Legal'),
('Operations');

INSERT INTO role_info (title, salary, department_id)
VALUES
('Director', 100000, 1),
('Supervisor', 800000, 2),
('Assisstant', 600000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Smith', 1, 2),
('Jane', 'Doe', 1, 2),
('Abi', 'Beggs', 1, 2);