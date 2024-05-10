document.getElementById('getPackages').addEventListener('click', getPackages);
var usernameInput = document.getElementById('username');

var urlParams = new URLSearchParams(window.location.search);
var shareLinkButton = document.getElementById('shareLink');
var username = urlParams.get('username');
if(!username && localStorage.getItem('username')) {
    username = localStorage.getItem('username');
}

if (username) {
    usernameInput.value = username;
    getPackages();
}

async function getPackages() {
    var username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    var response = await fetch('https://registry.npmjs.org/-/v1/search?text=author:' + username);
    var data = await response.json();
    var packageList = document.getElementById('packageList');
    packageList.innerHTML = '';
    var totalDownloads = 0;
    for (var pkg of data.objects) {
        var downloads = await getDownloads(pkg.package.name);
        totalDownloads += downloads;
        var li = document.createElement('li');
        li.textContent = pkg.package.name + ' - ' + downloads + ' downloads last month';
        packageList.appendChild(li);
    }
    document.getElementById('totalDownloads').textContent = 'Total downloads last month: ' + totalDownloads;
}

async function getDownloads(packageName) {
    var response = await fetch('https://api.npmjs.org/downloads/point/last-month/' + packageName);
    var data = await response.json();
    return data.downloads;
}

const checkDisable = () => shareLinkButton.disabled = !usernameInput.value
checkDisable();
usernameInput.addEventListener('input', checkDisable);

document.getElementById('shareLink').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a username first.');
    }

    const url = window.location.href.split('?')[0];
    const link = url + '?username=' + username;
    navigator.clipboard.writeText(link).then(function() {
        alert('Link copied to clipboard!');
    }).catch(function(error) {
        console.error('Could not copy text: ', error);
    });
});