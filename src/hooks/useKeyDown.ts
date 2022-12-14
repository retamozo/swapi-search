import { KeyboardEvent, useState } from "react";

type Params = {
    optsLength: number;
    onEnter?: () => void
};

type UseKeyDown = (params: Params) => {
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    focusIndex: number;
};

export const useKeyDown: UseKeyDown = ({ optsLength, onEnter }) => {
    const [focusIndex, setFocusIndex] = useState(-1);

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

        switch (e.key) {
            case "ArrowDown":
                setFocusIndex(prev => Math.min(prev + 1, optsLength - 1));
                break;
            case "ArrowUp":
                setFocusIndex(prev => Math.max(prev - 1, 0))
                break;
            case "Enter":
                onEnter?.()
                break;
            default: break;

        }


    };

    return { focusIndex, onKeyDown };
};
