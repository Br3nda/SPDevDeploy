//Q. Does each developer create their own object for the piece of
//deevlopment or is it one perdomain - mayme it's a combincation
//e.g MOD.DI.<CodePiece>

//One javascript file or multiple javascript files?
//One means potential conflicts updating by multiple developers but it can be minified 
//and means only one file to miantain.

var MOD = MOD || {};
MOD.DIJS = MOD.DIJS || {};

//With IIFE anything needed later must be returned
MOD.DIJS.HideIrrelevantDOM = function () {
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
    MOD.DIJS.HideIrrelevantDOM();
});