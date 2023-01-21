import React, { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar/Navbar";
import style from "./home.module.css";
import Card from ".././Card/Card"
import {
    getPlaces, setInput
} from "../../redux/actions"

export default function Home () {

    const dispatch = useDispatch();
    
    const searchInput = useSelector(state=>state.searchInput)

    let allPlaces = useSelector((state) => state.places)

    useEffect(()=>{
        dispatch(getPlaces())

        return ()=>{
            dispatch(setInput(""))
        }
    },[dispatch])

    const [currentPlaces, setCurrentPlaces] = useState(10)
    

   function handlePlace(e){
    e.preventDefault()
    setCurrentPlaces(currentPlaces + 10)
   }

   let renderPlaces = allPlaces.slice(0, currentPlaces)

    return (
        <div>
            <Navbar home={true}/>
            <div className={style.info}>
                <div>
                    {
                        allPlaces.length?
                        renderPlaces === "404"? 
                            (
                                <h1>Not Found</h1>
                            )
                            :
                            renderPlaces.map((place) =>{
                                return <Card key={place.id} place={place}>
                                </Card>
                            
                        })
                        :
                            searchInput
                            ?
                            <div>
                                <h1>No hay resultados para esta búsqueda</h1>
                            </div>
                            :
                            <div>
                                <h1 className={style.loading}>loading...</h1>
                            </div>
    
                    }
                </div>
                
                <div>
                    <button className={style.botonpaginado} onChange={handlePlace}>+</button>
                </div>

            </div>

        </div>
    )
}