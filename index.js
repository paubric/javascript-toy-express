
const Joi = require('joi');
const express = require('express')
const app = express();

app.use(express.json())

const products = [
    { id: 1, name: 'product1'},
    { id: 2, name: 'product2'},
    { id: 3, name: 'product3'},
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/products', (req, res) => {
    res.send(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(c => c.id === parseInt(req.params.id))
    if (!product) return res.status(404).send('The product with the given ID was not found.')
    res.send(product)
});

app.post('/api/products', (req, res) => {
    const result = validateProduct(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    
    const product = {
        id: products.length + 1,
        name: req.body.name
    };
    products.push(product);
    res.send(product);
})

app.put('/api/products/:id', (req, res) => {
    const product = products.find(c => c.id === parseInt(req.params.id))
    if (!product) return res.status(404).send('The product with the given ID was not found.')

    const result = validateProduct(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    product.name = req.body.name
    res.send(product);
})

function validateProduct(product) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    
    return Joi.validate(product, schema)
}

app.delete('/api/products/:id', (req, res) => {
    const product = products.find(c => c.id === parseInt(req.params.id))
    if (!product) return res.status(404).send('The product with the given ID was not found.')

    const index = products.indexOf(product);
    products.splice(index, 1);

    res.send(product)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
