/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Prototype plain/mock credential storage for academic frontend demonstration
  role: 'farmer' | 'government' | 'admin';
  organizationOrDistrict: string;
  phoneNumber?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

const STORAGE_KEY = 'agriprice_registered_users_v1';
const SESSION_KEY = 'agriprice_active_session_v1';

// Pre-seeded initial accounts for testing each role
const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: 'user_farmer_01',
    name: 'Murugan S.',
    email: 'farmer@agriprice.in',
    passwordHash: 'Farmer@123',
    role: 'farmer',
    organizationOrDistrict: 'Dindigul / Ottanchatram Mandi',
    phoneNumber: '+91 98421 12345',
    createdAt: '2024-01-15T09:00:00.000Z',
    status: 'active',
  },
  {
    id: 'user_gov_01',
    name: 'Dr. K. Ramanathan, IAS',
    email: 'gov@agriprice.in',
    passwordHash: 'Gov@123',
    role: 'government',
    organizationOrDistrict: 'Tamil Nadu Civil Supplies / PSF Monitoring Cell',
    phoneNumber: '+91 44 2859 0012',
    createdAt: '2023-06-20T10:30:00.000Z',
    status: 'active',
  },
  {
    id: 'user_admin_01',
    name: 'System Administrator',
    email: 'admin@agriprice.in',
    passwordHash: 'Admin@123',
    role: 'admin',
    organizationOrDistrict: 'State Agriculture IT Cell, Chennai',
    phoneNumber: '+91 44 2859 9999',
    createdAt: '2023-01-01T00:00:00.000Z',
    status: 'active',
  },
];

export function getStoredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: RegisteredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
}

export function getActiveSession(): RegisteredUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveSession(user: RegisteredUser | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to set active session', e);
  }
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'government' | 'admin';
  organizationOrDistrict: string;
  phoneNumber?: string;
}): { success: boolean; message: string; user?: RegisteredUser } {
  // Input validations
  const cleanName = input.name.trim();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanPass = input.password.trim();

  if (!cleanName || cleanName.length < 2) {
    return { success: false, message: 'Please provide a valid full name (at least 2 characters).' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, message: 'Please provide a valid email address.' };
  }
  if (!cleanPass || cleanPass.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, message: `An account with email '${cleanEmail}' already exists. Please login.` };
  }

  const newUser: RegisteredUser = {
    id: `user_${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: cleanPass, // In production, salted hash
    role: input.role,
    organizationOrDistrict: input.organizationOrDistrict.trim() || 'Tamil Nadu',
    phoneNumber: input.phoneNumber?.trim(),
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  users.push(newUser);
  saveStoredUsers(users);
  setActiveSession(newUser);

  return { success: true, message: 'Registration successful! You are now logged in.', user: newUser };
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; message: string; user?: RegisteredUser } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, message: 'Please enter both your email address and password.' };
  }

  const users = getStoredUsers();
  const match = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!match) {
    return { success: false, message: 'No registered user found with this email address.' };
  }

  if (match.status === 'suspended') {
    return { success: false, message: 'This user account is suspended. Contact system administrator.' };
  }

  if (match.passwordHash !== cleanPass) {
    return { success: false, message: 'Invalid password. Please check your credentials.' };
  }

  setActiveSession(match);
  return { success: true, message: `Welcome back, ${match.name}!`, user: match };
}

export function logoutUser(): void {
  setActiveSession(null);
}

export function updateUserStatus(userId: string, newStatus: 'active' | 'suspended'): void {
  const users = getStoredUsers();
  const updated = users.map(u => (u.id === userId ? { ...u, status: newStatus } : u));
  saveStoredUsers(updated);
}
