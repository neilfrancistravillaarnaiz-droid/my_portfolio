/* ===== FINAL CERTIFICATE MODAL JS SAFETY PATCH - applied by ChatGPT ===== */
(function(){
    const modal = document.getElementById('certModalOverlay');
    const img = document.getElementById('certModalImage');
    const closeBtn = document.getElementById('closeCertModalBtn');

    function normalizeCertificateModal(){
        if(!modal || !img) return;
        modal.classList.add('is-open');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxWidth = '100%';
        img.style.maxHeight = 'calc(94dvh - 180px)';
        img.style.objectFit = 'contain';
        img.style.objectPosition = 'center center';
    }

    document.addEventListener('click', function(e){
        const card = e.target.closest && e.target.closest('.certificate-card');
        if(card){
            setTimeout(normalizeCertificateModal, 0);
            setTimeout(normalizeCertificateModal, 80);
        }
    }, true);

    if(closeBtn){
        closeBtn.addEventListener('click', function(){
            if(modal){
                modal.classList.remove('is-open');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    if(modal){
        modal.addEventListener('click', function(e){
            if(e.target === modal){
                modal.classList.remove('is-open');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && modal && modal.classList.contains('is-open')){
            modal.classList.remove('is-open');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
})();
