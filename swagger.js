const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info:{
        title:'Meta API',
        description:'Meta API生成文件',
    },
    host:'localhost:3000',
    schemes:['http','https']
}

const outputfile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputfile,endpointsFiles,doc);