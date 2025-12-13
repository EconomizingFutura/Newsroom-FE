import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import type { LoginResponse } from "@/types/apitypes";
import { POST } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import loginbg from "@/assets/loginbg.svg";
import { toast, Toaster } from "sonner";
import Loader from "@/components/Loader";
import type { UserRole } from "@/components/SideBar";
import { USER_ROLE } from "@/utils/utils";
import loginbanner from "@/assets/loginbanner.svg";

type FormData = {
  email: string;
  password: string;
};

export default function NewLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  //   const currentRole: UserRole = (USER_ROLE() as UserRole) || "REPORTER";
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await POST<LoginResponse>(API_LIST.LOGIN, {
        email: data.email,
        password: data.password,
      });

      if (response.accessToken) {
        navigate("/news-feeds");
        localStorage.setItem("token", response.accessToken);
        const [, payload] = response.accessToken.split(".");
        const decoded = JSON.parse(
          atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (decoded?.username) {
          localStorage.setItem("username", decoded.username);
        }
        if (decoded?.role) {
          localStorage.setItem("role", decoded.role);
        }
      } else {
        toast.error("Invalid Credentials");
        reset();
      }
      setLoading(false);
    } catch (error: unknown) {
      console.error("Login error:", error);
      reset();
      const err = error as { message?: string };
      toast.error(err.message || "Invalid Credentials");
      setLoading(false);
    }
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };
  return (
    <div className="min-h-screen w-full overflow-y-hidden">
      <Toaster position="top-center" richColors />

      <main className="min-h-screen w-full flex flex-col lg:flex-row bg-amber-700">
        {/* Left Section (Image + Logo) */}
        <div
          className="
        w-full lg:w-1/2 
        flex items-center justify-center 
        bg-white 
        bg-cover bg-center
        min-h-[40vh] lg:min-h-full
      "
          style={{ backgroundImage: `url(${loginbg})` }}
        >
          <div className="flex-shrink-0 p-6">
            <img
              src={loginbanner}
              alt="Tamil Nadu Govt Logo"
              //   className="w-40 lg:w-60 h-auto"
            />
          </div>
        </div>

        {/* Right Section (Form) */}
        <div
          className="
        flex 
        w-full lg:w-1/2 
        bg-[#dff4df] 
        items-center 
        justify-center 
        min-h-[60vh] lg:min-h-full 
        pt-6 pb-12 px-6 sm:px-10
      "
        >
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
              {/* Title */}
              <div className="flex items-center justify-center font-space-Grotesk">
                <h1 className="text-[#008001] font-bold text-2xl">INRP</h1>
              </div>

              {/* Subtitle */}
              <div className="flex flex-col gap-4 items-center">
                <p className="text-[16px] text-[#6A7282] font-semibold text-center">
                  Enter your email to get started
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-[#1E2939]"
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
                      className="h-[40px] w-full pl-4 pr-10 bg-[#F7FBF7] border border-[#ECECEC] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
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
                    className="block text-sm font-medium mb-2 text-[#1E2939]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="******"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="h-[40px] w-full pl-4 pr-10 bg-[#F7FBF7] border border-[#ECECEC] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {!showPassword ? (
                        <EyeOff className="h-5 w-5 text-black" />
                      ) : (
                        <Eye className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#008001] hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Login {loading && <Loader width="12" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
