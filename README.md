
# ShhBox

Secure file-sharing application built with Java (Payara Server) + React + Docker.

## Project Overview

ShhBox is a full-stack application that allows authenticated users to upload, list, download, and delete files securely.

- **Backend**: Jakarta EE (Payara Server 6) + H2 Database + JWT Authentication
- **Frontend**: React + Vite + TailwindCSS
- **Containerization**: Docker Compose

---

## Key Technologies

- **Java 21**
- **Jakarta EE 10** (CDI, JPA, JAX-RS)
- **Hibernate ORM**
- **JWT** Authentication (`jjwt` library)
- **React 18** + **Vite** + **TailwindCSS**
- **Docker & Docker Compose**

---

## Features

- User registration and login with JWT token generation
- File upload using multipart/form-data
- File listing with uploader information and upload time
- File download and file deletion
- Protected routes using JWT tokens

---

## Folder Structure

```plaintext
shhbox-backend/     # Java backend project (WAR)
shhbox-frontend/    # React frontend project
Dockerfile          # Backend Dockerfile
vite.config.js      # Frontend Vite configuration
package.json        # Frontend dependencies
pom.xml             # Backend Maven configuration
docker-compose.yml  # Docker Compose file
README.md
```

---

## Environment Setup

### Prerequisites
- Docker & Docker Compose installed
- Node.js installed (if you want to run the frontend separately)

### Running with Docker Compose

```bash
docker compose up --build
```

Services will be available at:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080/shhbox](http://localhost:8080/shhbox)

### API Endpoints (Backend)

| Method | Endpoint                        | Description              |
|:------:|:---------------------------------|:-------------------------|
| POST   | `/api/auth/register`             | User registration        |
| POST   | `/api/auth/login`                | User login (returns JWT)  |
| POST   | `/api/auth/change-password`      | Change user password      |
| GET    | `/api/files`                     | List uploaded files       |
| POST   | `/api/files/upload`              | Upload a file             |
| GET    | `/api/files/download/{id}`       | Download file by ID       |
| DELETE | `/api/files/{id}`                | Delete file by ID         |

All endpoints under `/api/files` require a valid **Authorization: Bearer {token}** header.

### Example `.env` (Frontend)

```plaintext
VITE_API_BASE_URL=/api
```

---

## Screenshots (Planned)

- Login screen
- File upload screen
- File list with download/delete options

(You can insert screenshots later after uploading them.)

---

## Future Improvements

- User profile page
- Password reset via email
- Admin dashboard for managing users and files
- SSL/TLS security setup
- Production deployment optimization (multi-stage Docker build)

---

## License

This project is open source under the MIT license.

---

# Quick Start

1. Clone the repository:

```bash
git clone https://github.com/yourusername/shhbox.git
cd shhbox
```

2. Start containers:

```bash
docker compose up --build
```

3. Open the browser:

```plaintext
Frontend: http://localhost:5173
Backend API: http://localhost:8080/shhbox
```

---

# Notes
- The backend automatically deploys the WAR to Payara Server.
- The frontend uses Vite's dev server and proxies API requests to the backend.
- Authentication is based on self-issued JWT tokens.

---

# Contribution
Pull requests are welcome! Feel free to open issues or suggest features.

---

# Enjoy using ShhBox! 🎉
