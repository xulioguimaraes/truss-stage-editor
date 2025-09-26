import { useState, useCallback, useRef } from "react";

export const useTrussEditor = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPieces, setSelectedPieces] = useState(new Set()); // Seleção múltipla
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [draggingPieces, setDraggingPieces] = useState(new Set()); // Múltiplas peças sendo arrastadas
  const [dragOffset, setDragOffset] = useState([0, 0, 0]);
  const [movementMode, setMovementMode] = useState("horizontal"); // 'horizontal' ou 'vertical'
  const nextId = useRef(0);

  // Função para normalizar peças e garantir que todas tenham a propriedade locked
  const normalizePiece = useCallback((piece) => {
    return {
      ...piece,
      locked: Boolean(piece.locked), // Garantir que locked seja sempre um boolean
    };
  }, []);

  const addPiece = useCallback(
    (type, position = [0, 0, 0], rotation = [0, 0, 0]) => {
      const newPiece = normalizePiece({
        id: nextId.current++,
        type,
        position: [...position],
        rotation: [...rotation],
        scale: [1, 1, 1],
        locked: false, // Nova propriedade para bloquear peças
      });

      setPieces((prev) => [...prev, newPiece]);
      setSelectedPiece(newPiece.id);
      return newPiece;
    },
    [normalizePiece]
  );

  const removePiece = useCallback(
    (id) => {
      setPieces((prev) => prev.filter((piece) => piece.id !== id));
      if (selectedPiece === id) {
        setSelectedPiece(null);
      }
    },
    [selectedPiece]
  );

  const updatePiece = useCallback(
    (id, updates) => {
      setPieces((prev) =>
        prev.map((piece) => {
          if (piece.id === id) {
            // Se está atualizando posição, garantir que altura nunca seja menor que 0
            if (updates.position) {
              const clampedPosition = [
                updates.position[0],
                Math.max(updates.position[1], 0), // Altura mínima = 0 (chão)z
                updates.position[2],
              ];

              const newPiece = normalizePiece({
                ...piece,
                ...updates,
                position: clampedPosition,
              });

              return newPiece;
            }
            return normalizePiece({ ...piece, ...updates });
          }
          return piece;
        })
      );
    },
    [normalizePiece]
  );

  const selectPiece = useCallback((id) => {
    setSelectedPiece(id);
  }, []);

  const startDrag = useCallback((id, offset) => {
    setDraggingPiece(id);
    setDragOffset(offset);
  }, []);

  const updateDrag = useCallback(
    (newPosition) => {
      if (draggingPiece !== null) {
        updatePiece(draggingPiece, { position: newPosition });
      }
    },
    [draggingPiece, updatePiece]
  );

  const endDrag = useCallback(() => {
    setDraggingPiece(null);
    setDragOffset([0, 0, 0]);
  }, []);

  const rotatePiece = useCallback(
    (id, rotation) => {
      const piece = pieces.find((p) => p.id === id);
      if (!piece) return;

      // Calcular nova posição para manter a peça no chão após rotação
      let newPosition = [...piece.position];

      // Para rotação Z+90° (vertical), ajustar a posição Y baseado no tipo de peça
      if (rotation[2] === Math.PI / 2) {
        // Para grids, ajustar Y para que a base fique no chão
        if (piece.type.startsWith("Grid")) {
          const length = parseFloat(
            piece.type.replace("Grid", "").replace("m", "")
          );
          // Quando rotaciona para vertical, a altura da peça vira o comprimento
          // Ajustar Y para que a base fique no chão (altura da peça / 2)
          newPosition[1] = Math.max(length / 2, 0.2); // Base no chão
        } else if (piece.type === "Cube5Faces") {
          // Cubo: altura 1m, quando vertical a base fica em Y = 0.5
          newPosition[1] = 0.5;
        } else if (piece.type === "Sapata") {
          // Sapata: altura 0.4m, quando vertical a base fica em Y = 0.2
          newPosition[1] = 0.2;
        } else if (piece.type === "Cumeeira") {
          // Cumeeira: altura 0.5m, quando vertical a base fica em Y = 0.25
          newPosition[1] = 0.25;
        } else {
          newPosition[1] = Math.max(0, piece.position[1]);
        }
      }
      // Para rotação X+90° (horizontal), ajustar a posição Y
      else if (rotation[0] === Math.PI / 2) {
        // Se a peça vai ficar horizontal, ajustar Y para que a base fique no chão
        if (piece.type.startsWith("Grid")) {
          // Quando rotaciona para horizontal, a altura da peça vira a largura
          newPosition[1] = Math.max(0.2, 0.2); // Base no chão
        } else {
          newPosition[1] = Math.max(0, piece.position[1]);
        }
      }
      // Para rotação Y (girar no próprio eixo), manter posição
      else if (rotation[1] !== 0) {
        // Apenas girar, sem ajustar posição
        newPosition = [...piece.position];
      }
      // Para voltar à posição normal (0,0,0)
      else if (rotation[0] === 0 && rotation[1] === 0 && rotation[2] === 0) {
        // Voltar à posição original, mas garantir que a base fique no chão
        if (piece.type.startsWith("Grid")) {
          newPosition[1] = Math.max(0.2, 0.2); // Base no chão
        } else {
          newPosition[1] = Math.max(0, 0.1); // Base no chão
        }
      }

      updatePiece(id, { rotation, position: newPosition });
    },
    [updatePiece, pieces]
  );

  const getPieceById = useCallback(
    (id) => {
      return pieces.find((piece) => piece.id === id);
    },
    [pieces]
  );

  const clearAll = useCallback(() => {
    setPieces([]);
    setSelectedPiece(null);
    setDraggingPiece(null);
  }, []);

  const toggleMovementMode = useCallback(() => {
    setMovementMode((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal"
    );
  }, []);

  // Funções para seleção múltipla
  const togglePieceSelection = useCallback((id) => {
    setSelectedPieces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectMultiplePieces = useCallback((ids) => {
    setSelectedPieces(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPieces(new Set());
    setSelectedPiece(null);
  }, []);

  const selectAllPieces = useCallback(() => {
    setSelectedPieces(new Set(pieces.map((p) => p.id)));
  }, [pieces]);

  // Funções para bloqueio de peças
  const togglePieceLock = useCallback((id) => {
    setPieces((prev) => {
      const updated = prev.map((piece) => {
        if (piece.id === id) {
          const newLockedState = !piece.locked;
          const newPiece = { ...piece, locked: newLockedState };

          return newPiece;
        }
        return piece;
      });

      return updated;
    });
  }, []);

  const lockSelectedPieces = useCallback(() => {
    setPieces((prev) =>
      prev.map((piece) =>
        selectedPieces.has(piece.id)
          ? normalizePiece({ ...piece, locked: true })
          : piece
      )
    );
  }, [selectedPieces, normalizePiece]);

  const unlockSelectedPieces = useCallback(() => {
    setPieces((prev) =>
      prev.map((piece) =>
        selectedPieces.has(piece.id)
          ? normalizePiece({ ...piece, locked: false })
          : piece
      )
    );
  }, [selectedPieces, normalizePiece]);

  // Funções para arrastar múltiplas peças
  const startDragMultiple = useCallback((pieceIds, offset) => {
    setDraggingPieces(new Set(pieceIds));
    setDragOffset(offset);
  }, []);

  const updateDragMultiple = useCallback(
    (newPosition) => {
      if (draggingPieces.size === 0) return;

      const offset = dragOffset;
      const deltaX = newPosition[0] - offset[0];
      const deltaY = newPosition[1] - offset[1];
      const deltaZ = newPosition[2] - offset[2];

      setPieces((prev) =>
        prev.map((piece) => {
          if (draggingPieces.has(piece.id) && !piece.locked) {
            const newPos = [
              piece.position[0] + deltaX,
              Math.max(piece.position[1] + deltaY, 0), // Prevenir Y negativo
              piece.position[2] + deltaZ,
            ];
            return { ...piece, position: newPos };
          }
          return piece;
        })
      );

      setDragOffset(newPosition);
    },
    [draggingPieces, dragOffset]
  );

  const endDragMultiple = useCallback(() => {
    setDraggingPieces(new Set());
    setDragOffset([0, 0, 0]);
  }, []);

  // Funções para exportação e importação
  const exportProject = useCallback(() => {
    const projectData = {
      pieces: pieces.map((piece) => ({
        ...piece,
        // Garantir que as propriedades estão presentes
        locked: piece.locked || false,
      })),
      metadata: {
        version: "1.0",
        exportDate: new Date().toISOString(),
        pieceCount: pieces.length,
      },
    };

    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `truss-project-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [pieces]);

  const importProject = useCallback(
    (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target.result);

            // Validar estrutura do arquivo
            if (!projectData.pieces || !Array.isArray(projectData.pieces)) {
              throw new Error("Formato de arquivo inválido");
            }

            // Limpar peças existentes e carregar novas
            setPieces(
              projectData.pieces.map((piece) => ({
                ...piece,
                locked: piece.locked || false, // Garantir propriedade locked
              }))
            );

            // Atualizar próximo ID
            const maxId = Math.max(...projectData.pieces.map((p) => p.id), -1);
            nextId.current = maxId + 1;

            // Limpar seleções
            clearSelection();

            resolve(projectData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
        reader.readAsText(file);
      });
    },
    [clearSelection]
  );

  return {
    pieces,
    selectedPiece,
    selectedPieces,
    draggingPiece,
    draggingPieces,
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
    // Novas funcionalidades
    togglePieceSelection,
    selectMultiplePieces,
    clearSelection,
    selectAllPieces,
    togglePieceLock,
    lockSelectedPieces,
    unlockSelectedPieces,
    startDragMultiple,
    updateDragMultiple,
    endDragMultiple,
    exportProject,
    importProject,
  };
};
