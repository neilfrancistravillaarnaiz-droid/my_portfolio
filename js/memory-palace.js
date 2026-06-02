import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const artifacts = [
    { id:0, title:"Started College", year:"2023", desc:"Began my Computer Programming journey at City College of Davao.", icon:"🎓", emoji:"🎓", color:0x61c989, category:"Education", pulse:1.0 },
    { id:1, title:"Internet of Things", year:"Jan 2024", desc:"Explored smart devices, sensors, automation, and connected systems.", icon:"🌐", emoji:"🌐", color:0xe4dbc0, category:"IoT", pulse:1.15 },
    { id:2, title:"Java & Databases", year:"Aug 2024", desc:"Learned object-oriented programming and database fundamentals.", icon:"☕", emoji:"☕", color:0xd4a373, category:"Programming", pulse:1.3 },
    { id:3, title:"Python Development", year:"Feb 2025", desc:"Strengthened problem-solving and software development skills through Python.", icon:"🐍", emoji:"🐍", color:0x64d98b, category:"Programming", pulse:1.45 },
    { id:4, title:"Web Design & Development", year:"Sep 2025", desc:"Started creating responsive and interactive websites using modern web technologies.", icon:"💻", emoji:"💻", color:0x7cc8ff, category:"Web", pulse:1.6 },
    { id:5, title:"PHP & Database Systems", year:"Nov 2025", desc:"Built dynamic web applications with database connectivity and server-side logic.", icon:"🗄️", emoji:"🗄️", color:0xa6d970, category:"Backend", pulse:1.75 },
    { id:6, title:"App Development", year:"Jan 2026", desc:"Expanded into mobile application development and user-focused solutions.", icon:"📱", emoji:"📱", color:0xffd166, category:"Mobile", pulse:1.9 },
    { id:7, title:"Firebase Integration", year:"Mar 2026", desc:"Integrated real-time databases, authentication, and cloud services into applications.", icon:"🔥", emoji:"🔥", color:0xff8c42, category:"Cloud", pulse:2.05 }
].map((item, index, arr) => {
    const angle = (index / arr.length) * Math.PI * 2;
    const radius = 4.25;
    return {
        ...item,
        pos: [
            Math.cos(angle) * radius,
            0.4,
            Math.sin(angle) * radius
        ]
    };
});

const container = document.getElementById('memoryCanvasContainer');
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.FogExp2(0x102219, 0.015);

function getMemorySizeProfile(){
    const w = container.clientWidth || window.innerWidth;
    if(w < 520) return { camera:[5.2,4.0,8.8], fov:56, radius:0.72, labelScale:0.86, ground:6.3 };
    if(w < 900) return { camera:[6.2,4.5,9.4], fov:50, radius:0.86, labelScale:0.94, ground:7.2 };
    return { camera:[7,5,10], fov:45, radius:1, labelScale:1, ground:8 };
}

let profile = getMemorySizeProfile();
const camera = new THREE.PerspectiveCamera(profile.fov, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(...profile.camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference:'high-performance' });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x0a1a12, 0.08);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(container.clientWidth, container.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.075;
controls.autoRotate = false;
controls.autoRotateSpeed = 3.00;
controls.enableZoom = true;
controls.enablePan = false;
controls.minDistance = 4.5;
controls.maxDistance = 16;
controls.target.set(0, 0.15, 0);

const ambientLight = new THREE.AmbientLight(0xcfffe1, 0.72);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xffffff, 1.35);
mainLight.position.set(4, 8, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(1024,1024);
mainLight.shadow.camera.near = 1;
mainLight.shadow.camera.far = 28;
scene.add(mainLight);
const fillLight = new THREE.PointLight(0x75ffad, 0.75, 22);
fillLight.position.set(-3, 3, 4);
scene.add(fillLight);
const pulseLight = new THREE.PointLight(0xe4dbc0, 1.3, 10);
pulseLight.position.set(0, 1.2, 0);
scene.add(pulseLight);

const starGeo = new THREE.BufferGeometry();
const starPositions = [];
for (let i = 0; i < 900; i++) {
    starPositions.push((Math.random() - 0.5) * 130);
    starPositions.push((Math.random() - 0.5) * 70);
    starPositions.push((Math.random() - 0.5) * 75 - 30);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions), 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.075, transparent: true, opacity: 0.45 }));
