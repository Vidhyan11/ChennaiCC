import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuthStore } from '../stores/authStore';
import { useJobStore } from '../stores/jobStore';
import { formatCurrency, formatDateTime } from '../utils/helpers';

export const DashboardWorker: React.FC = () => {
  const { user } = useAuthStore();
  const { jobs, loadJobs, getUserJobs } = useJobStore();

  useEffect(() => {
    loadJobs();
    
    // Auto-refresh jobs every 5 seconds
    const interval = setInterval(() => {
      loadJobs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadJobs]);

  if (!user) return null;

  const userJobs = getUserJobs(user.id);
  const pendingJobs = jobs.filter(j => j.status === 'pending' && j.zone === user.zone);
  const completedJobs = userJobs.filter(j => j.status === 'completed');
  
  // Calculate earnings
  const monthlyBonus = user.earningsHistory
    .filter(e => e.type === 'bonus')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const earningsData = [
    { name: 'Fixed Salary', value: user.salary, color: '#1E3A8A' },
    { name: 'Bonuses', value: monthlyBonus, color: '#FFD700' }
  ];

  const todayEarnings = user.earningsHistory
    .filter(e => {
      const today = new Date().toDateString();
      const earnDate = new Date(e.date).toDateString();
      return today === earnDate;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <div className="flex items-center space-x-6 text-sm">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Zone: {user.zone}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Status: {user.status === 'free' ? '● Available' : '● Busy'}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
            Rank: Worker
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Today's Tasks</div>
          <div className="text-3xl font-bold text-chennai-blue">
            {user.completedToday}/{user.dailyQuota}
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className="bg-chennai-blue h-2 rounded-full"
              style={{ width: `${(user.completedToday / user.dailyQuota) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Volunteer Jobs</div>
          <div className="text-3xl font-bold text-blue-600">
            {user.totalVolunteerJobs}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total completed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Today's Earnings</div>
          <div className="text-3xl font-bold text-yellow-600">
            {formatCurrency(todayEarnings)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Bonuses earned</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Available Jobs</div>
          <div className="text-3xl font-bold text-purple-600">
            {pendingJobs.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">In your zone</div>
        </div>
      </div>

      {/* Fixed Tasks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Fixed Tasks</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-600 mb-2">
              Regular collection routes assigned by supervisor
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-chennai-blue">
                {user.completedToday} / {user.dailyQuota}
              </span>
              <span className="text-sm text-gray-500">collections completed</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Progress</div>
            <div className="text-3xl font-bold text-chennai-blue">
              {Math.round((user.completedToday / user.dailyQuota) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Salary & Bonuses Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Earnings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-gray-700">Fixed Salary</span>
              <span className="text-xl font-bold text-chennai-blue">
                {formatCurrency(user.salary)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
              <span className="text-gray-700">Volunteer Bonuses</span>
              <span className="text-xl font-bold text-yellow-600">
                {formatCurrency(monthlyBonus)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded border-t-2 border-gray-300">
              <span className="text-gray-800 font-semibold">Total Income</span>
              <span className="text-2xl font-bold text-gray-800">
                {formatCurrency(user.salary + monthlyBonus)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Income Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={earningsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {earningsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Volunteer Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Available Volunteer Jobs ({pendingJobs.length})
          </h2>
          <Link
            to="/jobs"
            className="text-chennai-blue hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Earn bonuses: <span className="font-semibold text-green-600">Low ₹200</span>, <span className="font-semibold text-yellow-600">Medium ₹300</span>, <span className="font-semibold text-red-600">High ₹500</span>
        </div>
        {pendingJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending jobs in your zone at the moment
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingJobs.slice(0, 4).map((job) => (
              <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <img
                    src={job.imageUrl}
                    alt="Dump"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        job.garbageLevel === 'high' ? 'bg-red-100 text-red-800' :
                        job.garbageLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.garbageLevel.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {job.vehicle === 'small' ? '🚐 Small Truck' : '🚛 Large Truck'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">{job.location.address}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(job.timestamp)}</div>
                  </div>
                </div>
                <Link
                  to="/jobs"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Completed Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Completed Jobs ({completedJobs.length})
        </h2>
        {completedJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No completed volunteer jobs yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Job ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Completed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {completedJobs.slice(0, 5).map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{job.id}</td>
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
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {job.completedAt ? formatDateTime(job.completedAt) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      {formatCurrency(user.bonusRate)}
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
