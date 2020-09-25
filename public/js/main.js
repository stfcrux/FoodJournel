

// client side 
// checkbox name is the id of the check box input 
// message id is the ID of the message, in this case its the error message id yo u want to show
// subit id is the save button etc
function ensureOneCheck(checkBoxName, messageId, submitId) {
	const checkBoxes = document.getElementsByName(checkBoxName);
	console.log("Checkboxes: " + checkBoxes.length);
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