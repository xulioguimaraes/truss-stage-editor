import React, { useCallback, useEffect } from 'react';
import { useTrussEditor } from './hooks/useTrussEditor';
import Scene3D from './components/Scene3D';
import { PiecePalette, SelectedPieceInfo, RightSideMenu } from './components/UI';
import './App.css';

function App() {
  const {
    pieces,
    selectedPiece,
    selectedPieces,
    draggingPiece,
    movementMode,
    addPiece,
    removePiece,
    updatePiece,
    selectPiece,
    startDrag,
    endDrag,
    rotatePiece,
    getPieceById,
    clearAll,
    toggleMovementMode,
    // Novas funcionalidades
    togglePieceSelection,
    selectMultiplePieces,
    clearSelection,
    selectAllPieces,
    togglePieceLock,
    lockSelectedPieces,
    unlockSelectedPieces,
    exportProject,
    importProject,
  } = useTrussEditor();

  // Função para adicionar uma nova peça
  const handleAddPiece = useCallback((type) => {
    // Posicionar a nova peça na frente da câmera
    const newPosition = [0, 0, 0];
    addPiece(type, newPosition);
  }, [addPiece]);

  // Função para deletar a peça selecionada
  const handleDeleteSelected = useCallback(() => {
    if (selectedPiece !== null) {
      removePiece(selectedPiece);
    }
  }, [selectedPiece, removePiece]);

  // Função para limpar todas as peças
  const handleClearAll = useCallback(() => {
    if (window.confirm('Tem certeza que deseja remover todas as peças?')) {
      clearAll();
    }
  }, [clearAll]);

  // Função para rotacionar uma peça
  const handleRotatePiece = useCallback((id, rotation) => {
    rotatePiece(id, rotation);
  }, [rotatePiece]);

  // Função para resetar a câmera (será implementada no Scene3D)
  const handleResetCamera = useCallback(() => {
    // Esta função será conectada ao Scene3D
    //console.log('Resetar câmera');
  }, []);

  // Funções para seleção múltipla
  const handleToggleSelection = useCallback((id) => {
    togglePieceSelection(id);
  }, [togglePieceSelection]);

  const handleSelectAll = useCallback(() => {
    selectAllPieces();
  }, [selectAllPieces]);

  const handleClearSelection = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Funções para bloqueio
  const handleLockSelected = useCallback(() => {
    lockSelectedPieces();
  }, [lockSelectedPieces]);

  const handleUnlockSelected = useCallback(() => {
    unlockSelectedPieces();
  }, [unlockSelectedPieces]);

  // Funções para exportação/importação
  const handleExportProject = useCallback(() => {
    try {
      exportProject();
      //console.log('Projeto exportado com sucesso!');
    } catch (error) {
      //console.error('Erro ao exportar projeto:', error);
      alert('Erro ao exportar projeto: ' + error.message);
    }
  }, [exportProject]);

  const handleImportProject = useCallback(async (file) => {
    try {
      await importProject(file);
      //console.log('Projeto importado com sucesso!');
      alert('Projeto importado com sucesso!');
    } catch (error) {
      //console.error('Erro ao importar projeto:', error);
      alert('Erro ao importar projeto: ' + error.message);
    }
  }, [importProject]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          if (selectedPiece !== null) {
            handleDeleteSelected();
          }
          break;
        case 'Escape':
          selectPiece(null);
          clearSelection();
          break;
        case 'a':
        case 'A':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleSelectAll();
          }
          break;
        case 'l':
        case 'L':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (selectedPieces.size > 0) {
              handleLockSelected();
            }
          }
          break;
        case 'u':
        case 'U':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (selectedPieces.size > 0) {
              handleUnlockSelected();
            }
          }
          break;
        case 's':
        case 'S':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleExportProject();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPiece, handleDeleteSelected, selectPiece]);

  return (
    <div className="App">
      {/* Cena 3D principal */}
      <Scene3D
        pieces={pieces}
        selectedPiece={selectedPiece}
        selectedPieces={selectedPieces}
        draggingPiece={draggingPiece}
        movementMode={movementMode}
        onSelect={selectPiece}
        onToggleSelection={handleToggleSelection}
        onUpdatePiece={updatePiece}
        onStartDrag={startDrag}
        onEndDrag={endDrag}
      />

      {/* Interface de usuário */}
      <PiecePalette onAddPiece={handleAddPiece} />
      
      <RightSideMenu
        // Props para controles básicos
        onResetCamera={handleResetCamera}
        onClearAll={handleClearAll}
        pieceCount={pieces.length}
        
        // Props para gerenciamento
        selectedPieces={selectedPieces}
        onExportProject={handleExportProject}
        onImportProject={handleImportProject}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onLockSelected={handleLockSelected}
        onUnlockSelected={handleUnlockSelected}
      />

      <SelectedPieceInfo
        selectedPiece={getPieceById(selectedPiece)}
        movementMode={movementMode}
        onRotate={handleRotatePiece}
        onUpdatePiece={updatePiece}
        onToggleMovementMode={toggleMovementMode}
        onToggleLock={togglePieceLock}
      />

      {/* Overlay de instruções */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '250px',
        zIndex: 1000
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Como usar:</h4>
        <ul style={{ margin: 0, paddingLeft: '15px' }}>
          <li>Clique em uma peça no painel esquerdo para adicionar</li>
          <li>Selecione uma peça para ver suas informações no centro</li>
          <li>🎮 Controles: resetar câmera, limpar tudo</li>
          <li>⚙️ Gerenciamento: exportar, seleção, bloqueio</li>
          <li>Ctrl+Clique: seleção múltipla</li>
          <li>Arraste peças para mover</li>
          <li>Delete: remover peça selecionada</li>
        </ul>
      </div>
    </div>
  );
}

export default App;