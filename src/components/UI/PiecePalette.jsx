import React from 'react';
import styled from 'styled-components';

const PaletteContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  min-width: 250px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const PieceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const PieceButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 80px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PieceIcon = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const PieceName = styled.span`
  text-align: center;
  line-height: 1.2;
`;

const pieceTypes = [
  { type: 'Cube5Faces', name: 'Cubo 5 Faces', icon: '⬜' },
  { type: 'Grid0_5m', name: 'Grid 0,5m', icon: '📏' },
  { type: 'Grid1m', name: 'Grid 1m', icon: '📏' },
  { type: 'Grid2m', name: 'Grid 2m', icon: '📏' },
  { type: 'Grid3m', name: 'Grid 3m', icon: '📏' },
  { type: 'Grid4m', name: 'Grid 4m', icon: '📏' },
  { type: 'Sapata', name: 'Sapata', icon: '🔲' },
  { type: 'Cumeeira', name: 'Cumeeira', icon: '🌙' },
];

const PiecePalette = ({ onAddPiece }) => {
  return (
    <PaletteContainer>
      <Title>Peças do Truss</Title>
      <PieceGrid>
        {pieceTypes.map((piece) => (
          <PieceButton
            key={piece.type}
            onClick={() => onAddPiece(piece.type)}
            title={`Adicionar ${piece.name}`}
          >
            <PieceIcon>{piece.icon}</PieceIcon>
            <PieceName>{piece.name}</PieceName>
          </PieceButton>
        ))}
      </PieceGrid>
    </PaletteContainer>
  );
};

export default PiecePalette;

