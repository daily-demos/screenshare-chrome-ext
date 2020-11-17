function createRoomAndShareScreen() {
  const baseUrlValue = document
    .getElementById('baseURL')
    .value.trim()
    .replace(/\/+$/, '');
  localStorage.setItem('daily-chrome-extension-baseurl', baseUrlValue);
  const shareableRoomUrlInput = document.getElementById('screenShareURL');
  if (baseUrlValue) {
    fetch(`${baseUrlValue}/.netlify/functions/rooms/`, {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          const shouldShareScreen = document.getElementById(
            'screenShareCheckbox'
          ).checked
            ? '&screenshare=true'
            : '';
          const url = `${baseUrlValue}/?room=${data.url}${shouldShareScreen}`;
          localStorage.setItem(
            'daily-chrome-extension-shareurl',
            `${baseUrlValue}/?room=${data.url}`
          );
          shareableRoomUrlInput.value = url;
          chrome.tabs.create({ url });
        } else {
          document.getElementsByClassName('error')[0].textContent =
            'Oops! A room url was not returned. Please check your base URL.';
        }
      })
      .catch((err) => {
        console.warn(err);
        document.getElementsByClassName('error')[0].textContent =
          "Oops! That didn't work. Make sure you have a base URL in this format: https://<-your-subdomain->.netlify.app";
      });
  } else {
    document.getElementsByClassName('error')[0].textContent =
      'Make sure you have a base URL in this format: https://<-your-subdomain->.netlify.app';
  }
}
function handleBaseInputChange(e) {
  const button = document.getElementsByClassName('share-button')[0];
  button.disabled = !e.target.value;
  // todo: add a basic URL validity check
}

document.addEventListener('DOMContentLoaded', function () {
  const shareableLink = localStorage.getItem('daily-chrome-extension-shareurl');
  const baseURL = localStorage.getItem('daily-chrome-extension-baseurl');
  if (shareableLink) {
    document.getElementById('screenShareURL').value = shareableLink;
  }
  if (baseURL) {
    document.getElementById('baseURL').value = baseURL;
    document.getElementsByClassName('share-button')[0].disabled = false;
  }
  // Only disable base URL input if there is content
  const baseUrlInput = document.getElementById('baseURL');
  baseUrlInput.addEventListener('input', function (e) {
    handleBaseInputChange(e);
  });

  // handle share button click
  const shareButton = document.getElementsByClassName('share-button')[0];
  shareButton.addEventListener('click', function () {
    createRoomAndShareScreen();
  });

  // give option to clear shareable URL from local storage
  const clearButton = document.getElementsByClassName('clear-button')[0];
  clearButton.addEventListener('click', function () {
    localStorage.removeItem('daily-chrome-extension-shareurl');
    localStorage.removeItem('daily-chrome-extension-baseurl');
    document.getElementById('baseURL').value = '';
    document.getElementById('screenShareURL').value = '';
  });
});
