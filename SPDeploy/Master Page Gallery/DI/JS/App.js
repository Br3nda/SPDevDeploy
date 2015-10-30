var MODDIAppJS = MODDIAppJs || {}; //get reference or create anew

//With IIFE anything needed later must be returned
MODDIAppJS.HideIrrelevantDOM = function () {
    //Hide elements if no image or no quote
    if ($('#Image-Container-Right').find('img').length == 0) {
        $('#TopRightHeaderDiv').hide();
    }
    else { //if there is an image check for a quote
        if ($("div").find("[data-name='Page Field: HeaderQuoteRight']").text() == 0) {
            $('#Quote-Container-Right').hide();
        }
    }

    if ($('#Image-Container-Left').find('img').length == 0) {
        $('#TopLeftHeaderDiv').hide();
    }
    else {
        if ($("div").find("[data-name='Page Field: HeaderQuoteLeft']").text() == 0) {
            $('#Quote-Container-Left').hide();
        }
    }
};

$(document).ready(function () {
    MODDIAppJS.HideIrrelevantDOM
});