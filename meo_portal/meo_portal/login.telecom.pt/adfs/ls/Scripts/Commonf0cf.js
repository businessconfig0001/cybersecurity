function forceAutoComplete() {
    var $forms = document.getElementsByTagName("FORM");
    for (var i = 0; i < $forms.length; i++) {
        var $form = $forms[i];
        var $submit = document.createElement("INPUT");
        $submit.type = "submit";
        $form.appendChild($submit);
        var $formsubmit = $form.onsubmit;
        $form.onsubmit = function () { return false; }
        $submit.style.display = "none";
        $submit.click();
        $form.onsubmit = $formsubmit;
    }
}

function displaySuccessMsg(show) {
    var errorLabel = document.getElementById('successMessage');
    if (errorLabel !== null) {
        if (show) {
            errorLabel.style.display = 'block';
        }
        else {
            errorLabel.style.display = 'none';
        }
    }
}

function toggleDisplay(elementId) {
    var element = document.getElementById(elementId);
    if (element !== null) {
        if (element.style.display == 'none') {
            element.style.display = 'block';
        }
        else {
            element.style.display = 'none';
        }
    }
}

function hideErrorMsg(hide) {
    hideErrorMsgById('errorMessageContainer', hide);
}

function displayErrorMsg(show) {
    displayErrorMsgById('errorMessageContainer', show);
}

function hideErrorMsgById(id, hide) {
    clearError(id);
}

function displayErrorMsgById(id, show) {
    var errorLabel = document.getElementById(id);
    if (errorLabel !== null) {
        if (show) {
            errorLabel.style.display = 'block';
            setError(id);
        }
        else {
            //errorLabel.style.display = 'none';
            clearError(id);
        }
    }
}

function fillErrorMessage(message) {
    var errorLabel = document.getElementById('errorMessage');

    if (navigator.appName.indexOf('Microsoft') == 0) {
        errorLabel.innerText = message;
    }
    else {
        errorLabel.textContent = message;
    }

    displayErrorMsg(true);
}

function submitClick() {
    var valid = ValidaCampos(); if (!valid) { return false; } else { forceAutoComplete(); return true; }
}

// resize the background image
function resizeBackgroundImage(obj) {
    var winW = getWindowWidth();
    var winH = getWindowHeight();
    if (winW < winH) {
        obj.style.width = '100%';
        obj.style.height = 'auto';
    }
    else {
        obj.style.width = 'auto';
        obj.style.height = '100%';
    }
}

// Get window width
function getWindowWidth() {
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        return winheight = window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
        //IE 6+ in 'standards compliant mode'
        return document.documentElement.clientWidth;
    } else if (document.body && document.body.clientWidth) {
        //IE 4 compatible
        return document.body.clientWidth;
    }
    return 0;
}

// Get window height
function getWindowHeight() {
    if (typeof (window.innerHeight) == 'number') {
        //Non-IE
        return winheight = window.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight) {
        //IE 6+ in 'standards compliant mode'
        return document.documentElement.clientHeight;
    }
    else if (document.body && document.body.clientHeight) {
        //IE 4 compatible
        return document.body.clientHeight;
    }
    return 0;
}

function IsInputTypeAvailable(inputType) {
    var i = document.createElement("input");
    i.setAttribute("type", inputType);
    return inputType == "text" || i.type !== "text";
}

var EmailControlAvailable = IsInputTypeAvailable("email");

function ConvertInput(controlId, inputType) {
    if (IsInputTypeAvailable(inputType)) {
        var input = document.getElementById(controlId);
        if (input !== null) {
            input.setAttribute("type", inputType);
        }
    }
}

function ConvertToEmailInput(controlId) {
    if (typeof (EmailControlAvailable) == "boolean" && EmailControlAvailable) {
        var emailInput = document.getElementById(controlId);
        if (emailInput !== null) {
            emailInput.setAttribute("type", "email");
        }
    }
}

function setCookie(c_name, value, exdays, ctrl) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    document.cookie = c_name + "=" + escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toGMTString()) + "; path=/";

    // set cookie warning to hidden.
    ShowControl(false, ctrl);
}

function goForward() {
    window.history.forward();
}

function getEmailPrefix(mail) {
    return mail.substring(0, mail.lastIndexOf("@"));
}

function getDomain(mail) {
    return mail.substring(mail.lastIndexOf("@") + 1);
}

function getServer(mail) {
    return mail.substring(mail.lastIndexOf("@") + 1, mail.lastIndexOf("."));
}

function LevenshteinDistance(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

function suggest(mail) {

    var mailDomain = getDomain(mail);
    for (var i = 0; i < domains.length; i++) {
        // check if email's domain is known
        if (domains[i] == mailDomain)
            return null;
    }

    var mailServer = getServer(mail);
    for (var i = 0; i < domains.length; i++) {
        // check if TLD is switched...
        if (getServer(domains[i]) == mailServer)
            return getEmailPrefix(mail) + "@" + domains[i];
    }

    var temp = null;
    for (var i = 0; i < domains.length; i++) {
        // check if there is a one or two characters difference...
        var distance = LevenshteinDistance(domains[i], mailDomain);
        if (distance == 1)
            return getEmailPrefix(mail) + "@" + domains[i];
        else if (distance == 2 && temp == null)
            temp = getEmailPrefix(mail) + "@" + domains[i];
    }

    return temp;
}

function ShowControl(show, controlId) {
    var control = document.getElementById(controlId);
    if (control !== null && typeof (control) !== 'undefined') {
        if (show) {
            control.style.display = 'block';
        }
        else {
            control.style.display = 'none';
        }
    }
}

function hideControl(obj) {
    if (document.getElementById(obj))
        document.getElementById(obj).style.display = "none";
}

function showControl(obj) {
    if (document.getElementById(obj))
        document.getElementById(obj).style.display = "block";
}

if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
function getParameterByName(name) {
    name = name.toLowerCase().replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search.toLowerCase());
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkCookieEnabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "tstckenbl";
        cookieEnabled = (document.cookie.indexOf("tstckenbl") != -1) ? true : false;
    }
    return (cookieEnabled) ? true : ShowControl(true, 'divCookieDisabled');
}

var ckieEUName = '';
var ckieEUCtrlName = '';
function ckieEUExist() {
    return !(document.cookie.indexOf(ckieEUName + '=') == -1);
}

var ckieBalao = 'Balloon';
function ckieBalaoExist() {
    return !(document.cookie.indexOf(ckieBalao + '=') == -1);
}

function closeBalloon() {
    ShowControl(false, 'balao');
    ShowControl(false, 'pontaBalao');
    setCookie(ckieBalao, 1, 60);
};

function hideInfoBallons() {
    ShowControl(false, ckieEUCtrlName);
    ShowControl(false, 'balao');
    ShowControl(false, 'pontaBalao');
}

function digitsOnly(e, isMax) {
    var keys = [46, 8, 9, 27, 13, 190];
    for (var i = 0; i < 7; i++) {
        if (keys[i] == e.keyCode) {
            return true;
        }
    }

    if ((e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
        return true;
    }

    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
        return false;
    }

    if (typeof (isMax) != "undefined" && isMax) {
        e.preventDefault();
        return false;
    }
}

