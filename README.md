# Employee Management System

A full-stack CRUD application for managing employee records.

- **Frontend:** React (Create React App), Axios, React Router
- **Backend:** Spring Boot 3 (Java 17), Spring Data JPA, Bean Validation
- **Database:** MySQL

```
ems-project/
├── backend/     Spring Boot REST API
└── frontend/    React single-page app
```

---

## 1. Prerequisites

- Java 17+
- Maven (or use the included `mvnw` if you generate one via `mvn -N io.takari:maven:wrapper`)
- Node.js 18+ and npm
- MySQL 8+ running locally (or a connection string to a remote instance)

---

## 2. Backend setup (Spring Boot)

1. Create the database (or let it auto-create — see below):
   ```sql
   CREATE DATABASE employee_management;
   ```
2. Edit `backend/src/main/resources/application.properties` with your local MySQL
   username/password (defaults to `root` / `root`). `createDatabaseIfNotExist=true`
   is already set, so step 1 is optional.
3. Run the app:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. The API starts on **http://localhost:8080**. `spring.jpa.hibernate.ddl-auto=update`
   will create the `employees` table automatically on first run.

### API endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/employees`      | List all employees       |
| GET    | `/api/employees/{id}` | Get one employee         |
| POST   | `/api/employees`      | Create an employee       |
| PUT    | `/api/employees/{id}` | Update an employee       |
| DELETE | `/api/employees/{id}` | Delete an employee       |

Request/response body:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@company.com",
  "phoneNumber": "+1 555-0100",
  "department": "Engineering",
  "designation": "Backend Developer",
  "salary": 95000,
  "dateOfJoining": "2024-03-15"
}
```

---

## 3. Frontend setup (React)

```bash
cd frontend
cp .env.example .env      # adjust REACT_APP_API_BASE_URL if needed
npm install
npm start
```

The app runs on **http://localhost:3000** and talks to the backend at the URL in `.env`.

---

## 4. Deployment

### 4.1 Backend — package as a runnable JAR

```bash
cd backend
mvn clean package -DskipTests
# produces backend/target/employee-management-1.0.0.jar
```

Run it anywhere with Java 17 installed, pointing at your production database via
environment variables (the `prod` profile reads these — see
`application-prod.properties`):

```bash
java -jar target/employee-management-1.0.0.jar \
  --spring.profiles.active=prod \
  --DB_URL="jdbc:mysql://<host>:3306/employee_management" \
  --DB_USERNAME="<user>" \
  --DB_PASSWORD="<password>" \
  --FRONTEND_ORIGIN="https://your-frontend-domain.com"
```

(Or export `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `FRONTEND_ORIGIN`, `PORT` as real
environment variables instead of passing them inline.)

**Suggested hosts:** Render, Railway, or AWS Elastic Beanstalk all accept a Spring
Boot JAR directly and let you set these as environment variables in their dashboard.

### 4.2 Database — managed MySQL

Use a managed MySQL instance so you're not running your own server:
- Railway MySQL, PlanetScale, or AWS RDS (MySQL engine) all work.
- Run the app once against it with `ddl-auto=update` (in a non-prod profile) to
  create the schema, or supply your own migration script, then switch to
  `ddl-auto=validate` in production (already set in `application-prod.properties`).

### 4.3 Frontend — static build

```bash
cd frontend
echo "REACT_APP_API_BASE_URL=https://your-backend-domain.com/api/employees" > .env.production
npm run build
# produces frontend/build/ — a static site
```

Deploy the `build/` folder to **Vercel**, **Netlify**, or **GitHub Pages**:
- Netlify/Vercel: connect the repo, set the build command to `npm run build` and
  the publish directory to `build`, and add `REACT_APP_API_BASE_URL` as an
  environment variable in their dashboard.

### 4.4 CORS

Make sure `FRONTEND_ORIGIN` on the backend matches the exact deployed frontend URL
(including `https://`), or browser requests will be blocked by CORS.

---

## 5. Notes

- Validation runs on both the frontend (immediate feedback) and backend (source of
  truth) — the API rejects invalid payloads with a 400 and a field-level error map.
- Duplicate emails are rejected with a 409 Conflict.
- No authentication is included in this version — add Spring Security if you need
  login/roles later.
