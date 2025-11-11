import { User, Job, Zone } from '../types';

// Chennai zone coordinates (approximate)
const zoneCoordinates: Record<Zone, { lat: number; lng: number }> = {
  North: { lat: 13.1067, lng: 80.2897 },
  Central: { lat: 13.0827, lng: 80.2707 },
  South: { lat: 13.0569, lng: 80.2425 }
};

// Generate mock users
export const generateMockUsers = (): User[] => {
  const users: User[] = [];
  
  // Workers (10 total)
  for (let i = 1; i <= 10; i++) {
    const zone: Zone = i <= 3 ? 'North' : i <= 6 ? 'Central' : 'South';
    users.push({
      id: `worker-${i}`,
      name: `Worker ${i}`,
      username: `worker${i}`,
      password: 'pass123',
      role: 'worker',
      zone,
      salary: 15000,
      dailyQuota: 5,
      bonusRate: 200,
      status: 'free',
      earningsHistory: [],
      completedToday: Math.floor(Math.random() * 4),
      totalVolunteerJobs: Math.floor(Math.random() * 50)
    });
  }
  
  // Senior Workers (10 total)
  for (let i = 1; i <= 10; i++) {
    const zone: Zone = i <= 3 ? 'North' : i <= 6 ? 'Central' : 'South';
    users.push({
      id: `senior-${i}`,
      name: `Senior Worker ${i}`,
      username: `senior${i}`,
      password: 'pass123',
      role: 'senior-worker',
      zone,
      salary: 20000,
      dailyQuota: 4,
      bonusRate: 300,
      status: 'free',
      earningsHistory: [],
      completedToday: Math.floor(Math.random() * 3),
      totalVolunteerJobs: Math.floor(Math.random() * 70)
    });
  }
  
  // Supervisors (3 total, one per zone)
  const zones: Zone[] = ['North', 'Central', 'South'];
  zones.forEach((zone, i) => {
    users.push({
      id: `supervisor-${i + 1}`,
      name: `Supervisor ${zone}`,
      username: `supervisor${i + 1}`,
      password: 'pass123',
      role: 'supervisor',
      zone,
      salary: 25000,
      dailyQuota: 3,
      bonusRate: 0,
      status: 'free',
      earningsHistory: [],
      completedToday: Math.floor(Math.random() * 2),
      totalVolunteerJobs: 0
    });
  });
  
  // Manager (1 total)
  users.push({
    id: 'manager-1',
    name: 'Manager Chennai',
    username: 'manager1',
    password: 'pass123',
    role: 'manager',
    salary: 40000,
    dailyQuota: 2,
    bonusRate: 0,
    status: 'free',
    earningsHistory: [],
    completedToday: Math.floor(Math.random() * 2),
    totalVolunteerJobs: 0
  });
  
  return users;
};

// Generate mock jobs
export const generateMockJobs = (): Job[] => {
  const jobs: Job[] = [];
  const zones: Zone[] = ['North', 'Central', 'South'];
  const addresses = [
    'Anna Nagar West, Chennai',
    'T. Nagar, Chennai',
    'Adyar, Chennai',
    'Velachery, Chennai',
    'Porur, Chennai',
    'Tambaram, Chennai',
    'Chromepet, Chennai',
    'Perungudi, Chennai',
    'Sholinganallur, Chennai',
    'Mylapore, Chennai'
  ];
  
  const descriptions = [
    'Large pile of construction debris blocking the road',
    'Household waste dumped near residential area',
    'Plastic waste accumulated near bus stop',
    'Mixed garbage dump near park entrance',
    'Electronic waste and old furniture dumped',
    'Food waste and organic matter near market',
    'Industrial waste near commercial area',
    'Garden waste and fallen tree branches',
    'Old tires and vehicle parts dumped',
    'General household waste overflow'
  ];
  
  // Generate 10 sample jobs
  for (let i = 1; i <= 10; i++) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const baseCoord = zoneCoordinates[zone];
    const status: 'pending' | 'accepted' | 'completed' = 
      i <= 4 ? 'pending' : i <= 7 ? 'accepted' : 'completed';
    const garbageLevel: 'low' | 'medium' | 'high' = 
      i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low';
    
    jobs.push({
      id: `job-${i}`,
      reporterName: `Citizen ${i}`,
      reporterContact: `+91 9${Math.floor(Math.random() * 900000000) + 100000000}`,
      location: {
        lat: baseCoord.lat + (Math.random() - 0.5) * 0.05,
        lng: baseCoord.lng + (Math.random() - 0.5) * 0.05,
        address: addresses[i - 1]
      },
      description: descriptions[i - 1],
      imageUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23666'%3EGarbage Dump ${i}%3C/text%3E%3C/svg%3E`,
      garbageLevel,
      vehicle: garbageLevel === 'high' ? 'large' : 'small',
      status,
      assignedTo: status !== 'pending' ? `worker-${Math.floor(Math.random() * 10) + 1}` : undefined,
      assignedWorkerName: status !== 'pending' ? `Worker ${Math.floor(Math.random() * 10) + 1}` : undefined,
      bonusPaid: status === 'completed',
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      completedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 43200000).toISOString() : undefined,
      zone,
      estimatedETA: status === 'pending' ? Math.floor(Math.random() * 30) + 30 : undefined
    });
  }
  
  return jobs;
};

// Initialize localStorage with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(generateMockUsers()));
  }
  if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify(generateMockJobs()));
  }
};

// Get users from localStorage
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : generateMockUsers();
};

// Get jobs from localStorage
export const getJobs = (): Job[] => {
  const jobs = localStorage.getItem('jobs');
  return jobs ? JSON.parse(jobs) : generateMockJobs();
};

// Save users to localStorage
export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Save jobs to localStorage
export const saveJobs = (jobs: Job[]) => {
  localStorage.setItem('jobs', JSON.stringify(jobs));
};
