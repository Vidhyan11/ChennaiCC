import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useJobStore } from '../stores/jobStore';
import { getUsers } from '../utils/mockData';
import { formatCurrency } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { JobTimer } from '../components/JobTimer';

export const DashboardManager: React.FC = () => {
  const { user } = useAuthStore();
  const { jobs, loadJobs } = useJobStore();

  useEffect(() => {
    loadJobs();
    
    // Auto-refresh jobs every 5 seconds for real-time city-wide monitoring
    const interval = setInterval(() => {
      loadJobs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadJobs]);

  if (!user) return null;

  const users = getUsers();
  const supervisors = users.filter(u => u.role === 'supervisor');
  const allWorkers = users.filter(u => u.role === 'worker' || u.role === 'senior-worker');
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  
  const totalBonuses = allWorkers.reduce((sum, w) => {
    return sum + w.earningsHistory.filter(e => e.type === 'bonus').reduce((s, e) => s + e.amount, 0);
  }, 0);

  // Mock monthly trend data
  const monthlyData = [
    { month: 'Jan', jobs: 450, bonuses: 90000 },
    { month: 'Feb', jobs: 520, bonuses: 104000 },
    { month: 'Mar', jobs: 480, bonuses: 96000 },
    { month: 'Apr', jobs: 550, bonuses: 110000 },
    { month: 'May', jobs: 600, bonuses: 120000 },
    { month: 'Jun', jobs: 580, bonuses: 116000 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Manager Dashboard - Chennai Overview</h1>
        <div className="flex items-center space-x-6 text-sm">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            All Zones
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Supervisors: {supervisors.length}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Workers: {allWorkers.length}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Daily Tasks</div>
          <div className="text-3xl font-bold text-purple-600">
            {user.completedToday}/{user.dailyQuota}
          </div>
          <div className="text-xs text-gray-500 mt-1">Reports</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Jobs Today</div>
          <div className="text-3xl font-bold text-green-600">
            {completedJobs.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Completed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Pending Jobs</div>
          <div className="text-3xl font-bold text-orange-600">
            {pendingJobs.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Across all zones</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Bonuses Paid</div>
          <div className="text-3xl font-bold text-yellow-600">
            {formatCurrency(totalBonuses)}
          </div>
          <div className="text-xs text-gray-500 mt-1">This month</div>
        </div>
      </div>

      {/* All Active Jobs with Timers */}
      {jobs.filter(j => j.status === 'accepted').length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            All Active Jobs with Timers ({jobs.filter(j => j.status === 'accepted').length})
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.filter(j => j.status === 'accepted').map((job) => {
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
          <div>
            <div className="text-gray-600 mb-2">Management reports completed</div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-purple-600">
                {user.completedToday} / {user.dailyQuota}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full"
                  style={{ width: `${(user.completedToday / user.dailyQuota) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Salary</h2>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {formatCurrency(user.salary)}
            </div>
            <div className="text-sm text-gray-500">Fixed monthly income</div>
          </div>
        </div>
      </div>

      {/* Monitor Supervisors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Monitor Supervisors</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Workers</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jobs Today</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {supervisors.map((supervisor) => {
                const zoneWorkers = allWorkers.filter(w => w.zone === supervisor.zone);
                const zoneJobs = jobs.filter(j => j.zone === supervisor.zone && j.status === 'completed');
                
                return (
                  <tr key={supervisor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{supervisor.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{supervisor.zone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{zoneWorkers.length}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{zoneJobs.length}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* City-Wide Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">City-Wide Statistics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="jobs" stroke="#8b5cf6" name="Jobs" />
                <Line yAxisId="right" type="monotone" dataKey="bonuses" stroke="#eab308" name="Bonuses (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Jobs This Month</div>
              <div className="text-3xl font-bold text-purple-600">3,180</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Vehicles Dispatched</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">2,100</div>
                  <div className="text-xs text-gray-500">Small Trucks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">1,080</div>
                  <div className="text-xs text-gray-500">Large Trucks</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Average Response Time</div>
              <div className="text-3xl font-bold text-blue-600">42 min</div>
            </div>
          </div>
        </div>
      </div>

      {/* All Pending Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          All Pending Jobs ({pendingJobs.length})
        </h2>
        {pendingJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending jobs across all zones
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Job ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Zone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingJobs.slice(0, 10).map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{job.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{job.zone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{job.location.address}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        job.garbageLevel === 'high' ? 'bg-red-100 text-red-800' :
                        job.garbageLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.garbageLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {job.vehicle === 'small' ? '🚐 Small' : '🚛 Large'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
