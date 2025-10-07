// Small animations and interactivity
document.addEventListener("DOMContentLoaded", () => {
    const skills = document.querySelectorAll(".skill");
    skills.forEach(skill => {
        skill.addEventListener("mouseenter", () => skill.style.background = "#3b82f6");
        skill.addEventListener("mouseleave", () => skill.style.background = "#1e293b");
    });

    const projects = document.querySelectorAll(".project");
    projects.forEach(project => {
        project.addEventListener("mouseenter", () => project.style.boxShadow = "0 10px 20px rgba(0,0,0,0.5)");
        project.addEventListener("mouseleave", () => project.style.boxShadow = "none");
    });
});

// Animate real-time stats
function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    let range = end - start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    let timer = setInterval(() => {
        current += increment;
        obj.textContent = current;
        if (current == end) clearInterval(timer);
    }, stepTime);
}

// Trigger animation when page loads
document.addEventListener("DOMContentLoaded", () => {
    animateValue("projects-built", 0, 6, 1500);   // 6 projects
});

// Scroll animations
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});
