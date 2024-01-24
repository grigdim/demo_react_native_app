import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
  const [domain, setInfoDomain] = useState('');
  const [storeId, setInfoStoreId] = useState('');

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedDomain = await AsyncStorage.getItem('@domain');
        const storedStoreId = await AsyncStorage.getItem('@storeId');

        if (storedDomain) {
          setInfoDomain(storedDomain);
        }

        if (storedStoreId) {
          setInfoStoreId(storedStoreId);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    }

    loadStoredData();
  }, []);

  // Update stored data whenever domain or storeId changes
  useEffect(() => {
    async function updateStoredData() {
      try {
        await AsyncStorage.setItem('@domain', domain);
        await AsyncStorage.setItem('@storeId', storeId);
      } catch (error) {
        console.error('Error storing data in AsyncStorage:', error);
      }
    }

    updateStoredData();
  }, [domain, storeId]);

  return (
    <InfoContext.Provider value={{ domain, setInfoDomain, storeId, setInfoStoreId }}>
      {children}
    </InfoContext.Provider>
  );
};

export const useInfo = () => useContext(InfoContext);
