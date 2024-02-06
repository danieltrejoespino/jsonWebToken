const express = require('express')
const jwt = require('jsonwebtoken')

const secretKey = 'tu_clave_secreta';
const app = express()
const port = 3008

const verifyToken = (req, res, next) => {
  // Obtener el encabezado de autorización
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    // Dividir el encabezado en "Bearer" y el <token>
    const bearer = bearerHeader.split(' ');
    // Obtener el token del array
    const bearerToken = bearer[1];
    // Verificar el token
    try {
      const decoded = jwt.verify(bearerToken, secretKey);
      req.user = decoded;
      next(); // Continuar si el token es válido
    } catch (error) {
      return res.status(401).send({ message: 'Token inválido' });
    }
  } else {
    // Si no hay encabezado de autorización, devolver un error
    return res.status(403).send({ message: 'Se requiere un token para autenticación' });
  }
};

app.get('/', (req, res) => {
  res.json('hola mundo')
})

app.post('/login', (req, res) => {
  // Datos del usuario (en un caso real, deberías validar estos datos contra una base de datos)
  const usuario = {
    id: 1,
    nombre: 'Juan Perez',
    correo: 'juan@ejemplo.com'
  };

  // Crear el token
  const token = jwt.sign({ usuario }, secretKey, { expiresIn: '1h' });

  res.send({ token });
});




app.get('/public', (req, res) => {
  res.json('public')
})

app.get('/datos-protegidos', verifyToken, (req, res) => {
  // Acceder a los datos protegidos
  res.send({ data: 'Información secreta' });
});



app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`);
})
