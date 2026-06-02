/* ===== RESPONSIVE CHATBOT BEHAVIOR PATCH: stable close, drag, resize ===== */
(function(){
    function ready(fn){
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
        else fn();
    }

    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatToggle');
        const header = document.getElementById('chatbotHeader');
        const close = document.getElementById('closeChat');
        const input = document.getElementById('chatInput');
        const send = document.getElementById('sendChatBtn');
        const messages = document.getElementById('chatMessages');
        if(!bot || !toggle) return;

        const state = {
            avatarDragging:false,
            avatarMoved:false,
            avatarPointer:null,
            avatarOffsetX:0,
            avatarOffsetY:0,
            botDragging:false,
            botMoved:false,
            botPointer:null,
            botOffsetX:0,
            botOffsetY:0
        };

        function clamp(n,min,max){ return Math.min(Math.max(n,min),max); }

        function safeArea(){
            const gap = window.innerWidth <= 560 ? 10 : 14;
            return {gap, w:window.innerWidth, h:window.innerHeight};
        }

        function keepInView(el, left, top){
            const {gap,w,h} = safeArea();
            const rect = el.getBoundingClientRect();
            const width = rect.width || el.offsetWidth || 80;
            const height = rect.height || el.offsetHeight || 80;
            return {
                left: clamp(left, gap, Math.max(gap, w - width - gap)),
                top: clamp(top, gap, Math.max(gap, h - height - gap))
            };
        }

        function placeBotNearAvatar(){
            if(!bot.classList.contains('open')) return;
            const avatar = toggle.getBoundingClientRect();
            const b = bot.getBoundingClientRect();
            let left;
            let top;

            if(window.innerWidth <= 560){
                left = 10;
                top = Math.max(10, window.innerHeight - b.height - 86);
            }else{
                left = avatar.left - b.width + avatar.width;
                top = avatar.top - b.height - 14;
                if(top < 14) top = avatar.bottom + 14;
                if(left < 14) left = 14;
            }

            const pos = keepInView(bot, left, top);
            bot.style.left = pos.left + 'px';
            bot.style.top = pos.top + 'px';
            bot.style.right = 'auto';
            bot.style.bottom = 'auto';
            bot.classList.add('avatar-positioned');
        }

        function openBot(){
            bot.style.display = 'flex';
            requestAnimationFrame(() => {
                bot.classList.add('open');
                bot.classList.remove('closing');
                placeBotNearAvatar();
                toggle.setAttribute('aria-label','Close chatbot');
                setTimeout(() => input?.focus({preventScroll:true}), 180);
            });
        }

        function closeBot(){
            bot.classList.add('closing');
            bot.classList.remove('open');
            toggle.setAttribute('aria-label','Open chatbot');
            neiloStopVoice();
            setTimeout(() => {
                bot.classList.remove('closing');
                if(!bot.classList.contains('open')) bot.style.display = 'none';
            }, 260);
        }

        // Capture close with highest priority to prevent old handlers from reopening or blocking it.
        close?.addEventListener('pointerdown', e => {
            e.preventDefault();
            e.stopPropagation();
        }, true);
        close?.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            closeBot();
        }, true);

        toggle.addEventListener('pointerdown', e => {
            if(e.button !== undefined && e.button !== 0) return;
            state.avatarDragging = true;
            state.avatarMoved = false;
            state.avatarPointer = e.pointerId;
            const rect = toggle.getBoundingClientRect();
            state.avatarOffsetX = e.clientX - rect.left;
            state.avatarOffsetY = e.clientY - rect.top;
            toggle.setPointerCapture?.(e.pointerId);
        }, true);

        toggle.addEventListener('pointermove', e => {
            if(!state.avatarDragging || state.avatarPointer !== e.pointerId) return;
            const dx = Math.abs(e.movementX || 0);
            const dy = Math.abs(e.movementY || 0);
            if(dx + dy > 1) state.avatarMoved = true;
            if(!state.avatarMoved) return;
            e.preventDefault();
            const pos = keepInView(toggle, e.clientX - state.avatarOffsetX, e.clientY - state.avatarOffsetY);
            toggle.style.left = pos.left + 'px';
            toggle.style.top = pos.top + 'px';
            toggle.style.right = 'auto';
            toggle.style.bottom = 'auto';
            toggle.classList.add('is-dragging');
            placeBotNearAvatar();
        }, {capture:true, passive:false});

        function endAvatarDrag(e){
            if(!state.avatarDragging || (e && state.avatarPointer !== e.pointerId)) return;
            try{ toggle.releasePointerCapture?.(state.avatarPointer); }catch(err){}
            toggle.classList.remove('is-dragging');
            const moved = state.avatarMoved;
            state.avatarDragging = false;
            state.avatarPointer = null;
            setTimeout(() => { state.avatarMoved = false; }, 80);
            if(!moved){
                if(bot.classList.contains('open')) closeBot();
                else openBot();
            }
        }
        toggle.addEventListener('pointerup', endAvatarDrag, true);
        toggle.addEventListener('pointercancel', endAvatarDrag, true);

        header?.addEventListener('pointerdown', e => {
            if(e.target.closest('button, input, #closeChat, #chatToolBar')) return;
            if(window.innerWidth <= 560) return;
            state.botDragging = true;
            state.botMoved = false;
            state.botPointer = e.pointerId;
            const rect = bot.getBoundingClientRect();
            state.botOffsetX = e.clientX - rect.left;
            state.botOffsetY = e.clientY - rect.top;
            header.setPointerCapture?.(e.pointerId);
        }, true);

        header?.addEventListener('pointermove', e => {
            if(!state.botDragging || state.botPointer !== e.pointerId) return;
            state.botMoved = true;
            e.preventDefault();
            const pos = keepInView(bot, e.clientX - state.botOffsetX, e.clientY - state.botOffsetY);
            bot.style.left = pos.left + 'px';
            bot.style.top = pos.top + 'px';
            bot.style.right = 'auto';
            bot.style.bottom = 'auto';
            bot.classList.add('avatar-positioned');
        }, {capture:true, passive:false});

        function endBotDrag(e){
            if(!state.botDragging || (e && state.botPointer !== e.pointerId)) return;
            try{ header?.releasePointerCapture?.(state.botPointer); }catch(err){}
            state.botDragging = false;
            state.botPointer = null;
            setTimeout(() => { state.botMoved = false; }, 80);
        }
        header?.addEventListener('pointerup', endBotDrag, true);
        header?.addEventListener('pointercancel', endBotDrag, true);

        function sendMessage(){
            const value = input?.value.trim();
            if(!value) return;
            if(typeof window.sendChatMessage === 'function'){
                window.sendChatMessage();
                return;
            }
            const user = document.createElement('div');
            user.className = 'message user-message';
            user.textContent = value;
            messages?.appendChild(user);
            input.value = '';
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot-message';
            botMsg.textContent = 'Thanks for your message. You can ask me about Neil’s skills, projects, certificates, or contact information.';
            setTimeout(() => {
                messages?.appendChild(botMsg);
                messages?.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
            }, 250);
            messages?.scrollTo({top:messages.scrollHeight, behavior:'smooth'});
        }

        send?.addEventListener('click', e => {
            e.preventDefault();
            sendMessage();
        });
        input?.addEventListener('keydown', e => {
            if(e.key === 'Enter'){
                e.preventDefault();
                sendMessage();
            }
        });

        window.addEventListener('resize', () => {
            const t = toggle.getBoundingClientRect();
            const tp = keepInView(toggle, t.left, t.top);
            toggle.style.left = tp.left + 'px';
            toggle.style.top = tp.top + 'px';
            toggle.style.right = 'auto';
            toggle.style.bottom = 'auto';
            placeBotNearAvatar();
        }, {passive:true});

        document.addEventListener('keydown', e => {
            if(e.key === 'Escape' && bot.classList.contains('open')) closeBot();
        });

        // Initial safe placement on small screens while preserving the existing avatar design.
        setTimeout(() => {
            const rect = toggle.getBoundingClientRect();
            if(rect.left < 0 || rect.top < 0 || rect.right > window.innerWidth || rect.bottom > window.innerHeight){
                const pos = keepInView(toggle, window.innerWidth - rect.width - 16, window.innerHeight - rect.height - 16);
                toggle.style.left = pos.left + 'px';
                toggle.style.top = pos.top + 'px';
                toggle.style.right = 'auto';
                toggle.style.bottom = 'auto';
            }
        }, 200);
    });
})();
