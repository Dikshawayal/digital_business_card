import { useState, useRef, useEffect } from "react";
import icons from "../data/icons";

function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selected = icons.find((i) => i.name === value) || icons[0];

    return (
        <div className="icon-picker-wrap" ref={ref}>
            <button type="button" className="icon-picker-trigger" onClick={() => setOpen((o) => !o)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {selected.paths.map((d, i) => <path key={i} d={d} />)}
                </svg>
                <span>{value}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-picker-chevron"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {open && (
                <div className="icon-picker-dropdown">
                    {icons.map((icon) => (
                        <button
                            key={icon.name}
                            type="button"
                            className={`icon-picker-option ${value === icon.name ? "icon-picker-option-active" : ""}`}
                            onClick={() => { onChange(icon.name); setOpen(false); }}
                            title={icon.name}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                {icon.paths.map((d, i) => <path key={i} d={d} />)}
                            </svg>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default IconPicker;
