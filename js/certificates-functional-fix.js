(function(){
    const certData = {
        "0": {title:"Teacher Education Summit 2026", issuer:"ARTEI & CHED", date:"April 29, 2026", img:"summit.png", desc:"Participated in Teacher Education Summit."},
        "1": {title:"Leadership Excellence Award", issuer:"CCD Student Affairs", date:"September 5, 2025", img:"leadership.png", desc:"Leadership Excellence recognition."},
        "2": {title:"Project Dayaw", issuer:"PYLP / US Dept", date:"2025", img:"projectdayaw.png", desc:"Indigenous People session."},
        "3": {title:"Multimedia Workshop", issuer:"City College of Davao", date:"September 6, 2024", img:"mediaworkshop.png", desc:"Multimedia Workshop participant."},
        "4": {title:"Resource Speaker - IoT Symposium", issuer:"City College of Davao", date:"May 06, 2026", img:"speaker.png", desc:"Shared knowledge as Resource Speaker."},
        "5": {title:"Int'l TechVoc Conference", issuer:"CCD / Astronomy & Space", date:"October 09, 2025", img:"techvoc.png", desc:"International TechVoc Conference."},
        "6": {title:"SSG Assistant Treasurer", issuer:"Supreme Student Gov", date:"June 14, 2024", img:"media.png", desc:"Leadership as Assistant Treasurer."},
        "7": {title:"Campus Journalism", issuer:"City College of Davao", date:"December 1, 2023", img:"journalism.png", desc:"Campus Journalism Workshop."}
    };

    function escapeText(value){
        return String(value || '').replace(/[&<>'"]/g, function(ch){
            return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch];
        });
    }

    function getElements(){
        return {
            modal: document.getElementById('certModalOverlay'),
            title: document.getElementById('certModalTitle'),
            desc: document.getElementById('certModalDesc'),
            img: document.getElementById('certModalImage'),
            blur: document.getElementById('blurOverlay')
        };
    }

    function openCertificate(card){
        const els = getElements();
        if(!els.modal || !els.title || !els.desc || !els.img) return;

        const key = card.getAttribute('data-key');
        const data = certData[key] || {
            title: card.querySelector('h3')?.textContent?.trim() || 'Certificate',
            issuer: card.querySelector('p')?.textContent?.trim() || '',
            date: card.querySelector('.cert-date')?.textContent?.trim() || '',
            img: card.querySelector('.cert-bg img')?.getAttribute('src') || els.img.getAttribute('src') || '',
            desc: 'Certificate preview.'
        };

        els.title.textContent = data.title;
        els.desc.innerHTML = escapeText(data.issuer) + '<br>' + escapeText(data.desc) + '<br>' + escapeText(data.date);
        els.img.src = data.img;
        els.img.alt = data.title + ' certificate';

        els.modal.classList.add('is-open');
        els.modal.style.display = 'flex';
        if(els.blur) els.blur.classList.add('active');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(function(){
            els.img.style.width = 'auto';
            els.img.style.height = 'auto';
            els.img.style.maxWidth = '100%';
            els.img.style.maxHeight = window.innerWidth <= 700 ? 'calc(94dvh - 145px)' : 'calc(94dvh - 170px)';
            els.img.style.objectFit = 'contain';
        });
    }

    function closeCertificate(){
        const els = getElements();
        if(els.modal){
            els.modal.classList.remove('is-open');
            els.modal.style.display = 'none';
        }
        if(els.blur) els.blur.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', function(e){
        const closeBtn = e.target.closest && e.target.closest('#closeCertModalBtn, .modal-close-cert');
        if(closeBtn){
            e.preventDefault();
            e.stopPropagation();
            closeCertificate();
            return;
        }

        const modal = document.getElementById('certModalOverlay');
        if(modal && e.target === modal){
            closeCertificate();
            return;
        }

        const card = e.target.closest && e.target.closest('.certificate-card');
        if(card){
            e.preventDefault();
            e.stopPropagation();
            openCertificate(card);
        }
    }, true);

    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape') closeCertificate();
        if((e.key === 'Enter' || e.key === ' ') && document.activeElement?.classList?.contains('certificate-card')){
            e.preventDefault();
            openCertificate(document.activeElement);
        }
    }, true);
})();
