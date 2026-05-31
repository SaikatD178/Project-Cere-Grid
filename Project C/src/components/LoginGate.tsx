import React, { useState } from 'react';
import { useMedical } from '../context/MedicalContext';
import { 
  ShieldCheck, Lock, Mail, Phone, Calendar, Heart, 
  Sparkles, KeyRound, ArrowRight, HeartPulse,
  Eye, EyeOff, ChevronRight, FileText, X, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PatientUser } from '../types';

export const LoginGate: React.FC = () => {
  const { loginUser, registerUser, loginAsAdmin } = useMedical();

  // Portal selection state
  const [selectedPortal, setSelectedPortal] = useState<'student' | 'admin' | 'teacher' | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Tab control inside updates section
  const [activeInfoTab, setActiveInfoTab] = useState<'all' | 'instructions' | 'helpdesk' | 'news'>('all');

  // Input Password Mask Toggler
  const [showPassword, setShowPassword] = useState(false);

  // Core messaging
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields - Sign-in
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Form Fields - Patient Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regBlood, setRegBlood] = useState('O+');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regEmergency, setRegEmergency] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const openPortalModal = (portal: 'student' | 'admin' | 'teacher') => {
    setSelectedPortal(portal);
    setIsRegisterMode(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const closePortalModal = () => {
    setSelectedPortal(null);
    setIsRegisterMode(false);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (selectedPortal === 'admin') {
        const res = await loginAsAdmin(email, password);
        if (res.success) {
          setSuccessMsg('Administrator session approved! Entering console...');
          setTimeout(() => {
            closePortalModal();
          }, 800);
        } else {
          setErrorMsg(res.error || 'Clinical Administrator authentication failed.');
        }
      } else if (selectedPortal === 'student') {
        const res = await loginUser(email, password);
        if (res.success) {
          setSuccessMsg('Patient credentials authorized! Re-matching telemetry arrays...');
          setTimeout(() => {
            closePortalModal();
          }, 800);
        } else {
          setErrorMsg(res.error || 'Credentials mismatch. Please verify registration files.');
        }
      } else if (selectedPortal === 'teacher') {
        // Teacher portal simulation
        if (email === 'doctor@caregrid.org' && password === 'doctor123') {
          // Log in under general admin session variables
          const res = await loginAsAdmin('saikatdhara91@gmail.com', 'Saikat@2003');
          if (res.success) {
            setSuccessMsg('Doctor session certified successfully!');
            setTimeout(() => {
              closePortalModal();
            }, 800);
          } else {
            setErrorMsg('Underlying session elevation failed.');
          }
        } else {
          setErrorMsg('Staff registry check failed. (Try doctor@caregrid.org with doctor123)');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName || !regEmail || !regPhone || !regDob || !regPassword || !regEmergency) {
      setErrorMsg('Please populate all mandatory fields with red asterisks.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (regPassword.length < 5) {
      setErrorMsg('Password should be at least 5 characters for clinical security standards.');
      return;
    }

    setIsLoading(true);
    try {
      const userData: Omit<PatientUser, 'id' | 'createdAt'> & { profileCompleted: boolean } = {
        name: regName,
        email: regEmail,
        phone: regPhone,
        dob: regDob,
        bloodGroup: regBlood,
        gender: regGender,
        medicalHistory: 'Registered on HIT Portal check-in',
        emergencyContact: regEmergency,
        profileCompleted: true
      };

      const res = await registerUser(userData, regPassword);
      if (res.success) {
        setSuccessMsg('Authorized account constructed successfully!');
        // Map to login email to ease the session creation
        setEmail(regEmail);
        setPassword(regPassword);
        setTimeout(() => {
          setIsRegisterMode(false);
          setSuccessMsg(null);
        }, 1200);
      } else {
        setErrorMsg(res.error || 'Account construction rejected.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 items-center justify-center p-4 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      
      {/* Symmetrical Top-Right Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
            isDarkMode 
              ? 'bg-slate-800 text-yellow-400 border-slate-705 hover:bg-slate-750' 
              : 'bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-700 border-indigo-100'
          }`}
        >
          <span>{isDarkMode ? 'Light Mode ☀️' : 'Light Mode 🌙'}</span>
        </button>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-4xl px-4 flex flex-col items-center">
        
        {/* Big Premium Logo Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl relative overflow-hidden mb-3">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1e293b]'}`}>
            CareGrid
          </h1>
          <p className="text-xs font-mono font-bold tracking-widest text-indigo-600 uppercase mt-1">
            Partner in Health
          </p>
        </div>

        {/* Portal Cards Centered in 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-10">
          
          {/* Card A: Patient Portal */}
          <div 
            onClick={() => openPortalModal('student')}
            className="bg-[#2D3748] hover:bg-[#39465c] text-white p-6 rounded-2xl flex items-center justify-between cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border border-slate-700/60 relative overflow-hidden group min-h-[100px]"
          >
            <div className="flex items-center gap-4.5 z-10">
              {/* Profile icon in circle */}
              <div className="w-14 h-14 rounded-full bg-[#3D4B60] flex items-center justify-center shrink-0 border border-slate-650 shadow-inner">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <svg className="w-6 h-6 text-[#2D3748]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-extrabold tracking-wide text-slate-100">Patient Portal</span>
                <span className="text-xs text-slate-350 font-medium mt-0.5">Click to continue as Patient.</span>
              </div>
            </div>
            <div className="text-slate-400 group-hover:text-white transition-all bg-slate-700/40 p-2 rounded-xl group-hover:translate-x-1 duration-150 shrink-0">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>

          {/* Card B: Admin Portal */}
          <div 
            onClick={() => openPortalModal('admin')}
            className="bg-[#E53E3E] hover:bg-[#ee4e4e] text-white p-6 rounded-2xl flex items-center justify-between cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border border-red-500/30 relative overflow-hidden group min-h-[100px]"
          >
            <div className="flex items-center gap-4.5 z-10">
              {/* Building admin icon in circle */}
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border border-red-200 shadow-md">
                <div className="w-9 h-9 flex items-center justify-center text-[#E53E3E]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-extrabold tracking-wide text-red-50">Admin Portal</span>
                <span className="text-xs text-red-150 font-medium mt-0.5">Click to continue as Admin.</span>
              </div>
            </div>
            <div className="text-red-200 group-hover:text-white transition-all bg-red-750/30 p-2 rounded-xl group-hover:translate-x-1 duration-150 shrink-0">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>

        </div>

      </main>

      {/* Footer copyright block */}
      <footer className="py-6 mt-8 text-center border-t border-slate-200/50 w-full max-w-2xl">
        <p className={`text-[10px] font-mono tracking-wider uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          CareGrid Secure Access Sockets // saikatdhara91@gmail.com
        </p>
      </footer>

      {/* 4. HIGH-FIDELITY MODAL OVERLAY (Screenshot 2 Match) */}
      <AnimatePresence>
        {selectedPortal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2.5px]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl shadow-3xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col"
            >
              
              {/* Modal Top Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-base font-black text-[#1e293b] tracking-tight">
                  Sign In As {selectedPortal === 'student' ? 'Patient' : 'Admin'}
                </h2>
                <button 
                  onClick={closePortalModal}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Notifications container */}
              <div className="px-6 pt-3">
                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-150 text-xs font-bold text-center text-emerald-800 flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600 animate-bounce" />
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-150 text-xs font-bold text-center text-red-650">
                    {errorMsg}
                  </div>
                )}
              </div>

              {/* Toggle-able sign-in or check-in forms */}
              {!isRegisterMode ? (
                /* 4.A SIGN IN FLOW (SCREENSHOT 2 REPLICA) */
                <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
                  
                  {/* Purple Locker Symbol inside round light blue shield */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner mb-3">
                      <Lock className="h-6 w-6 stroke-[2.2]" />
                    </div>
                    <p className="text-[13px] font-semibold text-slate-500">
                      Enter your credentials to sign in.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Username Address */}
                    <div>
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          selectedPortal === 'admin' 
                            ? "saikatdhara91@gmail.com" 
                            : "patient@caregrid.org"
                        }
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors bg-white font-medium"
                      />
                    </div>

                    {/* Masked Authorized Password */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-lg border border-slate-200 pl-4 pr-11 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors bg-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-405 hover:text-slate-650 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Symmetrical Middle Toggles (Remember me? & Forgot password?) */}
                  <div className="flex items-center justify-between text-xs font-semibold py-1 select-none">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-705">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => alert(`Password Recovery Link Scheduled. Under caregrid standard code protocols, credentials should be restored via direct system operators. Administrator email: saikatdhara91@gmail.com`)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Helpers & Registry Notes */}
                  {selectedPortal === 'admin' && (
                    <div className="rounded-lg bg-orange-50 border border-orange-150 p-3 text-[11px] text-orange-850 font-bold leading-normal">
                      🛡️ saikatdhara91@gmail.com and password Saikat@2003 is pre-certified in the system roster.
                    </div>
                  )}

                  {/* Patient registration trigger */}
                  {selectedPortal === 'student' && (
                    <div className="text-center py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">New patient check-in at CareGrid?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegisterMode(true);
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="ml-1.5 text-xs font-bold text-[#e31c3d] hover:underline cursor-pointer"
                      >
                        Construct Patient Dossier →
                      </button>
                    </div>
                  )}

                  {/* Footer Actions Panel */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={closePortalModal}
                      className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-655 border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? 'Verifying...' : 'Sign in'}
                    </button>
                  </div>

                </form>
              ) : (
                /* 4.B REGISTRATION SCREEN FLOW */
                <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
                  
                  <div className="text-center pb-2 border-b border-dashed border-slate-100">
                    <h3 className="text-base font-extrabold text-[#003087]">Construct Clinical Credentials</h3>
                    <p className="text-[11px] text-slate-400 font-medium">All telemetry registries map back directly to your secure citizen ID.</p>
                  </div>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="E.g., Ankit Das"
                        className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. ankit@caregrid.org"
                        className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Phone (+91) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={regDob}
                          onChange={(e) => setRegDob(e.target.value)}
                          className="w-full mt-1 rounded-lg border border-slate-200 py-2 px-3.5 text-xs focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Blood Group</label>
                        <select
                          value={regBlood}
                          onChange={(e) => setRegBlood(e.target.value)}
                          className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3 text-xs focus:border-indigo-500 focus:outline-none cursor-pointer bg-white"
                        >
                          <option>O+</option>
                          <option>O-</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Gender</label>
                        <select
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value as any)}
                          className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3 text-xs focus:border-indigo-500 focus:outline-none cursor-pointer bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Emergency Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regEmergency}
                          onChange={(e) => setRegEmergency(e.target.value)}
                          placeholder="+91 Emergency Roster Line"
                          className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">
                        Create Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 5 characters"
                        className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs focus:border-[#4f46e5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Enter matching password"
                        className="w-full mt-1 rounded-lg border border-slate-200 py-2.5 px-3.5 text-xs focus:border-[#4f46e5] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 rounded-lg border cursor-pointer"
                    >
                      ← Return to Gateway
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Creating Ledger...' : 'Construct Credentials'}
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
