const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');

// 1. Force everything to show up on click no matter what
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    wrapper.style.display = 'block';
    document.body.style.overflow = 'auto'; // Re-enable scroll
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
});

// 2. The Quantum Void Transition
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'activate-universe') {
        wrapper.style.display = 'none';
        const space = document.getElementById('interaction-space');
        space.style.display = 'block';
        
        // Simple colorful backup if the main script fails
        const canvas = document.getElementById('quantum-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillText("OBSERVATION ACTIVE - STIMULATING ENVIRONMENT LOADING", 50, 50);
    }
});
