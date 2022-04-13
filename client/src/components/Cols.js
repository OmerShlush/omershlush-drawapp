import "./Cols.css";

function Cols(props) {
  let size;

  if (!props.size) {
    size = "col-1";
  } else {
    size = "col-" + String(props.size);
  }

  return <div className={`${size}`}>{props.children}</div>;
}

export default Cols;
