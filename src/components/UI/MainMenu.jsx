import React, { useState } from "react";
import styled from "styled-components";

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
  min-width: 140px;
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
  background: ${(props) =>
    props.locked
      ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)"
      : "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)"};
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

const PieceInfo = styled.div`
  margin: 15px 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const PieceTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const PropertyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  font-size: 12px;
`;

const PropertyLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const PropertyValue = styled.span`
  color: #333;
  font-weight: 600;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
`;

const InputRow = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 11px;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const Label = styled.label`
  font-size: 11px;
  color: #666;
  min-width: 20px;
  text-align: center;
`;

const MainMenu = ({
  // Props para controles
  selectedPiece,
  onDeleteSelected,
  onClearAll,
  onResetCamera,
  pieceCount,
  movementMode,
  onToggleMovementMode,
  onRotatePiece,
  onUpdatePiece,

  // Props para gerenciamento
  selectedPieces,
  onExportProject,
  onImportProject,
  onSelectAll,
  onClearSelection,
  onLockSelected,
  onUnlockSelected,
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const fileInputRef = React.useRef();

  // Estados para edição de propriedades
  const [positionInputs, setPositionInputs] = useState({ x: 0, y: 0, z: 0 });
  const [rotationInputs, setRotationInputs] = useState({ x: 0, y: 0, z: 0 });

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  // Atualizar inputs quando a peça selecionada mudar
  React.useEffect(() => {
    if (selectedPiece) {
      setPositionInputs({
        x: selectedPiece.position[0].toFixed(3),
        y: selectedPiece.position[1].toFixed(3),
        z: selectedPiece.position[2].toFixed(3),
      });
      setRotationInputs({
        x: ((selectedPiece.rotation[0] * 180) / Math.PI).toFixed(1),
        y: ((selectedPiece.rotation[1] * 180) / Math.PI).toFixed(1),
        z: ((selectedPiece.rotation[2] * 180) / Math.PI).toFixed(1),
      });
    }
  }, [selectedPiece]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImportProject(file);
    }
  };

  // Funções para editar propriedades
  const handlePositionChange = (axis, value) => {
    const numValue = parseFloat(value) || 0;
    setPositionInputs((prev) => ({ ...prev, [axis]: value }));

    if (selectedPiece) {
      const newPosition = [...selectedPiece.position];
      newPosition[axis === "x" ? 0 : axis === "y" ? 1 : 2] = numValue;
      onUpdatePiece(selectedPiece.id, { position: newPosition });
    }
  };

  const handleRotationChange = (axis, value) => {
    const numValue = parseFloat(value) || 0;
    setRotationInputs((prev) => ({ ...prev, [axis]: value }));

    if (selectedPiece) {
      const newRotation = [...selectedPiece.rotation];
      newRotation[axis === "x" ? 0 : axis === "y" ? 1 : 2] =
        (numValue * Math.PI) / 180;
      onUpdatePiece(selectedPiece.id, { rotation: newRotation });
    }
  };

  const selectedCount = selectedPieces.size;
  const selectedPieceData = selectedPiece;

  return (
    <MenuContainer>
      {/* Botão de Controles */}
      <MenuButton onClick={() => toggleMenu("controls")}>
        🎮 Controles
      </MenuButton>

      {activeMenu === "controls" && (
        <MenuPanel>
          <MenuTitle>Controles</MenuTitle>

          <ButtonGroup>
            {/* Controles de peça selecionada */}
            {selectedPieceData && (
              <>
                <Button onClick={() => onDeleteSelected()}>
                  🗑️ Deletar Peça Selecionada
                </Button>

                <Button onClick={() => onToggleMovementMode()}>
                  {movementMode === "horizontal"
                    ? "⬆️ Modo Vertical"
                    : "↔️ Modo Horizontal"}
                </Button>

                <Button
                  onClick={() =>
                    onRotatePiece(selectedPieceData.id, [0, 0, Math.PI / 2])
                  }
                >
                  🔄 Rotacionar Z+90°
                </Button>

                <Button
                  onClick={() =>
                    onRotatePiece(selectedPieceData.id, [Math.PI / 2, 0, 0])
                  }
                >
                  🔄 Rotacionar X+90°
                </Button>

                <Button
                  onClick={() => onRotatePiece(selectedPieceData.id, [0, 0, 0])}
                >
                  🔄 Rotação Normal
                </Button>
              </>
            )}

            {/* Controles gerais */}
            <Button onClick={onResetCamera}>📷 Resetar Câmera</Button>

            <Button onClick={onClearAll}>🧹 Limpar Tudo</Button>
          </ButtonGroup>

          {/* Informações da peça selecionada */}
          {selectedPieceData && (
            <PieceInfo>
              <PieceTitle>📦 {selectedPieceData.type}</PieceTitle>

              <PropertyRow>
                <PropertyLabel>ID:</PropertyLabel>
                <PropertyValue>{selectedPieceData.id}</PropertyValue>
              </PropertyRow>

              <PropertyRow>
                <PropertyLabel>Bloqueada:</PropertyLabel>
                <PropertyValue>
                  {selectedPieceData.locked ? "🔒 Sim" : "🔓 Não"}
                </PropertyValue>
              </PropertyRow>

              <PropertyRow>
                <PropertyLabel>Posição:</PropertyLabel>
                <PropertyValue>
                  X:{selectedPieceData.position[0].toFixed(2)}
                  Y:{selectedPieceData.position[1].toFixed(2)}
                  Z:{selectedPieceData.position[2].toFixed(2)}
                </PropertyValue>
              </PropertyRow>

              <PropertyRow>
                <PropertyLabel>Rotação:</PropertyLabel>
                <PropertyValue>
                  X:
                  {Math.round((selectedPieceData.rotation[0] * 180) / Math.PI)}°
                  Y:
                  {Math.round((selectedPieceData.rotation[1] * 180) / Math.PI)}°
                  Z:
                  {Math.round((selectedPieceData.rotation[2] * 180) / Math.PI)}°
                </PropertyValue>
              </PropertyRow>

              {/* Campos de edição */}
              <InputGroup>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "5px",
                  }}
                >
                  Editar Posição:
                </div>
                <InputRow>
                  <Label>X:</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={positionInputs.x}
                    onChange={(e) => handlePositionChange("x", e.target.value)}
                  />
                  <Label>Y:</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={positionInputs.y}
                    onChange={(e) => handlePositionChange("y", e.target.value)}
                  />
                  <Label>Z:</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={positionInputs.z}
                    onChange={(e) => handlePositionChange("z", e.target.value)}
                  />
                </InputRow>
              </InputGroup>

              <InputGroup>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "5px",
                  }}
                >
                  Editar Rotação (graus):
                </div>
                <InputRow>
                  <Label>X:</Label>
                  <Input
                    type="number"
                    step="1"
                    value={rotationInputs.x}
                    onChange={(e) => handleRotationChange("x", e.target.value)}
                  />
                  <Label>Y:</Label>
                  <Input
                    type="number"
                    step="1"
                    value={rotationInputs.y}
                    onChange={(e) => handleRotationChange("y", e.target.value)}
                  />
                  <Label>Z:</Label>
                  <Input
                    type="number"
                    step="1"
                    value={rotationInputs.z}
                    onChange={(e) => handleRotationChange("z", e.target.value)}
                  />
                </InputRow>
              </InputGroup>
            </PieceInfo>
          )}

          <InfoText>
            <strong>Atalhos:</strong>
            <br />
            • Delete: Deletar peça
            <br />
            • Escape: Deselecionar
            <br />
            • Ctrl+A: Selecionar todas
            <br />• Ctrl+S: Exportar
          </InfoText>
        </MenuPanel>
      )}

      {/* Botão de Gerenciamento */}
      <MenuButton onClick={() => toggleMenu("management")}>
        ⚙️ Gerenciamento
      </MenuButton>

      {activeMenu === "management" && (
        <MenuPanel>
          <MenuTitle>Gerenciamento</MenuTitle>

          <ButtonGroup>
            {/* Exportar/Importar */}
            <Button onClick={onExportProject}>📤 Exportar Projeto</Button>

            <Button onClick={handleImportClick}>📥 Importar Projeto</Button>

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

            <Button onClick={onClearSelection} disabled={selectedCount === 0}>
              ❌ Limpar Seleção ({selectedCount})
            </Button>

            {/* Bloqueio */}
            <LockButton onClick={onLockSelected} disabled={selectedCount === 0}>
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
            <strong>Status:</strong>
            <br />• Peças no projeto: {pieceCount}
            <br />• Peças selecionadas: {selectedCount}
            <br />• Peça ativa:{" "}
            {selectedPieceData ? selectedPieceData.type : "Nenhuma"}
          </InfoText>
        </MenuPanel>
      )}
    </MenuContainer>
  );
};

export default MainMenu;
