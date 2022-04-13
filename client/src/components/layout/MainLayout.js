import './MainLayout.css';

function MainLayout (props) {

    return (
        <div className='mainBlock'>
            {props.children}
        </div>
    );
};

export default MainLayout;