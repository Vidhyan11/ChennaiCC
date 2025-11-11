import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useJobStore } from '../stores/jobStore';
import { formatDateTime, calculateDistance, getDirectionsUrl } from '../utils/helpers';
import { JobTimer } from '../components/JobTimer';

export const Jobs: React.FC = () => {
  const { user } = useAuthStore();
  const { jobs, loadJobs, acceptJob, completeJob } = useJobStore();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
    
    // Auto-refresh jobs every 5 seconds
    const interval = setInterval(() => {
      loadJobs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadJobs]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const pendingJobs = jobs.filter(j => j.status === 'pending' && j.zone === user.zone);
  const myActiveJobs = jobs.filter(j => j.assignedTo === user.id && j.status === 'accepted');

  const handleAcceptJob = (jobId: string) => {
    if (user.status === 'busy') {
      toast.error('You are currently busy with another job');
      return;
    }

    const success = acceptJob(jobId, user.id);
    if (success) {
      toast.success('Job accepted! Navigate to location to complete it.');
      loadJobs();
    } else {
      toast.error('Failed to accept job. Please try again.');
    }
  };

  const handleCompleteJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    const bonusAmount = job?.garbageLevel === 'high' ? 500 : 
                       job?.garbageLevel === 'medium' ? 300 : 200;
    
    const success = completeJob(jobId, user.id);
    if (success) {
      toast.success(`Job completed! Bonus of ₹${bonusAmount} added to your earnings.`);
      loadJobs();
    } else {
      toast.error('Failed to complete job. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
          <button
            onClick={() => {
              loadJobs();
              toast.success('Jobs refreshed!');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
        <p className="text-gray-600">
          Accept volunteer jobs to earn bonuses: <span className="font-semibold text-green-600">Low ₹200</span>, <span className="font-semibold text-yellow-600">Medium ₹300</span>, <span className="font-semibold text-red-600">High ₹500</span>
        </p>
      </div>

      {/* My Active Jobs */}
      {myActiveJobs.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            My Active Jobs ({myActiveJobs.length})
          </h2>
          <div className="space-y-4">
            {myActiveJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-start space-x-4">
                  <img
                    src={job.imageUrl}
                    alt="Dump"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-gray-800">Job #{job.id}</span>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        job.garbageLevel === 'high' ? 'bg-red-100 text-red-800' :
                        job.garbageLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.garbageLevel.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {job.vehicle === 'small' ? '🚐 Small Truck' : '🚛 Large Truck'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700 mb-3">
                      <p><strong>Location:</strong> {job.location.address}</p>
                      <p><strong>Description:</strong> {job.description}</p>
                      <p><strong>Reporter:</strong> {job.reporterName} ({job.reporterContact})</p>
                      <p><strong>Accepted:</strong> {formatDateTime(job.acceptedAt || job.timestamp)}</p>
                    </div>
                    {/* Timer Display */}
                    <div className="mb-3">
                      <JobTimer job={job} />
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={getDirectionsUrl(job.location.lat, job.location.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
                      >
                        Get Directions
                      </a>
                      <button
                        onClick={() => handleCompleteJob(job.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
                      >
                        Mark as Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Pending Jobs in {user.zone} Zone ({pendingJobs.length})
        </h2>
        {pendingJobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-semibold">No pending jobs available</p>
            <p className="text-sm mt-2">Check back later for new volunteer opportunities</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pendingJobs.map((job) => {
              const distance = calculateDistance(
                13.0827, 80.2707, // Mock current location (Chennai Central)
                job.location.lat,
                job.location.lng
              );
              
              return (
                <div
                  key={job.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    selectedJob === job.id
                      ? 'border-blue-400 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedJob(job.id)}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <img
                      src={job.imageUrl}
                      alt="Dump"
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                      onClick={() => window.open(job.imageUrl, '_blank')}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          job.garbageLevel === 'high' ? 'bg-red-100 text-red-800' :
                          job.garbageLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.garbageLevel.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-600">
                          {job.vehicle === 'small' ? '🚐 Small' : '🚛 Large'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Distance:</strong> ~{distance} km
                      </div>
                      <div className="text-xs text-gray-500">
                        Posted {formatDateTime(job.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div>
                      <strong className="text-gray-700">Location:</strong>
                      <p className="text-gray-600">{job.location.address}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Description:</strong>
                      <p className="text-gray-600">{job.description}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Reporter:</strong>
                      <p className="text-gray-600">{job.reporterName}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptJob(job.id);
                      }}
                      disabled={user.status === 'busy'}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      Accept Job (₹{job.garbageLevel === 'high' ? 500 : job.garbageLevel === 'medium' ? 300 : 200})
                    </button>
                    <a
                      href={getDirectionsUrl(job.location.lat, job.location.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-semibold"
                    >
                      📍
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
