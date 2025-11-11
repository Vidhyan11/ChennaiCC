import { create } from 'zustand';
import { Job, JobStatus, User } from '../types';
import { getJobs, saveJobs, getUsers, saveUsers } from '../utils/mockData';
import { generateId } from '../utils/helpers';

interface JobState {
  jobs: Job[];
  loadJobs: () => void;
  addJob: (job: Omit<Job, 'id' | 'timestamp' | 'status' | 'bonusPaid'>) => Job;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  acceptJob: (jobId: string, userId: string) => boolean;
  completeJob: (jobId: string, userId: string) => boolean;
  getJobsByZone: (zone: string) => Job[];
  getJobsByStatus: (status: JobStatus) => Job[];
  getUserJobs: (userId: string) => Job[];
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],

  loadJobs: () => {
    const jobs = getJobs();
    set({ jobs });
  },

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: generateId(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      bonusPaid: false
    };

    const jobs = [...get().jobs, newJob];
    set({ jobs });
    saveJobs(jobs);
    return newJob;
  },

  updateJob: (jobId, updates) => {
    const jobs = get().jobs.map((job) =>
      job.id === jobId ? { ...job, ...updates } : job
    );
    set({ jobs });
    saveJobs(jobs);
  },

  acceptJob: (jobId, userId) => {
    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    const job = get().jobs.find((j) => j.id === jobId);

    if (!user || !job || job.status !== 'pending') {
      return false;
    }

    // Calculate timer duration based on garbage level
    const timerDuration = job.garbageLevel === 'high' ? 240 : 
                         job.garbageLevel === 'medium' ? 120 : 60; // minutes (low=1hr, medium=2hrs, high=4hrs)

    // Update job with timer
    const jobs = get().jobs.map((job) =>
      job.id === jobId
        ? {
            ...job,
            status: 'accepted' as JobStatus,
            assignedTo: userId,
            assignedWorkerName: user.name,
            acceptedAt: new Date().toISOString(),
            timerDuration: timerDuration,
            timerStartedAt: Date.now()
          }
        : job
    );

    // Update user status
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, status: 'busy' as const } : u
    );

    set({ jobs });
    saveJobs(jobs);
    saveUsers(updatedUsers);

    // Auto-free user after timer duration (simulated)
    setTimeout(() => {
      const currentUsers = getUsers();
      const userToFree = currentUsers.find((u) => u.id === userId);
      if (userToFree && userToFree.status === 'busy') {
        const freedUsers = currentUsers.map((u) =>
          u.id === userId ? { ...u, status: 'free' as const } : u
        );
        saveUsers(freedUsers);
      }
    }, timerDuration * 60 * 1000); // convert minutes to milliseconds

    return true;
  },

  completeJob: (jobId, userId) => {
    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    const job = get().jobs.find((j) => j.id === jobId);

    if (!user || !job || job.assignedTo !== userId) {
      return false;
    }

    // Update job
    const jobs = get().jobs.map((j) =>
      j.id === jobId
        ? {
            ...j,
            status: 'completed' as JobStatus,
            completedAt: new Date().toISOString(),
            bonusPaid: true
          }
        : j
    );

    // Calculate bonus based on garbage level
    const bonusAmount = job.garbageLevel === 'high' ? 500 : 
                       job.garbageLevel === 'medium' ? 300 : 200; // low=200, medium=300, high=500
    
    const earningRecord = {
      date: new Date().toISOString(),
      jobId,
      amount: bonusAmount,
      type: 'bonus' as const
    };

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            status: 'free' as const,
            completedToday: u.completedToday + 1,
            totalVolunteerJobs: u.totalVolunteerJobs + 1,
            earningsHistory: [...u.earningsHistory, earningRecord]
          }
        : u
    );

    set({ jobs });
    saveJobs(jobs);
    saveUsers(updatedUsers);

    return true;
  },

  getJobsByZone: (zone) => {
    return get().jobs.filter((job) => job.zone === zone);
  },

  getJobsByStatus: (status) => {
    return get().jobs.filter((job) => job.status === status);
  },

  getUserJobs: (userId) => {
    return get().jobs.filter((job) => job.assignedTo === userId);
  }
}));
