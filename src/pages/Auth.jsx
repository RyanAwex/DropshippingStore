import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on typing
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName } }
        });
        if (error) throw error;
        navigate('/'); // Redirect after success
      } else {
        // --- SIGN IN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        navigate('/'); // Redirect after success
      }
      
      // Simulation for smooth effect
      setTimeout(() => setLoading(false), 1500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-white">
      
      {/* --- LEFT: EDITORIAL IMAGE (Hidden on mobile) --- */}
      <div className="hidden lg:block w-1/2 relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-black/5 z-10"></div>
        <img 
          src="https://placehold.co/1080x1080/d4d4d4/333" // Replace with your fashion image
          alt="Editorial" 
          className="w-full h-full max-h-screen object-cover grayscale opacity-90 hover:scale-105 transition-transform duration-[2000ms]" 
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <p className="text-xs font-bold uppercase tracking-widest mb-2">Collection {new Date().getFullYear()}</p>
          <h2 className="text-4xl font-light uppercase tracking-tight">Vraxia</h2>
        </div>
      </div>

      {/* --- RIGHT: AUTH FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative">
        
        {/* Absolute Brand Header for Mobile */}
        <div className="absolute top-8 left-8 lg:hidden">
          <span className="text-xl font-bold uppercase tracking-widest">Vraxia</span>
        </div>

        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest transition-all duration-300">
              {isSignUp ? 'Become a Member' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {isSignUp ? 'Join the community for exclusive access' : 'Sign in to access your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            
            {/* Full Name (Only for Sign Up) */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSignUp ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                <span>Password</span>
                {!isSignUp && <a href="#" className="text-gray-400 hover:text-black transition-colors">Forgot?</a>}
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-4 pr-12 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-xs text-red-500 font-medium tracking-wide bg-red-50 p-3 border border-red-100">
                {error}
              </div>
            )}

            {/* Submit Button - Curtain Effect */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative px-8 py-4 border border-black overflow-hidden bg-black text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
              <span className="relative z-10 w-full flex justify-center items-center text-xs font-bold uppercase tracking-widest group-hover:text-black transition-colors duration-300">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center">
                    {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                )}
              </span>
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">
              {isSignUp ? "Already have an account?" : "New to Vraxia?"}
            </p>
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-400 transition-all"
            >
              {isSignUp ? "Sign In Here" : "Create an Account"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;