
function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function reloadBkgds(element) {
    if (element !== null) {

        if (element.style !== null && typeof element.style !== 'undefined') {
            var bkgd = element.style.background;
            element.style.background = ';';
            element.style.background = bkgd;

            bkgd = element.style.backgroundImage;
            element.style.backgroundImage = ';';
            element.style.backgroundImage = bkgd;
        }

        var childs = element.childNodes;
        if (childs == null) {
            return;
        }

        for (var i = 0; i < childs.length; i++) {
            if (childs[i] !== null) {
                reloadBkgds(childs[i]);
            }
        }
    }
}

var tempImgs = new Array();

function addToTempImgs(bkgd) {

    for (var i = 0; i < tempImgs.length; i++) {
        if (tempImgs[i].getAttribute("src") == bkgd) {
            return;
        }
    }

    var img = new Image();
    img.src = bkgd;
    tempImgs.push(img);
}

function preLoadImgsInContainer(element) {
    if (element !== null) {

        if (element.style !== null && typeof element.style !== 'undefined') {

            var bkgd = element.style.backgroundImage;

            if (bkgd !== null && bkgd !== '') {
                addToTempImgs(extractBkgdUrl(bkgd));
            }

            bkgd = getStyle(element, 'background-image');

            if (bkgd !== null && bkgd !== '' && bkgd !== 'none') {
                addToTempImgs(extractBkgdUrl(bkgd));
            }

            if (typeof element.tagName !== 'undefined' && element.tagName.toLowerCase() == "img" && element.getAttribute("src") !== null) {
                addToTempImgs(element.getAttribute("src"));
            }
        }

        var childs = element.childNodes;
        if (childs == null) {
            return;
        }

        for (var i = 0; i < childs.length; i++) {
            if (childs[i] !== null) {
                preLoadImgsInContainer(childs[i]);
            }
        }
    }
}

function extractBkgdUrl(bkd) {
    var rx = /url\(["']?([^'")]+)['"]?\)/;
    return bkd.replace(rx, '$1');
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function getStyle(el, styleProp) {
    if (typeof el.currentStyle !== 'undefined' && el.currentStyle !== null)
        var y = el.currentStyle[styleProp];
    else if (typeof window.getComputedStyle !== 'undefined' && window.getComputedStyle !== null)
        var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    return y;
}

function myClickButton(e, buttonid) {
    var bt = document.getElementById(buttonid);
    if (typeof (bt) == 'object') {
        if (navigator.appName.indexOf("Netscape") > -1) {
            if ((e.keyCode ? e.keyCode : e.which) == 13) {
                bt.click = myAddClickFunction(bt);
            }
        }
        else {
            return true;
        }
    }
}

function myAddClickFunction(bt) {
    var result = true;

    if (typeof (bt) == 'undefined' || bt == null)
        return;

    if (bt.onclick) result = bt.onclick();
    if (typeof (result) == 'undefined' || result) {
        eval(unescape(bt.href));
    }
}

function runPassword(pwdCtrlId, barCtrlId, textCtrlId, verdects, scores) {
    var pwdCtrl = document.getElementById(pwdCtrlId);
    if (pwdCtrl == null) {
        return;
    }

    var p = pwdCtrl.value;

    // Check password
    nPerc = checkPassword(p);

    // Get controls
    var barCtrl = document.getElementById(barCtrlId);
    var textCtrl = document.getElementById(textCtrlId);

    if (p == null || p == '') {
        barCtrl.style.display = "none";
        textCtrl.style.display = "none";
        return;
    } else {
        barCtrl.style.display = "block";
        textCtrl.style.display = "block";
    }

    // Color and text						
    if (nPerc <= scores[0]) {
        textCtrl.innerHTML = verdects[0];
        barCtrl.className = "barrinha pass_mfraca";
    }
    else if (nPerc <= scores[1]) {
        textCtrl.innerHTML = verdects[1];
        barCtrl.className = "barrinha pass_fraca";
    }
    else if (nPerc <= scores[2]) {
        textCtrl.innerHTML = verdects[2];
        barCtrl.className = "barrinha pass_media";
    }
    else if (nPerc <= scores[3]) {
        textCtrl.innerHTML = verdects[3];
        barCtrl.className = "barrinha pass_forte";
    }
    else {
        textCtrl.innerHTML = verdects[4];
        barCtrl.className = "barrinha pass_mforte";
    }
}

function checkPassword(p) {
    var intScore = 0;

    // PASSWORD LENGTH
    if (p.length >= 6)                  // length >= 6
        intScore++;

    if (p.length >= 12)                 // length >= 12
        intScore++;

    // LETTERS
    if (p.match(/[a-zA-Z]/))            // [verified] at least one letter
        intScore++;

    // NUMBERS
    if (p.match(/\d+/))                 // [verified] at least one number
        intScore++;

    // SPECIAL CHAR
    if (p.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) // [verified] at least one special character
        intScore++;

    return intScore;
}

var currentlyDisabledElements = [];

function toggleInputElementsState(bDisabled) {

    if (bDisabled) {
        currentlyDisabledElements = [];
    }

    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type !== "hidden") {
            if (bDisabled) {
                if (inputs[i].disabled) {
                    currentlyDisabledElements.push(inputs[i].id)
                    continue;
                }
            }
            else {
                if (inputs[i].id in currentlyDisabledElements) {
                    continue;
                }
            }

            inputs[i].disabled = bDisabled;
        }
    }

    var selects = document.getElementsByTagName("select");
    for (var i = 0; i < selects.length; i++) {
        if (bDisabled) {
            if (selects[i].disabled) {
                currentlyDisabledElements.push(selects[i].id)
                continue;
            }
        }
        else {
            if (selects[i].id in currentlyDisabledElements) {
                continue;
            }
        }
        selects[i].disabled = bDisabled;
    }

    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {

        if (bDisabled) {
            if (textareas[i].disabled) {
                currentlyDisabledElements.push(textareas[i].id)
                continue;
            }
        }
        else {
            if (textareas[i].id in currentlyDisabledElements) {
                continue;
            }
        }
        textareas[i].disabled = bDisabled;
    }

    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        if (bDisabled) {
            if (buttons[i].disabled) {
                currentlyDisabledElements.push(buttons[i].id)
                continue;
            }
        }
        else {
            if (buttons[i].id in currentlyDisabledElements) {
                continue;
            }
        }

        buttons[i].disabled = bDisabled;
    }

}


