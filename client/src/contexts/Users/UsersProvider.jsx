import { useState } from 'react';
import { UsersContext } from './UsersContext.jsx';

export const UsersProvider = ({ children }) => {
  const [attachmentPicker, setAttachmentPicker] = useState("");

  const chooseAttachment = () => {
    setAttachmentPicker();
  };

  return <UsersContext.Provider value={{
    attachmentPicker,
    chooseAttachment
  }}>
    {children}
  </UsersContext.Provider>;
};
