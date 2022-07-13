import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Results() {
  const location = useLocation();
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Results - msg id - {location.state.msgid}</h2>
      <br></br>
      <br></br>
      <Link to="/">Home</Link>
    </main>
  );
}
