# CureLink Backend API Documentation

## 🚀 How to See Backend Details

### 1. **Console Logs (Terminal/Command Prompt)**
When you run the backend server, you'll see logs in your terminal:

```bash
cd backend
npm run dev
```

**You'll see:**
- `Server running on port 5000`
- `MongoDB Connected` (if MongoDB is running)
- `MongoDB Connection Error: ...` (if MongoDB connection fails)
- Request logs and errors

### 2. **Test API Endpoints**

#### Option A: Using Browser
Open your browser and visit:
- `http://localhost:5000/` - Basic API info
- `http://localhost:5000/api/auth/register` - (POST only, use Postman/Thunder Client)

#### Option B: Using Postman or Thunder Client (VS Code Extension)
Test all endpoints with proper HTTP methods and request bodies.

#### Option C: Using curl (Command Line)
```bash
# Test basic route
curl http://localhost:5000/

# Test register (POST)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@gmail.com","password":"Test@123","role":"patient"}'
```

---

## 📋 Available API Endpoints

### **Base URL:** `http://localhost:5000/api`

### 🔐 Authentication Routes (`/api/auth`)

#### 1. Register User
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "Password@123",
    "role": "patient" // or "doctor"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "patient"
    }
  }
  ```

#### 2. Login User
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@gmail.com",
    "password": "Password@123",
    "role": "patient" // optional
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "PATIENT login successful",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "patient"
    }
  }
  ```

#### 3. Get Current User (Protected)
- **Method:** `GET`
- **URL:** `/api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "patient"
    }
  }
  ```

---

### 📅 Appointment Routes (`/api/appointments`)

All appointment routes require authentication (JWT token in header).

#### 1. Book Appointment
- **Method:** `POST`
- **URL:** `/api/appointments`
- **Headers:**
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body:**
  ```json
  {
    "doctorId": "doctor_user_id",
    "date": "2024-12-25",
    "timeSlot": "10:00 AM"
  }
  ```

#### 2. Get Patient Appointments
- **Method:** `GET`
- **URL:** `/api/appointments/patient`
- **Headers:**
  ```
  Authorization: Bearer <your_jwt_token>
  ```

#### 3. Get Doctor Appointments
- **Method:** `GET`
- **URL:** `/api/appointments/doctor`
- **Headers:**
  ```
  Authorization: Bearer <your_jwt_token>
  ```

#### 4. Update Appointment Status
- **Method:** `PUT`
- **URL:** `/api/appointments/:id`
- **Headers:**
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- **Body:**
  ```json
  {
    "status": "Confirmed" // "Pending", "Confirmed", or "Completed"
  }
  ```

---

## 📁 Backend File Structure

```
backend/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                      # Environment variables (create this)
│
├── models/
│   ├── User.js              # User schema (name, email, password, role)
│   └── Appointment.js        # Appointment schema
│
├── controllers/
│   ├── authController.js     # Register, Login, GetCurrentUser
│   └── appointmentController.js # Appointment CRUD operations
│
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── appointmentRoutes.js  # Appointment endpoints
│
└── middleware/
    └── auth.js               # JWT authentication middleware
```

---

## 🔍 How to Check Backend Status

### 1. **Check if Server is Running**
Visit: `http://localhost:5000/`
Expected response:
```json
{
  "message": "CureLink API - Appointment Module"
}
```

### 2. **Check MongoDB Connection**
Look at your terminal/console when starting the server:
- ✅ `MongoDB Connected` = Success
- ❌ `MongoDB Connection Error: ...` = Failed

### 3. **View Database Data**
Use MongoDB Compass or MongoDB Shell:
```bash
# Connect to MongoDB
mongosh

# Use the database
use curelink

# View users
db.users.find().pretty()

# View appointments
db.appointments.find().pretty()
```

---

## 🛠️ Environment Variables

Create a `.env` file in the `backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/curelink
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

---

## 📝 Testing with Postman/Thunder Client

### Example: Register a User

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/register`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (JSON):**
   ```json
   {
     "name": "Test Patient",
     "email": "patient@gmail.com",
     "password": "Test@123",
     "role": "patient"
   }
   ```

### Example: Login

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/login`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (JSON):**
   ```json
   {
     "email": "patient@gmail.com",
     "password": "Test@123",
     "role": "patient"
   }
   ```
5. **Copy the token** from response for protected routes

### Example: Get Current User (Protected)

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/auth/me`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer <paste_token_here>`

---

## 🐛 Debugging

### View Request Logs
Add this to `server.js` to see all requests:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Common Issues:
1. **Port 5000 already in use:** Change PORT in `.env` or `server.js`
2. **MongoDB not connected:** Make sure MongoDB is running
3. **CORS errors:** Already handled in `server.js`
4. **Token expired:** Login again to get new token

---

## 📊 Database Schema

### User Collection
- `name` (String, required)
- `email` (String, required, unique, Gmail format)
- `password` (String, required, hashed)
- `role` (String: "patient", "doctor", or "admin")
- `createdAt`, `updatedAt` (auto-generated)

### Appointment Collection
- `patientId` (ObjectId, ref: User)
- `doctorId` (ObjectId, ref: User)
- `date` (Date, required)
- `timeSlot` (String, required)
- `status` (String: "Pending", "Confirmed", "Completed")
- `createdAt`, `updatedAt` (auto-generated)
