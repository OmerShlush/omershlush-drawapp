function Emptycol (props) {
    let col;
    if(!props.cols)
    {
        col = 'col-1';
    } else {
        col = 'col-' + String(props.cols);
    };
    return <div className={col} />
}

export default Emptycol;