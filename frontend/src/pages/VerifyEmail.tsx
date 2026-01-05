import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authApi } from '../services/api/auth.api';

interface VerifyEmailForm {
  code: string;
}

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailForm>();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Redirect to signin if no email is present
      navigate('/signin');
    }
  }, [location, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (data: VerifyEmailForm) => {
    try {
      await authApi.verifyEmail({ email, code: data.code });
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Verification failed. Please try again.'
      );
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    try {
      await authApi.resendVerification({ email });
      toast.success('Verification code sent!');
      setTimer(60); // 60 seconds cooldown
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-light-grey">
          We sent a verification code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-grey py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/5">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-light-grey">
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  type="text"
                  maxLength={6}
                  {...register('code', {
                    required: 'Verification code is required',
                    minLength: {
                      value: 6,
                      message: 'Code must be 6 digits',
                    },
                    maxLength: {
                      value: 6,
                      message: 'Code must be 6 digits',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border-0 rounded-md shadow-sm placeholder-gray-500 bg-darker-grey text-white focus:outline-none focus:ring-green focus:border-green sm:text-sm"
                  placeholder="123456"
                />
                {errors.code && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green hover:bg-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green disabled:opacity-50 cursor-pointer">
                {isSubmitting ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-grey text-light-grey">
                  Didn't receive the code?
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleResendCode}
                disabled={timer > 0}
                className="text-green hover:text-green/80 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
