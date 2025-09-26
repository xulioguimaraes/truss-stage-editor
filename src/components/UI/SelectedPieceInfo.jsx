import React, { useState, useCallback } from "react";
import styled from "styled-components";

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
  flex-direction: column;
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
  font-family: "Courier New", monospace;
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
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
  color: ${(props) => (props.$active ? "white" : "#666")};

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "rgba(102, 126, 234, 0.1)"};
  }
`;

const EditableValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  font-size: 10px;
  color: #333;
  &:hover {
    background-color: rgba(102, 126, 234, 0.1);
  }
`;

const EditableInput = styled.input`
  background: #f0f8ff;
  border: 2px solid #2196f3;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 11px;
  font-family: "Courier New", monospace;
  color: #1565c0;
  width: 60px;
  outline: none;
  font-weight: 700;

  &:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
    background: #e3f2fd;
    color: #0d47a1;
  }

  &:hover {
    border-color: #1976d2;
    background: #e8f4fd;
  }
`;

const LockButton = styled.button`
  background: ${(props) =>
    props.$locked
      ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
      : "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 2px;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LockSection = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LockStatus = styled.div`
  font-size: 11px;
  color: ${(props) => (props.$locked ? "#ff6b6b" : "#4ecdc4")};
  font-weight: 500;