var savedTabIndex = [];

function getSavedTabIndex(controlId) {
    for (var i = 0; i < savedTabIndex.length; i++) {
        if (savedTabIndex[i].id == controlId) {
            return savedTabIndex[i].tabIndex;
        }
    }

    return null;
}

function toggleInputElementsTabNavigation(enabled) {

    if (!enabled) {
        savedTabIndex = [];
    }

    var idCounter = 0;

    var elementTags = ["input", "a", "select", "textarea", "button"];

    for (var elem = 0; elem < elementTags.length; elem++) {

        var elems = document.getElementsByTagName(elementTags[elem]);

        for (var i = 0; i < elems.length; i++) {
            if ((typeof (elems[i].type) == "undefined" || elems[i].type !== "hidden") && (typeof (elems[i].disabled) == "undefined" || !elems[i].disabled)) {
                if (enabled) {
                    elems[i].tabIndex = getSavedTabIndex(elems[i].id);
                }
                else {
                    var id = elems[i].id;
                    if (id == null) {
                        id = "id_" + idCounter++;
                        elems[i].id = id;
                    }
                    savedTabIndex.push({ "id": id, "tabIndex": elems[i].tabIndex });
                    elems[i].tabIndex = -1;
                }

            }
        }
    }
}

function noCopyMouse(e) {
    var isRight = (e.button) ? (e.button == 2) : (e.which == 3);
    if (isRight) {
        //alert('You are prompted to type this twice for a reason!');
        return false;
    }
    return true;
}

function noCopyKey(e) {
    var forbiddenKeys = new Array('c', 'x', 'v');
    var keyCode = (e.keyCode) ? e.keyCode : e.which;
    var isCtrl;

    if (window.event)
        isCtrl = e.ctrlKey
    else
        isCtrl = (window.Event) ? ((e.modifiers & Event.CTRL_MASK) == Event.CTRL_MASK) : false;

    if (isCtrl) {
        for (i = 0; i < forbiddenKeys.length; i++) {
            if (forbiddenKeys[i] == String.fromCharCode(keyCode).toLowerCase()) {
                //alert('You are prompted to type this twice for a reason!');
                return false;
            }
        }
    }
    return true;
}



/////// TESTING....

function addClass(element, classToAdd) {
    var currentClassValue = element.className;

    if (currentClassValue.indexOf(classToAdd) == -1) {
        if ((currentClassValue == null) || (currentClassValue === "")) {
            element.className = classToAdd;
        } else {
            element.className += " " + classToAdd;
        }
    }
}

