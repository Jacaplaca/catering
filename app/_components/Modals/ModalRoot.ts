'use client'
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";


type ModalProps = {
    children: ReactNode;
};

const ModalRoot = ({ children }: ModalProps) => {
    // create div element only once using ref
    const elRef = useRef<HTMLDivElement | null>(null);
    if (!elRef.current) elRef.current = document.createElement("div");

    useEffect(() => {
        const modalRoot = document.querySelector("#modal-root")!;
        const el = elRef.current!; // non-null assertion because it will never be null
        //clean before adding
        modalRoot.innerHTML = '';
        modalRoot.appendChild(el);
        // return () => {
        //     modalRoot = document.querySelector("#modal-root") as HTMLElement;
        //     console.log("🚀 ~ file: Modal.ts:16 ~ useEffect ~ modalRoot", modalRoot)
        //     // modalRoot.removeChild(el);
        // };
    }, []);

    return createPortal(children, elRef.current);
}

export default ModalRoot;