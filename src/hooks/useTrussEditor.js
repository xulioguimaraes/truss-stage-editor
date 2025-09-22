import { useState, useCallback, useRef } from 'react';

export const useTrussEditor = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState([0, 0, 0]);
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
    setPieces(prev => prev.map(piece => 
      piece.id === id ? { ...piece, ...updates } : piece
    ));
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

  return {
    pieces,
    selectedPiece,
    draggingPiece,
    dragOffset,
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
  };
};

