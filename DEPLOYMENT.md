# 🚀 Production Deployment Guide

This guide details the step-by-step procedure to deploy the **University Question Bank Portal** across **MongoDB Atlas** (Database), **Azure App Service** (Backend API), and **Vercel** (Frontend Web Application).

---

## 1. 🗄 MongoDB Atlas Setup (Database)

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Free M0 or Shared Cluster).
3. Under **Database Access**, create a Database User with read/write privileges.
4. Under **Network Access**, add IP address `0.0.0.0/0` (Allow access from anywhere for Azure & cloud services).
5. Click **Connect** → **Drivers** and copy your MongoDB URI connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/question_bank?retryWrites=true&w=majority
   ```

---

## 2. ☁️ Azure App Service Deployment (Backend API)

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. Create a new **App Service** resource:
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS or Node 20 LTS
   - **Operating System**: Linux
3. Navigate to your App Service → **Configuration** → **Application settings** and add the following key-value pairs:
   - `PORT`: `5000` (or leave default `8080`)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `JWT_EXPIRE`: `7d`
   - `CLOUDINARY_CLOUD_NAME`: `your_cloudinary_cloud_name`
   - `CLOUDINARY_API_KEY`: `your_cloudinary_api_key`
   - `CLOUDINARY_API_SECRET`: `your_cloudinary_api_secret`
   - `CLIENT_URL`: `https://your-vercel-app.vercel.app`
4. Under **Deployment Center**, connect your GitHub Repository branch (`main` or `day-39`).
5. Save settings to trigger deployment. Your backend API will be live at `https://your-backend-app.azurewebsites.net/api`.

---

## 3. 🌐 Vercel Deployment (Frontend Web App)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project** and import your GitHub repository: `University-Question-Bank-Portal`.
3. Configure Project Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-app.azurewebsites.net/api`
5. Click **Deploy**. Vercel will build and assign your domain (`https://your-app.vercel.app`).

---

## ✅ Deployment Verification Checklist

- [x] Backend API responds at `GET /` with `{"success": true, "message": "University Question Bank API Running..."}`.
- [x] MongoDB Atlas database connects cleanly.
- [x] Auth endpoints (`/api/auth/register`, `/api/auth/login`) store cookies and issue JWTs.
- [x] Cloudinary PDF compression & upload functions properly.
- [x] Frontend SPA routes operate smoothly without 404 on refresh (`vercel.json` rewrite active).
