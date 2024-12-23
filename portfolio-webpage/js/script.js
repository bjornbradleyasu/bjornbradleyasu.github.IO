// Select elements from the DOM
const slider = document.getElementById('content-slider');
const dynamicText = document.getElementById('text-container');

// Text content for the slider options
const aboutMeText = `
    <h2>About Me</h2>
    <p> I’m a junior at Arizona State University majoring in Media Arts and Sciences, specializing in front-end programming and audio processing. My passion lies at the intersection of technology and sound, where I aim to contribute to the ever-evolving field of music technology.</p>
    <p> Through my years of IT experience, I’ve developed strong technical problem-solving skills, troubleshooting complex systems, maintaining hardware and software, and collaborating on solutions under pressure. </p>
    <p> I’ve combined this technical foundation with hands-on experience in audio production. While volunteering with the Wisconsin Chamber Orchestra during their renowned Concerts on the Square series, I assisted with live event setups and gained invaluable insight into the logistics and execution of large-scale audio systems. Additionally, I worked in a professional recording studio at ASU, where I assisted with audio equipment setup, sound design, and recording workflows. </p>
    <p> This blend of IT proficiency and studio exposure gives me a unique perspective in approaching audio challenges with both technical precision and creative insight. I’m passionate about leveraging technology to enhance the way sound is captured, produced, and experienced. </p>
    <p> I’m actively seeking opportunities in music technology, such as roles in audio software development, technical support for music platforms, or any projects combining technology and sound. If you’re looking for someone with technical expertise, a passion for audio innovation, and a commitment to delivering transformative sound experiences, let’s connect! </p>
`;

const experienceText = `
    <h2>Experience</h2>

`;

const skillsText = `
    <h2>Skills</h2>

`;

const courseworkText = `
    <h2>Coursework</h2>
`;

// Function to update the text content dynamically
function updateTextContent(value) {
    // Debugging log to ensure slider value is correctly passed
    console.log(`Updating text content for value: ${value}`);
    
    // Fade out the text before updating
    dynamicText.style.opacity = '0';
    setTimeout(() => {
        // Update text content based on the slider value
        if (value === "0") {
            dynamicText.innerHTML = aboutMeText; // Update with About Me content
        } else if (value === "1") {
            dynamicText.innerHTML = experienceText; // Update with Resume content
        } else if (value === "2") {
            dynamicText.innerHTML = skillsText;
        } else if (value === "3") {
            dynamicText.innerHTML = courseworkText;
        }

        // Fade the text back in
        dynamicText.style.opacity = '1';
    }, 300); // Matches the CSS transition duration
}

// Select language buttons
const languageButtons = document.querySelectorAll('.language-btn');

// Add event listener to each button
languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Get the language code from the button
        const selectedLang = button.textContent;

        // Update the `lang` attribute of the <html> tag
        document.documentElement.setAttribute('lang', selectedLang.toLowerCase());

        // Notify the user that the language has been changed
        console.log(`Language set to: ${selectedLang}`);

        // Prompt browser translation
        alert(`The site language has been set to ${selectedLang}. Use your browser's translation feature if needed.`);
    });
});

// Event listener for slider input changes
slider.addEventListener('input', () => {
    const sliderValue = slider.value; // Get the current slider value
    console.log(`Slider value changed: ${sliderValue}`); // Debugging log
    updateTextContent(sliderValue); // Update content based on slider value
});

// Initialize default content based on the slider's initial value
updateTextContent(slider.value);

// Select the spinning record element
const spinningRecord = document.querySelector('.spinning-record');

// Select the play and stop buttons
const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');

// Function to start the spinning animation
playButton.addEventListener('click', () => {
    spinningRecord.style.animationPlayState = 'running'; // Resume the animation
    console.log("Record spinning started"); // Log for debugging
});

// Function to stop the spinning animation
stopButton.addEventListener('click', () => {
    spinningRecord.style.animationPlayState = 'paused'; // Pause the animation
    console.log("Record spinning stopped"); // Log for debugging
});
