/* ============================================
   PERIODIC TABLE - Bohr Diagram
   Animated version with orbiting electrons
   ============================================ */

/**
 * Bohr diagram renderer with animated electron orbits
 *
 * Animation matches native Android implementation:
 * - Shell 1: 3000ms per rotation
 * - Shell 2: 5000ms per rotation
 * - Shell N: 3000 + (N-1) * 2000 ms per rotation
 * - Linear easing, continuous 360° rotation
 */
const BohrDiagram = (function() {
    // Visual constants
    const NUCLEUS_RADIUS = 20;
    const ELECTRON_RADIUS = 4;
    const NUCLEUS_COLOR = '#1A1A1A';
    const ELECTRON_COLOR = '#1A1A1A';
    const ORBIT_COLOR = '#BBBBBB';
    const TEXT_COLOR = '#FFFFFF';

    // Animation timing (matches native Android implementation)
    const BASE_ROTATION_MS = 3000;      // Shell 1 rotation duration
    const ROTATION_INCREMENT_MS = 2000; // Additional ms per shell level

    // Animation state
    let animationFrameId = null;
    let currentCanvas = null;
    let currentElement = null;
    let animationStartTime = null;

    /**
     * Start animated rendering of Bohr diagram
     */
    function render(canvas, element) {
        if (!canvas || !element) return;

        // Stop any existing animation
        stop();

        currentCanvas = canvas;
        currentElement = element;
        animationStartTime = performance.now();

        // Start animation loop
        animate();
    }

    /**
     * Stop the animation
     */
    function stop() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        currentCanvas = null;
        currentElement = null;
        animationStartTime = null;
    }

    /**
     * Animation loop
     */
    function animate() {
        if (!currentCanvas || !currentElement) return;

        const currentTime = performance.now();
        const elapsed = currentTime - animationStartTime;

        renderFrame(currentCanvas, currentElement, elapsed);

        if (!document.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) animationFrameId = requestAnimationFrame(animate);
    }

    document.addEventListener('visibilitychange', () => {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        if (!document.hidden && currentCanvas && currentElement) animate();
    });

    /**
     * Render a single frame of the animation
     */
    function renderFrame(canvas, element, elapsed) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const shells = element.electronShells || [];
        if (shells.length === 0) return;

        // Calculate shell radii
        const minShellRadius = NUCLEUS_RADIUS + 12;
        const maxRadius = Math.min(width, height) / 2 - 8;
        const availableSpace = maxRadius - minShellRadius;

        // Draw orbital rings
        shells.forEach((electronCount, index) => {
            const shellRadius = minShellRadius + (availableSpace * (index + 1) / shells.length);
            drawOrbit(ctx, centerX, centerY, shellRadius);
        });

        // Draw electrons on each shell with animation
        shells.forEach((electronCount, index) => {
            const shellRadius = minShellRadius + (availableSpace * (index + 1) / shells.length);

            // Calculate rotation for this shell (inner shells rotate faster)
            const duration = BASE_ROTATION_MS + index * ROTATION_INCREMENT_MS;
            const rotation = (elapsed / duration) * (2 * Math.PI) % (2 * Math.PI);

            drawElectrons(ctx, centerX, centerY, shellRadius, electronCount, rotation);
        });

        // Draw nucleus (last so it's on top)
        drawNucleus(ctx, centerX, centerY, element.symbol);
    }

    /**
     * Draw orbital ring
     */
    function drawOrbit(ctx, centerX, centerY, radius) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = ORBIT_COLOR;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * Draw nucleus with element symbol
     */
    function drawNucleus(ctx, centerX, centerY, symbol) {
        // Nucleus circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, NUCLEUS_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = NUCLEUS_COLOR;
        ctx.fill();

        // Symbol text
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = '12px Gelica, Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(symbol, centerX, centerY);
    }

    /**
     * Draw electrons on a shell with animated rotation
     */
    function drawElectrons(ctx, centerX, centerY, shellRadius, electronCount, rotation) {
        if (electronCount <= 0) return;

        for (let i = 0; i < electronCount; i++) {
            // Base angle for even distribution + animated rotation
            const baseAngle = (2 * Math.PI * i / electronCount);
            const angle = baseAngle + rotation;

            const x = centerX + shellRadius * Math.cos(angle);
            const y = centerY + shellRadius * Math.sin(angle);

            // Draw electron
            ctx.beginPath();
            ctx.arc(x, y, ELECTRON_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = ELECTRON_COLOR;
            ctx.fill();
        }
    }

    /**
     * Check if animation is running
     */
    function isAnimating() {
        return animationFrameId !== null;
    }

    // Public API
    return {
        render,
        stop,
        isAnimating
    };
})();
