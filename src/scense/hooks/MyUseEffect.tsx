import React, { useEffect, useState } from "react";

function MyUseEffect() {
  const [count, setCount] = useState(0);
  const [fullName, setFullName] = useState("guest");
  useEffect(() => {
    if (count === 5) {
      setFullName("Kimsann");
    }
  }, [count]);
  return (
    <div>
      UseEffect
      <div className="flex text-4xl gap-9">
        <button onClick={() => setCount(count + 1)} className="cursor-pointer">
          +
        </button>
        <p>{count}</p>
        <button onClick={() => setCount(count - 1)} className="cursor-pointer">
          -
        </button>
        <p>{fullName} click until 5 you will see my name</p>
      </div>
    </div>
  );
}

export default MyUseEffect;
