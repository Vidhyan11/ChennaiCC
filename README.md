# Chennai CleanUp - Waste Management App

A comprehensive waste management application for Greater Chennai Corporation (GCC) that allows the public to report illegal garbage dumps and enables GCC workers to accept volunteer jobs for bonus pay.

## Features

### Public Features
- **Report Garbage Dumps**: Upload photos with location and description
- **AI-Powered Analysis**: Mock AI analyzes garbage level (low/medium/high) and assigns appropriate vehicle
- **Real-time Tracking**: Track report status and estimated ETA

### Worker Features (Worker & Senior Worker)
- **Dashboard**: View daily tasks, earnings, and volunteer job opportunities
- **Job Management**: Accept and complete volunteer jobs for bonus pay
- **Earnings Tracking**: Monitor fixed salary and bonus income
- **Workers**: ₹15,000/month + ₹200/job bonus
- **Senior Workers**: ₹20,000/month + ₹300/job bonus

### Supervisor Features
- **Zone Management**: Monitor workers in assigned zone (North/Central/South)
- **Worker Tracking**: View worker status, tasks completed, and bonuses earned
- **Zone Statistics**: Track jobs completed and performance metrics
- **Fixed Salary**: ₹25,000/month

### Manager Features
- **City-Wide Overview**: Monitor all zones and supervisors
- **Performance Analytics**: View trends, statistics, and KPIs
- **Job Management**: Override and assign jobs across all zones
- **Fixed Salary**: ₹40,000/month

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Maps**: Leaflet.js with OpenStreetMap
- **Charts**: Recharts
- **Image Upload**: react-dropzone
- **Notifications**: react-hot-toast
- **Storage**: localStorage (mock backend)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Demo Credentials

### Workers
- Username: `worker1` to `worker10`
- Password: `pass123`
- Role: Worker

### Senior Workers
- Username: `senior1` to `senior10`
- Password: `pass123`
- Role: Senior Worker

### Supervisors
- Username: `supervisor1` to `supervisor3`
- Password: `pass123`
- Role: Supervisor
- Zones: North, Central, South

### Manager
- Username: `manager1`
- Password: `pass123`
- Role: Manager

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── pages/           # Page components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Report.tsx
│   ├── DashboardWorker.tsx
│   ├── DashboardSeniorWorker.tsx
│   ├── DashboardSupervisor.tsx
│   ├── DashboardManager.tsx
│   ├── Jobs.tsx
│   └── Profile.tsx
├── stores/          # Zustand state management
│   ├── authStore.ts
│   └── jobStore.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   ├── mockData.ts
│   ├── imageAnalysis.ts
│   └── helpers.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Key Features Implementation

### Mock AI Image Analysis
- Uses HTML5 Canvas API to analyze pixel data
- Calculates dark pixel ratio and average brightness
- Determines garbage level based on analysis
- Assigns vehicle type (small/large truck) automatically

### Role-Based Access Control
- Protected routes based on user role
- Role-specific dashboards and features
- Hierarchical permission system

### Real-Time Updates
- Auto-refresh job status
- Worker availability tracking
- Bonus calculation and earnings tracking

### Chennai Zones
- North Zone
- Central Zone
- South Zone
- Zone-based job filtering and assignment

## Color Scheme

- **Primary Blue**: #1E3A8A (Dark Blue - Chennai theme)
- **Background**: White/Gray tones
- **Accents**: Role-specific colors (Blue for Workers, Purple for Manager)
- **Device Location**: Geolocation API for automatic location detection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a demo project for educational purposes.

## Author

Built with React, TypeScript, and Tailwind CSS for Chennai CleanUp - GCC Waste Management System.
