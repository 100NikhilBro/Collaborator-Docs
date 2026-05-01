# Collaborative Document App

A full-stack collaborative document management system designed to support secure, scalable, and structured multi-user interaction.

---

## Documentation

PDF Documentation:
https://drive.google.com/file/d/1espeG8Tl_N1j_wao0fsXM25-W_cvliX2/view?usp=sharing

---

## Authors

Ankit Dandotiya
Abhay Singh Jadon
Nikhil Gupta

---

## Overview

The Collaborative Document App is a web-based system that allows users to create, manage, and collaborate on documents in a controlled environment. Each user interacts with the system through authenticated requests, ensuring that all operations are verified before execution.

The system is designed with the following goals:

* Secure authentication and authorization of users
* Controlled access to documents
* Modular and scalable backend design
* Support for future real-time collaboration features

---

## Application Flow (UI Navigation)

Home Page → Signup Page → Login Page → Document Page → Editorial Page

### Description

The application starts at the Home Page, which acts as the entry point. From here, users can navigate to either the Signup Page or Login Page. New users register through the Signup Page, while existing users authenticate via the Login Page.

After successful authentication, users are redirected to the Document Page where they can view, create, or manage documents. When a document is selected, the user is taken to the Editorial Page where editing and collaboration take place.

### Diagram

(View diagram of application flow in PDF)

---

## System Architecture

### Description

The system follows a layered architecture approach. The frontend handles user interaction and sends requests to the backend API. The backend processes requests using middleware for authentication and authorization. Controllers execute business logic and interact with the database. MongoDB stores all persistent data including users and documents.

This layered approach ensures scalability, maintainability, and security.

### Diagram

(View System Architecture Diagram in PDF)

---

## Data Flow Diagram

### Description

When a user performs an action, the request flows from the frontend to the backend API. The request is first validated using middleware. After validation, the controller processes the request and interacts with the database. The result is then sent back to the frontend, which updates the user interface.

This ensures a consistent and secure request-response lifecycle.

### Diagram

(View Data Flow Diagram in PDF)

---

## Backend Architecture

### Description

The backend is divided into multiple modules:

* Routes: Define API endpoints
* Controllers: Handle business logic
* Models: Define database schemas
* Middleware: Handle authentication and validation
* Utilities: Provide helper functions

This modular approach improves code readability, scalability, and maintainability.

### Diagram

(View Backend Architecture Diagram in PDF)

---

## Authentication and Authorization

### Description

Users must log in to access protected resources. After login, a token is generated and attached to all requests. Middleware verifies this token and checks permissions before allowing access. Unauthorized requests are rejected, ensuring system security.

### Diagram

(View Authentication Flow Diagram in PDF)

---

## Future Real-Time Collaboration

### Description

The system is designed to support real-time collaboration in future updates. When one user edits a document, the changes will be saved and broadcast to other users instantly using a socket-based system. This will allow multiple users to work on the same document simultaneously.

### Diagram

(View Real-Time Collaboration Diagram in PDF)

---

## Tech Stack

Frontend: React, Vite
Backend: Node.js, Express
Database: MongoDB
Authentication: JWT

---

## Security Features

* sanitize-html is used to prevent cross-site scripting attacks
* helmet secures HTTP headers
* secure-password ensures safe password hashing
* express-validator validates user inputs

---

## API Structure

User APIs: signup, login
Document APIs: create, read, update, delete
Collaborator APIs: manage permissions

---

## Installation

### Backend

cd backend
npm install
npm start

### Frontend

cd frontend
npm install
npm run dev

---

## Future Enhancements

* Real-time collaboration
* Activity tracking UI
* Notification system
* Conflict resolution mechanisms

---
