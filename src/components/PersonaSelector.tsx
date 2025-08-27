import React, { useState, useEffect } from 'react';
import { Trait, Persona } from '../types/persona';
import { personaApi } from '../services/api';

interface PersonaSelectorProps {
  userId: number;
  onSelectionComplete: () => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ userId, onSelectionComplete }) => {
  const [traits, setTraits] = useState<Trait[]>([]);
  const [selectedTraitIds, setSelectedTraitIds] = useState<string[]>([]);
  const [selfPersona, setSelfPersona] = useState<Persona | null>(null);
  const [desiredPersona, setDesiredPersona] = useState<Persona | null>(null);
  const [activeTab, setActiveTab] = useState<'self' | 'desired'>('self');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTraits();
  }, []);

  const loadTraits = async () => {
    try {
      const response = await personaApi.getTraits();
      console.log("Response:", response);
      setTraits(response.data);
    } catch (error) {
      console.error('Failed to load traits:', error);
    }
  };

  const handleTraitToggle = (traitId: string) => {
    setSelectedTraitIds(prev => 
      prev.includes(traitId) 
        ? prev.filter(id => id !== traitId)
        : [...prev, traitId]
    );
  };

  const generatePersona = async (isSelf: boolean) => {
    if (selectedTraitIds.length === 0) {
      alert('Please select at least one trait');
      return;
    }

    setIsLoading(true);
    try {
      const response = await personaApi.generatePersona(selectedTraitIds, isSelf);
      if (isSelf) {
        setSelfPersona(response.data);
      } else {
        setDesiredPersona(response.data);
      }
    } catch (error) {
      console.error('Failed to generate persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePersona = async () => {
    if (!selfPersona) {
      alert('Please generate your self persona first');
      return;
    }

    setIsLoading(true);
    try {
      const selection = {
        selectedTraitIds,
        selfPersona,
        desiredMatch: desiredPersona || undefined,
      };

      await personaApi.savePersona(userId, selection);
      onSelectionComplete();
    } catch (error) {
      console.error('Failed to save persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const traitsByCategory = traits.reduce((acc, trait) => {
    if (!acc[trait.category]) {
      acc[trait.category] = [];
    }
    acc[trait.category].push(trait);
    return acc;
  }, {} as Record<string, Trait[]>);

  return (
    <div className="persona-selector">
      <h1>Create Your Persona Profile</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'self' ? 'active' : ''}
          onClick={() => setActiveTab('self')}
        >
          Who I Am
        </button>
        <button 
          className={activeTab === 'desired' ? 'active' : ''}
          onClick={() => setActiveTab('desired')}
        >
          Who I'm Looking For
        </button>
      </div>

      <div className="traits-selection">
        <h2>Select {activeTab === 'self' ? 'your traits' : 'desired traits'}</h2>
        
        <div className="traits-container">
          {Object.entries(traitsByCategory).map(([category, categoryTraits]) => (
            <div key={category} className="category">
              <h3>{category}</h3>
              <div className="traits-list">
                {categoryTraits.map(trait => (
                  <div 
                    key={trait.id}
                    className={`trait ${selectedTraitIds.includes(trait.id) ? 'selected' : ''}`}
                    onClick={() => handleTraitToggle(trait.id)}
                  >
                    {trait.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button 
            onClick={() => generatePersona(activeTab === 'self')}
            disabled={isLoading || selectedTraitIds.length === 0}
          >
            {isLoading ? 'Generating...' : `Generate ${activeTab === 'self' ? 'Self' : 'Desired'} Persona`}
          </button>
        </div>
      </div>

      {(selfPersona && activeTab === 'self') || (desiredPersona && activeTab === 'desired') ? (
        <div className="persona-preview">
          <h2>{activeTab === 'self' ? 'Your Persona' : 'Desired Match Persona'}</h2>
          <div className="persona-summary">
            <p>{(activeTab === 'self' ? selfPersona : desiredPersona)?.summary}</p>
            <h4>Selected Traits:</h4>
            <ul>
              {(activeTab === 'self' ? selfPersona : desiredPersona)?.traits.map(trait => (
                <li key={trait.id}>{trait.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {selfPersona && (
        <div className="final-actions">
          <button onClick={savePersona} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Complete Profile Setup'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;