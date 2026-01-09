# Admin User Setup Guide

## 🚀 Create Admin User

To create the admin user with the credentials:
- **Email:** navyanair@gmail.com
- **Password:** curelink
- **Role:** admin

### Method 1: Using npm script (Recommended)

```bash
cd backend
npm run create-admin
```

### Method 2: Using Node directly

```bash
cd backend
node scripts/createAdmin.js
```

### Method 3: Using MongoDB Shell

```javascript
use curelink

// The password will be hashed automatically by the app
// But for manual creation, you need to hash it first
// Better to use the script above
```

---

## ✅ What the Script Does

1. Connects to MongoDB
2. Checks if admin already exists
3. Creates admin user if it doesn't exist
4. Updates password if admin exists but password is wrong
5. Ensures role is set to "admin"

---

## 🔐 Admin Login

1. Go to the login page
2. Select **"Admin"** from the role toggle
3. Enter:
   - Email: `navyanair@gmail.com`
   - Password: `curelink`
4. Click **"LOGIN"**
5. You'll be redirected to `/admin/dashboard`

---

## 📊 Admin Dashboard Features

Once logged in as admin, you can:

- **View Statistics:** Total users, patients, doctors, appointments
- **View All Users:** See all registered users
- **View All Patients:** See all patient details
- **View All Doctors:** See all doctor details
- **View All Appointments:** See all appointments with patient and doctor info

---

## 🛡️ Security

- Admin routes are protected - only users with `role: "admin"` can access
- Admin cannot be registered through the normal registration form
- Admin password is hashed using bcrypt

---

## 🔄 Re-run Script

You can safely re-run the script multiple times. It will:
- Update the password if it's incorrect
- Update the role if it's not "admin"
- Not create duplicate users
