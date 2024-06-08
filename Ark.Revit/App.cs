using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Events;
using DesignAutomationFramework;

namespace Ark.Revit
{
    [Transaction(TransactionMode.Manual)]
    [Regeneration(RegenerationOption.Manual)]
    public class App : IExternalDBApplication
    {
        public bool runInCloud = true;

        public ExternalDBApplicationResult OnStartup(ControlledApplication application)
        {
            Console.WriteLine("Starting up ARK.");
            if (runInCloud)
            {
                DesignAutomationBridge.DesignAutomationReadyEvent += HandleDesignAutomationReadyEvent;
                return ExternalDBApplicationResult.Succeeded;
            } else
            {
                application.ApplicationInitialized += HandleApplicationInitializedEvent;
                return ExternalDBApplicationResult.Succeeded;
            }
        }

        private void HandleApplicationInitializedEvent(object sender, ApplicationInitializedEventArgs e)
        {
            Application app = sender as Application;
            String filePath = @"C:\\Users\\barbosav\\Downloads\\Structurall_detached.rvt\";
            var document = app.OpenDocumentFile(@"C:\\Users\\barbosav\\Downloads\\Structurall_detached.rvt");

            if (document == null) throw new InvalidOperationException("Could not open document.");

#pragma warning disable CS0618 // Type or member is obsolete
            var data = new DesignAutomationData(app, filePath);
#pragma warning restore CS0618 // Type or member is obsolete

            Core.Main(data);
        }

        public ExternalDBApplicationResult OnShutdown(ControlledApplication application)
        {
            return ExternalDBApplicationResult.Succeeded;
        }

        private void HandleDesignAutomationReadyEvent(object sender, DesignAutomationReadyEventArgs e)
        {
            Console.WriteLine("Design Automation ready.");
            e.Succeeded = true;
            Core.Main(e.DesignAutomationData);
            Console.WriteLine("Design Automation finished.");
        }
    }
}
