import React, { useState, useEffect } from 'react';
import { Label } from "../../ui/Login_ui/label";
import { Input } from "../../ui/Login_ui/input";
import { cn } from "../../../lib/utils";
import validator from 'validator';
import { useMutation } from '@tanstack/react-query';
import { generateOtp, signupUser, verify } from '../../../service/Api/userApis';
import { SignupCredentials } from '../../../lib/interface';
import { useDispatch } from 'react-redux';
import { login } from '../../../service/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { useToast } from '../../../@/hooks/use-toast';
import debounce from 'lodash.debounce';

export function SignupForm() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState({ status: true, count: 30 });
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password: '',
    twitterPassword: '',
  });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast}=useToast()

  const validate = (value: string) => {
    const errors: string[] = [];

    // if (!validator.isLength(value, { min: 6 })) {
    //   errors.push('Password must be at least 6 characters long');
    // }
    // if (!/[a-z]/.test(value)) {
    //   errors.push('Password must contain at least one lowercase letter');
    // }
    // if (!/[A-Z]/.test(value)) {
    //   errors.push('Password must contain at least one uppercase letter');
    // }
    // if (!/[0-9]/.test(value)) {
    //   errors.push('Password must contain at least one number');
    // }
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    //   errors.push('Password must contain at least one special character');
    // }

    // if (errors.length === 0) {
    //   setErrorMessages(['']);
    // } else {
    //   setErrorMessages(errors);
    // }
  };

  const handleFocus = () => {
    setPasswordFocus(true);
  };

  const handleBlur = () => {
    setPasswordFocus(false);
  };

  const startCountdown = () => {
    setOtpStatus({ status: true, count: 30 });
  };

  const confirmPassword=()=>{
    return formData.password===formData.twitterPassword
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (otpStatus.status && otpStatus.count > 0) {
      interval = setInterval(() => {
        setOtpStatus((prev) => ({ ...prev, count: prev.count - 1 }));
      }, 1000);
    }

    if (otpStatus.count === 0) {
      setOtpStatus({ status: false, count: 30 }); // Enable the button after countdown ends
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStatus]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      if (step === 1) {
        await generateOtp(formData.email);
        setStep(step + 1); 
        startCountdown();  
      } else if (step === 3) {
        if (confirmPassword()) {
          mutate({
            companyName: formData.company,
            email: formData.email,
            password: formData.password,
          });
        } else {
          toast({
            description: 'Password is not matching',
            variant: 'default',
          });
        }
      }
    } catch (error: any) {
      toast({
        description: error.message || 'An unexpected error occurred while generating OTP',
        variant: 'destructive',
      });
    }
  };
  
  const handleOtpVerification = debounce(async (otp: string) => {
    try {
      const res = await verify(formData.email, otp);
      console.log("OTP verified:", formData.email, otp);
      if (res) {
        setStep(3);
        toast({
          description: 'OTP Verification sucess',
          variant: 'default',
        })

      } 
    } catch (error) {
      setOtp('');  
      toast({
        title: 'OTP Verification Failed',
        description: 'The OTP you entered is invalid or expired. Please try again.',
        variant: 'destructive',
      });
    }
  }, 1000); // Adjusted debounce time
  
  
  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'otp') {
      const sanitizedOtp = value.replace(/\D/g, '').slice(0, 6);
      setOtp(sanitizedOtp);  
      console.log(sanitizedOtp, "Updated OTP");
      if (sanitizedOtp.length === 6) {
        handleOtpVerification(sanitizedOtp); 
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }
    if (id === 'password') {
      validate(value);
    }
  };
  
  
  const { mutate, isPending, isError, error, data } = useMutation<any, Error, SignupCredentials>({
    mutationFn: (credentials) => signupUser(credentials),
    onSuccess: (data) => {
      // Assuming data contains token and user info
      const { token, user } = data;
  
      // Dispatch login action with token, user ID, and company name
      dispatch(
        login({
          accessToken: token,
          userId: user.id,
          companyName: user.companyName,
        })
      );
  
      // Log success and navigate to the candidates dashboard
      console.log("Signup successful:", data);
      navigate("/dash", { replace: true });
    },
    onError: (error) => {
      if ((error as any).response?.data?.error) {
        const serverError = (error as any).response.data.error;
        toast({
          title: 'Signup Error',
          description: serverError || 'An unexpected error occurred during signup.',
          variant: 'destructive', 
        });
        console.error("Signup error:", serverError);
      } else {
        toast({
          title: 'Unexpected Error',
          description: 'Something went wrong. Please try again later.',
          variant: 'destructive', 
        });
        console.error("Unexpected error:", error);
      }
    },
  });
  

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
      <h2 className="font-bold text-xl text-neutral-800">
        Welcome to Octaview
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="company">Company name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder=""
                type="text"
                required
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="projectmayhem@fc.com"
                type="email"
                required
              />
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
            >
              Next &rarr;
              <BottomGradient />
            </button>
          </>
        )}
       {step === 2 && (
  <>
    <LabelInputContainer className="mb-4">
      <Label htmlFor="otp">OTP</Label>
      <Input
        id="otp"
        value={otp}
        onChange={(e) => {
          handleInputChange(e);
          if (e.target.value.length === 6 && e.target.value === otp) {
            handleOtpVerification(otp); 
          }
        }}
        
        placeholder="OTP"
        type="text"
        maxLength={6}
        onPaste={(e) => {
          e.preventDefault();
          alert("Pasting is not allowed in this field.");
        }}
      />
      <Button
        variant="outline"
        disabled={otpStatus.status} // Initially disabled, also disabled during countdown
        onClick={() => {
          if (!otpStatus.status) {
            startCountdown(); // Restart countdown when clicked
            generateOtp(formData.email);
            setOtp('');  // Reset OTP after generating new one
          }
        }}
      >
        {otpStatus.status ? `${otpStatus.count} sec` : `Resend OTP`}
      </Button>
    </LabelInputContainer>
  </>
)}



        {step === 3 && (
          <>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                type="password"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {passwordFocus && errorMessages.length > 0 && (
                <div className="text-sm text-red-500 mt-2">
                  {errorMessages.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </LabelInputContainer>

            <LabelInputContainer className="mb-8">
              <Label htmlFor="twitterPassword">Confirm password</Label>
              <Input
                id="twitterPassword"
                value={formData.twitterPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                type="password"
              />
            </LabelInputContainer>
            <button
              className="bg-gradient-to-br relative group/btn from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
              type="submit"
            >
              Sign up &rarr;
              <BottomGradient />
            </button>
          </>
        )}

        <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
