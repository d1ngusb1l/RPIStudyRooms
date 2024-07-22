import { createContext, type PropsWithChildren, useCallback, useContext, useState } from "react";

const MenuContext = createContext<{ setClosed: () => void }>({ setClosed: () => { } });

export function Menu(props: PropsWithChildren<{ outerLabel: React.ReactNode }>) {
    const [open, setOpen] = useState(false);
    const setClosed = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(open => !open), []);

    return (
        <div className="inline-block">
            <div>
                <button type="button" className="menu-heading-button" aria-expanded="true" aria-haspopup="true" onClick={toggle}>
                    <span>{props.outerLabel}</span>
                    <svg className="text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width={20} height={20}>
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {open && <MenuContext.Provider value={{ setClosed, }}><div className="menu-buttons" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                {props.children}
            </div></MenuContext.Provider>}
        </div>
    )
}

export function MenuButton(props: Omit<React.JSX.IntrinsicElements["button"], "className" | "role" | "tabIndex">) {
    const { setClosed } = useContext(MenuContext);
    return <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" tabIndex={-1} onClick={(event) => {
        setClosed();
        props.onClick?.(event);
    }}>{props.children}</button>
}