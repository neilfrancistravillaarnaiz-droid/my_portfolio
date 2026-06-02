// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwVfHr5bcjxGZMb3Mv2XI6BqZz9zFvzKc",
    authDomain: "portfolio-website-6290d.firebaseapp.com",
    databaseURL: "https://portfolio-website-6290d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-website-6290d",
    storageBucket: "portfolio-website-6290d.firebasestorage.app",
    messagingSenderId: "633247487771",
    appId: "1:633247487771:web:63dbc012dae753fcefa5be"
};

let database = null, firebaseReady = false;
try { if (!firebase.apps.length) firebase.initializeApp(firebaseConfig); database = firebase.database(); firebaseReady = true; } catch(e){ console.warn(e); }

function showNotification(msg, err=false){ const t=document.getElementById('notificationToast'); t.textContent=msg; t.style.background=err?'#c73e1d':'linear-gradient(135deg, #18442A, #45644A)'; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3000); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }
window.showNotification = showNotification;

// Typed Text
const typedSpan=document.getElementById('typedText'), roles=["Computer Programming Student","Web Designer","UI/UX Enthusiast","3D Memory Palace Creator"]; let ri=0,ci=0,del=false;
function updateTyped(txt){ typedSpan.innerHTML=''; for(let i=0;i<txt.length;i++){ let sp=document.createElement('span'); if(txt[i]===' ') sp.innerHTML='&nbsp;'; else sp.textContent=txt[i]; typedSpan.appendChild(sp); } }
function typeLoop(){ let cur=roles[ri]; if(!del&&ci<=cur.length){ updateTyped(cur.slice(0,ci)); ci++; setTimeout(typeLoop,85); } else if(del&&ci>=0){ updateTyped(cur.slice(0,ci)); ci--; setTimeout(typeLoop,45); } else if(!del&&ci===cur.length+1){ del=true; setTimeout(typeLoop,1800); } else if(del&&ci===-1){ del=false; ri=(ri+1)%roles.length; ci=0; setTimeout(typeLoop,350); } } typeLoop();

