import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../services/api/auth.api';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await authApi.forgotPassword({ email: data.email });
      toast.success('If an account exists, a reset code has been sent!');
      // We don't necessarily redirect here to prevent email enumeration,
      // but the user should know they need to check their email and go to reset page.
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-light-grey">
          Enter your email and we'll send you a 6-digit code to reset your
          password.
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
              <div className="mt-1">
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
                  className="appearance-none block w-full px-3 py-2 border-0 rounded-md shadow-sm placeholder-gray-500 bg-darker-grey text-white focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green hover:bg-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green disabled:opacity-50 cursor-pointer">
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              to="/signin"
              className="font-medium text-green hover:text-green/80">
              Back to sign in
            </Link>
            <Link
              to="/reset-password"
              className="font-medium text-green hover:text-green/80">
              Already have a code?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
