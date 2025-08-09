import React, { useEffect, useState } from "react";

const CountUpDown = ({ end }) => {
    const [count, setCount] = useState(0);
    const increase = end > count
        ? Math.ceil(Math.pow(10, Math.trunc(end).toString().length - 2))
        : Math.ceil(Math.pow(10, count.toString().length - 2));

    useEffect(() => {
        const UpdateCount = () => {
            if (count + increase <= end) {
                setCount(count + increase)
            } else if (count - increase >= end) {
                setCount(count - increase)
            }
            else
                setCount(end)
        };
        UpdateCount();
    })

    return <>{count}</>;
}

export default CountUpDown;