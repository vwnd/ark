import RhinoCompute from "compute-rhino3d";

interface RhinoToSpeckleOptions {
  rhino: {
    model: string;
  };
  speckle: {
    token: string;
    project: string;
    model: string;
  };
  ark: {
    document: string;
  };
}

export async function rhinoToSpeckle(options: RhinoToSpeckleOptions) {
  const url = process.env.RHINO_COMPUTE_HOST || "http://localhost:6500/";
  const apiKey = process.env.RHINO_COMPUTE_KEY || "";

  const serialized = JSON.stringify(options);
  const args = RhinoCompute.zipArgs(false, serialized);
  console.log(args);
}
// const version = "8.0";
// const endpoint = "speckle-converter/converttospeckle-string";

// const arglist = [];

// const filebase64 = await file.arrayBuffer().then((buffer) => {
//   return Buffer.from(buffer).toString("base64");
// });

// arglist.push(filebase64);

// try {
//   let request = {
//     method: "POST",
//     body: JSON.stringify(arglist),
//     headers: {
//       "User-Agent": `compute.rhino3d.js/${version}`,
//       RhinoComputeKey: apiKey,
//     },
//   };

//   let p = fetch(url + endpoint, request);
//   const json = p.then((r) => r.json());

//   return json;
// } catch (error) {
//   console.log(error);
// }
