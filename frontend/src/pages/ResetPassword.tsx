import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../services/api/auth.api';

interface ResetPasswordForm {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>();

  const password = watch('newPassword');

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await authApi.resetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });
      toast.success(
        'Password reset successfully! Please sign in with your new password.'
      );
      navigate('/signin');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Failed to reset password. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-light-grey">
          Enter the code we sent to your email and your new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-grey py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/5">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-light-grey">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="mt-1 appearance-none block w-full px-3 py-2 border-0 rounded-md shadow-sm placeholder-gray-500 bg-darker-grey text-white focus:outline-none focus:ring-green focus:border-green sm:text-sm"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-light-grey">
                6-digit Code
              </label>
              <input
                id="code"
                type="text"
                maxLength={6}
                {...register('code', {
                  required: 'Code is required',
                  minLength: { value: 6, message: 'Code must be 6 digits' },
                  maxLength: { value: 6, message: 'Code must be 6 digits' },
                })}
                className="mt-1 appearance-none block w-full px-3 py-2 border-0 rounded-md shadow-sm placeholder-gray-500 bg-darker-grey text-white focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                placeholder="123456"
              />
              {errors.code && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-light-grey">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                className="mt-1 appearance-none block w-full px-3 py-2 border-0 rounded-md shadow-sm placeholder-gray-500 bg-darker-grey text-white focus:outline-none focus:ring-green focus:border-green sm:text-sm"
              />
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-light-grey">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className="mt-1 appearance-none block w-full px-3 py-2 border-0 rounded-md shadow-sm placeholder-gray-500 bg-darker-grey text-white focus:outline-none focus:ring-green focus:border-green sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green hover:bg-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green disabled:opacity-50 cursor-pointer">
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
