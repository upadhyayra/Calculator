const Header = (props) => {
  return (
    <div className="header custom-scroll">
      <div className="header_expression custom-scroll">
        <p>{props.expression}</p>
      </div>
          {/* <p className="header_result">{props.result}</p> */}
        
    </div>
  );
};

export default Header;
