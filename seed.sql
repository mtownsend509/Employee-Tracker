INSERT INTO departments (department_name)
VALUES ('sales');

INSERT INTO roles (job_title, salary, department_id)
VALUES ('Manager', 150000, 1);

INSERT INTO employees (id, first_name, last_name)
VALUES (-1 ,'Nobody', 'Nobody');

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ('Tony', 'Stark', 1, -1);