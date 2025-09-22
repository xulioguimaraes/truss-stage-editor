import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  min-width: 250px;
  max-width: 300px;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Label = styled.span`
  color: #666;
  font-size: 12px;
  font-weight: 500;
`;

const Value = styled.span`
  color: #333;
  font-size: 12px;
  font-family: 'Courier New', monospace;
`;

const RotationControls = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2px;
  min-width: 40px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MovementSwitch = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 4px;
  margin: 8px 0;
  position: relative;
`;

const SwitchOption = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const ModeIndicator = styled.div`
  margin-top: 8px;
  padding: 8px;
  border-radius: 6px;
  background: ${props => props.mode === 'horizontal' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(245, 87, 108, 0.1)'};
  border-left: 3px solid ${props => props.mode === 'horizontal' ? '#667eea' : '#f5576c'};
  font-size: 11px;
  color: #333;
`;

const SelectedPieceInfo = ({ selectedPiece, movementMode, onRotate, onUpdatePiece, onToggleMovementMode }) => {
  if (!selectedPiece) {
    return (
      <InfoContainer>
        <Title>Nenhuma peça selecionada</Title>
        <InfoRow>
          <Label>Clique em uma peça para ver suas propriedades</Label>
        </InfoRow>
      </InfoContainer>
    );
  }

  const formatPosition = (pos) => `(${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)})`;
  const formatRotation = (rot) => `(${(rot[0] * 180 / Math.PI).toFixed(1)}°, ${(rot[1] * 180 / Math.PI).toFixed(1)}°, ${(rot[2] * 180 / Math.PI).toFixed(1)}°)`;

  return (
    <InfoContainer>
      <Title>Peça Selecionada</Title>
      
      <InfoRow>
        <Label>Tipo:</Label>
        <Value>{selectedPiece.type}</Value>
      </InfoRow>
      
      <InfoRow>
        <Label>ID:</Label>
        <Value>{selectedPiece.id}</Value>
      </InfoRow>
      
      <InfoRow>
        <Label>Posição:</Label>
        <Value>{formatPosition(selectedPiece.position)}</Value>
      </InfoRow>
      
      <InfoRow>
        <Label>Rotação:</Label>
        <Value>{formatRotation(selectedPiece.rotation)}</Value>
      </InfoRow>
      
      <InfoRow>
        <Label>Escala:</Label>
        <Value>{formatPosition(selectedPiece.scale)}</Value>
      </InfoRow>

      {/* Controles de Modo de Movimento */}
      <RotationControls>
        <Label>Modo de Movimento:</Label>
        <MovementSwitch>
          <SwitchOption 
            active={movementMode === 'horizontal'} 
            onClick={() => onToggleMovementMode()}
          >
            📐 X-Z
          </SwitchOption>
          <SwitchOption 
            active={movementMode === 'vertical'} 
            onClick={() => onToggleMovementMode()}
          >
            📏 Y
          </SwitchOption>
        </MovementSwitch>
        <ModeIndicator mode={movementMode}>
          {movementMode === 'horizontal' 
            ? '🔄 Arraste para mover no plano horizontal (X-Z)' 
            : '⬆️ Arraste para cima/baixo para mover na altura (Y)'
          }
        </ModeIndicator>
        <div style={{ marginTop: '8px' }}>
          <Label>Altura Atual: {selectedPiece.position[1].toFixed(2)}m</Label>
        </div>
      </RotationControls>

      <RotationControls>
        <Label>Rotação Rápida:</Label>
        <div style={{ marginTop: '8px' }}>
          <Button onClick={() => onRotate(selectedPiece.id, [0, Math.PI/2, 0])}>
            Y+90°
          </Button>
          <Button onClick={() => onRotate(selectedPiece.id, [0, -Math.PI/2, 0])}>
            Y-90°
          </Button>
          <Button onClick={() => onRotate(selectedPiece.id, [0, Math.PI, 0])}>
            Y+180°
          </Button>
        </div>
        <div style={{ marginTop: '4px' }}>
          <Button onClick={() => onRotate(selectedPiece.id, [Math.PI/2, 0, 0])}>
            X+90°
          </Button>
          <Button onClick={() => onRotate(selectedPiece.id, [-Math.PI/2, 0, 0])}>
            X-90°
          </Button>
        </div>
        <div style={{ marginTop: '4px' }}>
          <Button onClick={() => onRotate(selectedPiece.id, [0, 0, Math.PI/2])}>
            Z+90°
          </Button>
          <Button onClick={() => onRotate(selectedPiece.id, [0, 0, -Math.PI/2])}>
            Z-90°
          </Button>
        </div>
      </RotationControls>
    </InfoContainer>
  );
};

export default SelectedPieceInfo;