scene.add(stars);

const particleGeo = new THREE.BufferGeometry();
const particlePositions = [];
for (let i = 0; i < 520; i++) {
    particlePositions.push((Math.random() - 0.5) * 24);
    particlePositions.push((Math.random() - 0.5) * 10 - 0.7);
    particlePositions.push((Math.random() - 0.5) * 22 - 4);
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePositions), 3));
const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0xaac9b0, size: 0.05, transparent: true, opacity: 0.32 }));

scene.add(particles);

const bgElements = [];
function createCodePanelTexture(label){
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0,0,512,256);
    grad.addColorStop(0,'rgba(228,219,192,0.92)');
    grad.addColorStop(1,'rgba(24,68,42,0.70)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,512,256);
    ctx.strokeStyle = 'rgba(255,255,255,0.68)';
    ctx.lineWidth = 8;
    ctx.strokeRect(10,10,492,236);
    ctx.fillStyle = 'rgba(24,68,42,0.72)';
    ctx.font = '900 34px Space Grotesk, Arial, sans-serif';
    ctx.fillText(label, 38, 58);
    ctx.font = '700 20px monospace';
    const lines = ['const vision = accessibleTech;', 'build(UI + UX + systems);', 'deploy(memoryPalace);', 'animate(ideas);'];
    lines.forEach((line,i)=>{
        ctx.fillStyle = i%2 ? 'rgba(255,255,255,0.82)' : 'rgba(24,68,42,0.86)';
        ctx.fillText(line, 42, 106 + i*34);
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 10;
    return texture;
}

function addBackgroundElements(){
    const ringMat = new THREE.MeshBasicMaterial({ color:0xe4dbc0, transparent:true, opacity:0.20, side:THREE.DoubleSide });
    for(let i=0;i<9;i++){
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45 + Math.random()*0.45, 0.008, 12, 96), ringMat.clone());
        ring.position.set((Math.random()-0.5)*11, Math.random()*4.8-0.6, (Math.random()-0.5)*9-2.6);
        ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        ring.userData = { type:'ring', speed:0.004 + Math.random()*0.006, drift:0.006 + Math.random()*0.008, offset:Math.random()*Math.PI*2 };
        scene.add(ring); bgElements.push(ring);
    }

    const shardMat = new THREE.MeshPhysicalMaterial({ color:0xf3ede3, emissive:0x2d6a4f, emissiveIntensity:0.22, metalness:0.42, roughness:0.18, transparent:true, opacity:0.42, clearcoat:1 });
    for(let i=0;i<14;i++){
        const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.10 + Math.random()*0.13, 0), shardMat.clone());
        shard.position.set((Math.random()-0.5)*12, Math.random()*5.2-1, (Math.random()-0.5)*10-2.8);
        shard.userData = { type:'shard', speed:0.012 + Math.random()*0.018, drift:0.010 + Math.random()*0.016, offset:Math.random()*Math.PI*2 };
        shard.castShadow = true;
        scene.add(shard); bgElements.push(shard);
    }

    const panelNames = ['UI/UX', 'CODE', 'DATA'];
    panelNames.forEach((name,i)=>{
        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(1.45,0.72),
            new THREE.MeshBasicMaterial({ map:createCodePanelTexture(name), transparent:true, opacity:0.48, side:THREE.DoubleSide })
        );
        panel.position.set([-5.2, 5.3, -4.8][i], [2.3, 1.35, 2.85][i], [-3.5, -1.3, 1.1][i]);
        panel.rotation.set(-0.12, [0.65, -0.75, 0.85][i], [0.08, -0.05, 0.12][i]);
        panel.userData = { type:'panel', speed:0.003 + i*0.001, drift:0.008, offset:i*1.7 };
        scene.add(panel); bgElements.push(panel);
    });
}
addBackgroundElements();

