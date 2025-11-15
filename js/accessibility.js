class AccessibilityManager {
    constructor() {
        this.isActive = false;
        this.currentMode = null;
        this.panel = null;
        this.toggleBtn = null;
        
        this.init();
    }
    
    init() {
        this.createAccessibilityPanel();
        this.loadSavedSettings();
        this.addKeyboardNavigation();
    }
    
    createAccessibilityPanel() {
        // Create skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Перейти к основному содержанию';
        document.body.prepend(skipLink);
        
        // Create main content anchor
        const mainContent = document.createElement('div');
        mainContent.id = 'main-content';
        mainContent.style.cssText = 'position: absolute; top: -100px;';
        document.body.prepend(mainContent);
        
        // Create panel
        this.panel = document.createElement('div');
        this.panel.className = 'accessibility-panel hidden';
        this.panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Панель доступности">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="accessibility-options">
                <button class="accessibility-option" data-mode="high-contrast">
                    <i class="fas fa-adjust"></i> Высокая контрастность
                </button>
                <button class="accessibility-option" data-mode="large-text">
                    <i class="fas fa-text-height"></i> Крупный текст
                </button>
                <button class="accessibility-option" data-mode="grayscale">
                    <i class="fas fa-palette"></i> Черно-белый режим
                </button>
                <button class="accessibility-option" data-mode="dyslexia-friendly">
                    <i class="fas fa-font"></i> Шрифт для дислексии
                </button>
                <button class="accessibility-option accessibility-reset">
                    <i class="fas fa-times"></i> Обычная версия
                </button>
            </div>
        `;
        
        document.body.appendChild(this.panel);
        
        // Add event listeners
        this.toggleBtn = this.panel.querySelector('.accessibility-toggle');
        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        
        const options = this.panel.querySelectorAll('.accessibility-option');
        options.forEach(option => {
            if (option.classList.contains('accessibility-reset')) {
                option.addEventListener('click', () => this.resetAccessibility());
            } else {
                option.addEventListener('click', (e) => this.setMode(e.target.dataset.mode));
            }
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && e.target !== this.toggleBtn) {
                this.hidePanel();
            }
        });
    }
    
    togglePanel() {
        if (this.panel.classList.contains('hidden')) {
            this.showPanel();
        } else {
            this.hidePanel();
        }
    }
    
    showPanel() {
        this.panel.classList.remove('hidden');
        this.toggleBtn.setAttribute('aria-expanded', 'true');
    }
    
    hidePanel() {
        this.panel.classList.add('hidden');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
    }
    
    setMode(mode) {
        // Remove previous modes
        document.documentElement.classList.remove(
            'accessibility-version',
            'high-contrast',
            'large-text',
            'grayscale',
            'dyslexia-friendly'
        );
        
        // Set new mode
        document.documentElement.classList.add('accessibility-version', mode);
        this.currentMode = mode;
        this.isActive = true;
        
        // Update active state in panel
        const options = this.panel.querySelectorAll('.accessibility-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.mode === mode) {
                option.classList.add('active');
            }
        });
        
        this.saveSettings();
        this.hidePanel();
    }
    
    resetAccessibility() {
        document.documentElement.classList.remove(
            'accessibility-version',
            'high-contrast',
            'large-text',
            'grayscale',
            'dyslexia-friendly'
        );
        
        this.currentMode = null;
        this.isActive = false;
        
        // Remove active state from all options
        const options = this.panel.querySelectorAll('.accessibility-option');
        options.forEach(option => option.classList.remove('active'));
        
        this.saveSettings();
        this.hidePanel();
    }
    
    saveSettings() {
        const settings = {
            isActive: this.isActive,
            mode: this.currentMode
        };
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    }
    
    loadSavedSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.isActive && settings.mode) {
                this.setMode(settings.mode);
            }
        }
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + 1 - Toggle accessibility panel
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                this.togglePanel();
            }
            
            // Alt + 2 - High contrast
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                this.setMode('high-contrast');
            }
            
            // Alt + 3 - Large text
            if (e.altKey && e.key === '3') {
                e.preventDefault();
                this.setMode('large-text');
            }
            
            // Alt + 0 - Reset
            if (e.altKey && e.key === '0') {
                e.preventDefault();
                this.resetAccessibility();
            }
        });
    }
}

// Initialize accessibility manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
});

// Add ARIA landmarks and roles for better screen reader support
function enhanceARIA() {
    // Add main landmark if not present
    if (!document.querySelector('main[role="main"]')) {
        const main = document.querySelector('main');
        if (main) {
            main.setAttribute('role', 'main');
            main.setAttribute('aria-label', 'Основное содержание');
        }
    }
    
    // Add navigation landmarks
    const navs = document.querySelectorAll('nav');
    navs.forEach((nav, index) => {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', `Навигация ${index + 1}`);
    });
    
    // Add banner role to header
    const header = document.querySelector('header');
    if (header) {
        header.setAttribute('role', 'banner');
    }
    
    // Add contentinfo role to footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    // Add button roles to interactive elements
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach(button => {
        if (!button.getAttribute('role')) {
            button.setAttribute('role', 'button');
        }
    });
    
    // Add img alt attributes if missing
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
        if (!img.alt) {
            const filename = img.src.split('/').pop();
            img.alt = `Изображение: ${filename}`;
        }
    });
}

// Run ARIA enhancements
document.addEventListener('DOMContentLoaded', enhanceARIA);