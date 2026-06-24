// ----------------------------------------------------
// THREE.JS ARCHITECTURAL 3D BACKGROUND
// Morphing wireframe geometries, solid structures, & Draft My House modeler
// ----------------------------------------------------

(function () {
    let container, scene, camera, renderer;
    let particles, structuresGroup, solidGroup;
    let floorSlab, roofSlab, furnitureGroup;
    let pillarsArray = [];
    let ambientLight, directionalLight, pointLight;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Mouse tracking variables for parallax
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    // Orbiting light angle
    let lightAngle = 0;

    // Current page state
    let currentPage = "home";

    // Smooth camera lookAt point
    let lookAtTarget = new THREE.Vector3(0, 0, 0);

    let isInitialized = false;

    // Configuration for morphing states
    const pageStates = {
        home: {
            camX: 0,
            camY: 0,
            camZ: 15,
            structRotX: 0.2,
            structRotY: 0.4,
            structScale: 1.0,
            particleSpeed: 0.003
        },
        about: {
            camX: -4, // Shift left so visuals move right
            camY: 1,
            camZ: 12,
            structRotX: 0.6,
            structRotY: 1.2,
            structScale: 0.9,
            particleSpeed: 0.002
        },
        portfolio: {
            camX: 4, // Shift right so visuals move left
            camY: -1,
            camZ: 18,
            structRotX: 0.1,
            structRotY: -0.8,
            structScale: 0.7,
            particleSpeed: 0.006
        },
        draft: {
            camX: 3.5, // Shift right so visual is on the right side of the screen
            camY: 1.8, // Slightly higher angle looking down at draft house
            camZ: 8.5,
            structRotX: 0.35,
            structRotY: 0.6,
            structScale: 1.0,
            particleSpeed: 0.001
        },
        contact: {
            camX: 0,
            camY: 3,
            camZ: 14,
            structRotX: -0.4,
            structRotY: 0.2,
            structScale: 1.1,
            particleSpeed: 0.004
        }
    };

    function init() {
        try {
            container = document.getElementById("canvas-container");
            if (!container) return;

            // 1. Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x070708, 0.04);

            // 2. Camera setup
            camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
            camera.position.z = pageStates.home.camZ;

            // 3. Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x070708, 1);
            container.appendChild(renderer.domElement);

            // 4. Lights Setup (Crucial for solid materials gloss/shading)
            setupLights();

            // 5. Create structures groups
            structuresGroup = new THREE.Group();
            scene.add(structuresGroup);

            solidGroup = new THREE.Group();
            solidGroup.scale.set(0.001, 0.001, 0.001); // Hide by default
            solidGroup.visible = false;
            scene.add(solidGroup);

            // 6. Build the elements
            createArchitecturalElements();

            // 7. Add floating luxury particle system
            createParticleSystem();

            // 8. Event listeners
            window.addEventListener("resize", onWindowResize);
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("page-changed", onPageChanged);
            window.addEventListener("draft-changed", onDraftChanged);

            isInitialized = true;

            // 9. Start Animation loop
            animate();
        } catch (error) {
            console.warn("WebGL 3D Context not supported or failed to initialize:", error);
            if (container) {
                container.style.display = "none";
            }
        }
    }

    function setupLights() {
        // Soft warm ambient illumination
        ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambientLight);

        // Key directional light representing dusk sun
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
        directionalLight.position.set(5, 12, 6);
        scene.add(directionalLight);

        // Orbiting gold accent light to create specular reflections
        pointLight = new THREE.PointLight(0xC5A880, 2.5, 20);
        pointLight.position.set(0, 4, 5);
        scene.add(pointLight);
    }

    function createArchitecturalElements() {
        // --- WIREFRAME ELEMENTS (Home, About, Portfolio, Contact) ---
        const geometries = [
            new THREE.BoxGeometry(4, 0.1, 4),    // Slab
            new THREE.BoxGeometry(0.3, 5, 0.3),  // Column
            new THREE.BoxGeometry(0.3, 5, 0.3),  // Column
            new THREE.BoxGeometry(3, 3, 3),      // Core volume
            new THREE.BoxGeometry(6, 0.05, 1)    // Thin beam
        ];

        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xC5A880,
            wireframe: true,
            transparent: true,
            opacity: 0.12
        });

        // Column 1
        const col1 = new THREE.Mesh(geometries[1], wireframeMaterial);
        col1.position.set(-2, 0, -2);
        structuresGroup.add(col1);

        // Column 2
        const col2 = new THREE.Mesh(geometries[2], wireframeMaterial);
        col2.position.set(2, 0, 2);
        structuresGroup.add(col2);

        // Slab 1
        const slab1 = new THREE.Mesh(geometries[0], wireframeMaterial);
        slab1.position.set(0, -2.5, 0);
        structuresGroup.add(slab1);

        // Slab 2
        const slab2 = new THREE.Mesh(geometries[0], wireframeMaterial);
        slab2.position.set(0, 2.5, 0);
        structuresGroup.add(slab2);

        // Core block
        const core = new THREE.Mesh(geometries[3], wireframeMaterial);
        core.position.set(0, 0, 0);
        structuresGroup.add(core);

        // Floating architectural beam
        const beam = new THREE.Mesh(geometries[4], wireframeMaterial);
        beam.position.set(0, 1.2, 0);
        structuresGroup.add(beam);

        // Add a subtle wireframe grid underneath
        const gridHelper = new THREE.GridHelper(30, 30, 0xC5A880, 0x18181b);
        gridHelper.position.y = -6;
        gridHelper.material.opacity = 0.15;
        gridHelper.material.transparent = true;
        structuresGroup.add(gridHelper);

        // --- SOLID ELEMENTS (Draft My House configurator structures) ---
        const concreteMaterial = new THREE.MeshStandardMaterial({
            color: 0x444649, // Muted slate gray
            roughness: 0.8,
            metalness: 0.15
        });

        const timberMaterial = new THREE.MeshStandardMaterial({
            color: 0x5C402B, // Deep dark timber wood
            roughness: 0.6,
            metalness: 0.05
        });

        const brassMaterial = new THREE.MeshStandardMaterial({
            color: 0xC5A880, // Gold brass columns
            roughness: 0.25,
            metalness: 0.95
        });

        // Floor slab base (geometries start at 1x1x1 and scale in JS)
        floorSlab = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 1), concreteMaterial);
        floorSlab.position.set(0, -1.2, 0);
        solidGroup.add(floorSlab);

        // Roof ceiling slab
        roofSlab = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 1), timberMaterial);
        roofSlab.position.set(0, 1.2, 0);
        solidGroup.add(roofSlab);

        // Generate 10 column elements beforehand (we hide/re-arrange them in JS)
        for (let i = 0; i < 10; i++) {
            const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.4, 0.16), brassMaterial);
            pillar.position.set(0, 0, 0);
            pillar.visible = false;
            solidGroup.add(pillar);
            pillarsArray.push(pillar);
        }

        // Furniture layout group
        furnitureGroup = new THREE.Group();
        solidGroup.add(furnitureGroup);

        // Sofa Area Rug
        const rug = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.01, 2.4), new THREE.MeshStandardMaterial({
            color: 0x1A1B1C,
            roughness: 0.9
        }));
        rug.position.set(0, -1.13, 0);
        furnitureGroup.add(rug);

        // Main Luxury Sofa
        const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 1.6), new THREE.MeshStandardMaterial({
            color: 0xEEEEEE, // Alabaster fabric
            roughness: 0.75
        }));
        sofaMain.position.set(-0.4, -0.95, 0);
        furnitureGroup.add(sofaMain);

        // Sofa side chair
        const sofaSide = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.6), new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.75
        }));
        sofaSide.position.set(0.1, -0.95, 0.9);
        furnitureGroup.add(sofaSide);

        // Low Marble Coffee Table
        const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 1.0), new THREE.MeshStandardMaterial({
            color: 0xC5A880, // Gold brass legs/rims representation
            roughness: 0.15,
            metalness: 0.8
        }));
        coffeeTable.position.set(0.2, -1.03, -0.2);
        furnitureGroup.add(coffeeTable);
    }

    function createParticleSystem() {
        const particleCount = 1200;
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const goldColor = new THREE.Color(0xC5A880);
        const darkColor = new THREE.Color(0x333333);

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 35;
            const y = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 20;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const mixRatio = Math.random();
            const mixedColor = new THREE.Color();
            mixedColor.lerpColors(darkColor, goldColor, mixRatio);

            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext("2d");
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            map: texture,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function onMouseMove(e) {
        if (!isInitialized) return;
        targetMouse.x = (e.clientX / width) * 2 - 1;
        targetMouse.y = -(e.clientY / height) * 2 + 1;
    }

    function onPageChanged(e) {
        if (!isInitialized) return;
        const targetPage = e.detail.page;
        if (!pageStates[targetPage]) return;
        currentPage = targetPage;
        
        const state = pageStates[targetPage];

        // Smoothly transition camera positions using GSAP
        gsap.to(camera.position, {
            x: state.camX,
            y: state.camY,
            z: state.camZ,
            duration: 2.0,
            ease: "power2.out"
        });

        // Toggle visibility & scales between wireframe structures and solid sculpture
        if (targetPage === "draft") {
            solidGroup.visible = true;
            gsap.to(solidGroup.scale, {
                x: state.structScale,
                y: state.structScale,
                z: state.structScale,
                duration: 2.2,
                ease: "elastic.out(1, 0.75)"
            });

            gsap.to(structuresGroup.scale, {
                x: 0.001,
                y: 0.001,
                z: 0.001,
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => {
                    structuresGroup.visible = false;
                }
            });
        } else {
            structuresGroup.visible = true;
            gsap.to(structuresGroup.scale, {
                x: state.structScale,
                y: state.structScale,
                z: state.structScale,
                duration: 2.0,
                ease: "power2.out"
            });

            gsap.to(solidGroup.scale, {
                x: 0.001,
                y: 0.001,
                z: 0.001,
                duration: 1.2,
                ease: "power2.out",
                onComplete: () => {
                    solidGroup.visible = false;
                }
            });
        }
    }

    // "Draft My House" Configuration Listener
    function onDraftChanged(e) {
        if (!isInitialized) return;
        const config = e.detail;
        
        // Base geometry units (Box is 1x1x1 by default)
        // Multiplier 0.25 to scale range 6m - 18m to comfortable WebGL bounds (1.5 - 4.5 units)
        const scaleX = config.length * 0.25;
        const scaleZ = config.width * 0.25;

        // 1. Smoothly scale Floor & Roof slabs using GSAP
        gsap.to(floorSlab.scale, {
            x: scaleX,
            z: scaleZ,
            duration: 0.6,
            ease: "power2.out"
        });
        gsap.to(roofSlab.scale, {
            x: scaleX,
            z: scaleZ,
            duration: 0.6,
            ease: "power2.out"
        });

        // 2. Recalculate columns positions based on X/Z boundaries
        const halfX = scaleX / 2 - 0.08; // margin offset
        const halfZ = scaleZ / 2 - 0.08; // margin offset
        
        let targetCoords = [];

        if (config.pillars === 4) {
            targetCoords = [
                { x: -halfX, z: -halfZ },
                { x: halfX, z: -halfZ },
                { x: halfX, z: halfZ },
                { x: -halfX, z: halfZ }
            ];
        } else if (config.pillars === 6) {
            targetCoords = [
                // 4 corners
                { x: -halfX, z: -halfZ },
                { x: halfX, z: -halfZ },
                { x: halfX, z: halfZ },
                { x: -halfX, z: halfZ },
                // 2 middle coordinates along the longer side
                scaleX >= scaleZ 
                    ? { x: 0, z: -halfZ } 
                    : { x: -halfX, z: 0 },
                scaleX >= scaleZ 
                    ? { x: 0, z: halfZ } 
                    : { x: halfX, z: 0 }
            ];
        } else if (config.pillars === 8) {
            targetCoords = [
                // 4 corners
                { x: -halfX, z: -halfZ },
                { x: halfX, z: -halfZ },
                { x: halfX, z: halfZ },
                { x: -halfX, z: halfZ },
                // 4 side mid-points
                { x: 0, z: -halfZ },
                { x: 0, z: halfZ },
                { x: -halfX, z: 0 },
                { x: halfX, z: 0 }
            ];
        } else if (config.pillars === 10) {
            // 4 corners, 4 mid-points along length, 2 mid-points along width
            const thirdX = halfX / 3;
            targetCoords = [
                // corners
                { x: -halfX, z: -halfZ },
                { x: halfX, z: -halfZ },
                { x: halfX, z: halfZ },
                { x: -halfX, z: halfZ },
                // mid points along length sides
                { x: -thirdX, z: -halfZ },
                { x: thirdX, z: -halfZ },
                { x: -thirdX, z: halfZ },
                { x: thirdX, z: halfZ },
                // mid points along width sides
                { x: -halfX, z: 0 },
                { x: halfX, z: 0 }
            ];
        }

        // Loop through pillars and position them
        for (let i = 0; i < 10; i++) {
            const pillar = pillarsArray[i];
            if (i < config.pillars) {
                const coord = targetCoords[i];
                pillar.visible = true;
                
                // Slide pillars into coordinates
                gsap.to(pillar.position, {
                    x: coord.x,
                    z: coord.z,
                    duration: 0.6,
                    ease: "power2.out"
                });

                // Scale up
                gsap.to(pillar.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                // Shrink and hide pillars
                gsap.to(pillar.scale, {
                    x: 0.001,
                    y: 0.001,
                    z: 0.001,
                    duration: 0.4,
                    onComplete: () => {
                        pillar.visible = false;
                    }
                });
            }
        }

        // 3. Furniture visibility configuration
        if (config.furniture) {
            furnitureGroup.visible = true;
            gsap.to(furnitureGroup.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.6,
                ease: "back.out(1.5)"
            });
        } else {
            gsap.to(furnitureGroup.scale, {
                x: 0.001,
                y: 0.001,
                z: 0.001,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    furnitureGroup.visible = false;
                }
            });
        }
    }

    function onWindowResize() {
        if (!isInitialized) return;
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function animate() {
        if (!isInitialized) return;
        requestAnimationFrame(animate);

        // 1. Interpolate mouse positions for smooth parallax rotation
        const lerpFactor = 0.05;
        mouse.x += (targetMouse.x - mouse.x) * lerpFactor;
        mouse.y += (targetMouse.y - mouse.y) * lerpFactor;

        // 2. Rotate structural assets slowly, augmented by mouse movements
        const baseSpeed = pageStates[currentPage].particleSpeed;
        
        if (structuresGroup.visible) {
            structuresGroup.rotation.y += baseSpeed;
            structuresGroup.rotation.x = pageStates[currentPage].structRotX + (mouse.y * 0.15);
            structuresGroup.rotation.y += mouse.x * 0.15;
        }

        if (solidGroup.visible) {
            // Keep rotation subtle on draft view so they can read dimensions clearly
            solidGroup.rotation.y += baseSpeed * 0.5;
            solidGroup.rotation.x = pageStates[currentPage].structRotX + (mouse.y * 0.08);
            solidGroup.rotation.y += mouse.x * 0.08;
        }

        // 3. Move/rotate particles slightly for dynamic breathing feel
        particles.rotation.y -= baseSpeed * 0.5;
        particles.rotation.x += baseSpeed * 0.2;

        // 4. Rotate golden point light key in orbit around structure
        lightAngle += 0.012;
        pointLight.position.x = Math.cos(lightAngle) * 6;
        pointLight.position.z = Math.sin(lightAngle) * 6;

        // 5. Subtle camera sway based on mouse position
        camera.position.x += (pageStates[currentPage].camX + (mouse.x * 0.8) - camera.position.x) * 0.05;
        camera.position.y += (pageStates[currentPage].camY + (mouse.y * 0.8) - camera.position.y) * 0.05;

        // Lerp camera target looking center smoothly (centering right on Draft page, center on others)
        const targetLookX = (currentPage === "draft") ? 1.5 : 0;
        lookAtTarget.x += (targetLookX - lookAtTarget.x) * 0.05;
        camera.lookAt(lookAtTarget);

        renderer.render(scene, camera);
    }

    // Initialize 3D elements once ThreeJS is loaded
    if (typeof THREE !== "undefined") {
        init();
    } else {
        console.error("Three.js not found. 3D WebGL background could not initialize.");
    }
})();
