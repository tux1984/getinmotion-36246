import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Check, X } from 'lucide-react';
import { ConversationQuestion } from '../types/conversationalTypes';

interface QuestionRendererProps {
  question: ConversationQuestion;
  value?: any;
  onChange?: (value: any) => void;
  onAnswer?: (answer: any) => void;
  language: 'en' | 'es';
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  onAnswer,
  language
}) => {
  // Use onAnswer if provided, otherwise fall back to onChange
  const handleAnswer = onAnswer || onChange || (() => {});
  const translations = {
    en: {
      yes: "Yes",
      no: "No",
      selectOption: "Select an option"
    },
    es: {
      yes: "Sí",
      no: "No",
      selectOption: "Selecciona una opción"
    }
  };

  const t = translations[language];

  const renderSingleChoice = () => {
    // Validate that we have proper options
    if (!question.options || question.options.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
          {language === 'es' 
            ? 'No hay opciones disponibles para esta pregunta'
            : 'No options available for this question'
          }
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {question.options?.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={value === option.value ? "default" : "outline"}
            className={`w-full justify-start text-left p-4 h-auto ${
              value === option.value ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onClick={() => handleAnswer(option.value)}
          >
            <div className="flex-1">
              <div className="font-medium mb-1">{option.label}</div>
              {option.description && (
                <div className="text-sm text-muted-foreground">{option.description}</div>
              )}
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
  };

  const renderMultipleChoice = () => {
    const selectedCount = Array.isArray(value) ? value.length : 0;
    
    // Validate that we have proper options
    if (!question.options || question.options.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
          {language === 'es' 
            ? 'No hay opciones disponibles para esta pregunta'
            : 'No options available for this question'
          }
        </div>
      );
    }

    // Check if any option has the same label repeated (insight contamination)
    const uniqueLabels = new Set(question.options.map(opt => opt.label));
    if (uniqueLabels.size !== question.options.length) {
      console.warn('Detected duplicate options in multiple choice question:', question.options);
    }
    
    return (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground mb-3">
          {language === 'es' 
            ? `Puedes seleccionar múltiples opciones (${selectedCount} seleccionadas)`
            : `You can select multiple options (${selectedCount} selected)`
          }
        </div>
        {question.options?.map((option) => {
          const isSelected = Array.isArray(value) && value.includes(option.value);
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start text-left p-4 h-auto ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                onClick={() => {
                  const currentValues = Array.isArray(value) ? value : [];
                  const newValues = isSelected
                    ? currentValues.filter(v => v !== option.value)
                    : [...currentValues, option.value];
                  handleAnswer(newValues);
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-primary border-primary' : 'border-border'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                    )}
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderTextInput = () => (
    <Input
      type="text"
      placeholder={question.placeholder}
      value={value || ''}
      onChange={(e) => handleAnswer(e.target.value)}
      className="w-full p-4 text-base"
    />
  );

  const renderSlider = () => {
    const minValue = question.min || 1;
    const maxValue = question.max || 5;
    const defaultValue = Math.ceil((minValue + maxValue) / 2);
    const currentValue = value !== undefined && value !== null ? value : defaultValue;
    
    // Set default value if not already set
    React.useEffect(() => {
      if (value === undefined || value === null) {
        handleAnswer(defaultValue);
      }
    }, [value, defaultValue, handleAnswer]);

    return (
      <div className="space-y-4">
        <div className="px-2">
          <Slider
            value={[currentValue]}
            onValueChange={(newValue) => handleAnswer(newValue[0])}
            min={minValue}
            max={maxValue}
            step={question.step || 1}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground px-2">
          <span>{minValue}</span>
          <span className="font-medium text-foreground">
            {currentValue} / {maxValue}
          </span>
          <span>{maxValue}</span>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          {currentValue === minValue && (language === 'es' ? 'Muy bajo' : 'Very low')}
          {currentValue === defaultValue && (language === 'es' ? 'Moderado' : 'Moderate')}
          {currentValue === maxValue && (language === 'es' ? 'Muy alto' : 'Very high')}
        </div>
      </div>
    );
  };

  const renderYesNo = () => (
    <div className="flex gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
        <Button
          variant={value === true ? "default" : "outline"}
          className={`w-full h-16 text-lg ${
            value === true ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          onClick={() => handleAnswer(true)}
        >
          <Check className="w-6 h-6 mr-2" />
          {t.yes}
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
        <Button
          variant={value === false ? "default" : "outline"}
          className={`w-full h-16 text-lg ${
            value === false ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          onClick={() => handleAnswer(false)}
        >
          <X className="w-6 h-6 mr-2" />
          {t.no}
        </Button>
      </motion.div>
    </div>
  );

  const renderButtonGroup = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {question.options?.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={value === option.value ? "default" : "outline"}
            className={`w-full p-4 h-auto text-center ${
              value === option.value ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onClick={() => handleAnswer(option.value)}
          >
            {option.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );

  switch (question.type) {
    case 'single-choice':
      return renderSingleChoice();
    case 'multiple-choice':
      return renderMultipleChoice();
    case 'text-input':
      return renderTextInput();
    case 'slider':
      return renderSlider();
    case 'yes-no':
      return renderYesNo();
    case 'button-group':
      return renderButtonGroup();
    default:
      return <div>Unsupported question type</div>;
  }
};