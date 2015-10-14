using System;
using System.IO;
using System.Collections.Generic;
using System.Configuration;
using System.Security;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using Microsoft.SharePoint.Client;



namespace SPDeploy
{
    class Program
    {
        static void Main(string[] args)
        {

            //This console application can be run from a developers machine on to their own O365 instance
            //and deployed into Staging and live by simply updating config values
            //using (var context = new ClientContext(GetConfigSetting("SharePointSiteURL")))
            //{
            //    context.Credentials = new SharePointOnlineCredentials(GetConfigSetting("Username"), GetPassword());
            //    context.Load(context.Web, w => w.Title);
            //    context.ExecuteQuery();
            //    Log(string.Format("Connected to:{0}", context.Web.Title));


                //TODO: Need to create a Site Collection here                

                //***The below works to upload a MasterPage and can be extended to upload all the other
                //***artefacts from their respective folders
                //UploadMasterPage(context);

                //TODO: Need to set the MasterPage

                //***The below works to create a site and can be extended to read from XML file and create
                //***Complex structure if needed
                //CreateSiteStructure(context);

                //TODO: Configure the Pages library of each site to:
                //Set a default content type
                //Set Approvals on and Versioning


                //Log("Done. Press any key to exit.");
                //Console.ReadLine();

            //}

            //This console application can be run from a developers machine on to their own O365 instance
            //and deployed into Staging and live by simply updating config values
            using (var context = new ClientContext(GetConfigSetting("ContentTypeHub")))
            {
                context.Credentials = new SharePointOnlineCredentials(GetConfigSetting("Username"), GetPassword());
                context.Load(context.Web, w => w.Title);
                context.ExecuteQuery();
                Log(string.Format("Connected to:{0}", context.Web.Title));

                //Create fields - use the existing FieldDefinition.xml as input
                CreateFields(context);

                //Create the Content Types

                Log("Done. Press any key to exit.");
                Console.ReadLine();
            }
        }

        private static void CreateFields(ClientContext context)
        {
            Deploy deploy = new Deploy();

            string XMLFile = GetFolderRoot() + @"\Fields\FieldDefinition.xml";
            XElement doc = XElement.Load(XMLFile);
            IEnumerable<XElement> fields =
                from e1 in doc.Elements()
                select e1;
            foreach (XElement e in fields)
            {
                string result = deploy.CreateFields(context, e.ToString());
                if (result != "Success")
                    Log(result);
            }
            
        }

        private static void CreateSiteStructure(ClientContext context)
        {
            //Iterate through an XML file of the site structure and create as follows...
            Deploy deploy = new Deploy();
            deploy.CreateSite(context, "MytestSite", "MyNamedTestSite", "Some random description");
        }

        private static void UploadMasterPage(ClientContext context)
        {
            
            string root = GetDIFolderRoot() + @"\MasterPage";
            string[] files = Directory.GetFiles(root);
            FileInfo fi = new FileInfo(files[0]);

            string destFolder = GetConfigSetting("RootCustomMasterPageFolderUrl") + @"/MasterPage";

            //shd only be one file   
            Deploy deploy = new Deploy();
            deploy.UploadMasterPage(context, destFolder, fi.Name, files[0]);
        }

        private static SecureString GetPassword()
        {            
            string pwd = GetConfigSetting("Password");            
            SecureString securePassword = new SecureString();            

            foreach (char c in pwd.ToCharArray())
            {
                securePassword.AppendChar(c);
            }            
                 
            return securePassword;
        }


        private static string GetConfigSetting(string key)
        {
            return ConfigurationManager.AppSettings.Get(key);
        }

        private static void Log(string message)
        {
            Console.WriteLine(message);
        }

        /// <summary>
        /// returns the start location of all the files needed to upload
        /// </summary>
        /// <returns></returns>
        private static string GetDIFolderRoot()
        {
            string p = GetFolderRoot();                       
            return p + @"\Master page Gallery\DI";
        }

        private static string GetFolderRoot()
        {
            string mfl = System.Reflection.Assembly.GetExecutingAssembly().Location;
            int j = mfl.IndexOf("SPDeploy") + 8;
            string p = mfl.Substring(0, j);
            return p;
        }
    
    }
}
