'use strict';

//JS Module Pattern - using IIFE
var feedBack = (function () {
    var DEBUG = false;
    var context;
    var FEEDBACK_LISTNAME = 'DIFeedback';

    var LogIt = function (message) {
        if (DEBUG == true) {
            alert(message);
        } else {
            console.log(message);
        }
    };

    LogIt('In feedback IIFE');

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', GetUser);

    function GetUser () {
        LogIt('In GetUser')
        context = SP.ClientContext.get_current();
        var user = context.get_web().get_currentUser();
           
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);

        // This function is executed if the above call is successful
        // It replaces the contents of the 'message' element with the user name
        function onGetUserNameSuccess() {
            $('#Name').val(user.get_title());
        }

        // This function is executed if the above call fails
        function onGetUserNameFail(sender, args) {
            $('#Name').val('Anonymous');
        }
    }

    //Add Feedback to the list - private method
    var AddFeedback = function () {
        LogIt('In AddFeedback');
        var list = context.get_web().get_lists().getByTitle(FEEDBACK_LISTNAME);
        var itemCreateInfo = new SP.ListItemCreationInformation();
        var listItem = list.addItem(itemCreateInfo);

        var sub = $('#Title').val();
        listItem.set_item('Title', sub);

        var sub = $('#Subject').val();
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
            alert('Thanks for submitting feedback!');

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
                
        //Create the list using ListCreationInformation
        var listCreationInfo = new SP.ListCreationInformation();
        listCreationInfo.set_title(FEEDBACK_LISTNAME);
        listCreationInfo.set_templateType(100);
        
        //Add to collection
        var list = web.get_lists().add(listCreationInfo);
        
        //Load and execute
        context.load(list);
        context.executeQueryAsync(ListCreated, ListNotCreated);
        
    };

    //List created ok - add the columns
    var ListCreated = function () {
        LogIt('Created ' + FEEDBACK_LISTNAME + ' list.')
        var list = context.get_web().get_lists().getByTitle(FEEDBACK_LISTNAME);
        var fieldCollection = list.get_fields();
                
        //Title will already be there
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
     
    var FeedbackItemsNotRetrieved = function (sender, args) {
        LogIt('Failed to get Feedback items because ' + args.get_message() + '\n' + args.get_stackTrace());
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
            LogIt('In GetFeedback');
            window.open(_spPageContextInfo.webAbsoluteUrl + '/Lists/DIFeedback/AllItems.aspx');
            //var list = context.get_web().get_lists().getByTitle(FEEDBACK_LISTNAME);            
            //var camlQuery = new SP.CamlQuery();            
            //camlQuery.set_viewXml('<View><RowLimit>100</RowLimit></View>');            
            //var items = list.getItems(camlQuery);
            
            //context.load(items);            
            //context.executeQueryAsync(
            //    function () {
            //        LogIt('In FeedbackItemsRetrieved');
            //        var itemEnumerator = items.getEnumerator();

            //        while (itemEnumerator.moveNext()) {
            //            var item = itemEnumerator.get_current();
            //            var nameRow = "<td>" + item.get_item('Name')+ "</td>";
            //            var emailRow = "<td>" + item.get_item('Email') + "</td>";
            //            var urlRow = "<td>" + item.get_item('URL') + "</td>";
            //            var subjectRow = "<td>" + item.get_item('Subject') + "</td>";
            //            var feedbackRow = "<td>" + item.get_item('Feedback') + "</td>";
            //            var itemRow = "<tr>" + nameRow + emailRow + urlRow + subjectRow + feedbackRow + "</tr>";
            //            $('#Feedback-Results:last-child').append(itemRow);
            //        }
            //    },
            //    FeedbackItemsNotRetrieved);
        }
    }; //end return

}());














