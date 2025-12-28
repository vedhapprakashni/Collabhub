from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime
import base64
import json

load_dotenv()

app = FastAPI(title="CollabHub API", version="1.0.0")

# CORS middleware
# Get allowed origins from environment or use defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Can be set via ALLOWED_ORIGINS env var
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")  # Use service key for backend operations

if not supabase_url or not supabase_key:
    raise ValueError(
        "Missing required environment variables. Please check your .env file. "
        "Required: SUPABASE_URL, SUPABASE_SERVICE_KEY"
    )

supabase: Client = create_client(supabase_url, supabase_key)


# Dependency to get current user from Authorization header
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split("Bearer ")[1]
    
    # Extract user ID from JWT token (decode without verification for MVP)
    # In production, you should verify the JWT signature using Supabase JWT secret
    try:
        # JWT format: header.payload.signature
        parts = token.split('.')
        if len(parts) != 3:
            raise HTTPException(status_code=401, detail="Invalid token format")
        
        # Decode payload (add padding if needed)
        payload = parts[1]
        # Add padding
        padding = 4 - len(payload) % 4
        if padding != 4:
            payload += '=' * padding
        
        decoded_payload = base64.urlsafe_b64decode(payload)
        token_data = json.loads(decoded_payload)
        
        user_id = token_data.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
        
        # Verify user exists in profiles table
        profile_response = supabase.table("profiles").select("id").eq("id", user_id).execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=401, detail="User profile not found")
        
        # Return a simple user object
        from types import SimpleNamespace
        user_obj = SimpleNamespace()
        user_obj.id = user_id
        user_obj.email = token_data.get("email")
        return user_obj
        
    except (ValueError, json.JSONDecodeError, KeyError) as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


# Pydantic models
class ProfileCreate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    bio: Optional[str]
    skills: Optional[List[str]]
    github_url: Optional[str]
    linkedin_url: Optional[str]
    created_at: Optional[str]


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    looking_for: Optional[List[str]] = None


class ProjectResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    description: Optional[str]
    tech_stack: Optional[List[str]]
    looking_for: Optional[List[str]]
    is_open: bool
    created_at: Optional[str]
    updated_at: Optional[str]


class CollaborationRequestCreate(BaseModel):
    project_id: str
    message: Optional[str] = None


class CollaborationRequestResponse(BaseModel):
    id: str
    project_id: str
    requester_id: str
    message: Optional[str]
    status: str
    created_at: Optional[str]


class TeamMemberResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    role: Optional[str]
    joined_at: Optional[str]


# API Routes

@app.get("/")
def root():
    return {"message": "CollabHub API", "version": "1.0.0"}