// Skills
const skillsChipData = [
    { category:"Web Development", icon:"fab fa-html5", skills:[{name:"HTML/CSS/JS",percent:95},{name:"PHP/MySQL",percent:90},{name:"React",percent:75}] },
    { category:"Mobile Dev", icon:"fas fa-mobile-alt", skills:[{name:"Flutter",percent:88},{name:"Firebase",percent:85},{name:"Dart",percent:82}] },
    { category:"UI/UX Design", icon:"fas fa-paint-brush", skills:[{name:"Figma",percent:90},{name:"Prototyping",percent:88},{name:"Wireframing",percent:85}] },
    { category:"3D & Interactive", icon:"fas fa-cube", skills:[{name:"Three.js",percent:85},{name:"WebGL",percent:78},{name:"Blender",percent:70}] },
    { category:"System & Network", icon:"fas fa-server", skills:[{name:"Architecture",percent:85},{name:"Cabling",percent:70},{name:"DB Design",percent:88}] }
];
function renderSkills(){
    const c=document.getElementById('skillsGrid');
    if(!c) return;
    c.innerHTML = skillsChipData.map(cat => `<div class='skill-category-card'><h3><i class='${cat.icon}'></i> ${cat.category}</h3><div class='skills-chips-container'>${cat.skills.map(s => `<div class='skill-chip' data-name='${s.name}' data-pct='${s.percent}'><div class='radial-gauge-mini'><svg viewBox='0 0 30 30'><defs><linearGradient id='gaugeGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='#18442A'/><stop offset='100%' stop-color='#45644A'/></linearGradient></defs><circle class='radial-bg-mini' cx='15' cy='15' r='14'/><circle class='radial-fill-mini' cx='15' cy='15' r='14'/></svg><div class='radial-percent-mini'>0%</div></div><span class='skill-name'>${s.name}</span></div>`).join('')}</div></div>`).join('');
    document.querySelectorAll('.skill-chip').forEach(chip=>{
        const pct=parseInt(chip.dataset.pct);
        const fill=chip.querySelector('.radial-fill-mini');
        const span=chip.querySelector('.radial-percent-mini');
        if(fill){ const circ=87.96; fill.style.strokeDashoffset=circ-(pct/100)*circ; span.textContent=pct+'%'; }
        chip.addEventListener('click',()=>{
            document.getElementById('skillModalTitle').textContent = chip.dataset.name;
            document.getElementById('skillModalPercent').textContent = pct+'%';
            const gaugeFill = document.querySelector('#skillDetailModal .skill-gauge-fill');
            if(gaugeFill){ const circ = 502.65; gaugeFill.style.strokeDashoffset = circ - (pct/100)*circ; }
            showBlur(); document.getElementById('skillDetailModal').style.display = 'flex';
        });
    });
}
renderSkills();

// Certificates - 8 Certificates with Carousel
const certificatesData = [
    {key:0, title:"Teacher Education Summit 2026", issuer:"ARTEI & CHED", date:"April 29, 2026", img:"summit.png", desc:"Participated in Teacher Education Summit.", icon:"fas fa-chalkboard-user"},
    {key:1, title:"Leadership Excellence Award", issuer:"CCD Student Affairs", date:"September 5, 2025", img:"leadership.png", desc:"Leadership Excellence recognition.", icon:"fas fa-medal"},
    {key:2, title:"Project Dayaw", issuer:"PYLP / US Dept", date:"2025", img:"projectdayaw.png", desc:"Indigenous People session.", icon:"fas fa-hand-peace"},
    {key:3, title:"Multimedia Workshop", issuer:"City College of Davao", date:"September 6, 2024", img:"mediaworkshop.png", desc:"Multimedia Workshop participant.", icon:"fas fa-video"},
    {key:4, title:"Resource Speaker - IoT Symposium", issuer:"City College of Davao", date:"May 06, 2026", img:"speaker.png", desc:"Shared knowledge as Resource Speaker.", icon:"fas fa-microphone-alt"},
    {key:5, title:"Int'l TechVoc Conference", issuer:"CCD / Astronomy & Space", date:"October 09, 2025", img:"techvoc.png", desc:"International TechVoc Conference.", icon:"fas fa-globe"},
    {key:6, title:"SSG Assistant Treasurer", issuer:"Supreme Student Gov", date:"June 14, 2024", img:"media.png", desc:"Leadership as Assistant Treasurer.", icon:"fas fa-trophy"},
    {key:7, title:"Campus Journalism", issuer:"City College of Davao", date:"December 1, 2023", img:"journalism.png", desc:"Campus Journalism Workshop.", icon:"fas fa-newspaper"}
];
function renderCertificates(){
    const c=document.getElementById('certificatesCarousel');
    if(!c) return;

    const repeated=[...certificatesData,...certificatesData];

    /* Certificate PNGs are used as a fitted background preview.
       The full readable certificate opens in the centered modal when clicked. */
    c.innerHTML=repeated.map(cert=>`
        <div class="certificate-card certificate-tab" data-key="${cert.key}" tabindex="0" role="button" aria-label="View certificate ${escapeHtml(cert.title)}">
            <div class="cert-bg" aria-hidden="true">
                <img src="${cert.img}" alt="">
            </div>
            <div class="cert-3d-orbit" aria-hidden="true"></div>
            <div class="certificate-icon"><i class="${cert.icon}"></i></div>
            <div class="cert-seal-3d" aria-hidden="true"><i class="fas fa-award"></i></div>
            <h3>${escapeHtml(cert.title)}</h3>
            <p>${escapeHtml(cert.issuer)}</p>
            <span class="cert-date"><i class="fas fa-calendar-alt"></i>${escapeHtml(cert.date)}</span>
            <span class="view-cert-hint"><i class="fas fa-eye"></i> Click to view certificate</span>
        </div>
    `).join('');

    document.querySelectorAll('.certificate-card').forEach(card=>{
        const makeCertSparks=(source)=>{
            const r=source.getBoundingClientRect();
            const cx=r.left+r.width/2;
            const cy=r.top+r.height/2;
            for(let i=0;i<16;i++){
                const spark=document.createElement('span');
                spark.className='cert-spark';
                spark.style.left=cx+'px';
                spark.style.top=cy+'px';
                const angle=(Math.PI*2/16)*i;
                const dist=70+Math.random()*55;
                spark.style.setProperty('--x', Math.cos(angle)*dist+'px');
                spark.style.setProperty('--y', Math.sin(angle)*dist+'px');
                document.body.appendChild(spark);
                setTimeout(()=>spark.remove(),760);
            }
            source.classList.remove('cert-flip-pop');
            void source.offsetWidth;
            source.classList.add('cert-flip-pop');
            setTimeout(()=>source.classList.remove('cert-flip-pop'),950);
        };

        const openCert=()=>{
            makeCertSparks(card);
            const key=parseInt(card.dataset.key);
            const data=certificatesData.find(c=>c.key===key);
            if(!data) return;

            document.getElementById('certModalTitle').innerText=data.title;
            document.getElementById('certModalDesc').innerHTML=`${escapeHtml(data.issuer)}<br>${escapeHtml(data.desc)}<br>${escapeHtml(data.date)}`;

            const img=document.getElementById('certModalImage');
            img.src=data.img;
            img.alt=data.title + ' certificate';

            document.body.style.overflow='hidden';
            showBlur();

            const modal=document.getElementById('certModalOverlay');
            modal.classList.add('is-open');
            modal.style.display='flex';
        };

        card.addEventListener('click',openCert);
        card.addEventListener('keydown',(e)=>{
            if(e.key==='Enter'||e.key===' '){
                e.preventDefault();
                openCert();
            }
        });
    });
}
renderCertificates();

// Carousel Controls
document.getElementById('carouselPrev')?.addEventListener('click', () => {
    const carousel = document.getElementById('certificatesCarousel');
    carousel.scrollBy({ left: -320, behavior: 'smooth' });
});
document.getElementById('carouselNext')?.addEventListener('click', () => {
    const carousel = document.getElementById('certificatesCarousel');
    carousel.scrollBy({ left: 320, behavior: 'smooth' });
});

// Projects + Achievements: 3D sliding page carousel with toggle support
const projectsData = [
    { title:"Braille Connect", desc:"Accessibility-first mobile app", icon:"🧠", tags:["Flutter","Firebase"], video:"braille-connect-preview.mp4", poster:"braille-connect-poster.png", doc:"Text-to-Braille conversion, voice commands, and inclusive learning support." },
    { title:"Study Hut", desc:"Collaborative learning platform", icon:"📚", tags:["PHP","MySQL"], video:"study-hut-preview.mp4", poster:"study-hut-poster.png", doc:"Student/Teacher roles, real-time chat, and organized academic resources." },
    { title:"CCD Express", desc:"Campus transport prototype", icon:"🚐", tags:["UI/UX","Prototype"], video:"ccd-express-preview.mp4", poster:"ccd-express-poster.png", doc:"Real-time bus tracking, route guidance, and digital ticketing concepts." }
];

const galleryItems = [
    {title:"Braille Connect Demo",desc:"Flutter accessibility app",icon:"fas fa-mobile-alt", doc:"A visual walkthrough of accessible learning features."},
    {title:"Study Hut Dashboard",desc:"Student management system",icon:"fas fa-database", doc:"A dashboard concept for organized academic collaboration."},
    {title:"Leadership Award",desc:"Recognition at CCD",icon:"fas fa-trophy", doc:"An achievement highlight from leadership and campus involvement."}
];

const featuredState = {
    projects: 0,
    achievements: 0
};

function getCircularOffset(index, active, total){
    let offset = index - active;
    if(offset > total / 2) offset -= total;
    if(offset < -total / 2) offset += total;
    return offset;
}

function updateFeaturedCarousel(type){
    const track = type === 'projects'
        ? document.getElementById('projectsGrid')
        : document.getElementById('bookflipContainer');

    if(!track) return;

    const cards = [...track.querySelectorAll('.featured-3d-card')];
    const total = cards.length;
    if(!total) return;

    featuredState[type] = (featuredState[type] + total) % total;

    cards.forEach((card, index) => {
        const offset = getCircularOffset(index, featuredState[type], total);
        const abs = Math.abs(offset);
        const isActive = offset === 0;

        const x = offset * 230;
        const z = isActive ? 130 : -120 - (abs * 45);
        const ry = offset * -28;
        const rx = isActive ? 0 : 4;
        const scale = isActive ? 1 : Math.max(0.72, 0.88 - abs * 0.08);
        const opacity = abs > 2 ? 0 : (isActive ? 1 : 0.58);
        const blur = abs > 1 ? 1.2 : 0;
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
        card.style.setProperty('--slide-index', `${20 - abs}`);
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

function moveFeaturedCarousel(type, direction){
    const track = type === 'projects'
        ? document.getElementById('projectsGrid')
        : document.getElementById('bookflipContainer');

    const total = track ? track.querySelectorAll('.featured-3d-card').length : 0;
    if(!total) return;

    featuredState[type] = (featuredState[type] + direction + total) % total;
    updateFeaturedCarousel(type);
}

function setupFeaturedControls(type){
    const stage = document.querySelector(`[data-featured-stage="${type}"]`);
    if(!stage || stage.dataset.featuredReady === 'true') return;

    stage.dataset.featuredReady = 'true';

    stage.querySelector('.featured-prev')?.addEventListener('click', () => moveFeaturedCarousel(type, -1));
    stage.querySelector('.featured-next')?.addEventListener('click', () => moveFeaturedCarousel(type, 1));

    let startX = 0;
    let dragging = false;

    stage.addEventListener('pointerdown', (e) => {
        dragging = true;
        startX = e.clientX;
        stage.setPointerCapture?.(e.pointerId);
    });

    stage.addEventListener('pointerup', (e) => {
        if(!dragging) return;
        dragging = false;
        const diff = e.clientX - startX;
        if(Math.abs(diff) > 45){
            moveFeaturedCarousel(type, diff < 0 ? 1 : -1);
        }
    });

    stage.addEventListener('pointercancel', () => dragging = false);
}

function renderProjects(){
    const grid = document.getElementById('projectsGrid');
    if(!grid) return;

    grid.innerHTML = projectsData.map((p, index) => `
        <div class="project-card featured-3d-card" data-featured-type="projects" data-featured-index="${index}" tabindex="0">
            <div class="project-video-preview" aria-label="Preview video for ${escapeHtml(p.title)}">
                <video muted loop playsinline preload="metadata" poster="${p.poster}" data-project-video>
                    <source src="${p.video}" type="video/mp4">
                </video>
                <div class="project-video-fallback">
                    <span class="video-orbit video-orbit-one"></span>
                    <span class="video-orbit video-orbit-two"></span>
                    <span class="video-screen-icon">${p.icon}</span>
                    <span class="video-scan-line"></span>
                    <span class="video-play-badge"><i class="fas fa-play"></i> Preview</span>
                </div>
            </div>
            <div class="project-icon">${p.icon}</div>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <div class="project-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
            <div class="project-expandable">
                <div class="project-doc">
                    <h4><i class="fas fa-file-alt"></i> Documentation</h4>
                    <p>${p.doc}</p>
                </div>
            </div>
            <div class="expand-indicator"><i class="fas fa-layer-group"></i> 3D slide preview</div>
        </div>
    `).join('');

    grid.querySelectorAll('.featured-3d-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.featuredIndex, 10);
            if(featuredState.projects !== index){
                featuredState.projects = index;
                updateFeaturedCarousel('projects');
            }else{
                showNotification(`✨ ${projectsData[index].title} selected`);
            }
        });
    });

    setupFeaturedControls('projects');
    updateFeaturedCarousel('projects');
}
renderProjects();

function renderGallery(){
    const cont = document.getElementById('bookflipContainer');
    if(!cont) return;

    cont.innerHTML = galleryItems.map((item, index) => `
        <div class="bookflip-item featured-3d-card" data-featured-type="achievements" data-featured-index="${index}" tabindex="0">
            <div class="bookflip-icon"><i class="${item.icon}"></i></div>
            <h3 class="bookflip-title">${item.title}</h3>
            <p class="bookflip-desc">${item.desc}</p>
            <div class="project-expandable">
                <div class="project-doc">
                    <h4><i class="fas fa-star"></i> Highlight</h4>
                    <p>${item.doc}</p>
                </div>
            </div>
            <button class="bookflip-btn" type="button"><i class="fas fa-cube"></i> 3D Preview</button>
        </div>
    `).join('');

    cont.querySelectorAll('.featured-3d-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.featuredIndex, 10);
            if(featuredState.achievements !== index){
                featuredState.achievements = index;
                updateFeaturedCarousel('achievements');
            }else{
                showNotification(`✨ ${galleryItems[index].title} selected`);
            }
        });
    });

    setupFeaturedControls('achievements');
    updateFeaturedCarousel('achievements');
}
renderGallery();

