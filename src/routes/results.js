import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const filelocation = location.state.msgid;

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Results - file location - {filelocation}</h2>
      <a href={filelocation}>FILE</a>
      <br></br>
      <br></br>
      <Link to="/">Back Home</Link>
    </main>
  );
}
