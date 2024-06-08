using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.DB;
using DesignAutomationFramework;
using Objects.BuiltElements;
using Objects.Converter.Revit;
using Speckle.Core.Models;

namespace Ark.Revit
{
    public interface IDesignAutomationData
    {
        public Application RevitApp { get; set; }
        public Document RevitDoc { get; set; }
        public string FilePath { get; set; }
    }

    public class TestDesignAutomationData: IDesignAutomationData
    {
        public Application RevitApp { get; set; }
        public Document RevitDoc { get; set; }
        public string FilePath { get; set; }

        public TestDesignAutomationData(string filePath, Document revitDoc, Application revitApp)
        {
            FilePath = filePath;
            RevitDoc = revitDoc;
            RevitApp = revitApp;
        }
    }

    public class Core
    {
        public static void Main(DesignAutomationData data)
        {
            if (data == null) throw new ArgumentNullException(nameof(data));

            Application rvtApp = data.RevitApp;
            if (rvtApp == null) throw new InvalidDataException(nameof(rvtApp));

            string modelPath = data.FilePath;
            if (String.IsNullOrWhiteSpace(modelPath)) throw new InvalidDataException(nameof(modelPath));

            Document doc = data.RevitDoc;
            if (doc == null) throw new InvalidOperationException("Could not open document.");

            var collector = new FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_StructuralColumns);
            var columns = collector.ToElements();
            
            var converter = new ConverterRevit();
            converter.SetContextDocument(doc);
            var revitDocumentAggregateCache = new RevitDocumentAggregateCache(doc);
            converter.SetContextDocument(revitDocumentAggregateCache);

            var speckleObjects = converter.ConvertToSpeckle(columns[0]);
            //var speckleObjects = MockObjects();

            Console.WriteLine($"Converted {columns.Count} columns to {speckleObjects.GetTotalChildrenCount()} Speckle objects.");
        }

        private static Base MockObjects()
        {
            var data = new Base();
            var elements = new List<Base>();
            for (int i = 0; i < 10; i++)
            {
                var baseLine = new Objects.Geometry.Line(new Objects.Geometry.Point(i, 0, 0), new Objects.Geometry.Point(i, 0, 3));
                var column = new Column(baseLine);
                elements.Add(column);
            }

            data["elements"] = elements;
            return data;
        }
    }
}
