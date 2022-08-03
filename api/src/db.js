require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, NODE_ENV = '' } = process.env;

let sequelize =
  NODE_ENV === 'production'
    ? new Sequelize({
        database: 'd2qoblbukidquf',
        dialect: 'postgres',
        host: 'ec2-52-206-182-219.compute-1.amazonaws.com',
        port: 5432,
        username: 'ualijjydbrwnjx',
        password:
          '1ee05d86be2f20b4b5e00a15caa749eb75a27b28a9215129d4f4bb5c43a77366',
        pool: {
          max: 3,
          min: 1,
          idle: 10000,
        },
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          keepAlive: true,
        },
        ssl: true,
      })
    : new Sequelize(
        `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
        { logging: false, native: false }
      );


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Books, Users, Apibooks, Payments, Reviews, Userpurchasedetail, Authors, Categories } =
  sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Users.belongsToMany(Books, { through: 'user_bookfav', as: 'favourite' });
Books.belongsToMany(Users, { through: 'user_bookfav', as: 'favourite' });
Users.belongsToMany(Books, { through: 'user_bookcart', as: 'cart' });
Books.belongsToMany(Users, { through: 'user_bookcart', as: 'cart' });
Users.belongsToMany(Reviews, { through: 'user_review' });
Reviews.belongsToMany(Users, { through: 'user_review' });
Payments.belongsToMany(Books, { through: 'pymts_books' });
Books.belongsToMany(Payments, { through: 'pymts_books' });
Users.belongsToMany(Payments, { through: 'user_pymts' });
Payments.belongsToMany(Users, { through: 'user_pymts' });
Users.hasMany(Userpurchasedetail);
Userpurchasedetail.belongsTo(Users);
// para ver los MIXINS generados de cada modelo Country o Activity
// const model = Users; // yourSequelizeModel
// for (let assoc of Object.keys(model.associations)) {
//   for (let accessor of Object.keys(model.associations[assoc].accessors)) {
//     console.log(
//       model.name + '.' + model.associations[assoc].accessors[accessor] + '()'
//     );
//   }
// }
module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
