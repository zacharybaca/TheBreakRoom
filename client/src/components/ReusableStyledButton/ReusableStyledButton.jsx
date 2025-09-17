import './reusable-styled-button.css';
import React from 'react';

const ReusableStyledButton = (props) => {
  const [title, setTitle] = React.useState('');
  const [clickFunction, setClickFunction] = React.useState(() => {});
  const [type, setType] = React.useState('');

  React.useEffect(() => {
    if (props.title) setTitle(props.title);
    if (props.clickFunction) setClickFunction(() => props.clickFunction);
    if (props.type) setType(props.type);
  }, [props.title, props.clickFunction, props.type]);

  return (
    <button
      type={type}
      className="reusable-styled-button glow-on-arrival-entry"
      onClick={clickFunction}
    >
      {title}
    </button>
  );
};

export default ReusableStyledButton;
