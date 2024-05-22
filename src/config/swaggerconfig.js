import swaggerJSDoc from 'swagger-jsdoc';

import { __dirname } from '../fileUtils.js';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
        title: "ProjectoCoder",
        description: "API for the ProjectoCoder",
        version: "1.0.0",
        contact: {
            name: "Entrega10"
        },
        servers: ["http://localhost:8080"]
        },
    },
    apis: [`${__dirname}/docs/*.yaml`]
};

export const specs = swaggerJSDoc(swaggerOptions);

