DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

USE departments_db;

Create TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

Create TABLE roles (
    id INT AUTO_INCREMENT,
    job_title VARCHAR(128),
    salary INT,
    department_id INT, 
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

Create TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(128),
    last_name VARCHAR(128),
    manager_id INT,
    roles_id INT,
    PRIMARY KEY (id),
    FOREIGN Key (roles_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN Key (manager_id)
    References employees(id)
    ON DELETE SET NULL
)