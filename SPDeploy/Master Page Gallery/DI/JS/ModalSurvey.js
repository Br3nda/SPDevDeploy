<div id="displayDiv" style="visibility:display">
  <span>Participate in the latest survey</span>
  <input id="btnVote" type="button" value="Vote" /> 
</div>

<script language="javascript" type="text/javascript">
  var listTitle="DISurvey";
  ExecuteOrDelayUntilScriptLoaded(getData, "sp.js");

  var currentUser, list, listItems;
  function getData(){
	var ctx = new SP.ClientContext.get_current();
	this.currentUser = ctx.get_web().get_currentUser();
	ctx.load(this.currentUser);

	this.list = ctx.get_web().get_lists().getByTitle(this.listTitle);
	ctx.load(this.list, "DefaultNewFormUrl");

	var caml = new SP.CamlQuery();
	this.listItems = this.list.getItems(caml);
	ctx.load(this.listItems, "Include(Author)");

	ctx.executeQueryAsync(Function.createDelegate(this, success), Function.createDelegate(this, failure));
   }

   function success(sender, args) {
	if ((this.currentUser) && (this.listItems)) {
	   var displayDiv = $get("displayDiv");
	   var userName = this.currentUser.get_title();
	   var hasVoted = false;
	   var itemsEnumerator = this.listItems.getEnumerator();
	   while (itemsEnumerator.moveNext()) {
		var item = itemsEnumerator.get_current();
		if (username == item.get_item("Author").get_lookupValue()) {
		   hasVoted = true;
		   break;
		}
	   }

	   if (hasVoted) {
		displayDiv.innerHTML = "You have already voted, thank-you";
	   }
	   else {
		$addHandler($get("btnVote"), "click", Function.createDelegate(this, showDialog));
	   }

	   displayDiv.style.visibility = "visible";
	}
   }

   function failure(sender, args) {
	var displayDiv = $get("displayDiv");
	displayDiv.innerHTML = args.get_message();
	displayDiv.style.visibility = "visible";
   }

   function showDialog(){
	var options = {};
	options.title = "Defence Intranet Survey";
	options.url = this.list.get_defaultNewFormUrl();
	options.dialogReturnValueCallback = 
	   function (dialogResult, returnValue) {
		if (dialogResult) {
		   $clearHandlers($get("btnVote")); //detach vote btn and dispose of delegate
		   $get('displayDiv').innerHTML = '<p>Thanks for voting</p>';
		}
	   };

	SP.UI.ModalDialog.showModalDialog(options);
   }
</script>

	



		

