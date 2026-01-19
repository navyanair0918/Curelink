# MongoDB Shell Commands Guide

## Getting Started

### 1. **Open MongoDB Shell**
```bash
mongosh
```

### 2. **Connect to Specific Database**
```bash
mongosh mongodb://localhost:27017/curelink
```

---

## Basic Database Commands

### **Show All Databases**
```javascript
show dbs
```

### **Switch to/Use Database**
```javascript
use curelink
```

### **Show Current Database**
```javascript
db
```

### **Show Collections (Tables)**
```javascript
show collections
```

---

## User Collection Commands

### **View All Users**
```javascript
db.users.find()
```

### **View All Users (Pretty/Formatted)**
```javascript
db.users.find().pretty()
```

### **Count Total Users**
```javascript
db.users.countDocuments()
```

### **Find User by Email**
```javascript
db.users.findOne({ email: "patient@gmail.com" })
```

### **Find Users by Role**
```javascript
// Find all patients
db.users.find({ role: "patient" }).pretty()

// Find all doctors
db.users.find({ role: "doctor" }).pretty()

// Find all admins
db.users.find({ role: "admin" }).pretty()
```

### **Find User by ID**
```javascript
db.users.findOne({ _id: ObjectId("your_user_id_here") })
```

### **Search Users by Name**
```javascript
db.users.find({ name: /John/i }).pretty()  // Case-insensitive search
```

### **View Specific Fields Only**
```javascript
// View only name and email
db.users.find({}, { name: 1, email: 1, role: 1 }).pretty()

// Exclude password from results
db.users.find({}, { password: 0 }).pretty()
```

### **Sort Users**
```javascript
// Sort by name (ascending)
db.users.find().sort({ name: 1 }).pretty()

// Sort by createdAt (newest first)
db.users.find().sort({ createdAt: -1 }).pretty()
```

### **Limit Results**
```javascript
// Get first 5 users
db.users.find().limit(5).pretty()

// Skip first 2, get next 5
db.users.find().skip(2).limit(5).pretty()
```

---

## 📅 Appointment Collection Commands

### **View All Appointments**
```javascript
db.appointments.find().pretty()
```

### **Count Appointments**
```javascript
db.appointments.countDocuments()
```

### **Find Appointments by Status**
```javascript
// Find pending appointments
db.appointments.find({ status: "Pending" }).pretty()

// Find confirmed appointments
db.appointments.find({ status: "Confirmed" }).pretty()

// Find completed appointments
db.appointments.find({ status: "Completed" }).pretty()
```

### **Find Appointments by Date Range**
```javascript
// Find appointments after a specific date
db.appointments.find({ 
  date: { $gte: new Date("2024-01-01") } 
}).pretty()

// Find appointments between dates
db.appointments.find({ 
  date: { 
    $gte: new Date("2024-01-01"), 
    $lte: new Date("2024-12-31") 
  } 
}).pretty()
```

### **Find Appointments by Patient ID**
```javascript
db.appointments.find({ 
  patientId: ObjectId("patient_id_here") 
}).pretty()
```

### **Find Appointments by Doctor ID**
```javascript
db.appointments.find({ 
  doctorId: ObjectId("doctor_id_here") 
}).pretty()
```

### **Populate References (Join)**
```javascript
// This requires aggregation - see advanced section
```

---

## ✏️ Insert/Update/Delete Commands

### **Insert a Test User**
```javascript
db.users.insertOne({
  name: "Test Doctor",
  email: "doctor@gmail.com",
  password: "$2b$10$hashedpasswordhere", // Use bcrypt in app
  role: "doctor",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### **Update User**
```javascript
// Update user name
db.users.updateOne(
  { email: "patient@gmail.com" },
  { $set: { name: "Updated Name" } }
)

// Update user role
db.users.updateOne(
  { email: "patient@gmail.com" },
  { $set: { role: "doctor" } }
)
```

### **Delete User**
```javascript
// Delete user by email
db.users.deleteOne({ email: "test@gmail.com" })

