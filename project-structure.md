# FeedMe Project Structure

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
│   ├── .env.example              # Example environment variables
│   ├── .eslintrc.js              # ESLint configuration
│   ├── .gitignore                # Git ignore file
│   ├── jest.config.js            # Jest configuration
│   ├── package.json              # NPM package file
│   ├── tsconfig.json             # TypeScript configuration
│   └── nodemon.json              # Nodemon configuration
├── frontend/                     # Frontend application
│   ├── public/                   # Static files
│   ├── src/                      # Source code
│   │   ├── assets/               # Images, fonts, etc.
│   │   ├── components/           # React components
│   │   │   ├── common/           # Shared components
│   │   │   ├── layout/           # Layout components
│   │   │   ├── recipes/          # Recipe-related components
│   │   │   ├── ingredients/      # Ingredient-related components
│   │   │   ├── mealPlans/        # Meal plan components
│   │   │   └── admin/            # Admin components
│   │   ├── context/              # React context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service functions
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utility functions
│   │   ├── App.tsx               # Root component
│   │   ├── index.tsx             # Entry point
│   │   └── routes.tsx            # Application routes
│   ├── .env.example              # Example environment variables
│   ├── .eslintrc.js              # ESLint configuration
│   ├── .gitignore                # Git ignore file
│   ├── package.json              # NPM package file
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite configuration
├── .gitignore                    # Root Git ignore file
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile.backend            # Backend Dockerfile
├── Dockerfile.frontend           # Frontend Dockerfile
└── package.json                  # Root package.json for scripts