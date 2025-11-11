import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

interface LoginForm {
  username: string;
  password: string;
  role: UserRole;
}

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: LoginForm) => {
    setIsLoading(true);
    
    const success = login(data.username, data.password, data.role);
    
    if (success) {
      toast.success('Login successful!');
      
      // Navigate to role-specific dashboard
      switch (data.role) {
        case 'worker':
          navigate('/dashboard/worker');
          break;
        case 'senior-worker':
          navigate('/dashboard/senior-worker');
          break;
        case 'supervisor':
          navigate('/dashboard/supervisor');
          break;
        case 'manager':
          navigate('/dashboard/manager');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-lg rotate-45 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white text-2xl font-bold -rotate-45">CC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Login</h1>
          <p className="text-gray-600 mt-2">Chennai CleanUp - GCC</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              id="role"
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-blue focus:border-transparent"
            >
              <option value="">Choose your role...</option>
              <option value="worker">Worker</option>
              <option value="senior-worker">Senior Worker</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-blue focus:border-transparent"
              placeholder="e.g., worker1"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chennai-blue focus:border-transparent"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Worker: worker1 / pass123</p>
            <p>• Senior Worker: senior1 / pass123</p>
            <p>• Supervisor: supervisor1 / pass123</p>
            <p>• Manager: manager1 / pass123</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-chennai-blue hover:underline text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