// Delete all users (BE CAREFUL!)
// db.users.deleteMany({})
```

### **Delete Appointment**
```javascript
db.appointments.deleteOne({ _id: ObjectId("appointment_id") })
```

---

## 🔍 Advanced Query Commands

### **Aggregation - Get Appointments with User Details**
```javascript
db.appointments.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "patientId",
      foreignField: "_id",
      as: "patient"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "doctorId",
      foreignField: "_id",
      as: "doctor"
    }
  },
  {
    $unwind: "$patient"
  },
  {
    $unwind: "$doctor"
  },
  {
    $project: {
      date: 1,
      timeSlot: 1,
      status: 1,
      "patient.name": 1,
      "patient.email": 1,
      "doctor.name": 1,
      "doctor.email": 1
    }
  }
]).pretty()
```

### **Count Appointments by Status**
```javascript
db.appointments.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])
```

### **Find Users with Appointment Count**
```javascript
db.users.aggregate([
  {
    $lookup: {
      from: "appointments",
      localField: "_id",
      foreignField: "patientId",
      as: "appointments"
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      role: 1,
      appointmentCount: { $size: "$appointments" }
    }
  }
]).pretty()
```

---

## 🧹 Database Maintenance Commands

### **Drop Collection (Delete All Data)**
```javascript
// BE CAREFUL - This deletes all data!
db.users.drop()
db.appointments.drop()
```

### **Drop Database**
```javascript
// BE CAREFUL - This deletes entire database!
use curelink
db.dropDatabase()
```

### **Create Indexes (for better performance)**
```javascript
// Create index on email (already unique in schema)
db.users.createIndex({ email: 1 }, { unique: true })

// Create index on patientId
db.appointments.createIndex({ patientId: 1 })

// Create index on doctorId
db.appointments.createIndex({ doctorId: 1 })

// Create index on date
db.appointments.createIndex({ date: 1 })
```

### **View Indexes**
```javascript
db.users.getIndexes()
db.appointments.getIndexes()
```

---

## 📈 Statistics Commands

### **Database Stats**
```javascript
db.stats()
```

### **Collection Stats**
```javascript
db.users.stats()
db.appointments.stats()
```

### **Get Collection Size**
```javascript
db.users.dataSize()
db.appointments.dataSize()
```

---

## Useful Queries for Your App

### **Find All Patients**
```javascript
db.users.find({ role: "patient" }, { name: 1, email: 1, _id: 1 }).pretty()
```

### **Find All Doctors**
```javascript
db.users.find({ role: "doctor" }, { name: 1, email: 1, _id: 1 }).pretty()
```

### **Get Today's Appointments**
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

db.appointments.find({
  date: { $gte: today, $lt: tomorrow }
}).pretty()
```

### **Get Upcoming Appointments**
```javascript
db.appointments.find({
  date: { $gte: new Date() },
  status: { $ne: "Completed" }
}).sort({ date: 1 }).pretty()
```

### **Count Users by Role**
```javascript
db.users.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 }
    }
  }
])
```

---

## 💡 Quick Reference

| Command | Description |
|---------|-------------|
| `show dbs` | List all databases |
| `use curelink` | Switch to curelink database |
| `show collections` | List all collections |
| `db.users.find()` | View all users |
| `db.users.find().pretty()` | View all users (formatted) |
| `db.users.countDocuments()` | Count users |
| `db.users.findOne({ email: "..." })` | Find one user |
| `db.appointments.find().pretty()` | View all appointments |
| `db.users.drop()` | Delete users collection |
| `db.dropDatabase()` | Delete entire database |

---

## Important Notes

1. **Always use `.pretty()`** for readable output
2. **Be careful with delete commands** - they're permanent!
3. **Use ObjectId()** when querying by ID
4. **Passwords are hashed** - you won't see plain text passwords
5. **Dates are stored as ISODate** - use `new Date()` for queries

---

## 🎯 Example Workflow

```javascript
// 1. Connect to database
use curelink

// 2. View all users
db.users.find().pretty()

// 3. Find a specific user
db.users.findOne({ email: "patient@gmail.com" })

// 4. View their appointments
db.appointments.find({ 
  patientId: ObjectId("user_id_from_step_3") 
}).pretty()

// 5. Count appointments by status
db.appointments.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```
