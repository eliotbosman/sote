// GSAP animation 
const letters = document.querySelectorAll('.falling-letters span');
const timeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 1
});

//letter position överge
function shuffleLetters() {
    const container = document.querySelector('.falling-letters');
    const letterArray = Array.from(letters);
    
    letterArray.sort(() => Math.random() - 0.5);
    
    letterArray.forEach(letter => {
        container.appendChild(letter);
    });
}

letters.forEach((letter, index) => {
    gsap.set(letter, {
        y: -100 - Math.random() * 100,
        x: Math.random() * 40 - 20
    });
    
    // timeline
    timeline.to(letter, {
        y: 0,
        duration: 1,
        ease: "bounce.out",
        delay: index * 0.1
    }, 0);
});

// Shuffle letters periodically
setInterval(shuffleLetters, 3000);

document.addEventListener('DOMContentLoaded', function() {
    //  background cars
    const backgroundCars = document.querySelector('.background-cars');
    const numCars = 20; // Number of cars to create
    const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue');
    
    // moma array
    const carImages = [
        'moma-cars/SOTE_MOMA_CAR_2.jpg',
        'moma-cars/SOTE_MOMA_CAR_3.jpg',
        'moma-cars/SOTE_MOMA_CAR_4.jpg',
        'moma-cars/SOTE_MOMA_CAR_6.jpg',
        'moma-cars/SOTE_MOMA_CAR_8.jpg',
        'moma-cars/SOTE_MOMA_CAR_9.jpg',
        'moma-cars/SOTE_MOMA_CAR_10.jpg',
        'moma-cars/SOTE_MOMA_CAR_12.jpg',
        'moma-cars/SOTE_MOMA_CAR_13.jpg',
        'moma-cars/SOTE_MOMA_CAR_14.jpg',
        'moma-cars/SOTE_MOMA_CAR_15.jpg',
        'moma-cars/SOTE_MOMA_CAR_16.jpg',
        'moma-cars/SOTE_MOMA_CAR_18.jpg',
        'moma-cars/SOTE_MOMA_CAR_19.jpg',
        'moma-cars/SOTE_MOMA_CAR_20.jpg'
    ];
    
    const cars = [];
    
    for (let i = 0; i < numCars; i++) {
        const car = document.createElement('div');
        car.className = 'car-bg';
        
        // p position
        const x = Math.random() * 85 + 5;
        const y = Math.random() * 85 + 5;
        car.style.left = `${x}vw`;
        car.style.top = `${y}vh`;
        
        // transform och rotation
        const rotation = Math.random() * 360;
        car.style.transform = `rotate(${rotation}deg)`;
        
        // en random image
        const randomImage = carImages[Math.floor(Math.random() * carImages.length)];
        car.style.backgroundImage = `url('${randomImage}')`;
    
        car.style.backgroundColor = blueColor;
        
        backgroundCars.appendChild(car);
        cars.push(car);
    }
    
    //  animation function
    function updatePositions() {
        cars.forEach(car => {
            // New random position
            const x = Math.random() * 85 + 5;
            const y = Math.random() * 85 + 5;
            const rotation = Math.random() * 360;
            
            // new position with no easing kolla documentation
            anime({
                targets: car,
                left: `${x}vw`,
                top: `${y}vh`,
                rotate: rotation,
                duration: 0,
                easing: 'linear'
            });
        });
    }
    
    setInterval(updatePositions, 2000/12);
    
    const letters = document.querySelectorAll('.falling-letter');
    
    letters.forEach((letter, index) => {
        gsap.from(letter, {
            y: -100,
            opacity: 0,
            duration: 1,
            delay: index * 0.1,
            ease: "bounce.out"
        });
    });
    
    // Shuffle 
    setInterval(() => {
        letters.forEach(letter => {
            gsap.to(letter, {
                y: gsap.utils.random(-20, 20),
                duration: 2,
                ease: "power1.inOut"
            });
        });
    }, 3000);
});
