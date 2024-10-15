const orbit = document.getElementById('orbit');
    const profile = document.getElementById('profile');
    const projectDetails = document.getElementById('projectDetails');
    let rotationY = 0;
    let targetRotationY = 0;
    const rotationSpeed = 0.05;
    const scrollSensitivity = 0.02;

    // Load projects from JSON file
    fetch('projects.json')
    .then(response => response.json())
    .then(projects => {
        projects.forEach((project, i) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            const angle = (i / projects.length) * Math.PI * 2;
            const radius = 500;
            projectElement.style.transform = `
                rotateY(${i * (360 / projects.length)}deg)
                translateZ(${radius}px)
            `;
            projectElement.dataset.projectId = i;

            // Set the background image for the project element
            projectElement.style.backgroundImage = `url(${project.thumbnailImageUrl})`;
            projectElement.style.backgroundSize = 'cover'; // Ensure the image covers the entire element
            projectElement.style.backgroundPosition = 'center'; // Center the image
            
            orbit.appendChild(projectElement);

            // Attach event listener to show project details
            projectElement.addEventListener('click', () => showProjectDetails(project));
        });
    });


    // Default rotation
    setInterval(() => {
        rotationY += rotationSpeed;
        gsap.to(orbit, {
            duration: 0.1,
            rotationY: rotationY,
            ease: "power1.out"
        });
        gsap.to(profile, {
            duration: 0.1,
            rotationY: -rotationY,
            ease: "power1.out"
        });
    }, 50);

    // Smooth scroll animation for mouse wheel
    let animation;
    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        updateRotation(e.deltaY);
    }, { passive: false });

    // Smooth scroll animation for touch swipe
    let startY;
    window.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
        const deltaY = startY - e.touches[0].clientY;
        updateRotation(deltaY);
        startY = e.touches[0].clientY; // Update startY for continuous movement
    });

    function updateRotation(deltaY) {
        if (animation) animation.kill();
        targetRotationY += deltaY * scrollSensitivity; // Update target rotation based on scroll/swipe

        // Animate orbit rotation
        animation = gsap.to(orbit, {
            duration: 0.5,
            ease: "power2.out",
            rotationY: targetRotationY,
            onUpdate: () => {
                // Update rotationY for profile
                rotationY = targetRotationY;
                gsap.to(profile, {
                    duration: 0.5,
                    ease: "power2.out",
                    rotationY: -rotationY
                });
            }
        });
    }

    function showProjectDetails(project) {
        projectDetails.innerHTML = `
            <div class="project-details-content">
                <span class="close-button" onclick="closeProjectDetails()">×</span>
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <img src="${project.detailImageUrl}" alt="${project.title}" style="max-width: 80%; height: auto;" />
                <div class="project-links">
                    <a href="${project.links.code}" target="_blank" class="project-link-button">Code</a>
                    <a href="${project.links.demo}" target="_blank" class="project-link-button">Demo</a>
                </div>
            </div>
        `;
        projectDetails.style.display = 'block';
        document.getElementById('overlay').style.display = 'block'; // Show overlay


        // Add event listener to detect clicks outside the project details
        window.addEventListener('click', outsideClickHandler);
    }

    // Close the details if clicking outside the modal
    function outsideClickHandler(event) {
        if (event.target.id === 'closeButton' || event.target === document.getElementById('overlay')) {
            closeProjectDetails();
        }
    }

    function closeProjectDetails() {
        projectDetails.style.display = 'none';
        document.getElementById('overlay').style.display = 'none'; // Hide overlay

        // Remove the event listener when closing the modal
        window.removeEventListener('click', outsideClickHandler);
    }

     