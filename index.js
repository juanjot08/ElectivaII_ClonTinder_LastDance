import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import users from './presentation/routes/users.js';
import match from './presentation/routes/match.js'
import swipes from './presentation/routes/swipes.js'
import auth from './presentation/routes/auth.js';
import messages from './presentation/routes/messages.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clon Tinder",
            version: "1.0.0",
            description: "Documentación Clon Tinder",
            servers: [
                {
                    url: "http://localhost:3000/api"
                }
            ]
        }
    },
    apis: [
        "./presentation/routes/*.js"
    ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', users);

app.use('/api/match', match);

app.use('/api/swipes', swipes);

app.use('/api/auth', auth);

app.use('/api/messages', messages);


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});