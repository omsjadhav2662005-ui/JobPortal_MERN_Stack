# 💼 JobPortal — MERN Stack

A full-stack Job Portal web application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). The platform supports two user roles — **Job Seekers** and **Employers** — with features including job listings, applications, company profiles, real-time messaging, professional networking, notifications, and user profile pages.

> 🎓 Final Year Project · Built with MERN Stack · 2025

---

## 🚀 Features

### 👤 Authentication & Roles
- Multi-step registration (Role → Details → Password)
- JWT-based login with 30-day token
- Two roles: **Job Seeker** and **Employer**
- Show / hide password toggle on all auth forms
- Live password strength meter on signup
- Logout confirmation modal (prevents accidental logout)
- Route protection based on role (`PrivateRoute`, `EmployerRoute`)
- Change password from dashboard
- Rate limiting on login/register (20 requests per 15 min)

### 🧑‍💼 Job Seeker
- Browse, search, and filter job listings (type, category, experience level, salary, location)
- View detailed job descriptions (requirements, responsibilities, skills, salary range, deadline)
- Apply for jobs with resume upload + cover note
- Track application status (Applied → Shortlisted → Interview → Hired / Rejected)
- Withdraw applications
- Save jobs for later
- View similar / recommended jobs

### 🏢 Employer
- Post new job listings with full details (category, experience level, type, salary range, deadline)
- Manage posted jobs (edit / toggle active / delete)
- Review applicants and update their status
- Set interview date and add employer notes per applicant
- Company profile management

### 👥 Network
- Browse all professionals on the Network page
- Search by name, headline, or skill
- Send and respond to connection requests
- Remove existing connections
- **View Profile** button on every user card → opens full profile page
- Filter view: Everyone / Connected

### 👤 User Profile Page (`/profile/:id`)
- Public profile with cover image and avatar
- Tabbed sections: About, Experience, Education, Skills, Certifications
- Connect / Remove Connection / Accept Request / Message buttons
- Social links (LinkedIn, GitHub, Twitter, Portfolio)
- "Edit Profile" shortcut for own profile

### 💬 Messaging (Inbox)
- Conversations auto-refresh every **3 seconds** (no page refresh needed)
- Unread message badge on conversation list
- Read receipts (single/double tick)
- Click user name or "View Profile" in chat header → opens profile page
- Mark messages as read on open

### 🔔 Notifications
- Notification bell auto-refreshes every **5 seconds**
- Automatic notification when someone sends you a message (even when not on Inbox page)
- Spam guard — one unread message notification per sender at a time
- Notifications for: connections, applications, messages, jobs
- Mark individual or all notifications as read
- Click notification → navigates to relevant page

### 🏙️ Company Profiles
- Browse all companies with cover image and logo overlay (fixed overlap)
- View company detail page with jobs, ratings, reviews, benefits
- Employers can update their company profile
- Leave anonymous or named reviews with rating, pros, cons

### 🛡️ Security
- `helmet` for HTTP security headers
- `express-mongo-sanitize` for NoSQL injection protection
- `bcryptjs` for password hashing (salt rounds: 12)
- JWT for stateless session management
- CORS restricted to frontend origin
- Rate limiting on auth routes

---

## 🛠️ Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Node.js + Express.js | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| multer | File uploads (resume, profile picture) |
| helmet | HTTP security headers |
| express-rate-limit | Rate limiting on auth routes |
| express-mongo-sanitize | NoSQL injection prevention |
| dotenv | Environment variable management |
| cors | Cross-Origin Resource Sharing |
| nodemon *(dev)* | Auto-restart on file changes |

### Frontend
| Package | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP requests to backend API |
| Tailwind CSS | Utility-first CSS styling |
| Font Awesome | Icons |
| React Context API | Auth state & global data state |

---

## 📁 Project Structure

