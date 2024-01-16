let translations; // Declare translations in the broader scope

// Function to translate elements based on the current language
function translate(language) {
    // Iterate through all elements with the 'data-i18n' attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations && translations[language] && translations[language][key]) {
            if (element.tagName === 'IMG') {
                element.src = translations[language][key];
            } else {
                element.textContent = translations[language][key];
            }
        }
    });
}

// Function to update image sources based on the selected language
function updateImageSources(language) {
    const img_a = document.getElementById('img_a');
    const img_b = document.getElementById('img_b');

    // Use the language parameter to determine the correct image source
    img_a.src = translations[language]['img_a'];
    img_b.src = translations[language]['img_b'];
}

// Function to update the URL with the language parameter
function updateLanguageParameter(language) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url);
}

// Function to fetch JSON data asynchronously
function fetchTranslations(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                translations = JSON.parse(xhr.responseText);
                callback(translations);
            } else {
                console.error('Failed to load translations.');
            }
        }
    };
    xhr.open('GET', 'assets/script/translations.json', true);
    xhr.send();
}

// Set initial language based on HTML lang attribute
const initialLanguage = document.documentElement.lang.toLowerCase();

// Fetch translations and execute the main logic
fetchTranslations(function () {
    translate(initialLanguage);
    updateImageSources(initialLanguage);

    // Event listener for language switch button
    document.getElementById('language').addEventListener('click', function () {
        
        var newLanguage;
        var currentTitle = document.title.trim().toLowerCase();

        if (document.documentElement.lang.toLowerCase() === 'en' && currentTitle === "wikicurrícula uruguay") {
            newLanguage = 'es';
        } else if (document.documentElement.lang.toLowerCase() === 'en' && currentTitle === "wikicurrícula ghana") {
            newLanguage = 'es';
        } else {
            newLanguage = 'en';
        }
        
        document.documentElement.lang = newLanguage;
        translate(newLanguage);
        updateImageSources(newLanguage);
        updateLanguageParameter(newLanguage);
    });
});
