import React from 'react';

interface MatchPageProps {
  params: {
    id: string;
  };
}

const SpecificMatchPage = ({ params }: MatchPageProps) => {
    
  const { id } = params;

  return (
    <div>
      <h1>Specific Match Page</h1>
      <p>Match ID: {id}</p>
    </div>
  );
};

export default SpecificMatchPage;
