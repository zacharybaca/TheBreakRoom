import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import "./accent-picker.css";

const AccentPicker = () => {
    const accents = [
        { color: "#4D96FF", vibe: "Chill Blue 🌊" },
        { color: "#6BCB77", vibe: "Focus Green 🌱" },
        { color: "#FFD93D", vibe: "Sunny Yellow ☀️" },
        { color: "#FF6B6B", vibe: "Energetic Red 🔥" },
        { color: "#FF9671", vibe: "Social Coral 🧡" },
        { color: "#845EC2", vibe: "Creative Purple 🎨" },
        { color: "#2C2C2C", vibe: "Neutral Charcoal ⚫" },
        { color: "#00C9A7", vibe: "Zen Teal 🧘" },
    ];

    const formik = useFormik({
        initialValues: {
            color: '',
            vibe: '',
        },
        validationSchema: Yup.object({
            color: Yup.string().required('Selection of color is required'),
            vibe: Yup.string().required('Selection of vibe is required'),
        }),
    })

    const [open, setOpen] = useState(false);

    return (
        <div className="accent-picker">
            <button
                type="button"
                className="accent-button"
                style={{ backgroundColor: formik.values?.color || "#f0f0f0" }}
                onClick={() => setOpen(!open)}
            >
                {formik.values?.color ? formik.values.color : "+"}
            </button>

            {open && (
                <div className="palette-popup">
                    {accents.map((accent) => (
                        <button
                            key={accent.color}
                            type="button"
                            className={`color-swatch ${formik.values?.color === accent.color ? "selected" : ""}`}
                            style={{ backgroundColor: accent.color }}
                            title={accent.vibe}
                            onClick={() => {
                                formik.setFieldValue("color", accent.color);
                                formik.setFieldValue("vibe", accent.vibe);
                                setOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}

            {formik.values?.vibe && (
                <div className="accent-label">{formik.values?.vibe}</div>
            )}
        </div>
    );
};

export default AccentPicker;
