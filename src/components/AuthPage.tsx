/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from '../types/agricultural';
import { TranslationDictionary } from '../locales/tamil';
import { loginUser, registerUser, RegisteredUser } from '../services/authService';
import {
  Lock,
  Mail,
  User,
  Shield,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

interface AuthPageProps {
  onSuccessAuth: (user: RegisteredUser) => void;
  initialMode?: 'login' | 'register';
  t: TranslationDictionary;
  lang: 'en' | 'ta';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccessAuth,
  initialMode = 'login',
  t,
  lang,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [organizationOrDistrict, setOrganizationOrDistrict] = useState('Dindigul Mandi');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick switch credentials helper for academic demonstration
  const handleQuickFill = (targetRole: UserRole) => {
    if (targetRole === 'farmer') {
      setEmail('farmer@agriprice.in');
      setPassword('Farmer@123');
    } else if (targetRole === 'government') {
      setEmail('gov@agriprice.in');
      setPassword('Gov@123');
    } else {
      setEmail('admin@agriprice.in');
      setPassword('Admin@123');
    }
    setMode('login');
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = loginUser(email, password);
    if (res.success && res.user) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onSuccessAuth(res.user!);
      }, 300);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = registerUser({
      name,
      email,
      password,
      role,
      organizationOrDistrict,
      phoneNumber,
    });

    if (res.success && res.user) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onSuccessAuth(res.user!);
      }, 400);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 mb-3 border border-emerald-100">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login'
              ? lang === 'ta'
                ? 'அக்ரிபிரைஸ் தள உள்நுழைவு'
                : 'AgriPrice Insight Portal Login'
              : lang === 'ta'
              ? 'புதிய பயனர் பதிவு'
              : 'User Registration'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? lang === 'ta'
                ? 'உங்கள் பங்களிப்பு சார்ந்த வேளாண் மேலாண்மை தளத்தை அணுக உள்நுழையவும்.'
                : 'Sign in to access your role-based agricultural dashboard.'
              : lang === 'ta'
              ? 'பணிசார்ந்த அனுமதிகளுடன் கூடிய சரிபார்க்கப்பட்ட புதிய கணக்கை உருவாக்கவும்.'
              : 'Create a new verified account with role-specific access permissions.'}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="flex border border-slate-200 rounded-lg p-1 bg-slate-50 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-md transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ta' ? 'உள்நுழைவு' : 'Sign In / Login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-md transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ta' ? 'புதிய பதிவு' : 'Register New Account'}
          </button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. farmer@agriprice.in"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'கடவுச்சொல்' : 'Password'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{lang === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'முழுப் பெயர்' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={lang === 'ta' ? 'எ.கா. முருகன் செல்வம்' : 'e.g. Murugan Selvam'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'கடவுச்சொல் (குறைந்தது 6 எழுத்துகள்)' : 'Password (min 6 characters)'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'பயனர் பொறுப்பு' : 'Designated Role'}
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:bg-white"
              >
                <option value="farmer">{lang === 'ta' ? 'விவசாயி / வேளாண் உற்பத்தியாளர்' : 'Farmer / Agricultural Producer'}</option>
                <option value="government">{lang === 'ta' ? 'அரசு அதிகாரி (உணவுப் பொருள் / PSF)' : 'Government Official (Civil Supplies / PSF)'}</option>
                <option value="admin">{lang === 'ta' ? 'கணினி நிர்வாகி' : 'System Administrator'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'மாவட்டம் / அமைப்பு' : 'District / Organization'}
              </label>
              <input
                type="text"
                required
                value={organizationOrDistrict}
                onChange={e => setOrganizationOrDistrict(e.target.value)}
                placeholder={lang === 'ta' ? 'எ.கா. திண்டுக்கல் / தமிழ்நாடு தோட்டக்கலைத் துறை' : 'e.g. Dindigul / Tamil Nadu Horticulture Dept'}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {lang === 'ta' ? 'தொலைபேசி எண் (விருப்பத்தேர்வு)' : 'Phone Number (Optional)'}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+91 98400 00000"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs mt-2"
            >
              <span>{lang === 'ta' ? 'பதிவை முடிக்கவும்' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-2.5 text-center">
            {lang === 'ta' ? 'ஒரு கிளிக்கில் செயல்விளக்க உள்நுழைவு' : 'One-Click Demonstration Logins'}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('farmer')}
              className="p-2 border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 rounded-lg text-emerald-900 font-medium flex flex-col items-center gap-1 transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'ta' ? 'விவசாயி' : 'Farmer'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('government')}
              className="p-2 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 rounded-lg text-blue-900 font-medium flex flex-col items-center gap-1 transition-colors"
            >
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>{lang === 'ta' ? 'அரசு அதிகாரி' : 'Gov Official'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="p-2 border border-purple-200 bg-purple-50/70 hover:bg-purple-100 rounded-lg text-purple-900 font-medium flex flex-col items-center gap-1 transition-colors"
            >
              <Shield className="w-4 h-4 text-purple-700" />
              <span>{lang === 'ta' ? 'நிர்வாகி' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
