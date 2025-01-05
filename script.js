const mainImage = document.querySelector('.main-image');
let thumbnails = document.querySelectorAll('.thumbnail');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const imageCounter = document.querySelector('.image-counter');
const imageTitle = document.querySelector('.image-title');
const imageDescription = document.querySelector('.image-description');
const thumbnailContainer = document.querySelector('.thumbnail-container');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const fullscreenToggle = document.querySelector('.fullscreen-toggle');
const imageUploadInput = document.getElementById('image-upload');

let currentIndex = 0;
let isAnimating = false; // Preventing multiple clicks during animation

// Function to update the main image and related details
function updateImage(index) {
    if (isAnimating) return; // Prevent updates while animation is in progress
    isAnimating = true;

    // Animate main image fade out
    mainImage.classList.add('fade-out');
    setTimeout(() => {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        mainImage.src = thumbnails[index].src;
        imageTitle.textContent = thumbnails[index].dataset.title || 'New Image';
        imageDescription.textContent = thumbnails[index].dataset.description || 'Uploaded Image';
        imageCounter.textContent = `${index + 1} / ${thumbnails.length}`;
        currentIndex = index;

        // Animate main image fade in
        mainImage.classList.remove('fade-out');
        mainImage.classList.add('fade-in');
        
        setTimeout(() => {
            mainImage.classList.remove('fade-in');
            isAnimating = false; // Enable further updates
        }, 300); // Match with the animation duration
    }, 300); // Match with the fade-out duration
}

// Navigation functions with smooth transition
function navigateToNext() {
    updateImage((currentIndex + 1) % thumbnails.length);
}

function navigateToPrev() {
    updateImage((currentIndex - 1 + thumbnails.length) % thumbnails.length);
}

// Event listeners for navigation buttons
prevButton.addEventListener('click', navigateToPrev);
nextButton.addEventListener('click', navigateToNext);

// Event listeners for thumbnail clicks
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => updateImage(index));
});

// Handle image upload and display it in the gallery
imageUploadInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('image', files[0]);

        fetch('/upload/', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const imageUrl = data.imageUrl;

                // Create a new thumbnail and add it to the gallery
                const img = document.createElement('img');
                img.src = imageUrl;
                img.classList.add('thumbnail');
                img.dataset.title = 'New Image';  // You can replace this with dynamic title if needed
                img.dataset.description = 'Uploaded Image';  // You can replace this with dynamic description if needed

                thumbnailContainer.appendChild(img);
                thumbnails = document.querySelectorAll('.thumbnail');
                img.addEventListener('click', () => updateImage(Array.from(thumbnails).indexOf(img)));
            } else {
                alert('Upload failed');
            }
        })
        .catch(error => console.error('Error uploading image:', error));
    }
});

// Scroll thumbnails left and right
scrollLeftBtn.addEventListener('click', () => {
    thumbnailContainer.scrollBy({
        left: -150, // Scroll amount
        behavior: 'smooth', // Smooth scrolling
    });
});

scrollRightBtn.addEventListener('click', () => {
    thumbnailContainer.scrollBy({
        left: 150, // Scroll amount
        behavior: 'smooth', // Smooth scrolling
    });
});

// Initialize the gallery with the first image
updateImage(0);

// Fullscreen toggle (functionality added for the toggle)
fullscreenToggle.addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
});
