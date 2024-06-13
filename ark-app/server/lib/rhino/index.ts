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
  console.log(JSON.stringify(options));
  const url = process.env.RHINO_COMPUTE_HOST || "http://localhost:6500/";
  const apiKey = process.env.RHINO_COMPUTE_API_KEY || "";

  const serialized = JSON.stringify(options);

  RhinoCompute.url = url;
  RhinoCompute.apiKey = apiKey;
  const args = RhinoCompute.zipArgs(false, serialized);
  console.log(JSON.stringify(args));

  console.log(args);

  try {
    let request = {
      method: "POST",
      body: JSON.stringify(args),
      headers: {
        RhinoComputeKey: apiKey,
      },
    };

    // const response = await fetch(
    //   url + "speckle-converter/converttospeckle-string",
    //   request
    // );

    // console.log(response.status);
  } catch (error) {
    console.log(error);
  }
}
// const version = "8.0";
// const endpoint = "speckle-converter/converttospeckle-string";

// const arglist = [];

// const filebase64 = await file.arrayBuffer().then((buffer) => {
//   return Buffer.from(buffer).toString("base64");
// });

// arglist.push(filebase64);

//   let p = fetch(url + endpoint, request);
//   const json = p.then((r) => r.json());

//   return json;
// } catch (error) {
//   console.log(error);
// }
