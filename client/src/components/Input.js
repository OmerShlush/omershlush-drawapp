import "./Input.css";

const Input = (props) => {
  return (
    <input
      className={`input ${props.class && "danger"}`}
      type={props.type ? props.type : "text"}
      id={props.id ? props.id : null}
      placeholder={props.placeholder}
      autoComplete="off"
    />
  );
};

export default Input;
