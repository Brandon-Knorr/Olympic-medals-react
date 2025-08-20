import { useState } from "react";

function Country() {
    const [text, setText] = useState("United States");
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount((count) => count + 1);
    }

    return (
        <>
            <h3>
                {text} : {count}{" "}
            </h3>
            <button onClick={handleClick}>+</button>
        </>
    );
}

export default Country;
