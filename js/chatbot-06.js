/* ===== CHATBOT STABILITY PATCH: no avatar layout changes ===== */
(function(){
    function ready(fn){
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {once:true});
        else fn();
    }

    ready(function(){
        const bot = document.getElementById('chatbotContainer');
        const header = document.getElementById('chatbotHeader');
        const close = document.getElementById('closeChat');
        const toolbar = document.getElementById('chatToolBar');

        if(toolbar){
            const seen = new Set();
            [...toolbar.querySelectorAll('button')].forEach(btn => {
                const key = btn.id || btn.getAttribute('aria-label') || btn.innerHTML;
                if(seen.has(key)) btn.remove();
                else seen.add(key);
            });
        }

        if(close && bot){
            close.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                bot.classList.add('closing');
                bot.classList.remove('open');
                setTimeout(function(){
                    bot.classList.remove('closing');
                }, 260);
                const toggle = document.getElementById('chatToggle');
                if(toggle) toggle.setAttribute('aria-label', 'Open chatbot');
                neiloStopVoice();
            }, true);

            close.addEventListener('pointerdown', function(e){
                e.stopPropagation();
            }, true);
        }

        if(header){
            header.addEventListener('click', function(e){
                if(e.target.closest('button, #closeChat, #chatToolBar')) e.stopPropagation();
            }, true);
        }
    });
})();
