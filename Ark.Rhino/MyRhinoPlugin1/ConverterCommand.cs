using Rhino;
using Rhino.Commands;
using Rhino.Geometry;
using Rhino.Input;
using Rhino.Input.Custom;
using System;
using System.Collections.Generic;
using Objects.Converter.RhinoGh;
using Rhino.FileIO;
using Speckle.Core.Api;
using Speckle.Core.Credentials;
using Speckle.Core.Kits;
using Speckle.Core.Models;
using Speckle.Core.Transports;

namespace MyRhinoPlugin1
{
    public class ConverterCommand : Command
    {
        public ConverterCommand()
        {
            // Rhino only creates one instance of each command class defined in a
            // plug-in, so it is safe to store a refence in a static property.
            Instance = this;
        }

        ///<summary>The only instance of this command.</summary>
        public static ConverterCommand Instance { get; private set; }

        ///<returns>The command name as it appears on the Rhino command line.</returns>
        public override string EnglishName => "ConverterCommand";

        protected override Result RunCommand(RhinoDoc doc, RunMode mode)
        {

            // Converter.ConvertToSpeckle();
            
            
            return Result.Success;
        }
    }
}
