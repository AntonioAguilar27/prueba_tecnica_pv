CREATE DATABASE crud_prueba_tecnica;
USE crud_prueba_tecnica;
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(100),
    precio INT NOT NULL,
    disponibilidad INT NOT NULL
);