function makeIconTexture(art){
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,384,384);

    const outer = ctx.createLinearGradient(70,40,320,340);
    outer.addColorStop(0,'rgba(255,255,255,0.98)');
    outer.addColorStop(0.32,'rgba(228,219,192,0.96)');
    outer.addColorStop(1,'rgba(24,68,42,0.95)');
    ctx.shadowColor = 'rgba(24,68,42,0.38)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.roundRect(54,44,276,276,72);
    ctx.fill();
    ctx.shadowBlur = 0;

    const shine = ctx.createLinearGradient(70,54,240,220);
    shine.addColorStop(0,'rgba(255,255,255,0.9)');
    shine.addColorStop(0.48,'rgba(255,255,255,0.16)');
    shine.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.roundRect(78,66,140,74,34);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.88)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.roundRect(54,44,276,276,72);
    ctx.stroke();

    ctx.fillStyle = 'rgba(24,68,42,0.16)';
    ctx.beginPath();
    ctx.roundRect(92,92,200,200,54);
    ctx.fill();

    const innerGlow = ctx.createRadialGradient(192,176,16,192,176,122);
    innerGlow.addColorStop(0,'rgba(255,255,255,0.76)');
    innerGlow.addColorStop(0.45,'rgba(228,219,192,0.25)');
    innerGlow.addColorStop(1,'rgba(24,68,42,0)');
    ctx.fillStyle = innerGlow;
    ctx.beginPath();
    ctx.roundRect(86,82,212,212,58);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.26)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 7;
    const iconIsEmoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(art.icon);
    ctx.font = iconIsEmoji ? '132px serif' : '900 96px Space Grotesk, Arial, sans-serif';
    ctx.fillStyle = '#12331f';
    ctx.fillText(art.icon,192,168);
    ctx.restore();

    ctx.font = '900 30px Space Grotesk, Arial, sans-serif';
    ctx.fillStyle = 'rgba(24,68,42,0.92)';
    ctx.fillText(art.category.toUpperCase(),192,282);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 12;
    return texture;
}

function createMemoryIcon3D(art){
    const shell = new THREE.Group();
    shell.name = 'memoryIconShell';

    const backMat = new THREE.MeshStandardMaterial({
        color: art.color,
        emissive: art.color,
        emissiveIntensity: 0.18,
        metalness: 0.72,
        roughness: 0.2,
        transparent: true,
        opacity: 0.88
    });
    const backPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.22, 64), backMat);
    backPlate.rotation.x = Math.PI / 2;
    backPlate.position.z = -0.08;
    backPlate.name = 'backPlate';
    backPlate.castShadow = true;
    backPlate.receiveShadow = true;
    shell.add(backPlate);

    const depthPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.66, 0.66, 0.34, 64),
        new THREE.MeshStandardMaterial({ color:0x132e1d, metalness:0.8, roughness:0.28, transparent:true, opacity:0.72 })
    );
    depthPlate.rotation.x = Math.PI / 2;
    depthPlate.position.z = -0.22;
    depthPlate.name = 'depthPlate';
    depthPlate.castShadow = true;
    shell.add(depthPlate);

    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xf3ede3,
        emissive: 0x18442a,
        emissiveIntensity: 0.12,
        metalness: 0.25,
        roughness: 0.12,
        transmission: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 0.82
    });
    const glassFace = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.1, 64), glassMat);
    glassFace.rotation.x = Math.PI / 2;
    glassFace.position.z = 0.03;
    glassFace.name = 'glassFace';
    glassFace.castShadow = true;
    glassFace.receiveShadow = true;
    shell.add(glassFace);

    const glassDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.70, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshPhysicalMaterial({ color:0xffffff, metalness:0.05, roughness:0.04, transmission:0.35, clearcoat:1, clearcoatRoughness:0.02, transparent:true, opacity:0.24 })
    );
    glassDome.scale.z = 0.18;
    glassDome.position.z = 0.14;
    glassDome.name = 'glassDome';
    shell.add(glassDome);

    const iconPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.06, 1.06),
        new THREE.MeshBasicMaterial({ map: makeIconTexture(art), transparent:true, alphaTest:0.03, side:THREE.DoubleSide })
    );
    iconPlane.position.z = 0.11;
    iconPlane.name = 'icon';
    iconPlane.castShadow = true;
    shell.add(iconPlane);

    const iconShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0,1.0),
        new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.18, side:THREE.DoubleSide })
    );
    iconShadow.position.set(0.055,-0.06,0.075);
    iconShadow.name = 'iconShadow';
    shell.add(iconShadow);

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.76, 0.035, 18, 96),
        new THREE.MeshStandardMaterial({ color: art.color, emissive: art.color, emissiveIntensity:0.3, metalness:0.8, roughness:0.16, transparent:true, opacity:0.92 })
    );
    rim.position.z = 0.14;
    rim.name = 'rim';
    shell.add(rim);

    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(0.92,0.012,12,96), new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.46 }));
    orbitA.rotation.x = Math.PI / 2.6;
    orbitA.name = 'orbitA';
    shell.add(orbitA);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(0.98,0.01,12,96), new THREE.MeshBasicMaterial({ color:art.color, transparent:true, opacity:0.38 }));
    orbitB.rotation.y = Math.PI / 2.4;
    orbitB.name = 'orbitB';
    shell.add(orbitB);

    const crystal = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 24, 24),
        new THREE.MeshStandardMaterial({ color:0xffffff, emissive:art.color, emissiveIntensity:0.52, metalness:0.45, roughness:0.1 })
    );
    crystal.position.set(0.48,0.46,0.26);
    crystal.name = 'crystal';
    shell.add(crystal);

    return { shell, iconPlane, rim, orbitA, orbitB, crystal, backPlate, glassFace };
}

