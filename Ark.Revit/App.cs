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

        public ExternalDBApplicationResult OnStartup(ControlledApplication application)
        {
            #if DEBUG
            application.ApplicationInitialized += HandleApplicationInitializedEvent;
            return ExternalDBApplicationResult.Succeeded;
            #endif

            DesignAutomationBridge.DesignAutomationReadyEvent -= HandleDesignAutomationReadyEvent;
            return ExternalDBApplicationResult.Succeeded;
        }

        private void HandleApplicationInitializedEvent(object sender, ApplicationInitializedEventArgs e)
        {
            Application app = sender as Application;
            String filePath = @"C:\\Users\\barbosav\\Downloads\\Structurall_detached.rvt\";
            var document = app.OpenDocumentFile(@"C:\\Users\\barbosav\\Downloads\\Structurall_detached.rvt");

            if (document == null) throw new InvalidOperationException("Could not open document.");

            var data = new TestDesignAutomationData(filePath, document, app);
            Core.Main(data);
        }

        public ExternalDBApplicationResult OnShutdown(ControlledApplication application)
        {
            return ExternalDBApplicationResult.Succeeded;
        }

        private void HandleDesignAutomationReadyEvent(object sender, DesignAutomationReadyEventArgs e)
        {
            Core.Main(e.DesignAutomationData as IDesignAutomationData);
        }
    }
}
