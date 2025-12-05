"use client";

import { useCallback, useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);

  const handleClick = useCallback(async () => {
    console.log("posting hello world");
    const response = await fetch("/actions/helloWorld", {
      method: "POST",
    });
    const data = await response.json();
    setResult(JSON.stringify(data));
    // setResult("hello world");
  }, []);

  return (
    <div>
      <pre>{result}</pre>
      <button onClick={handleClick}>post hello world</button>
    </div>
  );
}
