
import React from 'react';
import { motion } from 'framer-motion';
import { ProfileType } from '@/types/dashboard';

interface ProfileTypeSelectorProps {
  profileType: ProfileType | null;
  onSelect: (type: ProfileType) => void;
  t: any;
}

export const ProfileTypeSelector: React.FC<ProfileTypeSelectorProps> = React.memo(({ 
  profileType, 
  onSelect, 
  t 
}) => (
  <div className="space-y-6">
    <div>
      <h4 className="text-xl font-semibold text-purple-900 mb-2">{t.profileTypeTitle}</h4>
      <p className="text-gray-600 mb-6">{t.profileTypeSubtitle}</p>
    </div>

    <div className="grid gap-4">
      {[
        { type: 'idea' as ProfileType, data: t.idea },
        { type: 'solo' as ProfileType, data: t.solo },
        { type: 'team' as ProfileType, data: t.team }
      ].map(({ type, data }) => (
        <motion.div
          key={type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            profileType === type
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-purple-300'
          }`}
          onClick={() => onSelect(type)}
        >
          <h5 className="font-semibold text-purple-900">{data.title}</h5>
          <p className="text-sm text-gray-600 mt-1">{data.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
));

ProfileTypeSelector.displayName = 'ProfileTypeSelector';
