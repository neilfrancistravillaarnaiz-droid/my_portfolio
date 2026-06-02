(function(){
    function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
    ready(function(){
        const toggle = document.getElementById('chatToggle');
        const bot = document.getElementById('chatbotContainer');
        const messages = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('sendChatBtn');
        const bubble = document.getElementById('petSpeechBubble');
        if(!toggle || !messages) return;

        const extraEmotionClasses = ['neilo-emotion-happy','neilo-emotion-sad','neilo-emotion-hungry','neilo-emotion-sleepy','neilo-emotion-thirsty'];
        let hunger = 65;
        let thirst = 58;

        function addMsg(html){
            const div = document.createElement('div');
            div.className = 'message bot-message';
            div.innerHTML = html;
            messages.appendChild(div);
            messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
        }
        function addUser(text){
            const div = document.createElement('div');
            div.className = 'message user-message';
            div.textContent = text;
            messages.appendChild(div);
            messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
        }
        function setBubble(text, ms=1600){
            if(!bubble) return;
            bubble.textContent = text;
            toggle.classList.add('show-bubble');
            clearTimeout(toggle.__careBubbleTimer);
            toggle.__careBubbleTimer = setTimeout(()=>toggle.classList.remove('show-bubble'), ms);
        }
        function status(label){
            const headerTitle = document.querySelector('#chatbotContainer .chatbot-header h4');
            if(!headerTitle) return;
            let pill = headerTitle.querySelector('.neilo-status-pill');
            if(!pill){
                pill = document.createElement('span');
                pill.className = 'neilo-status-pill';
                headerTitle.appendChild(pill);
            }
            pill.textContent = label;
        }
        function mood(cls, label){
            toggle.classList.remove(...extraEmotionClasses);
            toggle.classList.add(cls);
            status(label);
            updateCareTrayVisibility(cls);
        }
        function updateCareTrayVisibility(cls){
            const tray = document.getElementById('neiloCareTray');
            const needsCare = cls === 'neilo-emotion-hungry' || cls === 'neilo-emotion-thirsty';
            if(tray) tray.classList.toggle('neilo-care-visible', needsCare);
            toggle.classList.toggle('neilo-needs-care', needsCare);
        }
        function isSleeping(){ return toggle.classList.contains('neilo-sleep-locked'); }

        function feedNeilo(kind){
            if(isSleeping()){
                addMsg('💤 Neilo is sleeping. Click Neilo first to wake him up before feeding him.');
                setBubble('Wake me first 💤', 1500);
                return;
            }
            if(kind === 'water'){
                thirst = Math.min(100, thirst + 32);
                mood('neilo-emotion-happy', '💧 Hydrated');
                toggle.classList.add('neilo-drinking','gesture-happy');
                addMsg('💧 <b>Neilo drinks the water!</b> Thank you! I feel refreshed and energized.');
                setBubble('Glug glug! Thank you 💧', 1800);
                setTimeout(()=>toggle.classList.remove('neilo-drinking','gesture-happy'), 1200);
            }else{
                hunger = Math.min(100, hunger + 35);
                mood('neilo-emotion-happy', '🍪 Full');
                toggle.classList.add('neilo-eating','gesture-happy');
                addMsg('🍪 <b>Neilo eats the food!</b> Yum! My energy is back.');
                setBubble('Nom nom! Thank you 🍪', 1800);
                setTimeout(()=>toggle.classList.remove('neilo-eating','gesture-happy'), 1200);
            }
        }

        function makeTray(){
            if(document.getElementById('neiloCareTray')) return;
            const tray = document.createElement('div');
            tray.id = 'neiloCareTray';
            tray.className = 'neilo-care-tray';
            tray.innerHTML = '<span class="neilo-care-label">Feed Neilo</span><button class="neilo-care-btn" type="button" data-care="food" title="Give food to Neilo">🍪</button><button class="neilo-care-btn" type="button" data-care="water" title="Give water to Neilo">💧</button>';
            document.body.appendChild(tray);
            updateCareTrayVisibility(toggle.classList.contains('neilo-emotion-hungry') ? 'neilo-emotion-hungry' : (toggle.classList.contains('neilo-emotion-thirsty') ? 'neilo-emotion-thirsty' : ''));

            let drag = null;
            tray.querySelectorAll('.neilo-care-btn').forEach(btn=>{
                btn.addEventListener('click', e=>{
                    if(btn.__dragged){ btn.__dragged = false; return; }
                    feedNeilo(btn.dataset.care);
                });
                btn.addEventListener('pointerdown', e=>{
                    btn.setPointerCapture?.(e.pointerId);
                    const ghost = document.createElement('div');
                    ghost.className = 'neilo-care-ghost';
                    ghost.textContent = btn.textContent;
                    document.body.appendChild(ghost);
                    drag = {btn, ghost, care:btn.dataset.care, moved:false};
                    moveGhost(e.clientX, e.clientY);
                    e.preventDefault();
                });
                btn.addEventListener('pointermove', e=>{
                    if(!drag || drag.btn !== btn) return;
                    drag.moved = true;
                    btn.__dragged = true;
                    moveGhost(e.clientX, e.clientY);
                    const over = pointOverAvatar(e.clientX, e.clientY);
                    toggle.classList.toggle('neilo-feed-target', over);
                });
                btn.addEventListener('pointerup', e=>{
                    if(!drag || drag.btn !== btn) return;
                    const over = pointOverAvatar(e.clientX, e.clientY);
                    drag.ghost.remove();
                    toggle.classList.remove('neilo-feed-target');
                    const care = drag.care;
                    drag = null;
                    setTimeout(()=>{ btn.__dragged = false; }, 80);
                    if(over) feedNeilo(care);
                });
                btn.addEventListener('pointercancel', ()=>{
                    if(drag){ drag.ghost.remove(); drag = null; }
                    toggle.classList.remove('neilo-feed-target');
                });
            });
            function moveGhost(x,y){
                if(!drag) return;
                drag.ghost.style.left = x + 'px';
                drag.ghost.style.top = y + 'px';
            }
            function pointOverAvatar(x,y){
                const r = toggle.getBoundingClientRect();
                return x >= r.left - 18 && x <= r.right + 18 && y >= r.top - 18 && y <= r.bottom + 18;
            }
        }

        function handleCareCommand(value){
            const q = String(value || '').toLowerCase().trim();
            if(q.includes('/feed') || q.includes('give food') || q === 'food' || q.includes('eat now')){
                feedNeilo('food');
                return true;
            }
            if(q.includes('/water') || q.includes('/drink') || q.includes('give water') || q === 'water' || q.includes('drink now')){
                feedNeilo('water');
                return true;
            }
            if(q.includes('/thirsty') || q.includes('thirsty')){
                if(isSleeping()){
                    addMsg('💤 Neilo is sleeping. Wake him first before giving water.');
                    setBubble('Zzz...', 1200);
                }else{
                    mood('neilo-emotion-thirsty', '💧 Thirsty');
                    addMsg('💧 Neilo is thirsty. Drag the water drop to me or click the water button.');
                    setBubble('I need water 💧', 1800);
                }
                return true;
            }
            if(q.includes('/care') || q.includes('feed neilo')){
                addMsg('🍪💧 <b>Care for Neilo:</b> Click or drag the cookie/water buttons near the avatar. Commands: /feed, /water, /thirsty, /hungry.');
                setBubble('Drag food or water to me!', 1800);
                return true;
            }
            return false;
        }

        makeTray();
        const panel = document.getElementById('chatCommandPanel');
        if(panel && !panel.dataset.neiloCareAdded){
            panel.dataset.neiloCareAdded = 'true';
            [['🍪 Feed','/feed'],['💧 Water','/water'],['🫶 Care','/care']].reverse().forEach(([label,cmd])=>{
                const b = document.createElement('button');
                b.type = 'button';
                b.dataset.cmd = cmd;
                b.textContent = label;
                panel.insertBefore(b, panel.firstChild);
            });
        }
        bot?.addEventListener('click', e=>{
            const btn = e.target.closest('button[data-cmd]');
            if(!btn) return;
            if(['/feed','/water','/care'].includes(btn.dataset.cmd)){
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                handleCareCommand(btn.dataset.cmd);
            }
        }, true);
        send?.addEventListener('click', e=>{
            const value = input?.value?.trim() || '';
            if(!value) return;
            if(handleCareCommand(value)){
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                addUser(value); input.value = '';
            }
        }, true);
        input?.addEventListener('keydown', e=>{
            if(e.key !== 'Enter') return;
            const value = input.value.trim();
            if(!value) return;
            if(handleCareCommand(value)){
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                addUser(value); input.value = '';
            }
        }, true);

        setInterval(()=>{
            if(isSleeping()) return;
            hunger -= .45;
            thirst -= .52;
            if(thirst < 24){
                mood('neilo-emotion-thirsty', '💧 Thirsty');
                setBubble('Water please 💧', 1200);
            }else if(hunger < 24){
                mood('neilo-emotion-hungry', '🍽️ Hungry');
                setBubble('Food please 🍪', 1200);
            }
        }, 12000);
    });
})();
