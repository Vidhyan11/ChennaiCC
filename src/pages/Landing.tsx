import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <div className="w-24 h-24 bg-blue-500 rounded-lg rotate-45 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white text-4xl font-bold -rotate-45">CC</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Chennai CleanUp</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">
            Greater Chennai Corporation
          </p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Making Chennai cleaner, one report at a time. Report illegal garbage dumps
            and help our workers keep the city clean.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Public Reporting Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Report Garbage Dump
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Spotted an illegal garbage dump? Take a photo and report it instantly.
              Our AI will assess the situation and dispatch the right vehicle.
            </p>
            <Link
              to="/report"
              className="block w-full text-center bg-white text-chennai-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg border-2 border-chennai-blue"
            >
              Report Now
            </Link>
          </div>

          {/* Staff Login Card */}
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              GCC Staff Login
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Workers, Supervisors, and Managers: Access your dashboard to manage
              jobs, track earnings, and monitor operations.
            </p>
            <Link
              to="/login"
              className="block w-full text-center bg-white text-chennai-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg border-2 border-chennai-blue"
            >
              Staff Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">📸</div>
              <h4 className="text-xl font-bold mb-2">1. Report</h4>
              <p className="text-green-100">
                Take a photo of the illegal dump and submit with location details.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold mb-2">2. AI Analysis</h4>
              <p className="text-green-100">
                Our system analyzes the garbage level and assigns the right vehicle.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🚛</div>
              <h4 className="text-xl font-bold mb-2">3. Cleanup</h4>
              <p className="text-green-100">
                Available workers accept the job and clean up the area for bonus pay.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center text-white">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-green-100">Jobs Completed</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center text-white">
            <div className="text-3xl font-bold mb-2">20</div>
            <div className="text-green-100">Active Workers</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center text-white">
            <div className="text-3xl font-bold mb-2">3</div>
            <div className="text-green-100">Chennai Zones</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-center text-white">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-green-100">Service</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Chennai CleanUp - Greater Chennai Corporation
          </p>
          <p className="text-xs text-green-200 mt-2">
            Powered by AI • Serving North, Central & South Chennai
          </p>
        </div>
      </footer>
    </div>
  );
};
