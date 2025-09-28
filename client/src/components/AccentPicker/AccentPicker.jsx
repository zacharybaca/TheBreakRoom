import { useState } from "react";
import './accent-picker.css';

const AccentPicker = ({ value, onChange }) => {
    const colors = [
        "#FF6B6B", "#FFD93D", "#6BCB77",
        "#4D96FF", "#845EC2", "#FF9671",
    ];
    const [open, setOpen] = useState(false);

    return (
        <div className="accent-picker">
            <button
                type="button"
                className="accent-button"
                style={{ backgroundColor: value }}
                onClick={() => setOpen(!open)}
            />
            {open && (
                <div className="palette-popup">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                onChange(color);
                                setOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccentPicker;
