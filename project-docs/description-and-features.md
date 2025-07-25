# Keativ — React + TypeScript Social Media Management UI (Frontend Only)

## Project Description
Keativ is a minimalist, flat-design social media management frontend web app inspired by Later.com and Buffer. It allows users to schedule posts, manage media, preview content, and analyze social engagement—all from a clean, intuitive interface. No backend is included; static/mock data only.

## Core Features (Frontend Only)

### 📍 Functional Features
- Schedule social media posts via a calendar interface (FullCalendar)
- View analytics (followers, reach, impressions) using Recharts
- Create posts per platform with previews
- Import media from Google Drive/Dropbox
- Hashtag and post suggestions (mocked AI)
- Multi-platform posting
- UI-only inbox for messages
- Weekly/Monthly reports preview
- Slack calendar share simulation
- Lock/edit scheduled posts
- Brand wall of tagged posts

### 🧑‍🤝‍🧑 Collaborator Features
- Invite collaborators (frontend form)
- Shared calendar view
- Unlimited collaborators (mock state)
- Dropdown switcher for “social sets”

### 🧠 Smart (Mocked AI) Features
- Post timing suggestions
- Sentiment analysis (display only)
- Tag locations/users
- Save/reuse post templates
- Add holidays to calendar
- Toggle 12h/24h format
- Google Auth UI (no backend)

## Routes

### 🔓 Public Routes
| Page      | Path       | Description                                        |
|-----------|------------|----------------------------------------------------|
| Landing   | `/`        | Hero section, call to action, branding            |
| Features  | `/features`| Key feature overview                               |
| Pricing   | `/pricing` | Tiered pricing comparison                          |
| About     | `/about`   | Team, mission, and story                           |
| Contact   | `/contact` | Contact form and social links                      |
| Login     | `/login`   | Google + email/password login                      |
| Signup    | `/signup`  | Business/user info                                 |
| NotFound  | `*`        | Custom 404 page                                    |

### 🔒 Private Routes
| Page         | Path           | Description                                      |
|--------------|----------------|--------------------------------------------------|
| Dashboard    | `/dashboard`   | Overview of stats, posts, and social sets        |
| Calendar     | `/calendar`    | FullCalendar schedule of posts                   |
| Analytics    | `/analytics`   | Recharts dashboard for metrics                   |
| Messages     | `/messages`    | UI-only cross-platform inbox                     |
| Media Library| `/media`       | Uploaded files from Drive/Dropbox                |
| Influencers  | `/influencers` | List of influencers (mock)                       |
| Social Sets  | `/social-sets` | Manage account groups                            |
| Settings     | `/settings`    | Preferences, integrations, time format           |
| Logout       | N/A            | Trigger logout via mock action                   |
