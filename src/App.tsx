import React, { useState } from 'react';
import PersonaSelector from './components/PersonaSelector';
import MatchResults from './components/MatchResults';
import './App.css';

const App: React.FC = () => {
  const [userId] = useState(1); // In a real app, this would come from authentication
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Persona Matchmaking</h1>
      </header>
      
      <main>
        {!hasCompletedOnboarding ? (
          <PersonaSelector 
            userId={userId} 
            onSelectionComplete={handleOnboardingComplete} 
          />
        ) : (
          <MatchResults userId={userId} />
        )}
      </main>
    </div>
  );
};

export default App;