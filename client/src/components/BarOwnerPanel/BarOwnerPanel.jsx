import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LocalsInfo from "../MyLocalsInfo/LocalsInfo";
import Navbar from "../Navbar/Navbar";
import style from "./BarOwnerPanel.module.css"

export default function BarOwnerPanel() {
    const { profile, darkmode } = useSelector(state => state)
    const history = useHistory();

    const handleCreate = () => {
        history.push("/newplace")
    }
    const handleVolver = () => {
        history.push("/profile")
    }

    return (
        <>
            <Navbar />
            <button onClick={handleVolver}>Volver al perfil</button>
            <div>
                <h1>Locales</h1>
                {profile.locals?.length
                    ?
                    <div className={style.localInfo}>
                        <LocalsInfo profileId={profile.id} locals={profile.locals} />
                    </div>
                    :
                    <div>
                        <h3>Actualmente no tienes ningún local</h3>
                        <button onClick={handleCreate} className={style.crearButton}>Crear local</button>
                        <hr />
                    </div>}
            </div>
            <div>
                <h1>Reservas</h1>
            </div>
        </>
    )
}