// Toggle
const toggleBtns = document.querySelectorAll('.toggle-btn');
const projectsPanel = document.getElementById('projectsPanel');
const achievementsPanel = document.getElementById('achievementsPanel');
if (toggleBtns.length && projectsPanel && achievementsPanel) {
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.toggle;
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (target === 'projects') {
                achievementsPanel.classList.remove('active-panel');
                projectsPanel.classList.add('active-panel');
                setTimeout(() => updateFeaturedCarousel('projects'), 60);
            } else {
                projectsPanel.classList.remove('active-panel');
                achievementsPanel.classList.add('active-panel');
                setTimeout(() => updateFeaturedCarousel('achievements'), 60);
            }
        });
    });
}

// Reviews / Community Voices - Firebase Realtime Database + instant display
const REVIEWS_PATH = "testimonials";

const sampleReviews = [
    {id:'sample-1', name:'Project Collaborator', message:'Neil creates clean, thoughtful, and responsive designs that feel professional and easy to use.', rating:5, sample:true},
    {id:'sample-2', name:'Classmate Reviewer', message:'His work shows creativity, leadership, and strong attention to accessibility and user experience.', rating:5, sample:true},
    {id:'sample-3', name:'Community Member', message:'The portfolio looks polished, organized, and engaging across desktop and mobile screens.', rating:4, sample:true}
];

let currentEditId = null;
let reviewsListening = false;
let latestReviews = [];
let activeReviewFilter = 'all';
const fbReactionTypes = [
    {key:'like', label:'Like', emoji:'👍'},
    {key:'love', label:'Love', emoji:'❤️'},
    {key:'care', label:'Care', emoji:'🥰'},
    {key:'haha', label:'Haha', emoji:'😂'},
    {key:'wow', label:'Wow', emoji:'😮'},
    {key:'sad', label:'Sad', emoji:'😢'}
];

function getReviewReactionStore(){
    try{ return JSON.parse(localStorage.getItem('community_review_reactions') || '{}'); }catch(e){ return {}; }
}
function saveReviewReactionStore(store){
    try{ localStorage.setItem('community_review_reactions', JSON.stringify(store)); }catch(e){}
}
function getReactionState(reviewId){
    const store=getReviewReactionStore();
    return store[reviewId] || {selected:null, counts:{}};
}
function setReactionState(reviewId, reactionKey){
    const store=getReviewReactionStore();
    const current=store[reviewId] || {selected:null, counts:{}};
    current.counts=current.counts || {};
    if(current.selected && current.counts[current.selected]) current.counts[current.selected]=Math.max(0,current.counts[current.selected]-1);
    if(current.selected === reactionKey){
        current.selected=null;
    }else{
        current.selected=reactionKey;
        current.counts[reactionKey]=(current.counts[reactionKey] || 0) + 1;
    }
    store[reviewId]=current;
    saveReviewReactionStore(store);
    return current;
}
function reactionSummaryHTML(reviewId){
    const state=getReactionState(reviewId);
    const counts=state.counts || {};
    const top=fbReactionTypes.filter(r=>(counts[r.key] || 0)>0).sort((a,b)=>(counts[b.key]||0)-(counts[a.key]||0)).slice(0,3);
    const total=Object.values(counts).reduce((sum,val)=>sum+(parseInt(val)||0),0);
    const stack=(top.length ? top : fbReactionTypes.slice(0,3)).map(r=>`<span>${r.emoji}</span>`).join('');
    return `<div class="fb-reaction-summary"><div class="fb-reaction-stack">${stack}</div><span class="fb-reaction-total">${total || 'React'}</span></div>`;
}
function selectedReactionHTML(reviewId){
    const state=getReactionState(reviewId);
    const selected=fbReactionTypes.find(r=>r.key===state.selected);
    return selected ? `${selected.emoji} ${selected.label}` : `<i class="far fa-thumbs-up"></i> React`;
}

function updateReviewScore(items){
    const scoreEl=document.getElementById('reviewAverageScore');
    const starsEl=document.getElementById('reviewAverageStars');
    const labelEl=document.getElementById('reviewScoreLabel');
    if(!scoreEl || !starsEl || !labelEl) return;
    const list=(items && items.length ? items : sampleReviews).filter(item=>item && item.rating);
    const average=list.length ? (list.reduce((sum,item)=>sum + Math.max(1,Math.min(5,parseInt(item.rating||5))),0)/list.length) : 5;
    const rounded=Math.round(average);
    scoreEl.textContent=average.toFixed(1);
    starsEl.textContent='★'.repeat(rounded)+'☆'.repeat(5-rounded);
    labelEl.textContent=`Based on ${list.length} community review${list.length===1?'':'s'}`;
}

function createFloatingReaction(x,y,emoji){
    const bubble=document.createElement('span');
    bubble.className='floating-review-emoji';
    bubble.textContent=emoji || '✨';
    bubble.style.left=x+'px';
    bubble.style.top=y+'px';
    document.body.appendChild(bubble);
    setTimeout(()=>bubble.remove(),950);
}

function initReviewFilters(){
    document.querySelectorAll('.review-chip-btn').forEach(btn=>{
        if(btn.dataset.boundReviewFilter) return;
        btn.dataset.boundReviewFilter='true';
        btn.addEventListener('click',()=>{
            activeReviewFilter=btn.dataset.reviewFilter || 'all';
            document.querySelectorAll('.review-chip-btn').forEach(item=>item.classList.remove('active'));
            btn.classList.add('active');
            renderReviews(latestReviews.length ? latestReviews : sampleReviews);
        });
    });
}


function saveReviewsLocal(items){
    try{
        localStorage.setItem('community_reviews_cache', JSON.stringify(items.filter(item=>!item.sample)));
    }catch(e){}
}

function loadReviewsLocal(){
    try{
        return JSON.parse(localStorage.getItem('community_reviews_cache') || '[]');
    }catch(e){
        return [];
    }
}

