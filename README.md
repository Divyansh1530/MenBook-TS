# MenBook 🎓

> **A full-stack 1-on-1 mentorship booking platform built with React, Node.js, Express, and MongoDB. Features automated slot generation, Role-Based Access Control (RBAC), Razorpay payments, and automated meeting link generation.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=flat&logo=razorpay&logoColor=3395FF)](https://razorpay.com/)


<img width="1905" height="1078" alt="image" src="https://github.com/user-attachments/assets/4fcd2301-ed54-464b-84de-ba4039538af7" />


## 🌟 What is MenBook?

**MenBook** connects learners with mentors (developers, designers, therapists, founders) for paid 1-on-1 sessions.

Instead of manual back-and-forth messaging to find a suitable time:
1. Mentors define their weekly available hours, meeting duration, and break time (buffer) between sessions.
2. The platform automatically calculates available slots for learners.
3. Learners choose a date, pick an open slot, and pay via Razorpay.
4. Once paid, the system **automatically creates and attaches a meeting link** (`meet.jit.si`) directly on both dashboards.

---

## ✨ Key Features

### 👤 For Learners (Mentees)
* **Search & Filter Mentors**: Search by name, title, bio, or skills with a 500ms debounced search bar, category chips, and price/rating filters.
* **Live Slot Selection**: Pick any date across the next 7 days to see real-time open slots (past slots and booked slots are hidden automatically).
* **Razorpay Checkout**: Seamless payment flow with a built-in test-card helper modal for quick testing.
* **Automated Meeting Link**: Upon payment confirmation, an instant meeting room URL is generated so both parties have a direct link to join.
* **Learner Dashboard**: View upcoming, completed, and cancelled bookings with quick meeting link access.
* **Reviews & Ratings**: Leave a 1- to 5-star review with comments after a session ends (with options to edit or delete).

### 💼 For Mentors
* **Weekly Availability Setup**: Configure available time windows per weekday (start time, end time, session duration, and buffer time between calls).
* **Live Slot Preview Badge**: Displays exactly how many bookable slots will be created based on current duration and buffer settings.
* **Schedule Overlap Check**: Backend prevents mentors from adding overlapping time windows on the same day.
* **Mentor Dashboard**: View total earnings, upcoming sessions, completed calls, and total unique students taught.
* **Session Controls**: Mark sessions as completed or cancel upcoming sessions if needed.
* **Profile Setup**: Add bio, hourly price, years of experience, skill tags, LinkedIn, and portfolio link.

### 🔒 Security & Auth
* **Dual-Token Authentication**: Short-lived JWT Access Token + long-lived Refresh Token stored in secure, `httpOnly` cookies.
* **Google OAuth 2.0 Login**: Sign in with Google with automatic role preservation (`state: signup:mentor` vs `state: signup:user`).
* **Profile Photo Upload**: Upload avatars with automatic storage and delivery using Cloudinary.

---

## 💻 Tech Stack

| Layer | Tools & Libraries |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide React, Sonner, Axios |
| **Backend** | Node.js, Express 5, TypeScript, Mongoose 9, tsx |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (Dual Access/Refresh Tokens), Passport.js Google OAuth 2.0, bcrypt |
| **Payments** | Razorpay SDK (Order creation & HMAC-SHA256 signature verification) |
| **Media Uploads**| Cloudinary SDK, Multer |
| **Email & Links** | Nodemailer (Gmail SMTP), Jitsi Meet room links |

---

## 🗄️ Database Models

* **User**: Name, email, password, avatar, role (`user` / `mentor`), timezone, refresh token, and an embedded `mentorProfile` (title, bio, expertise, price, rating, experience, links).
* **Availability**: Mentor schedule rules per day (`dayOfWeek: 0-6`), `startTime`, `endTime`, `slotDuration`, and `bufferTime` in minutes.
* **Booking**: Session details (`userId`, `mentorId`, `startTime`, `endTime`, `amount`, `status`, `paymentStatus`, `meetingLink`, `expiresAt`). Has a compound unique index on `{ mentorId, startTime }`.
* **Payment**: Payment records (`bookingId`, `orderId`, `paymentId`, `amount`, `status`, `signature`).
* **Review**: Ratings (1 to 5) and feedback comments, with a unique index on `bookingId` so each session can only be reviewed once.

---

## 📁 Project Directory Structure

```text
MenBook-TS/
├── backend/
│   ├── src/
│   │   ├── config/passport.ts         # Google OAuth strategy with role state
│   │   ├── controllers/               # Route logic (availability, booking, payment, user, etc.)
│   │   ├── db/index.ts                # MongoDB connection
│   │   ├── middlewares/               # JWT verification (RBAC) & Multer
│   │   ├── models/                    # Mongoose schemas (User, Booking, Availability, Payment, Review)
│   │   ├── routes/                    # Express route definitions
│   │   ├── templates/email.ts         # Email notification templates
│   │   ├── types/                     # Backend TypeScript types
│   │   ├── utils/                     # Slot generator, Cloudinary, Razorpay, ApiError, ApiResponse
│   │   ├── app.ts                     # Express app setup
│   │   └── index.ts                   # Server start
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/axios.ts               # Axios instance with credentials
    │   ├── components/                # UserDashboard, MentorDashboard, NavBar, Footer, Skeletons
    │   ├── pages/                     # BrowseMentors, Mentors (details & booking), Availability, etc.
    │   ├── types/                     # Frontend TypeScript types
    │   ├── App.tsx                    # Route definitions and global user state
    │   └── main.tsx                   # React entrypoint
    ├── package.json
    └── vite.config.ts
```

---

## 📡 API Endpoints Reference

### 🔐 Users & Auth (`/api/v1/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register new user or mentor with avatar | Public |
| `POST` | `/login` | Log in and receive httpOnly cookies | Public |
| `POST` | `/logout` | Log out and clear cookies | Logged-in |
| `GET` | `/current-user` | Get current logged-in user profile | Logged-in |
| `PATCH` | `/update-details` | Update profile information | Logged-in |
| `PATCH` | `/update-avatar` | Upload new profile photo to Cloudinary | Logged-in |
| `PATCH` | `/change-password` | Update current password | Logged-in |
| `GET` | `/auth/google` | Google OAuth login/signup redirect | Public |
| `GET` | `/auth/google/callback`| Google OAuth callback handler | Public |
| `GET` | `/mentors` | Search & filter mentors with pagination | Public |
| `GET` | `/mentors/:id` | Get single mentor profile details | Public |

### 📅 Availability (`/api/v1/availability`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/create` | Create a recurring weekly availability rule | Mentor only |
| `GET` | `/mentor` | Get current mentor's availability rules | Mentor only |
| `PATCH` | `/:availabilityId` | Update an existing schedule rule | Mentor only |
| `DELETE`| `/:availabilityId` | Delete an availability rule | Mentor only |
| `GET` | `/slots/:mentorId` | Get open slots for a date (`?date=YYYY-MM-DD`) | Logged-in |

### 🎟️ Bookings (`/api/v1/booking`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/create` | Start booking a slot (starts 10-min hold) | Learner only |
| `GET` | `/user-bookings` | Get mentee's bookings and reviews | Learner only |
| `GET` | `/mentor-bookings`| Get mentor's upcoming and past sessions | Mentor only |
| `PATCH` | `/:bookingId/cancel`| Cancel a booking | User/Mentor |

### 💳 Payments (`/api/v1/payment`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/create-order` | Create a Razorpay order for pending booking | Learner only |
| `POST` | `/verify-payment` | Verify HMAC signature, confirm slot & make link | Learner only |

### ⭐ Reviews (`/api/v1/review`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/create` | Review a completed session (1 to 5 stars) | Learner only |
| `GET` | `/mentors/:mentorId` | Get all reviews for a mentor | Public |
| `PATCH` | `/:reviewId` | Edit rating or comment | Review owner |
| `DELETE`| `/:reviewId` | Delete a review | Review owner |

---

## 🚀 Getting Started & Local Setup

### Prerequisites
Make sure you have:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (local instance or a free MongoDB Atlas connection string)
* A free [Razorpay](https://razorpay.com/) test account
* A [Cloudinary](https://cloudinary.com/) account for avatar uploads
* *(Optional)* Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/Divyansh1530/MenBook-TS.git
cd MenBook-TS
```

---

### 2. Backend Setup

1. Open the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your values to `.env`:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173

   ACCESS_TOKEN_SECRET=your_jwt_access_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   CALLBACK_URL=http://localhost:8000/api/v1/users/auth/google/callback

   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

5. Start the backend:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:8000`.*

---

### 3. Frontend Setup

1. Open a new terminal and go to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your values to `.env`:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. Start the frontend:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:5173`.*

---

### 4. Running the App

1. Open `http://localhost:5173` in your browser.
2. Sign up as a **Mentor**, complete your profile (bio, pricing, skills), and go to **Availability** to add your working hours.
3. Open an incognito window, sign up as a **User / Learner**, browse mentors, select a time slot, and test booking with Razorpay sandbox cards.

---

## 💳 Testing Payments (Razorpay Sandbox)

The app comes with a built-in helper modal for test payments. When booking a session, use these Razorpay test card credentials:

| Field | Test Value |
|---|---|
| **Card Number** | `6527 6589 0000 1005` or `4111 1111 1111 1111` |
| **Expiry Date** | Any future date (e.g. `12/28`) |
| **CVV** | Any 3 digits (e.g. `123`) |
| **Name** | Any name (e.g. `John Doe`) |
| **OTP** | `123456` |

*No actual money is charged in test mode.*

---

## 👨‍💻 Author & License

* **Developer**: [Divyansh](https://github.com/Divyansh1530)
* **License**: This project is licensed under the [ISC License](LICENSE).
