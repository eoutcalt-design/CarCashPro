
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Button } from '../components/Components';
import { TrendingUp, DollarSign, Shield, ArrowRight, ExternalLink } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img 
                 src="/logo.png" 
                 alt="CarCashPro Logo" 
                 className="w-10 h-10 object-contain"
             />
             <span className="font-bold text-xl tracking-tight hidden md:block">CarCashPro</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Log In
            </button>
            <Button onClick={() => navigate('/signup')} className="!w-auto px-6 py-2 h-10 text-sm shadow-lg shadow-blue-500/20">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* Dealership Background Image - High Visibility */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1983" 
                alt="Car Dealership Showroom" 
                className="w-full h-full object-cover object-center brightness-[0.6]" 
            />
            {/* Subtle gradient at the very bottom to blend into features section */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:items-start w-full">
            
            {/* Left Column: Text - Strictly Aligned to Top */}
            <div className="text-center lg:text-left self-start pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs font-bold uppercase tracking-wide mb-6 animate-fade-in backdrop-blur-md shadow-lg">
                    <Shield size={14} />
                    Built by Dealership Veterans
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-2xl">
                    Track Your Car Sales <br />Commissions in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 filter drop-shadow-lg">Real Time.</span><br />
                    <span className="text-4xl md:text-5xl">Know Your Pay Before Payroll.</span>
                </h1>
                
                <p className="text-lg text-slate-200 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-md">
                    CarCashPro is a real-time commission, pacing, and income-projection system built specifically for automotive sales professionals who want control, clarity, and zero surprises on payday.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Button onClick={() => navigate('/signup')} className="sm:w-auto px-8 py-4 text-lg shadow-xl shadow-blue-500/30 hover:scale-105 border border-blue-400/30">
                        Start Tracking Free <ArrowRight className="ml-2" size={20} />
                    </Button>
                    <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-2xl font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all w-full sm:w-auto border border-white/10 hover:border-white/30 backdrop-blur-md shadow-lg bg-slate-900/40">
                        Already Have an Account? Log In
                    </button>
                </div>

                <div className="mt-10 opacity-90">
                     <p className="text-sm text-slate-300 drop-shadow-md leading-relaxed">
                         Built by dealership veterans. Designed for real commission plans.<br />
                         No spreadsheets. No guessing.
                     </p>
                </div>
            </div>

            {/* Right Column: YouTube Video Embed */}
            <div className="relative mx-auto lg:mr-0 max-w-[300px] md:max-w-[350px] w-full self-start">
                {/* Glow Effect behind video */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-blue-500/20 rounded-full blur-[80px] animate-pulse"></div>
                
                {/* Phone Frame with Video */}
                <div className="relative bg-black border-[12px] border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19] z-20 ring-1 ring-white/10">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-900 rounded-b-xl z-30 pointer-events-none"></div>
                    
                    {/* YouTube Video Embed */}
                    <div className="w-full h-full bg-slate-950 relative overflow-hidden">
                        <iframe 
                            className="absolute top-0 left-0 w-full h-full"
                            src="https://www.youtube.com/embed/mjzE0fupU4E?mute=1&controls=1&modestbranding=1&rel=0&showinfo=0"
                            title="CarCashPro Demo Video"
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-300 mb-3">
                        See exactly how CarCashPro works in under 90 seconds.
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                        Track your first deal in under 60 seconds.
                    </p>
                    <Button 
                        onClick={() => navigate('/signup')} 
                        className="!w-auto px-6 py-2 text-sm mb-2"
                    >
                        Start Tracking Free
                    </Button>
                    <br />
                    <a 
                        href="https://youtube.com/shorts/mjzE0fupU4E" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors"
                    >
                        <ExternalLink size={12} /> Watch on YouTube
                    </a>
                </div>
            </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Built for the Sales Floor</h2>
              <p className="text-slate-400 text-lg">Everything you need to dominate the leaderboard.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<TrendingUp className="text-emerald-400" size={32} />}
                title="Real-Time Pace"
                description="Know exactly where you stand against your monthly goals. Never miss a bonus tier again."
              />
              <FeatureCard 
                icon={<DollarSign className="text-blue-400" size={32} />}
                title="Commission Calculator"
                description="Customizable pay plans handle flats, percentages, packs, and volume bonuses automatically."
              />
              <FeatureCard 
                icon={<Shield className="text-purple-400" size={32} />}
                title="Secure Cloud Sync"
                description="Your data is encrypted and synced across all your devices instantly. Never lose a deal."
              />
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    Pro Feature
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">AI Sales Coach</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Your built-in AI monitors your pace, deal flow, and income in real time—alerting you when you're behind target or when you're on track for a record month.
                  </p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10 bg-slate-950">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-900 to-slate-900 rounded-[2.5rem] p-8 md:p-20 text-center border border-white/10 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           
           <div className="relative z-10">
             <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to hit your number?</h2>
             <p className="text-blue-200 mb-10 text-lg max-w-2xl mx-auto">Join thousands of sales pros tracking millions in commissions. It takes less than 30 seconds to set up.</p>
             <Button onClick={() => navigate('/signup')} className="md:w-auto px-12 py-5 text-lg bg-white text-blue-900 hover:bg-blue-50 border-none shadow-2xl">
                Get Started Now
             </Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm bg-slate-950 relative z-10">
        <div className="flex justify-center gap-6 mb-4 flex-wrap px-4">
            <button onClick={() => navigate('/privacy')} className="hover:text-blue-400 transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/refund-policy')} className="hover:text-blue-400 transition-colors">Refund Policy</button>
            <button onClick={() => navigate('/returns-policy')} className="hover:text-blue-400 transition-colors">Returns Policy</button>
        </div>
        <p>&copy; {new Date().getFullYear()} CarCashPro. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
     <div className="mb-6 p-4 rounded-2xl bg-slate-900 inline-block group-hover:scale-110 transition-transform duration-300 border border-white/5">
       {icon}
     </div>
     <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
     <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

export default Landing;
