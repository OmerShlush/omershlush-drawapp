import "./Image.css";

const Image = (props) => {
  // LOGO IMAGE
  if (props.type === "logo") {
    return (
      <img
        src={process.env.PUBLIC_URL + "/images/logo.png"}
        className="image"
        alt="Draw & Guess"
      />
    );
  }
  // CANVAS IMAGE
  if (props.type === "canvas") {
    return (
      <img
        src="http://localhost:3001/api/getCanvas"
        className="canvasImg"
        alt="canvas"
      />
    );
  }
};
export default Image;
