import "./PensionRegister.scss"
import React from 'react'

function PensionRegister() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.value);
  }
  return(
    <React.Fragment>
      <h2>Register Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
            <span>¿Cuál es tu email? </span>
            <input type="text" id="email" placeholder="nombre@gmail.com..."/>
        </label>
        <label>
            <span>¿Cuál es tu contraseña? </span>
            <input type="text" id="contraseña" placeholder="****"/>
        </label>
        <input type="submit" value='Register'/>
      </form>
    </ React.Fragment>
   )
}

export { PensionRegister }