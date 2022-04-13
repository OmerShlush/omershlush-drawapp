import "./Text.css";
function Text(props) {
  const styleObject = {
    fontSize: 16,
    FontFace: "monospace, sans-serif",
    padding: 12,
    fontWeight: 200,
  };

  if (props.type === "headline") {
    styleObject.fontWeight = "bold";
    styleObject.fontSize = 24;
  }

  if (props.fontsize) {
    styleObject.fontSize = props.fontsize;
  }

  return (
    <span className="text" style={styleObject}>
      {props.children}
    </span>
  );
}

export default Text;
