import express from 'express';
import MethodOverride from 'method-override';
import BodyParser from 'body-parser';
import clientRoutes from './routes/client.routes';

const app = express();

// port configuration
app.set('PORT', process.env.PORT || 4000);

// middleware configuration
app.use(MethodOverride());
app.use(BodyParser.urlencoded({ extended: false }));

// routes
app.use('/api/clients',clientRoutes);
app.get('/', (req, res) => {
    res.send('Backend Wilug');
});

// app execute
app.listen(app.get('PORT'), () => {
    console.log(`server on port ${app.get('PORT')}`);
});
