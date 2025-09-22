import { useState, useCallback, useRef } from 'react';

export const useTrussEditor = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState([0, 0, 0]);
  const [movementMode, setMovementMode] = useState('horizontal'); // 'horizontal' ou 'vertical'
  const nextId = useRef(0);

  const addPiece = useCallback((type, position = [0, 0, 0], rotation = [0, 0, 0]) => {
    const newPiece = {
      id: nextId.current++,
      type,
      position: [...position],
      rotation: [...rotation],
      scale: [1, 1, 1],
    };
    
    setPieces(prev => [...prev, newPiece]);
    setSelectedPiece(newPiece.id);
    return newPiece;
  }, []);

  const removePiece = useCallback((id) => {
    setPieces(prev => prev.filter(piece => piece.id !== id));
    if (selectedPiece === id) {
      setSelectedPiece(null);
    }
  }, [selectedPiece]);

  const updatePiece = useCallback((id, updates) => {
    console.log('🟣 UPDATEPIECE INPUT:', {
      'ID': id,
      'Updates': updates,
      'Position received': updates.position,
      'Position type': typeof updates.position,
      'Position isArray': Array.isArray(updates.position),
      'Position values': updates.position ? 
        `X:${updates.position[0]?.toFixed(3)}, Y:${updates.position[1]?.toFixed(3)}, Z:${updates.position[2]?.toFixed(3)}` : 
        'No position'
    });
    
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        console.log('🟣 UPDATEPIECE: Found piece', {
          'Piece ID': piece.id,
          'Current position': piece.position,
          'Current position values': `X:${piece.position[0]?.toFixed(3)}, Y:${piece.position[1]?.toFixed(3)}, Z:${piece.position[2]?.toFixed(3)}`
        });
        
        // Se está atualizando posição, garantir que altura nunca seja menor que 0
        if (updates.position) {
          const clampedPosition = [
            updates.position[0],
            Math.max(updates.position[1], 0), // Altura mínima = 0 (chão)
            updates.position[2]
          ];
          
          console.log('🟣 UPDATEPIECE: Clamped position', {
            'Original position': updates.position,
            'Clamped position': clampedPosition,
            'Clamped values': `X:${clampedPosition[0]?.toFixed(3)}, Y:${clampedPosition[1]?.toFixed(3)}, Z:${clampedPosition[2]?.toFixed(3)}`
          });
          
          const newPiece = { ...piece, ...updates, position: clampedPosition };
          
          console.log('🟣 UPDATEPIECE: Final piece', {
            'New piece position': newPiece.position,
            'New piece values': `X:${newPiece.position[0]?.toFixed(3)}, Y:${newPiece.position[1]?.toFixed(3)}, Z:${newPiece.position[2]?.toFixed(3)}`
          });
          
          return newPiece;
        }
        return { ...piece, ...updates };
      }
      return piece;
    }));
  }, []);

  const selectPiece = useCallback((id) => {
    setSelectedPiece(id);
  }, []);

  const startDrag = useCallback((id, offset) => {
    setDraggingPiece(id);
    setDragOffset(offset);
  }, []);

  const updateDrag = useCallback((newPosition) => {
    if (draggingPiece !== null) {
      updatePiece(draggingPiece, { position: newPosition });
    }
  }, [draggingPiece, updatePiece]);

  const endDrag = useCallback(() => {
    setDraggingPiece(null);
    setDragOffset([0, 0, 0]);
  }, []);

  const rotatePiece = useCallback((id, rotation) => {
    updatePiece(id, { rotation });
  }, [updatePiece]);

  const getPieceById = useCallback((id) => {
    return pieces.find(piece => piece.id === id);
  }, [pieces]);

  const clearAll = useCallback(() => {
    setPieces([]);
    setSelectedPiece(null);
    setDraggingPiece(null);
  }, []);

  const toggleMovementMode = useCallback(() => {
    setMovementMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  }, []);

  return {
    pieces,
    selectedPiece,
    draggingPiece,
    dragOffset,
    movementMode,
    addPiece,
    removePiece,
    updatePiece,
    selectPiece,
    startDrag,
    updateDrag,
    endDrag,
    rotatePiece,
    getPieceById,
    clearAll,
    toggleMovementMode,
  };
};

