import './Header.css'
function Header({tags,handlerClick}) {
const indexGet=(i)=>{
  handlerClick(i);
}
    return (
        <div className='buttonWrapper'>
      <div className="buttons">
       { tags.map((tag)=>(<button key={tag.index} onClick={()=>indexGet(tag.name)}>{tag.name}</button>))}
        
      </div>
      </div>
    );
  }
  export default Header;
