(function(){
    function ready(fn){
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
        else fn();
    }

    ready(function(){
        const toggle = document.getElementById('chatToggle');
        const messages = document.getElementById('chatMessages');
        const bubble = document.getElementById('petSpeechBubble');
        if(!toggle) return;

        const sleepClasses = ['neilo-sleep-locked','gesture-sleep','neilo-emotion-sleepy'];
        const happyClasses = ['neilo-emotion-happy','gesture-happy'];
        const emotionClasses = [
            'neilo-emotion-sad',
            'neilo-emotion-hungry',
            'neilo-emotion-sleepy',
            'neilo-emotion-thirsty'
        ];

        function isNeiloSleeping(){
            return toggle.classList.contains('neilo-sleep-locked') ||
                   toggle.classList.contains('gesture-sleep') ||
                   toggle.classList.contains('neilo-emotion-sleepy');
        }

        function addWakeMessage(){
            if(!messages) return;
            const last = messages.lastElementChild;
            const wakeText = '🌞 Wakey wakey! I am awake again.';
            if(last && last.textContent && last.textContent.includes('Wakey wakey')) return;

            const div = document.createElement('div');
            div.className = 'message bot-message';
            div.innerHTML = wakeText;
            messages.appendChild(div);
            messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        }

        function setWakeBubble(){
            if(!bubble) return;
            bubble.textContent = 'Wakey wakey! 🌞';
            toggle.classList.add('show-bubble');
            clearTimeout(toggle.__finalWakeBubbleTimer);
            toggle.__finalWakeBubbleTimer = setTimeout(function(){
                toggle.classList.remove('show-bubble');
            }, 1600);
        }

        function speakWake(){
            const text = 'Wakey wakey! I am awake again.';
            if(typeof window.neiloCuteSpeak === 'function'){
                window.neiloCuteSpeak(text, { rate: 1.05, pitch: 1.7, volume: 0.9 });
                return;
            }
            if('speechSynthesis' in window){
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.05;
                utterance.pitch = 1.7;
                utterance.volume = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }

        function forceWakeNeilo(){
            if(!isNeiloSleeping()) return false;

            toggle.classList.remove(...sleepClasses, ...emotionClasses);
            toggle.classList.add(...happyClasses);
            toggle.dataset.neiloAwake = 'true';
            toggle.dataset.neiloSleeping = 'false';

            const tray = document.getElementById('neiloCareTray');
            if(tray) tray.classList.remove('neilo-care-visible');
            toggle.classList.remove('neilo-needs-care');

            const headerTitle = document.querySelector('#chatbotContainer .chatbot-header h4');
            if(headerTitle){
                let pill = headerTitle.querySelector('.neilo-status-pill');
                if(!pill){
                    pill = document.createElement('span');
                    pill.className = 'neilo-status-pill';
                    headerTitle.appendChild(pill);
                }
                pill.textContent = '😊 Happy';
            }

            addWakeMessage();
            setWakeBubble();
            speakWake();

            clearTimeout(toggle.__finalWakeGestureTimer);
            toggle.__finalWakeGestureTimer = setTimeout(function(){
                toggle.classList.remove('gesture-happy');
            }, 1400);

            return true;
        }

        // Wakes Neilo from both the avatar button and any clicked part inside the avatar.
        ['pointerdown','click','touchstart'].forEach(function(eventName){
            document.addEventListener(eventName, function(e){
                const clickedAvatar = e.target.closest && e.target.closest('#chatToggle');
                if(!clickedAvatar) return;
                forceWakeNeilo();
            }, true);
        });

        // Make command-based /wake use the same reliable wake behavior.
        const originalRunCommand = window.neiloRunCommand;
        window.neiloRunCommand = function(command){
            const value = String(command || '').toLowerCase().trim();
            if(value === '/wake' || value === 'wake' || value.includes('wake up')){
                forceWakeNeilo();
                return;
            }
            if(typeof originalRunCommand === 'function') originalRunCommand(command);
        };
    });
})();
