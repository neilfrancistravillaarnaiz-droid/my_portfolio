/* ===== INTERACTIVE + DRAGGABLE 3D JOURNEY STUDIO ===== */
(function(){
    const studio = document.getElementById('journey3DStudio');
    const stage = document.getElementById('journey3DStage');
    const scene = document.getElementById('journey3DScene');
    const title = document.getElementById('journey3DTitle');
    const text = document.getElementById('journey3DText');
    const progress = document.getElementById('journey3DProgress');
    const nodes = Array.from(document.querySelectorAll('.journey-3d-node'));
    const prevBtn = document.getElementById('journeyPrevBtn');
    const nextBtn = document.getElementById('journeyNextBtn');
    const autoBtn = document.getElementById('journeyAutoBtn');
    if(!studio || !stage || !scene || !nodes.length) return;

    const steps = [
        {key:'idea', title:'Ideate with Purpose', text:'I start by understanding the goal, the users, and the problem before shaping a clear digital solution.'},
        {key:'design', title:'Design the Experience', text:'I turn ideas into clean interfaces, accessible flows, and visual systems that feel modern and easy to use.'},
        {key:'build', title:'Build with Interaction', text:'I develop responsive layouts, smooth animations, database-connected sections, and functional user experiences.'},
        {key:'launch', title:'Launch and Improve', text:'I refine the final product through testing, feedback, performance checks, and continuous improvement.'}
    ];

    let active = 0;
    let auto = false;
    let timer = null;
    let rotX = 58;
    let rotY = 0;
    let rotZ = -28;
    let dragStartX = 0;
    let dragStartY = 0;
    let startRotX = rotX;
    let startRotY = rotY;
    let isDragging = false;
    let moved = false;

    function applyJourneyTransform(){
        scene.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(${rotY}deg)`;
    }

    function pulseScene(){
        scene.animate([
            { filter:'drop-shadow(0 0 0 rgba(228,219,192,0))', transform:`rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(1)` },
            { filter:'drop-shadow(0 0 28px rgba(228,219,192,.85))', transform:`rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(1.045)` },
            { filter:'drop-shadow(0 0 0 rgba(228,219,192,0))', transform:`rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(1)` }
        ], { duration:560, easing:'cubic-bezier(.2,.9,.2,1)' });
    }

    function setStep(index, animate=true){
        active = (index + steps.length) % steps.length;
        const step = steps[active];
        nodes.forEach(n => n.classList.toggle('active', n.dataset.step === step.key));
        if(title) title.textContent = step.title;
        if(text) text.textContent = step.text;
        if(progress) progress.style.width = ((active + 1) / steps.length * 100) + '%';
        if(animate) pulseScene();
    }

    nodes.forEach((node, index) => node.addEventListener('click', (e) => {
        if(moved){ e.preventDefault(); return; }
        setStep(index);
    }));
    prevBtn?.addEventListener('click', () => setStep(active - 1));
    nextBtn?.addEventListener('click', () => setStep(active + 1));
    autoBtn?.addEventListener('click', () => {
        auto = !auto;
        autoBtn.innerHTML = auto ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Auto';
        clearInterval(timer);
        if(auto) timer = setInterval(() => setStep(active + 1), 2200);
    });

    stage.addEventListener('pointerdown', (e) => {
        auto = false;
        clearInterval(timer);
        if(autoBtn) autoBtn.innerHTML = '<i class="fas fa-play"></i> Auto';
        isDragging = true;
        moved = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        startRotX = rotX;
        startRotY = rotY;
        stage.classList.add('dragging');
        scene.classList.add('is-dragging');
        stage.setPointerCapture?.(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
        if(!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if(Math.abs(dx) + Math.abs(dy) > 5) moved = true;
        rotY = startRotY + dx * 0.32;
        rotX = Math.max(28, Math.min(82, startRotX - dy * 0.20));
        applyJourneyTransform();
    });

    function endDrag(e){
        if(!isDragging) return;
        isDragging = false;
        stage.classList.remove('dragging');
        scene.classList.remove('is-dragging');
        stage.releasePointerCapture?.(e.pointerId);
        setTimeout(() => { moved = false; }, 80);
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', (e) => { if(isDragging) endDrag(e); });

    applyJourneyTransform();
    setStep(0, false);
})();
