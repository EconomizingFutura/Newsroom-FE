import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import tnlogo from "@/assets/tngovtlogo.png";
import cijlogo from "@/assets/cijlogo.png";
import mkstalin from "@/assets/mkstalin.png";
import { useNavigate } from "react-router";
import type { LoginResponse } from "@/types/apitypes";
import { POST } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import loginbg from "@/assets/loginbg.svg";
import { toast, Toaster } from "sonner";
import { string } from "yup";


type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);
    try {
      const response = await POST<LoginResponse>(API_LIST.LOGIN, {
        email: data.email,
        password: data.password,
      });

      console.log(response)


      if (response.accessToken) {
        navigate("/news-feeds");
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("role", "reporter");
        const [, payload] = response.accessToken.split(".");
        const decoded = JSON.parse(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        );

        console.log("accessToken:", decoded);

        if (decoded?.username) {
          localStorage.setItem("username", decoded.username);
        }
      } else {
        toast.error('Invalid Credentials')
        reset()
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
        reset()
      const err = error as { message?: string };
      toast.error(err.message || "Invalid Credentials");
    }


  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };
  return (
    <div className="min-h-screen w-full overflow-y-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-shrink-0">
            <img
              src={tnlogo}
              alt="Tamil Nadu Govt Logo"
              className="w-40 h-auto"
            />
          </div>

          <div className="text-center px-8">
            <img
              src={cijlogo}
              alt="Tamil Nadu Govt Logo"
              className="w-[430px] h-auto"
            />
          </div>

          <div className="flex-shrink-0">
            <img
              src={mkstalin}
              alt="Tamil Nadu Govt Logo"
              className="w-40 h-auto"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-green-50 bg-[#DFF4DF] to-green-100 relative overflow-hidden"
        style={{ backgroundImage: `url(${loginbg})` }}
      >
        {/* Login Form */}
        <div className="flex items-center justify-center min-h-full pt-[6px] pb-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[16px] items-center">
                <img
                  src={tnlogo}
                  alt="Tamil Nadu Govt Logo"
                  className="w-[100px] h-auto"
                />
                <p className="text-[16px] text-[#6A7282] text-center">
                  Enter your email to get started
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-2">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-[8px] text-[#1E2939]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                      className="h-[40px] pl-4 pr-10 bg-[#F7FBF7] border border-[#ECECEC] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#000000]" />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-[8px] text-[#1E2939]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="h-[40px] pl-4 pr-10 bg-[#F7FBF7] border border-[#ECECEC] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {!showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#000000]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#000000]" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#008001] hover:bg-green-700 text-white font-semibold py-3 px-4 mt-2 rounded-lg transition-colors duration-200"
                >
                  Login
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
