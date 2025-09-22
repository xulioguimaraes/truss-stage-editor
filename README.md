# Editor 3D de Palco Truss

Um editor 3D interativo para criação de estruturas de palco usando sistema Box Truss, desenvolvido com ReactJS e Three.js.

## 🚀 Funcionalidades

- **Editor 3D Intuitivo**: Interface responsiva com controles de câmera orbitais
- **Peças de Truss**: 8 tipos diferentes de peças para montagem
- **Sistema de Arrastar e Soltar**: Movimentação fácil das peças na cena
- **Encaixe Automático**: Sistema inteligente de snapping entre peças
- **Rotação de Peças**: Controles de rotação em múltiplos eixos
- **Visualização em Tempo Real**: Renderização 3D com iluminação realista

## 🧩 Peças Disponíveis

1. **Cubo 5 Faces**: Conector em forma de cubo com 5 lados de encaixe
2. **Grid 0,5m**: Peça retangular de truss com 0,5m de comprimento
3. **Grid 1m**: Peça retangular de truss com 1m de comprimento
4. **Grid 2m**: Peça retangular de truss com 2m de comprimento
5. **Grid 3m**: Peça retangular de truss com 3m de comprimento
6. **Grid 4m**: Peça retangular de truss com 4m de comprimento
7. **Sapata**: Base quadrada para fixar a estrutura no chão
8. **Cumeeira**: Peça curva para formar o topo inclinado da cobertura

## 🎮 Como Usar

### Adicionando Peças
1. Clique em uma peça no painel esquerdo
2. A peça será adicionada na cena na posição (0,0,0)
3. Use o mouse para arrastar a peça para a posição desejada

### Movimentando Peças
- **Arrastar**: Clique e arraste uma peça para movê-la
- **Encaixe**: As peças se encaixam automaticamente quando próximas
- **Seleção**: Clique em uma peça para selecioná-la (aparece em verde)

### Rotacionando Peças
1. Selecione uma peça
2. Use os botões de rotação no painel inferior esquerdo
3. Ou use a tecla 'R' + arrastar (em desenvolvimento)

### Controles da Câmera
- **Orbitar**: Arraste com o botão esquerdo do mouse
- **Zoom**: Use a roda do mouse
- **Pan**: Arraste com o botão direito do mouse

### Atalhos de Teclado
- **Delete/Backspace**: Remove a peça selecionada
- **Escape**: Deseleciona a peça atual
- **R**: Ativa modo de rotação (em desenvolvimento)

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd truss-stage-editor

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Verificação de código
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── TrussPieces/     # Componentes 3D das peças
│   ├── UI/              # Componentes de interface
│   └── Scene3D.jsx      # Cena 3D principal
├── hooks/               # Hooks personalizados
│   ├── useTrussEditor.js    # Gerenciamento de estado
│   ├── useDragControls.js   # Controles de arraste
│   └── useSnapping.js       # Sistema de encaixe
├── styles/              # Estilos CSS
├── App.jsx              # Componente principal
└── main.jsx             # Ponto de entrada
```

## 🎨 Tecnologias Utilizadas

- **React 18**: Framework principal
- **Vite**: Build tool e servidor de desenvolvimento
- **Three.js**: Biblioteca 3D
- **React Three Fiber**: Integração React + Three.js
- **React Three Drei**: Componentes auxiliares para R3F
- **Styled Components**: Estilização CSS-in-JS
- **Leva**: Painel de controles para desenvolvimento

## 🔧 Funcionalidades Técnicas

### Sistema de Encaixe (Snapping)
- Detecção automática de proximidade entre peças
- Pontos de encaixe específicos para cada tipo de peça
- Visualização de preview durante o arraste

### Gerenciamento de Estado
- Estado centralizado para todas as peças da cena
- Controle de seleção e arraste
- Histórico de operações (futuro)

### Renderização 3D
- Iluminação realista com sombras
- Ambiente procedural
- Grid de referência no chão
- Controles de câmera orbitais

## 🚧 Funcionalidades Futuras

- [ ] Sistema de undo/redo
- [ ] Exportação de projetos
- [ ] Importação de modelos 3D
- [ ] Colisão entre peças
- [ ] Análise estrutural
- [ ] Modo de rotação com mouse
- [ ] Zoom com gestos touch
- [ ] Temas de interface
- [ ] Persistência de projetos

## 📱 Responsividade

O editor é totalmente responsivo e funciona em:
- Desktop (recomendado)
- Tablets
- Smartphones (com limitações de performance)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

Criado com ❤️ para facilitar o design de estruturas de palco truss.