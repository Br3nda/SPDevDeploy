using Microsoft.SharePoint.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

//Note we would have a webjob running per customer.  Then this would allow for the customer to have 
//multiple tenants as specified in the app.config.  All customers though could use the same AzureTable
//With a partitionkey on 

namespace GetActivePublishersWebJob
{
    class Program
    {
        static void Main(string[] args)
        {

            //install-Package AppForSharePointWebToolkit
            //Adds SharePointContext.cs, TokenHelper.cs and a whole bunch of references
            try {
                var config = (NameValueCollection)ConfigurationManager.GetSection("Sites");
                foreach (var key in config.Keys)
                {
                    Uri siteUri = new Uri(config.GetValues(key as string)[0]);

                    //get the realm for the URL 
                    string realm = TokenHelper.GetRealmFromTargetUrl(siteUri);

                    //Get the Access Token for the URL - requires this app to be registered with the 
                    //tenant (using _layouts/AppRegNew.aspx to create App Principal) and then
                    //using _layouts/AppInv.aspx to request permissions for the App Principal
                    string accessToken = TokenHelper.GetAppOnlyAccessToken(
                        TokenHelper.SharePointPrincipal,
                        siteUri.Authority, realm).AccessToken;

                    //Once we have an Access Token we can ceate a ClientContext using it
                    using (var clientContext = TokenHelper.GetClientContextWithAccessToken(
                        siteUri.ToString(), accessToken))
                    {
                        var site = clientContext.Site;
                        clientContext.Load(site);

                        ChangeQuery siteCQ = new ChangeQuery(false, false);
                        //Object type
                        siteCQ.Item = true;
                        //Change Type ???
                        siteCQ.Add = true;
                        siteCQ.DeleteObject = true;
                        siteCQ.Update = true;

                        var siteChanges = site.GetChanges(siteCQ); //get the site collection changes
                        clientContext.Load(siteChanges);
                        clientContext.ExecuteQuery();

                        foreach (Change change in siteChanges)
                        {
                            if (change is ChangeItem)
                            {
                                ChangeItem ci = change as ChangeItem;
                                ListItem item = null;
                                try {
                                    Web web = site.OpenWebById(ci.WebId); //get the relevant web
                                    clientContext.Load(web);
                                    List list = web.Lists.GetById(ci.ListId);//get the relevant list
                                    clientContext.Load(list);

                                    item = list.GetItemById(ci.ItemId);//get the item
                                    clientContext.Load(item, i=>i["Editor"],
                                                             i=>i["FileRef"]);//load the right bits
                                    clientContext.ExecuteQuery();

                                    FieldUserValue fuv = (FieldUserValue)item["Editor"];
                                    
                                    Console.WriteLine("{0},{1},{2},{3}", item["FileRef"], ci.ChangeType.ToString(), fuv.LookupValue, change.Time);
                                }
                                catch (Exception e)
                                {
                                    //Just because the item is in the change log doesn't mean it exists - 
                                    //it may have been added and then deleted or just deleted
                                    if (e.Message.StartsWith("Item does not exist.") ||
                                        e.Message.StartsWith("File Not Found") ||
                                        e.Message.StartsWith("List does not exist"))
                                        Console.WriteLine("{0},{1},{2},{3}", e.Message.Substring(0,e.Message.IndexOf(".")), ci.ChangeType.ToString(), "Unknown", change.Time);
                                    else
                                        Console.WriteLine("{0},{1},{2}", e.InnerException, e.Message, e.Source);
                                }
                            }
                        }
                    }
                }
            }//try
            catch (Exception ex)
            {
                Console.WriteLine("Exception occured: {0}", ex.Message);
            }
            finally
            {
                Console.WriteLine("Press any key to exit.");
                Console.ReadLine();
            }
        }//main
    }//program
} //namespace
