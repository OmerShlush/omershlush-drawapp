import { Link } from "react-router-dom";
import "./Button.css";

const Button = (props) => {
  return (
    <Link
      to={props.to ? props.to : "#"}
      id={props.id ? props.id : null}
      className={`linkBtn ${props.class ? props.class : ""} ${
        props.size ? props.size : ""
      } ${props.isActive ? "active" : ""}`}
      onClick={props.onClick}
    >
      {props.value ? props.value : props.children}
    </Link>
  );
};

export default Button;
