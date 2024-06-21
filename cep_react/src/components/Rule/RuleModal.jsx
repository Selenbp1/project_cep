import React, { useState } from 'react';
import { Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import RuleFormStep1 from './RuleFormStep1';
import RuleFormStep2 from './RuleFormStep2';
import RuleFormStep3 from './RuleFormStep3';
import RuleFormStep4 from './RuleFormStep4';

const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

const RuleModal = ({ rule, onSave, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(rule || {
    name: '', alert: false, owner: '', equipment: '', description: '', item: '', dataType: '',
    algorithm: '', sizeCount: '', featureValue: '', lowerValue: '', upperValue: '',
    statisticValue: '', orderType: '', lowerLimit: '', upperLimit: ''
  });

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = (data) => {
    console.log('저장할 데이터:', { ...formData, ...data });
    onSave({ ...formData, ...data });
    onClose();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="title-container">
        <Typography variant="h6" gutterBottom>룰 등록/수정</Typography>
      </Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, mb: 2 }}>
        {activeStep === 0 && <RuleFormStep1 onNext={handleNext} data={formData} />}
        {activeStep === 1 && <RuleFormStep2 onNext={handleNext} onBack={handleBack} data={formData} />}
        {activeStep === 2 && <RuleFormStep3 onNext={handleNext} onBack={handleBack} data={formData} />}
        {activeStep === 3 && <RuleFormStep4 onSave={handleSave} onBack={handleBack} data={formData} />}
      </Box>
    </Box>
  );
};

export default RuleModal;
