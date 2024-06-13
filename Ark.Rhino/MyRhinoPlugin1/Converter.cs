using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Objects.Converter.RhinoGh;
using Rhino;
using Rhino.Commands;
using Rhino.DocObjects;
using Rhino.FileIO;
using Rhino.Geometry;
using Rhino.Runtime;
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Kits;
using Speckle.Core.Models;
using Speckle.Core.Transports;

namespace MyRhinoPlugin1
{
    public static class Converter
    {
        public static string ConvertToSpeckle(string data)
        {
            var log = new List<string>();

            var tmpFilePath = Path.GetTempFileName() + ".3dm";
            try
            {
                // Parse inputs
                var inputs = JObject.Parse(data);
                var modelURL = inputs["rhino"]["model"].ToObject<string>();
                var projectId = inputs["speckle"]["project"].ToObject<string>();
                var branchName = inputs["speckle"]["model"].ToObject<string>();
                var speckleToken = inputs["speckle"]["token"].ToObject<string>();

                log.Add("Parsed inputs.");

                // Download the Rhino model
                try
                {
                    using HttpClient client = new HttpClient();
                    var response = client.GetAsync(modelURL).Result;
                    response.EnsureSuccessStatusCode();

                    using (FileStream fs = new FileStream(tmpFilePath, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        response.Content.CopyToAsync(fs).Wait();
                    }
                    log.Add("Downloaded the Rhino model.");
                }
                catch (System.Exception ex)
                {
                    log.Add($"Failed to download the Rhino model: {ex.Message}");
                    return JsonConvert.SerializeObject(log);
                }

                // Open the Rhino model
                var openedDoc = File3dm.Read(tmpFilePath);

                if (openedDoc == null)
                {
                    log.Add("Failed to open the Rhino file.");
                    return JsonConvert.SerializeObject(log);
                }

                // Create a new headless Rhino document
                var headlessDoc = RhinoDoc.CreateHeadless(null);

                log.Add("Objects in opened document: " + openedDoc.Objects.Count);

                foreach (var obj in openedDoc.Objects)
                {
                    headlessDoc.Objects.Add(obj.Geometry, obj.Attributes);
                }

                log.Add($"Added {headlessDoc.Objects.Count} objects to the headless document.");

                var converter = new ConverterRhinoGh();
                converter.SetContextDocument(headlessDoc);

                log.Add("Created the converter, and set the context document.");

                // var commitObject = converter.ConvertToSpeckle(headlessDoc) as Collection;
                var commitObject = new Collection("Rhino Model", "model");

                log.Add("Created the commit object.");

                foreach (var obj in headlessDoc.Objects)
                {
                    try
                    {
                        var canConvert = converter.CanConvertToSpeckle(obj);
                        if (canConvert)
                        {
                            var converted = converter.ConvertToSpeckle(obj.Geometry);
                            if (converted is not null)
                                commitObject.elements.Add(converted as Base);
                        }
                    }
                    catch (System.Exception ex)
                    {
                        log.Add($"Failed to convert object: {ex.Message}");
                        continue;
                    }
                }

                log.Add($"Converted {commitObject.elements.Count} the objects.");

                // Send the commit object to Speckle
                var commitId = SendToSpeckle(commitObject, projectId, speckleToken, branchName).Result;
                log.Add(commitId);
                return JsonConvert.SerializeObject(log);
            }
            catch (Exception e)
            {
                log.Add($"Error during conversion: {e.Message}");
                return JsonConvert.SerializeObject(log);
            }
            finally
            {
                // check if the file exists
                if (File.Exists(tmpFilePath))
                {
                    // delete the file
                    File.Delete(tmpFilePath);
                }
            }
        }

        private static async Task<string> SendToSpeckle(
            Base rootCommitObject,
            string projectId,
            string speckleToken,
            string branchName,
            string blobStorageFolder = null
        )
        {
            var startSendTime = DateTime.Now;
            Console.WriteLine("SendToSpeckle started.");
            var account = new Account
            {
                token = speckleToken,
                serverInfo = new ServerInfo { url = "https://app.speckle.systems" }
            };

            var client = new Client(account);
            var transport = new ServerTransport(account, projectId, 60, blobStorageFolder);

            try
            {
                var objectId = await Operations.Send(rootCommitObject, new List<ITransport> { transport });
                Console.WriteLine($"Sent commit object to Speckle with ID {objectId}.");

                var commitId = await client.CommitCreate(new CommitCreateInput()
                {
                    streamId = projectId,
                    objectId = objectId,
                    branchName = "rhino model",
                    message = "Hello from Ark!",
                    sourceApplication = "Ark.Rhino",
                    totalChildrenCount = (int)rootCommitObject.GetTotalChildrenCount()
                });

                Console.WriteLine($"Created commit in Speckle with ID {objectId}.");
                return $"Created commit in Speckle with ID {commitId}.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during Speckle send: {ex.Message}");
                return $"Error during Speckle send: {ex.Message}";
            }
            finally
            {
                Console.WriteLine($"SendToSpeckle took {DateTime.Now - startSendTime}.");
            }
        }

        private static void PrintLayoutsToPdf(RhinoDoc doc, string outputFolder)
        {
            string[] layoutNames = doc.Views.GetPageViews().Select(page => page.PageName).ToArray();
            if (layoutNames.Length == 0)
            {
                return;
            }

            foreach (string layoutName in layoutNames)
            {
                string filename = Path.Combine(outputFolder, layoutName + ".pdf");
                var pdf = Rhino.FileIO.FilePdf.Create();
                var page = Rhino.RhinoDoc.ActiveDoc.Views.GetPageViews().FirstOrDefault(p => p.PageName == layoutName);
                if (page != null)
                {
                    var settings = new Rhino.Display.ViewCaptureSettings(page, 300);
                    pdf.AddPage(settings);
                    pdf.Write(filename);
                }
                else
                {
                    return;
                }
            }

        }
    }
}
