import React, { useRef } from 'react';
import styled from 'styled-components';

const ManagerContainer = styled.div`
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

const ProjectManager = ({ 
  selectedPieces,
  onExportProject,
  onImportProject,
  onSelectAll,
  onClearSelection,
  onLockSelected,
  onUnlockSelected,
  onToggleLock
}) => {
  const fileInputRef = useRef();

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
    <ManagerContainer>
      <Title>Gerenciador de Projeto</Title>
      
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
          ☑️ Selecionar Todas
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
    </ManagerContainer>
  );
};

export default ProjectManager;