```
JobPortal_MERN_Stack/
├── backend/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Register, login, profile, change password
│   │   ├── userController.js         # Profile update, connections, notifications
│   │   ├── jobController.js          # CRUD jobs, similar jobs
│   │   ├── applicationController.js  # Apply, withdraw, status update
│   │   ├── companyController.js      # List, view, update companies
│   │   ├── conversationController.js # Messaging, inbox, message notifications
│   │   └── uploadController.js       # File upload handling
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT protect middleware
│   │   └── errorMiddleware.js        # Global error handler
│   ├── models/
│   │   ├── User.js                   # User schema (seeker / employer / admin)
│   │   ├── Job.js                    # Job schema with full-text index
│   │   ├── Application.js            # Application schema with status history
│   │   ├── Company.js                # Company schema with reviews
│   │   └── Conversation.js           # Conversation + embedded messages schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   ├── fileUpload.js             # Multer config (images + PDF/DOC)
│   │   └── generateToken.js          # JWT token generator
│   ├── seeder.js                     # DB seed / destroy script
│   ├── server.js                     # App entry point
│   └── .env                          # Environment variables (not committed)
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Navbar.jsx             # Sticky navbar with logout confirmation modal
        │   ├── NotificationBell.jsx   # Auto-polling notification bell
        │   ├── JobCard.jsx
        │   ├── CompanyCard.jsx
        │   ├── UserCard.jsx
        │   ├── ConversationItem.jsx
        │   ├── ApplicationItem.jsx
        │   ├── RecommendedJob.jsx
        │   ├── SocialLinks.jsx
        │   ├── Modal.jsx
        │   └── Modals/
        │       ├── ChatModal.jsx
        │       ├── EntryModal.jsx
        │       ├── HeadlineModal.jsx
        │       ├── ReviewModal.jsx
        │       ├── SkillModal.jsx
        │       ├── SocialModal.jsx
        │       └── CertModal.jsx
        ├── context/
        │   ├── AuthContext.jsx        # Auth state + 5s notification polling
        │   └── DataContext.jsx        # Global data + 3s conversation polling
        ├── hooks/
        │   └── useLocalStorage.js
        ├── pages/
        │   ├── Home.jsx               # Job listings & search
        │   ├── JobDetail.jsx          # Single job page + apply
        │   ├── Dashboard.jsx          # User dashboard
        │   ├── PostJob.jsx            # Employer: post / edit job
        │   ├── Companies.jsx          # Browse companies
        │   ├── CompanyDetail.jsx      # Company profile + jobs + reviews
        │   ├── Network.jsx            # Browse & connect with users
        │   ├── UserProfile.jsx        # Public user profile page
        │   ├── Inbox.jsx              # Messaging / conversations
        │   ├── SignIn.jsx             # Login with show/hide password
        │   └── SignUp.jsx             # Multi-step registration
        ├── utils/
        │   ├── constants.js
        │   └── helpers.js
        ├── api.js                     # Axios instance with interceptors
        ├── App.jsx                    # Root component with all routes
        └── main.jsx                   # React entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/omsjadhav2662005-ui/JobPortal_mern_stack.git
cd JobPortal_mern_stack
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal-mern
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

Start the backend server:

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

Backend runs at: **http://localhost:5000**

---

### 3. Seed the Database *(Optional)*

```bash
# Import sample jobs, companies, and users
npm run data:import

# Remove all seeded data
npm run data:destroy
```

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/profile` | 🔒 JWT | Get logged-in user profile |
| PUT | `/change-password` | 🔒 JWT | Change password |

### Users — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all users (Network page) |
| GET | `/:id` | 🔒 JWT | Get user profile by ID |
| PUT | `/profile` | 🔒 JWT | Update own profile |
| POST | `/:id/connect` | 🔒 JWT | Send connection request |
| PUT | `/connections/:fromId/respond` | 🔒 JWT | Accept or reject connection |
| DELETE | `/connections/:id` | 🔒 JWT | Remove connection |
| POST | `/notification` | 🔒 JWT | Add a notification |
| PUT | `/notification/:id/read` | 🔒 JWT | Mark notification as read |

### Jobs — `/api/jobs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List jobs (search + filters + pagination) |
| POST | `/` | 🔒 JWT | Post a new job |
| GET | `/myjobs` | 🔒 JWT | Employer's posted jobs |
| GET | `/:id` | Public | Get single job |
| GET | `/:id/similar` | Public | Get similar jobs |
| PUT | `/:id` | 🔒 JWT | Update job |
| DELETE | `/:id` | 🔒 JWT | Delete job |

### Applications — `/api/applications`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | 🔒 JWT | Apply to a job |
| GET | `/my` | 🔒 JWT | Get own applications |
| GET | `/job/:jobId` | 🔒 JWT | Get all applications for a job |
| PUT | `/:id/status` | 🔒 JWT | Update application status |
| DELETE | `/:id` | 🔒 JWT | Withdraw application |

### Companies — `/api/companies`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all companies |
| GET | `/:name` | Public | Get company by name |
| PUT | `/:name` | 🔒 JWT | Update company / add review |

### Conversations — `/api/conversations`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | 🔒 JWT | Get all conversations |
| POST | `/` | 🔒 JWT | Get or create a conversation |
| POST | `/:id/messages` | 🔒 JWT | Send a message |
| PUT | `/:id/read` | 🔒 JWT | Mark messages as read |

### Upload — `/api/upload`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/profile-pic` | 🔒 JWT | Upload profile picture |
| POST | `/resume` | 🔒 JWT | Upload resume (PDF/DOC) |

---

## 🗂️ Frontend Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home — job listings & search | Public |
| `/job/:id` | Job detail + apply | Public |
| `/companies` | Browse companies | Public |
| `/company/:name` | Company profile | Public |
| `/network` | Browse & connect with users | Public |
| `/profile/:id` | User public profile | Public |
| `/signin` | Sign in | Public |
| `/signup` | Multi-step sign up | Public |
| `/dashboard` | User dashboard | 🔒 Logged in |
| `/inbox` | Messaging / inbox | 🔒 Logged in |
| `/postjob` | Post or edit a job | 🔒 Employer only |

---

## 🌍 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jobportal-mern` |
| `JWT_SECRET` | Secret key for JWT signing | *(use a long random string)* |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

---

## 🧪 Demo Accounts

After running `npm run data:import` the following test accounts are available:

| Role | Email | Password |
|---|---|---|
| Employer | alice@jobportal.com | alice123 |
| Job Seeker | bob@jobportal.com | bob123 |

These are also shown as quick-fill buttons on the Sign In page.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Oms Jadhav**  
GitHub: [@omsjadhav2662005-ui](https://github.com/omsjadhav2662005-ui)

---

> Built with ❤️ using the MERN Stack · Final Year Project © 2025