import { useState } from "react";
import "./styles/App.css";
import { ZoomMtg } from "@zoom/meetingsdk";
import "bootstrap/dist/css/bootstrap.min.css";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function App() {
  // Replace with your actual endpoint
  const authEndpoint = "https://vdd3pg6mla.execute-api.ap-southeast-1.amazonaws.com/latest";
  const meetingNumber = "98492174315";
  const passWord = "065567915";
  // State for user inputs
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const userEmail = "";
  const registrantToken = "";
  const zakToken = "";
  const leaveUrl = "https://zoom.com";

  const getSignature = async () => {
    try {
      const req = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber: meetingNumber,
          role: role,
          webrtc: 1,
        }),
      });
      const res = await req.json();
      const signature = res.signature as string;
      console.log("Signature: ", signature);
      startMeeting(signature);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    getSignature();
  };

  function startMeeting(signature: string) {
    document.getElementById("zmmtg-root")!.style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success: unknown) => {
        console.log(success);
        // can this be async?
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: name,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success: unknown) => {
            console.log(success);
          },
          error: (error: unknown) => {
            console.log(error);
          },
        });
      },
      error: (error: unknown) => {
        console.log(error);
      },
    });
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>
        <div className="container-fluid text-start">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">
                Name:
              </label>
              <input id="nameInput" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="form-control" />
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <div className="mb-3">
              <label htmlFor="roleSelect" className="form-label">
                Role:
              </label>
              <select id="roleSelect" value={role} onChange={(e) => setRole(Number(e.target.value))} className="form-select">
                <option value={0}>Participant</option>
                <option value={1}>Host</option>
              </select>
            </div>
            <div className="mb-3 text-center">
              <button type="submit" className="btn btn-primary">
                Join Meeting
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
