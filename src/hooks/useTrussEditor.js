import { useState, useCallback, useRef } from "react";

export const useTrussEditor = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [dragOffset, setDragOffset] = useState([0, 0, 0]);
  const [movementMode, setMovementMode] = useState("horizontal"); // 'horizontal' ou 'vertical'
  const nextId = useRef(0);

  const addPiece = useCallback(
    (type, position = [0, 0, 0], rotation = [0, 0, 0]) => {
      const newPiece = {
        id: nextId.current++,
        type,
        position: [...position],
        rotation: [...rotation],
        scale: [1, 1, 1],
      };

      setPieces((prev) => [...prev, newPiece]);
      setSelectedPiece(newPiece.id);
      return newPiece;
    },
    []
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

  const updatePiece = useCallback((id, updates) => {
    console.log("🟣 UPDATEPIECE INPUT:", {
      ID: id,
      Updates: updates,
      "Position received": updates.position,
      "Position type": typeof updates.position,
      "Position isArray": Array.isArray(updates.position),
      "Position values": updates.position
        ? `X:${updates.position[0]?.toFixed(
            3
          )}, Y:${updates.position[1]?.toFixed(
            3
          )}, Z:${updates.position[2]?.toFixed(3)}`
        : "No position",
    });

    setPieces((prev) =>
      prev.map((piece) => {
        if (piece.id === id) {
          console.log("🟣 UPDATEPIECE: Found piece", {
            "Piece ID": piece.id,
            "Current position": piece.position,
            "Current position values": `X:${piece.position[0]?.toFixed(
              3
            )}, Y:${piece.position[1]?.toFixed(
              3
            )}, Z:${piece.position[2]?.toFixed(3)}`,
          });

          // Se está atualizando posição, garantir que altura nunca seja menor que 0
          if (updates.position) {
            const clampedPosition = [
              updates.position[0],
              Math.max(updates.position[1], 0), // Altura mínima = 0 (chão)z
              updates.position[2],
            ];

            console.log("🟣 UPDATEPIECE: Clamped position", {
              "Original position": updates.position,
              "Clamped position": clampedPosition,
              "Clamped values": `X:${clampedPosition[0]?.toFixed(
                3
              )}, Y:${clampedPosition[1]?.toFixed(
                3
              )}, Z:${clampedPosition[2]?.toFixed(3)}`,
            });

            const newPiece = {
              ...piece,
              ...updates,
              position: clampedPosition,
            };

            console.log("🟣 UPDATEPIECE: Final piece", {
              "New piece position": newPiece.position,
              "New piece values": `X:${newPiece.position[0]?.toFixed(
                3
              )}, Y:${newPiece.position[1]?.toFixed(
                3
              )}, Z:${newPiece.position[2]?.toFixed(3)}`,
            });

            return newPiece;
          }
          return { ...piece, ...updates };
        }
        return piece;
      })
    );
  }, []);

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

      console.log("🔄 ROTATION:", {
        "Piece type": piece.type,
        Rotation: `X:${rotation[0].toFixed(3)}, Y:${rotation[1].toFixed(
          3
        )}, Z:${rotation[2].toFixed(3)}`,
        "Old position": `X:${piece.position[0].toFixed(
          3
        )}, Y:${piece.position[1].toFixed(3)}, Z:${piece.position[2].toFixed(
          3
        )}`,
        "New position": `X:${newPosition[0].toFixed(
          3
        )}, Y:${newPosition[1].toFixed(3)}, Z:${newPosition[2].toFixed(3)}`,
      });

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
