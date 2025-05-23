import React, {createContext, useState} from 'react';

export const SpeedContext = createContext();

export const SpeedProvider = ({children}) => {
  const [currentSpeed, setCurrentSpeed] = useState(0);

  return (
    <SpeedContext.Provider value={{currentSpeed, setCurrentSpeed}}>
      {children}
    </SpeedContext.Provider>
  );
};
