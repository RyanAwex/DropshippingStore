import React, { useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { supabase } from '../utils/supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // --- SUPABASE LOGIC PLACEHOLDER ---
      /* const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/update-password',
      });
      if (error) throw error;
      */
      
      console.log("Sending reset link to:", email);
      
      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      
      {/* --- LEFT: EDITORIAL IMAGE --- */}
      <div className="hidden lg:block w-1/2 h-full relative bg-gray-100">
        <div className="absolute inset-0 bg-black/5 z-10"></div>
        <img 
          src="https://placehold.co/1080x1920/e5e5e5/333" 
          alt="Editorial" 
          className="w-full h-full object-cover grayscale opacity-90 hover:scale-105 transition-transform duration-[2000ms]" 
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <p className="text-xs font-bold uppercase tracking-widest mb-2">Account Support</p>
          <h2 className="text-4xl font-light uppercase tracking-tight">Recover<br/>Access</h2>
        </div>
      </div>

      {/* --- RIGHT: FORM PANEL --- */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 lg:p-20 relative overflow-y-auto">
        
        <div className="absolute top-8 left-8 lg:hidden">
          <span className="text-xl font-bold uppercase tracking-widest">Vraxia</span>
        </div>

        <div className="w-full max-w-md space-y-12">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest">
              Forgot Password?
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest leading-relaxed">
              Enter your email address and we will send you a secure link to reset your password.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex flex-col">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300"
                />
              </div>

              {error && (
                <div className="text-xs text-red-500 font-medium tracking-wide bg-red-50 p-3 border border-red-100">
                  {error}
                </div>
              )}

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
                    'Send Reset Link'
                  )}
                </span>
              </button>
            </form>
          ) : (
            // --- SUCCESS STATE ---
            <div className="text-center space-y-6 py-10 bg-gray-50 border border-gray-100 px-6 animation-fade-in">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-black" strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest">Check Your Inbox</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  We have sent password recovery instructions to<br/><strong>{email}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSuccess(false)}
                className="text-[10px] font-bold uppercase tracking-widest underline hover:text-gray-600"
              >
                Use a different email
              </button>
            </div>
          )}

          {/* Footer: Return to Login */}
          <div className="text-center pt-6 border-t border-gray-100">
            <Link 
              to="/auth" 
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;