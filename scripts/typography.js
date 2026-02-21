export function handleTypography() {
    const titles = document.querySelectorAll('.vogue-title');
    
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate tilt based on distance from center
        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;

        titles.forEach(title => {
            // Check if parent section is visible (being observed)
            if (title.parentElement.classList.contains('observed')) {
                title.style.transform = `perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg) scale(1.02)`;
                title.style.textShadow = `${-moveX}px ${-moveY}px 15px rgba(0,0,0,0.1)`;
            }
        });
    });
}
