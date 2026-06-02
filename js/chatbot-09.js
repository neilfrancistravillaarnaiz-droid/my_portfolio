(function(){
    function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatToggle');
        const messages = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('sendChatBtn');
        if(!bot || !toggle || !messages || !input) return;

        let voiceOn = true;
        let longPressTimer = null;
        let currentGestureTimer = null;
        const gestureClasses = ['gesture-wave','gesture-dance','gesture-think','gesture-sleep','gesture-happy','gesture-listen','gesture-point','gesture-confused'];
        const replies = [
            {keys:['/wave','wave','hello','hi','hey'], gesture:'wave', text:'👋 Hello! I am Neilo, Neil’s emotional hologram robot assistant. I can wave, dance, listen, sleep, point, clear chat, and guide you through the portfolio.'},
            {keys:['/dance','dance','party'], gesture:'dance', text:'🕺 Dance mode activated! Ask me about Neil’s skills, projects, certificates, or contact details.'},
            {keys:['/sleep','sleep','rest'], gesture:'sleep', text:'😴 Sleepy mode on. Tap me again when you need help.'},
            {keys:['/listen','listen','voice'], gesture:'listen', text:'👂 Listening mode. Type a question or use quick commands like /skills, /projects, /contact, /wave, or /dance.'},
            {keys:['/skills','skill','skills','expertise','programming','tech'], gesture:'point', text:'💻 Neil’s skills include HTML, CSS, JavaScript, UI/UX design, database basics, GitHub workflow, system analysis, and accessible technology design.'},
            {keys:['/projects','project','projects','featured'], gesture:'point', text:'🚀 Go to the Featured Works or Projects section to explore Neil’s portfolio projects, interactive cards, and system concepts.'},
            {keys:['/certificates','certificate','certificates','award'], gesture:'happy', text:'🏅 In the Certificates section, click a certificate card to preview the full certificate in a clean pop-up.'},
            {keys:['/contact','contact','email','hire','message'], gesture:'point', text:'📩 Use the Contact section to send Neil a message for collaborations, portfolio work, student leadership projects, or accessibility-focused ideas.'},
            {keys:['/help','help','commands','command'], gesture:'wave', text:'🤖 Commands: /wave, /dance, /sleep, /listen, /skills, /projects, /certificates, /contact, /clear, and /voice. You can also drag me around or hover to make me wave.'},
            {keys:['3d','memory palace','artifact','artifacts'], gesture:'point', text:'🎮 The 3D Memory Palace is interactive. Drag to orbit, scroll to zoom, and click floating artifacts to explore milestones.'}
        ];

        function cleanText(t){ return String(t).replace(/<[^>]+>/g,'').replace(/[🌿💻🏅🚀📩🎮🐾📄👋✨🕺😴👂🤖🧹🔊🔇🤔]/g,'').trim(); }
        function speak(text){
            if(!voiceOn || !text) return;
            neiloCuteSpeak(cleanText(text), { rate: 1.08, pitch: 1.66, volume: 0.86 });
            toggle.classList.add('gesture-listen');
        }
        function bubble(text, ms=1300){
            const b = document.getElementById('petSpeechBubble');
            if(!b) return;
            b.textContent = text;
            toggle.classList.add('show-bubble');
            clearTimeout(toggle.__bubbleTimer);
            toggle.__bubbleTimer = setTimeout(()=>toggle.classList.remove('show-bubble'), ms);
        }
        function gesture(name, ms=1400){
            toggle.classList.remove(...gestureClasses);
            if(name) toggle.classList.add('gesture-'+name);
            clearTimeout(currentGestureTimer);
            if(ms>0) currentGestureTimer = setTimeout(()=>toggle.classList.remove(...gestureClasses), ms);
            const ripple = document.createElement('span');
            ripple.className = 'gesture-ripple';
            toggle.appendChild(ripple);
            setTimeout(()=>ripple.remove(), 760);
        }
        function addMsg(text, who='bot'){
            const div = document.createElement('div');
            div.className = 'message ' + (who === 'user' ? 'user-message' : 'bot-message');
            if(who === 'user') div.textContent = text; else div.innerHTML = text;
            messages.appendChild(div);
            messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
        }
        function answerFor(raw){
            const q = raw.toLowerCase().trim();
            if(q === '/voice'){ voiceOn = !voiceOn; return {gesture:'listen', text: voiceOn ? '🔊 Voice response is now on.' : '🔇 Voice response is now off.'}; }
            if(q === '/clear'){ messages.innerHTML = '<div class="message bot-message">🧹 Chat cleared. Try /help to see my commands.</div>'; ensureCommandPanel(); return {gesture:'happy', text:''}; }
            const found = replies.find(r => r.keys.some(k => q.includes(k)));
            if(found) return found;
            return {gesture:'confused', text:'🤔 I am not sure yet, but I can help with /skills, /projects, /certificates, /contact, /wave, /dance, /sleep, or /help.'};
        }
        function sendInteractive(){
            const value = input.value.trim();
            if(!value){ gesture('confused',900); bubble('Type first ✨'); return; }
            addMsg(value, 'user');
            input.value = '';
            gesture('think', 0);
            bubble('Thinking...');
            const thinking = document.createElement('div');
            thinking.className = 'message bot-message typing-message';
            thinking.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            messages.appendChild(thinking);
            messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
            setTimeout(()=>{
                thinking.remove();
                const res = answerFor(value);
                if(res.text){ addMsg(res.text, 'bot'); speak(res.text); }
                gesture(res.gesture || 'happy', res.gesture === 'sleep' ? 2600 : 1600);
                bubble(res.gesture === 'sleep' ? 'Zzz...' : 'Done ✨');
            }, 450);
        }
        function ensureCommandPanel(){
            if(document.getElementById('chatCommandPanel')) return;
            const panel = document.createElement('div');
            panel.id = 'chatCommandPanel';
            panel.className = 'chat-command-panel';
            panel.innerHTML = `
                <button type="button" data-cmd="/wave">👋 Wave</button>
                <button type="button" data-cmd="/dance">🕺 Dance</button>
                <button type="button" data-cmd="/sleep">😴 Sleep</button>
                <button type="button" data-cmd="/sad">😢 Sad</button>
                <button type="button" data-cmd="/hungry">🍽️ Hungry</button>
                <button type="button" data-cmd="/skills">💻 Skills</button>
                <button type="button" data-cmd="/projects">🚀 Projects</button>
                <button type="button" data-cmd="/contact">📩 Contact</button>
                <button type="button" data-cmd="/help">🤖 Help</button>
            `;
            const note = document.createElement('div');
            note.className = 'command-chip-note';
            note.textContent = 'Commands: /wave /dance /sleep /wake /happy /sad /hungry /sleepy /listen /jump /spin /clap /sing /bow /cheer /shake /nod /scan /powerup /wiggle /skills /projects /contact /clear /voice';
            const inputArea = bot.querySelector('.chat-input-area');
            if(inputArea){ bot.insertBefore(panel, inputArea); bot.insertBefore(note, inputArea); }
            panel.addEventListener('click', e=>{
                const btn = e.target.closest('button[data-cmd]');
                if(!btn) return;
                input.value = btn.dataset.cmd;
                sendInteractive();
            }, true);
        }
        ensureCommandPanel();
        send?.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); sendInteractive(); }, true);
        input.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); sendInteractive(); } }, true);
        toggle.addEventListener('mouseenter', ()=>{ gesture('wave',1300); bubble('Hi Neil! 👋'); }, true);
        toggle.addEventListener('pointerdown', ()=>{ clearTimeout(longPressTimer); longPressTimer = setTimeout(()=>{ gesture('sleep',2300); bubble('Long press sleep 😴'); speak('Sleep mode.'); }, 650); }, true);
        toggle.addEventListener('pointerup', ()=> clearTimeout(longPressTimer), true);
        toggle.addEventListener('pointercancel', ()=> clearTimeout(longPressTimer), true);
        toggle.addEventListener('dblclick', e=>{ e.preventDefault(); gesture('dance',1800); bubble('Dance mode!'); speak('Dance mode activated!'); }, true);
        toggle.addEventListener('contextmenu', e=>{ e.preventDefault(); gesture('listen',1600); bubble('Listening mode 👂'); }, true);
        window.robotGesture = gesture;
        window.sendChatMessage = sendInteractive;
        setInterval(()=>{
            if(!bot.classList.contains('open') && !toggle.classList.contains('is-dragging')){
                const moods = [['wave','Need help?'],['happy','Tap me ✨'],['listen','Ask me a command'],['dance','Try /dance']];
                const [g,t] = moods[Math.floor(Math.random()*moods.length)];
                gesture(g, 1200); bubble(t, 1300);
            }
        }, 10000);
    });
})();
