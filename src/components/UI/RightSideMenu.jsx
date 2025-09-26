import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 160px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MenuPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 250px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1001;
`;

const MenuTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

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

const LockButton = styled(Button)`
  background: ${props => props.locked ? 
    'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' : 
    'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
  };
`;

const FileInput = styled.input`
  display: none;
`;

const InfoText = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  line-height: 1.4;
`;

const RightSideMenu = ({ 
  // Props para controles básicos
  onResetCamera,
  onClearAll,
  pieceCount,
  
  // Props para gerenciamento
  selectedPieces,
  onExportProject,
  onImportProject,
  onSelectAll,
  onClearSelection,
  onLockSelected,
  onUnlockSelected
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const fileInputRef = useRef();

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImportProject(file);
    }
  };

  const selectedCount = selectedPieces.size;

  return (
    <MenuContainer>
      {/* Botão de Controles Básicos */}
      <MenuButton onClick={() => toggleMenu('controls')}>
        🎮 Controles
      </MenuButton>
      
      {activeMenu === 'controls' && (
        <MenuPanel>
          <MenuTitle>Controles Básicos</MenuTitle>
          
          <ButtonGroup>
            <Button onClick={onResetCamera}>
              📷 Resetar Câmera
            </Button>
            
            <Button onClick={onClearAll}>
              🧹 Limpar Tudo
            </Button>
          </ButtonGroup>
          
          <InfoText>
            <strong>Status:</strong><br/>
            • Peças no projeto: {pieceCount}<br/>
            • Peças selecionadas: {selectedCount}
          </InfoText>
        </MenuPanel>
      )}

      {/* Botão de Gerenciamento */}
      <MenuButton onClick={() => toggleMenu('management')}>
        ⚙️ Gerenciamento
      </MenuButton>
      
      {activeMenu === 'management' && (
        <MenuPanel>
          <MenuTitle>Gerenciamento de Projeto</MenuTitle>
          
          <ButtonGroup>
            {/* Exportar/Importar */}
            <Button onClick={onExportProject}>
              📤 Exportar Projeto
            </Button>
            
            <Button onClick={handleImportClick}>
              📥 Importar Projeto
            </Button>
            
            <FileInput
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
            />
            
            {/* Seleção */}
            <Button onClick={onSelectAll}>
              ☑️ Selecionar Todas ({pieceCount})
            </Button>
            
            <Button 
              onClick={onClearSelection}
              disabled={selectedCount === 0}
            >
              ❌ Limpar Seleção ({selectedCount})
            </Button>
            
            {/* Bloqueio */}
            <LockButton 
              onClick={onLockSelected}
              disabled={selectedCount === 0}
            >
              🔒 Bloquear Selecionadas
            </LockButton>
            
            <LockButton 
              onClick={onUnlockSelected}
              disabled={selectedCount === 0}
              locked={false}
            >
              🔓 Desbloquear Selecionadas
            </LockButton>
          </ButtonGroup>
          
          <InfoText>
            <strong>Atalhos:</strong><br/>
            • Ctrl+A: Selecionar todas<br/>
            • Ctrl+S: Exportar<br/>
            • Ctrl+L: Bloquear<br/>
            • Escape: Limpar seleção
          </InfoText>
        </MenuPanel>
      )}
    </MenuContainer>
  );
};

export default RightSideMenu;





