# SyncSphere Backend — Complete Functionalities

This backend implements the core SyncSphere features:
- Authentication (JWT) with express-validator checks
- Events: create, search, pagination, attend, event stats
- Resources: create with image uploads, search, toggle availability, swap (mock)
- Study sessions: create, join, list
- Expenses: create with receipt uploads, split-even logic, user summary
- Profile: get/update
- Admin: user management, role change, analytics (events by month, top resources, expenses totals)
- Uploads: standalone file upload route
- Socket.io: real-time chat support (used by frontend)

Quick start:
1. `npm install`
2. copy `.env.example` to `.env` and edit
3. `npm run seed`
4. `npm run dev`

Notes:
- Uploaded files are stored in ./uploads by default. For production, replace with S3 or similar.
- Improve validation and security for production (refresh tokens, input sanitization, rate limits).
