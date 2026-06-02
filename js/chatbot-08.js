(function(){
    function ready(fn){
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
        else fn();
    }

    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatToggle');
        const header = document.getElementById('chatbotHeader');
        if(!bot || !toggle) return;

        let avatar = {down:false, moved:false, id:null, ox:0, oy:0, sx:0, sy:0};
        let panel = {down:false, moved:false, id:null, ox:0, oy:0};
        const gap = () => window.innerWidth <= 560 ? 10 : 14;
        const isMobile = () => window.innerWidth <= 560;

        function clamp(v,min,max){ return Math.min(Math.max(v,min),max); }
        function fit(el,left,top){
            const g = gap();
            const r = el.getBoundingClientRect();
            const w = r.width || el.offsetWidth || 80;
            const h = r.height || el.offsetHeight || 80;
            return {
                left: clamp(left, g, Math.max(g, window.innerWidth - w - g)),
                top: clamp(top, g, Math.max(g, window.innerHeight - h - g))
            };
        }

        function removeDuplicateButtons(){
            const toolbar = document.getElementById('chatToolBar');
            if(toolbar){
                const seen = new Set();
                [...toolbar.querySelectorAll('button')].forEach(btn => {
                    const key = btn.id || btn.getAttribute('aria-label') || btn.title || btn.textContent.trim();
                    if(seen.has(key)) btn.remove(); else seen.add(key);
                });
            }
            const headerButtons = [...document.querySelectorAll('#chatbotHeader #closeChat')];
            headerButtons.slice(1).forEach(btn => btn.remove());
        }

        function placePanel(){
            if(!bot.classList.contains('open')) return;
            bot.classList.remove('chat-force-hidden');
            bot.style.display = 'flex';
            if(isMobile()){
                const h = Math.min(window.innerHeight * 0.72, 520);
                bot.style.width = 'calc(100vw - 20px)';
                bot.style.height = h + 'px';
                bot.style.left = '10px';
                bot.style.top = Math.max(10, window.innerHeight - h - 88) + 'px';
                bot.style.right = 'auto';
                bot.style.bottom = 'auto';
                bot.classList.add('avatar-positioned');
                return;
            }
            const ar = toggle.getBoundingClientRect();
            const br = bot.getBoundingClientRect();
            let left = ar.right - br.width;
            let top = ar.top - br.height - 14;
            if(top < gap()) top = ar.bottom + 14;
            const p = fit(bot,left,top);
            bot.style.left = p.left + 'px';
            bot.style.top = p.top + 'px';
            bot.style.right = 'auto';
            bot.style.bottom = 'auto';
            bot.classList.add('avatar-positioned');
        }

        function openPanel(){
            removeDuplicateButtons();
            bot.classList.remove('chat-force-hidden','closing');
            bot.style.display = 'flex';
            requestAnimationFrame(() => {
                bot.classList.add('open');
                toggle.setAttribute('aria-label','Close chatbot');
                placePanel();
                const input = document.getElementById('chatInput');
                setTimeout(() => input?.focus({preventScroll:true}), 120);
            });
        }

        function closePanel(){
            removeDuplicateButtons();
            bot.classList.add('closing');
            bot.classList.remove('open');
            toggle.setAttribute('aria-label','Open chatbot');
            neiloStopVoice();
            toggle.classList.remove('is-speaking');
            clearTimeout(bot.__closeTimer);
            bot.__closeTimer = setTimeout(() => {
                if(!bot.classList.contains('open')){
                    bot.classList.remove('closing');
                    bot.classList.add('chat-force-hidden');
                    bot.style.display = 'none';
                }
            }, 220);
        }

        function stop(e){
            e.preventDefault();
            e.stopPropagation();
            if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        }

        document.addEventListener('pointerdown', function(e){
            if(e.target.closest('#closeChat, #minimizeChatBtn')) stop(e);
        }, true);
        document.addEventListener('pointerup', function(e){
            if(e.target.closest('#closeChat, #minimizeChatBtn')){ stop(e); closePanel(); }
        }, true);
        document.addEventListener('click', function(e){
            if(e.target.closest('#closeChat, #minimizeChatBtn')){ stop(e); closePanel(); }
        }, true);

        toggle.addEventListener('pointerdown', function(e){
            if(e.button !== undefined && e.button !== 0) return;
            stop(e);
            avatar.down = true;
            avatar.moved = false;
            avatar.id = e.pointerId;
            avatar.sx = e.clientX;
            avatar.sy = e.clientY;
            const r = toggle.getBoundingClientRect();
            avatar.ox = e.clientX - r.left;
            avatar.oy = e.clientY - r.top;
            try{ toggle.setPointerCapture(e.pointerId); }catch(err){}
        }, true);

        toggle.addEventListener('pointermove', function(e){
            if(!avatar.down || avatar.id !== e.pointerId) return;
            const dist = Math.hypot(e.clientX - avatar.sx, e.clientY - avatar.sy);
            if(dist > 6) avatar.moved = true;
            if(!avatar.moved) return;
            stop(e);
            const p = fit(toggle, e.clientX - avatar.ox, e.clientY - avatar.oy);
            toggle.style.left = p.left + 'px';
            toggle.style.top = p.top + 'px';
            toggle.style.right = 'auto';
            toggle.style.bottom = 'auto';
            toggle.classList.add('is-dragging','pet-dragging');
            placePanel();
        }, true);

        function endAvatar(e){
            if(!avatar.down || (e && avatar.id !== e.pointerId)) return;
            stop(e);
            try{ toggle.releasePointerCapture(avatar.id); }catch(err){}
            toggle.classList.remove('is-dragging','pet-dragging');
            const wasMoved = avatar.moved;
            avatar.down = false;
            avatar.id = null;
            avatar.moved = false;
            if(!wasMoved){
                if(bot.classList.contains('open')) closePanel(); else openPanel();
            }
        }
        toggle.addEventListener('pointerup', endAvatar, true);
        toggle.addEventListener('pointercancel', endAvatar, true);

        header?.addEventListener('pointerdown', function(e){
            if(e.target.closest('button, input, #closeChat, #chatToolBar')) return;
            if(isMobile()) return;
            stop(e);
            panel.down = true;
            panel.moved = false;
            panel.id = e.pointerId;
            const r = bot.getBoundingClientRect();
            panel.ox = e.clientX - r.left;
            panel.oy = e.clientY - r.top;
            try{ header.setPointerCapture(e.pointerId); }catch(err){}
        }, true);

        header?.addEventListener('pointermove', function(e){
            if(!panel.down || panel.id !== e.pointerId) return;
            stop(e);
            panel.moved = true;
            const p = fit(bot, e.clientX - panel.ox, e.clientY - panel.oy);
            bot.style.left = p.left + 'px';
            bot.style.top = p.top + 'px';
            bot.style.right = 'auto';
            bot.style.bottom = 'auto';
            bot.classList.add('avatar-positioned');
        }, true);

        function endPanel(e){
            if(!panel.down || (e && panel.id !== e.pointerId)) return;
            stop(e);
            try{ header?.releasePointerCapture(panel.id); }catch(err){}
            panel.down = false;
            panel.id = null;
            panel.moved = false;
        }
        header?.addEventListener('pointerup', endPanel, true);
        header?.addEventListener('pointercancel', endPanel, true);

        document.addEventListener('keydown', function(e){
            if(e.key === 'Escape' && bot.classList.contains('open')) closePanel();
        }, true);

        window.addEventListener('resize', function(){
            const tr = toggle.getBoundingClientRect();
            const tp = fit(toggle, tr.left, tr.top);
            toggle.style.left = tp.left + 'px';
            toggle.style.top = tp.top + 'px';
            toggle.style.right = 'auto';
            toggle.style.bottom = 'auto';
            placePanel();
        }, {passive:true});

        new MutationObserver(removeDuplicateButtons).observe(header || bot, {childList:true, subtree:true});
        removeDuplicateButtons();
    });
})();