`;

const SelectedPieceInfo = ({
  selectedPiece,
  movementMode,
  onRotate,
  onUpdatePiece,
  onToggleMovementMode,
  onToggleLock,
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleDoubleClick = useCallback((field, currentValue) => {
    setEditingField(field);
    // Formatar valor inicial como 0,00 se for posição, ou 0,0° se for rotação
    if (field.startsWith("pos")) {
      setEditValue(currentValue.toFixed(2).replace(".", ","));
    } else if (field.startsWith("rot")) {
      setEditValue(currentValue.toFixed(1).replace(".", ","));
    } else {
      setEditValue(currentValue.toString());
    }
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingField || !onUpdatePiece || !selectedPiece) return;

    try {
      // Converter vírgula para ponto para parseFloat
      const normalizedValue = editValue.replace(",", ".");
      const newValue = parseFloat(normalizedValue);

      if (isNaN(newValue)) {
        //console.warn('Valor inválido:', editValue);
        setEditingField(null);
        setEditValue("");
        return;
      }

      const currentPos = [...selectedPiece.position];
      const currentRot = [...selectedPiece.rotation];

      if (editingField.startsWith("pos")) {
        const axis = editingField.slice(-1); // X, Y, ou Z
        const axisIndex = axis === "X" ? 0 : axis === "Y" ? 1 : 2;
        currentPos[axisIndex] = newValue;
        onUpdatePiece(selectedPiece.id, { position: currentPos });
        //console.log('✅ Posição atualizada:', { axis, newValue, currentPos });
      } else if (editingField.startsWith("rot")) {
        const axis = editingField.slice(-1); // X, Y, ou Z
        const axisIndex = axis === "X" ? 0 : axis === "Y" ? 1 : 2;
        currentRot[axisIndex] = (newValue * Math.PI) / 180; // Converter graus para radianos
        onUpdatePiece(selectedPiece.id, { rotation: currentRot });
        //console.log('✅ Rotação atualizada:', { axis, newValue, currentRot });
      }
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }

    setEditingField(null);
    setEditValue("");
  }, [editingField, editValue, selectedPiece, onUpdatePiece]);

  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue("");
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  // Debug: Log da peça selecionada
  // Debug: Log lock status
  if (selectedPiece?.locked) {
    //console.log('🔒 SELECTED PIECE LOCKED:', { 'PieceId': selectedPiece.id, 'IsLocked': selectedPiece.locked });
  }

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

  const EditableField = ({ field, value, formatValue, isLocked }) => {
    if (editingField === field) {
      return (
        <EditableInput
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyPress}
          onKeyUp={(e) => {
            // Permitir Delete e Backspace
            if (e.key === "Delete" || e.key === "Backspace") {
              e.stopPropagation();
            }
          }}
          placeholder="0,00"
          autoFocus
        />
      );
    }

    return (
      <EditableValue
        onDoubleClick={() => !isLocked && handleDoubleClick(field, value)}
        title={
          isLocked
            ? "Peça bloqueada - duplo clique desabilitado"
            : "Duplo clique para editar"
        }
        style={{
          cursor: isLocked ? "not-allowed" : "pointer",
          opacity: isLocked ? 0.6 : 1,
        }}
      >
        {formatValue}
      </EditableValue>
    );
  };

  const formatPosition = (pos) =>
    `(${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)})`;

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
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <EditableField
            field="posX"
            value={selectedPiece.position[0]}
            formatValue={`X:${selectedPiece.position[0].toFixed(2)}`}
            isLocked={selectedPiece.locked}
          />
          <EditableField
            field="posY"
            value={selectedPiece.position[1]}
            formatValue={`Y:${selectedPiece.position[1].toFixed(2)}`}
            isLocked={selectedPiece.locked}
          />
          <EditableField
            field="posZ"
            value={selectedPiece.position[2]}
            formatValue={`Z:${selectedPiece.position[2].toFixed(2)}`}
            isLocked={selectedPiece.locked}
          />
        </div>
      </InfoRow>

      <InfoRow>
        <Label>Rotação:</Label>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <EditableField
            field="rotX"
            value={(selectedPiece.rotation[0] * 180) / Math.PI}
            formatValue={`X:${(
              (selectedPiece.rotation[0] * 180) /
              Math.PI
            ).toFixed(1)}°`}
            isLocked={selectedPiece.locked}
          />
          <EditableField
            field="rotY"
            value={(selectedPiece.rotation[1] * 180) / Math.PI}
            formatValue={`Y:${(
              (selectedPiece.rotation[1] * 180) /
              Math.PI
            ).toFixed(1)}°`}
            isLocked={selectedPiece.locked}
          />
          <EditableField
            field="rotZ"
            value={(selectedPiece.rotation[2] * 180) / Math.PI}
            formatValue={`Z:${(
              (selectedPiece.rotation[2] * 180) /
              Math.PI
            ).toFixed(1)}°`}
            isLocked={selectedPiece.locked}
          />
        </div>
      </InfoRow>

      <InfoRow>
        <Label>Escala:</Label>
        <Value>{formatPosition(selectedPiece.scale)}</Value>
      </InfoRow>

      {/* Seção de Bloqueio */}
      <LockSection>
        <LockStatus $locked={selectedPiece.locked}>
          {selectedPiece.locked ? "🔒 Peça Bloqueada" : "🔓 Peça Livre"}
        </LockStatus>
        <LockButton
          $locked={selectedPiece.locked}
          onClick={() => onToggleLock && onToggleLock(selectedPiece.id)}
        >
          {selectedPiece.locked ? "🔓" : "🔒"}
          {selectedPiece.locked ? "Desbloquear" : "Bloquear"}
        </LockButton>
      </LockSection>

      {/* Controles de Modo de Movimento */}
      <RotationControls>
        <Label>Modo de Movimento:</Label>
        <MovementSwitch>
          <SwitchOption
            $active={movementMode === "horizontal"}
            onClick={() => onToggleMovementMode()}
          >
            📐 X-Z
          </SwitchOption>
          <SwitchOption
            $active={movementMode === "vertical"}
            onClick={() => onToggleMovementMode()}
          >
            📏 Y
          </SwitchOption>
        </MovementSwitch>

        <div style={{ marginTop: "8px" }}>
          <Label>Altura Atual: {selectedPiece.position[1].toFixed(2)}m</Label>
        </div>
      </RotationControls>

      {/* Controles de Rotações Rápidas */}
      <RotationControls>
        <Label>Orientação Rápida:</Label>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={() => onRotate(selectedPiece.id, [0, 0, Math.PI / 2])}
            style={{
              background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
              minWidth: "80px",
            }}
          >
            Vertical
          </Button>

          <Button
            onClick={() => onRotate(selectedPiece.id, [0, 0, 0])}
            style={{
              background: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
              minWidth: "80px",
            }}
          >
            🔄 Original
          </Button>
        </div>
      </RotationControls>

      <RotationControls>
        <Label>Rotação Rápida:</Label>
        <div style={{ marginTop: "8px" }}>
          <Button
            onClick={() => onRotate(selectedPiece.id, [0, Math.PI / 2, 0])}
          >
            Y+90°
          </Button>

          <Button onClick={() => onRotate(selectedPiece.id, [0, Math.PI, 0])}>
            Y+180°
          </Button>
        </div>
      </RotationControls>
    </InfoContainer>
  );
};

export default SelectedPieceInfo;
