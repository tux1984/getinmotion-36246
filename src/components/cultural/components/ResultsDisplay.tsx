
import React from 'react';
import { motion } from 'framer-motion';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { DebouncedButton } from './DebouncedButton';

interface ResultsDisplayProps {
  scores: CategoryScore;
  recommendedAgents: RecommendedAgents;
  t: any;
  onComplete: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = React.memo(({ 
  scores, 
  recommendedAgents, 
  t, 
  onComplete 
}) => (
  <div className="space-y-6">
    <div>
      <h4 className="text-xl font-semibold text-purple-900 mb-2">{t.resultsTitle}</h4>
      <p className="text-gray-600 mb-6">{t.resultsSubtitle}</p>
    </div>

    {/* Scores Display */}
    <div className="space-y-4">
      {Object.entries(scores).map(([category, score]) => (
        <div key={category} className="space-y-2">
          <div className="flex justify-between">
            <span className="capitalize text-sm font-medium">{category.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-sm font-semibold">{score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Recommendations */}
    <div className="space-y-4">
      <div>
        <h5 className="font-semibold text-purple-900 mb-2">{t.primaryRecommendations}</h5>
        <div className="flex flex-wrap gap-2">
          {recommendedAgents.primary?.map((agent, index) => (
            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {agent.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h5 className="font-semibold text-purple-900 mb-2">{t.secondaryRecommendations}</h5>
        <div className="flex flex-wrap gap-2">
          {recommendedAgents.secondary?.map((agent, index) => (
            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {agent.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Deeper Analysis Option */}
    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
      <h5 className="font-semibold text-purple-900 mb-2">{t.deeperAnalysis}</h5>
      <p className="text-sm text-gray-600 mb-3">{t.moreQuestions}</p>
      <div className="flex gap-3">
        <DebouncedButton
          variant="outline"
          size="sm"
          onClick={onComplete}
        >
          {t.finishAssessment}
        </DebouncedButton>
        <DebouncedButton
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-indigo-600"
          onClick={() => {
            console.log("Extended analysis clicked - feature coming soon");
          }}
        >
          {t.moreQuestions}
        </DebouncedButton>
      </div>
    </div>
  </div>
));

ResultsDisplay.displayName = 'ResultsDisplay';
