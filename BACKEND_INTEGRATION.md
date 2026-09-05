# ThinkAHead Learning Hub — Backend Integration

This project now contains a separate `backend/` Node.js + Express + MongoDB API. The existing React/Tailwind UI and visual components are preserved; frontend state/actions that represent persistent data now use REST APIs and JWT authentication.

## Frontend inventory

### Public / landing
- Landing page with hero CTAs, program catalog, learning journey, pricing/membership, certificate preview, testimonials, FAQ and contact sections.
- Navbar/mobile menu: Home, About, Programs, Learning Journey, Membership, Certificate, Resources, FAQ, Testimonials, Contact, Login, Register.
- Footer navigation and newsletter form.
- Contact form: name, email, message.
- Newsletter form: email.
- Certificate preview opens certificate modal.
- Membership CTA opens checkout modal.
- Program cards route a learner into registration/course access.

### Authentication
- Register: full name, email, phone, password, confirm password, terms checkbox.
- Login: email, password, remember-me checkbox.
- Google button remains visually unchanged; backend exposes `/api/auth/google` but intentionally returns a clear not-configured response until real Google OAuth credentials are supplied.
- Forgot password: email.
- Verification screen: resend and proceed to reset.
- Reset password: new password + confirmation.
- JWT access token is stored in `localStorage` under `tah_access_token`; user profile remains cached under `ihcdr_user` for fast UI startup.
- On startup the React app validates the JWT through `/api/auth/me` and redirects by role.

### Student portal
- Dashboard
- My Learning
- All Courses
- Fullscreen Course Player
- Certificates
- Subscription
- Live Sessions
- Community
- Messages
- Progress / Profile / Settings
- Resources / Help
- Achievements
- Notifications

Persistent student actions:
- Enroll in a course.
- Lesson completion.
- Lesson notes.
- Assignment submission.
- Quiz submission and server-side scoring.
- Course completion.
- Certificate lookup/master certificate generation.
- Annual membership checkout.
- Subscription month-unlock simulator retained for the existing UI.
- Live-session registration.
- Community post/reply/like.
- Chat messages.
- Notification read/read-all.
- Certificate viewing.
- Search state retained in the existing student header.

### Admin portal
- Dashboard
- Students
- Courses
- Assignments
- Subscriptions/payments
- Certificates
- Notifications/broadcast
- Analytics
- Settings
- Existing Videos/Resources navigation continues to the settings screen as in the original UI.

Admin persistence/API actions:
- Student directory/search.
- Assignment queue and grading.
- Payment status updates.
- Certificate search.
- Broadcast notifications.
- Course listing and course create/update API.
- Analytics aggregation.
- Portal settings endpoint.

## Data model

- `User`: identity, role, password hash, verification state, enrollment, completion, subscription and learner statistics.
- `Course`: the 22 existing course records, modules, lessons, resources, assignments, quiz questions and outcomes.
- `Progress`: per-user/per-course lesson progress, notes, assignment submissions and quiz result.
- `Certificate`: individual/master certificates and verification metadata.
- `LiveSession`: upcoming/recorded sessions and registrations.
- `ForumPost`: community posts, replies and per-user likes.
- `ChatThread`: learner support/mentor conversations and messages.
- `Notification`: user-scoped notifications and read state.
- `Payment`: membership transaction ledger and status.
- `Achievement`: achievement catalog.
- `Content`: FAQ/testimonial content.
- `Contact`: landing-page contact messages.
- `Newsletter`: newsletter subscribers.

