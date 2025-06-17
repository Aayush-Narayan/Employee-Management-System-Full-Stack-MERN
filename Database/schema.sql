create database if not exists employee_management;
use employee_management;

--------------------------------------------------------------------------------
-- 1. “notVerified”: signup requests (pending or declined stay here)
--    – No status enum; once approved, row is deleted and moved out
--------------------------------------------------------------------------------

create table if not exists notVerified(
    id int auto_increment primary key,
    employeeID varchar(6) not null unique,
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    gender enum('Male', 'Female', 'Other') not null,
    bloodGroup varchar(3) not null,
    dateOfBirth Date not null,
    dateOfJoining Date not null,
    phoneNo varchar(15) unique not null,
    email varchar(100) not null,
    education varchar(200) not null,
    qualification varchar(200) not null,
    designation varchar(100) not null,
    password varchar(100) not null,
    requestedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 2. “users”: login creds + role
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeID VARCHAR(6) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------
-- 3. “verified”: approved employee profiles (references users.employeeID)
--------------------------------------------------------------------------------

create table if not exists verified(
    id int auto_increment primary key,
    employeeID varchar(6) not null unique,
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    gender enum('Male', 'Female', 'Other') not null,
    bloodGroup varchar(3) not null,
    dateOfBirth Date not null,
    dateOfJoining Date not null,
    phoneNo varchar(15) unique not null,
    email varchar(100) not null,
    education varchar(200) not null,
    qualification varchar(200) not null,
    designation varchar(100) not null,
    attendance INT DEFAULT 0 not null,
    salary DECIMAL(10,2) not null,
    rating DECIMAL(3,2) not null,
    paidLeavesLeft INT DEFAULT 0 not null,
    hiredAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employeeID) REFERENCES users(employeeID) ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- 4. “leaveRequests”: each leave‐of‐absence request by an employee
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leaveRequests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  employeeID    VARCHAR(6)       NOT NULL,
  startDate     DATE             NOT NULL,
  endDate       DATE             NOT NULL,
  type          ENUM('Sick','Vacation','Maternity','Paternity','Unpaid','Other') NOT NULL,
  reason        VARCHAR(500)     NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  requestedAt   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewedBy    INT              NULL,    -- users.id of the approver
  reviewedAt    TIMESTAMP        NULL,
  FOREIGN KEY (employeeID) REFERENCES verified(employeeID) ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- 5. “attendanceRecords”: one row per day per employee
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendanceRecords (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  employeeID    VARCHAR(6)       NOT NULL,
  date          DATE             NOT NULL,
  status        ENUM('present','absent','halfday','remote') NOT NULL DEFAULT 'present',
  punchedInAt   TIME             NULL,
  punchedOutAt  TIME             NULL,
  FOREIGN KEY (employeeID) REFERENCES verified(employeeID) ON DELETE CASCADE,
  UNIQUE KEY (employeeID, date)
);

--------------------------------------------------------------------------------
-- 6. “payroll”: monthly payroll summary (optional)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payroll (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  employeeID      VARCHAR(6)       NOT NULL,
  month           CHAR(7)          NOT NULL,   -- e.g. '2025-06'
  basicSalary     DECIMAL(10,2)    NOT NULL,
  allowances      DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  deductions      DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  netPay          DECIMAL(10,2)    NOT NULL,
  generatedAt     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payslipURL      VARCHAR(255)     NULL,
  FOREIGN KEY (employeeID) REFERENCES verified(employeeID) ON DELETE CASCADE,
  UNIQUE KEY (employeeID, month)
);








USE employee_management;

-- 1. notVerified: one signup request (pending)
INSERT INTO notVerified (
  employeeID, firstName, lastName, gender, bloodGroup,
  dateOfBirth, dateOfJoining, phoneNo, email,
  education, qualification, designation,
  password
) VALUES (
  '250101',
  'Alice',
  'Patel',
  'Female',
  'B+',
  '1995-08-15',
  '2025-07-01',
  '9123456789',
  'alice.patel@example.com',
  'MBA - HR',
  'Certified HR Manager',
  'HR Manager',
  -- bcrypt.hashSync('Alice@123', 8), sample value below:
  '$2b$08$lvUZl8o5D42ZkxVdjAXzUekz9GntHy0R7QmNJbI6MAdOJqvAcZHpS'
);

-- 2. users: one login record (pretend already approved)
INSERT INTO users (
  employeeID, email, password, role
) VALUES (
  '250101',
  'alice.patel@example.com',
  '$2b$08$lvUZl8o5D42ZkxVdjAXzUekz9GntHy0R7QmNJbI6MAdOJqvAcZHpS',
  'employee'
);

-- 3. verified: approved profile (matching user above)
INSERT INTO verified (
  employeeID, firstName, lastName, gender, bloodGroup,
  dateOfBirth, dateOfJoining, phoneNo, email,
  education, qualification, designation,
  attendance, salary, rating, paidLeavesLeft
) VALUES (
  '250101',
  'Alice',
  'Patel',
  'Female',
  'B+',
  '1995-08-15',
  '2025-07-01',
  '9123456789',
  'alice.patel@example.com',
  'MBA - HR',
  'Certified HR Manager',
  'HR Manager',
  0,        -- attendance so far
  60000.00, -- salary
  4.50,     -- rating
  12        -- paidLeavesLeft
);

-- 4. leaveRequests: one “pending” leave for Alice
INSERT INTO leaveRequests (
  employeeID, startDate, endDate, type, reason, status
) VALUES (
  '250101',
  '2025-07-15',
  '2025-07-20',
  'Vacation',
  'Family event',
  'pending'
);

-- 5. attendanceRecords: one “present” record for Alice on 2025-06-02
INSERT INTO attendanceRecords (
  employeeID, date, status, punchedInAt, punchedOutAt
) VALUES (
  '250101',
  '2025-06-02',
  'present',
  '09:05:00',
  '17:15:00'
);

-- 6. payroll: one payroll row for June 2025
INSERT INTO payroll (
  employeeID, month, basicSalary, allowances, deductions, netPay
) VALUES (
  '250101',
  '2025-06',
  5000.00,
  500.00,
  200.00,
  5300.00
);
