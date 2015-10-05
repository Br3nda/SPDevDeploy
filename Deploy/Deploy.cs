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
    public class Deploy
    {
            
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


    }
}
