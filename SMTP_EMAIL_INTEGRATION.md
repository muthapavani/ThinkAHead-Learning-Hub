# SMTP Email Integration – ThinkAHead Learning Hub

This update adds a reusable SMTP email service to the existing Node.js + Express + MongoDB backend. Razorpay/payment emails are intentionally not included.

## Added backend files

- `backend/src/utils/email.js` – shared Nodemailer SMTP transport, secure token/OTP helpers, professional HTML templates, and admin notification helper.

## Modified backend files

- `backend/package.json` – adds `nodemailer`.
- `backend/.env.example` – adds SMTP and email settings.
- `backend/src/models/User.js` – adds hashed email-verification/password-reset OTP/token fields and OTP attempt tracking.
- `backend/src/routes/auth.js` – registration verification, resend verification, email OTP verification, forgot-password email/OTP, reset-password, login alerts, and Google-login email alerts.
- `backend/src/routes/public.js` – Contact Us admin email and optional user acknowledgement.
- `backend/src/routes/student.js` – course completion email and admin notification.

## Environment variables

Add these to `backend/.env` (never commit real credentials):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMTP_FROM=ThinkAHead Learning Hub <your-email@example.com>
ADMIN_NOTIFICATION_EMAIL=admin@example.com
EMAIL_BRAND_NAME=ThinkAHead Learning Hub
EMAIL_OTP_TTL_MINUTES=10
EMAIL_VERIFICATION_TTL_MINUTES=60
EMAIL_TIMEZONE=Asia/Kolkata
```

Existing values such as `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PUBLIC_API_URL`, and `RESET_TOKEN_TTL_MINUTES` remain in use.

### Gmail

Use a Gmail/Google Workspace App Password rather than the normal account password when 2-Step Verification is enabled. SMTP host is `smtp.gmail.com`, port `587`, and `SMTP_SECURE=false` for STARTTLS.

For another provider, replace the host/port/security settings with that provider's SMTP settings.

## Flows

### Registration + email verification

1. Student registers.
2. Backend creates the MongoDB user with `emailVerified=false`.
3. Backend creates a random verification link token and 6-digit OTP. Only hashes are stored in MongoDB.
4. Student receives a verification email and OTP email.
5. Student can click the verification link or enter the OTP.
6. Backend marks `emailVerified=true` and clears verification secrets.
7. Welcome email is sent to the student and an admin verification notification is sent.

### Forgot password

1. Student submits the registered email.
2. Backend creates a random reset token and 6-digit OTP with expiry.
3. Reset link and OTP are emailed.
4. OTP verification issues a short-lived reset token; the reset link can also be used directly.
5. Backend hashes the supplied reset token before lookup, verifies expiry, updates the bcrypt password hash, and clears all reset secrets.

The response does not reveal whether an email address exists.

### OTP security

- OTPs are 6 digits generated with Node's cryptographic random generator.
- Only SHA-256 hashes are stored.
- OTPs expire automatically through timestamp checks.
- A maximum of 5 attempts is allowed per issued code.
- Resending creates a new code and resets the attempt counter.

### Login alert

A successful local login and Google login trigger an email containing the server-observed date/time, IP address, and user-agent/device information when available.

### Course completion

When a course is newly marked completed (quiz pass or complete endpoint), the student receives a completion email. An admin activity notification is also sent. Repeating completion does not send duplicate completion emails.

### Admin notifications

Admin notifications are sent for:

- New student registration
- Student email verification
- Course completion
- Contact Us submissions

Set `ADMIN_NOTIFICATION_EMAIL` for a fixed admin inbox. If it is blank, the backend falls back to users with `role: "admin"` in MongoDB.

### Contact Us

The submitted message is stored in the existing `Contact` collection, emailed to the admin, and an acknowledgement is sent to the user.

## API endpoints added/updated

- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-password-reset-otp`
- `POST /api/auth/resend-password-reset-otp`
- `POST /api/auth/reset-password`
- `GET /api/auth/verify-email-link?token=...`
- `POST /api/auth/verify-email-otp`
- `POST /api/auth/resend-verification`
- `POST /api/auth/verify-otp`
- `POST /api/auth/request-otp`
- `POST /api/contact` is not added; the existing endpoint remains `POST /api/public/contact` and now sends emails.

## Testing checklist

1. Start MongoDB.
2. Create `backend/.env` from `backend/.env.example` and enter valid SMTP credentials.
3. Run `npm install` inside `backend` so Nodemailer is installed.
4. Start the API with `npm run dev`.
5. Register a new student using a real inbox. Confirm verification link + OTP arrive.
6. Verify using the OTP. Confirm `emailVerified` becomes `true` in MongoDB and the welcome email arrives.
7. Register another test user and click the verification link. Confirm the link verifies the account.
8. Use Forgot Password. Confirm reset link + OTP arrive, verify OTP, set a new password, then log in with the new password.
9. Use Resend on both verification and password-reset screens. Confirm a new code arrives and the previous code is rejected.
10. Log in successfully. Confirm a login-alert email arrives with time/IP/user-agent.
11. Complete a course. Confirm the completion email and admin activity notification.
12. Submit Contact Us. Confirm the admin receives the message and the user receives acknowledgement.
13. Verify admin registration/verification/completion notifications arrive at `ADMIN_NOTIFICATION_EMAIL`.

## Important exclusions

No Razorpay/payment-related email logic was added for payment success/failure, subscription activation, course unlocking after payment, subscription expiry, or certificate delivery/generation.
