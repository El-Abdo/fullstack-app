# fullstack-app
This is my submission of the scandiweb fullstack developer assessment, it's a simple ecommerce app in PHP and React, it works with product listing and cart functionality.
[live link for the website ](https://ecommerce-app-test.pages.dev/all)


## Backend
The backend is built in php with mysql, the php server is hosted on alwaysdata and the mysql DB on aivencloud, the database consists of products and attributes and attributes_items and product_gallery and all of those tables are populated with the json data provided

a GraphQl controller is built with webonyx/graphql-php library and it resolves the queries through repositories and the order mutation through an order service

The entire backend is built with an OOP approach, products and attributes are modeled after classes in backend/src/Model, after the queries are handled by the repository layer that queries the database, the obbjects are created through object factories and their attributes are sent back to the frontend


## Frontend
the frontend is an SPA built with react and vite and hosted on cloudflare pages, the product context queries the graphql endpoint and provides an array of products objects across the whole app to be used in creating the product card and the product details page.

another context is made for the orders, to keep track and register any new product ordered through the quick shop button on each product card or the add to cart button in the product details page

below is a screenshot of all the tests passing
![screenshot of all tests passing](https://pub-152b68aa260243aaa2d232340cf0dd95.r2.dev/Screenshot%20from%202025-04-20%2021-32-47.png)