const clickBursts = [];
function spawnIconBurst(origin, color){
    const burstGroup = new THREE.Group();
    burstGroup.position.copy(origin);
    const burstMat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.95 });
    for(let i=0;i<28;i++){
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.028 + Math.random()*0.025, 12, 12), burstMat.clone());
        const dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.12, Math.random()-0.5).normalize();
        dot.position.set(0,0,0);
        dot.userData.velocity = dir.multiplyScalar(0.045 + Math.random()*0.085);
        dot.userData.life = 1;
        burstGroup.add(dot);
    }
    for(let r=0;r<3;r++){
        const wave = new THREE.Mesh(
            new THREE.TorusGeometry(0.72 + r*0.16, 0.012, 12, 110),
            new THREE.MeshBasicMaterial({ color:r===1?0xffffff:color, transparent:true, opacity:0.78-r*0.12, side:THREE.DoubleSide })
        );
        wave.rotation.x = Math.PI/2;
        wave.userData.life = 1;
        wave.userData.isWave = true;
        wave.userData.grow = 0.055 + r*0.018;
        burstGroup.add(wave);
    }
    const flash = new THREE.PointLight(color, 1.4, 4.5);
    flash.userData.life = 1;
    flash.userData.isFlash = true;
    burstGroup.add(flash);
    scene.add(burstGroup);
    clickBursts.push(burstGroup);
}

function triggerMemoryClick(obj){
    obj.clickStart = performance.now();
    obj.clickSpin = (obj.clickSpin || 0) + Math.PI * 3;
    spawnIconBurst(obj.group.position.clone(), obj.data.color);
}

const centerGroup = new THREE.Group();
scene.add(centerGroup);
const centerGem = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 1),
    new THREE.MeshStandardMaterial({ color: 0xE4DBC0, emissive: 0x45644A, emissiveIntensity: 0.35, metalness: 0.65, roughness: 0.18, transparent:true, opacity:0.92 })
);
centerGem.position.set(0, -0.18, 0);
centerGroup.add(centerGem);
const centerRingA = new THREE.Mesh(new THREE.TorusGeometry(1.05,0.018,16,96), new THREE.MeshBasicMaterial({ color:0x89f5a8, transparent:true, opacity:0.65 }));
centerRingA.rotation.x = Math.PI/2;
centerGroup.add(centerRingA);
const centerRingB = new THREE.Mesh(new THREE.TorusGeometry(1.42,0.012,16,96), new THREE.MeshBasicMaterial({ color:0xe4dbc0, transparent:true, opacity:0.38 }));
centerRingB.rotation.x = Math.PI/2;
centerGroup.add(centerRingB);

