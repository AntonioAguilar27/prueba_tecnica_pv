import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import Nav from './components/Nav';
import { Modal, Button, Form } from 'react-bootstrap';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);  // Nuevo estado para almacenar el registro seleccionado

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [disponible, setDisponible] = useState('');

  // Funciones para abrir y cerrar el modal
  const handleShow = (item) => {
    setShowModal(true);
    setCurrentItem(item);  
    setNombre(item.nombre);  
    setDescripcion(item.descripcion);
    setPrecio(item.precio);
    setDisponible(item.disponible);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentItem(null);  
  };

  function reload (){
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8081/');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }

  // Función para actualizar los datos
  const handleSubmit = async (event, fetchData) => {
    event.preventDefault();
  
    try {
      await axios.put(`http://localhost:8081/update/${currentItem.id}`, {
        nombre,
        descripcion,
        precio,
        disponible,
      });
      setShowModal(false);
      reload();
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
    }
  };
  // Función para eliminar un producto
  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmed) {
      try {
        const res = await axios.delete(`http://localhost:8081/delete/${id}`);
        reload();
      } catch (err) {
        console.error("Error al eliminar el producto:", err);
      }
    }
  };

  // Función para obtener los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8081/');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Nav />
      <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
        <div className='bg-light rounded w-50 p-5'>
          <table className='table table-hover table-light'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>DESCRIPCION</th>
                <th>PRECIO</th>
                <th>DISPONIBILIDAD</th>
                <th>FUNCION</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.nombre}</td>
                  <td>{d.descripcion}</td>
                  <td>{d.precio}</td>
                  <td>{d.disponible}</td>
                  <td>
                    <button 
                      className='btn btn-sm btn-success' 
                      onClick={() => handleShow(d)} // Pasar el item a handleShow
                    >
                      Update
                    </button>
                    
                    <button 
                      className='btn btn-sm btn-danger ml-5' 
                      onClick={() => handleDelete(d.id)} // Llamar a handleDelete
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de editar */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="nombre" 
                value={nombre} // Establecer el valor con el estado
                onChange={(e) => setNombre(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="descripcion" 
                value={descripcion} // Establecer el valor con el estado
                onChange={(e) => setDescripcion(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="formPrecio">
              <Form.Label>Precio</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="precio" 
                value={precio} 
                onChange={(e) => setPrecio(e.target.value)} 
              />
            </Form.Group>

            <Form.Group controlId="formDisponible">
              <Form.Label>Existencia</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="cantidad" 
                value={disponible} 
                onChange={(e) => setDisponible(e.target.value)} 
              />
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

export default Home;
