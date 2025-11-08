import { useState } from 'react';
import { ConfirmationContext } from './ConfirmationContext.jsx';

export const ConfirmationProvider = ({ children }) => {
  const [showDialog, setShowDialog] = useState(true);
  const [proceed, setProceed] = useState(false);
  const [enableBackgroundOptions, setEnableBackgroundOptions] = useState(false);
  const [dialogQuestion, setDialogQuestion] = useState('');
  const [background, setBackground] = useState(
    localStorage.getItem('background') ||
      localStorage.setItem('background', 'background-default')
  );

  const handleConfirm = (e) => {
    if (e.target.value === 'confirm') {
      setShowDialog(false);
      setDialogQuestion('');
      setProceed(true);
    }
  };

  const handleCancel = (e) => {
    console.log('Clicked');
    if (e.target.value === 'cancel') {
      setShowDialog(false);
      setDialogQuestion('');
      setProceed(false);
    }
  };

  const handleBackgroundOptions = (e) => {
    if (!localStorage.getItem('background')) {
      localStorage.setItem('background', e.target.value);
      setBackground(localStorage.getItem('background'));
    } else if (localStorage.getItem('background')) {
      if (
        e.target.value &&
        e.target.value !== localStorage.getItem('background')
      ) {
        localStorage.removeItem('background');
        localStorage.setItem('background', e.target.value);
        setBackground(localStorage.getItem('background'));
      } else {
        setBackground(localStorage.getItem('background'));
      }
    }
  };

  const toggleBackgroundOptions = (question) => {
    setEnableBackgroundOptions((prevState) => !prevState);
    if (enableBackgroundOptions) {
      setDialogQuestion(question);
    }
  };

  const handleDialogQuestion = (question) => {
    setShowDialog(true);
    setDialogQuestion(question);
  };

  return (
    <ConfirmationContext.Provider
      value={{
        showDialog,
        dialogQuestion,
        proceed,
        background,
        enableBackgroundOptions,
        handleConfirm,
        handleCancel,
        handleDialogQuestion,
        handleBackgroundOptions,
        toggleBackgroundOptions,
      }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
};
