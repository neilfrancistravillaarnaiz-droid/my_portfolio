(function(){
    function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatToggle');
        const messages = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('sendChatBtn');
        if(!bot || !toggle || !messages || !input) return;

        // Make sure arms exist without changing the current avatar layout.
        const figure = toggle.querySelector('.avatar-3d-figure') || toggle;
        if(!toggle.querySelector('.avatar-arm-left')){
            figure.insertAdjacentHTML('beforeend', '<span class="avatar-arm avatar-arm-left"><span class="avatar-hand"></span></span><span class="avatar-arm avatar-arm-right"><span class="avatar-hand"></span></span>');
        }

        const allGestures = ['gesture-wave','gesture-dance','gesture-think','gesture-sleep','gesture-happy','gesture-listen','gesture-point','gesture-confused','gesture-jump','gesture-spin','gesture-clap','gesture-sing','gesture-bow','gesture-cheer','gesture-shake','gesture-nod','gesture-scan','gesture-powerup','gesture-wiggle'];
        let timer;
        let voiceOn = true;

        function speak(text){
            if(!voiceOn || !text) return;
            neiloCuteSpeak(String(text).replace(/<[^>]+>/g,'').replace(/[👋🕺😴👂💻🚀🏅📩🤖🎮🤔🦘🌀👏🎤🙇🎉🔄🔊🔇]/g,''), { rate: 1.08, pitch: 1.66, volume: 0.86 });
        }
        function bubble(text, ms=1400){
            const b = document.getElementById('petSpeechBubble');
            if(!b) return;
            b.textContent = text;
            toggle.classList.add('show-bubble');
            clearTimeout(toggle.__bubbleTimer);
            toggle.__bubbleTimer = setTimeout(()=>toggle.classList.remove('show-bubble'), ms);
        }
        function visualFX(type){
            if(type === 'sing'){
                for(let i=0;i<5;i++) setTimeout(()=>{
                    const n=document.createElement('span');
                    n.className='music-note-float';
                    n.textContent=['♪','♫','♬','♩'][i%4];
                    n.style.setProperty('--x', `${(i-2)*16}px`);
                    toggle.appendChild(n);
                    setTimeout(()=>n.remove(),1100);
                }, i*170);
            }
            if(type === 'clap'){
                for(let i=0;i<12;i++){
                    const s=document.createElement('span');
                    s.className='clap-spark';
                    const a=(Math.PI*2/12)*i, d=18+Math.random()*22;
                    s.style.setProperty('--x', Math.cos(a)*d+'px');
                    s.style.setProperty('--y', Math.sin(a)*d+'px');
                    toggle.appendChild(s);
                    setTimeout(()=>s.remove(),700);
                }
            }
        }
        function runGesture(name='happy', ms=1500, say=''){
            toggle.classList.remove(...allGestures);
            toggle.classList.add('gesture-'+name);
            visualFX(name);
            if(say) bubble(say);
            clearTimeout(timer);
            if(ms>0) timer=setTimeout(()=>toggle.classList.remove(...allGestures), ms);
        }
        function addMsg(text, who='bot'){
            const div=document.createElement('div');
            div.className='message '+(who==='user'?'user-message':'bot-message');
            who==='user' ? div.textContent=text : div.innerHTML=text;
            messages.appendChild(div);
            messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
        }
        const commands = {
            '/jump': ['jump','🦘 Jump activated! I restored my jump gesture.'],
            '/spin': ['spin','🌀 Spin mode activated! Watch the avatar rotate in 3D.'],
            '/clap': ['clap','👏 Clap clap! Great work, Neil.'],
            '/sing': ['sing','🎤 Singing mode on! La la la, welcome to Neil’s portfolio.'],
            '/bow': ['bow','🙇 Bow gesture activated. Thank you for visiting!'],
            '/cheer': ['cheer','🎉 Cheer mode! Keep building amazing projects.'],
            '/shake': ['shake','🤖 Shake gesture activated! Neilo is excited.'],
            '/nod': ['nod','🙂 Nod gesture activated. Yes, Neilo agrees!'],
            '/scan': ['scan','🔎 Scan mode activated. Neilo is checking the portfolio interface.'],
            '/powerup': ['powerup','⚡ Power-up mode activated! Energy level rising.'],
            '/wiggle': ['wiggle','✨ Wiggle mode activated! Neilo is playful today.'],
            '/reset': ['happy','🔄 Avatar reset. All gestures are ready again.'],
            '/wave': ['wave','👋 Wave gesture activated.'],
            '/dance': ['dance','🕺 Dance mode activated!'],
            '/sleep': ['sleep','😴 Sleep gesture activated.'],
            '/listen': ['listen','👂 Listening gesture activated.'],
            '/skills': ['point','💻 Neil’s skills include HTML, CSS, JavaScript, UI/UX, database basics, GitHub, and accessible technology design.'],
            '/projects': ['point','🚀 Visit Featured Works to preview Neil’s projects.'],
            '/certificates': ['happy','🏅 Click certificate cards to preview each certificate.'],
            '/contact': ['point','📩 Use the Contact section to message Neil.'],
            '/help': ['wave','🤖 Commands: /jump, /spin, /clap, /sing, /bow, /cheer, /shake, /nod, /scan, /powerup, /wiggle, /wave, /dance, /sleep, /listen, /skills, /projects, /certificates, /contact, /clear, /voice, /reset.']
        };
        function getResponse(raw){
            const q=raw.toLowerCase().trim();
            if(q==='/voice'){ voiceOn=!voiceOn; return ['listen', voiceOn?'🔊 Voice is now on.':'🔇 Voice is now off.']; }
            if(q==='/clear'){
                messages.innerHTML='<div class="message bot-message">🧹 Chat cleared. Type /help to show all commands.</div>';
                return ['happy',''];
            }
            if(commands[q]) return commands[q];
            if(q.includes('jump')) return commands['/jump'];
            if(q.includes('spin')) return commands['/spin'];
            if(q.includes('clap')) return commands['/clap'];
            if(q.includes('sing') || q.includes('song')) return commands['/sing'];
            if(q.includes('bow')) return commands['/bow'];
            if(q.includes('cheer')) return commands['/cheer'];
            if(q.includes('reset')) return commands['/reset'];
            return ['confused','🤔 I can do gestures now. Try /jump, /spin, /clap, /sing, /bow, /cheer, /dance, or /help.'];
        }
        function sendNow(){
            const v=input.value.trim();
            if(!v){ runGesture('confused',900,'Type a command first'); return; }
            addMsg(v,'user'); input.value='';
            const [g,t]=getResponse(v);
            if(t) addMsg(t,'bot');
            runGesture(g, g==='sing'?3600: g==='sleep'?2600:1800, t ? t.replace(/<[^>]+>/g,'').slice(0,34) : 'Done');
            speak(t);
        }
        function upgradePanel(){
            let panel=document.getElementById('chatCommandPanel');
            if(!panel){
                panel=document.createElement('div'); panel.id='chatCommandPanel'; panel.className='chat-command-panel';
                const inputArea=bot.querySelector('.chat-input-area');
                if(inputArea) bot.insertBefore(panel,inputArea);
            }
            panel.innerHTML=`
                <button type="button" data-cmd="/jump">🦘 Jump</button>
                <button type="button" data-cmd="/spin">🌀 Spin</button>
                <button type="button" data-cmd="/clap">👏 Clap</button>
                <button type="button" data-cmd="/sing">🎤 Sing</button>
                <button type="button" data-cmd="/bow">🙇 Bow</button>
                <button type="button" data-cmd="/cheer">🎉 Cheer</button>
                <button type="button" data-cmd="/dance">🕺 Dance</button>
                <button type="button" data-cmd="/wave">👋 Wave</button>
                <button type="button" data-cmd="/help">🤖 Help</button>
            `;
            panel.onclick=function(e){ const b=e.target.closest('button[data-cmd]'); if(!b) return; input.value=b.dataset.cmd; sendNow(); };
            const oldNote=bot.querySelector('.command-chip-note');
            if(oldNote) oldNote.textContent='Avatar commands restored: /jump /spin /clap /sing /bow /cheer /wave /dance /sleep /listen /reset';
        }
        upgradePanel();
        send?.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); sendNow(); }, true);
        input.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); sendNow(); } }, true);
        toggle.addEventListener('dblclick', function(e){ e.preventDefault(); runGesture('spin',1800,'Spin!'); speak('Spin mode activated.'); }, true);
        window.robotGesture = runGesture;
        window.sendChatMessage = sendNow;
    });
})();
