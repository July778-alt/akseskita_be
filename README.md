# AksesKita Backend

Backend REST API for **AksesKita**, a public accessibility reporting platform that allows users to report accessibility issues in public spaces, while administrators can manage, verify, and update reported cases.

AksesKita is designed to help document accessibility problems such as missing tactile paving, inadequate pedestrian crossings, damaged sidewalks, potholes, and other public infrastructure issues.

---

## Overview

AksesKita Backend provides the API and server-side logic required by the AksesKita web and mobile applications.

The backend handles:

* User authentication and authorization
* Accessibility report management
* Image uploads
* Report comments
* Report categories
* Report status workflow
* Report history tracking
* Dashboard statistics
* Pagination, filtering, and searching
* Role-based access control

---

## Tech Stack

| Technology                     | Purpose                   |
| ------------------------------ | ------------------------- |
| Node.js                        | JavaScript runtime        |
| Express.js                     | REST API framework        |
| TypeScript                     | Type-safe development     |
| PostgreSQL                     | Relational database       |
| JWT                            | Authentication            |
| Multer                         | Image upload handling     |
| bcrypt                         | Password hashing          |
| PostgreSQL functions / queries | Database operations       |
| dotenv                         | Environment configuration |

The project does not use an ORM. Database queries are handled directly using PostgreSQL.

---

## User Roles

### Public User

Regular users can:

* Register and log in
* Create accessibility reports
* Upload report images
* View their own reports
* View report details
* Add comments
* Track report status and history

### Admin

Administrators can:

* View submitted reports
* Manage report categories
* Review reports
* Update report statuses
* Add administrative comments
* View dashboard statistics

### Superadmin

Superadmins have additional administrative privileges, including:

* Managing users
* Changing user roles
* Managing administrative access

---

## Main Features

### Authentication

The authentication system uses JWT for secure API access.

Supported functionality:

* User registration
* User login
* Password hashing
* JWT token generation
* Authentication middleware
* Role-based authorization

Example authentication flow:

```text
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Send token with API request
   ↓
Authentication Middleware
   ↓
Role Middleware
   ↓
Protected Resource
```

---

### Accessibility Reports

Users can submit reports containing information about accessibility problems in public areas.

A report may contain:

* Title
* Description
* Category
* Image
* Latitude
* Longitude
* Status
* Creation date

Reports can also be searched, filtered, and paginated.

---

### Report Status

Reports follow a status-based workflow.

Example:

```text
Pending
   ↓
Reviewed
   ↓
In Progress
   ↓
Resolved
```

The status history is stored so users and administrators can track changes made to a report.

---

### Comments

Users and authorized administrators can communicate through comments attached to reports.

Comments can be used to:

* Provide additional information
* Ask for clarification
* Give updates
* Document administrative actions

---

### Categories

Accessibility reports are grouped into categories to make issue management easier.

Administrators can manage available categories through the API.

Example categories:

```text
Tactile Paving
Pedestrian Crossing
Sidewalk
Road Damage
Accessibility Signage
Public Facilities
Other
```

---

### Dashboard Statistics

The backend provides statistical data that can be used by the administrative dashboard.

Statistics may include:

* Total reports
* Pending reports
* In-progress reports
* Resolved reports
* Report distribution by category
* Report distribution by status

---

## API Structure

The API is organized into several main resources:

```text
/api/auth
/api/users
/api/reports
/api/categories
/api/comments
/api/dashboard
/api/histories
```

Authentication is required for protected endpoints.

Example request:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Project Structure

```text
akses_kita_be/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── report.controller.ts
│   │   ├── category.controller.ts
│   │   ├── comment.controller.ts
│   │   └── dashboard.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── report.routes.ts
│   │   ├── category.routes.ts
│   │   ├── comment.routes.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── report.service.ts
│   │   ├── category.service.ts
│   │   └── comment.service.ts
│   │
│   ├── database/
│   │   ├── migrations/
│   │   ├── queries/
│   │   └── functions/
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── response.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── uploads/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

> The exact structure may differ depending on the current implementation of the repository.

---

## Requirements

Before running the project, make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd akses_kita_be
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/akses_kita

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
```

Make sure the values match your local PostgreSQL configuration.

---

## Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE akses_kita;
```

Run the required database migrations or SQL scripts from the project.

The database contains resources for:

```text
users
reports
categories
comments
report_histories
```

Database functions and queries are maintained separately from the application logic.

---

## Running the Project

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start the production build:

```bash
npm start
```

The API will normally be available at:

```text
http://localhost:5000
```

---

## API Authentication

After logging in, the client receives a JWT token.

Include the token in protected requests:

```http
Authorization: Bearer YOUR_TOKEN
```

Example:

```http
GET /api/reports
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

## Example Report Request

Reports containing images use `multipart/form-data`.

Example fields:

```text
title
description
category_id
latitude
longitude
image
```

Example:

```http
POST /api/reports
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN
```

---

## Report Query

Reports support common query parameters for administration and discovery.

Example:

```http
GET /api/reports?page=1&limit=10
```

Filtering:

```http
GET /api/reports?status=pending
```

Searching:

```http
GET /api/reports?search=trotoar
```

The exact available parameters depend on the implemented API version.

---

## API Response Format

Successful responses generally return JSON.

Example:

```json
{
  "success": true,
  "message": "Report retrieved successfully",
  "data": {}
}
```

Error example:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Security

The backend applies several security mechanisms:

* Password hashing with bcrypt
* JWT-based authentication
* Role-based authorization
* Protected administrative endpoints
* Environment-based secret configuration
* Input validation
* Restricted file upload handling

Sensitive configuration such as JWT secrets and database credentials should never be committed to the repository.

---

## Development Flow

The backend is consumed by both AksesKita clients:

```text
                ┌──────────────────┐
                │   AksesKita Web  │
                │     Next.js      │
                └────────┬─────────┘
                         │
                         │ REST API
                         ▼
                ┌──────────────────┐
                │ AksesKita Backend│
                │    Express.js    │
                │   TypeScript     │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │    PostgreSQL    │
                └──────────────────┘
                         ▲
                         │
                         │ REST API
                ┌────────┴─────────┐
                │ AksesKita Mobile │
                │ React Native     │
                │     + Expo       │
                └──────────────────┘
```

---

## Related Projects

### AksesKita Web

Frontend application for users and administrators.

```text
Next.js + TypeScript
```

### AksesKita Mobile

Mobile application focused on the user experience.

```text
React Native + Expo
```

---

## Project Goals

AksesKita aims to provide a centralized platform for reporting and documenting accessibility issues in public spaces.

The project focuses on making accessibility problems easier to report, organize, monitor, and communicate between the public and administrators.

---

## Author

**Radit**

RPL Student & Frontend Developer

---

## License

This project was created as part of a school project and learning portfolio.
