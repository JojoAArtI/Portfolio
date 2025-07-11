document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu li');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Function to handle active menu item and content display
    function showSection(sectionId) {
        // Remove active class from all menu items and hide all content sections
        menuItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        // Add active class to the selected menu item
        const activeMenuItem = document.querySelector(`.menu li[data-section="${sectionId}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }

        // Display the selected content section
        const activeSection = document.getElementById(`${sectionId}-content`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    // Set 'home' as the default active section on page load
    showSection('home'); 

    // Event listeners for menu items
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const sectionId = item.dataset.section;
            showSection(sectionId);
        });
    });

    // --- Resume Zoom Functionality ---
    const resumeImage = document.querySelector('.resume-display .zoomable-image');
    if (resumeImage) {
        resumeImage.addEventListener('click', () => {
            resumeImage.classList.toggle('zoomed');
            // Optional: Hide/show zoom instruction
            const zoomInstruction = document.querySelector('.zoom-instruction');
            if (zoomInstruction) {
                zoomInstruction.style.display = resumeImage.classList.contains('zoomed') ? 'none' : 'block';
            }
        });
    }

    // --- Utility function for Copy Buttons ---
    function setupCopyButton(buttonElement, targetTextareaId, messageSpanId) {
        buttonElement.addEventListener('click', () => {
            const textarea = document.getElementById(targetTextareaId);
            const messageSpan = document.getElementById(messageSpanId);
            
            textarea.select();
            textarea.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');

            messageSpan.textContent = 'Copied!';
            messageSpan.classList.add('show');
            setTimeout(() => {
                messageSpan.classList.remove('show');
                messageSpan.textContent = '';
            }, 2000);
        });
    }

    // --- CSS Box Shadow Generator Functionality ---
    const shadowOffsetX = document.getElementById('shadowOffsetX');
    const shadowOffsetY = document.getElementById('shadowOffsetY');
    const shadowBlurRadius = document.getElementById('shadowBlurRadius');
    const shadowSpreadRadius = document.getElementById('shadowSpreadRadius');
    const shadowColor = document.getElementById('shadowColor');
    const insetShadow = document.getElementById('insetShadow');
    const boxShadowPreviewBox = document.getElementById('box-shadow-preview-box');
    const boxShadowCssCode = document.getElementById('box-shadow-css-code');
    const copyBoxShadowButton = document.querySelector('.copy-button[data-target="box-shadow-css-code"]');
    const boxShadowCopyMessage = document.getElementById('box-shadow-copy-message');

    // Value displays
    const shadowOffsetXValue = document.getElementById('shadowOffsetX-value');
    const shadowOffsetYValue = document.getElementById('shadowOffsetY-value');
    const shadowBlurRadiusValue = document.getElementById('shadowBlurRadius-value'); // Corrected variable name
    const shadowSpreadRadiusValue = document.getElementById('shadowSpreadRadius-value');

    function updateBoxShadow() {
        const x = shadowOffsetX.value;
        const y = shadowOffsetY.value;
        const blur = shadowBlurRadius.value;
        const spread = shadowSpreadRadius.value;
        const color = shadowColor.value;
        const inset = insetShadow.checked ? 'inset' : '';

        const cssValue = `${inset} ${x}px ${y}px ${blur}px ${spread}px ${color}`.trim();
        boxShadowPreviewBox.style.boxShadow = cssValue;
        boxShadowCssCode.value = `box-shadow: ${cssValue};`;

        // Update value displays
        shadowOffsetXValue.textContent = `${x}px`;
        shadowOffsetYValue.textContent = `${y}px`;
        shadowBlurRadiusValue.textContent = `${blur}px`; // Corrected variable usage
        shadowSpreadRadiusValue.textContent = `${spread}px`;
    }

    // Event listeners for generator controls
    shadowOffsetX.addEventListener('input', updateBoxShadow);
    shadowOffsetY.addEventListener('input', updateBoxShadow);
    shadowBlurRadius.addEventListener('input', updateBoxShadow);
    shadowSpreadRadius.addEventListener('input', updateBoxShadow);
    shadowColor.addEventListener('input', updateBoxShadow);
    insetShadow.addEventListener('change', updateBoxShadow);
    
    // Setup copy button for Box Shadow
    setupCopyButton(copyBoxShadowButton, 'box-shadow-css-code', 'box-shadow-copy-message');

    // Initial update on page load for Box Shadow
    updateBoxShadow();


    // --- CSS Border Radius Generator Functionality ---
    const borderRadiusTopLeft = document.getElementById('borderRadiusTopLeft');
    const borderRadiusTopRight = document.getElementById('borderRadiusTopRight');
    const borderRadiusBottomRight = document.getElementById('borderRadiusBottomRight');
    const borderRadiusBottomLeft = document.getElementById('borderRadiusBottomLeft');
    const borderRadiusPreviewBox = document.getElementById('border-radius-preview-box');
    const borderRadiusCssCode = document.getElementById('border-radius-css-code');
    const copyBorderRadiusButton = document.querySelector('.copy-button[data-target="border-radius-css-code"]');
    const borderRadiusCopyMessage = document.getElementById('border-radius-copy-message');

    // Value displays
    const borderRadiusTopLeftValue = document.getElementById('borderRadiusTopLeft-value');
    const borderRadiusTopRightValue = document.getElementById('borderRadiusTopRight-value');
    const borderRadiusBottomRightValue = document.getElementById('borderRadiusBottomRight-value');
    const borderRadiusBottomLeftValue = document.getElementById('borderRadiusBottomLeft-value');

    function updateBorderRadius() {
        const tl = borderRadiusTopLeft.value;
        const tr = borderRadiusTopRight.value;
        const br = borderRadiusBottomRight.value;
        const bl = borderRadiusBottomLeft.value;

        const cssValue = `${tl}px ${tr}px ${br}px ${bl}px`;
        borderRadiusPreviewBox.style.borderRadius = cssValue;
        borderRadiusCssCode.value = `border-radius: ${cssValue};`;

        // Update value displays
        borderRadiusTopLeftValue.textContent = `${tl}px`;
        borderRadiusTopRightValue.textContent = `${tr}px`;
        borderRadiusBottomRightValue.textContent = `${br}px`;
        borderRadiusBottomLeftValue.textContent = `${bl}px`;
    }

    // Event listeners for border radius controls
    borderRadiusTopLeft.addEventListener('input', updateBorderRadius);
    borderRadiusTopRight.addEventListener('input', updateBorderRadius);
    borderRadiusBottomRight.addEventListener('input', updateBorderRadius);
    borderRadiusBottomLeft.addEventListener('input', updateBorderRadius);

    // Setup copy button for Border Radius
    setupCopyButton(copyBorderRadiusButton, 'border-radius-css-code', 'border-radius-copy-message');

    // Initial update for Border Radius
    updateBorderRadius();


    // --- CSS Linear Gradient Generator Functionality ---
    const gradientAngle = document.getElementById('gradientAngle');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor2 = document.getElementById('gradientColor2');
    const linearGradientPreviewBox = document.getElementById('linear-gradient-preview-box');
    const linearGradientCssCode = document.getElementById('linear-gradient-css-code');
    const copyLinearGradientButton = document.querySelector('.copy-button[data-target="linear-gradient-css-code"]');
    const linearGradientCopyMessage = document.getElementById('linear-gradient-copy-message');

    // Value display
    const gradientAngleValue = document.getElementById('gradientAngle-value');

    function updateLinearGradient() {
        const angle = gradientAngle.value;
        const color1 = gradientColor1.value;
        const color2 = gradientColor2.value;

        const cssValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        linearGradientPreviewBox.style.background = cssValue;
        linearGradientCssCode.value = `background: ${cssValue};`;

        // Update value display
        gradientAngleValue.textContent = `${angle}deg`;
    }

    // Event listeners for linear gradient controls
    gradientAngle.addEventListener('input', updateLinearGradient);
    gradientColor1.addEventListener('input', updateLinearGradient);
    gradientColor2.addEventListener('input', updateLinearGradient);

    // Setup copy button for Linear Gradient
    setupCopyButton(copyLinearGradientButton, 'linear-gradient-css-code', 'linear-gradient-copy-message');

    // Initial update for Linear Gradient
    updateLinearGradient();

    // --- NEW: Text Shadow Generator Functionality ---
    const textShadowOffsetX = document.getElementById('textShadowOffsetX');
    const textShadowOffsetY = document.getElementById('textShadowOffsetY');
    const textShadowBlurRadius = document.getElementById('textShadowBlurRadius');
    const textShadowColor = document.getElementById('textShadowColor');
    const textColor = document.getElementById('textColor');
    const textShadowPreviewBox = document.getElementById('text-shadow-preview-box');
    const textShadowCssCode = document.getElementById('text-shadow-css-code');
    const copyTextShadowButton = document.querySelector('.copy-button[data-target="text-shadow-css-code"]');
    const textShadowCopyMessage = document.getElementById('text-shadow-copy-message');

    // Value displays
    const textShadowOffsetXValue = document.getElementById('textShadowOffsetX-value');
    const textShadowOffsetYValue = document.getElementById('textShadowOffsetY-value');
    const textShadowBlurRadiusValue = document.getElementById('textShadowBlurRadius-value');

    function updateTextShadow() {
        const x = textShadowOffsetX.value;
        const y = textShadowOffsetY.value;
        const blur = textShadowBlurRadius.value;
        const shadowColorVal = textShadowColor.value;
        const textColorVal = textColor.value;

        const cssShadowValue = `${x}px ${y}px ${blur}px ${shadowColorVal}`;
        textShadowPreviewBox.style.textShadow = cssShadowValue;
        textShadowPreviewBox.style.color = textColorVal;
        textShadowCssCode.value = `color: ${textColorVal};\ntext-shadow: ${cssShadowValue};`;

        // Update value displays
        textShadowOffsetXValue.textContent = `${x}px`;
        textShadowOffsetYValue.textContent = `${y}px`;
        textShadowBlurRadiusValue.textContent = `${blur}px`;
    }

    // Event listeners for text shadow controls
    textShadowOffsetX.addEventListener('input', updateTextShadow);
    textShadowOffsetY.addEventListener('input', updateTextShadow);
    textShadowBlurRadius.addEventListener('input', updateTextShadow);
    textShadowColor.addEventListener('input', updateTextShadow);
    textColor.addEventListener('input', updateTextShadow);

    // Setup copy button for Text Shadow
    setupCopyButton(copyTextShadowButton, 'text-shadow-css-code', 'text-shadow-copy-message');

    // Initial update for Text Shadow
    updateTextShadow();
});