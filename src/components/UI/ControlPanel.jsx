import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  min-width: 200px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ControlButton = styled.button`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
      case 'warning': return 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)';
      case 'success': return 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }};
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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

const InfoSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const InfoText = styled.p`
  margin: 8px 0;
  color: #666;
  font-size: 12px;
  line-height: 1.4;
`;

const KeyboardShortcuts = styled.div`
  margin-top: 15px;
`;

const ShortcutItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  font-size: 11px;
  color: #888;
`;

const ControlPanel = ({ 
  selectedPiece, 
  onDeleteSelected, 
  onClearAll, 
  onResetCamera,
  pieceCount 
}) => {
  return (
    <PanelContainer>
      <Title>Controles</Title>
      <ButtonGroup>
        <ControlButton 
          variant="danger" 
          onClick={onDeleteSelected}
          disabled={!selectedPiece}
        >
          🗑️ Deletar Selecionado
        </ControlButton>
        
        <ControlButton 
          variant="warning" 
          onClick={onClearAll}
          disabled={pieceCount === 0}
        >
          🧹 Limpar Tudo
        </ControlButton>
        
        <ControlButton 
          variant="success" 
          onClick={onResetCamera}
        >
          📷 Resetar Câmera
        </ControlButton>
      </ButtonGroup>

      <InfoSection>
        <InfoText>
          <strong>Peças na cena:</strong> {pieceCount}
        </InfoText>
        
        {selectedPiece && (
          <InfoText>
            <strong>Selecionado:</strong> {selectedPiece.type}
          </InfoText>
        )}

        <KeyboardShortcuts>
          <InfoText><strong>Atalhos:</strong></InfoText>
          <ShortcutItem>
            <span>Arrastar peça</span>
            <span>Clique + arrastar</span>
          </ShortcutItem>
          <ShortcutItem>
            <span>Rotacionar</span>
            <span>R + arrastar</span>
          </ShortcutItem>
          <ShortcutItem>
            <span>Selecionar</span>
            <span>Clique</span>
          </ShortcutItem>
          <ShortcutItem>
            <span>Deletar</span>
            <span>Delete</span>
          </ShortcutItem>
        </KeyboardShortcuts>
      </InfoSection>
    </PanelContainer>
  );
};

export default ControlPanel;

