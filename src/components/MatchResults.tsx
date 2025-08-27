import React, { useState, useEffect } from 'react';
import { Persona } from '../types/persona';
import { personaApi } from '../services/api';

interface Match {
  id: number;
  name: string;
  email: string;
  similarity: number;
  selfPersona: Persona;
}

interface MatchResultsProps {
  userId: number;
}

const MatchResults: React.FC<MatchResultsProps> = ({ userId }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [userId]);

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      const response = await personaApi.getMatches(userId);
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <div className="match-results">
      <h2>Your Top Matches</h2>
      
      {matches.length === 0 ? (
        <p>No matches found. Complete your persona profile to get matches.</p>
      ) : (
        <div className="matches-list">
          {matches.map(match => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <h3>{match.name}</h3>
                <span className="similarity">{Math.round(match.similarity * 100)}% match</span>
              </div>
              <p className="email">{match.email}</p>
              <div className="persona-summary">
                <p>{match.selfPersona.summary}</p>
              </div>
              <button className="connect-btn">Connect</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchResults;