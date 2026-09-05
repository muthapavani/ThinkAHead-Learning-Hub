# Course Card Example & MongoDB Setup

The course cards are loaded from the backend MongoDB `courses` collection. The frontend receives them through the existing public bootstrap/course APIs and already renders fields such as `title`, `shortDescription`, `thumbnail`, `category`, `rating`, `reviewsCount`, `totalDuration`, `lessonsCount`, `isFree`, `monthUnlock`, `level`, and `instructor`.

A complete ready-to-copy example is in `COURSE_CARD_EXAMPLE.json`.

## Add a course to MongoDB

1. Start MongoDB and the backend.
2. Open MongoDB Compass or `mongosh` and select the database configured by `MONGODB_URI`.
3. Insert the object from `COURSE_CARD_EXAMPLE.json` into the `courses` collection.
4. Keep `id` and `slug` unique.
5. Add modules/lessons and a quiz if the course should be playable.
6. Refresh the student portal. The existing course-card UI will automatically receive the new course from the backend.

### mongosh

```js
use your_database_name

db.courses.insertOne(/* paste COURSE_CARD_EXAMPLE.json object here */)
```

For production, replace the example image/video/resource URLs with your own hosted assets.

## Using the seed data

The existing source dataset is `backend/src/data/courses.js`. If a course should be recreated when the database is reseeded, add or update the course object there and run:

```bash
cd backend
npm run seed
```

The accepted MongoDB/Mongoose fields are defined in `backend/src/models/Course.js`.

## Environment files

The existing frontend `.env.example` and backend `backend/.env.example` are preserved in this updated package. Real `.env` files should stay local and should not contain secrets in source control.
