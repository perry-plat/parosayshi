/* ============================================
   PERIODIC TABLE - Detail View
   ============================================ */

/**
 * Detail view module
 */
const DetailView = (function() {
    let tileContainer = null;
    let infoContainer = null;
    let dataContainer = null;
    let currentElement = null;

    /**
     * Initialize detail view
     */
    function init(tile, info, data) {
        tileContainer = tile;
        infoContainer = info;
        dataContainer = data;
    }

    /**
     * Show element details
     */
    function show(element) {
        currentElement = element;
        renderTile(element);
        renderInfo(element);
        renderData(element);
    }

    /**
     * Render the large element tile
     */
    function renderTile(element) {
        if (!tileContainer) return;

        const categoryClass = ElementData.getCategoryClass(element);
        const categoryColor = getComputedStyle(document.documentElement)
            .getPropertyValue(`--${categoryClass}`).trim();

        tileContainer.style.backgroundColor = categoryColor;
        tileContainer.innerHTML = `
            <span class="tile-atomic-number">${element.atomicNumber}</span>
            <span class="tile-symbol">${element.symbol}</span>
            <span class="tile-name">${element.name}</span>
            <span class="tile-mass">${ElementData.formatAtomicMass(element.atomicMass)}</span>
        `;
    }

    /**
     * Render element info (left panel)
     */
    function renderInfo(element) {
        if (!infoContainer) return;

        const categoryClass = ElementData.getCategoryClass(element);
        const categoryName = element.category.replace(/_/g, ' ');
        const stateName = ElementData.getStateDisplayName(element.naturalState);

        let html = `
            <div class="info-name">${element.name}</div>
            <div class="info-category">${categoryName}</div>
            <div class="info-tags">
                <span class="info-tag">Period ${element.period}</span>
                ${element.group ? `<span class="info-tag">Group ${element.group}</span>` : ''}
                <span class="info-tag">Block ${element.block.toUpperCase()}</span>
                <span class="info-tag">${stateName}</span>
            </div>
        `;

        // Summary
        if (element.summary) {
            html += `<div class="info-summary">${element.summary}</div>`;
        }

        // Discovery
        if (element.discoveredBy || element.discoveryYear) {
            let discoveryText = '';
            if (element.discoveredBy && element.discoveryYear) {
                discoveryText = `Discovered by ${element.discoveredBy} in ${element.discoveryYear}`;
            } else if (element.discoveredBy) {
                discoveryText = `Discovered by ${element.discoveredBy}`;
            } else if (element.discoveryYear) {
                discoveryText = `Discovered in ${element.discoveryYear}`;
            }
            html += `<div class="info-discovery">${discoveryText}</div>`;
        }

        infoContainer.innerHTML = html;
    }

    /**
     * Render data sections (right panel)
     */
    function renderData(element) {
        if (!dataContainer) return;

        let html = '';

        // Bohr Diagram
        html += `
            <div class="data-section full-width">
                <div class="section-header">Atomic Structure</div>
                <div class="bohr-container">
                    <canvas id="bohr-canvas" width="250" height="200"></canvas>
                </div>
            </div>
        `;

        // Atomic Properties
        html += renderSection('Atomic', [
            { label: 'Protons', value: ElementData.getProtons(element) },
            { label: 'Neutrons', value: ElementData.getNeutrons(element) },
            { label: 'Electrons', value: ElementData.getElectrons(element) },
            { label: 'Valence Electrons', value: ElementData.getValenceElectrons(element) },
            { label: 'Atomic Mass', value: ElementData.formatAtomicMass(element.atomicMass) + ' u' }
        ]);

        // Electron Configuration
        const electronProps = [
            { label: 'Configuration', value: element.electronConfigurationSemantic || element.electronConfiguration || '—' },
            { label: 'Shells', value: (element.electronShells || []).join(', ') || '—' }
        ];
        if (element.electronegativity) {
            electronProps.push({ label: 'Electronegativity', value: element.electronegativity.toFixed(2) });
        }
        if (element.electronAffinity) {
            electronProps.push({ label: 'Electron Affinity', value: element.electronAffinity.toFixed(2) + ' kJ/mol' });
        }
        html += renderSection('Electrons', electronProps);

        // Chemical Properties (if available)
        const chemicalProps = [];
        if (element.oxidationStates && element.oxidationStates.length > 0) {
            chemicalProps.push({ label: 'Oxidation States', value: element.oxidationStates.join(', ') });
        }
        if (element.standardElectrodePotential !== undefined && element.standardElectrodePotential !== null) {
            chemicalProps.push({ label: 'Electrode Potential', value: element.standardElectrodePotential.toFixed(3) + ' V' });
        }
        if (chemicalProps.length > 0) {
            html += renderSection('Chemical', chemicalProps);
        }

        // Physical Properties
        const physicalProps = [];
        if (element.density) {
            physicalProps.push({ label: 'Density', value: ElementData.formatDensity(element.density) });
        }
        if (element.meltingPoint) {
            physicalProps.push({ label: 'Melting Point', value: ElementData.formatTemperature(element.meltingPoint) });
        }
        if (element.boilingPoint) {
            physicalProps.push({ label: 'Boiling Point', value: ElementData.formatTemperature(element.boilingPoint) });
        }
        if (element.crystalStructure) {
            physicalProps.push({ label: 'Crystal Structure', value: element.crystalStructure });
        }
        if (physicalProps.length > 0) {
            html += renderSection('Physical', physicalProps);
        }

        // Appearance
        if (element.appearance) {
            html += `
                <div class="data-section">
                    <div class="section-header">Appearance</div>
                    <div class="appearance-text">${element.appearance}</div>
                </div>
            `;
        }

        // Atomic Radii
        const radiiProps = [];
        if (element.atomicRadiusEmpirical) {
            radiiProps.push({ label: 'Empirical', value: element.atomicRadiusEmpirical + ' pm' });
        }
        if (element.covalentRadius) {
            radiiProps.push({ label: 'Covalent', value: element.covalentRadius + ' pm' });
        }
        if (element.vanDerWaalsRadius) {
            radiiProps.push({ label: 'Van der Waals', value: element.vanDerWaalsRadius + ' pm' });
        }
        if (radiiProps.length > 0) {
            html += renderSection('Radii', radiiProps);
        }

        // Thermal Properties
        const thermalProps = [];
        if (element.heatOfFusion) {
            thermalProps.push({ label: 'Heat of Fusion', value: element.heatOfFusion + ' kJ/mol' });
        }
        if (element.heatOfVaporization) {
            thermalProps.push({ label: 'Heat of Vaporization', value: element.heatOfVaporization + ' kJ/mol' });
        }
        if (element.thermalConductivity) {
            thermalProps.push({ label: 'Thermal Conductivity', value: element.thermalConductivity + ' W/(m·K)' });
        }
        if (element.molarHeatCapacity) {
            thermalProps.push({ label: 'Heat Capacity', value: element.molarHeatCapacity + ' J/(mol·K)' });
        }
        if (thermalProps.length > 0) {
            html += renderSection('Thermal', thermalProps);
        }

        // Ionization Energies
        if (element.ionizationEnergies && element.ionizationEnergies.length > 0) {
            const ionProps = element.ionizationEnergies.slice(0, 3).map((energy, i) => ({
                label: `${ordinal(i + 1)} Ionization`,
                value: energy.toFixed(2) + ' kJ/mol'
            }));
            html += renderSection('Ionization', ionProps);
        }

        // Trivia/Facts
        if (element.trivia && element.trivia.length > 0) {
            html += renderListSection('Facts', element.trivia);
        }

        // Real World Uses
        if (element.realWorldUses && element.realWorldUses.length > 0) {
            html += renderListSection('Uses', element.realWorldUses);
        }

        // Where Found
        if (element.whereFound && element.whereFound.length > 0) {
            html += renderListSection('Where Found', element.whereFound);
        }

        dataContainer.innerHTML = html;

        // Render Bohr diagram after DOM is updated
        setTimeout(() => {
            const canvas = document.getElementById('bohr-canvas');
            if (canvas) {
                BohrDiagram.render(canvas, element);
            }
        }, 0);
    }

    /**
     * Render a data section with property rows
     */
    function renderSection(title, properties) {
        let html = `
            <div class="data-section">
                <div class="section-header">${title}</div>
        `;

        properties.forEach(prop => {
            html += `
                <div class="property-row">
                    <span class="property-label">${prop.label}</span>
                    <span class="property-value">${prop.value}</span>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    /**
     * Render a list section (for trivia, uses, etc.)
     */
    function renderListSection(title, items) {
        let html = `
            <div class="data-section">
                <div class="section-header">${title}</div>
                <div class="list-section">
        `;

        items.forEach(item => {
            html += `<div class="list-item">${item}</div>`;
        });

        html += '</div></div>';
        return html;
    }

    /**
     * Get ordinal suffix for a number
     */
    function ordinal(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    /**
     * Get current element
     */
    function getCurrentElement() {
        return currentElement;
    }

    // Public API
    return {
        init,
        show,
        getCurrentElement
    };
})();
