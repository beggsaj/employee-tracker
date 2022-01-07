USE employee_db;

INSERT INTO department (department_name)
VALUES 
('test'),
('test1'),
('test2');

INSERT INTO role_info (title, salary, department_id)
VALUES
('test', 100000, 1),
('test1', 200000, 1),
('test2', 300000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('TEST', 'TEST', 1, 2),
('TEST', 'TEST', 1, 2),
('TEST', 'TEST', 1, 2);