import React from "react";

function Agregar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
        </button>
        <a className="navbar-brand bg-blue" href="/Home">
          CRUD PRODUCTOS
        </a>
        <button className="btn btn-success ">Agregar</button>
      </nav>
    </>
  );
}

export default Agregar;
