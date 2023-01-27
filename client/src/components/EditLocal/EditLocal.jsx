import React from "react";
import styles from "./editLocal.module.css";
import {useDispatch} from "react-redux";
import { getUserByid, updatePlace } from "../../redux/actions";
import { useState } from "react";

const validate = (local) => {
    let errors = {};
    if (!local.name.length) errors.name = "Debes escribir un nombre.";
    if (!local.location.length) errors.location = "Debes escribir una dirección.";
    if (local.phone < 0 || !local.phone ) errors.phone = "Debes escribir un número de teléfono.";
    if (local.bookPrice < 0 || !local.bookPrice ) errors.bookPrice = "Escribe el valor de la reserva en tu local.";
    if (local.capacity < 0 || !local.capacity ) errors.capacity = "Escribe la capacidad o aforo de tu local.";
    if (!local.image.length) errors.image = "Debes pegar una URL de una imagen";
    return errors;
}

export default function EditLocal (props) {
    const {localToEdit, userId} = props;

    const dispatch = useDispatch();

    const [local, setLocal] = useState({
        ...localToEdit,
        userId
    });

    const [errors, setErrors] = useState({
        name:"",
        image:"",
        location:"",
        phone:"",
        capacity:"",
        bookPrice:"",
    });
    const [checkboxState, setCheckboxState] = useState({
        lunes: localToEdit.schedule?.includes("lunes"),
        martes:localToEdit.schedule?.includes("martes"),
        miercoles:localToEdit.schedule?.includes("miercoles"),
        jueves:localToEdit.schedule?.includes("jueves"),
        viernes:localToEdit.schedule?.includes("viernes"),
        sabado:localToEdit.schedule?.includes("sabado"),
        domingo:localToEdit.schedule?.includes("domingo"),
        event: localToEdit.event,
        petFriendly: localToEdit.petFriendly
    })
    const [scheduleArray, setScheduleArray] = useState({
            days: [...local.schedule.slice(0,local.schedule.length-2)],
            open: local.schedule[local.schedule.length-2],
            close: local.schedule[local.schedule.length-1]
        }
    )

    const disabled = errors.name || errors.phone || errors.capacity || errors.image || errors.bookPrice || errors.location || !scheduleArray.days.length
    
    const weekDays = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"]
    const horaApertura = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00']
    const horaCierre = ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00'];
    const categories = ["disco","bar","pub"];
    const ageRanges = ["+18","+21","Sin restricciones"];
    const indexApertura = horaApertura.indexOf(scheduleArray.open);
    const indexCierre = horaCierre.indexOf(scheduleArray.close);
    const indexCategory = categories.indexOf(local.category);
    const indexAgeRange = ageRanges.indexOf(local.ageRange[0]);
    setTimeout(() => {
        let apertura = document.querySelector("#apertura");
        let cierre = document.querySelector("#cierre");
        let category = document.querySelector("#category");
        let ageRange = document.querySelector("#ageRange");
        apertura.selectedIndex = indexApertura+1;
        cierre.selectedIndex = indexCierre+1;
        category.selectedIndex = indexCategory+1;
        ageRange.selectedIndex = indexAgeRange+1;
    }, 1);
    
    const handleChange = (e) => {
        setErrors(validate({
            ...local,
            [e.target.name]:e.target.value
        }))
        setLocal({
            ...local,
            [e.target.name]:e.target.value
        })
    }

    const handleHour = (e) => {
        setScheduleArray({
            ...scheduleArray,
            [e.target.name]: e.target.value
        })
    }

    const handleWeekdays = (e) => {
        setCheckboxState({
            ...checkboxState,
            [e.target.name]:!checkboxState[e.target.name]
        })
        if (e.target.checked){
            setScheduleArray({
                ...scheduleArray,
                days:[...scheduleArray.days,e.target.name]
            })
        }else{
            let filterDays = scheduleArray.days.filter(day=>day!==e.target.name)
            setScheduleArray({
                ...scheduleArray,
                days:filterDays
            })
        }
    }

    const handleAge = (e) => {
        setLocal({
            ...local,
            [e.target.name]:[e.target.value]
        })
    }

    const handleCategory = (e) => {
        setLocal({
            ...local,
            [e.target.name]:e.target.value
        })
    }

    const handleCheckbox = (e) => {
        setCheckboxState({
            ...checkboxState,
            [e.target.name]:!checkboxState[e.target.name]
        })
        setLocal({
            ...local,
            [e.target.name]:!local[e.target.name]
        })
    }

    const handleCancel = (e) => {
        e.preventDefault();
        props.setEditing(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedLocal =await dispatch(updatePlace({
            ...local,
            schedule:[...scheduleArray.days,scheduleArray.open,scheduleArray.close]
        }))
        if (updatedLocal.id){
            alert("Local actualizado!")
            props.setEditing(false);
        }else{
            alert(updatedLocal.response.data)
        }
        dispatch(getUserByid(userId))
    }

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <div >
                            <label style={errors.name ? {color: "red"} : null}>Nombre del local: </label>
                            <input
                                type='text'
                                placeholder='Nombre del local'
                                value={local.name}
                                name="name"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div >
                            <label style={errors.image ? {color: "red"} : null}>URL de la imagen: </label>
                            <input
                                type='url'
                                placeholder='Imagen/logo'
                                value={local.image}
                                name="image"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div >
                            <label style={errors.location ? {color: "red"} : null}>Dirección</label>
                            <input
                                type='text'
                                placeholder='Direccion'
                                value={local.location}
                                name="location"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div >
                            <label>Menú</label>
                            <input
                                type='text'
                                placeholder='Menú'
                                value={local.menu}
                                name="menu"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div >
                            <label style={errors.phone ? {color: "red"} : null}>Número de teléfono</label>
                            <input
                                type='text'
                                placeholder='Numero de telefono'
                                value={local.phone}
                                name="phone"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div >
                            <label style={errors.capacity ? {color: "red"} : null}>Capacidad</label>
                            <input
                                type='number'
                                placeholder='Capacidad'
                                value={local.capacity}
                                name="capacity"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.scheduleContainer} >
                            <h4 style={!scheduleArray.days.length ? {color: "red"} : null}>Horarios</h4>
                            <div className={styles.weekHours}>
                                <div className={styles.weekdaysContainer}>
                                    {weekDays.map(day=>(
                                        <label key={day} className={styles.label}>
                                            <input
                                                checked={checkboxState[day]}
                                                type="checkbox"
                                                name={day}
                                                value={day}
                                                onChange={handleWeekdays}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>

                                <div className={styles.hoursContainer}>
                                    <div>
                                        <label className={styles.label}>Desde:</label>
                                        <select name="open" id="apertura" onChange={handleHour} className={styles.selectHours}>
                                            <option hidden>Horario de apertura</option>
                                            {horaApertura.map((hora) => {
                                                return (
                                                    <option key={hora}>{hora}</option>
                                                )
                                            })}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={styles.label}>Hasta:</label>
                                        <select name="close" id="cierre" onChange={handleHour} className={styles.selectHours}>
                                            <option hidden> Horario de cierre</option>
                                            {horaCierre.map((hora) => {
                                                return (
                                                    <option key={hora}>{hora}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <h4>¿Tu local tiene restricciones por edad?</h4>
                        <select id="ageRange" name="ageRange" onChange={handleAge} className={styles.select}>
                            <option hidden>Selecciona las edades</option>
                            <option value="+18">+18</option>
                            <option value="+21">+21</option>
                            <option value="Sin restricciones">Sin restricciones</option>
                        </select>

                        <div >
                            <h4>Categoria</h4>
                            <select id="category" name="category" onChange={handleCategory} className={styles.select}>
                                <option value="" hidden>Selecciona el tipo de local que mas coincida con el tuyo</option>
                                <option value="disco">Discoteca</option>
                                <option value="bar">Bar</option>
                                <option value="pub">Pub</option>
                            </select>
                        </div>

                        <div >
                            <label style={errors.bookPrice ? {color: "red"} : null}>Precio de la reserva</label>
                            <input
                                type='number'
                                placeholder='Precio de la reserva'
                                value={local.bookPrice}
                                name="bookPrice"
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.petFriendlyEventos}>
                            <div >
                                <label>
                                    En tu local se realizan eventos(ej: shows en vivo)
                                    <input
                                        checked={checkboxState.event}
                                        type='checkbox'
                                        value={local.event}
                                        name="event"
                                        onChange={handleCheckbox}
                                    />
                                </label>
                            </div>

                            <div >
                                <label>Tu local es pet friendly?
                                    <input
                                        checked={checkboxState.petFriendly}
                                        type='checkbox'
                                        value={local.petFriendly}
                                        name="petFriendly"
                                        onChange={handleCheckbox}
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="localButton"
                            className={styles.registrarButton}
                            disabled={disabled}
                            >
                            Guardar
                        </button>
                        <button onClick={handleCancel}>Cancelar</button>
                    </form>
                </div>

            </div>

        </div>
    )
}