'use strict';

//JS Module Pattern - using IIFE
var feedBack = (function () {
    var DEBUG = true;
    var context;
    var FEEDBACK_LISTNAME = 'DIFeedback';

    var LogIt = function (message) {
        if (DEBUG) {
            alert(message);
        } else {
            console.log(message);
        }
    };

    LogIt('In feedback IIFE');

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', GetUser);

    var GetUser = function () {
        LogIt('In GetUser')
        context = SP.ClientContext.get_current();
        var user = context.get_web().get_currentUser();

        // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
        $(document).ready(function () {
            getUserName();
        });

        // This function prepares, loads, and then executes a SharePoint query to get the current users information
        function getUserName() {
            context.load(user);
            context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
        }

        // This function is executed if the above call is successful
        // It replaces the contents of the 'message' element with the user name
        function onGetUserNameSuccess() {
            $('#Name').text(user.get_title());
        }

        // This function is executed if the above call fails
        function onGetUserNameFail(sender, args) {
            $('#Name').text('Anonymous');
        }
    }

    //Add Feedback to the list - private method
    var AddFeedback = function () {
        LogIt('In AddFeedback');
        var list = context.get_web().get_lists().getByTitle(FEEDBACK_LISTNAME);
        var itemCreateInfo = new SP.ListItemCreationInformation();
        var listItem = list.addItem(itemCreateInfo);

        var sub = $('#Subject').html();
        listItem.set_item('Subject', sub);

        var nam = $('#Name').val()
        listItem.set_item('Name', nam);

        var ur = $('#URL').val();
        listItem.set_item('URL', ur);

        var fb = $('#Feedback').val();
        listItem.set_item('Feedback', fb);

        var em = $('#Email').val();
        listItem.set_item('Email', em);

        listItem.update();
        context.load(listItem);

        context.executeQueryAsync(function () {
            LogIt('Success');
            $('#feedback-message').text('Thanks for submitting feedback!');
        },
        function (sender, args) {
            LogIt('Failed to AddFeedback because ' + args.get_message() + '\n' + args.get_stackTrace());
            $('#feedback-message').text('Failed');
        });
    };

    //Create Feedback List if not exists - private method;
    var CreateFeedbackList = function () {
        LogIt('In CreateFeedbackList');
        var web = context.get_web();

        LogIt('In CreateFeedbackList.1');
        //Create the list using ListCreationInformation
        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(FEEDBACK_LISTNAME);
        listCreationInfo.set_templateType(100);
        LogIt('In CreateFeedbackList.2');

        //Add to collection
        var list = web.get_lists().add(listCreationInfo);
        LogIt('In CreateFeedbackList.3');

        //Load and execute
        context.load(list);
        context.executeQueryAsync(ListCreated, ListNotCreated);
        LogIt('In CreateFeedbackList.4');

    };

    //List created ok - add the columns
    var ListCreated = function () {
        LogIt('Created ' + FEEDBACK_LISTNAME + ' list.')
        var list = context.get_web().get_lists().getByTitle(FEEDBACK_LISTNAME);
        var fieldCollection = list.get_fields();

        var SubjectSchema = '<Field Type="Text" DisplayName="Subject" Name="Subject" />';
        var NameSchema = '<Field Type="Text" DisplayName="Name" Name="Name" />';
        var URLSchema = '<Field Type="Text" DisplayName="URL" Name="URL" />';
        var FeedbackSchema = '<Field Type="Text" DisplayName="Feedback" Name="Feedback" />';
        var EmailSchema = '<Field Type="Text" DisplayName="Email" Name="Email" />';


        fieldCollection.addFieldAsXml(SubjectSchema, true, SP.AddFieldOptions.defaultValue);
        fieldCollection.addFieldAsXml(NameSchema, true, SP.AddFieldOptions.defaultValue);
        fieldCollection.addFieldAsXml(URLSchema, true, SP.AddFieldOptions.defaultValue);
        fieldCollection.addFieldAsXml(FeedbackSchema, true, SP.AddFieldOptions.defaultValue);
        fieldCollection.addFieldAsXml(EmailSchema, true, SP.AddFieldOptions.defaultValue);
        context.load(fieldCollection);
        context.executeQueryAsync(FieldsCreated, FieldsNotCreated);
    };

    var FieldsCreated = function () {
        LogIt('Fields and list now created');
        AddFeedback();
    };

    var ListNotCreated = function (sender, args) {
        LogIt('Failed to create list because ' + args.get_message() + '\n' + args.get_stackTrace());
    };

    var FieldsNotCreated = function (sender, args) {
        LogIt('Failed to create fields because ' + args.get_message() + '\n' + args.get_stackTrace());
    };

    


    return { //returns an Object Literal with Publically accessible parts
        SubmitFeedback:function(){
            LogIt('In submit feedback');
            
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', AddEntry);

            function AddEntry() {
                LogIt('In AddEntry');
                context = SP.ClientContext.get_current();                
                var lists = context.get_web().get_lists();

                context.load(lists);
                context.executeQueryAsync(GetListsSuccess, function(sender, args){console.log('Error in App.js, SubmitFeedback, get_Lists:' + '\n' + args.get_message() + '\n' + args.get_stackTrace())});

                function GetListsSuccess() {
                    LogIt('In GetListsSuccess');
                    var listEnumerator = lists.getEnumerator();
                    var foundList = 0;
                    while(listEnumerator.moveNext()){
                        var list = listEnumerator.get_current();
                        console.log('list_title=' + list.get_title());
                        if (list.get_title() == FEEDBACK_LISTNAME) {
                            foundList = 1;
                            break;
                        }
                    }
                    if (foundList == 0) {
                        LogIt('Not Found List ' + FEEDBACK_LISTNAME);
                        CreateFeedbackList();
                    } else {
                        //Because of asynch nature - need to invoke either here or after list created...
                        AddFeedback();
                    };
                } //end GetListsSuccess
            } //end AddEntry
        }, //end SubmitFeedback - needs a comman if it's not last part of object literal

        GetFeedback: function () {
            alert('Fill in later add to asp:gridview');
        }
    }; //end return

}());














