
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header, Card, Button, Toggle, Input } from '../components/Components';
import { Bell, Mail, Key, User, ShieldAlert } from 'lucide-react';

const Settings = () => {
  const { user, updateNotifications, updateUserEmail, updateUserPassword, deals } = useApp();
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  
  const [notifs, setNotifs] = useState({
      emailDailyPace: user?.notifications?.emailDailyPace ?? false,
      emailWeeklySummary: user?.notifications?.emailWeeklySummary ?? false,
      emailAchievements: user?.notifications?.emailAchievements ?? true
  });

  const handleNotifChange = (key: keyof typeof notifs) => {
      const newPrefs = { ...notifs, [key]: !notifs[key] };
      setNotifs(newPrefs);
      updateNotifications(newPrefs);
  };

  const handleUpdateProfile = async () => {
      setMsg('');
      try {
          if(newEmail) await updateUserEmail(newEmail);
          if(newPassword) await updateUserPassword(newPassword);
          setMsg('Profile updated successfully.');
          setNewEmail(''); setNewPassword('');
      } catch(e) {
          setMsg('Error updating profile. You may need to re-login.');
      }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
        <Header title="Settings" subtitle="Account & Preferences" />

        {/* Account Management */}
        <Card>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
                <User size={20} />
                <h3 className="font-bold text-sm uppercase tracking-wider">My Account</h3>
            </div>
            <div className="space-y-4">
                <div className="p-3 bg-slate-800 rounded-lg text-sm text-slate-300 mb-2">
                    Current Email: <span className="text-white font-bold">{user?.email}</span>
                </div>
                <Input label="Update Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New email address" />
                <Input label="Update Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                
                {msg && <p className={`text-xs font-bold ${msg.includes('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>{msg}</p>}
                
                <Button onClick={handleUpdateProfile} className="!w-auto px-6 py-2 h-10 text-sm">Update Profile</Button>
            </div>
        </Card>

        {/* Notifications */}
        <Card>
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <Bell size={20} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Notifications</h3>
            </div>
            <div className="space-y-2">
                <Toggle label="Daily Pace Report" checked={notifs.emailDailyPace} onChange={() => handleNotifChange('emailDailyPace')} />
                <Toggle label="Weekly Summary" checked={notifs.emailWeeklySummary} onChange={() => handleNotifChange('emailWeeklySummary')} />
                <Toggle label="Achievement Unlocks" checked={notifs.emailAchievements} onChange={() => handleNotifChange('emailAchievements')} />
            </div>
        </Card>

        {/* ADMIN ONLY SECTION - Hidden for regular users */}
        {user?.isAdmin && (
            <div className="mt-10 border-t border-white/10 pt-10">
                <div className="flex items-center gap-2 mb-4 text-rose-500">
                    <ShieldAlert size={24} />
                    <h2 className="text-xl font-bold">Admin Console</h2>
                </div>
                <Card className="bg-slate-900 border border-rose-500/20">
                    <p className="text-slate-400 text-sm mb-4">
                        Developer settings and database configuration.
                        <br/>
                        <strong>Total Deals in DB:</strong> {deals.length}
                    </p>
                    {/* Placeholder for future admin tools */}
                    <div className="p-4 bg-black/40 rounded-xl font-mono text-xs text-rose-300">
                        [System Config Hidden from Public Users]
                    </div>
                </Card>
            </div>
        )}
    </div>
  );
};

export default Settings;
