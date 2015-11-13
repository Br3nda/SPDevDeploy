'use strict';

//ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

var appWebUrl, hostWebUrl;

jQuery(document).ready(function(){
    //Check for FileReader API (HTML5) support
    if (!window.FileReader) {
        alert('This browser does not support the FileReader API, please upgrade your browser.');
    }

    appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
    hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

});


//Upload the file - up to 3GB with REST API
function uploadFile() {
    var serverRelativeUrlToFolder = '/CodeDocs';

    var fileInput = jQuery('#getFile');
    var newName = jQuery('#displayName').val();

    //Initiate method calls using jQuery promises
    //Get the local file as an array buffer
    var getFile = getFileBuffer();
    getFile.done(function (arrayBuffer) {

        //Add the file to the SharePoint folder
        var addFile = addFileToFolder(arrayBuffer);
        addFile.done(function (file, status, xhr) {

            //Get the list item that corresponds to the uploaded file
            var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
            getItem.done(function (listItem, status, xhr) {

                //Change the display name and title of the list item
                var changeItem = updateListItem(listItem.d.__metadata);
                changeItem.done(function (data, status, xhr) {
                    alert('file uploaded and updated');
                }); //changeItem.done
                changeItem.fail(onError);

            });//getitem.done
            getItem.fail(onError);

        }); //addFile.done
        addFile.fail(onError);

    });//getFile.done
    getFile.fail(onError);

    //Get the local file as an array buffer
    function getFileBuffer() {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileInput[0].files[0]);
        return deferred.promise();
    }

    function addFileToFolder(arrayBuffer) {
        //Get the file name from the input control on the page
        var parts = fileInput[0].value.split('\\');
        var fileName = parts[parts.length - 1];

        //Construct the endpoint
        var fileCollectionEndpoint = String.format(
            "{0}/_api/sp.appcontextsite(@target)/web/getfolderbyserverrelativeurl('{1}')/files" +
            "/add(overwrite=true, url='{2}')?@target='{3}'",
            appWebUrl, serverRelativeUrlToFolder, fileName, hostWebUrl);

        //Send the request and return the response
        //This call returns the SharePoint file
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-requestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-length": arrayBuffer.byteLength
            }
        });
    } //end AddFileToFolder

    //get the list item that corresponds to the file by calling the file's ListItemAllFields property
    function getListItem(fileListItemUri) {

        //Construct the endpoint
        //The list item URI uses the host web, but the cross-domain call is sent to the
        //add-in web and specifies the host wev as the context site
        fileListItemUri = fileListItemUri.replace(hostWebUrl, '{0}');
        fileListItemUri = fileListItemUri.replace('_api/Web', '_api/sp.appcontextsite(@target)/web');

        var listitemAllFieldsEndPoint = String.format(fileListItemUri + "?@target='{1}'", appWebUrl, hostWebUrl);

        //Send the request and return the response
        return jQuery.ajax({
            url: listitemAllFieldsEndPoint,
            type: "GET",
            headers:{"accept":"application/json;odata=verbose"}
        });

    }

    //Change the display name and title ofthe list item
    function updateListItem(itemMetadata) {

        //Construct the endpoint
        var listItemUri = itemMetadata.uri.replace('_api/Web', '_api/sp.appcontextsite(@target)/web');
        var listItemEndpoint = String.format(listItemUri + "?@target='{0}'", hostWebUrl);

        //Define the list item changes. Use the FileLeafRef property to change the display name
        //For simplicity, also use the name as the title
        //The below gets the list item type from the item's metadata, but you can also get it from the
        //ListitemEntitytypeFullName property of the list
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}'}}",
            itemMetadata.type, newName, newName);

        //Send the request and return the promise
        //This call does not return response content from the server

        return jQuery.ajax({
            url: listItemEndpoint,
            type: "POST",
            data: body,
            headers: {
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-type": "application/json;odata=verbose",
                "content-length": body.length,
                "IF-MATCH": itemMetadata.etag,
                "X-HTTP-Method": "MERGE"
            }
        });
    }
}

//Display error messages
function onError(error) {
    alert(error.responseText);
}

function getQueryStringParameter(paramToRetrieve) {
    var params = document.URL.split("?")[1].split("&");
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve) return singleParam[1];
    }
}


