# Seed Doctors Script

This script will add 10 Indian doctors with specializations to your database.

## How to Run

1. Make sure your MongoDB is running
2. Make sure your `.env` file has the correct `MONGODB_URI` (or it will use the default)
3. Run the seed script:

```bash
cd backend
npm run seed-doctors
```

## Doctors Created

The script will create 10 doctors:

1. **Dr. Rajesh Kumar** - Cardiologist (MBBS, MD)
2. **Dr. Priya Sharma** - General Physician (MBBS, MD)
3. **Dr. Amit Patel** - Orthopedic Surgeon (MBBS, MS)
4. **Dr. Anjali Reddy** - Pediatrician (MBBS, MD)
5. **Dr. Vikram Singh** - Neurologist (MBBS, MD)
6. **Dr. Meera Nair** - Dermatologist (MBBS, MD)
7. **Dr. Suresh Iyer** - ENT Specialist (MBBS, MS)
8. **Dr. Kavita Desai** - Gynecologist (MBBS, MD)
9. **Dr. Ravi Menon** - Psychiatrist (MBBS, MD)
10. **Dr. Sunita Joshi** - Ophthalmologist (MBBS, MD)

## Default Password

All doctors will have the password: `Doctor@123`

## Notes

- The script will skip doctors that already exist (based on email)
- If you want to re-seed, you can manually delete doctors from the database first
- All doctors will be created with the role "doctor"
