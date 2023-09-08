import React, { createContext, useContext, useState } from 'react';

const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
  const [domain, setDomain] = useState('');
  const [storeId, setStoreId] = useState('');

  const setInfoDomain = (domain) => {
    setDomain(domain);
  };

  const setInfoStoreId = (storeId) => {
    setStoreId(storeId);
  };

  return (
    <InfoContext.Provider value={{ domain, setDomain, storeId, setStoreId }}>
      {children}
    </InfoContext.Provider>
  );
};

export const useInfo = () => useContext(InfoContext);
