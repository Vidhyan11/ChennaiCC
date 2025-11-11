import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useJobStore } from '../stores/jobStore';
import { getUsers } from '../utils/mockData';
import { formatCurrency } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { JobTimer } from '../components/JobTimer';

export const DashboardSupervisor: React.FC = () => {
  const { user } = useAuthStore();
  const { jobs, loadJobs } = useJobStore();

  useEffect(() => {
    loadJobs();
    
    // Auto-refresh jobs every 5 seconds for real-time monitoring
    const interval = setInterval(() => {
      loadJobs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadJobs]);

  if (!user || !user.zone) return null;

  const users = getUsers();
  const zoneWorkers = users.filter(u => u.zone === user.zone && u.role === 'worker');
  const zoneSeniorWorkers = users.filter(u => u.zone === user.zone && u.role === 'senior-worker');
  const zoneJobs = jobs.filter(j => j.zone === user.zone);
  const completedToday = zoneJobs.filter(j => j.status === 'completed').length;
  
  // Mock weekly data
  const weeklyData = [
    { day: 'Mon', jobs: 12 },
    { day: 'Tue', jobs: 15 },
    { day: 'Wed', jobs: 18 },
    { day: 'Thu', jobs: 14 },
    { day: 'Fri', jobs: 20 },
    { day: 'Sat', jobs: 16 },
    { day: 'Sun', jobs: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard - {user.zone} Zone</h1>
        <div className="flex items-center space-x-6 text-sm">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Zone: {user.zone}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Workers: {zoneWorkers.length + zoneSeniorWorkers.length}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Jobs Today: {completedToday}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Daily Tasks</div>
          <div className="text-3xl font-bold text-blue-600">
            {user.completedToday}/{user.dailyQuota}
          </div>
          <div className="text-xs text-gray-500 mt-1">Inspections</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Total Workers</div>
          <div className="text-3xl font-bold text-green-600">
            {zoneWorkers.length + zoneSeniorWorkers.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">In your zone</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Jobs Today</div>
          <div className="text-3xl font-bold text-purple-600">
            {completedToday}
          </div>
          <div className="text-xs text-gray-500 mt-1">Completed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Pending Jobs</div>
          <div className="text-3xl font-bold text-orange-600">
            {zoneJobs.filter(j => j.status === 'pending').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Awaiting pickup</div>
        </div>
      </div>

      {/* Active Jobs with Timers */}
      {zoneJobs.filter(j => j.status === 'accepted').length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Active Jobs with Timers ({zoneJobs.filter(j => j.status === 'accepted').length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {zoneJobs.filter(j => j.status === 'accepted').map((job) => {
              const assignedWorker = users.find(u => u.id === job.assignedTo);
              return (
              <div key={job.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-gray-800">Job #{job.id}</div>
                    <div className="text-sm text-gray-600">
                      {job.assignedWorkerName}
                      {assignedWorker && <span className="text-blue-600"> • {assignedWorker.zone} Zone</span>}
                    </div>
                    <div className="text-xs text-gray-500">{job.location.address}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    job.garbageLevel === 'high' ? 'bg-red-100 text-red-800' :
                    job.garbageLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {job.garbageLevel.toUpperCase()}
                  </span>
                </div>
                <JobTimer job={job} compact={false} />
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fixed Tasks & Salary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Fixed Tasks</h2>
          <div className="space-y-4">
            <div>
              <div className="text-gray-600 mb-2">Inspection rounds completed</div>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-blue-600">
                  {user.completedToday} / {user.dailyQuota}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(user.completedToday / user.dailyQuota) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Salary</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {formatCurrency(user.salary)}
            </div>
            <div className="text-sm text-gray-500">Fixed monthly income</div>
            <div className="mt-4 text-xs text-gray-600">
              No bonus system for supervisors
            </div>
          </div>
        </div>
      </div>

      {/* Monitor Workers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Monitor Workers</h2>
        
        {/* Workers Tab */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Workers ({zoneWorkers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tasks Today</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Volunteer Jobs</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Bonuses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {zoneWorkers.map((worker) => {
                  const bonusEarned = worker.earningsHistory
                    .filter(e => e.type === 'bonus')
                    .reduce((sum, e) => sum + e.amount, 0);
                  
                  return (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{worker.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          worker.status === 'free' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {worker.status === 'free' ? '● Free' : '● Busy'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {worker.completedToday}/{worker.dailyQuota}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {worker.totalVolunteerJobs}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-green-600">
                        {formatCurrency(bonusEarned)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Senior Workers Tab */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Senior Workers ({zoneSeniorWorkers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tasks Today</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Volunteer Jobs</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Bonuses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {zoneSeniorWorkers.map((worker) => {
                  const bonusEarned = worker.earningsHistory
                    .filter(e => e.type === 'bonus')
                    .reduce((sum, e) => sum + e.amount, 0);
                  
                  return (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{worker.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          worker.status === 'free' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {worker.status === 'free' ? '● Free' : '● Busy'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {worker.completedToday}/{worker.dailyQuota}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {worker.totalVolunteerJobs}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-green-600">
                        {formatCurrency(bonusEarned)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Zone Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Zone Statistics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Jobs Completed This Week</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#2563eb" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Jobs This Week</div>
              <div className="text-3xl font-bold text-blue-600">105</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Garbage Cleared (Estimated)</div>
              <div className="text-3xl font-bold text-green-600">12.5 tons</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Average Response Time</div>
              <div className="text-3xl font-bold text-purple-600">45 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
