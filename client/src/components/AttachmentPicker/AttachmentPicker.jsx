import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './attachment-picker.css';

const AttachmentPicker = () => {
  const attachments = [
      { attachment: 'pushpin', imgURL: '/assets/pushpin.png' },
    { attachment: 'tape', imgURL: '/assets/tape-strip.png' },
    { attachment: 'tack', imgURL: '/assets/thumbtack.png' },
    { attachment: '#FF6B6B', imgURL: 'Energetic Red 🔥' },
    { attachment: '#FF9671', imgURL: 'Social Coral 🧡' },
    { attachment: '#845EC2', imgURL: 'Creative Purple 🎨' },
    { attachment: '#2C2C2C', imgURL: 'Neutral Charcoal ⚫' },
    { attachment: '#00C9A7', imgURL: 'Zen Teal 🧘' },
  ];

  const formik = useFormik({
    initialValues: {
      attachment: "",
      imgURL: "",
    },
    validationSchema: Yup.object({
      attachment: Yup.string().required('Selection of attachment is required'),
    }),
  });

  const [open, setOpen] = useState(false);

  return (
    <div className="attachment-picker">
      <button
        type="button"
        className="attachment-button"
        style={{ backgroundImage: formik.values?.imgURL || '' }}
        onClick={() => setOpen(!open)}
      >
        {formik.values?.attachment ? formik.values.attachment : '+'}
      </button>

      {open && (
        <div className="attachment-popup">
          {attachments.map((attachment) => (
            <button
              key={attachment.attachment}
              type="button"
              className={`attachment-swatch ${formik.values?.attachment === attachment.attachment ? 'selected' : ''}`}
              style={{ backgroundImage: attachment.imgURL }}
              title={attachment.attachment}
              onClick={() => {
                formik.setFieldValue('attachment', attachment.attachment);
                formik.setFieldValue('imgURL', attachment.imgURL);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}

      {formik.values?.attachment && (
        <div className="attachment-label">{formik.values?.attachment}</div>
      )}
    </div>
  );
};

export default AttachmentPicker;
