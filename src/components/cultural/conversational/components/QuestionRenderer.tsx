import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, X, Edit3, CheckCircle2, Circle, Star, Heart, Zap, Target, Lightbulb, Rocket } from 'lucide-react';
import { ConversationQuestion } from '../types/conversationalTypes';

interface QuestionRendererProps {
  question: ConversationQuestion;
  value?: any;
  onChange?: (value: any) => void;
  onAnswer?: (answer: any) => void;
  language: 'en' | 'es';
}

const QuestionRenderer: React.FC<QuestionRendererProps> = memo(({
  question,
  value,
  onChange,
  onAnswer,
  language
}) => {
  // Use onAnswer if provided, otherwise fall back to onChange
  const handleAnswer = useCallback(onAnswer || onChange || (() => {}), [onAnswer, onChange]);
  
  const translations = {
    en: {
      yes: "Yes",
      no: "No",
      selectOption: "Select an option",
      typing: "Typing...",
      willSaveAfter: "Will save after you finish typing"
    },
    es: {
      yes: "Sí",
      no: "No",
      selectOption: "Selecciona una opción",
      typing: "Escribiendo...",
      willSaveAfter: "Se guardará cuando termines de escribir"
    }
  };

  const t = translations[language];

  const getOptionIcon = (index: number) => {
    const icons = [Circle, CheckCircle2, Star, Heart, Zap, Target, Lightbulb, Rocket];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5" />;
  };

  const renderSingleChoice = () => {
    // Validate that we have proper options
    if (!question.options || question.options.length === 0) {
      console.warn('Single choice question without options, converting to text input:', question.id);
      return renderTextInput();
    }

    // Additional validation: check if options look like AI insights (duplicated text)
    const optionLabels = question.options.map(opt => opt.label);
    const uniqueLabels = new Set(optionLabels);
    const hasDuplicates = uniqueLabels.size !== optionLabels.length;
    
    // Check if any option contains insight-like text
    const hasInsightText = optionLabels.some(label => 
      typeof label === 'string' && (
        label.toLowerCase().includes('veo que') ||
        label.toLowerCase().includes('i can see') ||
        label.toLowerCase().includes('este nivel') ||
        label.toLowerCase().includes('me parece') ||
        label.toLowerCase().includes('observo que') ||
        label.toLowerCase().includes('basándome en')
      )
    );
    
    if (hasDuplicates || hasInsightText) {
      console.warn('Detected AI insights as options, converting to text input:', question.id, optionLabels);
      return renderTextInput();
    }

    return (
      <RadioGroup value={String(value)} onValueChange={(val) => {
        const option = question.options?.find(opt => String(opt.value) === val);
        if (option) handleAnswer(option.value);
      }}>
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = String(value) === String(option.value);
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`
                  flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 min-h-[64px] relative
                  ${isSelected
                    ? 'border-purple-400 bg-purple-50 shadow-md scale-[1.02]' 
                    : 'border-purple-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm bg-white'
                  }
                `} onClick={() => handleAnswer(option.value)}>
                  
                  <RadioGroupItem
                    value={String(option.value)}
                    className="w-5 h-5 mr-4 flex-shrink-0 border-2 border-purple-300 data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600"
                  />
                  
                  <div className={`mr-3 flex-shrink-0 transition-colors ${
                    isSelected ? 'text-purple-600' : 'text-purple-400'
                  }`}>
                    {getOptionIcon(index)}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium leading-relaxed ${
                      isSelected ? 'text-purple-800' : 'text-gray-800'
                    }`}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    )}
                  </div>
                  
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2"
                    >
                      <CheckCircle2 className="h-6 w-6 text-purple-600" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </RadioGroup>
    );
  };

  const renderMultipleChoice = () => {
    // Initialize value as empty array if needed
    const currentValue = Array.isArray(value) ? value : [];
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Initialize empty array on first render if needed
    useEffect(() => {
      if (!isInitialized && (!value || !Array.isArray(value))) {
        console.log('QuestionRenderer: Initializing empty array for multiple choice', { questionId: question.id });
        handleAnswer([]);
        setIsInitialized(true);
      }
    }, [isInitialized, value, handleAnswer, question.id]);
    
    const selectedCount = currentValue.length;
    
    // Validate that we have proper options
    if (!question.options || question.options.length === 0) {
      console.warn('Multiple choice question without options, converting to text input:', question.id);
      return renderTextInput();
    }

    // Additional validation for AI insights contamination
    const optionLabels = question.options.map(opt => opt.label);
    const uniqueLabels = new Set(optionLabels);
    const hasDuplicates = uniqueLabels.size !== optionLabels.length;
    
    // Check if any option contains insight-like text
    const hasInsightText = optionLabels.some(label => 
      typeof label === 'string' && (
        label.toLowerCase().includes('veo que') ||
        label.toLowerCase().includes('i can see') ||
        label.toLowerCase().includes('este nivel') ||
        label.toLowerCase().includes('me parece') ||
        label.toLowerCase().includes('observo que') ||
        label.toLowerCase().includes('basándome en')
      )
    );
    
    if (hasDuplicates || hasInsightText) {
      console.warn('Detected AI insights as options, converting to text input:', question.id, optionLabels);
      return renderTextInput();
    }
    
    return (
      <div className="space-y-3">
        <div className="text-sm text-purple-600 mb-3 font-medium">
          {language === 'es' 
            ? `Puedes seleccionar múltiples opciones (${selectedCount} seleccionadas)`
            : `You can select multiple options (${selectedCount} selected)`
          }
        </div>
        {question.options?.map((option, index) => {
          const isSelected = currentValue && Array.isArray(currentValue) && currentValue.includes(option.value);
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`
                flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 min-h-[64px] relative
                ${isSelected
                  ? 'border-purple-400 bg-purple-50 shadow-md scale-[1.02]' 
                  : 'border-purple-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm bg-white'
                }
              `} onClick={() => {
                const newValues = isSelected
                  ? currentValue.filter(v => v !== option.value)
                  : [...currentValue, option.value];
                console.log('QuestionRenderer: Multiple choice updated', { 
                  questionId: question.id, 
                  option: option.value, 
                  isSelected, 
                  newValues 
                });
                handleAnswer(newValues);
              }}>
                
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${
                  isSelected ? 'bg-purple-600 border-purple-600' : 'border-purple-300 hover:border-purple-400'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                
                <div className={`mr-3 flex-shrink-0 transition-colors ${
                  isSelected ? 'text-purple-600' : 'text-purple-400'
                }`}>
                  {getOptionIcon(index)}
                </div>
                
                <div className="flex-1">
                  <div className={`font-medium leading-relaxed ${
                    isSelected ? 'text-purple-800' : 'text-gray-800'
                  }`}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderTextInput = useCallback(() => {
    const [localValue, setLocalValue] = useState(value || '');
    const [isTyping, setIsTyping] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedValueRef = useRef(value || '');

    // Only update local value on external changes if we haven't started typing
    useEffect(() => {
      if (!isTyping && !hasInitialized) {
        setLocalValue(value || '');
        lastSavedValueRef.current = value || '';
        setHasInitialized(true);
      }
    }, [value, isTyping, hasInitialized]);

    const handleInputChange = useCallback((inputValue: string) => {
      setLocalValue(inputValue);
      setIsTyping(true);
      
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Only update if there's a significant change (>5 chars or input is complete)
      const shouldUpdate = (inputValue.trim().length > 10 && 
                           Math.abs(inputValue.length - lastSavedValueRef.current.length) > 5) ||
                          inputValue.trim().length === 0;
      
      if (shouldUpdate) {
        // Set new timeout for debounced update - increased to 1200ms
        debounceTimeoutRef.current = setTimeout(() => {
          console.log('QuestionRenderer: Smart debounced update', { 
            inputValue, 
            previous: lastSavedValueRef.current,
            length: inputValue.length 
          });
          
          lastSavedValueRef.current = inputValue;
          handleAnswer(inputValue);
          setIsTyping(false);
        }, 1200);
      } else {
        // Short timeout just to update typing status
        debounceTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 500);
      }
    }, [handleAnswer]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="text"
            placeholder={question.placeholder}
            value={localValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-4 text-base pr-12"
          />
          {isTyping && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-primary animate-pulse" />
            </div>
          )}
        </div>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            {t.typing} - {t.willSaveAfter}
          </motion.div>
        )}
      </div>
    );
  }, [value, question.placeholder, handleAnswer, t]);

  const renderSlider = () => {
    const minValue = question.min || 1;
    const maxValue = question.max || 5;
    const defaultValue = Math.ceil((minValue + maxValue) / 2);
    const currentValue = value !== undefined && value !== null ? Number(value) : defaultValue;
    
    // Set default value if not already set
    React.useEffect(() => {
      if (value === undefined || value === null) {
        console.log('QuestionRenderer: Setting default slider value', { defaultValue, questionId: question.id });
        handleAnswer(defaultValue);
      }
    }, [value, defaultValue, handleAnswer, question.id]);

    return (
      <div className="space-y-6 relative transform-gpu">
        <div className="p-8 rounded-xl bg-gradient-to-br from-background/95 to-accent/5 border-2 border-accent/20 shadow-lg transform-gpu">
          <div 
            className="w-full relative isolate"
            style={{ 
              touchAction: 'manipulation',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              transform: 'translateZ(0)'
            }}
          >
            <Slider
              value={[currentValue]}
              onValueChange={(newValue) => {
                console.log('QuestionRenderer: Slider changed', { 
                  questionId: question.id, 
                  oldValue: currentValue, 
                  newValue: newValue[0] 
                });
                handleAnswer(newValue[0]);
              }}
              min={minValue}
              max={maxValue}
              step={question.step || 1}
              className="w-full !touch-manipulation !cursor-pointer [&>*]:!touch-manipulation [&>*]:!pointer-events-auto [&_*]:!touch-manipulation [&_*]:!cursor-pointer override-touch-none"
              style={{ 
                touchAction: 'manipulation !important',
                cursor: 'pointer !important'
              }}
            />
          </div>
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
          className={`w-full h-16 text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
            value === true ? 'ring-2 ring-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'hover:bg-accent/50 border-2 border-transparent hover:border-accent/30'
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
          className={`w-full h-16 text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
            value === false ? 'ring-2 ring-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'hover:bg-accent/50 border-2 border-transparent hover:border-accent/30'
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
            className={`w-full p-4 h-auto text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              value === option.value ? 'ring-2 ring-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]' : 'hover:bg-accent/50 border-2 border-transparent hover:border-accent/30'
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
});

QuestionRenderer.displayName = 'QuestionRenderer';

export { QuestionRenderer };