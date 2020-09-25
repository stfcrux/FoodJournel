function ensureOneCheck(checkBoxName, messageId, submitId) {
    const checkBoxes = document.getElementsByName(checkBoxName);
    let checkCount = 0;
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked)
            checkCount++;
    }
    if (checkCount === 0) {
        document.getElementById(messageId).style.display = 'block';
        document.getElementById(submitId).disabled = true;
        return false;
    } else {
        document.getElementById(messageId).style.display = 'none';
        document.getElementById(submitId).disabled = false;
        return true;
    }
}
function initialiseTitle() {
    let title = document.getElementById('title').value;
    let titleArr = [];
    let initTitle = '';
    if (title !== undefined) {
        titleArr = title.trim().split(' ');
        for (let i = 0; i < titleArr.length; i++) {
            initTitle += titleArr[i].charAt(0).toUpperCase() + titleArr[i].slice(1) + ' ';
        }
        console.log(`Initialised title: ${initTitle}`);
        document.getElementById('title').value = initTitle;
    }
}