using System;
using System.IO;
using System.Security;
using Microsoft.SharePoint.Client;



namespace SPDeploy
{
    class Program
    {
        static void Main(string[] args)
        {

            string webUrl = "https://codedocs.sharepoint.com/sites/intranet/";
            string username = "codedocs@codedocs.onmicrosoft.com";
            string masterPageFolderUrl = @"/_catalogs/masterpage/DI/MasterPage";
            string filePath = @"C: \Users\worlinp\documents\visual studio 2015\Projects\SPDesign\SPDesign\Master Page Gallery\DI\MasterPage\Peters.html";
            Deploy deploy = new Deploy();
           

            Console.WriteLine("Please enter your password for {0} and user {1}", webUrl, username);

            SecureString password = deploy.GetPasswordFromConsoleInput();

            //Note:SharePointOnlineCredentials is only intended to be used from Windows Forms or a Console app - 
            //otherwise you should use OAuth instead
            //try
            //{
                using (var context = new ClientContext(webUrl))
                {
                    context.Credentials = new SharePointOnlineCredentials(username, password);
                    context.Load(context.Web, w => w.Title);
                    context.ExecuteQuery();
                    Log(string.Format("Connected to:{0}", context.Web.Title));

                  
                    //Upload masterpage
                    deploy.UploadFile(context, masterPageFolderUrl, "Peters.html", filePath);

                    Log("Done. Press any key to exit.");
                    Console.ReadLine();

                }
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine(ex.ToString());
            //    Console.WriteLine("Press any key to exit");
            //    Console.Read();
            //}

            

        }

    
        static void Log(string message)
        {
            Console.WriteLine(message);
        }
        
        

       
    }
}
