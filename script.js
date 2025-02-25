document.addEventListener('DOMContentLoaded', () => {
    const spreads = document.querySelectorAll('.book-spread');
    let currentSpread = 0;
    let isAnimating = false;

    // Initiera sidinnehåll
    gsap.set('.book-spread:not(.active)', { opacity: 0, display: 'none' });
    gsap.set('.page-content', { opacity: 0, y: 20 });
    gsap.to('.active .page-content', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' });

    // Pilar hover animationer
    const arrows = document.querySelectorAll('.nav-arrow');
    arrows.forEach(arrow => {
        arrow.addEventListener('mouseenter', () => {
            anime({
                targets: arrow,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutElastic(1, .8)'
            });
        });

        arrow.addEventListener('mouseleave', () => {
            anime({
                targets: arrow,
                scale: 1,
                duration: 300,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    });

    // Navigeringsfunktion med animationer
    function navigate(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const currentElement = spreads[currentSpread];
        let nextSpread;

        switch(direction) {
            case 'left':
            case 'up':
                nextSpread = Math.max(0, currentSpread - 1);
                break;
            case 'right':
            case 'down':
                nextSpread = Math.min(spreads.length - 1, currentSpread + 1);
                break;
        }

        if (nextSpread === currentSpread) {
            isAnimating = false;
            return;
        }

        const nextElement = spreads[nextSpread];
        const slideDirection = direction === 'left' || direction === 'up' ? 1 : -1;
        const timeline = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
            }
        });

        // Förbered nästa spridning
        gsap.set(nextElement, { display: 'flex' });

        // Animera ut aktuell spridning
        timeline.to(currentElement.querySelectorAll('.page-content'), {
            opacity: 0,
            y: -20 * slideDirection,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.in'
        })
        .to(currentElement, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
                currentElement.classList.remove('active');
                gsap.set(currentElement, { display: 'none' });
            }
        })
        // Animera in nästa spridning
        .add(() => {
            nextElement.classList.add('active');
            gsap.set(nextElement.querySelectorAll('.page-content'), { y: 20 * slideDirection, opacity: 0 });
        })
        .to(nextElement, {
            opacity: 1,
            duration: 0.4
        })
        .to(nextElement.querySelectorAll('.page-content'), {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        });

        currentSpread = nextSpread;
    }

    // Grid animation på sidinladdning
    anime({
        targets: '.book-column::after',
        opacity: [0, 0.1],
        duration: 1000,
        easing: 'easeOutQuad'
    });

    // Textinnehåll hover-effekt
    document.querySelectorAll('.text-content').forEach(content => {
        content.addEventListener('mouseenter', () => {
            gsap.to(content, {
                backgroundColor: 'rgba(132, 118, 80, 0.05)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        content.addEventListener('mouseleave', () => {
            gsap.to(content, {
                backgroundColor: 'transparent',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Lägg till klickhändelsehanterare till navigeringspilar
    document.querySelectorAll('.nav-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const direction = arrow.getAttribute('data-direction');
            navigate(direction);
        });
    });

    // Lägg till tangentbordsnavigering
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                navigate('left');
                break;
            case 'ArrowRight':
                navigate('right');
                break;
            case 'ArrowUp':
                navigate('up');
                break;
            case 'ArrowDown':
                navigate('down');
                break;
        }
    });

    // Index overlay-funktionalitet
    const indexLink = document.querySelector('.index-link');
    const indexOverlay = document.querySelector('.index-overlay');
    const closeOverlay = document.querySelector('.close-overlay');
    const indexItems = document.querySelectorAll('.index-item');

    // GSAP-tidslinje för overlay-animation
    const overlayTimeline = gsap.timeline({ paused: true });
    overlayTimeline
        .to(indexOverlay, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            onStart: () => {
                indexOverlay.classList.add('active');
            }
        })
        .from('.index-item', {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2');

    // Öppna overlay
    indexLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        overlayTimeline.play();
    });

    // Stäng overlay
    closeOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        overlayTimeline.reverse().eventCallback('onReverseComplete', () => {
            indexOverlay.classList.remove('active');
        });
    });

    // Hantera indexobjektklick
    indexItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const spreadIndex = parseInt(item.dataset.spread);
            showSpread(spreadIndex);
            overlayTimeline.reverse().eventCallback('onReverseComplete', () => {
                indexOverlay.classList.remove('active');
            });
        });
    });

    // Info overlay-funktionalitet
    const infoLink = document.querySelector('.info-link');
    const infoOverlay = document.querySelector('.info-overlay');
    const infoContent = document.querySelector('.info-content');

    // Tidslinje för att öppna overlay
    const openTimeline = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
            infoOverlay.style.visibility = 'hidden';
        }
    });

    openTimeline
        .set(infoOverlay, { visibility: 'visible' })
        .to(infoOverlay, { 
            opacity: 1, 
            duration: 0.5, 
            ease: "power2.inOut" 
        })
        .to(infoContent, { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            ease: "power2.out" 
        }, "-=0.3");

    // Växla overlay
    infoLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (infoOverlay.style.visibility === 'visible') {
            openTimeline.reverse();
        } else {
            openTimeline.play();
        }
    });

    // Stäng overlay när man klickar utanför innehåll
    infoOverlay.addEventListener('click', (e) => {
        if (e.target === infoOverlay) {
            openTimeline.reverse();
        }
    });

    // Stäng overlay med esc-tangenten
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && infoOverlay.style.visibility === 'visible') {
            openTimeline.reverse();
        }
    });

    // Skuggfärgsrandomisering
    const colors = ['#2F398A', '#005C32', '#847650', '#000'];

    function getRandomColor(excludeColor) {
        let availableColors = colors.filter(color => color !== excludeColor);
        return availableColors[Math.floor(Math.random() * availableColors.length)];
    }

    function updateShadowColors() {
        const leftPages = document.querySelectorAll('.left-page');
        const rightPages = document.querySelectorAll('.right-page');
        
        leftPages.forEach(page => {
            const leftColor = getRandomColor();
            const rightColor = getRandomColor(leftColor); // Se till att det är en annan färg
            
            page.style.boxShadow = `inset -10px 0 20px ${leftColor}`;
            const rightPage = page.nextElementSibling;
            if (rightPage && rightPage.classList.contains('right-page')) {
                rightPage.style.boxShadow = `inset 10px 0 20px ${rightColor}`;
            }
        });
    }

    // Kör på sidinladdning
    updateShadowColors();

    function showSpread(index) {
        // Ta bort aktuell spridnings aktiv klass
        spreads[currentSpread].classList.remove('active');
        
        // Uppdatera aktuell spridning och lägg till aktiv klass
        currentSpread = index;
        spreads[currentSpread].classList.add('active');
        
        // Uppdatera skuggfärger när man byter spridning
        updateShadowColors();
    }

    // Navigeringspilfunktionalitet
    document.querySelectorAll('.nav-arrow').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const direction = arrow.dataset.direction;
            
            switch(direction) {
                case 'left':
                    if (currentSpread > 0) showSpread(currentSpread - 1);
                    break;
                case 'right':
                    if (currentSpread < spreads.length - 1) showSpread(currentSpread + 1);
                    break;
            }
        });
    });

    // Hantera TOC-klick
    document.querySelectorAll('.toc-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSpread = parseInt(this.dataset.spread);
            showSpread(targetSpread);
        });
    });
});
