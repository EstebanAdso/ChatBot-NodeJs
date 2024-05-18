const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MySQLAdapter = require('@bot-whatsapp/database/mysql');

const MYSQL_DB_HOST = 'localhost';
const MYSQL_DB_USER = 'root';
const MYSQL_DB_PASSWORD = '';
const MYSQL_DB_NAME = 'bot';
const MYSQL_DB_PORT = '3306';



const certificadoEmpresa = addKeyword(['comercio', 'certificado'])
  .addAnswer('🚀 Nuestra camara de Comercio, somos una empresa Colombiana que cree en las compras seguras', {
    media: 'https://imgur.com/uSqVMHG.png' // Reemplaza con la URL completa de tu imagen 
  });

// Definir los flujos secundarios
const flowEmpresa = addKeyword(['1', 'empresa'])
  .addAnswer([
    ' 🤩👟¡Bienvenido a Monaco Shoes! Somos una empresa colombiana que ofrece calzado de alta calidad con venta exclusiva en línea. Con métodos de pago seguro, como la opción de contraentrega, hacemos que comprar sea fácil y conveniente para ti. ¡Descubre estilo y comodidad con Monaco Shoes hoy mismo!',
    '🚀 escribe *certificado* y te enviaremos nuestra camara de comercio para que no dudes en comprar con nosotros .'
  ], null, null, [certificadoEmpresa]);

const flowCatalogo = addKeyword(['2', 'catalogo'])
.addAnswer('🚀 Bienvenido, anexaremos los siguientes catálogos en pdf para que los revises. ¿Qué te gustaría hacer a continuación?')
.addAnswer([
  '🔍 Ver Catálogo: [https://tu-sitio-web.com/catalogo](https://tu-sitio-web.com/catalogo)',
  '📞 Contactar: [https://wa.me/tu-numero-de-whatsapp](https://wa.me/tu-numero-de-whatsapp)'
]);

const flowPagina = addKeyword(['3', 'pagina'])
  .addAnswer([
    '🙌 Chequea nuestra página Web ',
    'https://estebanadso.github.io/',
    '🚀 escriba volver pare regresar.'
  ]);

const flowPromociones = addKeyword(['4', 'promociones'])
  .addAnswer('Estos son los modelos',{
    buttons:[
      {
        body:'imagen'
      },
      {
        body:'algo'
      }
    ]
  });

// Variable para rastrear si el flujo del asesor ha sido completado
let asesorCompletado = false;

const flowAsesor = addKeyword('5')
  .addAnswer(['En un momento un Asesor se pondrá en contacto contigo'])
  .addAnswer('¿Cuál es tu Nombre?', {capture:true}, (ctx) => {
    console.log('Mensaje Entrante', ctx.body);
  })
  .addAnswer('¿En qué ciudad te encuentras?', {capture:true}, (ctx) => {
    console.log('Mensaje Entrante', ctx.body);
    // Marcar el flujo del asesor como completado después de responder a todas las preguntas
    asesorCompletado = true;
  })
  .addAnswer('En breve un asesor se pondrá en contacto contigo')


// Definir el flujo principal
const flowPrincipal = addKeyword(['hola', 'hey', 'Sigue disponible', 'volver', 'precio'])
  .addAnswer('🙌 Hola bienvenido a Monaco Shoes  🤩👟', '¡Bienvenido/a a nuestra tienda de zapatos en línea! ¿Qué te gustaría hacer? Por favor, selecciona una de las siguientes opciones 👀:')
  .addAnswer([
    '👉 1. Conocer más sobre nuestra empresa',
    '👉 2. Revisar el catálogo de productos',
    '👉 3. Visitar nuestra página web',
    '👉 4. Promociones',
    '👉 5. Hablar con un Asesor'
  ], null, null, [flowEmpresa, flowCatalogo, flowPagina, flowPromociones, flowAsesor]);



  const flowGracias = addKeyword(['gracias', 'dios le pague'])
  .addAnswer([
    '🙌 De nada el placer es nuestro '
  ]);

const main = async () => {
  const adapterDB = new MySQLAdapter({
    host: MYSQL_DB_HOST,
    user: MYSQL_DB_USER,
    database: MYSQL_DB_NAME,
    password: MYSQL_DB_PASSWORD,
    port: MYSQL_DB_PORT,
  });
  const adapterFlow = createFlow([flowPrincipal,flowGracias]);
  const adapterProvider = createProvider(BaileysProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  });
  QRPortalWeb();
};

main();