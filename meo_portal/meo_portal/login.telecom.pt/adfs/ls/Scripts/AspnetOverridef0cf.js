function ValidatorUpdateDisplay(val) {
    if (typeof (val.display) == "string") {
        if (val.display == "None") {
            return;
        }
        if (val.display == "Dynamic") {
            val.style.display = val.isvalid ? "none" : "inline";
            if (typeof (CustomValidatorUpdateDisplay) == "function")
                CustomValidatorUpdateDisplay(val);
            return;
        }
    }
    if ((navigator.userAgent.indexOf("Mac") > -1) &&
        (navigator.userAgent.indexOf("MSIE") > -1)) {
        val.style.display = "inline";
    }
    val.style.visibility = val.isvalid ? "hidden" : "visible";

    if (typeof (CustomValidatorUpdateDisplay) == "function")
        CustomValidatorUpdateDisplay(val);
}