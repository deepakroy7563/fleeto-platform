# Fleeto - Electric Bike Agency Platform

Fleeto is a modern, full-stack MERN website designed for an electric bike company. It features a premium UI, bike management, spare parts inventory, and a WhatsApp-integrated booking system.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Axios.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, Socket.io.
- **Media Storage:** Cloudinary.

## Features

- **Customer Website:**
  - Modern hero section with animations.
  - Bike showcase and detailed specifications.
  - Spare parts catalog.
  - "Book Now" via WhatsApp integration.
  - Agency location integration.
- **Dealer Dashboard:**
  - Manage bike listings and spare parts.
  - View booking requests.
  - Analytics overview.
- **Admin Panel:**
  - Approve/Manage dealers.
  - Global oversight of all listings and bookings.

## Project Structure

```
/backend
  /src
    /config      # Database and other configs
    /controllers # Business logic
    /middleware  # Authentication and error handling
    /models      # Mongoose schemas
    /routes      # API endpoints
    /utils       # Helper functions
/frontend
  /src
    /app         # Redux store
    /components  # UI components
    /features    # Redux slices
    /pages       # Main view pages
    /styles      # Tailwind & Global CSS
```

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd CV
```

### 2. Backend Setup
1. Go to `backend` directory.
2. Create `.env` file from `.env.example` and add your MongoDB URI and JWT Secret.
3. Install dependencies: `npm install`.
4. Start the server: `npm run dev`.

### 3. Frontend Setup
1. Go to `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## Deployment

- **Frontend:** Deploy to Vercel (connect GitHub repository).
- **Backend:** Deploy to Render (connect GitHub repository).
- **Database:** MongoDB Atlas.

## License
MIT
