function createRoomAndShareScreen() {
  const baseUrlValue = document
    .getElementById('baseURL')
    .value.trim()
    .replace(/\/+$/, '');
  localStorage.setItem('daily-chrome-extension-baseurl', baseUrlValue);
  const shareableRoomUrlInput = document.getElementById('screenShareURL');
  if (baseUrlValue) {
    fetch(`${baseUrlValue}/api/rooms`, {
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
  // Only disable base URL input if there isn't content
  button.disabled = !e.target.value;
}
function clearLocalStorage() {
  localStorage.removeItem('daily-chrome-extension-shareurl');
  localStorage.removeItem('daily-chrome-extension-baseurl');
  document.getElementById('baseURL').value = '';
  document.getElementById('screenShareURL').value = '';
}

function getAndSetLocalStorageItems() {
  const shareableLink = localStorage.getItem('daily-chrome-extension-shareurl');
  const baseURL = localStorage.getItem('daily-chrome-extension-baseurl');
  if (shareableLink) {
    document.getElementById('screenShareURL').value = shareableLink;
  }
  if (baseURL) {
    document.getElementById('baseURL').value = baseURL;
    document.getElementsByClassName('share-button')[0].disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  getAndSetLocalStorageItems();

  const baseUrlInput = document.getElementById('baseURL');
  baseUrlInput.addEventListener('input', function (e) {
    handleBaseInputChange(e);
  });

  // handle create room button click
  const shareButton = document.getElementsByClassName('share-button')[0];
  shareButton.addEventListener('click', function () {
    createRoomAndShareScreen();
  });

  // give option to clear shareable URL from local storage
  const clearButton = document.getElementsByClassName('clear-button')[0];
  clearButton.addEventListener('click', function () {
    clearLocalStorage();
  });
});
