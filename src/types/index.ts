export type UserRole = 'public' | 'worker' | 'senior-worker' | 'supervisor' | 'manager';
export type Zone = 'North' | 'Central' | 'South';
export type UserStatus = 'free' | 'busy';
export type GarbageLevel = 'low' | 'medium' | 'high';
export type VehicleType = 'small' | 'large';
export type JobStatus = 'pending' | 'accepted' | 'completed';

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  zone?: Zone;
  salary: number;
  dailyQuota: number;
  bonusRate: number;
  status: UserStatus;
  earningsHistory: EarningRecord[];
  completedToday: number;
  totalVolunteerJobs: number;
}

export interface EarningRecord {
  date: string;
  jobId: string;
  amount: number;
  type: 'bonus' | 'salary';
}

export interface Job {
  id: string;
  reporterName: string;
  reporterContact?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  imageUrl: string;
  garbageLevel: GarbageLevel;
  vehicle: VehicleType;
  status: JobStatus;
  assignedTo?: string;
  assignedWorkerName?: string;
  bonusPaid: boolean;
  timestamp: string;
  completedAt?: string;
  zone: Zone;
  estimatedETA?: number;
  acceptedAt?: string;
  timerDuration?: number; // in minutes based on garbage level
  timerStartedAt?: number; // timestamp when timer started
}

export interface ZoneStats {
  zone: Zone;
  jobsToday: number;
  bonusesPaid: number;
  workersCount: number;
  seniorWorkersCount: number;
}
