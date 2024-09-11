import { useState } from "react";
import "./App.css";

type PersonAccess = {
  id: number;
  time: string;
};

function App() {
  const [registeredPeople, setRegisteredPeople] = useState<Array<PersonAccess>>(
    []
  );

  function registerPerson() {
    const newPerson: PersonAccess = {
      id: registeredPeople.length + 1,
      time: new Date().toISOString(),
    };

    setRegisteredPeople([...registeredPeople, newPerson]);
  }

  function formatTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", { hour12: false });
  }

  function exportToCsv() {
    if (!registeredPeople.length) {
      alert("No people registered yet.");
      return;
    }

    const csv = registeredPeople.reduce((acc, p, i) => {
      const timeDifference =
        i === 0
          ? 0
          : Date.parse(p.time) - Date.parse(registeredPeople[i - 1].time);
      return `${acc}${p.id},${p.time},${timeDifference}\n`;
    }, "Order,Time,Time Difference\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "people.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="w-full h-full">
      <div className="flex flex-col mx-auto items-center">
        <div className="mx-auto">
          <h2 className="text-2xl font-bold">People Tracker</h2>

          <div className="justify-between flex sm:justify-normal sm:gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={registerPerson}
            >
              Register
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setRegisteredPeople([])}
            >
              Reset
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={exportToCsv}
            >
              Export CSV
            </button>
          </div>

          <div className="w-full">
            <div className="overflow-y-auto grid grid-cols-2 sm:grid-cols-8 gap-4">
              {registeredPeople.map((p) => (
                <div className="flex gap-2">
                  <p className="font-bold">Order #{p.id}</p>
                  <p>{formatTime(p.time)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
