import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { authService, RegisterData } from "../../services/authService";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tipo: 'cliente' // Set default tipo to 'cliente'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
        setErrors({ terms: ["You must agree to the terms and conditions."] });
        return;
    }
    setLoading(true);
    setErrors({});

    try {
      const registerPayload: RegisterData = {
        ...formData,
      };
      const response = await authService.register(registerPayload); // Capture response
      if (response.redirect_url) { // Use redirect_url from backend
        navigate(response.redirect_url);
      } else {
        navigate("/"); // Fallback
      }
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.errors) {
            setErrors(err.response.data.errors);
        } else {
            setErrors({ general: ["Ocorreu um erro inesperado. Tente novamente."] });
        }
        console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create your account!
            </p>
          </div>
          <div>
            {/* Social login buttons mantidos */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <Label>Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                </div>

                <div>
                  <Label>Email<span className="text-error-500">*</span></Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
                </div>

                <div>
                  <Label>Password<span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                    </span>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                </div>

                <div>
                  <Label>Confirm Password<span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      name="password_confirmation"
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      required
                    />
                    <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
                    </span>
                  </div>
                </div>

                {errors.general && <p className="mt-1 text-xs text-center text-red-500">{errors.general[0]}</p>}

                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account you agree to the{" "}
                    <Link to="#" className="text-gray-800 dark:text-white/90">Terms and Conditions</Link>, and our{" "}
                    <Link to="#" className="text-gray-800 dark:text-white">Privacy Policy</Link>
                  </p>
                </div>
                 {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms[0]}</p>}

                <div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}