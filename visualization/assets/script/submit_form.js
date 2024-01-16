function submitForm() {
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    //  Meta-Wiki API endpoint
    const wikiApiUrl = "https://meta.wikimedia.org/w/api.php";

    // Get an edit token from the Meta-Wiki API
    getEditToken(wikiApiUrl)
        .then(editToken => {
            // Set the retrieved edit token in the hidden field
            document.querySelector('input[name="token"]').value = editToken;

            // Prepare data for the Meta-Wiki API
            const postData = new URLSearchParams({
                'action': 'edit',
                'format': 'json',
                'title': 'Wikicurricula',
                'text': `Email: ${email}\nFeedback: ${feedback}`,
                'token': editToken,
            });

            // Send data to the Meta-Wiki API
            fetch(wikiApiUrl, {
                method: 'POST',
                body: postData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(response => response.json())
            .then(jsonResponse => {
                // Process the API response if needed
                if (jsonResponse.error) {
                    // Handle errors
                    console.error("Error:", jsonResponse.error.info);
                } else {
                    console.log("Form submitted successfully!");
                }
            })
            .catch(error => {
                console.error("Error:", error.message);
            });
        })
        .catch(error => {
            console.error("Failed to retrieve edit token:", error.message);
        });
}

function getEditToken(wikiApiUrl) {
    const tokenUrl = `${wikiApiUrl}?action=query&meta=tokens&type=edit&format=json`;

    return fetch(tokenUrl)
        .then(response => response.json())
        .then(tokenData => {
            if (tokenData.query && tokenData.query.tokens && tokenData.query.tokens.edittoken) {
                return tokenData.query.tokens.edittoken;
            } else {
                throw new Error("Invalid response format");
            }
        });
}