/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../types/agricultural';
import { Users, Building2, Shield, X, Check } from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  lang?: 'en' | 'ta';
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  lang = 'en',
}) => {
  if (!isOpen) return null;
  const isTa = lang === 'ta';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {isTa ? 'பொறுப்பு அடிப்படையிலான அணுகல்' : 'Role-Based Access Control'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isTa
              ? 'உங்கள் பணிக்கான தளத்தை அணுக தகுந்த பொறுப்பைத் தேர்ந்தெடுக்கவும்.'
              : 'Select your role to access role-specific workflows and security permissions.'}
          </p>
        </div>

        <div className="space-y-3">
          {/* Farmer Role */}
          <div
            onClick={() => {
              onSelectRole('farmer');
              onClose();
            }}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              currentRole === 'farmer'
                ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>{isTa ? 'விவசாயி / உற்பத்தியாளர்' : 'Farmer / FPO Producer'}</span>
              </div>
              {currentRole === 'farmer' && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                  <Check className="w-4 h-4" /> {isTa ? 'செயலில்' : 'Active'}
                </span>
              )}
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {isTa
                ? 'பயிர் விலை முன்னறிவிப்பு (7/30/90 நாட்கள்), அருகிலுள்ள சந்தை விலை ஒப்பீடு, போக்குவரத்து கட்டணம் மற்றும் அறுவடை வழிகாட்டுதல்.'
                : 'Price forecasts (7/30/90 days), nearby mandi price spread comparison, freight calculations, and harvesting advisories. Restricted from viewing confidential government buffer stock.'}
            </p>
          </div>

          {/* Government Official Role */}
          <div
            onClick={() => {
              onSelectRole('government');
              onClose();
            }}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              currentRole === 'government'
                ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>
                  {isTa
                    ? 'அரசு அதிகாரி (உணவு & நுகர்பொருள் வழங்கல்)'
                    : 'Government Market Official (PSF / Civil Supplies)'}
                </span>
              </div>
              {currentRole === 'government' && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                  <Check className="w-4 h-4" /> {isTa ? 'செயலில்' : 'Active'}
                </span>
              )}
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {isTa
                ? 'மண்டல விலைவாசி எச்சரிக்கைகள், கிடங்கு இடைக்கால கையிருப்பு கண்காணிப்பு, பற்றாக்குறை மதிப்பீடு மற்றும் அரசு தலையீட்டு அறிக்கைகள்.'
                : 'Regional price-risk alerts, buffer stock inventory oversight, transparent supply-gap estimation, and official intervention review & sign-off.'}
            </p>
          </div>

          {/* Administrator Role */}
          <div
            onClick={() => {
              onSelectRole('admin');
              onClose();
            }}
            className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
              currentRole === 'admin'
                ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>
                  {isTa ? 'கணினி நிர்வாகி & தரவு ஆய்வாளர்' : 'System Administrator & Data Scientist'}
                </span>
              </div>
              {currentRole === 'admin' && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                  <Check className="w-4 h-4" /> {isTa ? 'செயலில்' : 'Active'}
                </span>
              )}
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {isTa
                ? 'முழு அனுமதி: பயனர் கணக்கு மேலாண்மை, பயிர் & சந்தை தரவுத்தள அமைப்புகள், மாதிரி மதிப்பீடு மற்றும் அமைப்பு நிர்வாகம்.'
                : 'Full access: user account management, commodity master configurations, mandi parameters, model evaluation, and system governance.'}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            {isTa ? 'உறுதிசெய்து தொடர்க' : 'Confirm & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