const groundMat = new THREE.MeshBasicMaterial({ color: 0x6fe69a, transparent: true, opacity: 0.16, side: THREE.DoubleSide });
const groundPlane = new THREE.Mesh(new THREE.CircleGeometry(profile.ground, 96), groundMat);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -1.2;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

const orbitPath = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.01, 12, 160), new THREE.MeshBasicMaterial({ color:0xe4dbc0, transparent:true, opacity:0.24 }));
orbitPath.rotation.x = Math.PI / 2;
orbitPath.position.y = -1.02;
scene.add(orbitPath);

const objects3d = [];
const connectionMat = new THREE.LineBasicMaterial({ color:0x9bf2b4, transparent:true, opacity:0.26 });
artifacts.forEach(art => {
    const group = new THREE.Group();
    group.position.set(art.pos[0], art.pos[1] + 0.2, art.pos[2]);
    group.userData = { title: art.title, year: art.year, desc: art.desc, category: art.category };

    const icon3D = createMemoryIcon3D(art);
    const iconPlane = icon3D.iconPlane;
    group.add(icon3D.shell);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.86,0.024,16,96), new THREE.MeshBasicMaterial({ color:art.color, transparent:true, opacity:0.72 }));
    halo.name = 'halo';
    halo.position.z = -0.02;
    group.add(halo);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52,0.72,0.08,48), new THREE.MeshBasicMaterial({ color:art.color, transparent:true, opacity:0.22 }));
    base.position.y = -0.72;
    base.rotation.x = Math.PI/2;
    base.receiveShadow = true;
    group.add(base);

    const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34,0.48,0.18,48),
        new THREE.MeshStandardMaterial({ color:0xf3ede3, emissive:art.color, emissiveIntensity:0.08, metalness:0.38, roughness:0.24, transparent:true, opacity:0.78 })
    );
    pedestal.position.y = -0.84;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    const miniOrb = new THREE.Mesh(
        new THREE.SphereGeometry(0.055,16,16),
        new THREE.MeshStandardMaterial({ color:0xffffff, emissive:art.color, emissiveIntensity:0.85, roughness:0.1 })
    );
    miniOrb.position.set(-0.58,0.42,0.34);
    miniOrb.name = 'miniOrb';
    group.add(miniOrb);

    const beacon = new THREE.PointLight(art.color, 0.45, 4);
    beacon.position.set(0,0.2,0.25);
    group.add(beacon);

    const linePoints = [new THREE.Vector3(0,-0.3,0), new THREE.Vector3(-art.pos[0], -art.pos[1]-0.45, -art.pos[2])];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePoints), connectionMat.clone());
    group.add(line);

    scene.add(group);

    const div = document.createElement('div');
    div.textContent = `${art.emoji} ${art.title}`;
    div.style.background = 'linear-gradient(135deg, rgba(24,68,42,0.94), rgba(69,100,74,0.9))';
    div.style.color = '#F3EDE3';
    div.style.padding = '7px 14px';
    div.style.borderRadius = '40px';
    div.style.fontSize = (0.75 * profile.labelScale) + 'rem';
    div.style.fontWeight = '800';
    div.style.backdropFilter = 'blur(10px)';
    div.style.border = '1px solid rgba(228,219,192,0.75)';
    div.style.boxShadow = '0 10px 22px rgba(24,68,42,0.18)';
    const label = new CSS2DObject(div);
    label.position.set(art.pos[0], art.pos[1] + 1.08, art.pos[2]);
    scene.add(label);

    objects3d.push({ group, iconPlane, icon3D, halo, base, label, data: art, floatSpeed: 0.45 + Math.random() * 0.45, floatOffset: Math.random() * Math.PI * 2, originalScale:1, clickStart:0, clickSpin:0 });
});

