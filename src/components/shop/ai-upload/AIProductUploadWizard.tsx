import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Steps } from '@/components/ui/steps';
import { Step1ImageUpload } from './steps/Step1ImageUpload';
import { Step2ProductName } from './steps/Step2ProductName';
import { Step3Description } from './steps/Step3Description';
import { Step4PriceCategory } from './steps/Step4PriceCategory';
import { Step5Review } from './steps/Step5Review';
import { useWizardState } from './hooks/useWizardState';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { title: 'Imágenes', description: 'Sube las fotos de tu producto' },
  { title: 'Nombre', description: 'Define el nombre perfecto' },
  { title: 'Descripción', description: 'Crea una descripción atractiva' },
  { title: 'Precio', description: 'Configura precio y categoría' },
  { title: 'Revisar', description: 'Revisa y publica tu producto' },
];

export const AIProductUploadWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { wizardState, updateWizardState, resetWizard } = useWizardState();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Solo permitir navegar a pasos completados o el siguiente
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1ImageUpload
            images={wizardState.images}
            onImagesChange={(images) => updateWizardState({ images })}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <Step2ProductName
            images={wizardState.images}
            name={wizardState.name}
            onNameChange={(name) => updateWizardState({ name })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <Step3Description
            images={wizardState.images}
            name={wizardState.name}
            description={wizardState.description}
            onDescriptionChange={(description) => updateWizardState({ description })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Step4PriceCategory
            name={wizardState.name}
            description={wizardState.description}
            price={wizardState.price}
            category={wizardState.category}
            tags={wizardState.tags}
            onDataChange={(data) => updateWizardState(data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <Step5Review
            wizardState={wizardState}
            onEdit={(step) => setCurrentStep(step)}
            onPublish={() => {
              // Handle publish logic
              console.log('Publishing product:', wizardState);
              resetWizard();
              setCurrentStep(0);
            }}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Asistente de Productos con IA
        </h1>
        <p className="text-muted-foreground">
          Te ayudamos paso a paso a crear el producto perfecto para tu tienda
        </p>
      </div>

      {/* Progress Steps */}
      <Steps steps={STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation */}
      {currentStep > 0 && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
        </div>
      )}
    </div>
  );
};