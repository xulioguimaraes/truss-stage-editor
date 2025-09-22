import React, { useCallback, useEffect } from 'react';
import { useTrussEditor } from './hooks/useTrussEditor';
import Scene3D from './components/Scene3D';
import { PiecePalette, ControlPanel, SelectedPieceInfo } from './components/UI';
import './App.css';

function App() {
  const {
    pieces,
    selectedPiece,
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
    console.log('Resetar câmera');
  }, []);

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
          break;
        case 'r':
        case 'R':
          // Modo de rotação (será implementado)
          console.log('Modo de rotação ativado');
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
        draggingPiece={draggingPiece}
        movementMode={movementMode}
        onSelect={selectPiece}
        onUpdatePiece={updatePiece}
        onStartDrag={startDrag}
        onEndDrag={endDrag}
      />

      {/* Interface de usuário */}
      <PiecePalette onAddPiece={handleAddPiece} />
      
      <ControlPanel
        selectedPiece={getPieceById(selectedPiece)}
        onDeleteSelected={handleDeleteSelected}
        onClearAll={handleClearAll}
        onResetCamera={handleResetCamera}
        pieceCount={pieces.length}
      />

      <SelectedPieceInfo
        selectedPiece={getPieceById(selectedPiece)}
        movementMode={movementMode}
        onRotate={handleRotatePiece}
        onUpdatePiece={updatePiece}
        onToggleMovementMode={toggleMovementMode}
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
          <li>Clique em uma peça no painel para adicionar</li>
          <li>Selecione uma peça para ver os controles</li>
          <li>Use o switch para escolher modo de movimento:</li>
          <li style={{ marginLeft: '10px' }}>📐 X-Z: mover no plano horizontal</li>
          <li style={{ marginLeft: '10px' }}>📏 Y: mover na altura</li>
          <li>Arraste as peças conforme o modo selecionado</li>
          <li>Use Delete para remover a peça selecionada</li>
        </ul>
      </div>
    </div>
  );
}

export default App;