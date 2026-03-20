// js/three-bg.js
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    // Use a deep violet fog
    scene.fog = new THREE.FogExp2(0x090514, 0.0012);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x090514, 1); // Exact match with the new deep violet theme

    // PARTICLES (NODES)
    const particleCount = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        // spread particles out widely
        positions[i * 3] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

        velocities.push({
            x: (Math.random() - 0.5) * 0.4,
            y: (Math.random() - 0.5) * 0.4,
            z: (Math.random() - 0.5) * 0.4
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material - rose color from accent
    const pMaterial = new THREE.PointsMaterial({
        color: 0xf43f5e,
        size: 2.5,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // LINES (CONNECTIONS) - violet color from primary
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.25
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // MOUSE INTERACTION for slight parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.08;
        mouseY = (event.clientY - windowHalfY) * 0.08;
    });

    // Handle smooth scrolling to fix canvas jitter
    let scrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    });

    // ANIMATION LOOP
    function animate() {
        requestAnimationFrame(animate);
        
        targetX = mouseX;
        targetY = mouseY;
        
        // Easing camera movement for parallax
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        // The camera should ideally look at the center, shifted slightly by scroll
        camera.position.y -= scrollY * 0.01; 
        camera.lookAt(scene.position);

        const positionsArray = particles.geometry.attributes.position.array;
        
        // Update particles positions
        for (let i = 0; i < particleCount; i++) {
            positionsArray[i * 3] += velocities[i].x;
            positionsArray[i * 3 + 1] += velocities[i].y;
            positionsArray[i * 3 + 2] += velocities[i].z;

            // boundary bounce
            if (positionsArray[i * 3] > 400 || positionsArray[i * 3] < -400) velocities[i].x *= -1;
            if (positionsArray[i * 3 + 1] > 400 || positionsArray[i * 3 + 1] < -400) velocities[i].y *= -1;
            if (positionsArray[i * 3 + 2] > 400 || positionsArray[i * 3 + 2] < -400) velocities[i].z *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Calculate dynamic connections
        const linePositions = [];
        const connectionDistance = 80;
        
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positionsArray[i * 3] - positionsArray[j * 3];
                const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
                const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < connectionDistance) {
                    linePositions.push(
                        positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2],
                        positionsArray[j * 3], positionsArray[j * 3 + 1], positionsArray[j * 3 + 2]
                    );
                }
            }
        }
        
        if (linePositions.length > 0) {
            linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        } else {
             linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
        }

        // Global rotation to make it feel alive
        scene.rotation.y += 0.0005;
        scene.rotation.x += 0.0002;

        renderer.render(scene, camera);
        
        // reset camera y adjustment from scroll so it doesn't accumulate wildly
        camera.position.y += scrollY * 0.01; 
    }

    animate();

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
