# SMTP Fix - ThinkAHead Learning Hub

## Why email was silently failing
The previous code caught SMTP errors inside `safeSendEmail()` and still allowed the API to report success. The updated version:
- verifies SMTP when the backend starts;
- prints the exact SMTP error in the terminal;
- uses `SMTP_FROM` fallback safely;
- makes user-facing verification, OTP, reset and welcome emails report SMTP failures instead of silently pretending they were sent;
- logs every successfully sent email and message ID.

## Gmail setup
1. Turn on 2-Step Verification for the Gmail account used to send emails.
2. Open Google Account > Security > App passwords.
3. Create an App Password for Mail (or a custom app named ThinkAHead Learning Hub).
4. Copy the 16-character password.
5. In `backend`, create a file named `.env` by copying `.env.example`.
6. Fill in real values:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_USER=YOUR_GMAIL@gmail.com
SMTP_PASS=YOUR_16_CHARACTER_APP_PASSWORD
SMTP_FROM=ThinkAHead Learning Hub <YOUR_GMAIL@gmail.com>
ADMIN_NOTIFICATION_EMAIL=YOUR_GMAIL@gmail.com
```

Do NOT use your normal Gmail password.

## Install and run
From the `backend` folder:

```bash
npm install
npm run dev
```

On startup you should see:

```text
MongoDB connected
[email] SMTP connection verified (smtp.gmail.com:587) as YOUR_GMAIL@gmail.com
ThinkAHead API listening on http://localhost:5000
```

If verification fails, copy the exact terminal error. Common causes are an incorrect App Password, using the normal Gmail password, or SMTP credentials containing extra spaces.

## Test flow
- Register a new user -> verification email + OTP.
- Verify email -> welcome email.
- Forgot password -> reset link + OTP.
- Login -> login alert email.
