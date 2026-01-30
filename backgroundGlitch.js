// ============================================
// CYBERPUNK BACKGROUND GLITCH - MAGNIFYING LINE
// Smooth glitch line with magnifying glass distortion
// ============================================

(function() {
    'use strict';
    
    console.log('🎮 Background Glitch Script Loading...');

    const background = document.querySelector('.cyberpunk-background');
    
    if (!background) {
        console.error('❌ .cyberpunk-background element not found!');
        return;
    }
    
    console.log('✅ Background element found');

    // Configuration
    const config = {
        lineWidth: 0.000001,              // Width of the glitch line
        glitchIntensity: 1.2,
        glitchDuration: 1000,
        maxTrailPoints: 100,
        trailSpacing: 8,            // Smooth spacing between points
        magnificationStrength: 1.1, // How much to magnify (1.5 = 150%)
    };

    let trailPoints = [];
    let lastMousePosition = { x: 0, y: 0 };

    // Create canvas for glitch line
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    background.parentNode.insertBefore(canvas, background.nextSibling);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Trail Point class
    class TrailPoint {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.intensity = config.glitchIntensity;
            this.fadeStart = null;
            this.active = true;
            this.age = 0;
        }

        startFade() {
            if (!this.fadeStart) {
                this.fadeStart = Date.now();
            }
        }

        update() {
            this.age++;
            
            if (this.fadeStart) {
                const elapsed = Date.now() - this.fadeStart;
                const progress = elapsed / config.glitchDuration;
                
                if (progress >= 1) {
                    this.active = false;
                    return;
                }
                
                this.intensity = config.glitchIntensity * (1 - progress);
            }
        }
    }

    // Track mouse movement and create smooth trail
    document.addEventListener('mousemove', function(e) {
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        // Calculate distance from last point
        const distance = Math.hypot(
            currentX - lastMousePosition.x,
            currentY - lastMousePosition.y
        );
        
        // If moved enough, add points along the path
        if (distance >= config.trailSpacing) {
            // Interpolate points for ultra-smooth line
            const steps = Math.ceil(distance / config.trailSpacing);
            
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const x = lastMousePosition.x + (currentX - lastMousePosition.x) * t;
                const y = lastMousePosition.y + (currentY - lastMousePosition.y) * t;
                
                addTrailPoint(x, y);
            }
            
            lastMousePosition.x = currentX;
            lastMousePosition.y = currentY;
        }
    });

    function addTrailPoint(x, y) {
        // Remove oldest if at max
        if (trailPoints.length >= config.maxTrailPoints) {
            trailPoints.shift();
        }
        
        trailPoints.push(new TrailPoint(x, y));
    }

    // Start fade when mouse stops
    let mouseMoveTimeout;
    document.addEventListener('mousemove', function() {
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            trailPoints.forEach(point => point.startFade());
        }, 150);
    });

    // Draw glitch line
    function drawGlitchLine() {
        if (trailPoints.length < 2) return;

        // Draw smooth curved line through points
        ctx.save();

        // Create path through all points
        for (let i = 0; i < trailPoints.length; i++) {
            const point = trailPoints[i];
            if (!point.active || point.intensity <= 0) continue;

            // Draw glitch effect along the line
            const halfWidth = config.lineWidth / 2;

            // Horizontal glitch lines
            const numLines = 8;
            for (let j = 0; j < numLines; j++) {
                const offsetX = (Math.random() - 0.5) * 20 * point.intensity;
                const offsetY = (Math.random() - 0.5) * 15 * point.intensity;
                const lineHeight = 1 + Math.random() * 2;
                const lineY = point.y + (Math.random() - 0.5) * config.lineWidth;

                const colors = [
                    `rgba(0, 255, 255, ${point.intensity * 0.7})`,
                    `rgba(255, 0, 255, ${point.intensity * 0.7})`,
                    `rgba(255, 107, 0, ${point.intensity * 0.7})`
                ];
                
                ctx.fillStyle = colors[Math.floor(Math.random() * 3)];
                ctx.fillRect(
                    point.x - halfWidth + offsetX,
                    lineY + offsetY,
                    config.lineWidth,
                    lineHeight
                );
            }

            // Random glitch blocks
            const numBlocks = 3;
            for (let j = 0; j < numBlocks; j++) {
                const blockSize = 6 + Math.random() * 7;
                const blockX = point.x + (Math.random() - 0.5) * config.lineWidth;
                const blockY = point.y + (Math.random() - 0.5) * config.lineWidth;
                
                ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, ${point.intensity * 0.4})`;
                ctx.fillRect(blockX, blockY, blockSize, blockSize);
            }

            // Scanlines
            ctx.strokeStyle = `rgba(0, 255, 255, ${point.intensity * 0.5})`;
            ctx.lineWidth = 1;
            
            for (let j = 0; j < 4; j++) {
                const lineY = point.y + (Math.random() - 0.5) * config.lineWidth;
                const offset = (Math.random() - 0.5) * 20 * point.intensity;
                
                ctx.beginPath();
                ctx.moveTo(point.x - halfWidth + offset, lineY);
                ctx.lineTo(point.x + halfWidth + offset, lineY);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    // Apply magnifying glass distortion to background
    function applyMagnificationDistortion() {
        if (trailPoints.length === 0) {
            background.style.filter = '';
            return;
        }

        // Get active points that aren't fading
        const activePoints = trailPoints.filter(p => p.active && !p.fadeStart);
        
        if (activePoints.length === 0) {
            background.style.filter = '';
            return;
        }

        // Calculate center of active glitch line
        const centerX = activePoints.reduce((sum, p) => sum + p.x, 0) / activePoints.length;
        const centerY = activePoints.reduce((sum, p) => sum + p.y, 0) / activePoints.length;
        
        const avgIntensity = activePoints.reduce((sum, p) => sum + p.intensity, 0) / activePoints.length;

        if (avgIntensity > 0.1) {
            // Calculate position relative to viewport center
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;
            
            // Offset from center (for transform-origin)
            const offsetX = ((centerX - viewportCenterX) / viewportCenterX) * 100;
            const offsetY = ((centerY - viewportCenterY) / viewportCenterY) * 100;

            // Magnification effect - scale from the glitch line center
            const scale = 1 + (config.magnificationStrength - 1) * avgIntensity * 0.1;
            
            // Subtle color distortion
            const hueRotate = (Math.random() - 0.5) * 20 * avgIntensity;
            const saturate = 1 + (Math.random() - 0.5) * 0.3 * avgIntensity;
            const brightness = 1 + (Math.random() - 0.5) * 0.15 * avgIntensity;

            background.style.filter = `
                hue-rotate(${hueRotate}deg)
                saturate(${saturate})
                brightness(${brightness})
            `;
            
            // Scale from glitch line position (magnifying effect)
            background.style.transformOrigin = `${50 + offsetX}% ${50 + offsetY}%`;
            background.style.transform = `scale(${scale})`;
        } else {
            background.style.filter = '';
            background.style.transform = '';
        }
    }

    // Render loop
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update trail points
        trailPoints = trailPoints.filter(point => {
            point.update();
            return point.active;
        });

        // Draw glitch line
        drawGlitchLine();

        // Apply magnification distortion
        applyMagnificationDistortion();

        requestAnimationFrame(render);
    }

    // Start render loop
    render();

    console.log('✅ Background Glitch System Initialized - Magnifying line follows your cursor!');

})();