function reviewCard(item){
    const safeName=escapeHtml(item.name||'Anonymous');
    const safeMsg=escapeHtml(item.message||'');
    const rating=Math.max(1,Math.min(5,parseInt(item.rating||5)));
    const id=escapeHtml(item.id||'');
    const actions=item.sample ? '' : `
        <div class="testimonial-actions">
            <button class="edit-testimonial" data-review-id="${id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="delete-testimonial" data-review-id="${id}"><i class="fas fa-trash-alt"></i> Delete</button>
        </div>`;

    return `
        <div class="testimonial-item" data-review-id="${id}" data-rating="${rating}">
            <div class="rating-stars">${"★".repeat(rating)}${"☆".repeat(5-rating)}</div>
            <div class="testimonial-text">“${safeMsg}”</div>
            <div class="testimonial-author"><i class="fas fa-user-circle"></i> ${safeName}</div>
            <div class="review-reactions fb-style" aria-label="Facebook-style review reactions">
                <div class="fb-react-wrap">
                    <button class="fb-react-main ${getReactionState(id).selected ? 'active' : ''}" type="button" data-review-id="${id}">${selectedReactionHTML(id)}</button>
                    <div class="fb-reaction-tray" role="group" aria-label="Choose a reaction">
                        ${fbReactionTypes.map(r=>`<button class="fb-reaction-option" type="button" data-review-id="${id}" data-reaction="${r.key}" data-emoji="${r.emoji}" data-label="${r.label}">${r.emoji}</button>`).join('')}
                    </div>
                </div>
                ${reactionSummaryHTML(id)}
            </div>
            ${actions}
        </div>`;
}

