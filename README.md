# FeedMe - Recipe Management Application

FeedMe is a comprehensive recipe management application that helps users discover, plan, and cook with ease. It provides smart recommendations based on ingredient availability, dietary preferences, and more.

## Features

- **Recipe Management**: Create, edit, and organize your recipes
- **Ingredient Inventory**: Track your available ingredients and their expiry dates
- **Meal Planning**: Plan your meals for the week with a drag-and-drop interface
- **Smart Recommendations**: Get recipe suggestions based on your available ingredients and preferences
- **Authentication**: Secure login with email/password or social logins (Google, GitHub, Microsoft)
- **User Roles**: Regular users and admin users with different permissions

## Tech Stack

### Backend

- **Language**: TypeScript
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT and OIDC for social logins
- **API**: RESTful API

### Frontend

- **Language**: TypeScript
- **Framework**: React
- **UI Library**: Material-UI
- **State Management**: React Context API and React Query
- **Routing**: React Router
- **Form Handling**: React Hook Form

### DevOps

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Package Management**: Helm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/feedme.git
   cd feedme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Edit the `.env` files with your configuration.

4. Start the development servers:
   ```bash
   # Start PostgreSQL using Docker
   docker-compose up -d postgres

   # Start backend and frontend
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/v1

### Using Docker Compose

You can also run the entire application using Docker Compose:

```bash
docker-compose up -d
```

## Project Structure

```
feedme/
├── README.md                     # Project overview
├── docs/                         # Documentation
│   └── architecture.md           # Architecture plan
├── backend/                      # Backend application
│   ├── src/                      # Source code
│   │   ├── config/               # Configuration files
│   │   ├── controllers/          # API controllers
│   │   ├── middleware/           # Express middleware
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utility functions
│   │   └── app.ts                # Express application
├── frontend/                     # Frontend application
│   ├── public/                   # Static files
│   ├── src/                      # Source code
│   │   ├── components/           # React components
│   │   ├── context/              # React context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service functions
│   │   ├── types/                # TypeScript type definitions
│   │   └── utils/                # Utility functions
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile.backend            # Backend Dockerfile
└── Dockerfile.frontend           # Frontend Dockerfile
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
