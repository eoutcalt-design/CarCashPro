
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card, Logo } from '../components/Components';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, AlertCircle, User as UserIcon, Phone } from 'lucide-react';

const Signup = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
        setError('First Name is required.');
        return;
    }
    if (!email || !password || password !== confirmPassword) {
        setError('Please check email and password fields.');
        return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await signup(email, password, firstName, lastName, phoneNumber);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
          setError('That email is already in use.');
      } else if (err.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
      } else {
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        <div className="mb-6 animate-fade-in">
            <Logo className="w-24 h-24" />
        </div>

        <Card className="w-full bg-slate-900/60 backdrop-blur-2xl border-white/10 p-8 shadow-2xl animate-slide-up">
          <div className="mb-6 text-center">
             <h2 className="text-2xl font-bold text-white">Join the Club</h2>
             <p className="text-slate-400 text-sm mt-1">Start maximizing your income today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">First Name <span className="text-emerald-400">*</span></label>
                    <div className="relative group">
                        <UserIcon className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                        <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-2 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            placeholder="John"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Last Name</label>
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                            placeholder="Doe"
                        />
                    </div>
                </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Mobile Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Email Address <span className="text-emerald-400">*</span></label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="you@dealership.com"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Password <span className="text-emerald-400">*</span></label>
              <div className="relative group">
                <Key className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Confirm Password <span className="text-emerald-400">*</span></label>
              <div className="relative group">
                <Key className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold animate-pulse">
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            <Button type="submit" className="mt-8 !bg-gradient-to-r !from-emerald-600 !to-emerald-500 hover:!from-emerald-500 hover:!to-emerald-400 !border-emerald-400/20 shadow-emerald-900/50" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;