@app.get("/api/profile/me", response_model=ProfileResponse)
async def get_my_profile(user=Depends(get_current_user)):
    """Get current user's profile"""
    response = supabase.table("profiles").select("*").eq("id", user.id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return response.data[0]


@app.put("/api/profile/me", response_model=ProfileResponse)
async def update_my_profile(profile: ProfileCreate, user=Depends(get_current_user)):
    """Update current user's profile"""
    update_data = profile.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    response = supabase.table("profiles").update(update_data).eq("id", user.id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return response.data[0]


@app.get("/api/projects", response_model=List[ProjectResponse])
async def get_projects(is_open: Optional[bool] = None, user=Depends(get_current_user)):
    """Get all projects (optionally filtered by is_open)"""
    query = supabase.table("projects").select("*")
    
    if is_open is not None:
        query = query.eq("is_open", is_open)
    
    response = query.order("created_at", desc=True).execute()
    return response.data


@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, user=Depends(get_current_user)):
    """Get a specific project by ID"""
    response = supabase.table("projects").select("*").eq("id", project_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return response.data[0]


@app.post("/api/projects", response_model=ProjectResponse)
async def create_project(project: ProjectCreate, user=Depends(get_current_user)):
    """Create a new project"""
    project_data = project.model_dump()
    project_data["owner_id"] = user.id
    
    response = supabase.table("projects").insert(project_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create project")
    
    return response.data[0]


@app.put("/api/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, project: ProjectCreate, user=Depends(get_current_user)):
    """Update a project (only owner can update)"""
    # Verify ownership
    existing = supabase.table("projects").select("owner_id").eq("id", project_id).execute()
    
    if not existing.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if existing.data[0]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this project")
    
    update_data = project.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    response = supabase.table("projects").update(update_data).eq("id", project_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update project")
    
    return response.data[0]


@app.post("/api/collaboration-requests", response_model=CollaborationRequestResponse)
async def create_collaboration_request(request: CollaborationRequestCreate, user=Depends(get_current_user)):
    """Create a collaboration request"""
    # Check if project exists and is open
    project = supabase.table("projects").select("*").eq("id", request.project_id).execute()
    
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if not project.data[0]["is_open"]:
        raise HTTPException(status_code=400, detail="Project is not open for collaborations")
    
    if project.data[0]["owner_id"] == user.id:
        raise HTTPException(status_code=400, detail="Cannot request to join your own project")
    
    # Check if request already exists
    existing = supabase.table("collaboration_requests").select("*").eq("project_id", request.project_id).eq("requester_id", user.id).execute()
    
    if existing.data:
        raise HTTPException(status_code=400, detail="You have already sent a request for this project")
    
    request_data = {
        "project_id": request.project_id,
        "requester_id": user.id,
        "message": request.message
    }
    
    response = supabase.table("collaboration_requests").insert(request_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create collaboration request")
    
    return response.data[0]


@app.get("/api/collaboration-requests", response_model=List[CollaborationRequestResponse])
async def get_collaboration_requests(user=Depends(get_current_user)):
    """Get collaboration requests (received and sent)"""
    # Get requests I sent
    sent = supabase.table("collaboration_requests").select("*").eq("requester_id", user.id).execute()
    
    # Get requests I received (for my projects)
    my_projects = supabase.table("projects").select("id").eq("owner_id", user.id).execute()
    project_ids = [p["id"] for p in my_projects.data] if my_projects.data else []
    
    received = []
    if project_ids:
        received_resp = supabase.table("collaboration_requests").select("*").in_("project_id", project_ids).execute()
        received = received_resp.data if received_resp.data else []
    
    # Combine and return
    all_requests = (sent.data if sent.data else []) + received
    return all_requests


@app.put("/api/collaboration-requests/{request_id}/accept", response_model=CollaborationRequestResponse)
async def accept_collaboration_request(request_id: str, user=Depends(get_current_user)):
    """Accept a collaboration request (only project owner can accept)"""
    # Get the request
    request_resp = supabase.table("collaboration_requests").select("*").eq("id", request_id).execute()
    
    if not request_resp.data:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req = request_resp.data[0]
    
    # Verify ownership
    project = supabase.table("projects").select("owner_id").eq("id", req["project_id"]).execute()
    
    if not project.data or project.data[0]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to accept this request")
    
    if req["status"] != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    
    # Update request status
    response = supabase.table("collaboration_requests").update({"status": "accepted"}).eq("id", request_id).execute()
    
    # Add to team members
    supabase.table("team_members").insert({
        "project_id": req["project_id"],
        "user_id": req["requester_id"],
        "role": None  # Can be set later
    }).execute()
    
    return response.data[0]


@app.put("/api/collaboration-requests/{request_id}/reject", response_model=CollaborationRequestResponse)
async def reject_collaboration_request(request_id: str, user=Depends(get_current_user)):
    """Reject a collaboration request (only project owner can reject)"""
    # Get the request
    request_resp = supabase.table("collaboration_requests").select("*").eq("id", request_id).execute()
    
    if not request_resp.data:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req = request_resp.data[0]
    
    # Verify ownership
    project = supabase.table("projects").select("owner_id").eq("id", req["project_id"]).execute()
    
    if not project.data or project.data[0]["owner_id"] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to reject this request")
    
    # Update request status
    response = supabase.table("collaboration_requests").update({"status": "rejected"}).eq("id", request_id).execute()
    
    return response.data[0]


@app.get("/api/projects/{project_id}/team", response_model=List[TeamMemberResponse])
async def get_project_team(project_id: str, user=Depends(get_current_user)):
    """Get team members for a project"""
    # Verify user has access (owner or team member)
    project = supabase.table("projects").select("owner_id").eq("id", project_id).execute()
    
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    is_owner = project.data[0]["owner_id"] == user.id
    is_member = supabase.table("team_members").select("*").eq("project_id", project_id).eq("user_id", user.id).execute()
    
    if not is_owner and not is_member.data:
        raise HTTPException(status_code=403, detail="Not authorized to view team members")
    
    response = supabase.table("team_members").select("*").eq("project_id", project_id).execute()
    return response.data if response.data else []


@app.get("/api/my-projects", response_model=List[ProjectResponse])
async def get_my_projects(user=Depends(get_current_user)):
    """Get projects owned by current user"""
    response = supabase.table("projects").select("*").eq("owner_id", user.id).order("created_at", desc=True).execute()
    return response.data if response.data else []


@app.get("/api/joined-projects", response_model=List[ProjectResponse])
async def get_joined_projects(user=Depends(get_current_user)):
    """Get projects user has joined as team member"""
    # Get project IDs where user is a team member
    memberships = supabase.table("team_members").select("project_id").eq("user_id", user.id).execute()
    
    if not memberships.data:
        return []
    
    project_ids = [m["project_id"] for m in memberships.data]
    response = supabase.table("projects").select("*").in_("id", project_ids).order("created_at", desc=True).execute()
    
    return response.data if response.data else []


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

