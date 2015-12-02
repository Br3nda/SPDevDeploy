//Q. Does each developer create their own object for the piece of
//deevlopment or is it one perdomain - mayme it's a combination
//e.g MOD.DI.<CodePiece>

//One javascript file or multiple javascript files?
//One means potential conflicts updating by multiple developers but it can be minified 
//and means only one file to miantain.

var MOD = MOD || {};
MOD.DIJS = MOD.DIJS || {};

MOD.DIJS.HideIrrelevantDOM = function () {
    //Hide elements if no image or no quote
    if ($('#Image-Container-Right')){
        if ($('#Image-Container-Right').find('img').length == 0) {
            $('#TopRightHeaderDiv').hide();
        }
        else { //if there is an image check for a quote
            if ($("div").find("[data-name='Page Field: HeaderQuoteRight']").text() == 0) {
                $('#Quote-Container-Right').hide();
            }
        }
    }

    if ($('#Image-Container-Left')){
        if ($('#Image-Container-Left').find('img').length == 0) {
            $('#TopLeftHeaderDiv').hide();
        }
        else {
            if ($("div").find("[data-name='Page Field: HeaderQuoteLeft']").text() == 0) {
                $('#Quote-Container-Left').hide();
            }
        }
    }
};

MOD.DIJS.AddRibbonElement = function () {
    $('#RibbonContainer-TabRowRight').prepend("<a class='ms-promotedActionButton Feedback' href='#' onClick=window.open('https://codedocs.sharepoint.com/sites/intranet/_layouts/15/appredirect.aspx?instance_id={F827C48C-CB4C-43A4-B9A6-9C1CDC21AA09}','','width=700px,height=500px')>FEEDBACK</a>");
    $('#zz4_SiteActionsMenuMainData').append("<ie:menuitem id='upload-document' type='option' iconSrc='/_layouts/15/images/settingsIcon.png?rev=41' onMenuClick="GoToPage(&#39;\u002fsites\u002fintranet\u002f_layouts\u002f15\u002fsettings.aspx&#39;)" text="Site settings" description="Access all settings for this site." menuGroupId="300"></ie:menuitem>)
}

$(document).ready(function () {
    MOD.DIJS.HideIrrelevantDOM();
    MOD.DIJS.AddRibbonElement();
});