## REST API

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-email`
- `POST /api/auth/google`

### Public
- `GET /api/public/bootstrap`
- `GET /api/public/courses`
- `GET /api/public/courses/:id`
- `GET /api/public/verify/:certificateNumber`
- `POST /api/public/contact`
- `POST /api/public/newsletter`

### Student (JWT required)
- `GET /api/student/bootstrap`
- `GET /api/student/me`
- `POST /api/student/enroll/:courseId`
- `POST /api/student/progress/:courseId/lesson/:lessonId/complete`
- `PATCH /api/student/progress/:courseId/note/:lessonId`
- `POST /api/student/progress/:courseId/assignments/:assignmentId`
- `POST /api/student/progress/:courseId/quiz`
- `POST /api/student/progress/:courseId/complete`
- `GET /api/student/certificates`
- `GET /api/student/certificates/master`
- `POST /api/student/subscription/checkout`
- `POST /api/student/subscription/unlock-month`
- `POST /api/student/live-sessions/:id/register`
- `POST /api/student/community/posts`
- `POST /api/student/community/posts/:id/replies`
- `POST /api/student/community/posts/:id/like`
- `POST /api/student/chat/:threadId/messages`
- `PATCH /api/student/notifications/:id/read`
- `POST /api/student/notifications/read-all`

### Admin (JWT + admin role required)
- `GET /api/admin/dashboard`
- `GET /api/admin/students`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PATCH /api/admin/courses/:id`
- `GET /api/admin/assignments`
- `PATCH /api/admin/assignments/:progressId/:assignmentId/grade`
- `GET /api/admin/payments`
- `PATCH /api/admin/payments/:id`
- `GET /api/admin/certificates`
- `POST /api/admin/notifications/broadcast`
- `GET /api/admin/analytics`
- `GET /api/admin/settings`
- `PATCH /api/admin/settings`

## Validation / security
- Passwords are hashed with bcrypt.
- JWTs are signed with `JWT_SECRET`.
- Role authorization prevents student access to admin routes.
- MongoDB validation and application-level validation are enabled.
- Helmet, CORS and API rate limiting are enabled.
- Centralized 404/error handling is enabled.
- Server-side quiz scoring prevents the browser from deciding whether a quiz passed.
- Course enrollment/unlock checks run on the server.
- Assignment grading is admin-only.
- Payment status changes are admin-only.
- Reset tokens are hashed before storage and expire.
- Development reset tokens are returned only outside production so the current UI can complete its reset flow without an email service. Production should connect this endpoint to an email provider.
- The checkout endpoint intentionally represents the existing UI's simulated ₹1,000 membership flow. It is not a live Razorpay transaction gateway.

## Seed/demo accounts

Run the backend seed script to create the initial database.

- Student: `student@ihcdr.org` / `student123`
- Admin: `admin@ihcdr.org` / `admin123`

The seed imports the existing 22-course dataset and existing mock portal content into MongoDB. It also creates demo progress, certificates, assignments, payments, community posts, chat threads and notifications.

## Run

### Backend
1. Copy `backend/.env.example` to `backend/.env`.
2. Start MongoDB.
3. Install backend dependencies: `cd backend && npm install`.
4. Seed: `npm run seed`.
5. Start: `npm run dev` or `npm start`.

Default API: `http://localhost:5000/api`.

### Frontend
Set `VITE_API_URL=http://localhost:5000/api` in the frontend environment if the default is not suitable, then run the existing Vite app.

No UI redesign was introduced as part of this integration.

## Student Dashboard Critical Fixes

- Dashboard identity, enrolled-course count, overall progress, certificate count, hours and badges are sourced from authenticated MongoDB bootstrap data rather than hardcoded learner values.
- Master certificate access is locked server-side until every course in MongoDB has a 100% completed progress record. The certificate is created only after eligibility is confirmed.
- Course-level certificate creation was removed from the student quiz flow so partial completion cannot expose a certificate.
- Seed data no longer creates a certificate for the demo learner. The demo learner starts with partial progress, so the master certificate remains locked.
- Handbook/resources are hidden unless a resource has `published: true`. Admin REST endpoints are available for creating/publishing course resources.
- Profile and Settings are separate views and separate backend PATCH endpoints.
- Logout now requires explicit confirmation.
- Student-header search provides live course results from backend-loaded course data. Notification/profile menus close on outside click.
- Messages safely handle an empty backend thread list and send messages only to authorized threads.
- Annual membership uses a Razorpay hosted checkout flow. Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`; payment activation happens only after server-side signature verification.

### Razorpay setup

Copy `backend/.env.example` to `backend/.env` and provide Razorpay test or live credentials. Do not put the Razorpay secret in the React `.env` file.
