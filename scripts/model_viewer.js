import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Selecionar o container
const container = document.getElementById('model-container');
const loadingText = document.getElementById('loading-model');

// Configuração básica da cena
const scene = new THREE.Scene();
const clock = new THREE.Clock(); // Adicionado relógio para controlar a animação
let mixer; // Variável global para a animação

// Câmera
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / 700, 1, 2000);
// Ajuste a posição inicial da câmera dependendo da escala do modelo
camera.position.set(0, 100, 300);

// Renderizador com fundo transparente (alpha: true)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// Definindo a altura fixa ou adaptativa. Usaremos 700px como altura base para o container.
renderer.setSize(container.clientWidth, 700);
renderer.setPixelRatio(window.devicePixelRatio);
// Adiciona o canvas no container
container.appendChild(renderer.domElement);

// Controles (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Rotação mais suave
controls.dampingFactor = 0.05; // Fator de amortecimento da câmera
controls.enablePan = true;     // ATIVADO: Permite mover a câmera clicando com o botão direito
controls.enableZoom = true;    // ATIVADO: Zoom nativo

// Limites de Zoom
controls.minDistance = 50; // Zoom in máximo (não deixa entrar dentro do modelo)
controls.maxDistance = 500; // Zoom out máximo (não deixa o modelo sumir longe)

// Ajustando o alvo provisório (depois será reajustado assim que o modelo carregar)
controls.target.set(0, 20, 0); 
controls.update();

// Iluminação
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 200, 100); //direção da luz principal
scene.add(directionalLight); //luz principal

const fillLight = new THREE.DirectionalLight(0xd90606, 0.4); // Uma leve luz vermelha pra combinar com Kratos
fillLight.position.set(-100, 100, -100); 
scene.add(fillLight);

// Carregador do Modelo FBX
const loader = new FBXLoader();

loader.load(
    '../assets/models/kratos_model.fbx',
    (object) => {
        // Remover o texto de carregamento quando o modelo carregar
        if (loadingText) {
            loadingText.style.display = 'none';
        }

        // 1. Descobrir o tamanho original do modelo
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // 2. Ajustar a escala para um tamanho fixo visível
        if (maxDim > 0) {
            const scaleToFit = 240 / maxDim; // Aumentado para o modelo parecer maior
            object.scale.set(scaleToFit, scaleToFit, scaleToFit);
        }

        // 3. Recalcular o centro após redimensionar
        const newBox = new THREE.Box3().setFromObject(object);
        const center = newBox.getCenter(new THREE.Vector3());

        // 4. Centralizar o modelo e deslocar para CIMA no canvas para os pés aparecerem
        object.position.x = -center.x;
        object.position.y = -center.y + 40; // +40 empurra o modelo pra cima no canvas
        object.position.z = -center.z;

        // 5. Câmera mais perto para o modelo parecer grande, mirando no tronco
        camera.position.set(0, 20, 280);
        controls.target.set(0, 30, 0);
        controls.update();

        // 6. Prevenir que materiais do FBX fiquem invisíveis por bugs de transparência
        object.traverse((child) => {
            if (child.isMesh && child.material) {
                // Caso o material venha com transparência bugada, forçamos ele a ser opaco
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.transparent = false;
                        mat.depthWrite = true;
                    });
                } else {
                    child.material.transparent = false;
                    child.material.depthWrite = true;
                }
            }
        });

        // 7. Tocar animações (Tirar da T-pose) se existirem
        if (object.animations && object.animations.length > 0) {
            mixer = new THREE.AnimationMixer(object);
            // Pega a primeira animação do arquivo FBX e toca
            const action = mixer.clipAction(object.animations[0]);
            action.play();
        }

        scene.add(object);
    },
    (xhr) => {
        // Callback de progresso
        if (loadingText) {
            loadingText.innerText = `Carregando modelo 3D... ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
        }
    },
    (error) => {
        // Callback de erro
        console.error('Erro ao carregar o modelo FBX:', error);
        if (loadingText) {
            loadingText.innerText = 'Erro ao carregar o modelo.';
        }
    }
);

// Responsividade
window.addEventListener('resize', () => {
    // Atualizar tamanho se a janela mudar
    const width = container.clientWidth;
    const height = 700; // Mantém a altura fixa em 500px ou pode ser dinâmica
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Loop de Animação
function animate() {
    requestAnimationFrame(animate);
    
    // Calcula o tempo que passou desde o último frame (delta)
    const delta = clock.getDelta();
    
    // Atualiza a animação
    if (mixer) {
        mixer.update(delta);
    }

    // Atualizar controles (necessário para o damping)
    controls.update();

    renderer.render(scene, camera);
}

animate();
