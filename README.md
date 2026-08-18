# SCT Barcode-Based Attendance System

A web-based Barcode-Based Attendance Management System developed for
Sulu College of Technology (SCT).

The system is designed to help administrators manage student records,
verify students through barcode scanning, record attendance, manage
system users, and provide SMS notifications through a Huawei GSM modem.

## 📌 Project Overview

The SCT Barcode-Based Attendance System automates the process of
student identification and attendance recording using unique barcodes.

Instead of manually searching for student records, the system allows
a student's barcode to be scanned and verified against the student
database before recording attendance.

## ✨ Features

### 👨‍🎓 Student Management
- Add and manage student records
- Store student information
- Generate and manage student barcode identifiers
- Search student records
- Archive student records
- Restore archived students

### 📷 Barcode-Based Attendance
- Scan student barcode
- Identify the student from the database
- Validate student information
- Record attendance
- Prevent duplicate attendance records

### 📝 Attendance Management
- View student attendance records
- Search attendance records
- Filter attendance by date
- Track recorded attendance

### 📢 Announcement Management
- Create and manage announcements
- Display announcements to system users
- Support SMS notification records

### 👥 User Management
- Create system accounts
- Assign user roles
- Administrator access control
- Regular user access
- Update user accounts
- Delete user accounts

### 📱 SMS Notification
- Huawei GSM modem integration
- Send SMS notifications
- Record SMS activity
- Monitor SMS logs

## 🔐 User Roles

The system currently supports two main user roles:

### Administrator
Administrators have access to system management functions,
including:

- Dashboard
- Student Management
- Attendance Records
- Announcements
- User Management
- Other administrative functions

### Regular User

Regular users have access to standard system functions based
on the permissions provided by the system.

## 🔄 System Flow

```text
Student ID / Barcode
        ↓
   Scan Barcode
        ↓
 Find Student Record
        ↓
 Validate Student
        ↓
 Record Attendance
        ↓
 Store Attendance Record
        ↓
 Send SMS Notification
        ↓
   SMS Log / Record