"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Tamil Nadu Government Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-b from-green-600 to-green-700 rounded-full flex items-center justify-center relative">
              <div className="w-16 h-16 bg-yellow-400 rounded-sm flex items-center justify-center">
                <div className="text-red-600 font-bold text-xs text-center leading-tight">
                  <div className="w-12 h-12 bg-yellow-300 rounded-sm flex flex-col items-center justify-center">
                    <div className="w-8 h-6 bg-red-500 rounded-t-lg mb-1"></div>
                    <div className="w-10 h-4 bg-red-500 rounded-b-lg"></div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border-4 border-green-600 rounded-full"></div>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 text-center px-8">
            <h1 className="text-4xl font-bold text-black mb-2">CHENNAI</h1>
            <h2 className="text-2xl font-semibold text-black mb-1">
              INSTITUTE OF JOURNALISM
            </h2>
            <p className="text-sm text-gray-600">
              (Constituted by The Government of Tamil Nadu)
            </p>
          </div>

          {/* Official Photo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-24 bg-amber-100 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-amber-200 to-amber-300 flex items-center justify-center">
                <div className="w-16 h-20 bg-amber-400 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
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
        <div className="flex items-center justify-center min-h-full py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-b from-green-600 to-green-700 rounded-full flex items-center justify-center relative">
                  <div className="w-12 h-12 bg-yellow-400 rounded-sm flex items-center justify-center">
                    <div className="text-red-600 font-bold text-xs text-center leading-tight">
                      <div className="w-8 h-8 bg-yellow-300 rounded-sm flex flex-col items-center justify-center">
                        <div className="w-6 h-4 bg-red-500 rounded-t-lg mb-1"></div>
                        <div className="w-7 h-3 bg-red-500 rounded-b-lg"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-green-600 rounded-full"></div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                  NewsRoom Reporter
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter your email to get started
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
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
