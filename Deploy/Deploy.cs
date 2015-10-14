using System;
using System.Linq;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Security;
using Microsoft.SharePoint.Client;


namespace SPDeploy
{
    /// <summary>
    /// Note the idea behind this class is that it could be easily changed from being called by a console
    /// App to be called by a Provider Hosted Add-in
    /// </summary>
    public class Deploy
    {

        #region SiteCollectionAndSiteStuff
        public void CreateSiteCollection()
        {

        }
        

        public void CreateSite(ClientContext context,
            string UrlOfSiteRelativeToRoot,
            string NameOfSite,
            string Description)
        {
            Web rootWeb = context.Site.RootWeb;
            context.Load(rootWeb,  w => w.CustomMasterUrl);

            WebCreationInformation wci = new WebCreationInformation();
            wci.Url = UrlOfSiteRelativeToRoot;
            wci.Title = NameOfSite;
            wci.Description = Description;
            wci.UseSamePermissionsAsParentSite = true;
            wci.WebTemplate = "BLANKINTERNET#0";
            wci.Language = 1033;

            Web subWeb = context.Site.RootWeb.Webs.Add(wci);
            context.ExecuteQuery();

            //Update MasterPage
            subWeb.CustomMasterUrl = rootWeb.CustomMasterUrl;
            subWeb.MasterUrl = rootWeb.CustomMasterUrl;
            subWeb.Update();
            context.Load(subWeb);
            context.ExecuteQuery();

        }
        #endregion

        #region MasterPageStuff
        public void UploadMasterPage(ClientContext Context, 
            string FolderRelativeURL, 
            string RelativeItemUrl, 
            string SourceFilePath)
        {

            FileCreationInformation fci;
            var web = Context.Web;
            List gallery = null;

            using (var stream = System.IO.File.OpenText(SourceFilePath).BaseStream)
            {
                fci = new FileCreationInformation
                {
                    ContentStream = stream,
                    Url = RelativeItemUrl,
                    Overwrite = true
                };

                //Get master Page Gallery list, rootfolder and subfolders
                gallery = web.Lists.GetByTitle("Master Page Gallery");
                Context.Load(gallery);
                Context.Load(gallery.RootFolder);
                Context.Load(gallery.RootFolder.Folders);

                //Get DI sub-folder
                FolderCollection fc = gallery.RootFolder.Folders;
                Folder DI = fc.GetByUrl("DI");
                Context.Load(DI.Folders);

                //Get MasterPage sub-folder
                FolderCollection mps = DI.Folders;
                Folder MasterPage = mps.GetByUrl("MasterPage");
                Context.Load(MasterPage);

                Microsoft.SharePoint.Client.File newFile = MasterPage.Files.Add(fci);

                Context.Load(newFile);
                Context.ExecuteQuery();
            }


            ListItem item = GetItemFromListByUrl(Context, gallery, fci.Url);

            var masterPageHTMLCT = GetContentType(Context, gallery, "Html Master Page");
            item["ContentTypeId"] = masterPageHTMLCT.Id.StringValue;
            item["UIVersion"] = Convert.ToString(15);
            item["MasterPageDescription"] = "Custom MoD DI MasterPage";
            item.Update();
            
            Context.Load(item);
            Context.ExecuteQuery();
            
        }


        public void SetMasterPage()
        {

        }
        #endregion

        #region ContentTypeStuff
        /// <summary>
        /// Gets a ContentType object based on a Content Type Name
        /// </summary>
        /// <param name="context"></param>
        /// <param name="list"></param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        private ContentType GetContentType(ClientContext context, List list, string contentType)
        {
            ContentTypeCollection listContentTypes = list.ContentTypes;
            context.Load(listContentTypes, types => types.Include(type => type.Id, type => type.Name, type => type.Parent));
            var result = context.LoadQuery(listContentTypes.Where(c => c.Name == contentType));
            context.ExecuteQuery();
            ContentType ct = result.FirstOrDefault();

            return ct;

        }
        #endregion

        #region ItemStuff
        private ListItem GetItemFromListByUrl(ClientContext context, List list ,string Url)
        {
            CamlQuery camlQuery = new CamlQuery();
            StringBuilder sb = new StringBuilder();
            sb.Append("<View><Query><Where><Contains><FieldRef Name='FileLeafRef'/><Value Type='Text'>");
            sb.Append(Url);
            sb.Append("</Value></Contains></Where></Query><RowLimit>100</RowLimit></View>");

            camlQuery.ViewXml = sb.ToString();
            ListItemCollection items = list.GetItems(camlQuery);

            context.Load(items);
            context.ExecuteQuery();

            return items[0];
        }
        #endregion

        #region FieldStuff
        /// <summary>
        /// Adds a field to a context, doesn't add to DefaultView, expects name attribute of XML to be set 
        /// to use for internalname - hence the Hint flag
        /// </summary>
        /// <param name="context"></param>
        /// <param name="FldXML"></param>
        public string CreateFields(ClientContext context, string FldXML)
        {
            Web rootWeb = context.Site.RootWeb;

            rootWeb.Fields.AddFieldAsXml(FldXML,false,AddFieldOptions.AddFieldInternalNameHint);
            try
            {
                context.ExecuteQuery();
                return "Success";
            }
            catch (Exception ex)
            {
                return string.Format("Failed to create {0}. failed with exception {1}", FldXML, ex.Message);
            }
        }
        #endregion


    }
}