function removeClass(element, classToRemove) {
    var currentClassValue = element.className;

    if (currentClassValue == classToRemove) {
        element.className = "";
        return;
    }

    var classValues = currentClassValue.split(" ");
    var filteredList = [];

    for (var i = 0; i < classValues.length; i++) {
        if (classToRemove != classValues[i]) {
            filteredList.push(classValues[i]);
        }
    }

    element.className = filteredList.join(" ");
}

function placeholderIsSupported() {
    var test = document.createElement('input');
    return ('placeholder' in test);
}

var regLabels = [];

function handlePlaceholders() {
    if (!placeholderIsSupported()) {
        if (getInternetExplorerVersion() < 9) {
            
            for (var i = 0; i < regLabels.length; i++)
                showControl(regLabels[i]);

            document.getElementById(tbPassword).style.fontFamily = "Arial, Helvetica, sans-serif";
            return;
        }

        if (document.querySelectorAll == undefined) {
            (function (d, s) { d = document, s = d.createStyleSheet(); d.querySelectorAll = function (r, c, i, j, a) { a = d.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(','); for (i = r.length; i--; ) { s.addRule(r[i], 'k:v'); for (j = a.length; j--; ) a[j].currentStyle.k && c.push(a[j]); s.removeRule(0) } return c } })()
        }

        // Set caret at the beginning of the input
        setCaret = function (evt) {
            if (this.value === this.getAttribute("data-placeholder")) {
                this.setSelectionRange(0, 0);
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            }
        },

        // Clear placeholder value at user input
        clearPlaceholder = function (evt) {
            if (!(evt.shiftKey && evt.keyCode === 16) && evt.keyCode !== 9) {
                if (this.value === this.getAttribute("data-placeholder")) {
                    this.value = "";
                    addClass(this, "active");
                    if (this.getAttribute("data-type") === "password") {
                        this.type = "password";
                    }
                }
            }
        },

        restorePlaceHolder = function () {
            if (this.value.length === 0) {
                this.value = this.getAttribute("data-placeholder");
                setCaret.apply(this, arguments);
                removeClass(this, "active");
                if (this.type === "password") {
                    this.type = "text";
                }
            }
        },

        clearPlaceholderAtSubmit = function (evt) {
            var dataPlaceholders = document.querySelectorAll("input[placeholder]");
            for (var i = 0, placeholder; i < dataPlaceholders.length; i++) {
                placeholder = dataPlaceholders[i];
                if (placeholder.value === placeholder.getAttribute("data-placeholder")) {
                    placeholder.value = "";
                }
            }
        };

        var dataPlaceholders = document.querySelectorAll("input[placeholder]");
        for (var i = 0, placeholder, placeholderVal; i < dataPlaceholders.length; i++) {
            placeholder = dataPlaceholders[i];
            if (placeholder.value.length === 0) {
                placeholderVal = placeholder.getAttribute("placeholder");
                placeholder.setAttribute("data-placeholder", placeholderVal);
                placeholder.value = placeholderVal;
                placeholder.removeAttribute("placeholder");
                if (placeholder.getAttribute('type') === "password") {
                    placeholder.setAttribute('type', "text");
                    placeholder.setAttribute("data-type", "password");
                }
            }
            else {
                //placeholder.className = "active";
            }

            // Apply events for placeholder handling
            if (typeof window.addEventListener != "undefined") {
                placeholder.addEventListener("focus", setCaret, false);
                placeholder.addEventListener("drop", setCaret, false);
                placeholder.addEventListener("click", setCaret, false);
                placeholder.addEventListener("keydown", clearPlaceholder, false);
                placeholder.addEventListener("keyup", restorePlaceHolder, false);
                placeholder.addEventListener("blur", restorePlaceHolder, false);

                // Clear all default placeholder values from the form at submit
                placeholder.form.addEventListener("submit", clearPlaceholderAtSubmit, false);
            }
            else if (typeof window.attachEvent != "undefined") {
                placeholder.attachEvent("focus", setCaret);
                placeholder.attachEvent("drop", setCaret);
                placeholder.attachEvent("click", setCaret);
                placeholder.attachEvent("keydown", clearPlaceholder);
                placeholder.attachEvent("keyup", restorePlaceHolder);
                placeholder.attachEvent("blur", restorePlaceHolder);

                // Clear all default placeholder values from the form at submit
                placeholder.form.attachEvent("submit", clearPlaceholderAtSubmit);
            }
        }
    }
}

