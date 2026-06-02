/* ===== WHAT I DO: clickable 3D service interaction ===== */
(function(){
    function ready(fn){
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
        else fn();
    }
    ready(function(){
        const cards = document.querySelectorAll('.service-3d-card');
        const overlay = document.getElementById('servicePreviewOverlay');
        const closeBtn = document.getElementById('servicePreviewClose');
        const title = document.getElementById('servicePreviewTitle');
        const desc = document.getElementById('servicePreviewDesc');
        const icon = document.getElementById('servicePreviewIcon');
        const tags = document.getElementById('servicePreviewTags');
        const link = document.getElementById('servicePreviewLink');
        const hologram = document.getElementById('servicePreviewHologram');
        if(!cards.length || !overlay) return;

        function ripple(x,y){
            const dot = document.createElement('span');
            dot.className = 'service-ripple';
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            document.body.appendChild(dot);
            setTimeout(()=>dot.remove(), 720);
        }
        function openPreview(card, event){
            cards.forEach(c=>c.classList.remove('service-active'));
            card.classList.add('service-active');
            title.textContent = card.dataset.title || 'Service Preview';
            desc.textContent = card.dataset.description || '';
            icon.className = 'service-preview-icon dimensional-service-icon service-type-' + (card.dataset.service || 'default');
            icon.innerHTML = `<i class="${card.dataset.icon || 'fas fa-cube'}"></i>`;
            tags.innerHTML = (card.dataset.tags || '').split(',').filter(Boolean).map(t=>`<span>${t.trim()}</span>`).join('');
            link.href = card.dataset.link || '#projects';
            ripple(event.clientX, event.clientY);
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
        }
        function closePreview(){
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
            cards.forEach(c=>c.classList.remove('service-active'));
        }
        cards.forEach(card=>{
            card.addEventListener('pointermove', e=>{
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rx = ((y / rect.height) - .5) * -16;
                const ry = ((x / rect.width) - .5) * 18;
                card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
                card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
                card.style.setProperty('--mx', x + 'px');
                card.style.setProperty('--my', y + 'px');
            });
            card.addEventListener('pointerleave', ()=>{
                card.style.removeProperty('--rx');
                card.style.removeProperty('--ry');
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
            });
            card.addEventListener('click', e=>openPreview(card,e));
            card.addEventListener('keydown', e=>{
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    openPreview(card, {clientX: window.innerWidth/2, clientY: window.innerHeight/2});
                }
            });
        });
        hologram?.addEventListener('pointermove', e=>{
            const rect = hologram.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const modalRx = ((y / rect.height) - .5) * -28;
            const modalRy = ((x / rect.width) - .5) * 34;
            icon.style.setProperty('--modal-rx', modalRx.toFixed(2) + 'deg');
            icon.style.setProperty('--modal-ry', modalRy.toFixed(2) + 'deg');
        });
        hologram?.addEventListener('pointerleave', ()=>{
            icon.style.removeProperty('--modal-rx');
            icon.style.removeProperty('--modal-ry');
        });
        closeBtn?.addEventListener('click', closePreview);
        overlay.addEventListener('click', e=>{ if(e.target === overlay) closePreview(); });
        document.addEventListener('keydown', e=>{ if(e.key === 'Escape' && overlay.classList.contains('active')) closePreview(); });
        link?.addEventListener('click', closePreview);
    });
})();
