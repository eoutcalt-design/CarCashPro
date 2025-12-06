import React from 'react';

// Logo Component
export const Logo: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => (
  <div className={`relative flex flex-col items-center ${className}`}>
    {/* Shield SVG */}
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      
      {/* Shield Border */}
      <path 
        d="M50 115 C50 115, 90 95, 90 40 L90 20 L50 5 L10 20 L10 40 C10 95, 50 115, 50 115 Z" 
        fill="none" 
        stroke="url(#borderGrad)" 
        strokeWidth="3"
      />
      
      {/* Shield Fill */}
      <path 
        d="M50 112 C50 112, 87 93, 87 41 L87 22 L50 8 L13 22 L13 41 C13 93, 50 112, 50 112 Z" 
        fill="url(#shieldGrad)" 
        opacity="0.9"
      />

      {/* Car Silhouette (Stylized) */}
      <path 
        d="M25 55 L30 45 L60 42 L75 45 L80 55 M22 55 L83 55 L83 65 L75 65 L70 58 L35 58 L30 65 L22 65 Z" 
        fill="none" 
        stroke="#94a3b8" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Dollar Sign */}
      <text x="50" y="95" fontSize="40" fontWeight="bold" fill="#3b82f6" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 5px rgba(59,130,246,0.5))' }}>$</text>
      
      {/* CCP Text Overlay */}
      <path d="M30 75 L70 75" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
    </svg>
    <div className="mt-2 font-black text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400" style={{ fontFamily: 'Impact, sans-serif' }}>
      CCP
    </div>
  </div>
);

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

// Stat Card
interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  accent?: 'blue' | 'emerald' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, accent = 'blue' }) => {
    const accentColors = {
        blue: 'text-blue-400',
        emerald: 'text-emerald-400',
        rose: 'text-rose-400',
        amber: 'text-amber-400'
    };

    return (
        <Card className="flex flex-col justify-between h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</span>
            <div className="mt-2">
                <div className={`text-2xl font-bold ${accentColors[accent]} drop-shadow-sm`}>{value}</div>
                {subtext && <div className="text-[10px] text-slate-500 mt-1 font-medium">{subtext}</div>}
            </div>
        </Card>
    );
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick, type = 'button', ...props }) => {
  const baseStyle = "w-full py-4 rounded-2xl font-bold tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 border border-blue-400/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-white/5",
    outline: "border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600",
    danger: "bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 border border-rose-500/30",
    ghost: "text-slate-400 hover:text-white"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, type = "text", value, onChange, placeholder, name, ...props }) => (
  <div className="mb-4 group">
    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1 group-focus-within:text-blue-400 transition-colors">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
      {...props}
    />
  </div>
);

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options, ...props }) => (
  <div className="mb-4 group">
    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase ml-1 group-focus-within:text-blue-400 transition-colors">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all shadow-inner"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800 text-white py-2">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-4 pointer-events-none text-slate-500 group-focus-within:text-blue-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);

// Toggle
interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl mb-2 border cursor-pointer transition-all duration-200 ${checked ? 'bg-blue-900/20 border-blue-500/30' : 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50'}`} onClick={onChange}>
        <span className={`text-sm font-bold ${checked ? 'text-blue-200' : 'text-slate-400'}`}>{label}</span>
        <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${checked ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-slate-700'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
    </div>
);

// Header
interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightElement }) => (
    <div className="flex justify-between items-start mb-8 px-1">
        <div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">{title}</h1>
            {subtitle && <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-1">{subtitle}</p>}
        </div>
        {rightElement}
    </div>
);