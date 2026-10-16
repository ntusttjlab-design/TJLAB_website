// ==========================================
// MSMTJL Lab Website - Interactive Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initThreeJsMolecule();
    initTerminal();
    initPublicationsFilter();
    initMobileMenu();
});

// ------------------------------------------
// 1. Three.js Interactive 3D Molecule
// ------------------------------------------
let scene, camera, renderer, moleculeGroup;
let isElectricFieldOn = false;
let clock;
let atoms = [];

function initThreeJsMolecule() {
    const container = document.getElementById('molecule-canvas');
    if (!container || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 38);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(20, 30, 25);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 0.9);
    dirLight2.position.set(-20, -20, -10);
    scene.add(dirLight2);

    moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);

    // Build a realistic aromatic / polymer repeat unit (e.g. Polyimide core fragment)
    const atomCoords = [
        // Benzene ring 1
        { type: 'C', pos: [0, 2.5, 0] },
        { type: 'C', pos: [2.16, 1.25, 0] },
        { type: 'C', pos: [2.16, -1.25, 0] },
        { type: 'C', pos: [0, -2.5, 0] },
        { type: 'C', pos: [-2.16, -1.25, 0] },
        { type: 'C', pos: [-2.16, 1.25, 0] },
        // Imide rings & Carbonyl oxygens (characteristic of Polyimides)
        { type: 'N', pos: [4.2, 0, 0] },
        { type: 'C', pos: [3.4, 2.0, 0] },
        { type: 'C', pos: [3.4, -2.0, 0] },
        { type: 'O', pos: [3.8, 3.6, 0.5] },
        { type: 'O', pos: [3.8, -3.6, -0.5] },
        // Left side imide
        { type: 'N', pos: [-4.2, 0, 0] },
        { type: 'C', pos: [-3.4, 2.0, 0] },
        { type: 'C', pos: [-3.4, -2.0, 0] },
        { type: 'O', pos: [-3.8, 3.6, -0.5] },
        { type: 'O', pos: [-3.8, -3.6, 0.5] },
        // Pendant Groups (bulky CF3 group on top to simulate low Dk/Df design!)
        { type: 'C', pos: [0, 4.8, 1.5] },
        { type: 'F', pos: [1.3, 5.3, 2.2] },
        { type: 'F', pos: [-1.3, 5.3, 2.2] },
        { type: 'F', pos: [0, 4.2, 3.2] },
        // Pendant aromatic ring attached to Nitrogen
        { type: 'C', pos: [6.2, 0, 0] },
        { type: 'C', pos: [7.2, 1.2, 0.4] },
        { type: 'C', pos: [8.6, 1.2, 0.4] },
        { type: 'C', pos: [9.3, 0, 0] },
        { type: 'C', pos: [8.6, -1.2, -0.4] },
        { type: 'C', pos: [7.2, -1.2, -0.4] },
        { type: 'H', pos: [7.0, 2.1, 0.7] },
        { type: 'H', pos: [9.3, 2.1, 0.7] },
        { type: 'H', pos: [10.4, 0, 0] },
        { type: 'H', pos: [9.3, -2.1, -0.7] },
        { type: 'H', pos: [7.0, -2.1, -0.7] }
    ];

    const materials = {
        C: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.2 }),
        N: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2, metalness: 0.3 }),
        O: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.3, emissive: 0x7f1d1d, emissiveIntensity: 0.2 }),
        F: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.2, emissive: 0x064e3b, emissiveIntensity: 0.3 }),
        H: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.1 })
    };

    const radii = { C: 0.85, N: 0.82, O: 0.78, F: 0.8, H: 0.5 };

    // Create atom meshes
    atomCoords.forEach((item, index) => {
        const geom = new THREE.SphereGeometry(radii[item.type] || 0.7, 32, 32);
        const mesh = new THREE.Mesh(geom, materials[item.type] || materials.C);
        mesh.position.set(...item.pos);
        mesh.userData = {
            initialPos: new THREE.Vector3(...item.pos),
            type: item.type,
            id: index
        };
        moleculeGroup.add(mesh);
        atoms.push(mesh);
    });

    // Auto connect bonds based on Euclidean distance
    const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4, metalness: 0.5 });
    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const p1 = atoms[i].position;
            const p2 = atoms[j].position;
            const dist = p1.distanceTo(p2);
            if (dist > 0.8 && dist < 2.3) {
                createCylinderBond(p1, p2, bondMat, moleculeGroup);
            }
        }
    }

    // Center molecule
    moleculeGroup.position.set(-2, 0, 0);

    // Mouse drag interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        moleculeGroup.rotation.y += deltaX * 0.008;
        moleculeGroup.rotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });
    window.addEventListener('touchend', () => { isDragging = false; });
    container.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        moleculeGroup.rotation.y += deltaX * 0.01;
        moleculeGroup.rotation.x += deltaY * 0.01;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    // Resize handler
    window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Electric field toggle button listener
    const fieldBtn = document.getElementById('toggle-field-btn');
    const fieldIndicator = document.getElementById('field-status-indicator');
    if (fieldBtn) {
        fieldBtn.addEventListener('click', () => {
            isElectricFieldOn = !isElectricFieldOn;
            if (isElectricFieldOn) {
                fieldBtn.classList.remove('bg-slate-800', 'text-slate-300');
                fieldBtn.classList.add('bg-cyan-500', 'text-slate-950', 'shadow-cyan-500/50');
                if (fieldIndicator) fieldIndicator.textContent = "⚡ 高頻電場 ON (10 GHz 偶極響應中)";
            } else {
                fieldBtn.classList.add('bg-slate-800', 'text-slate-300');
                fieldBtn.classList.remove('bg-cyan-500', 'text-slate-950', 'shadow-cyan-500/50');
                if (fieldIndicator) fieldIndicator.textContent = "電場 OFF (平衡熱擾動)";
            }
        });
    }

    animate();
}

