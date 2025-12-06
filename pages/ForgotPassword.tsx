import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card, Logo } from '../components/Components';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { resetPassword } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setError('');
    setLoading(true);
    try {
        await resetPassword(email);
        setIsSubmitted(true);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/user-not-found') {
            setError('No account found with this email.');
        } else if (err.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else {
            setError('Failed to send reset link. Try again.');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        <div className="mb-10 animate-fade-in">
            <Logo className="w-32 h-32" />
        </div>

        <Card className="w-full bg-slate-900/60 backdrop-blur-2xl border-white/10 p-8 shadow-2xl animate-slide-up">
          {!isSubmitted ? (
            <>
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-slate-400 text-sm mt-1">Enter your email to receive recovery instructions.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="you@dealership.com"
                        />
                    </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="shadow-blue-900/50" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => navigate('/login')} className="text-slate-500 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors mx-auto">
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>
                </div>
            </>
          ) : (
            <div className="text-center py-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Inbox</h2>
                <p className="text-slate-400 text-sm mb-6">
                    We have sent a password reset link to <span className="text-white font-bold">{email}</span>.
                </p>
                
                <div className="space-y-3">
                    <Button onClick={() => navigate('/login')} variant="outline">
                        Return to Sign In
                    </Button>
                    <button onClick={() => setIsSubmitted(false)} className="text-xs text-slate-500 hover:text-blue-400 mt-4">
                        Try a different email
                    </button>
                </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;