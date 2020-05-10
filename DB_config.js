const { Pool, Client } = require('pg')
const Sequelize = require('sequelize');


const connection_data = {
    user: "fuhshhcu",
    password: "BbUmDv8jyTR4yp75rcBVWurwYkAea0up",
    host: "drona.db.elephantsql.com",
    port: 5432,
    database: "fuhshhcu",
    omitNull: true
}

const connectionString = 'postgres://fuhshhcu:BbUmDv8jyTR4yp75rcBVWurwYkAea0up@drona.db.elephantsql.com:5432/fuhshhcu'





async function createALLProductsTable() {
    const name = "products"
    const client = new Client(connection_data)
    try {
        await client.connect()
        await client.query(`
        CREATE SEQUENCE ${name}_sequence
            start 1
            increment 1;

        CREATE TABLE public."${name}" (
            id serial NOT NULL ,
            "created" text COLLATE pg_catalog."default",
            usr integer,
            img text COLLATE pg_catalog."default",
            price text COLLATE pg_catalog."default",
            title text COLLATE pg_catalog."default",
            url text COLLATE pg_catalog."default",
            CONSTRAINT ${name}_pkey PRIMARY KEY (id)
        )
        WITH (OIDS = FALSE)
        TABLESPACE pg_default; 
        ALTER TABLE public."${name}"
            OWNER to "${connection_data.database}";
        `);
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}



async function createProductTable({id, price, created}) {
    const name = "product_" + id;
    const client = new Client(connection_data)
    try {
        await client.connect()
        await client.query(`
        CREATE SEQUENCE ${name}_sequence
            start 1
            increment 1;

        CREATE TABLE public."${name}" (
            id serial NOT NULL ,
            created text COLLATE pg_catalog."default",
            price text COLLATE pg_catalog."default",
            CONSTRAINT ${name}_pkey PRIMARY KEY (id)
        )
        WITH (OIDS = FALSE)
        TABLESPACE pg_default; 
        ALTER TABLE public."${name}"
            OWNER to "${connection_data.database}";
        
        INSERT INTO public."${name}" (
            id, 
            price, 
            created
        ) VALUES (
            nextval('${name}_sequence')::integer,
            '"${price}"'::text, 
            '"${created}"'::text
        );      
        `);
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}






async function enterProduct(product) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            INSERT INTO public.products (
                id, 
                usr, 
                price, 
                url, 
                img,
                title, 
                created
            ) VALUES (
                nextval('products_sequence')::integer,
                ${product.usr} ::integer,
                '${product.price}'::text, 
                '${product.url}'::text,
                '${product.img}'::text,
                '${product.title}'::text,
                '${product.created}'::text
            ) returning id;`)
            .then(res => {
                return res.rows[0].id
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}




async function createUsersTable() {
    const client = new Client(connection_data)
    try {
        await client.connect()
        await client.query(`
        CREATE SEQUENCE users_sequence
            start 1
            increment 1;

        CREATE TABLE public.users (
            id serial NOT NULL ,
            email text COLLATE pg_catalog."default",
            pw text COLLATE pg_catalog."default",
            registered integer,
            CONSTRAINT users_pkey PRIMARY KEY (id)
        )
        WITH (OIDS = FALSE)
        TABLESPACE pg_default; 
        ALTER TABLE public.users
            OWNER to "${connection_data.database}";     
        `);
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function enterUser(email, pw, code) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            INSERT INTO public.users (
                id, 
                email, 
                pw,
                registered
            ) VALUES (
                nextval('users_sequence')::integer,
                '${email}'::text,
                '${pw}'::text,
                '${code}'::integer 
            ) returning id;`)
            .then(res => {
                return res.rows[0].id
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function getAllProducts(userID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.products;
            `)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function getAllByUserID(userID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.products
            WHERE usr=${userID};
            `)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function deleteProduct(prodID) {
    const client = new Client(connection_data)

    console.log("drop: " + prodID)
    try {
        await client.connect()
        return await client.query(`
            DELETE FROM public.products
            WHERE id=${prodID};

            DROP TABLE public.product_${prodID};
            `)
            .then(res => {
                return res
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 

}


async function getProductDetails(prodID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.product_${prodID};
            `)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function findUser(name) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`SELECT * FROM public.users WHERE email = '${name}';`)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function confirmUser(code) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`UPDATE public.users SET registered = 0 WHERE registered = ${code};`)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}

async function updateProduct({id, price}) {
    setTimeout(async function(){
        const client = new Client(connection_data)
        try {
            await client.connect()
            return await client.query(`UPDATE public.products SET price = ${price} WHERE id = ${id};`)
                .then(res => {
                    return res
                })
                .catch (error => console.log(error))
        } catch (error) {console.log(error) }
        finally{
            client.end()
        } 
    }, 2000);
    
}



//------
/*
const sequelize = new Sequelize(
    connection_data.database, 
    connection_data.user, 
    connection_data.password, {
    host: connection_data.host,
    dialect: 'postgres',

    pool: {
        max: 100,
        min: 0,
        acquire: 90000,
        idle: 90000
      }
});
*/

exports.connection_data = connection_data
exports.connectionString = connectionString
exports.createALLProductsTable = createALLProductsTable
exports.createProductTable = createProductTable
exports.enterProduct = enterProduct
exports.createUsersTable = createUsersTable
exports.enterUser = enterUser
exports.getAllByUserID = getAllByUserID
exports.deleteProduct = deleteProduct
exports.getProductDetails = getProductDetails
exports.findUser = findUser
exports.confirmUser = confirmUser
exports.updateProduct = updateProduct
exports.getAllProducts = getAllProducts



// exports.sequelize = sequelize