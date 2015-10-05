using System;
using System.IO;
using System.Collections.Generic;
using System.Configuration;
using System.Security;
using System.Linq;
using Microsoft.SharePoint.Client;



namespace SPDeploy
{
    class Program
    {
        static void Main(string[] args)
        {                        
            

            using (var context = new ClientContext(GetConfigSetting("SharePointSiteURL")))
            {
                context.Credentials = new SharePointOnlineCredentials(GetConfigSetting("Username"), GetPassword());
                context.Load(context.Web, w => w.Title);
                context.ExecuteQuery();
                Log(string.Format("Connected to:{0}", context.Web.Title));

                UploadMasterPage(context);

                
    
                Log("Done. Press any key to exit.");
                Console.ReadLine();

            }
        }

        private static void CreateSiteStructure()
        {

        }

        private static void UploadMasterPage(ClientContext context)
        {
            
            string root = GetFolderRoot() + @"\MasterPage";
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
        private static string GetFolderRoot()
        {
            string mfl = System.Reflection.Assembly.GetExecutingAssembly().Location;
            int j = mfl.IndexOf("SPDeploy") + 8;
            string p = mfl.Substring(0, j);            
            return p + @"\Master page Gallery\DI";
        }
    
    }
}
