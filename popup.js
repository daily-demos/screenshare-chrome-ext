function createRoomAndShareScreen() {
    const baseUrlValue = document.getElementById('baseURL').value.trim();
    const shareableRoomUrlInput = document.getElementById('screenShareURL');
    if (baseUrlValue) {
        fetch(`${baseUrlValue}/.netlify/functions/rooms/`, {
            method: "POST",
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.url) {
                    const url = `${baseUrlValue}/?room=${data.url}&screenshare=true`;
                    localStorage.setItem('url', `${baseUrlValue}/?room=${data.url}`);
                    shareableRoomUrlInput.value = url;
                    chrome.tabs.create({ url });
                } else {
                    document.getElementsByClassName('error')[0].textContent = 'Oops! A room url was not returned. Please check your base URL.'
                }
            })
            .catch(err => {
                console.warn(err);
                document.getElementsByClassName('error')[0].textContent = 'Oops! That didn\'t work. Please check your base URL.'
            });
    } else {
        document.getElementsByClassName('error')[0].textContent = 'hi'
    }
}
function handleBaseInputChange(e) {
    const button = document.getElementsByClassName('share-button')[0];
    button.disabled = !e.target.value;
    // todo: add a basic URL validity check
}

document.addEventListener('DOMContentLoaded', function() {
    const shareableLink = localStorage.getItem('url');
    console.log(shareableLink)
    if (shareableLink) {
        document.getElementById('screenShareURL').value = shareableLink;
    }
    // Only disable base URL input if there is content
    const baseUrlInput = document.getElementById('baseURL');
    baseUrlInput.addEventListener('input', function(e) {
        handleBaseInputChange(e);
    });

    // handle share button click
    const shareButton = document.getElementsByClassName('share-button')[0];
    shareButton.addEventListener('click', function() {
        createRoomAndShareScreen();
    });

    // give option to clear shareable URL from local storage
    const clearButton = document.getElementsByClassName('clear-button')[0];
    clearButton.addEventListener('click', function() {
        localStorage.clear();
        document.getElementById('screenShareURL').value = '';
    });
});
