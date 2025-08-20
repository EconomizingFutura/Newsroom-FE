"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import tnlogo from "../assets/tngovtlogo.png";
import cijlogo from "../assets/cijlogo.png";
import mkstalin from "../assets/mkstalin.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Tamil Nadu Government Logo */}
          <div className="flex-shrink-0">
            <img
              src={tnlogo}
              alt="Tamil Nadu Govt Logo"
              className="w-40 h-auto"
            />
          </div>

          {/* Title */}
          <div className=" text-center px-8">
            <img
              src={cijlogo}
              alt="Tamil Nadu Govt Logo"
              className="w-[430px] h-auto"
            />
          </div>

          {/* Official Photo */}
          <div className="flex-shrink-0">
            <img
              src={mkstalin}
              alt="Tamil Nadu Govt Logo"
              className="w-40 h-auto"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-green-300 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-4 border-green-300 rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-40 h-40 border-4 border-green-300 rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 border-4 border-green-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-36 h-36 border-4 border-green-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 border-4 border-green-300 rounded-full"></div>
        </div>

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
                <div className="flex flex-col gap-[12px]">
                  {/* <div> 
                    <h2 className="text-2xl font-bold text-green-700">
                      NewsRoom Reporter
                    </h2>
                  </div> */}
                  <div>
                    <p className="text-[16px] leading-none tracking-normal text-center align-middle text-[#6A7282]">
                      Enter your email to get started
                    </p>
                  </div>
                </div>
              </div>
              {/* Form */}
              <form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium  mb-[8px] text-[14px] leading-none tracking-[0px] text-[#1E2939]"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[40px] pl-4 pr-10 py-3 border bg-[#F7FBF7] border-gray-[#ECECEC] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#000000]" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-[8px] text-[14px] leading-none tracking-[0px] text-[#1E2939]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[40px] bg-[#F7FBF7] pl-4 pr-10 py-3 border border-gray-[#ECECEC] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#000000]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#000000]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#008001] hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
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
