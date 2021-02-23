import express from 'express';
import MethodOverride from 'method-override';
import BodyParser from 'body-parser';
import cors from "cors";
import clientRoutes from './routes/client.routes';
import authRoutes from './routes/auth.routes';
import countryRoutes from './routes/country.routes';
import productsRoutes from './routes/products.routes';

const app = express();

// port configuration
app.set('PORT', process.env.PORT || 4000);

// middleware configuration
app.use(MethodOverride());
app.use(cors());
app.use(BodyParser.urlencoded({ extended: false }));

// routes
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
    res.send('Backend Wilug');
});

// app execute
app.listen(app.get('PORT'), () => {
    console.log(`server on port ${app.get('PORT')}`);
});
