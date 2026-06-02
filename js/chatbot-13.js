(function(){
    function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true}); else fn(); }
    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatToggle');
        const messages = document.getElementById('chatMessages');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('sendChatBtn');
        const bubble = document.getElementById('petSpeechBubble');
        if(!bot || !toggle || !messages || !input) return;

        let neiloSleeping = false;
        let neiloMood = 'happy';
        const emotionClasses = ['neilo-emotion-happy','neilo-emotion-sad','neilo-emotion-hungry','neilo-emotion-sleepy'];

        function setBubble(text, ms=1500){
            if(!bubble) return;
            bubble.textContent = text;
            toggle.classList.add('show-bubble');
            clearTimeout(toggle.__neiloBubbleTimer);
            toggle.__neiloBubbleTimer = setTimeout(()=>toggle.classList.remove('show-bubble'), ms);
        }

        function speakNeilo(text){
            neiloCuteSpeak(text, { rate: 1.08, pitch: 1.66, volume: 0.86 });
        }

        function addNeiloMessage(text){
            const div = document.createElement('div');
            div.className = 'message bot-message';
            div.innerHTML = text;
            messages.appendChild(div);
            messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
        }

        function setMood(mood, text, emoji){
            neiloMood = mood;
            toggle.classList.remove(...emotionClasses);
            toggle.classList.add('neilo-emotion-' + mood);
            const tray = document.getElementById('neiloCareTray');
            const needsCare = mood === 'hungry' || mood === 'thirsty';
            if(tray) tray.classList.toggle('neilo-care-visible', needsCare);
            toggle.classList.toggle('neilo-needs-care', needsCare);
            updateStatus(emoji + ' ' + mood.charAt(0).toUpperCase() + mood.slice(1));
            if(text){
                addNeiloMessage(text);
                setBubble(text.replace(/<[^>]+>/g,'').slice(0,34), 1700);
                speakNeilo(text);
            }
        }

        function updateStatus(label){
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

        function sleepNeilo(){
            neiloSleeping = true;
            toggle.classList.add('neilo-sleep-locked','gesture-sleep');
            setMood('sleepy', '', '😴');
            addNeiloMessage('😴 I am sleepy now. I will stay asleep until you click the robot avatar to wake me up.');
            setBubble('Zzz... click to wake me', 2400);
            speakNeilo('I am sleepy. Click me to wake me up.');
        }

        function wakeNeilo(){
            neiloSleeping = false;
            toggle.classList.remove('neilo-sleep-locked','gesture-sleep');
            setMood('happy', '🌞 Wakey wakey! I am awake again. Try /sad, /hungry, /sleepy, or /sleep.', '😊');
            toggle.classList.add('gesture-happy');
            setTimeout(()=>toggle.classList.remove('gesture-happy'), 1300);
        }

        function handleNeiloCommand(value, fromButton=false){
            const q = String(value || '').toLowerCase().trim();

            if(neiloSleeping){
                if(q.includes('/wake') || q.includes('wake')){
                    wakeNeilo();
                }else{
                    addNeiloMessage('💤 Neilo is sleeping and cannot answer yet. Click the robot avatar or type /wake.');
                    setBubble('Still sleeping... 💤', 1300);
                }
                return true;
            }

            if(q.includes('/sleep') || q === 'sleep' || q.includes('go to sleep') || q.includes('take a rest')){
                sleepNeilo();
                return true;
            }
            if(q.includes('/wake') || q.includes('wake up')){
                wakeNeilo();
                return true;
            }
            if(q.includes('/sad') || q.includes('sad') || q.includes('cry')){
                setMood('sad', '😢 Neilo feels sad. A little encouragement or a kind click will make me happy again.', '😢');
                return true;
            }
            if(q.includes('/hungry') || q.includes('hungry') || q.includes('eat') || q.includes('food')){
                setMood('hungry', '🍽️ Neilo is hungry. Food and water are now visible—drag the food to my avatar or click it!', '🍽️');
                return true;
            }
            if(q.includes('/sleepy') || q.includes('sleepy') || q.includes('tired')){
                setMood('sleepy', '🥱 Neilo feels sleepy. Type /sleep if you want me to really sleep.', '🥱');
                return true;
            }
            if(q.includes('/happy') || q.includes('happy') || q.includes('smile')){
                setMood('happy', '😊 Neilo is happy and ready to help!', '😊');
                return true;
            }
            if(q.includes('/help') || q.includes('commands')){
                addNeiloMessage('🤖 <b>Neilo Commands:</b> /sleep, /wake, /happy, /sad, /hungry, /sleepy, /wave, /dance, /listen, /skills, /projects, /certificates, /contact, /clear, /voice.');
                return false;
            }
            return false;
        }

        updateStatus('😊 Happy');
        toggle.classList.add('neilo-emotion-happy');

        const commandPanel = document.getElementById('chatCommandPanel');
        if(commandPanel && !commandPanel.dataset.neiloEnhanced){
            commandPanel.dataset.neiloEnhanced = 'true';
            const extra = [
                ['😴 Sleep','/sleep'],
                ['🌞 Wake','/wake'],
                ['😊 Happy','/happy'],
                ['😢 Sad','/sad'],
                ['🍽️ Hungry','/hungry'],
                ['🥱 Sleepy','/sleepy'],
                ['🤖 Shake','/shake'],
                ['🙂 Nod','/nod'],
                ['🔎 Scan','/scan'],
                ['⚡ Power','/powerup'],
                ['✨ Wiggle','/wiggle']
            ];
            extra.reverse().forEach(([label, cmd])=>{
                if(!commandPanel.querySelector('[data-cmd="'+cmd+'"]')){
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.dataset.cmd = cmd;
                    b.textContent = label;
                    commandPanel.insertBefore(b, commandPanel.firstChild);
                }
            });
        }

        bot.addEventListener('click', function(e){
            const btn = e.target.closest('button[data-cmd]');
            if(!btn) return;
            const cmd = btn.dataset.cmd || '';
            if(['/sleep','/wake','/happy','/sad','/hungry','/sleepy'].includes(cmd)){
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                input.value = '';
                handleNeiloCommand(cmd, true);
            }
        }, true);

        send?.addEventListener('click', function(e){
            const value = input.value.trim();
            if(!value) return;
            if(handleNeiloCommand(value)){
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const user = document.createElement('div');
                user.className = 'message user-message';
                user.textContent = value;
                messages.appendChild(user);
                messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
                input.value = '';
            }
        }, true);

        input.addEventListener('keydown', function(e){
            if(e.key !== 'Enter') return;
            const value = input.value.trim();
            if(!value) return;
            if(handleNeiloCommand(value)){
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                const user = document.createElement('div');
                user.className = 'message user-message';
                user.textContent = value;
                messages.appendChild(user);
                messages.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
                input.value = '';
            }
        }, true);

        toggle.addEventListener('click', function(e){
            if(neiloSleeping){
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                wakeNeilo();
                return;
            }
            if(neiloMood === 'sad'){
                setMood('happy', '😊 Thank you for checking on Neilo. I feel better now!', '😊');
            }
        }, true);

        setInterval(function(){
            if(neiloSleeping){
                toggle.classList.add('neilo-sleep-locked','gesture-sleep','neilo-emotion-sleepy');
                setBubble('Zzz...', 900);
            }
        }, 900);
    });
})();
