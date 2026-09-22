# Library & Book Rental Management System

A MERN stack application for managing books and book rentals.

## Technologies

* MongoDB
* Express.js
* React
* Node.js
* Mongoose
* JWT
* bcryptjs
* Multer
* GridFS
* Nodemailer

## Features

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Book catalog with 20 seeded books
* Search books
* Filter by category, format, and availability
* Pagination
* Book details
* Book cover upload using Multer
* Book cover storage using MongoDB GridFS
* Guest cart
* User rental cart
* Update and remove cart items
* Mock checkout
* Rental orders
* 14-day rental period
* Rental confirmation email using Nodemailer

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and add your MongoDB, JWT, and email configuration.

Seed the books:

```bash
npm run seed:books
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite.

## Environment Variables

The following variables are required in `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

The actual `.env` file is not included in the repository.

## Project Structure

```text
library-book-rental/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```
