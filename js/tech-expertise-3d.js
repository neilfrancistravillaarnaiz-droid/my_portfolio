/* ===== INTERACTIVE + DRAGGABLE 3D TECH & EXPERTISE LAB ===== */
(function(){
    const lab = document.getElementById('tech3DLab');
    const stage = document.getElementById('tech3DStage');
    const cube = document.getElementById('tech3DCube');
    const faces = Array.from(document.querySelectorAll('.tech-face'));
    const title = document.getElementById('tech3DTitle');
    const desc = document.getElementById('tech3DText');
    const meter = document.getElementById('tech3DMeter');
    const level = document.getElementById('tech3DLevel');
    const mode = document.getElementById('tech3DMode');
    const index = document.getElementById('tech3DIndex');
    const prev = document.getElementById('techPrevBtn');
    const next = document.getElementById('techNextBtn');
    const autoBtn = document.getElementById('techAutoBtn');
    if(!lab || !stage || !cube || !faces.length) return;

    const data = [
        { key:'frontend', title:'Frontend Development', text:'Building clean, responsive, and accessible interfaces using HTML, CSS, JavaScript, and modern design patterns.', level:90, mode:'UI', x:-18, y:28 },
        { key:'database', title:'Database Integration', text:'Connecting dynamic sections like reviews, forms, and user content with Firebase or database-backed workflows.', level:84, mode:'DB', x:-18, y:208 },
        { key:'design', title:'UI/UX Design Systems', text:'Designing polished layouts with visual hierarchy, smooth interaction, clear spacing, and user-centered flow.', level:88, mode:'UX', x:-18, y:-62 },
        { key:'mobile', title:'Responsive App Thinking', text:'Creating layouts that adapt beautifully across phones, tablets, laptops, and desktop screens.', level:86, mode:'APP', x:-18, y:118 },
        { key:'system', title:'System Analysis', text:'Planning features, process flows, and functional requirements before development starts.', level:82, mode:'SYS', x:-108, y:28 },
        { key:'creative', title:'Creative 3D Motion', text:'Adding impressive WebGL-inspired interactions, 3D UI effects, and animated experiences while keeping usability clear.', level:80, mode:'3D', x:72, y:28 }
    ];

    let active = 0;
    let auto = false;
    let timer = null;
    let rotX = data[0].x;
    let rotY = data[0].y;
    let dragStartX = 0;
    let dragStartY = 0;
    let startRotX = rotX;
    let startRotY = rotY;
    let isDragging = false;
    let moved = false;

    function applyCubeTransform(extra=''){
        cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) ${extra}`;
    }

    function pulseCube(){
        cube.animate([
            { filter:'drop-shadow(0 0 0 rgba(228,219,192,0))', transform:`rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1)` },
            { filter:'drop-shadow(0 0 30px rgba(228,219,192,.9))', transform:`rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.08)` },
            { filter:'drop-shadow(0 0 0 rgba(228,219,192,0))', transform:`rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1)` }
        ], { duration:580, easing:'cubic-bezier(.2,.9,.2,1)' });
    }

    function setTech(i, animate=true){
        active = (i + data.length) % data.length;
        const item = data[active];
        rotX = item.x;
        rotY = item.y;
        cube.classList.remove('auto-spin');
        applyCubeTransform();
        faces.forEach(face => face.classList.toggle('active', face.dataset.tech === item.key));
        if(title) title.textContent = item.title;
        if(desc) desc.textContent = item.text;
        if(meter) meter.style.width = item.level + '%';
        if(level) level.textContent = item.level + '%';
        if(mode) mode.textContent = item.mode;
        if(index) index.textContent = String(active + 1).padStart(2,'0');
        if(animate) pulseCube();
    }

    faces.forEach(face => {
        face.addEventListener('click', (e) => {
            if(moved){ e.preventDefault(); return; }
            const found = data.findIndex(item => item.key === face.dataset.tech);
            if(found >= 0) setTech(found);
        });
    });

    prev?.addEventListener('click', () => setTech(active - 1));
    next?.addEventListener('click', () => setTech(active + 1));

    autoBtn?.addEventListener('click', () => {
        auto = !auto;
        autoBtn.innerHTML = auto ? '<i class="fas fa-pause"></i> Pause Orbit' : '<i class="fas fa-play"></i> Auto Orbit';
        clearInterval(timer);
        cube.classList.toggle('auto-spin', auto);
        if(auto){
            timer = setInterval(() => setTech(active + 1), 2600);
        } else {
            applyCubeTransform();
        }
    });

    stage.addEventListener('pointerdown', (e) => {
        auto = false;
        clearInterval(timer);
        if(autoBtn) autoBtn.innerHTML = '<i class="fas fa-play"></i> Auto Orbit';
        cube.classList.remove('auto-spin');
        isDragging = true;
        moved = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startRotX = rotX;
        startRotY = rotY;
        stage.classList.add('dragging');
        cube.classList.add('is-dragging');
        stage.setPointerCapture?.(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
        if(!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if(Math.abs(dx) + Math.abs(dy) > 5) moved = true;
        rotY = startRotY + dx * 0.45;
        rotX = startRotX - dy * 0.35;
        applyCubeTransform();
    });

    function endDrag(e){
        if(!isDragging) return;
        isDragging = false;
        stage.classList.remove('dragging');
        cube.classList.remove('is-dragging');
        stage.releasePointerCapture?.(e.pointerId);
        setTimeout(() => { moved = false; }, 80);
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', (e) => { if(isDragging) endDrag(e); });

    setTech(0, false);
})();

/* ===== FINAL FIX: compact 3D Featured Works movement + cursor navigation ===== */
function updateFeaturedCarousel(type){
    const track = type === 'projects'
        ? document.getElementById('projectsGrid')
        : document.getElementById('bookflipContainer');

    if(!track) return;

    const cards = [...track.querySelectorAll('.featured-3d-card')];
    const total = cards.length;
    if(!total) return;

    featuredState[type] = (featuredState[type] + total) % total;

    const stage = document.querySelector(`[data-featured-stage="${type}"]`);
    const stageWidth = stage ? stage.getBoundingClientRect().width : window.innerWidth;
    const spacing = Math.max(145, Math.min(190, stageWidth * 0.22));

    cards.forEach((card, index) => {
        const offset = getCircularOffset(index, featuredState[type], total);
        const abs = Math.abs(offset);
        const isActive = offset === 0;

        const x = offset * spacing;
        const z = isActive ? 105 : -85 - (abs * 38);
        const ry = offset * -24;
        const rx = isActive ? 0 : 3;
        const scale = isActive ? 1 : Math.max(0.70, 0.86 - abs * 0.07);
        const opacity = abs > 2 ? 0 : (isActive ? 1 : 0.56);
        const blur = abs > 1 ? 1 : 0;
        const sat = isActive ? 1.08 : 0.82;

        card.classList.toggle('is-active', isActive);
        const previewVideo = card.querySelector('[data-project-video]');
        if(previewVideo){
            if(isActive){ previewVideo.play().catch(()=>{}); }
            else { previewVideo.pause(); previewVideo.currentTime = 0; }
        }
        card.style.setProperty('--slide-x', `${x}px`);
        card.style.setProperty('--slide-z', `${z}px`);
        card.style.setProperty('--slide-ry', `${ry}deg`);
        card.style.setProperty('--slide-rx', `${rx}deg`);
        card.style.setProperty('--slide-scale', scale);
        card.style.setProperty('--slide-opacity', opacity);
        card.style.setProperty('--slide-blur', `${blur}px`);
        card.style.setProperty('--slide-sat', sat);
        card.style.setProperty('--slide-index', `${30 - abs}`);
        card.style.setProperty('--slide-pointer', abs > 2 ? 'none' : 'auto');
        card.setAttribute('aria-hidden', abs > 2 ? 'true' : 'false');
    });

    const dots = document.getElementById(type === 'projects' ? 'projectsDots' : 'achievementsDots');
    if(dots){
        dots.innerHTML = cards.map((_, index) => `
            <button class="featured-3d-dot ${index === featuredState[type] ? 'active' : ''}"
                    type="button"
                    aria-label="Go to ${type} item ${index + 1}"
                    data-featured-dot="${type}"
                    data-featured-index="${index}"></button>
        `).join('');

        dots.querySelectorAll('[data-featured-dot]').forEach(dot => {
            dot.addEventListener('click', () => {
                featuredState[type] = parseInt(dot.dataset.featuredIndex, 10);
                updateFeaturedCarousel(type);
            });
        });
    }
}

function setupFeaturedCursorNavigation(type){
    const stage = document.querySelector(`[data-featured-stage="${type}"]`);
    if(!stage || stage.dataset.cursorNavReady === 'true') return;
    stage.dataset.cursorNavReady = 'true';

    let lastMove = 0;
    let lastZone = 'center';

    stage.addEventListener('pointermove', (e) => {
        if(e.pointerType === 'touch') return;

        const rect = stage.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const now = Date.now();
        let zone = 'center';

        if(ratio < 0.26) zone = 'left';
        if(ratio > 0.74) zone = 'right';

        stage.dataset.cursorZone = zone;

        if(zone !== 'center' && (zone !== lastZone || now - lastMove > 900)){
            moveFeaturedCarousel(type, zone === 'right' ? 1 : -1);
            lastMove = now;
        }

        lastZone = zone;
    });

    stage.addEventListener('pointerleave', () => {
        stage.dataset.cursorZone = 'center';
        lastZone = 'center';
    });

    stage.addEventListener('wheel', (e) => {
        if(Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey){
            e.preventDefault();
            moveFeaturedCarousel(type, e.deltaX > 0 || e.deltaY > 0 ? 1 : -1);
        }
    }, {passive:false});
}

setupFeaturedCursorNavigation('projects');
setupFeaturedCursorNavigation('achievements');
updateFeaturedCarousel('projects');
updateFeaturedCarousel('achievements');
window.addEventListener('resize', () => {
    updateFeaturedCarousel('projects');
    updateFeaturedCarousel('achievements');
});
