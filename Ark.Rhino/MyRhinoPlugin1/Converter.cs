using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Objects.Converter.RhinoGh;
using Rhino;
using Rhino.Commands;
using Rhino.DocObjects;
using Rhino.FileIO;
using Rhino.Geometry;
using Rhino.Runtime;
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Models;
using Speckle.Core.Transports;

namespace MyRhinoPlugin1
{
    public static class Converter
    {
        public static string ConvertToSpeckle(string data)
        {
            try
            {
                Console.WriteLine("Starting conversion to Speckle.");

                // Decode the base64 string
                var decodedData = Convert.FromBase64String(data);
                var openedDoc = File3dm.FromByteArray(decodedData);

                Console.WriteLine("DECODED DATA LENGTH "+decodedData.Length );
                Console.WriteLine("Decoded base64 data.");
                Console.WriteLine(openedDoc.Objects.Count);

                // string filePath = @"N:\Denmark\ZCZ\Daniel_tu_byl\BrepModel-Fancy.3dm";
                // Console.WriteLine($"Reading Rhino file from {filePath}.");

                // var openedDoc = File3dm.Read(filePath);
                if (openedDoc == null)
                {
                    Console.WriteLine("Failed to open the Rhino file.");
                    return "Failed to open the Rhino file.";
                }

                Console.WriteLine("Successfully opened the Rhino file.");

                var headlessDoc = RhinoDoc.CreateHeadless(null);
                Console.WriteLine("Created a headless Rhino document.");
                Console.WriteLine("Count opened Doc: " + openedDoc.Objects.Count);

                // Add objects to headless doc
                foreach (var obj in openedDoc.Objects)
                {
                    //add page views
                    // var views = openedDoc.Views[0].
                    // headlessDoc.Views.AddPageView(views[0]);
                    // openedDoc.Views.AddPageView(obj.Geometry, "A4", "Layout", false, false);
                    // Console.WriteLine(obj.Geometry.GetType());
                    
                    if (obj.Geometry is DetailView or ClippingPlaneSurface)
                    {
                        continue;
                    }
                    try
                    {
                        headlessDoc.Objects.Add(obj.Geometry);
                    }
                    catch (TargetInvocationException e)
                    {
                        Console.WriteLine(e);
                    }
                }
                Console.WriteLine("Added objects to the headless Rhino document.");

                var converter = new ConverterRhinoGh();
                converter.SetContextDocument(headlessDoc);
                Console.WriteLine("Initialized the Speckle converter.");

                // Convert all objects in the file to Speckle objects
                var speckleObjects = new List<Base>();

                Console.WriteLine("Headless doc count: " + openedDoc.Objects.Count);
                foreach (var obj in headlessDoc.Objects)
                {
                    var canConvert = converter.CanConvertToSpeckle(obj.Geometry);

                    if (!canConvert) continue;

                    var baseObj = converter.ConvertToSpeckle(obj.Geometry);
                    speckleObjects.Add(baseObj);
                }

                Console.WriteLine("Converted objects to Speckle format.");

                var root = new Base { ["elements"] = speckleObjects };
                Console.WriteLine(root.GetTotalChildrenCount());
                Console.WriteLine("Created the root Speckle object.");

                // Print layouts to PDF
                PrintLayoutsToPdf(headlessDoc, @"C:\Temp\_ark");
                
                SendToSpeckle(root);
                Console.WriteLine("Triggered Speckle object send.");


                return "Success!";
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error during conversion: {e.Message}");
                throw;
            }
        }

        private static async Task SendToSpeckle(Base rootCommitObject, string blobStorageFolder = null)
        {
            var startSendTime = DateTime.Now;
            Console.WriteLine("SendToSpeckle started.");

            string speckleToken = "c74ebb8c0ab257f27a148aada323541148fcd4e5ce";
            string projectId = "f97a0b4c05";

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

                await client.CommitCreate(new CommitCreateInput()
                {
                    streamId = projectId,
                    objectId = objectId,
                    branchName = "rhino model",
                    message = "Hello from Ark!",
                    sourceApplication = "Ark.Rhino",
                    totalChildrenCount = (int)rootCommitObject.GetTotalChildrenCount()
                });

                Console.WriteLine($"Created commit in Speckle with ID {objectId}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during Speckle send: {ex.Message}");
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