function getParentForm(elem) {
    if (typeof (elem) == 'undefined')
        return null;

    var current = elem;
    do {
        if (current.nodeName == "FORM")
            return current;

        current = current.parentElement;
    }
    while (current != null || typeof (current) != 'undefined');

    return null;
}

function printUserCodes(content) {
    window.frames["print_frame"].document.body.innerHTML = content;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
}

function isTouch() {
    return 'ontouchstart' in window
      || 'onmsgesturechange' in window;
};

function nToolTip(params) { this.init(params) };

nToolTip.prototype = {
    init: function (params) {
        this.toolBox = document.getElementsByClassName('toolBox');
        this.bt_help = document.getElementsByClassName('bt-help');
        this.col_cont = document.getElementsByClassName('col_cont');
        this.btn_l = this.bt_help.length;
        this.ofLeft;
        this.tout = false;
        this.tl_box = document.getElementsByClassName('tip-wrap');
        var that = this, cliques = 0, hover = false;

        that.findW();

        if (isTouch()) {
            for (var j = 0; j < that.bt_help.length; j++) {
                that.bt_help[j].onclick = function () { return false };
                that.tl_box[j].onclick = function () {
                    for (var t = 0; t < that.tl_box.length; t++) {
                        if (this !== that.tl_box[t]) that.tl_box[t].className = that.tl_box[t].className.replace(' focused', '');
                    };
                    if (this.className.indexOf('focused') < 0) this.className += ' focused';
                    else this.className = this.className.replace(' focused', '');
                };
            }
            document.addEventListener('click', function (e) {
                if (e.target.className.indexOf('bt-help') < 0) {
                    for (var _j = 0; _j < that.tl_box.length; _j++) {
                        that.tl_box[_j].className = that.tl_box[_j].className.replace('focused', '');
                    }
                }
            })
        } else {
            for (var j = 0; j < that.tl_box.length; j++) {
                that.tl_box[j].onmouseenter = function () {
                    this.className += ' focused';
                };
                that.tl_box[j].onmouseleave = function () {
                    this.className = this.className.replace(' focused', '');
                };
            };
        }
        /*window.onload = function(){
        if(isTouch()){
        for(var j=0;j<that.tl_box.length;j++){
        var me = that.tl_box[j];
        me.posIndex = j;
        me.addEventListener('click',function(e){

        })
        }
        }
        }*/

        /*function appear(me){ var a = this.posIndex;		
        if(cliques == 0){ for(var b=0;b<me.childNodes.length;b++){
        if(me.childNodes[b].nodeName.toLowerCase() == 'div' && me.childNodes[b].className.match(/toolBox/g) !== null){
        me.style.overflow = 'visible'; cliques++ }
        }
        }else{ for(var b=0;b<me.childNodes.length;b++){
        if(me.childNodes[b].nodeName.toLowerCase() == 'div' && me.childNodes[b].className.match(/toolBox/g) !== null){
        me.style.overflow = 'hidden'; cliques-- }
        }
        }
        }
		
        function hoverTool(me){
        var a = this.posIndex;
        if(hover) for(var b=0;b<me.childNodes.length;b++){
        if(me.childNodes[b].nodeName.toLowerCase() == 'div' && me.childNodes[b].className.match(/toolBox/g) !== null){
        me.style.overflow = 'visible'; me.childNodes[b].style.opacity = 1;
        }
        }
        else
        for(var b=0;b<me.childNodes.length;b++){
        if(me.childNodes[b].nodeName.toLowerCase() == 'div' && me.childNodes[b].className.match(/toolBox/g) !== null){
        me.style.overflow = 'hidden'; me.childNodes[b].style.opacity = 0; 
        }
        }			
        }
        */
        window.addEventListener('resize', function () { that.findW() });

    }, alignT: function (cssLeft) {
        var that = this, _b_l = document.getElementsByClassName('tip-wrap').length;

        if (cssLeft == undefined) cssLeft = '38px';

        for (var i = 0; i < _b_l; i++) {
            document.getElementsByClassName('toolBox')[i].style.display = 'block';
            var _c_l = document.getElementsByClassName('toolBox')[i].childNodes.length,
                    _c = document.getElementsByClassName('toolBox')[i].childNodes,
                    t_H = that.toolBox.offsetHeight;

            for (var h = 0; h < _c_l; h++) {
                if (_c[h].nodeName.toLowerCase() == 'span') {
                    var _c_H = 100 * (_c[h].offsetHeight / that.toolBox[i].offsetHeight), _t_H = -(that.toolBox[i].clientHeight - _c[h].offsetHeight * 2) / 2;
                    _c[h].style.top = 50 - _c_H.toFixed(0) + '%'; that.toolBox[i].style.top = _t_H + 'px'; that.toolBox[i].style.left = cssLeft;
                }
            }
            document.getElementsByClassName('toolBox')[i].style.display = '';
        }

    }, findW: function () {
        var that = this, winw = window.innerWidth, tipWrap_l = document.getElementsByClassName('tip-wrap').length;

        for (var j = 0; j < tipWrap_l; j++) {
            var f = document.getElementsByClassName('tip-wrap')[j].offsetLeft + document.getElementsByClassName('tip-wrap')[j].offsetParent.offsetLeft;

            if (f + 278 >= winw && f - 278 > 0) {
                that.ofLeft = '-207px'; that.changePos('25px', that.ofLeft); that.matchClass('big|small', 'medium');
            } else if (f - 278 < 0) {
                that.ofLeft = ((winw - 240) / 2) - document.getElementsByClassName('tip-wrap')[0].offsetLeft + 'px';
                that.changePos('25px', that.ofLeft); that.matchClass('big|medium', 'small');
            } else {
                that.ofLeft = '38px'; that.alignT(that.ofLeft); that.matchClass('medium|small', 'big');
            }
        }

    }, changePos: function (cssTop, cssLeft) {
        var that = this;
        for (var h = 0; h < that.btn_l; h++) {
            that.toolBox[h].style.top = cssTop;
            that.toolBox[h].style.left = cssLeft;
        }
    }, matchClass: function (arg1, arg2) {
        var that = this,
			j = new RegExp(arg1, 'g'),
			t = that.toolBox[0].className,
			a = t.match(j);

        for (var m = 0; m < that.toolBox.length; m++) {
            that.toolBox[m].className = 'toolBox ' + arg2;
        }
    }
};