function createCylinderBond(pointX, pointY, material, parent) {
    const direction = new THREE.Vector3().subVectors(pointY, pointX);
    const arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX);
    const geom = new THREE.CylinderGeometry(0.16, 0.16, direction.length(), 16);
    const mesh = new THREE.Mesh(geom, material);

    mesh.rotation.setFromQuaternion(arrow.quaternion);
    mesh.position.addVectors(pointX, direction.multiplyScalar(0.5));
    parent.add(mesh);
}

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (moleculeGroup) {
        if (!isElectricFieldOn) {
            moleculeGroup.rotation.y += 0.003;
            moleculeGroup.rotation.x = Math.sin(t * 0.5) * 0.15;
        } else {
            // Apply high-frequency alternating electric field oscillation!
            const freq = 16.0;
            const oscillation = Math.sin(t * freq) * 0.45;
            moleculeGroup.rotation.y += 0.002;
            moleculeGroup.rotation.z = oscillation;

            // Micro-vibrate polar carbonyl oxygens and fluorine atoms
            atoms.forEach(atom => {
                if (atom.userData.type === 'O' || atom.userData.type === 'F') {
                    const initP = atom.userData.initialPos;
                    atom.position.y = initP.y + Math.sin(t * freq * 1.5 + atom.userData.id) * 0.22;
                }
            });
        }
    }

    renderer.render(scene, camera);
}