function keepIconsFacingCamera(){
    objects3d.forEach(obj => obj.iconPlane.quaternion.copy(camera.quaternion));
}

const tooltipDiv = document.getElementById('memoryTooltip');
function showTooltip(text, x, y) {
    tooltipDiv.style.opacity = '1';
    tooltipDiv.style.visibility = 'visible';
    tooltipDiv.style.left = (x + 15) + 'px';
    tooltipDiv.style.top = (y - 55) + 'px';
    tooltipDiv.innerHTML = text;
    setTimeout(() => { tooltipDiv.style.opacity = '0'; tooltipDiv.style.visibility = 'hidden'; }, 3000);
}

renderer.domElement.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects3d.map(o => o.group), true);
    if (intersects.length > 0) {
        let hit = intersects[0].object;
        while(hit && !hit.userData.title) hit = hit.parent;
        const data = hit ? hit.userData : intersects[0].object.userData;
        const selected = objects3d.find(o => o.group === hit);
        if(selected) triggerMemoryClick(selected);
        showTooltip(`<strong>${data.title}</strong> (${data.year})<br>${data.desc}`, event.clientX, event.clientY);
    }
});

let time = 0;
let autoRotateActive = false;
function animate() {
    requestAnimationFrame(animate);
    time += 0.012;
    objects3d.forEach((obj, index) => {
        const floatY = Math.sin(time * obj.floatSpeed + obj.floatOffset) * 0.16;
        const breathe = 1 + Math.sin(time * 1.8 + obj.data.pulse) * 0.035;
        let clickBoost = 0;
        if(obj.clickStart){
            const elapsed = (performance.now() - obj.clickStart) / 620;
            if(elapsed < 1){
                clickBoost = Math.sin(elapsed * Math.PI) * 0.38;
                obj.icon3D.shell.rotation.z = obj.clickSpin * elapsed;
                obj.icon3D.shell.rotation.y = Math.sin(elapsed * Math.PI) * 1.1;
                obj.icon3D.rim.scale.setScalar(1 + clickBoost * 0.55);
                obj.icon3D.orbitA.scale.setScalar(1 + clickBoost * 0.9);
                obj.icon3D.orbitB.scale.setScalar(1 + clickBoost * 1.15);
                obj.halo.scale.setScalar(1 + clickBoost * 1.55);
                obj.halo.material.opacity = 0.72 + clickBoost * 0.25;
            } else {
                obj.clickStart = 0;
                obj.icon3D.shell.rotation.z = 0;
                obj.icon3D.shell.rotation.y = 0;
                obj.icon3D.rim.scale.setScalar(1);
                obj.icon3D.orbitA.scale.setScalar(1);
                obj.icon3D.orbitB.scale.setScalar(1);
                obj.halo.scale.setScalar(1);
                obj.halo.material.opacity = 0.72;
            }
        }
        obj.group.position.y = obj.data.pos[1] + 0.2 + floatY;
        obj.group.scale.setScalar(breathe + clickBoost);
        obj.label.position.y = obj.data.pos[1] + 1.08 + floatY + clickBoost * 0.3;
        obj.halo.rotation.z += 0.014 + index * 0.0009;
        obj.halo.rotation.x = Math.sin(time + obj.floatOffset) * 0.18;
        obj.icon3D.rim.rotation.z -= 0.018;
        obj.icon3D.orbitA.rotation.z += 0.032;
        obj.icon3D.orbitB.rotation.x -= 0.026;
        obj.icon3D.crystal.rotation.x += 0.025;
        obj.icon3D.crystal.rotation.y += 0.03;
        const miniOrb = obj.group.getObjectByName('miniOrb');
        if(miniOrb){
            miniOrb.position.x = -0.58 + Math.sin(time*1.7 + index) * 0.10;
            miniOrb.position.y = 0.42 + Math.cos(time*1.4 + index) * 0.08;
        }
        obj.base.scale.setScalar(1 + Math.sin(time * 2.1 + index) * 0.08 + clickBoost * 0.5);
    });

    for(let i = clickBursts.length - 1; i >= 0; i--){
        const burst = clickBursts[i];
        let alive = false;
        burst.children.forEach(dot => {
            if(dot.userData.isFlash){
                dot.userData.life -= 0.045;
                dot.intensity = Math.max(dot.userData.life,0) * 1.4;
                if(dot.userData.life > 0) alive = true;
                return;
            }
            if(dot.userData.isWave){
                dot.userData.life -= 0.025;
                dot.scale.addScalar(dot.userData.grow);
                dot.material.opacity = Math.max(dot.userData.life, 0) * 0.72;
                if(dot.userData.life > 0) alive = true;
                return;
            }
            dot.position.add(dot.userData.velocity);
            dot.userData.velocity.multiplyScalar(0.985);
            dot.userData.life -= 0.025;
            dot.material.opacity = Math.max(dot.userData.life, 0);
            dot.scale.setScalar(1 + (1 - dot.userData.life) * 1.7);
            if(dot.userData.life > 0) alive = true;
        });
        if(!alive){
            scene.remove(burst);
            burst.children.forEach(dot => { if(dot.geometry) dot.geometry.dispose(); if(dot.material) dot.material.dispose(); });
            clickBursts.splice(i, 1);
        }
    }
    keepIconsFacingCamera();
    stars.rotation.y += 0.00055;
    particles.rotation.y += 0.0013;
    bgElements.forEach((el, i) => {
        el.rotation.x += (el.userData.speed || 0.004) * 0.6;
        el.rotation.y += (el.userData.speed || 0.004);
        el.position.y += Math.sin(time + (el.userData.offset || 0)) * 0.0009 + Math.cos(time*0.7 + i) * 0.0007;
        el.position.x += Math.sin(time*0.55 + (el.userData.offset || 0)) * 0.0015;
        if(el.material && 'opacity' in el.material){
            const baseOpacity = el.userData.type === 'panel' ? 0.42 : el.userData.type === 'ring' ? 0.18 : 0.38;
            el.material.opacity = baseOpacity + Math.sin(time*1.2 + i) * 0.055;
        }
    });
    centerGroup.rotation.y += 0.011;
    centerRingA.rotation.z += 0.022;
    centerRingB.rotation.z -= 0.016;
    orbitPath.rotation.z += 0.005;
    pulseLight.intensity = 1.1 + Math.sin(time * 2.4) * 0.35;
    if (autoRotateActive) { controls.autoRotate = true; controls.update(); }
    else { controls.autoRotate = false; controls.update(); }
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

function resizeMemoryPalace(){
    const width = container.clientWidth, height = container.clientHeight;
    profile = getMemorySizeProfile();
    camera.aspect = width / height;
    camera.fov = profile.fov;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);
    groundPlane.geometry.dispose();
    groundPlane.geometry = new THREE.CircleGeometry(profile.ground, 96);
    objects3d.forEach(obj => {
        if(obj.label && obj.label.element){ obj.label.element.style.fontSize = (0.75 * profile.labelScale) + 'rem'; }
    });
}
window.addEventListener('resize', resizeMemoryPalace);
window.addEventListener('orientationchange', () => setTimeout(resizeMemoryPalace, 180));

document.getElementById('resetCameraBtn').addEventListener('click', () => { profile=getMemorySizeProfile(); camera.position.set(...profile.camera); controls.target.set(0,0.15,0); controls.update(); autoRotateActive=false; document.getElementById('autoRotateBtn').classList.remove('active-memory-control'); });
document.getElementById('zoomInBtn').addEventListener('click', () => { camera.position.z *= 0.85; controls.update(); });
document.getElementById('zoomOutBtn').addEventListener('click', () => { camera.position.z *= 1.15; controls.update(); });
document.getElementById('autoRotateBtn').addEventListener('click', (e) => { autoRotateActive = !autoRotateActive; e.currentTarget.classList.toggle('active-memory-control', autoRotateActive); });

setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
