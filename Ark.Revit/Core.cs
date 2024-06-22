using Autodesk.Revit.ApplicationServices;
using Autodesk.Revit.DB;
using ConverterRevitShared;
using DesignAutomationFramework;
using Objects.BuiltElements;
using Objects.Converter.Revit;
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Helpers;
using Speckle.Core.Logging;
using Speckle.Core.Models;
using Speckle.Core.Transports;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Ark.Revit
{
    public interface IDesignAutomationData
    {
        public Application RevitApp { get; set; }
        public Document RevitDoc { get; set; }
        public string FilePath { get; set; }
    }

    public class TestDesignAutomationData : IDesignAutomationData
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

            string modelDirectory = Path.GetDirectoryName(modelPath);

            Document doc = data.RevitDoc;
            if (doc == null) throw new InvalidOperationException("Could not open document.");

            var supportedCategories = new HashSet<BuiltInCategory> {
                BuiltInCategory.OST_StructuralColumns,
                BuiltInCategory.OST_StructuralFraming,
                BuiltInCategory.OST_StructuralTruss,
                BuiltInCategory.OST_StructuralFoundation,
                BuiltInCategory.OST_CurtainWallMullions,
                BuiltInCategory.OST_CurtainWallPanels,
                BuiltInCategory.OST_Rooms,
                BuiltInCategory.OST_Areas,
                BuiltInCategory.OST_Walls,
                BuiltInCategory.OST_Floors,
                BuiltInCategory.OST_Ceilings,
                BuiltInCategory.OST_Doors,
                BuiltInCategory.OST_Windows,
                BuiltInCategory.OST_Stairs,
                BuiltInCategory.OST_Ramps,
                BuiltInCategory.OST_Roofs,
                BuiltInCategory.OST_Furniture,
            };

            var categoriesFilter = new ElementMulticategoryFilter(supportedCategories);

            var collector = new FilteredElementCollector(doc);
            collector.WherePasses(categoriesFilter);

            var columns = collector.ToElements();

            // Init Speckle
            SpecklePathProvider.OverrideApplicationDataPath(modelDirectory);
            Setup.Init("ark-v1", "ark", new SpeckleLogConfiguration(Serilog.Events.LogEventLevel.Debug, true, false, false, false, false));

            var converter = new ConverterRevit();
            converter.SetContextDocument(doc);
            var revitDocumentAggregateCache = new RevitDocumentAggregateCache(doc);
            converter.SetContextDocument(revitDocumentAggregateCache);

            var commitBuilder = new RevitCommitObjectBuilder(CommitCollectionStrategy.ByCollection);

            foreach (var column in columns)
            {
                Base result = converter.ConvertToSpeckle(column);
                if (result == null) continue;
                commitBuilder.IncludeObject(result, column);
            }

            var rootCommitObject = converter.ConvertToSpeckle(doc) ?? new Collection();
            Console.WriteLine("Converted document.");

            commitBuilder.BuildCommitObject(rootCommitObject);
            Console.WriteLine("Built commit object.");

            SendToSpeckle(rootCommitObject, modelDirectory);

            var sent = SendDeliverables(doc).Result;
            if (sent)
            {
                Console.WriteLine("Deliverables sent.");
            }
        }

        private static async Task<bool> SendDeliverables(Document doc)
        {
            using (Transaction tx = new Transaction(doc))
            {
                tx.Start("Export PDF");

                FilteredElementCollector collector = new FilteredElementCollector(doc);
                ICollection<ElementId> sheetIds = collector
                    .OfClass(typeof(ViewSheet))
                    .Cast<ViewSheet>()
                    .Where(v => v.CanBePrinted)
                    .Select(v => v.Id)
                    .ToList();

                if (sheetIds.Count == 0)
                {
                    Console.WriteLine("No sheets found in the document.");
                    tx.RollBack();
                    return false;
                }

                var workingDirectory = Directory.GetCurrentDirectory();

                PDFExportOptions options = new PDFExportOptions()
                {
                    Combine = true,
                    ExportQuality = PDFExportQualityType.DPI300,
                    FileName = "deliverables",
                };

                Console.WriteLine($"Exporting ${sheetIds.Count} deliverables.");

                doc.Export(workingDirectory, sheetIds.ToList(), options);

                var httpClient = new HttpClient();
                var url = "https://ark-sable.vercel.app/api/deliverables";

                var formData = new MultipartFormDataContent();
                formData.Headers.ContentType.MediaType = "multipart/form-data";

                var filePath = Path.Combine(workingDirectory, "deliverables.pdf");
                // Add other form fields

                var fileExists = File.Exists(filePath);
                if (!fileExists)
                {
                    Console.WriteLine("File does not exist.");
                    tx.RollBack();
                    return false;
                }

                // Add the file content
                var bytes = File.ReadAllBytes(filePath);
                Console.WriteLine($"File size: {bytes.Length} bytes.");
                var fileContent = new ByteArrayContent(bytes);
                formData.Add(fileContent, "file", doc.Title + ".pdf");

                // Send the request
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("multipart/form-data"));
                var response = await httpClient.PostAsync(url, formData);

                // Read the response
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Response: " + responseContent);
                    return true;
                    tx.RollBack();
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Error: " + response.StatusCode + " " + errorContent);
                    return false;
                    tx.RollBack();
                }
            }
            return true;
        }

        private static async void SendToSpeckle(Base rootCommitObject, string blobStorageFolder = null)
        {
            var startSendTime = DateTime.Now;
            Console.WriteLine("SendToSpeckle started");
            string speckleToken = "8575964fa83e5f7b08e9da82ceb428f4c6dfb1ee8a";
            string projectId = "f97a0b4c05";
            string modelName = "ark/revit";

            var account = new Account()
            {
                token = speckleToken,
                serverInfo = new ServerInfo()
                {
                    url = "https://app.speckle.systems",
                }
            };

            var client = new Client(account);
            var transport = new ServerTransport(account, projectId, 60, blobStorageFolder);

            var objectId = await Operations.Send(rootCommitObject, new List<ITransport>() { transport });
            Console.WriteLine($"Sent commit object to Speckle with ID {objectId}.");
            Console.WriteLine("SendToSpeckle finished");

            await client.CommitCreate(new CommitCreateInput()
            {
                streamId = projectId,
                objectId = objectId,
                branchName = modelName,
                message = "Hello from Ark!",
                sourceApplication = "Ark.Revit",
                totalChildrenCount = (int)rootCommitObject.GetTotalChildrenCount()
            });
            Console.WriteLine($"Created commit in Speckle with ID {objectId}.");
            Console.WriteLine($"SendToSpeckle took {DateTime.Now - startSendTime}ms.");
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