// ------------------------------------------
// 2. Interactive Linux Terminal (Geek Mode)
// ------------------------------------------
function initTerminal() {
    const modal = document.getElementById('terminal-modal');
    const openBtn = document.getElementById('open-terminal-btn');
    const closeBtn = document.getElementById('close-terminal-btn');
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-output');

    if (!modal || !input || !body) return;

    const toggleTerminal = () => {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            input.focus();
        }
    };

    if (openBtn) openBtn.addEventListener('click', toggleTerminal);
    if (closeBtn) closeBtn.addEventListener('click', toggleTerminal);

    // Press `~` (backquote) to toggle terminal anywhere
    window.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                toggleTerminal();
            }
        }
    });

    const printLine = (html) => {
        const div = document.createElement('div');
        div.className = 'my-1';
        div.innerHTML = html;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCmd = input.value.trim();
            const cmd = rawCmd.toLowerCase();
            input.value = '';

            printLine(`<span class="text-emerald-400">tjlin@ntust-node-01:~$</span> <span class="text-white">${rawCmd}</span>`);

            switch (cmd) {
                case 'help':
                    printLine(`
                        <div class="text-slate-300 ml-4">
                            <p><strong class="text-cyan-400">help</strong> - 顯示所有可用指令</p>
                            <p><strong class="text-cyan-400">cat pi.txt</strong> - 檢視主持人林子敬老師簡介與彩蛋</p>
                            <p><strong class="text-cyan-400">run_md</strong> - 啟動一場分子動力學平衡模擬 (Simulation)</p>
                            <p><strong class="text-cyan-400">skills</strong> - 檢視實驗室運用的計算與程式技術棧</p>
                            <p><strong class="text-cyan-400">papers</strong> - 檢視近期待發表的亮點成果</p>
                            <p><strong class="text-cyan-400">join</strong> - 如何加入實驗室？招收條件與福利</p>
                            <p><strong class="text-cyan-400">clear</strong> - 清除終端機螢幕</p>
                            <p><strong class="text-cyan-400">exit</strong> - 關閉終端機</p>
                        </div>
                    `);
                    break;
                case 'cat pi.txt':
                    printLine(`
                        <div class="text-slate-300 ml-4 space-y-1">
                            <p class="text-emerald-300 font-bold">--- Dr. Tzu-Jen Lin (林子敬 助理教授) ---</p>
                            <p>學歷: 美國阿克倫大學高分子博士 | 曼徹斯特大學化學碩士 | 成大化工學士</p>
                            <p>座右銘: "從 1 飛秒的電子雲，到 100 奈米的高分子網格，全是熱力學的浪漫。"</p>
                            <p>喜愛軟體: <span class="text-yellow-400">I ❤️ #!/bin/bash</span>, LAMMPS, CP2K, Python, Gaussian 16</p>
                            <p>辦公室: 台科大 工程一館 E1-101-2 | Email: tjlin@mail.ntust.edu.tw</p>
                            <p class="text-cyan-300 text-xs mt-2">[提示] 老師的 YouTube 教學頻道有數百部免費工數、質能均衡與分子模擬課程！</p>
                        </div>
                    `);
                    break;
                case 'run_md':
                    printLine(`<div class="text-cyan-400">[INFO] Initializing NPT Ensemble on GPU Cluster...</div>`);
                    let step = 0;
                    const interval = setInterval(() => {
                        step += 250;
                        const temp = (298.15 + (Math.random() - 0.5) * 3).toFixed(2);
                        const press = (1.013 + (Math.random() - 0.5) * 0.08).toFixed(3);
                        const energy = (-4285.34 - step * 0.12).toFixed(2);
                        printLine(`<span class="text-slate-400">Step: ${step} | Temp: <span class="text-emerald-400">${temp} K</span> | Press: ${press} bar | PotEng: ${energy} kcal/mol</span>`);
                        if (step >= 1000) {
                            clearInterval(interval);
                            printLine(`<div class="text-emerald-400 font-bold">[SUCCESS] Trajectory relaxed! System reached thermodynamic equilibrium. 🎉</div>`);
                        }
                    }, 180);
                    break;
                case 'skills':
                    printLine(`
                        <div class="text-slate-300 ml-4">
                            <p class="text-sky-300 font-semibold">[Quantum Chemistry / DFT]</p>
                            <p class="ml-2 text-slate-400">Gaussian 16, CP2K, xTB, CASTEP, VASP</p>
                            <p class="text-sky-300 font-semibold mt-1">[Molecular Dynamics]</p>
                            <p class="ml-2 text-slate-400">LAMMPS, GROMACS, Materials Studio, Force Field Parametrization</p>
                            <p class="text-sky-300 font-semibold mt-1">[AI, Cheminformatics & Systems]</p>
                            <p class="ml-2 text-slate-400">Python, NumPy, scikit-learn, RDKit, Linux Bash Cluster Scripting</p>
                        </div>
                    `);
                    break;
                case 'papers':
                    printLine(`
                        <div class="text-slate-300 ml-4 space-y-1">
                            <p><span class="text-cyan-400">[2026]</span> J. Phys. Chem. Solids - Graphitic Heptazine Carbon Nitride</p>
                            <p><span class="text-cyan-400">[2026]</span> ACS Appl. Polym. Mater. - Polybenzimidazoles Proton Exchange</p>
                            <p><span class="text-cyan-400">[2025]</span> Applied Surface Science (IF 6.3) - Hydrogen Plasma for Sn</p>
                            <p><span class="text-cyan-400">[2025]</span> Ceramics International (IF 5.1) - Bioactive Glass DFT</p>
                        </div>
                    `);
                    break;
                case 'join':
                    printLine(`
                        <div class="text-slate-300 ml-4 space-y-2">
                            <p class="text-emerald-300 font-bold">🚀 歡迎加入 MSMTJL 實驗室！</p>
                            <p>我們在尋找：</p>
                            <p class="ml-2">1. 對物理化學、材料模擬或編程有濃厚興趣的大學部專題生、碩士生與博士生。</p>
                            <p class="ml-2">2. 不需要你原本就會寫程式，只要你願意動手敲鍵盤、探索未知！</p>
                            <p class="text-cyan-300">福利與收穫：享有獨立高速計算資源、扎實的 Linux 與 AI 技能養成、豐厚研討會發表歷練。</p>
                            <p>來信聊聊: <a href="mailto:tjlin@mail.ntust.edu.tw" class="text-cyan-400 underline">tjlin@mail.ntust.edu.tw</a></p>
                        </div>
                    `);
                    break;
                case 'clear':
                    body.innerHTML = '';
                    break;
                case 'exit':
                    modal.classList.add('hidden');
                    break;
                case '':
                    break;
                default:
                    printLine(`<span class="text-red-400">command not found: ${rawCmd}. 請輸入 <span class="text-yellow-400">help</span> 檢視指令清單。</span>`);
            }
        }
    });
}


// ------------------------------------------
// 3. Publications Real-Time Filter & Search
// ------------------------------------------
function initPublicationsFilter() {
    const searchInput = document.getElementById('pub-search-input');
    const filterTabs = document.querySelectorAll('.pub-tab');
    const pubCards = document.querySelectorAll('.pub-item');

    if (!pubCards.length) return;

    let currentFilter = 'all';
    let currentSearch = '';

    const applyFilters = () => {
        pubCards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const text = card.textContent.toLowerCase();

            const matchCat = (currentFilter === 'all') || category.includes(currentFilter);
            const matchSearch = (!currentSearch) || text.includes(currentSearch);

            if (matchCat && matchSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('tab-active', 'bg-cyan-500', 'text-slate-950'));
            tab.classList.add('tab-active');

            currentFilter = tab.getAttribute('data-filter') || 'all';
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }
}


// ------------------------------------------
// 4. Mobile Menu
// ------------------------------------------
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}
