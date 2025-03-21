# FeedMe: Recipe Management Application Architecture Plan

## 1. System Architecture

The application will follow a modern three-tier architecture with clear separation of concerns:

```mermaid
flowchart TD
    subgraph "Frontend (React + TypeScript)"
        UI[User Interface]
        State[State Management]
        Auth[Auth Client]
    end
    
    subgraph "Backend (TypeScript)"
        API[REST API]
        Services[Business Logic]
        DAL[Data Access Layer]
        AuthService[Auth Service]
    end
    
    subgraph "Database"
        PostgreSQL[(PostgreSQL)]
    end
    
    subgraph "Authentication"
        LocalAuth[Email/Password]
        OIDC[OIDC Provider]
        Google[Google]
        GitHub[GitHub]
        Microsoft[Microsoft]
    end
    
    UI --> State
    State --> Auth
    Auth --> AuthService
    Auth --> LocalAuth
    Auth --> OIDC
    OIDC --> Google
    OIDC --> GitHub
    OIDC --> Microsoft
    State --> API
    API --> Services
    API --> AuthService
    Services --> DAL
    DAL --> PostgreSQL
```

## 2. Database Schema

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email
        string password_hash
        string name
        string picture
        string role
        timestamp created_at
        timestamp updated_at
    }
    
    RECIPES {
        uuid id PK
        uuid user_id FK
        string name
        string image_url
        text preparation_steps
        int cooking_time
        string cuisine_type
        timestamp created_at
        timestamp updated_at
    }
    
    RECIPE_DIETARY_RESTRICTIONS {
        uuid recipe_id FK
        string restriction
    }
    
    INGREDIENTS {
        uuid id PK
        string name
        string category
        int shelf_life_days
        timestamp created_at
        timestamp updated_at
    }
    
    INGREDIENT_SUBSTITUTES {
        uuid ingredient_id FK
        uuid substitute_id FK
    }
    
    RECIPE_INGREDIENTS {
        uuid recipe_id FK
        uuid ingredient_id FK
        float quantity
        string unit
        string notes
    }
    
    USER_INGREDIENTS {
        uuid user_id FK
        uuid ingredient_id FK
        float quantity
        string unit
        timestamp expiry_date
        timestamp created_at
        timestamp updated_at
    }
    
    MEAL_PLANS {
        uuid id PK
        uuid user_id FK
        date start_date
        date end_date
        timestamp created_at
        timestamp updated_at
    }
    
    MEAL_PLAN_RECIPES {
        uuid meal_plan_id FK
        uuid recipe_id FK
        date planned_date
        string meal_type
    }
    
    USERS ||--o{ RECIPES : creates
    USERS ||--o{ USER_INGREDIENTS : has
    USERS ||--o{ MEAL_PLANS : creates
    RECIPES ||--o{ RECIPE_INGREDIENTS : contains
    RECIPES ||--o{ RECIPE_DIETARY_RESTRICTIONS : has
    INGREDIENTS ||--o{ RECIPE_INGREDIENTS : used_in
    INGREDIENTS ||--o{ USER_INGREDIENTS : stocked_by
    INGREDIENTS ||--o{ INGREDIENT_SUBSTITUTES : can_be_substituted_by
    MEAL_PLANS ||--o{ MEAL_PLAN_RECIPES : includes
    RECIPES ||--o{ MEAL_PLAN_RECIPES : included_in
```

## 3. User Roles and Permissions

The application will support the following user roles:

### 3.1 Role Types

1. **Admin**
   - Full system access
   - User management capabilities
   - Content moderation
   - System configuration

2. **Regular User**
   - Manage personal recipes
   - Manage personal ingredient inventory
   - Create and manage meal plans
   - Access recommendations

3. **Guest** (Unauthenticated)
   - View public recipes
   - Register for an account

### 3.2 Permission Matrix

| Resource/Action | Admin | Regular User | Guest |
|-----------------|-------|--------------|-------|
| **Users** |
| View all users | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| **Recipes** |
| Create recipes | ✅ | ✅ | ❌ |
| View own recipes | ✅ | ✅ | ❌ |
| Edit own recipes | ✅ | ✅ | ❌ |
| Delete own recipes | ✅ | ✅ | ❌ |
| View public recipes | ✅ | ✅ | ✅ |
| Edit any recipe | ✅ | ❌ | ❌ |
| Delete any recipe | ✅ | ❌ | ❌ |
| **Ingredients** |
| Manage global ingredients | ✅ | ❌ | ❌ |
| Manage own inventory | ✅ | ✅ | ❌ |
| **Meal Plans** |
| Create meal plans | ✅ | ✅ | ❌ |
| View own meal plans | ✅ | ✅ | ❌ |
| Edit own meal plans | ✅ | ✅ | ❌ |
| **System** |
| View system stats | ✅ | ❌ | ❌ |
| Configure system | ✅ | ❌ | ❌ |

### 3.3 Implementation Strategy

The permission system will be implemented using:

1. **Role-based access control (RBAC)** at the API level
   - Middleware to check user roles and permissions
   - Decorators/annotations for route protection

2. **Row-level security** in PostgreSQL
   - Ensure users can only access their own data
   - Admin override for management functions

3. **UI-level permission checks**
   - Hide or disable UI elements based on user role
   - Prevent unauthorized actions from being attempted

## 4. Backend Components

### 4.1 Core Services

1. **AuthService**
   - Handles both local (email/password) authentication
   - Manages OIDC authentication flow for social logins
   - User registration and account management
   - Password reset functionality
   - Role-based access control
   - Manages user sessions and tokens
   - Integrates with Google, GitHub, and Microsoft identity providers

2. **RecipeService**
   - CRUD operations for recipes
   - Search and filtering capabilities
   - Recipe collection management

3. **IngredientService**
   - CRUD operations for ingredients
   - Ingredient categorization
   - Substitute management

4. **InventoryService**
   - User ingredient inventory management
   - Expiry tracking
   - Low stock alerts

5. **RecommendationService**
   - Smart recipe recommendations based on:
     - Available ingredients
     - Dietary preferences
     - Cuisine preferences
     - Past selections
     - Random suggestions

6. **MealPlanService**
   - Weekly meal plan generation
   - Meal plan management
   - Shopping list generation

7. **AdminService**
   - User management
   - System statistics and monitoring
   - Content moderation

### 4.2 API Layer

The REST API will follow a resource-oriented design with the following main endpoints:

```
/api/v1/auth - Authentication endpoints
/api/v1/users - User management
/api/v1/recipes - Recipe CRUD operations
/api/v1/ingredients - Ingredient CRUD operations
/api/v1/inventory - User ingredient inventory
/api/v1/recommendations - Recipe recommendations
/api/v1/meal-plans - Meal planning
/api/v1/admin - Admin-only endpoints
```

## 5. Frontend Components

### 5.1 Core Pages

1. **Authentication Pages**
   - Login (Email/Password and Social)
   - Registration (Email/Password and Social)
   - Password Reset
   - Profile management

2. **Recipe Management**
   - Recipe browser with filters
   - Recipe detail view
   - Recipe editor
   - Collection management

3. **Ingredient Inventory**
   - Inventory dashboard
   - Add/edit ingredients
   - Expiry tracking
   - Shopping list

4. **Meal Planning**
   - Weekly planner view
   - Recommendation integration
   - Drag-and-drop meal assignment
   - Plan generation

5. **Admin Dashboard** (Admin only)
   - User management
   - System statistics
   - Content moderation

### 5.2 Component Hierarchy

```mermaid
flowchart TD
    App --> AuthProvider
    AuthProvider --> Router
    
    Router --> LoginPage
    Router --> RegisterPage
    Router --> Dashboard
    Router --> AdminDashboard
    
    Dashboard --> Navbar
    Dashboard --> Sidebar
    Dashboard --> MainContent
    
    MainContent --> RecipesPage
    MainContent --> RecipeDetailPage
    MainContent --> RecipeEditorPage
    MainContent --> InventoryPage
    MainContent --> MealPlannerPage
    MainContent --> RecommendationsPage
    
    RecipesPage --> RecipeFilters
    RecipesPage --> RecipeGrid
    RecipeGrid --> RecipeCard
    
    RecipeDetailPage --> RecipeHeader
    RecipeDetailPage --> IngredientList
    RecipeDetailPage --> PreparationSteps
    
    InventoryPage --> InventorySummary
    InventoryPage --> IngredientCategories
    InventoryPage --> IngredientList
    InventoryPage --> AddIngredientForm
    
    MealPlannerPage --> WeekView
    MealPlannerPage --> DayCard
    MealPlannerPage --> MealSlot
    MealPlannerPage --> RecommendationPanel
    
    AdminDashboard --> UserManagement
    AdminDashboard --> SystemStats
    AdminDashboard --> ContentModeration
```

## 6. Authentication Flow

### 6.1 Email/Password Authentication

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter email/password
    Frontend->>Backend: POST /api/v1/auth/login
    Backend->>Database: Verify credentials
    Database->>Backend: Credentials valid/invalid
    
    alt Credentials Valid
        Backend->>Backend: Generate JWT
        Backend->>Frontend: Return JWT
        Frontend->>Frontend: Store JWT
        Frontend->>User: Redirect to dashboard
    else Credentials Invalid
        Backend->>Frontend: Authentication error
        Frontend->>User: Show error message
    end
```

### 6.2 Social Login Authentication

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant OIDCProvider
    participant IdentityProvider
    
    User->>Frontend: Click Social Login
    Frontend->>Backend: Initiate OIDC flow
    Backend->>OIDCProvider: Request authorization
    OIDCProvider->>User: Redirect to login page
    User->>IdentityProvider: Select identity provider (Google, GitHub, Microsoft)
    User->>IdentityProvider: Authenticate
    IdentityProvider->>OIDCProvider: Authentication successful
    OIDCProvider->>Backend: Authorization code
    Backend->>OIDCProvider: Exchange code for tokens
    OIDCProvider->>Backend: ID token, access token
    Backend->>Backend: Validate tokens
    Backend->>Backend: Create/update user record
    Backend->>Frontend: User session & JWT
    Frontend->>User: Redirect to dashboard
```

### 6.3 Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter registration details
    Frontend->>Backend: POST /api/v1/auth/register
    Backend->>Database: Check if email exists
    
    alt Email Available
        Backend->>Backend: Hash password
        Backend->>Database: Create user record
        Database->>Backend: User created
        Backend->>Backend: Generate JWT
        Backend->>Frontend: Return JWT
        Frontend->>Frontend: Store JWT
        Frontend->>User: Redirect to dashboard
    else Email Taken
        Backend->>Frontend: Email already in use
        Frontend->>User: Show error message
    end
```

## 7. Recommendation Engine

The recommendation engine will use a scoring system based on multiple factors:

```mermaid
flowchart TD
    Input[User Context] --> Filters
    
    subgraph Filters
        Ingredients[Available Ingredients]
        Preferences[Dietary Preferences]
        History[User History]
        Cuisine[Cuisine Preferences]
    end
    
    subgraph "Scoring Algorithm"
        IngredientMatch[Ingredient Match Score]
        PreferenceMatch[Preference Match Score]
        PopularityScore[Popularity Score]
        DiversityScore[Diversity Score]
    end
    
    Ingredients --> IngredientMatch
    Preferences --> PreferenceMatch
    History --> PopularityScore
    History --> DiversityScore
    Cuisine --> PreferenceMatch
    
    IngredientMatch --> WeightedScore
    PreferenceMatch --> WeightedScore
    PopularityScore --> WeightedScore
    DiversityScore --> WeightedScore
    
    WeightedScore --> Ranking[Recipe Ranking]
    Ranking --> Output[Recommended Recipes]
```

## 8. Deployment Strategy

```mermaid
flowchart TD
    subgraph "CI/CD Pipeline"
        GitRepo[Git Repository]
        CI[CI System]
        Registry[Container Registry]
    end
    
    subgraph "Kubernetes Cluster"
        HelmChart[Helm Chart]
        
        subgraph "Frontend Deployment"
            FrontendPods[Frontend Pods]
            FrontendService[Frontend Service]
            IngressController[Ingress Controller]
        end
        
        subgraph "Backend Deployment"
            BackendPods[Backend Pods]
            BackendService[Backend Service]
        end
        
        subgraph "Database"
            PostgreSQLStatefulSet[PostgreSQL StatefulSet]
            PostgreSQLService[PostgreSQL Service]
            PersistentVolume[Persistent Volume]
        end
    end
    
    GitRepo --> CI
    CI --> Registry
    Registry --> HelmChart
    HelmChart --> FrontendPods
    HelmChart --> BackendPods
    HelmChart --> PostgreSQLStatefulSet
    
    FrontendPods --> FrontendService
    FrontendService --> IngressController
    BackendPods --> BackendService
    PostgreSQLStatefulSet --> PostgreSQLService
    PostgreSQLStatefulSet --> PersistentVolume
    
    IngressController --> Users[Users]
    BackendService --> FrontendPods
    PostgreSQLService --> BackendPods
```

## 9. Development Roadmap

### Phase 1: Foundation
- Set up project structure and development environment
- Implement authentication (both local and OIDC)
- Create database schema and migrations
- Develop core API endpoints
- Build basic UI components
- Implement role-based access control

### Phase 2: Core Features
- Complete recipe management functionality
- Implement ingredient inventory system
- Develop basic recommendation engine
- Create user profile and preferences

### Phase 3: Advanced Features
- Enhance recommendation engine with machine learning
- Implement meal planning functionality
- Add shopping list generation
- Develop admin dashboard and tools

### Phase 4: Optimization and Scaling
- Performance optimization
- Implement caching strategies
- Add analytics and monitoring
- Enhance security measures

### Phase 5: Deployment and Launch
- Set up CI/CD pipeline
- Create Kubernetes Helm charts
- Deploy to production environment
- Conduct user acceptance testing

## 10. Technology Stack Summary

- **Frontend**:
  - React with TypeScript
  - Redux or Context API for state management
  - React Router for navigation
  - Styled Components or Material UI for styling
  - Jest and React Testing Library for testing

- **Backend**:
  - Node.js with Express or NestJS
  - TypeScript
  - TypeORM or Prisma for database access
  - Passport.js for authentication (local and OIDC)
  - Jest for testing

- **Database**:
  - PostgreSQL
  - Redis for caching (optional)

- **DevOps**:
  - Docker for containerization
  - Kubernetes for orchestration
  - Helm for package management
  - GitHub Actions or Jenkins for CI/CD