/* ===== Advanced certificate 3D interaction enhancer ===== */
(function(){
    function enhanceCertificate3D(){
        const shell=document.querySelector('#certificates .certificates-shell');
        if(!shell) return;
        if(!shell.querySelector('.cert-magnetic-grid')){
            const grid=document.createElement('div');
            grid.className='cert-magnetic-grid';
            shell.prepend(grid);
        }
        if(!shell.querySelector('.cert-depth-field')){
            const field=document.createElement('div');
            field.className='cert-depth-field';
            const icons=['fa-certificate','fa-medal','fa-award','fa-scroll','fa-star','fa-ribbon'];
            field.innerHTML=icons.map(i=>`<span><i class="fas ${i}"></i></span>`).join('');
            shell.prepend(field);
        }
        document.querySelectorAll('.certificate-card.certificate-tab').forEach(card=>{
            if(!card.querySelector('.cert-prism-edge')){
                const edge=document.createElement('span');
                edge.className='cert-prism-edge';
                card.prepend(edge);
            }
            if(!card.querySelector('.cert-hover-light')){
                const light=document.createElement('span');
                light.className='cert-hover-light';
                card.appendChild(light);
            }
            if(card.dataset.advanced3d) return;
            card.dataset.advanced3d='true';
            card.addEventListener('pointermove', e=>{
                const r=card.getBoundingClientRect();
                const x=(e.clientX-r.left)/r.width-.5;
                const y=(e.clientY-r.top)/r.height-.5;
                card.style.setProperty('--mx', `${x*80}px`);
                card.style.setProperty('--my', `${y*80}px`);
                if(window.matchMedia('(max-width: 760px)').matches) return;
                card.style.transform=`translateY(-34px) translateZ(150px) rotateX(${(-y*13)+9}deg) rotateY(${(x*18)-12}deg) scale(1.075)`;
            });
            card.addEventListener('pointerleave', ()=>{
                card.style.removeProperty('transform');
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
            });
            card.addEventListener('click', ()=>{
                const r=card.getBoundingClientRect();
                const cx=r.left+r.width/2;
                const cy=r.top+r.height/2;
                for(let i=0;i<24;i++){
                    const shard=document.createElement('span');
                    shard.className='cert-shard';
                    shard.style.left=cx+'px';
                    shard.style.top=cy+'px';
                    const a=(Math.PI*2/24)*i;
                    const d=80+Math.random()*95;
                    shard.style.setProperty('--x', Math.cos(a)*d+'px');
                    shard.style.setProperty('--y', Math.sin(a)*d+'px');
                    shard.style.setProperty('--r', (Math.random()*180)+'deg');
                    document.body.appendChild(shard);
                    setTimeout(()=>shard.remove(),950);
                }
            }, true);
        });
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', enhanceCertificate3D);
    else enhanceCertificate3D();
    setTimeout(enhanceCertificate3D, 250);
})();
