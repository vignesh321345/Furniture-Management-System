import React, { useState } from "react";
import Nav from '../Nav/Nav'
import Header from "../Header/Header";
import Card from "../Card/Card";
import Footer from "../Footer/Footer";
import {tags} from "../../Data/data"
import Sale from '../Sale/Sale'
function Parent(){

    const [name,setName]=useState("All")
    const[search,setSearch]=useState("");
    const[sale,setSale]=useState(false)
const handlerClick=(index)=>{
    if(index.toLowerCase()==="sale"){
        setSale(true);
        setName("")
    }
    if(index.toLowerCase()!=="sale"){
        setSale(false)
        setName(index)
    }

}
const handleSearch=(val)=>{
    setSearch(val);
}



    return(
        <>
       
        <Nav handleSearch={handleSearch} />
        <Header tags={tags} handlerClick={handlerClick}/>
       {!sale &&    <Card  name={name} search={search} />} 
       {sale && <Sale />}
       <Footer />
       
        </>
    )
}
export default Parent;