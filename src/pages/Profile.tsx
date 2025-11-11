import { useAuthStore } from '../stores/authStore';
import { formatCurrency, formatDateTime } from '../utils/helpers';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const monthlyBonus = user.earningsHistory
    .filter(e => e.type === 'bonus')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl p-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-blue-500 rounded-lg rotate-45 flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-white -rotate-45">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
                {user.role.replace('-', ' ').toUpperCase()}
              </span>
              {user.zone && (
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded">
                  Zone: {user.zone}
                </span>
              )}
              <span className={`px-3 py-1 rounded ${
                user.status === 'free' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {user.status === 'free' ? '● Available' : '● Busy'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Monthly Salary</div>
          <div className="text-3xl font-bold text-chennai-blue">
            {formatCurrency(user.salary)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Fixed income</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Bonuses This Month</div>
          <div className="text-3xl font-bold text-yellow-600">
            {formatCurrency(monthlyBonus)}
          </div>
          <div className="text-xs text-gray-500 mt-1">From {user.earningsHistory.filter(e => e.type === 'bonus').length} jobs</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm mb-1">Total Income</div>
          <div className="text-3xl font-bold text-gray-800">
            {formatCurrency(user.salary + monthlyBonus)}
          </div>
          <div className="text-xs text-gray-500 mt-1">This month</div>
        </div>
      </div>

      {/* Work Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Work Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Username</div>
            <div className="text-lg font-semibold text-gray-800">{user.username}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Employee ID</div>
            <div className="text-lg font-semibold text-gray-800">{user.id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Daily Quota</div>
            <div className="text-lg font-semibold text-gray-800">
              {user.dailyQuota} {user.role.includes('worker') ? 'collections' : 'tasks'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Bonus Rate</div>
            <div className="text-lg font-semibold text-gray-800">
              {user.bonusRate > 0 ? formatCurrency(user.bonusRate) + ' per job' : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Completed Today</div>
            <div className="text-lg font-semibold text-gray-800">
              {user.completedToday} / {user.dailyQuota}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Total Volunteer Jobs</div>
            <div className="text-lg font-semibold text-gray-800">
              {user.totalVolunteerJobs}
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Earnings History ({user.earningsHistory.length} records)
        </h2>
        {user.earningsHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No earnings history yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Job ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {user.earningsHistory.slice().reverse().map((earning, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDateTime(earning.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {earning.jobId}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        earning.type === 'bonus' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {earning.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-green-600">
                      {formatCurrency(earning.amount)}
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
