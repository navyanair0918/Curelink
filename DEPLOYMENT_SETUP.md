# Deployment Setup Guide - MongoDB Atlas, Render, and Vercel

## Step 1: MongoDB Atlas Configuration

1. **Get Your Connection String:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Log in to your account
   - Click on "Databases" → Select your cluster
   - Click "Connect" button
   - Select "Drivers" (Node.js)
   - Copy the connection string (should look like: `mongodb+srv://username:password@cluster.mongodb.net/curelink?retryWrites=true&w=majority`)

2. **Connection String Format:**
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/curelink?retryWrites=true&w=majority
   ```

---

## Step 2: Render Backend Deployment

### 2.1 Update Backend .env Variables

In your Render dashboard, set the following environment variables:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/curelink?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=5000
NODE_ENV=production
```

**Replace:**
- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password
- `<cluster-name>` - Your cluster name
- `https://your-vercel-app.vercel.app` - Your actual Vercel domain

### 2.2 Render Deployment Steps

1. Push your backend code to GitHub
2. Go to [Render](https://render.com/)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `node server.js`)
   - **Environment:** Node
   - Add all environment variables from step 2.1

---

## Step 3: Vercel Frontend Deployment

### 3.1 Create .env Files

Create these two files in `frontend/my-app/`:

**`.env.production`**
```
VITE_API_URL=https://curelink-1ukh.onrender.com/api
```

**`.env.development`**
```
VITE_API_URL=http://localhost:5000/api
```

### 3.2 Update Vercel Environment Variables

1. Go to your Vercel project settings
2. Add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://curelink-1ukh.onrender.com/api`

### 3.3 Deploy to Vercel

```bash
cd frontend/my-app
npm install
npm run build
# Then push to GitHub and Vercel will auto-deploy
```

---

## Step 4: Common Login Issues & Solutions

### Issue 1: "Network error. Check your connection and backend URL."

**Solutions:**
1. Verify the backend URL is correct in `.env.production`
2. Check if Render backend is running (visit https://curelink-1ukh.onrender.com/ in browser)
3. Ensure MongoDB Atlas connection string has the correct credentials
4. Check Render logs for any errors

### Issue 2: "CORS Error" or No Response

**Solutions:**
1. Verify `FRONTEND_URL` environment variable is set on Render
2. Make sure it includes the exact Vercel domain (e.g., `https://yourapp.vercel.app`)
3. Restart the Render backend after updating environment variables

### Issue 3: "MongoDB Connection Error"

**Solutions:**
1. Verify `MONGODB_URI` is set correctly on Render
2. Add your Render server IP to MongoDB Atlas IP Whitelist:
   - MongoDB Atlas → Security → Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (allows all IPs - not ideal for production, but works for testing)
   - Or use Render's static IP if available
3. Verify username and password are URL-encoded if they contain special characters

### Issue 4: Credentials Not Saving (Session Issues)

The updated `api.js` now includes `withCredentials: true` for cookie support if needed later.

---

## Step 5: Testing

### Local Testing (Before Deployment)

```bash
# Backend
cd backend
npm install
npm start

# Frontend (in another terminal)
cd frontend/my-app
npm install
npm run dev
```

Visit `http://localhost:5173` and try logging in with test credentials.

### Production Testing

1. Visit your Vercel deployed app
2. Try logging in with credentials:
   - **Patient:**
     - Email: (any registered patient email)
     - Password: (registered password)
   - **Admin:**
     - Email: `navyanair@gmail.com`
     - Password: `curelink`

---

## Step 6: Debugging

### Check Backend Logs on Render

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Look for connection errors

### Check Frontend Browser Console

1. Open Vercel app in browser
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Try logging in and check for error messages
5. Check "Network" tab to see API request details

### Monitor Network Requests

In browser DevTools Network tab, check:
- Request URL: Should be `https://curelink-1ukh.onrender.com/api/auth/login`
- Status Code: Should be 200 for success, 401 for invalid credentials
- Response: Should contain token and user data

---

## Step 7: File Checklist

Ensure these files are properly configured:

**Backend:**
- [ ] `backend/.env` - Has MONGODB_URI, JWT_SECRET, FRONTEND_URL
- [ ] `backend/server.js` - Has CORS configuration
- [ ] `backend/package.json` - Has all dependencies

**Frontend:**
- [ ] `frontend/my-app/.env.production` - Has correct backend URL
- [ ] `frontend/my-app/.env.development` - Has localhost backend URL
- [ ] `frontend/my-app/src/services/api.js` - Uses environment variables
- [ ] `frontend/my-app/src/Login.jsx` - Has proper error handling

---

## Useful Commands

```bash
# Test backend connectivity
curl https://curelink-1ukh.onrender.com/

# Test login endpoint (replace with real credentials)
curl -X POST https://curelink-1ukh.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"Test@123","role":"patient"}'
```

---

## Support

If you're still getting errors after following these steps:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas IP whitelist includes Render's IP
5. Clear browser cache and localStorage, then try again
