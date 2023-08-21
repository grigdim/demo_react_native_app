import React, { createContext, useContext, useState } from 'react';

const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
  const [vatNumber, setVatNumber] = useState('');
  const [primaryEmail, setPrimaryEmail] = useState('');

  const setInfoVat = (vat) => {
    setVatNumber(vat);
  };

  const setInfoPrimaryEmail = (vat) => {
    setPrimaryEmail(vat);
  };

  return (
    <InfoContext.Provider value={{ vatNumber, setInfoVat, primaryEmail, setInfoPrimaryEmail }}>
      {children}
    </InfoContext.Provider>
  );
};

export const useInfo = () => useContext(InfoContext);
