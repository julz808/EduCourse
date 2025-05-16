
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TestType } from '../types';

interface TestTypeContextProps {
  testType: TestType;
  setTestType: (type: TestType) => void;
}

const TestTypeContext = createContext<TestTypeContextProps | undefined>(undefined);

export const TestTypeProvider = ({ children }: { children: ReactNode }) => {
  const [testType, setTestType] = useState<TestType>('NAPLAN');

  return (
    <TestTypeContext.Provider value={{ testType, setTestType }}>
      {children}
    </TestTypeContext.Provider>
  );
};

export const useTestType = () => {
  const context = useContext(TestTypeContext);
  if (context === undefined) {
    throw new Error('useTestType must be used within a TestTypeProvider');
  }
  return context;
};
