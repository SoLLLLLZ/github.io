// ============================================
// CYBERPUNK SIDEBAR - Enhanced Navigation
// ============================================
// Add this script to all your HTML pages

(function() {
    'use strict';

    // ============================================
    // SIDEBAR HOVER EXPAND/COLLAPSE
    // ============================================
    const sideNav = document.getElementById('sideNav');
    const toggleBtn = document.getElementById('toggleBtn');
    let expandTimeout;
    let collapseTimeout;

    // Auto-collapse sidebar on page load
    function initializeSidebar() {
        // Start collapsed by default
        if (!sideNav.classList.contains('collapsed')) {
            sideNav.classList.add('collapsed');
        }
        document.body.classList.add('sidebar-collapsed');
    }

    // Expand sidebar on hover
    function expandSidebar() {
        clearTimeout(collapseTimeout);
        expandTimeout = setTimeout(() => {
            sideNav.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
        }, 200); // Small delay before expanding
    }

    // Collapse sidebar when mouse leaves
    function collapseSidebar() {
        clearTimeout(expandTimeout);
        collapseTimeout = setTimeout(() => {
            sideNav.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        }, 300); // Delay before collapsing
    }

    // Event listeners for hover
    if (sideNav) {
        sideNav.addEventListener('mouseenter', expandSidebar);
        sideNav.addEventListener('mouseleave', collapseSidebar);
    }

    // Toggle button functionality (manual override)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sideNav.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
            
            // Clear any pending hover timeouts
            clearTimeout(expandTimeout);
            clearTimeout(collapseTimeout);
        });
    }

    // ============================================
    // ICON GLITCH EFFECTS
    // ============================================
    const navIcons = document.querySelectorAll('.nav-icon');
    
    function createGlitchEffect(icon) {
        const glitchCount = 8; // Number of glitch frames
        let glitchIndex = 0;
        
        const glitchInterval = setInterval(() => {
            if (glitchIndex >= glitchCount) {
                // Reset icon
                icon.style.transform = '';
                icon.style.filter = '';
                icon.style.boxShadow = '';
                clearInterval(glitchInterval);
                return;
            }

            // Random glitch transformations
            const translateX = (Math.random() - 0.5) * 8;
            const translateY = (Math.random() - 0.5) * 8;
            const rotate = (Math.random() - 0.5) * 10;
            const scale = 0.95 + Math.random() * 0.1;

            // Random color shifts
            const hueRotate = Math.random() * 360;
            const brightness = 0.8 + Math.random() * 0.4;

            // Apply glitch
            icon.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`;
            icon.style.filter = `hue-rotate(${hueRotate}deg) brightness(${brightness})`;
            
            // Random glow colors
            const glowColors = [
                '0 0 20px rgba(0, 255, 255, 0.8)',
                '0 0 20px rgba(255, 0, 255, 0.8)',
                '0 0 20px rgba(255, 107, 0, 0.8)',
                '0 0 20px rgba(0, 255, 170, 0.8)'
            ];
            icon.style.boxShadow = glowColors[Math.floor(Math.random() * glowColors.length)];

            glitchIndex++;
        }, 50); // Glitch frame duration
    }

    // Add glitch effect on icon hover
    navIcons.forEach(icon => {
        let isGlitching = false;

        icon.addEventListener('mouseenter', function() {
            if (!isGlitching) {
                isGlitching = true;
                createGlitchEffect(this);
                
                // Reset glitching flag after effect completes
                setTimeout(() => {
                    isGlitching = false;
                }, 400); // Match glitch duration
            }
        });
    });

    // ============================================
    // NAV TAB CLICK GLITCH
    // ============================================
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            const icon = this.querySelector('.nav-icon');
            
            // Intense glitch on click
            icon.style.transition = 'none';
            
            // Create rapid glitch burst
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const translateX = (Math.random() - 0.5) * 15;
                    const translateY = (Math.random() - 0.5) * 15;
                    
                    icon.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.2)`;
                    icon.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                }, i * 30);
            }
            
            // Reset after glitch
            setTimeout(() => {
                icon.style.transition = '';
                icon.style.transform = '';
                icon.style.filter = '';
            }, 150);
        });
    });

    // ============================================
    // SET ACTIVE PAGE
    // ============================================
    const currentPage = document.body.getAttribute('data-current-page');
    if (currentPage) {
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-page') === currentPage) {
                tab.classList.add('active');
            }
        });
    }

    // ============================================
    // RESPONSIVE BEHAVIOR
    // ============================================
    function handleResize() {
        if (window.innerWidth <= 768) {
            // Mobile: Remove hover events, use click only
            sideNav.removeEventListener('mouseenter', expandSidebar);
            sideNav.removeEventListener('mouseleave', collapseSidebar);
            
            // Ensure sidebar is collapsed on mobile
            sideNav.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        } else {
            // Desktop: Re-add hover events
            sideNav.addEventListener('mouseenter', expandSidebar);
            sideNav.addEventListener('mouseleave', collapseSidebar);
        }
    }

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });

    // ============================================
    // MOBILE SIDEBAR TOGGLE
    // ============================================
    function handleMobileToggle() {
        if (window.innerWidth <= 768) {
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    sideNav.classList.toggle('mobile-open');
                });
            }

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    if (sideNav.classList.contains('mobile-open') && 
                        !sideNav.contains(e.target) && 
                        !toggleBtn.contains(e.target)) {
                        sideNav.classList.remove('mobile-open');
                    }
                }
            });
        }
    }

    // ============================================
    // SCANLINE GLITCH EFFECT
    // ============================================
    const scanlines = document.querySelector('.scanlines');
    
    function randomScanlineGlitch() {
        if (scanlines && Math.random() < 0.15) {
            scanlines.style.opacity = Math.random() * 0.5 + 0.1;
            setTimeout(() => {
                scanlines.style.opacity = '0.3';
            }, 100);
        }
    }

    // Random scanline glitches
    setInterval(randomScanlineGlitch, 1500);

    // ============================================
    // GLOBAL GLITCH OVERLAY
    // ============================================
    const glitchOverlay = document.getElementById('glitchOverlay');
    
    function triggerGlobalGlitch() {
        if (glitchOverlay) {
            glitchOverlay.classList.add('active');
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
            }, 300);

            // Occasionally glitch section titles
            if (Math.random() < 0.3) {
                const titles = document.querySelectorAll('.section-title, .project-title, .page-title');
                if (titles.length > 0) {
                    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
                    
                    randomTitle.style.transform = `translate(${Math.random() * 6 - 3}px, ${Math.random() * 6 - 3}px)`;
                    randomTitle.style.textShadow = `
                        ${Math.random() * 4 - 2}px 0 red,
                        ${Math.random() * 4 - 2}px 0 cyan
                    `;
                    
                    setTimeout(() => {
                        randomTitle.style.transform = 'translate(0, 0)';
                        randomTitle.style.textShadow = 'none';
                    }, 100);
                }
            }
        }
    }

    // Schedule random global glitches
    function scheduleNextGlitch() {
        const delay = Math.random() * 5000 + 3000; // 3-8 seconds
        setTimeout(() => {
            triggerGlobalGlitch();
            scheduleNextGlitch();
        }, delay);
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        initializeSidebar();
        handleResize();
        handleMobileToggle();
        
        // Start glitch system after a short delay
        setTimeout(() => {
            scheduleNextGlitch();
        }, 2000);

        console.log('🌆 Cyberpunk Sidebar Initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();