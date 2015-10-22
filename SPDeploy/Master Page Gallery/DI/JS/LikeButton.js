//this below is just to hide an image we don't want to see on a page layout
$(document).ready(function () {
    $('#image_container').hide();
});

function LikePage() {
    //SP.SOD - represents an on-demand ECMA script
    Log("in LikePage");
    //SP.SOD.executeFunc(key, functionName, fn) - Ensure the file that contains the specified function is loaded then calls the specified callback function fn
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', doWork);       

}

function doWork() {
    alert('In do work');
    var context = new SP.ClientContext.get_current();
    //Note that in a clientWebPart which is a web part that is an IFrame
    //to a page on a App Web the follwoing is not available
    alert('ItemID=' + _spPageContextInfo.pageItemId);

    alert("ListId=" + _spPageContextInfo.pageListId);

    var listID = _spPageContextInfo.pageListId;
    var itemId = _spPageContextInfo.pageItemId;

    SP.SOD.executeFunc('reputation.js', 'reputation.setLike', setLike);

    function setLike()
    {
        alert('In setLike');
        try {
            Microsoft.Office.Server.ReputationModel.Reputation.setLike(context, listID, itemId, true);
            context.executeQueryAsync(function () { alert('Succeeded'); }, function () { alert('failed'); });
        }
        catch (e) {
            alert("Error:" + e.message);
        }
    }
   
}



//var web;
//var listCollection;
//var list;
//var listID;
//var url;
////var itemID;
//var appContext;
//var hostContext;

//function btnLike_Click() {
//    log('In btnLike_Click');
//    //Remember an App has full control on the App Web but you need to explicitly request permissions to the host web in the AppManifest
//    appContext = new SP.ClientContext.get_current();
//    //it is not obvious that once you have created the SP.AppContextSite object you then continue to use the clientContext above
//    hostContext = new SP.AppContextSite(appContext, hostUrl);
               
//    log('1');
//    //When the below was set to ClientContext it errored saying Pages list not available obviously
//    web = hostContext.get_web();
//    log('2');
////    this.collList = oWebsite.get_lists();

////    clientContext.load(collList, 'Include(Title, Id)');
////    clientContext.executeQueryAsync(
////        Function.createDelegate(this, this.onQuerySucceeded), 
////        Function.createDelegate(this, this.onQueryFailed)
////    );
////}

//    //this doesn't work - it returns with Invalid Request
//    //list = web.get_lists().getByTitle('Pages');
//    //appContext.load(list, 'Include(Title, Id)');

//    listCollection = web.get_lists();
           
//    log('loading appContext');
//    appContext.load(web);
//    appContext.load(listCollection, 'Include(Title, Id)');

//    //Note though that AppContextSite (host web) returned from SP.AppContextSite does not have a load function - you have to load into the clientContext (app web) object
            
                       
//    //this call below doesn't work it errors with the id property has not been initialized
//    //var listID = list.get_id();
                       
//    //after the execution below the code jumps into the success function but doesn't then continue
//    //so we need to structure the code accordingly
//    appContext.executeQueryAsync(loadWebAndListSuccess,
//        function (sender, args) { alert('failure' + args.get_message() + '\n' + args.get_stackTrace()); }
//        );

//    function loadWebAndListSuccess() {
//        log('in success function');
//        var listEnumerator = listCollection.getEnumerator();

//        while (listEnumerator.moveNext()) {
//            var oList = listEnumerator.get_current();
//            if (oList.get_title() == 'Pages')
//            {
//                listID = oList.get_id();
//                log('listID=' + listID);
//            }
//        }
//        log('function 5');                
//        url = web.get_url();
//        log('In function6. url = ' + url);
//        log('Window.location.href' + document.getElementById("iframe_id").contentWindow.location.href)

//        var params = document.URL.split("?")[1].split("&");
//        var ItemId;
//        for (var i = 0; i < params.length; i = i + 1)
//        {
//            var param = params[i].split("=");
//            if (param[0] == "ItemId")
//                ItemId = param[1];
//        }
                
//        log('3');
//        Microsoft.Office.Server.ReputationModel.Reputation.setLike(appContext, listID, ItemId, true);
//        log('4');
//        appContext.executeQueryAsync(LikeSuccess, LikeFailure);
//        log('5');
                
      
//    }


//    function LikeSuccess() {
//        alert('Success!!!');
//    }

//    function LikeFailure() {
//        alert('Failed!!!!');
//    }
         

            
//}



//function log(message) {
//    alert(message);
//}

//function logConsole(message) {
//    console.log(message);
//        }