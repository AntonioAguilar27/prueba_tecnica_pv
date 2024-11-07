const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'crud_prueba_tecnica'
})

app.get('/', function (req, res) {
    const sql = "SELECT * FROM productos";
    db.query(sql, (err, data) => {
        if (err)return res.json(err);
        return res.json(data);
    })
})

app.post('/create', (req, res) => {
    const sql = "INSERT INTO productos (`nombre`, `descripcion`, `precio`, `disponible`) VALUES (?)";
    const values = [
        req.body.nombre,
        req.body.descripcion,
        req.body.precio,
        req.body.disponible
    ]
    db.query(sql, [values], (err, data) => {
        if (err) return res.json("Ocurrio un error" + err);
        return res.json("Creado con exito");
    })
})

app.put('/update/:id', (req, res) => {
    const { id } = req.params;  // Captura el id desde los parámetros de la URL
    const { nombre, descripcion, precio, disponible } = req.body; // Los datos enviados en el cuerpo de la solicitud

    const sql = "UPDATE productos SET `nombre` = ?, `descripcion` = ?, `precio` = ?, `disponible` = ? WHERE id = ?";
    const values = [nombre, descripcion, precio, disponible];
    
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json("Ocurrió un error: " + err);
        return res.json("Actualizado con éxito");
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;  
    const sql = "DELETE FROM productos WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Ocurrió un error al eliminar el producto", error: err });
      }   
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.json({ message: "Producto eliminado con éxito" });
    });
  });




// Ruta para generar el PDF de la tabla
app.get('/export/pdf', (req, res) => {
    const sql = "SELECT * FROM productos";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);

        // Crea un documento PDF
        const doc = new PDFDocument();
        let filename = 'productos.pdf';
        filename = encodeURIComponent(filename);

        // Configura la respuesta HTTP para que devuelva un PDF
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res); // Envía el PDF a la respuesta HTTP

        // Título del documento
        doc.fontSize(18).text('Lista de Productos', { align: 'center' });
        doc.moveDown();

        // Agrega cada producto al PDF
        data.forEach((producto) => {
            doc.fontSize(12)
                .text(`ID: ${producto.id}`)
                .text(`Nombre: ${producto.nombre}`)
                .text(`Descripción: ${producto.descripcion}`)
                .text(`Precio: ${producto.precio}`)
                .text(`Disponible: ${producto.disponible ? 'Sí' : 'No'}`)
                .moveDown(); // Espacio entre productos
        });

        // Finaliza el documento
        doc.end();
    });
});

app.listen(8081, () => {
    console.log('Server running on port 8081');
})
