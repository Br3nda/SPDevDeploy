<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/knockout-3.3.0.js"></script>
    <script type="text/javascript" src="../Scripts/ko.sp-1.0.min.Ex.js"></script>

    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Defence Intranet Feedback
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="feedback-left">
        <span class="feedback-lable">Name: </span>
        <input type="text" id="Name" readonly="readonly"  /> <!--Make this Read-Only and auto-populated -->        
    </div>
    <div class="feedback-left">
        <span class="feedback-lable">E-Mail:</span>
        <input type="text" id="Email" /> <!--Validate-->        
    </div>
    <div class="feedback-left">
        <span class="feedback-lable">URL: </span>
        <input type="text" id="URL" /> <!-- Make this auto-populated-->        
    </div>
    <div class="feedback-left">
        <span class="feedback-lable">Subject: </span>
        <select id="Subject"><option id="General">General</option><option id="Technical">Technical</option></select>         
    </div>
    <div class="feedback-left">
        <span class="feedback-lable">Feedback: </span>
        <textarea rows="7" cols="50" id="Feedback"  />        
    </div>
    <div>
        <span>
           <input type="button" id="SubmitFeedback" value="Submit" onclick="feedBack.SubmitFeedback()" />
           <input type="reset" id="ResetFeedback" value="Reset" />
           <a href="javascript:void(0);" onclick="feedBack.GetFeedback();return false">View Feedback</a>
        </span>
    </div>
    <div>
        <p id="feedback-message">
        </p>
    </div>
    <div>
        <table width="600px">
            <thead>
                <tr>
                    <th>Created</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>URL</th>
                    <th>Subject</th>
                    <th>Feedback</th>
                </tr>
            </thead>
            <tbody data-bind="template: { name: 'fb', foreach: DIFeedback }" />
        </table>
    </div>
    <script type="text/html" id="fb">
        <tr>
            <td data-bind="text:spDate:Modified,dataFormat: 'DD-MMM-YYYY, hh:mm:ss a'"></td>
            <td data-bind="spUser:modifiedBy"></td>
            <td data-bind="text:Email"></td>
            <td data-bind="text:URL"></td>
            <td data-bind="text:Subject"></td>
            <td data-bind="text:Feedback"></td>
        </tr>
    </script>
    <script type="text/javascript">
        function FeedbackModal
    </script>
</asp:Content>
