# CollabHub Project Structure

```
collabhub2/
│
├── backend/                    # FastAPI Backend
│   ├── main.py                # Main API application
│   ├── requirements.txt       # Python dependencies
│   └── env.example           # Environment variables template
│
├── frontend/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx           # Main app component with routing
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles (Tailwind)
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── CreateProject.jsx # Create project form
│   │   │   └── ProjectDetail.jsx # Project detail page
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.jsx       # App layout with navigation
│   │   │   └── PrivateRoute.jsx # Route protection (placeholder)
│   │   │
│   │   └── lib/
│   │       ├── supabase.js      # Supabase client
│   │       └── api.js           # API client (Axios)
│   │
│   ├── index.html            # HTML template
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── postcss.config.js     # PostCSS config
│   ├── .eslintrc.cjs         # ESLint config
│   └── env.example           # Environment variables template
│
├── database/
│   └── schema.sql            # Database schema with RLS policies
│
├── README.md                 # Main project documentation
├── SETUP.md                  # Detailed setup guide
├── .gitignore               # Git ignore rules
└── PROJECT_STRUCTURE.md     # This file
```

## Key Features Implemented

### Authentication
- ✅ Google OAuth via Supabase
- ✅ Automatic profile creation
- ✅ Protected routes
- ✅ Session management

### Projects
- ✅ Create projects with title, description, tech stack, roles needed
- ✅ Browse all open projects
- ✅ View project details
- ✅ Filter by open/closed status

### Collaboration
- ✅ Send collaboration requests
- ✅ View incoming/outgoing requests
- ✅ Accept/reject requests (project owners only)
- ✅ Auto-add to team on acceptance

### Team Management
- ✅ View team members per project
- ✅ Track joined projects
- ✅ Role assignment (structure ready)

### Security
- ✅ Row Level Security (RLS) policies
- ✅ Backend authentication middleware
- ✅ Input validation (Pydantic)
- ✅ CORS configuration

## API Endpoints

### Profile
- `GET /api/profile/me` - Get current user profile
- `PUT /api/profile/me` - Update current user profile

### Projects
- `GET /api/projects` - List all projects (filtered by is_open)
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project (owner only)
- `GET /api/my-projects` - Get user's projects
- `GET /api/joined-projects` - Get projects user joined

### Collaboration Requests
- `POST /api/collaboration-requests` - Create request
- `GET /api/collaboration-requests` - Get user's requests
- `PUT /api/collaboration-requests/{id}/accept` - Accept request
- `PUT /api/collaboration-requests/{id}/reject` - Reject request

### Team
- `GET /api/projects/{id}/team` - Get project team members

## Database Tables

1. **profiles** - User profiles linked to auth.users
2. **projects** - Project pitches/ideas
3. **collaboration_requests** - Join requests
4. **team_members** - Project team composition

All tables have RLS enabled with appropriate policies.