function renderReviews(items){
    const grid=document.getElementById("testimonialsGrid");
    if(!grid) return;

    const cleanItems = Array.isArray(items) ? items.filter(item => item && item.message) : [];
    latestReviews = cleanItems;

    const baseList = cleanItems.length ? cleanItems : sampleReviews;
    updateReviewScore(baseList);
    initReviewFilters();
    const list = activeReviewFilter === 'all' ? baseList : baseList.filter(item => String(item.rating || 5) === activeReviewFilter);
    grid.innerHTML = (list.length ? list : baseList).map(reviewCard).join("");

    grid.querySelectorAll('.testimonial-item').forEach((card,index)=>{
        card.style.animationDelay = `${Math.min(index * 0.08, 0.45)}s`;
        card.addEventListener('mousemove', (e)=>{
            const rect=card.getBoundingClientRect();
            const x=((e.clientX-rect.left)/rect.width-.5)*8;
            const y=((e.clientY-rect.top)/rect.height-.5)*-8;
            card.style.transform=`perspective(900px) translateY(-10px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
    });

    grid.querySelectorAll('.fb-reaction-option').forEach(btn=>{
        btn.addEventListener('click',(event)=>{
            const id=btn.dataset.reviewId;
            const reactionKey=btn.dataset.reaction;
            const state=setReactionState(id, reactionKey);
            const card=btn.closest('.testimonial-item');
            if(card){
                card.classList.remove('fb-reacted');
                void card.offsetWidth;
                card.classList.add('fb-reacted');
                const main=card.querySelector('.fb-react-main');
                const summary=card.querySelector('.fb-reaction-summary');
                if(main){
                    main.classList.toggle('active', !!state.selected);
                    main.innerHTML=selectedReactionHTML(id);
                }
                if(summary){ summary.outerHTML=reactionSummaryHTML(id); }
                const burst=document.createElement('span');
                burst.className='fb-reaction-burst';
                burst.textContent=btn.dataset.emoji || '👍';
                card.appendChild(burst);
                setTimeout(()=>burst.remove(),900);
            }
            createFloatingReaction(event.clientX,event.clientY,btn.dataset.emoji || '👍');
        });
    });

    grid.querySelectorAll('.fb-react-main').forEach(btn=>{
        btn.addEventListener('click',(event)=>{
            const id=btn.dataset.reviewId;
            const state=getReactionState(id);
            const fallback=state.selected || 'like';
            const chosen=fbReactionTypes.find(r=>r.key===fallback) || fbReactionTypes[0];
            setReactionState(id, chosen.key);
            renderReviews(latestReviews.length ? latestReviews : sampleReviews);
            createFloatingReaction(event.clientX,event.clientY,chosen.emoji);
        });
    });

    grid.querySelectorAll('.edit-testimonial').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const id=btn.dataset.reviewId;
            const item=latestReviews.find(review=>review.id===id);
            if(item) openEditModal(item.id, item.name || 'Anonymous', item.message || '', item.rating || 5);
        });
    });

    grid.querySelectorAll('.delete-testimonial').forEach(btn=>{
        btn.addEventListener('click',()=>{
            deleteTestimonial(btn.dataset.reviewId);
        });
    });
}

function loadTestimonials(){
    const localItems = loadReviewsLocal();

    if(!firebaseReady || !database){
        renderReviews(localItems.length ? localItems : sampleReviews);
        return;
    }

    if(reviewsListening) return;
    reviewsListening = true;

    const ref = database.ref(REVIEWS_PATH);

    ref.on("value", snap=>{
        let items=[];
        snap.forEach(ch=>{
            const val=ch.val() || {};
            items.push({
                id: ch.key,
                name: val.name || 'Anonymous',
                message: val.message || '',
                rating: val.rating || 5,
                timestamp: val.timestamp || 0
            });
        });

        items.sort((a,b)=>(b.timestamp||0)-(a.timestamp||0));
        saveReviewsLocal(items);
        renderReviews(items.length ? items : localItems);
    }, err=>{
        console.error("Firebase reviews load failed:", err);
        renderReviews(localItems.length ? localItems : sampleReviews);
        showNotification("Reviews are shown from local cache. Check Firebase rules/connection.", true);
    });
}

window.openEditModal=(id,name,msg,rating)=>{
    currentEditId=id;
    document.getElementById("editName").value=name;
    document.getElementById("editMessage").value=msg;
    document.getElementById("editRating").value=rating;
    showBlur();
    document.getElementById("editTestimonialModal").style.display="flex";
};

window.deleteTestimonial=async(id)=>{
    if(!id) return;

    if(!confirm("Delete this review?")) return;

    try{
        if(firebaseReady && database){
            await database.ref(`${REVIEWS_PATH}/${id}`).remove();
        }else{
            const updated = loadReviewsLocal().filter(item=>item.id!==id);
            saveReviewsLocal(updated);
            renderReviews(updated);
        }
        showNotification("Review deleted");
    }catch(err){
        console.error("Delete review failed:", err);
        showNotification("Review delete failed. Check database permission.", true);
    }
};

document.getElementById("saveEditBtn")?.addEventListener("click",async()=>{
    const msg=document.getElementById("editMessage").value.trim();
    const rating=parseInt(document.getElementById("editRating").value);

    if(!msg || !currentEditId) return showNotification("Review message is required", true);

    try{
        if(firebaseReady && database){
            await database.ref(`${REVIEWS_PATH}/${currentEditId}`).update({
                message: msg,
                rating,
                updatedAt: Date.now()
            });
        }else{
            const updated = loadReviewsLocal().map(item => item.id === currentEditId ? {...item, message:msg, rating, updatedAt:Date.now()} : item);
            saveReviewsLocal(updated);
            renderReviews(updated);
        }

        showNotification("Review updated");
        hideBlur();
        document.getElementById("editTestimonialModal").style.display="none";
    }catch(err){
        console.error("Update review failed:", err);
        showNotification("Review update failed. Check database permission.", true);
    }
});

document.getElementById("submitTestimonialBtnInline")?.addEventListener("click",async()=>{
    const name=document.getElementById("testimonialNameInput").value.trim();
    const msg=document.getElementById("testimonialMessageInput").value.trim();
    const rating=parseInt(document.getElementById("testimonialRatingInput").value);
    const btn=document.getElementById("submitTestimonialBtnInline");

    if(!name || !msg) return showNotification("Fill all review fields",true);

    const pendingId = 'pending-' + Date.now();
    const reviewData = {
        id: pendingId,
        name,
        message: msg,
        rating: Math.max(1, Math.min(5, rating || 5)),
        timestamp: Date.now()
    };

    btn.disabled = true;
    const oldBtnHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    /* Show the uploaded review immediately on the page.
       Firebase will replace/update the list once the database confirms. */
    const immediateItems = [reviewData, ...latestReviews.filter(item => item && item.message && !item.sample)];
    saveReviewsLocal(immediateItems);
    renderReviews(immediateItems);

    try{
        if(firebaseReady && database){
            const newRef = await database.ref(REVIEWS_PATH).push({
                name: reviewData.name,
                message: reviewData.message,
                rating: reviewData.rating,
                timestamp: reviewData.timestamp
            });

            reviewData.id = newRef.key;
            const syncedItems = [reviewData, ...latestReviews.filter(item => item.id !== reviewData.id && item.id !== pendingId)];
            saveReviewsLocal(syncedItems);
            renderReviews(syncedItems);

            showNotification("Thank you! Your review is saved and displayed.");
        }else{
            reviewData.id = 'local-' + Date.now();
            const localItems = [reviewData, ...loadReviewsLocal().filter(item => item.id !== reviewData.id)];
            saveReviewsLocal(localItems);
            renderReviews(localItems);
            showNotification("Thank you! Your review is displayed locally.");
        }

        document.getElementById("testimonialNameInput").value="";
        document.getElementById("testimonialMessageInput").value="";
        document.getElementById("testimonialRatingInput").value="5";
    }catch(err){
        console.error("Submit review failed:", err);

        reviewData.id = 'local-' + Date.now();
        const localItems = [reviewData, ...loadReviewsLocal().filter(item => item.id !== reviewData.id)];
        saveReviewsLocal(localItems);
        renderReviews(localItems);

        showNotification("Review displayed locally. Check Firebase rules to save online.", true);
    }finally{
        btn.disabled = false;
        btn.innerHTML = oldBtnHTML;
    }
});

document.getElementById("closeEditModalBtn")?.addEventListener("click",()=>{
    hideBlur();
    document.getElementById("editTestimonialModal").style.display="none";
});

loadTestimonials();

// Contact
document.getElementById("contactForm")?.addEventListener("submit",async(e)=>{ e.preventDefault(); let name=document.getElementById("name").value.trim(), email=document.getElementById("email").value.trim(), msg=document.getElementById("message").value.trim(); if(!name||!email||!msg) return showNotification("All fields required",true); if(firebaseReady){ await database.ref("contacts").push({name,email,message:msg,timestamp:Date.now()}); showNotification("Message sent!"); document.getElementById("contactForm").reset(); } else showNotification("Saved locally!"); });

// Navigation
document.getElementById("menuBtn")?.addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("active"));
document.querySelectorAll(".nav-links a").forEach(l=>l.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("active")));

// Resume Download
const resumeModal = document.getElementById('resumeDownloadModal');
const resumeBtn = document.getElementById('resumeBtn');
const closeResumeModal = document.getElementById('closeResumeModal');
const confirmDownloadBtn = document.getElementById('confirmDownloadBtn');

function showResumeModal() { showBlur(); resumeModal.style.display = 'flex'; }
function hideResumeModal() { hideBlur(); resumeModal.style.display = 'none'; }

resumeBtn?.addEventListener('click', showResumeModal);
closeResumeModal?.addEventListener('click', hideResumeModal);
resumeModal?.addEventListener('click', (e) => { if (e.target === resumeModal) hideResumeModal(); });

confirmDownloadBtn?.addEventListener('click', async () => {
    const name = document.getElementById('resumeName').value.trim();
    const email = document.getElementById('resumeEmail').value.trim();
    if (!name || !email) { showNotification('Please enter both name and email', true); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { showNotification('Valid email required', true); return; }
    const originalText = confirmDownloadBtn.innerHTML;
    confirmDownloadBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Processing...';
    confirmDownloadBtn.disabled = true;
    try {
        if (firebaseReady && database) {
            await database.ref('resume_downloads').push({ name, email, timestamp: new Date().toISOString(), downloaded: true });
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Neil Francis Arnaiz", 20, 30);
        doc.setFontSize(16);
        doc.text("Computer Programming Student", 20, 50);
        doc.setFontSize(12);
        doc.text("Email: neilfrancis.arnaiz@ccd.edu.ph", 20, 70);
        doc.text("GitHub: github.com/neilfrancis", 20, 80);
        doc.text("Location: Davao, Philippines", 20, 90);
        doc.text("Education: City College of Davao (2024-present)", 20, 110);
        doc.text("Skills: Web Dev, UI/UX, Three.js, Flutter, Firebase", 20, 130);
        doc.save('Neil_Francis_Arnaiz_Resume.pdf');
        showNotification('✅ Resume downloaded!');
        hideResumeModal();
        document.getElementById('resumeName').value = '';
        document.getElementById('resumeEmail').value = '';
    } catch (error) {
        showNotification('Error. Please try again.', true);
    } finally {
        confirmDownloadBtn.innerHTML = originalText;
        confirmDownloadBtn.disabled = false;
    }
});

function showBlur(){ document.getElementById("blurOverlay").classList.add("active"); }
function hideBlur(){ document.getElementById("blurOverlay").classList.remove("active"); }

document.getElementById("openReservationBtn")?.addEventListener("click",(e)=>{ e.preventDefault(); showBlur(); document.getElementById("reservationModal").style.display="flex"; });
document.getElementById("closeReservationModal")?.addEventListener("click",()=>{ hideBlur(); document.getElementById("reservationModal").style.display="none"; });
document.getElementById("reservationForm")?.addEventListener("submit",async(e)=>{ e.preventDefault(); const name=document.getElementById("resName").value.trim(), email=document.getElementById("resEmail").value.trim(), date=document.getElementById("resDate").value, time=document.getElementById("resTime").value; if(!name||!email||!date||!time) return showNotification("All fields required",true); if(firebaseReady){ await database.ref("reservations").push({name,email,date,time,timestamp:new Date().toISOString()}); showNotification("Reservation confirmed!"); } else showNotification("Saved locally!"); document.getElementById("reservationForm").reset(); hideBlur(); document.getElementById("reservationModal").style.display="none"; });


function closeCertificateModal(){
    const modal=document.getElementById("certModalOverlay");
    if(modal){
        modal.classList.remove("is-open");
        modal.style.display="none";
    }
    document.body.style.overflow="";
    hideBlur();
}
document.getElementById("closeCertModalBtn")?.addEventListener("click", closeCertificateModal);
document.getElementById("certModalOverlay")?.addEventListener("click",(e)=>{
    if(e.target.id==="certModalOverlay") closeCertificateModal();
});
document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape" && document.getElementById("certModalOverlay")?.classList.contains("is-open")) closeCertificateModal();
});

document.getElementById("closeSkillModalBtn")?.addEventListener("click",()=>{ hideBlur(); document.getElementById("skillDetailModal").style.display="none"; });
document.getElementById("closePreview")?.addEventListener("click",()=>{ hideBlur(); document.getElementById("previewModal").style.display="none"; });
document.querySelectorAll('.flip-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('flipped')));

// Fully Functional Pet Chatbot + Smooth Hologram Avatar
const chatbotEl = document.getElementById('chatbotContainer');
const chatHeader = document.getElementById('chatbotHeader');
const chatToggle = document.getElementById('chatToggle');
const closeChat = document.getElementById('closeChat');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const petSpeechBubble = document.getElementById('petSpeechBubble');

let avatarDrag = { active:false, moved:false, startX:0, startY:0, offsetX:0, offsetY:0 };
let chatDrag = { active:false, moved:false, offsetX:0, offsetY:0 };
let petMoodTimer = null;
let bubbleTimer = null;
let typingTimer = null;
let idleTimer = null;
let voiceEnabled = true;
let hasWelcomed = false;

const CHATBOT_KNOWLEDGE = [
    {
        keys:['hello','hi','hey','good morning','good afternoon','good evening'],
        answer:'🌿 Hi! I am Neil’s hologram pet assistant. I can guide visitors through the portfolio, projects, certificates, skills, and contact section.'
    },
    {
        keys:['skill','skills','expertise','tech stack','technology','programming','web'],
        answer:'💻 Neil’s core skills include frontend development, UI/UX design, database basics, system analysis and design, GitHub workflow, and accessibility-focused technology.'
    },
    {
        keys:['project','projects','featured work','work','portfolio'],
        answer:'🚀 You can explore the Featured Work section to view Neil’s project cards, achievements, gallery items, and expandable project details.'
    },
    {
        keys:['certificate','certificates','cert','award','awards'],
        answer:'🏅 Click any certificate card in the Certificates section to preview it in a centered pop-up with a smooth blurred background.'
    },
    {
        keys:['contact','email','message','hire','book','collaboration','collaborate'],
        answer:'📩 You can use the Contact section to send a message. Neil is open to portfolio projects, student leadership work, collaborations, and accessibility-centered technology ideas.'
    },
    {
        keys:['3d','memory','palace','three','artifact','artifacts'],
        answer:'🎮 The 3D Memory Palace is interactive. Drag to orbit, scroll to zoom, and click floating artifacts to explore Neil’s milestones.'
    },
    {
        keys:['pet','cute','touch','gesture','avatar','hologram','move','drag'],
        answer:'🐾 I react like a tiny digital pet. Tap me, drag me, hover over me, or double-tap me to see different gestures and moods.'
    },
    {
        keys:['resume','cv','download'],
        answer:'📄 Look for the resume or CV download button in the portfolio. I can also guide you to Neil’s background, skills, and accomplishments.'
    },
    {
        keys:['about','neil','who are you','who is neil'],
        answer:'👋 Neil Francis Arnaiz is a Computer Programming student passionate about modern websites, accessible technology, system design, and student leadership.'
    }
];

const petLines = [
    'Tap me 🐾',
    'Ask me anything ✨',
    'Need help?',
    'I can guide you 🌿',
    'Drag me around!'
];

function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
}

function isSmallScreen(){
    return window.innerWidth <= 560;
}

function keepElementInsideViewport(el, left, top){
    if(!el) return { left: 12, top: 12 };
    const gap = isSmallScreen() ? 8 : 12;
    const rect = el.getBoundingClientRect();
    const width = rect.width || el.offsetWidth || 72;
    const height = rect.height || el.offsetHeight || 72;
    return {
        left: clamp(left, gap, Math.max(gap, window.innerWidth - width - gap)),
        top: clamp(top, gap, Math.max(gap, window.innerHeight - height - gap))
    };
}

function escapeHtml(text){
    return String(text).replace(/[&<>'"]/g, ch => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;'
    }[ch]));
}

function cleanSpeech(text){
    return String(text).replace(/<[^>]*>/g,'').replace(/[🌿💻🏅🚀📩🎮🐾📄👋✨]/g,'').trim();
}


/* Cute child voice manager - one global voice system for every chatbot sound */
const NEILO_VOICE_CONFIG = {
    activeUtterance: null,
    voice: null,
    voiceReady: false,
    lastText: '',
    lastTime: 0,
    stopTimer: null
};

function getCuteChildVoice(){
    if(!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if(!voices.length) return null;

    const childHints = [
        'child','kid','kids','junior','young','little','cute','salli','ivy','aria','jenny','ana','sara','zira','samantha','google us english','female'
    ];
    const englishVoices = voices.filter(v => /^en/i.test(v.lang || ''));
    const pool = englishVoices.length ? englishVoices : voices;

    return pool.find(v => childHints.some(h => `${v.name} ${v.lang}`.toLowerCase().includes(h))) || pool[0];
}

// Backward-compatible alias for older chatbot blocks.
function getCuteGirlVoice(){
    return getCuteChildVoice();
}

function prepareNeiloVoice(){
    if(!('speechSynthesis' in window)) return;
    NEILO_VOICE_CONFIG.voice = getCuteChildVoice();
    NEILO_VOICE_CONFIG.voiceReady = true;
}

if('speechSynthesis' in window){
    prepareNeiloVoice();
    window.speechSynthesis.onvoiceschanged = prepareNeiloVoice;
}

function neiloCleanVoiceText(text){
    return String(text || '')
        .replace(/<[^>]+>/g,' ')
        .replace(/[🌿💻🏅🚀📩🎮🐾📄👋✨🕺😴👂🤖🦘🌀👏🎤🙇🎉🔄🔊🔇💤🌞😊🤔⚡💧🍪🥤❤️]/g,' ')
        .replace(/Neilo is awake again/gi,'I am awake again')
        .replace(/Neilo is sleeping/gi,'I am sleeping')
        .replace(/Click me to wake me up/gi,'click me to wake me up')
        .replace(/\s+/g,' ')
        .trim();
}

function neiloStopVoice(){
    if(!('speechSynthesis' in window)) return;
    clearTimeout(NEILO_VOICE_CONFIG.stopTimer);
    window.speechSynthesis.cancel();
    document.querySelectorAll('.is-speaking').forEach(el => el.classList.remove('is-speaking','gesture-listen','gesture-sing'));
    NEILO_VOICE_CONFIG.activeUtterance = null;
}

function neiloCuteSpeak(text, options = {}){
    if(!('speechSynthesis' in window)) return;
    const clean = neiloCleanVoiceText(text);
    if(!clean) return;

    const now = Date.now();
    if(clean === NEILO_VOICE_CONFIG.lastText && now - NEILO_VOICE_CONFIG.lastTime < 1100) return;
    NEILO_VOICE_CONFIG.lastText = clean;
    NEILO_VOICE_CONFIG.lastTime = now;

    // Always stop the previous utterance first so Neilo never talks over himself.
    neiloStopVoice();

    const u = new SpeechSynthesisUtterance(clean);
    u.voice = NEILO_VOICE_CONFIG.voice || getCuteChildVoice();
    u.lang = (u.voice && u.voice.lang) || 'en-US';
    u.rate = options.rate ?? 1.08;
    u.pitch = options.pitch ?? 1.65;
    u.volume = options.volume ?? 0.86;
    NEILO_VOICE_CONFIG.activeUtterance = u;

    const toggleEl = document.getElementById('chatToggle');
    toggleEl?.classList.add('is-speaking');
    u.onend = u.onerror = () => {
        toggleEl?.classList.remove('is-speaking','gesture-listen','gesture-sing');
        if(NEILO_VOICE_CONFIG.activeUtterance === u) NEILO_VOICE_CONFIG.activeUtterance = null;
    };

    // Small delay after cancel() improves consistency in Chrome and prevents stacked speech.
    NEILO_VOICE_CONFIG.stopTimer = setTimeout(() => {
        if(NEILO_VOICE_CONFIG.activeUtterance === u){
            window.speechSynthesis.speak(u);
        }
    }, 80);
}

function setPetMood(mood = '', duration = 1200){
    if(!chatToggle) return;
    const moods = ['pet-happy','pet-excited','pet-curious','pet-sleepy','pet-tap','pet-dragging','pet-thinking'];
    chatToggle.classList.remove(...moods);
    if(mood) chatToggle.classList.add(`pet-${mood}`);
    clearTimeout(petMoodTimer);
    if(duration > 0){
        petMoodTimer = setTimeout(() => chatToggle.classList.remove(...moods), duration);
    }
}

function showPetBubble(message, duration = 1600){
    if(!chatToggle || !petSpeechBubble) return;
    petSpeechBubble.textContent = message;
    chatToggle.classList.add('show-bubble');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => chatToggle.classList.remove('show-bubble'), duration);
}

function speakPet(message){
    if(!voiceEnabled || !message || !chatToggle) return;
    neiloCuteSpeak(message, { rate: 1.08, pitch: 1.66, volume: 0.86 });
}


function addMessage(text, isUser = false){
    if(!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    msg.innerHTML = isUser ? escapeHtml(text) : text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
}

function addTypingIndicator(){
    if(!chatMessages) return null;
    const typing = document.createElement('div');
    typing.className = 'message bot-message typing-message';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    return typing;
}

function getBotResponse(message){
    const normalized = message.toLowerCase().trim();
    const hit = CHATBOT_KNOWLEDGE.find(item => item.keys.some(key => normalized.includes(key)));
    if(hit) return hit.answer;
    if(normalized.length <= 2) return '🐾 Try asking about Neil’s projects, skills, certificates, contact details, or the 3D Memory Palace.';
    return '🌿 I can help with Neil’s portfolio. Try asking: “What are Neil’s skills?”, “Show projects”, “How can I contact Neil?”, or “What is the 3D Memory Palace?”';
}

function renderQuickReplies(){
    if(!chatMessages || document.getElementById('chatQuickReplies')) return;
    const quick = document.createElement('div');
    quick.id = 'chatQuickReplies';
    quick.className = 'chat-quick-replies';
    quick.innerHTML = `
        <button type="button" data-question="What are Neil's skills?">Skills</button>
        <button type="button" data-question="Show me the projects">Projects</button>
        <button type="button" data-question="Tell me about certificates">Certificates</button>
        <button type="button" data-question="How can I contact Neil?">Contact</button>
    `;
    chatMessages.appendChild(quick);
    quick.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-question]');
        if(!btn) return;
        chatInput.value = btn.dataset.question;
        sendMessage();
    });
}

function ensureChatTools(){
    if(!chatHeader || document.getElementById('chatToolBar')) return;
    const tools = document.createElement('div');
    tools.id = 'chatToolBar';
    tools.className = 'chat-tool-bar';
    tools.innerHTML = `
        <button type="button" id="voiceToggleBtn" title="Toggle voice" aria-label="Toggle voice"><i class="fas fa-volume-up"></i></button>
        <button type="button" id="clearChatBtn" title="Clear chat" aria-label="Clear chat"><i class="fas fa-broom"></i></button>
        <button type="button" id="minimizeChatBtn" title="Minimize" aria-label="Minimize chat"><i class="fas fa-minus"></i></button>
    `;
    const closeIcon = closeChat;
    if(closeIcon) chatHeader.insertBefore(tools, closeIcon);
    else chatHeader.appendChild(tools);

    document.getElementById('voiceToggleBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        voiceEnabled = !voiceEnabled;
        const icon = e.currentTarget.querySelector('i');
        if(icon) icon.className = voiceEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        showPetBubble(voiceEnabled ? 'Voice on 🔊' : 'Voice off 🔇', 1200);
        if(!voiceEnabled) neiloStopVoice();
    });

    document.getElementById('clearChatBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if(!chatMessages) return;
        chatMessages.innerHTML = '<div class="message bot-message">🧹 Chat cleared. What would you like to know about Neil’s portfolio?</div>';
        renderQuickReplies();
        setPetMood('happy', 900);
        showPetBubble('Clean chat!', 1100);
    });

    document.getElementById('minimizeChatBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeChatWindow(false);
    });
}

function positionChatNearAvatar(){
    if(!chatbotEl || !chatToggle) return;
    const avatarRect = chatToggle.getBoundingClientRect();
    const width = isSmallScreen() ? window.innerWidth - 20 : Math.min(390, window.innerWidth - 24);
    const height = isSmallScreen() ? Math.min(520, window.innerHeight - 105) : Math.min(560, window.innerHeight - 105);
    chatbotEl.style.width = `${width}px`;
    chatbotEl.style.height = `${height}px`;

    let left = avatarRect.right - width;
    let top = avatarRect.top - height - 14;
    if(top < 12) top = avatarRect.bottom + 14;
    if(isSmallScreen()){
        left = 10;
        top = Math.max(10, window.innerHeight - height - 92);
    }
    const pos = keepElementInsideViewport(chatbotEl, left, top);
    chatbotEl.style.left = `${pos.left}px`;
    chatbotEl.style.top = `${pos.top}px`;
    chatbotEl.style.right = 'auto';
    chatbotEl.style.bottom = 'auto';
    chatbotEl.classList.add('avatar-positioned');
}

function openChatWindow(){
    if(!chatbotEl) return;
    ensureChatTools();
    positionChatNearAvatar();
    chatbotEl.classList.remove('closing');
    chatbotEl.classList.add('open');
    chatToggle?.setAttribute('aria-label','Close chatbot');
    if(!hasWelcomed){
        addMessage('🐾 Hi! I am Neil’s interactive portfolio pet. Ask me about skills, projects, certificates, contact info, or the 3D Memory Palace.', false);
        renderQuickReplies();
        hasWelcomed = true;
    }
    setPetMood('excited', 1200);
    showPetBubble('I am here!', 1400);
    speakPet('Hi! I am Neil’s interactive portfolio pet assistant.');
    setTimeout(() => chatInput?.focus(), 160);
}

function closeChatWindow(withVoice = true){
    if(!chatbotEl) return;
    chatbotEl.classList.add('closing');
    chatbotEl.classList.remove('open');
    setTimeout(() => chatbotEl.classList.remove('closing'), 260);
    chatToggle?.setAttribute('aria-label','Open chatbot');
    neiloStopVoice();
    chatToggle?.classList.remove('is-speaking');
    setPetMood('sleepy', 900);
    showPetBubble('See you!', 1200);
    if(withVoice) speakPet('See you later!');
}

function toggleChatWindow(){
    if(chatbotEl?.classList.contains('open')) closeChatWindow();
    else openChatWindow();
}

function sendMessage(){
    if(!chatInput) return;
    const value = chatInput.value.trim();
    if(!value){
        setPetMood('curious', 700);
        showPetBubble('Type first ✨', 1000);
        return;
    }
    addMessage(value, true);
    chatInput.value = '';
    chatInput.focus();
    setPetMood('thinking', 0);
    showPetBubble('Thinking...', 900);
    const typing = addTypingIndicator();
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        typing?.remove();
        const response = getBotResponse(value);
        addMessage(response, false);
        renderQuickReplies();
        setPetMood('happy', 1300);
        showPetBubble('Answered!', 1200);
        speakPet(response);
    }, 520);
}

function startIdlePet(){
    clearInterval(idleTimer);
    idleTimer = setInterval(() => {
        if(!chatbotEl?.classList.contains('open') && chatToggle && !avatarDrag.active){
            const line = petLines[Math.floor(Math.random() * petLines.length)];
            showPetBubble(line, 1500);
            setPetMood(Math.random() > 0.5 ? 'curious' : 'happy', 900);
        }
    }, 8500);
}

chatToggle?.addEventListener('pointerdown', (e) => {
    if(e.button !== undefined && e.button !== 0) return;
    avatarDrag.active = true;
    avatarDrag.moved = false;
    avatarDrag.startX = e.clientX;
    avatarDrag.startY = e.clientY;
    const rect = chatToggle.getBoundingClientRect();
    avatarDrag.offsetX = e.clientX - rect.left;
    avatarDrag.offsetY = e.clientY - rect.top;
    chatToggle.setPointerCapture?.(e.pointerId);
    setPetMood('tap', 600);
});

chatToggle?.addEventListener('pointermove', (e) => {
    if(!avatarDrag.active || !chatToggle) return;
    const distance = Math.hypot(e.clientX - avatarDrag.startX, e.clientY - avatarDrag.startY);
    if(distance > 7) avatarDrag.moved = true;
    if(!avatarDrag.moved) return;
    e.preventDefault();
    chatToggle.classList.add('is-dragging','pet-dragging');
    const pos = keepElementInsideViewport(chatToggle, e.clientX - avatarDrag.offsetX, e.clientY - avatarDrag.offsetY);
    chatToggle.style.left = `${pos.left}px`;
    chatToggle.style.top = `${pos.top}px`;
    chatToggle.style.right = 'auto';
    chatToggle.style.bottom = 'auto';
    if(chatbotEl?.classList.contains('open')) positionChatNearAvatar();
});

function finishAvatarPointer(e){
    if(!chatToggle || !avatarDrag.active) return;
    try{ chatToggle.releasePointerCapture?.(e.pointerId); }catch(error){}
    chatToggle.classList.remove('is-dragging','pet-dragging');
    if(avatarDrag.moved){
        setPetMood('excited', 1000);
        showPetBubble('Whee!', 1100);
    }else{
        setPetMood('happy', 1000);
        toggleChatWindow();
    }
    avatarDrag.active = false;
    avatarDrag.moved = false;
}

chatToggle?.addEventListener('pointerup', finishAvatarPointer);
chatToggle?.addEventListener('pointercancel', () => {
    avatarDrag.active = false;
    avatarDrag.moved = false;
    chatToggle?.classList.remove('is-dragging','pet-dragging');
});

chatToggle?.addEventListener('mouseenter', () => {
    if(window.matchMedia('(hover:hover)').matches){
        setPetMood('curious', 900);
        showPetBubble('Touch me 🐾', 1200);
    }
});

chatToggle?.addEventListener('dblclick', (e) => {
    e.preventDefault();
    setPetMood('excited', 1400);
    showPetBubble('That tickles!', 1300);
    speakPet('That tickles!');
});

chatHeader?.addEventListener('pointerdown', (e) => {
    if(!chatbotEl || e.target.closest('#closeChat, #chatToolBar, button')) return;
    chatDrag.active = true;
    chatDrag.moved = false;
    const rect = chatbotEl.getBoundingClientRect();
    chatDrag.offsetX = e.clientX - rect.left;
    chatDrag.offsetY = e.clientY - rect.top;
    chatHeader.setPointerCapture?.(e.pointerId);
    e.preventDefault();
});

chatHeader?.addEventListener('pointermove', (e) => {
    if(!chatDrag.active || !chatbotEl) return;
    chatDrag.moved = true;
    e.preventDefault();
    const pos = keepElementInsideViewport(chatbotEl, e.clientX - chatDrag.offsetX, e.clientY - chatDrag.offsetY);
    chatbotEl.style.left = `${pos.left}px`;
    chatbotEl.style.top = `${pos.top}px`;
    chatbotEl.style.right = 'auto';
    chatbotEl.style.bottom = 'auto';
    chatbotEl.classList.add('avatar-positioned');
});

function finishChatDrag(e){
    chatDrag.active = false;
    try{ chatHeader?.releasePointerCapture?.(e.pointerId); }catch(error){}
}

chatHeader?.addEventListener('pointerup', finishChatDrag);
chatHeader?.addEventListener('pointercancel', finishChatDrag);

closeChat?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeChatWindow();
});
closeChat?.addEventListener('pointerdown', (e) => e.stopPropagation());

sendChatBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
});
chatInput?.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        e.preventDefault();
        sendMessage();
    }
});

document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && chatbotEl?.classList.contains('open')) closeChatWindow(false);
});

window.addEventListener('resize', () => {
    if(chatToggle){
        const rect = chatToggle.getBoundingClientRect();
        const pos = keepElementInsideViewport(chatToggle, rect.left, rect.top);
        chatToggle.style.left = `${pos.left}px`;
        chatToggle.style.top = `${pos.top}px`;
        chatToggle.style.right = 'auto';
        chatToggle.style.bottom = 'auto';
    }
    if(chatbotEl?.classList.contains('open')) positionChatNearAvatar();
});

ensureChatTools();
startIdlePet();
setTimeout(() => {
    showPetBubble('Tap me 🐾', 2200);
    setPetMood('happy', 1500);
}, 1000);

// Scroll Reveal & Back to Top
const revealElements = document.querySelectorAll('.reveal');
function checkReveal(){ revealElements.forEach(el=>{ if(el.getBoundingClientRect().top<window.innerHeight-100) el.classList.add('active'); }); }
window.addEventListener('scroll', checkReveal); window.addEventListener('load', checkReveal);
const backBtn = document.getElementById("backToTop");
window.addEventListener('scroll', () => { if(window.scrollY>500) backBtn?.classList.add('show'); else backBtn?.classList.remove('show'); });
backBtn?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

// Profile 3D Effect
const profileImg = document.getElementById("profileImage");
if(profileImg){
    profileImg.addEventListener("mousemove", (e) => { const rect = profileImg.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; profileImg.style.transform = `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale(1.04)`; });
    profileImg.addEventListener("mouseleave", () => profileImg.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
}


// Preserve glowing title effect for every section title without changing layout
function applyTitleGlow(){
    document.querySelectorAll(".section-title").forEach(title=>{
        if(title.querySelector(".letter-glow")) return;
        const raw=title.textContent;
        title.innerHTML="";
        [...raw].forEach(ch=>{
            if(ch===" "){
                title.appendChild(document.createTextNode(" "));
            }else{
                const span=document.createElement("span");
                span.className="letter-glow";
                span.textContent=ch;
                title.appendChild(span);
            }
        });
    });
}
applyTitleGlow();

console.log("Portfolio FULLY LOADED - Moving Certificates Carousel, Community Reviews, and Responsive Contact fixed");

// ===== FINAL NAV / MODAL STABILITY PATCH =====
(function(){
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');

    if(menuBtn && navLinks){
        menuBtn.addEventListener('click', function(){
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if(icon){
                icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        navLinks.querySelectorAll('a').forEach(link=>{
            link.addEventListener('click', function(){
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if(icon) icon.className = 'fas fa-bars';
            });
        });
    }

    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){
            const certModal = document.getElementById('certModalOverlay');
            if(certModal && (certModal.classList.contains('is-open') || certModal.style.display === 'flex')){
                certModal.classList.remove('is-open');
                certModal.style.display = 'none';
                document.body.style.overflow = '';
                if(typeof hideBlur === 'function') hideBlur();
            }
        }
    });

    window.addEventListener('resize', function(){
        if(window.innerWidth > 1150 && navLinks){
            navLinks.classList.remove('active');
            const icon = menuBtn?.querySelector('i');
            if(icon) icon.className = 'fas fa-bars';
        }
    });
})();
