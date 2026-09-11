/* ============================================
   PERIODIC TABLE - Data Module
   ============================================ */

/**
 * Element data manager
 */
const ElementData = (function() {
    let elements = [];
    let elementsById = {};

    /**
     * Category mapping from JSON to CSS class names
     */
    const categoryMap = {
        'ALKALI_METAL': 'alkali-metal',
        'ALKALINE_EARTH_METAL': 'alkaline-earth-metal',
        'TRANSITION_METAL': 'transition-metal',
        'POST_TRANSITION_METAL': 'post-transition-metal',
        'METALLOID': 'metalloid',
        'NONMETAL': 'nonmetal',
        'HALOGEN': 'halogen',
        'NOBLE_GAS': 'noble-gas',
        'LANTHANIDE': 'lanthanide',
        'ACTINIDE': 'actinide',
        'UNKNOWN': 'unknown'
    };

    /**
     * Category display names
     */
    const categoryDisplayNames = {
        'alkali-metal': 'Alkali',
        'alkaline-earth-metal': 'Alkaline',
        'transition-metal': 'Transition',
        'post-transition-metal': 'Post-Trans',
        'metalloid': 'Metalloid',
        'nonmetal': 'Nonmetal',
        'halogen': 'Halogen',
        'noble-gas': 'Noble Gas',
        'lanthanide': 'Lanthanide',
        'actinide': 'Actinide'
    };

    /**
     * State display names
     */
    const stateDisplayNames = {
        'SOLID': 'Solid',
        'LIQUID': 'Liquid',
        'GAS': 'Gas',
        'UNKNOWN': 'Unknown'
    };

    /**
     * Load elements from JSON file
     * Uses XMLHttpRequest for better compatibility with file:// URLs in WebView
     */
    async function load() {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'assets/elements.json', true);
            xhr.responseType = 'json';

            xhr.onload = function() {
                // status 0 is OK for file:// URLs
                if (xhr.status === 200 || xhr.status === 0) {
                    const data = xhr.response;
                    if (data && data.elements) {
                        // Filter to only include elements 1-118 (exclude hypothetical elements)
                        elements = data.elements.filter(el => el.atomicNumber >= 1 && el.atomicNumber <= 118);

                        // Build lookup map
                        elements.forEach(el => {
                            elementsById[el.atomicNumber] = el;
                        });

                        resolve(elements);
                    } else {
                        resolve([]);
                    }
                } else {
                    resolve([]);
                }
            };

            xhr.onerror = function() {
                resolve([]);
            };

            xhr.send();
        });
    }

    /**
     * Get all elements
     */
    function getAll() {
        return elements;
    }

    /**
     * Get element by atomic number
     */
    function getByAtomicNumber(atomicNumber) {
        return elementsById[atomicNumber] || null;
    }

    /**
     * Get CSS category class from element
     */
    function getCategoryClass(element) {
        return categoryMap[element.category] || 'unknown';
    }

    /**
     * Get category display name
     */
    function getCategoryDisplayName(categoryClass) {
        return categoryDisplayNames[categoryClass] || categoryClass;
    }

    /**
     * Get all unique categories
     */
    function getCategories() {
        return Object.keys(categoryDisplayNames);
    }

    /**
     * Get state display name
     */
    function getStateDisplayName(state) {
        return stateDisplayNames[state] || 'Unknown';
    }

    /**
     * Calculate grid position for element
     * Returns { row: 1-10, col: 1-18 } (1-indexed for CSS grid)
     */
    function getGridPosition(element) {
        const atomicNumber = element.atomicNumber;

        // Lanthanides (57-71) go in row 9
        if (atomicNumber >= 57 && atomicNumber <= 71) {
            return { row: 9, col: atomicNumber - 57 + 4 }; // columns 4-18
        }
        // Actinides (89-103) go in row 10
        if (atomicNumber >= 89 && atomicNumber <= 103) {
            return { row: 10, col: atomicNumber - 89 + 4 }; // columns 4-18
        }

        // Period 1
        if (atomicNumber === 1) return { row: 1, col: 1 };   // H
        if (atomicNumber === 2) return { row: 1, col: 18 };  // He

        // Period 2
        if (atomicNumber >= 3 && atomicNumber <= 4) return { row: 2, col: atomicNumber - 2 };  // Li, Be
        if (atomicNumber >= 5 && atomicNumber <= 10) return { row: 2, col: atomicNumber + 8 }; // B-Ne (cols 13-18)

        // Period 3
        if (atomicNumber >= 11 && atomicNumber <= 12) return { row: 3, col: atomicNumber - 10 }; // Na, Mg
        if (atomicNumber >= 13 && atomicNumber <= 18) return { row: 3, col: atomicNumber };      // Al-Ar

        // Period 4
        if (atomicNumber >= 19 && atomicNumber <= 36) return { row: 4, col: atomicNumber - 18 };

        // Period 5
        if (atomicNumber >= 37 && atomicNumber <= 54) return { row: 5, col: atomicNumber - 36 };

        // Period 6 (excluding lanthanides)
        if (atomicNumber === 55) return { row: 6, col: 1 };  // Cs
        if (atomicNumber === 56) return { row: 6, col: 2 };  // Ba
        if (atomicNumber >= 72 && atomicNumber <= 86) return { row: 6, col: atomicNumber - 68 }; // Hf-Rn (cols 4-18)

        // Period 7 (excluding actinides)
        if (atomicNumber === 87) return { row: 7, col: 1 };  // Fr
        if (atomicNumber === 88) return { row: 7, col: 2 };  // Ra
        if (atomicNumber >= 104 && atomicNumber <= 118) return { row: 7, col: atomicNumber - 100 }; // Rf-Og (cols 4-18)

        return { row: 1, col: 1 }; // Fallback
    }

    /**
     * Format atomic mass for display
     */
    function formatAtomicMass(mass) {
        if (!mass) return '—';
        return mass.toFixed(3);
    }

    /**
     * Format temperature (Kelvin to display)
     */
    function formatTemperature(kelvin) {
        if (!kelvin) return '—';
        const celsius = kelvin - 273.15;
        return `${kelvin.toFixed(1)} K (${celsius.toFixed(1)} °C)`;
    }

    /**
     * Format density
     */
    function formatDensity(density) {
        if (!density) return '—';
        return `${density.toFixed(3)} g/cm³`;
    }

    /**
     * Computed properties
     */
    function getProtons(element) {
        return element.atomicNumber;
    }

    function getElectrons(element) {
        return element.atomicNumber; // Neutral atom
    }

    function getNeutrons(element) {
        return Math.max(0, Math.round(element.atomicMass) - element.atomicNumber);
    }

    function getValenceElectrons(element) {
        const shells = element.electronShells || [];
        return shells.length > 0 ? shells[shells.length - 1] : 0;
    }

    // Public API
    return {
        load,
        getAll,
        getByAtomicNumber,
        getCategoryClass,
        getCategoryDisplayName,
        getCategories,
        getStateDisplayName,
        getGridPosition,
        formatAtomicMass,
        formatTemperature,
        formatDensity,
        getProtons,
        getElectrons,
        getNeutrons,
        getValenceElectrons,
        categoryMap
    };
})();
