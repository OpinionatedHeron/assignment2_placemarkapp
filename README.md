# assignment2_placemarkapp
# Placemark Svelte

A location bookmarking app built with SvelteKit 5. Save and organize your favorite places with interactive maps and charts.

## Features

- Save locations with coordinates and descriptions
- Organize locations into folders
- Interactive maps with multiple views
- Charts showing location data
- User authentication and sessions
- Responsive design

## Software

- **SvelteKit 5** - Frontend framework
- **TypeScript** - Type safety
- **Leaflet** - Interactive maps
- **Bulma CSS** - Styling
- **Axios** - API calls

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the backend API**
   - Must run on `http://localhost:3000`
   - See API endpoints below

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Go to `http://localhost:5173`

## Required API Endpoints

Your backend should provide these endpoints:

```
POST /api/users                    # User signup
POST /api/users/authenticate       # User login
GET  /api/folders                  # Get user folders
POST /api/folders                  # Create folder
DELETE /api/folders/:id            # Delete folder
GET  /api/locations                # Get user locations
POST /api/folders/:id/locations    # Add location to folder
DELETE /api/locations/:id          # Delete location

```
## Main Pages

- **Home** (`/`) - Welcome screen
- **Folders** (`/folder`) - Create and manage folders
- **Locations** (`/location`) - Add new locations
- **Maps** (`/maps`) - View locations on maps
- **Charts** (`/charts`) - Location data visualization
- **Reports** (`/report`) - List all saved locations


## How It Works

1. **Sign up/Login** - Create account or login
2. **Create Folders** - Organize your locations
3. **Add Locations** - Save places with coordinates and details
4. **View Maps** - See your locations on interactive maps
5. **Check Charts** - Visualize your data

## Maps

- **Multiple layers** - Terrain and satellite views
- **Category grouping** - Group by location type
- **Folder grouping** - Group by folder
- **Custom markers** - Show location details

## Requirements

- Node.js 18+
- Backend API running on localhost:3000
- Modern web browser