function CustomValidatorUpdateDisplay(val) {
    //debugger;
    var parent = getParentByType(val, "div");
    if (parent == null || typeof (val.isvalid) == "undefined")
        return;

    if (val.isvalid === true) {
        if (typeof (parent.errors) != "object") {
            parent.errors = new Array();
            return;
        }

        var index = indexOfArray(parent.errors,val.id);
        if (index > -1) {
            parent.errors.splice(index, 1);
        }

        if (parent.errors.length == 0) {
            parent.className = parent.className.replace(/\bhas-error\b/, "");
        }
    }
    else {
        if (typeof (parent.errors) != "object") {
            parent.errors = [val.id];
            parent.className += " has-error";
        }
        else {
            var index = indexOfArray(parent.errors, val.id);
            if (index == -1) {
                parent.errors.push(val.id);
            }

            if(parent.className.search(/\bhas-error\b/) == -1)
                parent.className += " has-error";
        }
        
    }
}

function setError(elemId) {

    var elem = document.getElementById(elemId);
    if (typeof (elem) == "undefined" || elem == null)
        return;

    var parent = getParentByType(elem, "div");
    if (parent == null)
        return;

    if (parent.className.search(/\bhas-error\b/) == -1)
        parent.className += " has-error"
}

function updateAllValidators() {
    if (typeof (Page_Validators) == "undefined")
        return;

    if (typeof (Page_Validators.forEach) == "function") {
        Page_Validators.forEach(function (val) { CustomValidatorUpdateDisplay(val); });
    }
    else {
        for (var i = 0; i < Page_Validators.length; i++) {
            CustomValidatorUpdateDisplay(Page_Validators[i]);
        }
    }
}


function indexOfArray(array, value) {
    if (typeof (array.indexOf) == "undefined") {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value)
                return i;
        }
    }
    else {
        return array.indexOf(value);
    }
    return -1;
}


function getParentByType(node, type) {
    if (node.nodeName.toLowerCase() == "body") {
        return null;
    }
    else if (node.parentNode.nodeName.toLowerCase() == type.toLowerCase()) {
        return node.parentNode;
    }
    else
        return getParentByType(node.parentNode, type);
}

function clearError(elemId) {
    var elem = document.getElementById(elemId);
    if (typeof (elem) == "undefined" || elem == null)
        return;

    hideControl(elemId);

    var parent = getParentByType(elem, "div");
    if (parent == null)
        return;
    
    if (typeof (parent.errors) != "object" || parent.errors.length == 0) {
        parent.className = parent.className.replace(/\bhas-error\b/, "");
    }
}