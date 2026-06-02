(function(){
    function ready(fn){
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
        else fn();
    }

    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatToggle');
        const messages = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('sendChatBtn');
        const bubble = document.getElementById('petSpeechBubble');
        if(!bot || !toggle || !messages || !input) return;

        const gestureClasses = [
            'gesture-wave','gesture-dance','gesture-think','gesture-sleep','gesture-happy','gesture-listen','gesture-point','gesture-confused',
            'gesture-jump','gesture-spin','gesture-clap','gesture-sing','gesture-bow','gesture-cheer','gesture-shake','gesture-nod','gesture-scan','gesture-powerup','gesture-wiggle'
        ];

        const commandMap = {
            '/jump': {
                gesture:'jump', duration:1500, bubble:'Jump jump!',
                chat:'🦘 Jump command activated! I am jumping now.',
                voice:'Jump jump! I am jumping now!'
            },
            '/spin': {
                gesture:'spin', duration:1600, bubble:'Spin time!',
                chat:'🌀 Spin command activated! I am spinning in 3D.',
                voice:'Spin time! Watch me spin!'
            },
            '/clap': {
                gesture:'clap', duration:1900, bubble:'Clap clap!',
                chat:'👏 Clap command activated! Clap clap, great work!',
                voice:'Clap clap! Great work, Neil!'
            },
            '/sing': {
                gesture:'sing', duration:6200, bubble:'Singing ♪',
                chat:'🎤 Sing command activated! Neilo is singing a cute portfolio song.',
                voice:'La la la, hello hello! Welcome to Neil’s portfolio. Code and dreams will glow, let’s build and learn and grow!'
            },
            '/bow': {
                gesture:'bow', duration:1600, bubble:'Thank you!',
                chat:'🙇 Bow command activated! Thank you for visiting.',
                voice:'Thank you for visiting Neil’s portfolio!'
            },
            '/cheer': {
                gesture:'cheer', duration:2600, bubble:'Go Neil!',
                chat:'🎉 Cheer command activated! Go Neil, keep building amazing projects!',
                voice:'Woohoo! Go Neil! Keep building amazing projects! You can do it!'
            },
            '/dance': {
                gesture:'dance', duration:2600, bubble:'Dance mode!',
                chat:'🕺 Dance command activated! I am dancing now.',
                voice:'Dance mode activated! Time to groove!'
            },
            '/wave': {
                gesture:'wave', duration:1500, bubble:'Hi there!',
                chat:'👋 Wave command activated! Hi there!',
                voice:'Hi there! I am waving at you!'
            },
            '/sleep': {
                gesture:'sleep', duration:2600, bubble:'Sleepy...',
                chat:'😴 Sleep command activated. I am sleepy now.',
                voice:'I am sleepy now. Click me or type wake when you need me.'
            },
            '/wake': {
                gesture:'happy', duration:1500, bubble:'Wakey wakey!',
                chat:'🌞 Wake command activated! Wakey wakey, I am awake again.',
                voice:'Wakey wakey! I am awake again!'
            },
            '/listen': {
                gesture:'listen', duration:1700, bubble:'Listening!',
                chat:'👂 Listen command activated! I am listening carefully.',
                voice:'I am listening carefully!'
            },
            '/shake': {
                gesture:'shake', duration:1700, bubble:'Shake shake!',
                chat:'🤖 Shake command activated! Shake shake!',
                voice:'Shake shake! I am excited!'
            },
            '/nod': {
                gesture:'nod', duration:1700, bubble:'Yes yes!',
                chat:'🙂 Nod command activated! Yes, yes!',
                voice:'Yes yes! I agree!'
            },
            '/scan': {
                gesture:'scan', duration:1900, bubble:'Scanning...',
                chat:'🔎 Scan command activated! I am scanning the portfolio.',
                voice:'Scan mode activated. I am checking the portfolio interface.'
            },
            '/powerup': {
                gesture:'powerup', duration:2000, bubble:'Power up!',
                chat:'⚡ Power-up command activated! Energy level rising.',
                voice:'Power up! Energy level rising!'
            },
            '/wiggle': {
                gesture:'wiggle', duration:1900, bubble:'Wiggle!',
                chat:'✨ Wiggle command activated! I am wiggling happily.',
                voice:'Wiggle wiggle! I am happy today!'
            },
            '/happy': {
                gesture:'happy', duration:1500, bubble:'Happy!',
                chat:'😊 Happy command activated! I feel happy and ready to help.',
                voice:'I feel happy and ready to help!'
            },
            '/sad': {
                gesture:'confused', duration:1600, bubble:'Aww...',
                chat:'😢 Sad command activated. I feel a little sad, but I will be okay.',
                voice:'I feel a little sad, but I will be okay.'
            },
            '/hungry': {
                gesture:'happy', duration:1600, bubble:'I am hungry!',
                chat:'🍽️ Hungry command activated. I am hungry. Please feed me!',
                voice:'I am hungry. Please feed me!'
            },
            '/sleepy': {
                gesture:'sleep', duration:1800, bubble:'So sleepy...',
                chat:'🥱 Sleepy command activated. I feel sleepy.',
                voice:'I feel sleepy. Maybe I should rest soon.'
            },
            '/reset': {
                gesture:'happy', duration:1300, bubble:'Reset done!',
                chat:'🔄 Reset command activated. All gestures and voice commands are ready again.',
                voice:'Reset done! All commands are ready again!'
            }
        };

        function cleanForVoice(text){
            return String(text || '')
                .replace(/<[^>]*>/g, ' ')
                .replace(/[🦘🌀👏🎤🙇🎉🕺👋😴🌞👂🤖🙂🔎⚡✨😊😢🍽️🥱🔄]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function speakCommand(text){
            if(!text) return;
            if(typeof neiloCuteSpeak === 'function'){
                neiloCuteSpeak(cleanForVoice(text), { rate: 1.03, pitch: 1.72, volume: 0.92 });
                return;
            }
            if(!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(cleanForVoice(text));
            u.rate = 1.03;
            u.pitch = 1.72;
            u.volume = 0.92;
            window.speechSynthesis.speak(u);
        }

        function showBubble(text, ms){
            if(!bubble) return;
            bubble.textContent = text;
            toggle.classList.add('show-bubble');
            clearTimeout(toggle.__commandBubbleTimer);
            toggle.__commandBubbleTimer = setTimeout(() => toggle.classList.remove('show-bubble'), ms || 1500);
        }

        function addBotMessage(html){
            const div = document.createElement('div');
            div.className = 'message bot-message';
            div.innerHTML = html;
            messages.appendChild(div);
            messages.scrollTo({top: messages.scrollHeight, behavior:'smooth'});
        }

        function addUserMessage(text){
            const div = document.createElement('div');
            div.className = 'message user-message';
            div.textContent = text;
            messages.appendChild(div);
            messages.scrollTo({top: messages.scrollHeight, behavior:'smooth'});
        }

        function addMusicNotes(){
            for(let i = 0; i < 10; i++){
                setTimeout(() => {
                    const note = document.createElement('span');
                    note.className = 'music-note-float';
                    note.textContent = ['♪','♫','♬','♩'][i % 4];
                    note.style.setProperty('--x', `${(i - 4.5) * 13}px`);
                    toggle.appendChild(note);
                    setTimeout(() => note.remove(), 1150);
                }, i * 180);
            }
        }

        function addCheerSparks(){
            for(let i = 0; i < 18; i++){
                const spark = document.createElement('span');
                spark.className = 'clap-spark';
                const angle = (Math.PI * 2 / 18) * i;
                const distance = 25 + Math.random() * 32;
                spark.style.setProperty('--x', Math.cos(angle) * distance + 'px');
                spark.style.setProperty('--y', Math.sin(angle) * distance + 'px');
                toggle.appendChild(spark);
                setTimeout(() => spark.remove(), 750);
            }
        }

        function runCommand(cmd, fromButton){
            const data = commandMap[cmd];
            if(!data) return false;

            toggle.classList.remove(...gestureClasses);
            toggle.classList.add('gesture-' + data.gesture);
            if(cmd === '/sleep') toggle.classList.add('neilo-sleep-locked','neilo-emotion-sleepy');
            if(cmd === '/wake' || cmd === '/reset') toggle.classList.remove('neilo-sleep-locked','neilo-emotion-sleepy');
            if(data.gesture === 'sing') addMusicNotes();
            if(data.gesture === 'cheer' || data.gesture === 'clap') addCheerSparks();

            clearTimeout(toggle.__commandGestureTimer);
            toggle.__commandGestureTimer = setTimeout(() => {
                toggle.classList.remove(...gestureClasses);
                if(cmd !== '/sleep') toggle.classList.remove('neilo-sleep-locked');
            }, data.duration);

            showBubble(data.bubble, Math.min(data.duration, 2200));
            addBotMessage(data.chat);
            speakCommand(data.voice || data.chat);
            return true;
        }

        function normalizeCommand(value){
            const q = String(value || '').toLowerCase().trim();
            if(commandMap[q]) return q;
            if(q.includes('jump')) return '/jump';
            if(q.includes('spin')) return '/spin';
            if(q.includes('clap')) return '/clap';
            if(q.includes('sing') || q.includes('song')) return '/sing';
            if(q.includes('bow')) return '/bow';
            if(q.includes('cheer')) return '/cheer';
            if(q.includes('dance')) return '/dance';
            if(q.includes('wave')) return '/wave';
            if(q.includes('sleepy')) return '/sleepy';
            if(q.includes('sleep')) return '/sleep';
            if(q.includes('wake')) return '/wake';
            if(q.includes('listen')) return '/listen';
            if(q.includes('shake')) return '/shake';
            if(q.includes('nod')) return '/nod';
            if(q.includes('scan')) return '/scan';
            if(q.includes('power')) return '/powerup';
            if(q.includes('wiggle')) return '/wiggle';
            if(q.includes('happy')) return '/happy';
            if(q.includes('sad')) return '/sad';
            if(q.includes('hungry') || q.includes('food')) return '/hungry';
            if(q.includes('reset')) return '/reset';
            return '';
        }

        function handleCommandValue(value, fromButton){
            const cmd = normalizeCommand(value);
            if(!cmd) return false;
            if(!fromButton) addUserMessage(value);
            input.value = '';
            return runCommand(cmd, fromButton);
        }

        function ensureCommandPanel(){
            let panel = document.getElementById('chatCommandPanel');
            if(!panel){
                panel = document.createElement('div');
                panel.id = 'chatCommandPanel';
                panel.className = 'chat-command-panel';
                const inputArea = bot.querySelector('.chat-input-area');
                if(inputArea) bot.insertBefore(panel, inputArea);
            }
            panel.innerHTML = `
                <button type="button" data-cmd="/jump">🦘 Jump</button>
                <button type="button" data-cmd="/spin">🌀 Spin</button>
                <button type="button" data-cmd="/clap">👏 Clap</button>
                <button type="button" data-cmd="/sing">🎤 Sing</button>
                <button type="button" data-cmd="/bow">🙇 Bow</button>
                <button type="button" data-cmd="/cheer">🎉 Cheer</button>
                <button type="button" data-cmd="/dance">🕺 Dance</button>
                <button type="button" data-cmd="/wave">👋 Wave</button>
                <button type="button" data-cmd="/listen">👂 Listen</button>
                <button type="button" data-cmd="/shake">🤖 Shake</button>
                <button type="button" data-cmd="/nod">🙂 Nod</button>
                <button type="button" data-cmd="/scan">🔎 Scan</button>
                <button type="button" data-cmd="/powerup">⚡ Power</button>
                <button type="button" data-cmd="/wiggle">✨ Wiggle</button>
                <button type="button" data-cmd="/sleep">😴 Sleep</button>
                <button type="button" data-cmd="/wake">🌞 Wake</button>
                <button type="button" data-cmd="/reset">🔄 Reset</button>
            `;
        }

        ensureCommandPanel();

        document.addEventListener('click', function(e){
            const btn = e.target.closest && e.target.closest('#chatCommandPanel button[data-cmd]');
            if(!btn) return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            runCommand(btn.dataset.cmd, true);
        }, true);

        send?.addEventListener('click', function(e){
            const value = input.value.trim();
            if(!normalizeCommand(value)) return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            handleCommandValue(value, false);
        }, true);

        input.addEventListener('keydown', function(e){
            if(e.key !== 'Enter') return;
            const value = input.value.trim();
            if(!normalizeCommand(value)) return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            handleCommandValue(value, false);
        }, true);

        window.neiloRunCommand = function(command){
            const cmd = normalizeCommand(command);
            if(cmd) runCommand(cmd, true);
        };
    });
})();
