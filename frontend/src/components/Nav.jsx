import React, { useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';


function Nav() {
  const [showModal, setShowModal] = useState(false);

  // Funciones para abrir y cerrar el modal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponible, setDisponible] = useState('');
   
  
    const handleExportPDF = () => {
      axios({
        url: 'http://localhost:8081/export/pdf',
        method: 'GET',
        responseType: 'blob', // Importante para manejar archivos
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'productos.pdf'); // Nombre del archivo PDF
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error('Error al exportar PDF:', error));
    };


  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/create", {
        nombre,
        descripcion,
        precio,
        disponible,
      })
      .then((res) => {
        setShowModal(false);
        window.location.reload();  // Recarga la página completa
      })
      .catch((err) => console.error(err));
  };

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

        <Button variant="success" onClick={handleShow} className="ml-auto">
          AGREGAR
        </Button>
        <div>
            <a>       </a>
        </div>

        <Button variant="primary" onClick={handleExportPDF} className="ml-2">
          Exportar a PDF
        </Button>
      </nav>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="nombre" onChange={e => setNombre(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control type="email" placeholder="descripcion" onChange={e => setDescripcion(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="email" placeholder="precio" onChange={e => setPrecio(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Existencia</Form.Label>
              <Form.Control type="email" placeholder="cantidad" onChange={e => setDisponible(e.target.value)} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Nav;

