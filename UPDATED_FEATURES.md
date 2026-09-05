# Updated Website Changes

Implemented in this ZIP:
- Student dashboard styling aligned to ThinkAHead landing-page palette (navy/blue/cyan/emerald).
- Removed the dashboard bottom Profile Overview card from the welcome/dashboard content.
- Added a dedicated Student Dashboard → My Progress page with overall, enrolled, in-progress, completed and course-by-course progress.
- Progress bars use real `progressMap` values; lesson completion drives progress through the existing backend APIs.
- Certificate QR in the Certificates section is blurred/locked until the master curriculum is fully completed; hover shows the Locked overlay, and the QR becomes clear after eligibility.
- Registration keeps exactly 2 free courses (course 1 and course 2).
- Paid release schedule is now 2 courses per monthly subscription cycle:
  - Month 1: courses 3–4
  - Month 2: courses 5–6
  - ...
  - Month 10: courses 21–22
- Monthly membership checkout/backend wording and subscription duration were updated.
- Admin → Courses now has a working Add New Course / Edit Course dialog with image URL, banner image URL, free/paid status and monthly release month.
- Added `COURSE_CATALOG_ADMIN_GUIDE.md` with all 22 courses, their image URLs, access month and admin instructions.
