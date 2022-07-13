import { useLocation } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Results - msg id - {location.state.msgid}</h2>
    </main>
  );
}
