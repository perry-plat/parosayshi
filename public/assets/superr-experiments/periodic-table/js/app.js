/* ============================================
   PERIODIC TABLE - Main Application
   ============================================ */

/**
 * Main application controller
 */
const App = (function() {
    // Views
    const gridView = document.getElementById('grid-view');
    const detailView = document.getElementById('detail-view');

    // Containers
    const gridContainer = document.getElementById('periodic-grid');
    const legendContainer = document.getElementById('legend-bar');
    const elementTile = document.getElementById('element-tile');
    const elementInfo = document.getElementById('element-info');
    const elementData = document.getElementById('element-data');

    // Buttons
    const closeBtn = document.getElementById('close-btn');
    const backBtn = document.getElementById('back-btn');

    // Storage key
    const LAST_ELEMENT_KEY = 'lastViewedElement';

    /**
     * Initialize the application
     */
    async function init() {
        // Load element data
        const elements = await ElementData.load();

        if (elements.length === 0) {
            console.error('No elements loaded - check assets/elements.json path');
            return;
        }

        // Initialize modules
        PeriodicGrid.init(gridContainer, legendContainer, onElementClick);
        DetailView.init(elementTile, elementInfo, elementData);

        // Render grid
        PeriodicGrid.render(elements);
        PeriodicGrid.setupBackgroundClick();

        // Setup navigation
        setupNavigation();
    }

    /**
     * Setup navigation handlers
     */
    function setupNavigation() {
        // Close button - exit book
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                exitBook();
            });
        }

        // Back button - return to grid
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                showGridView();
            });
        }

        // Handle browser back button
        window.addEventListener('popstate', () => {
            if (detailView.classList.contains('active')) {
                showGridView();
            }
        });
    }

    /**
     * Handle element click
     */
    function onElementClick(element) {
        // Haptic feedback
        vibrate(50);

        // Save to storage
        saveLastElement(element.atomicNumber);

        // Show detail view
        showDetailView(element);
    }

    /**
     * Show grid view
     */
    function showGridView() {
        // Stop Bohr diagram animation
        if (window.BohrDiagram && BohrDiagram.stop) {
            BohrDiagram.stop();
        }

        gridView.classList.add('active');
        detailView.classList.remove('active');

        // Update history state
        if (window.history && window.history.pushState) {
            window.history.replaceState({ view: 'grid' }, '', '');
        }
    }

    /**
     * Show detail view
     */
    function showDetailView(element) {
        DetailView.show(element);
        gridView.classList.remove('active');
        detailView.classList.add('active');

        // Update history state
        if (window.history && window.history.pushState) {
            window.history.replaceState({ view: 'detail', atomicNumber: element.atomicNumber }, '', '');
        }
    }

    /**
     * Save last viewed element to storage
     */
    function saveLastElement(atomicNumber) {
        const value = String(atomicNumber);
        if (window.SuperrSDK && window.SuperrSDK.storage) {
            SuperrSDK.storage.setItem(LAST_ELEMENT_KEY, value, () => {}, () => {});
        } else {
            try {
                localStorage.setItem(LAST_ELEMENT_KEY, value);
            } catch (e) {
                // localStorage not available
            }
        }
    }

    /**
     * Exit the book
     */
    function exitBook() {
        // Stop Bohr diagram animation before exiting
        if (window.BohrDiagram && BohrDiagram.stop) {
            BohrDiagram.stop();
        }

        if (window.SuperrSDK && window.SuperrSDK.system) {
            SuperrSDK.system.exitBook();
        } else if (window.AndroidBridge && window.AndroidBridge.exitBook) {
            window.AndroidBridge.exitBook();
        } else {
            window.parent.postMessage("superr:close-periodic", window.location.origin);
        }
    }

    /**
     * Haptic feedback
     */
    function vibrate(duration) {
        if (window.SuperrSDK && window.SuperrSDK.system) {
            SuperrSDK.system.vibrate(duration);
        } else if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    /**
     * Setup lifecycle event handlers
     */
    function setupLifecycleEvents() {
        if (!window.SuperrSDK || !window.SuperrSDK.events) return;

        SuperrSDK.events.on('onPause', () => {
            if (window.BohrDiagram && BohrDiagram.stop) {
                BohrDiagram.stop();
            }
        });

        SuperrSDK.events.on('onResume', () => {
            if (detailView.classList.contains('active')) {
                const element = DetailView.getCurrentElement();
                const canvas = document.getElementById('bohr-canvas');
                if (element && canvas && window.BohrDiagram) {
                    BohrDiagram.render(canvas, element);
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Setup lifecycle events after SDK is available
    setTimeout(setupLifecycleEvents, 100);

    // Public API
    return {
        showGridView,
        showDetailView,
        exitBook
    };
})();
