import { Elysia, t } from "elysia";
import { CrudService } from "../crud.service";
import { productModel, productModelUpdate } from "../models/product";
import { category, product } from "../../schema";
import { eq } from "drizzle-orm";
import { getProductById, getProducts, searchAdvance, searchByBrand, searchByCategoryId, searchByName, searchByShortName, searchBySku } from "../controllers/product";

const app = new CrudService(product);
const tags = ['product'];
const routerProduct = new Elysia({ prefix: "/product" })
    .use(productModel)
    .use(productModelUpdate)
    .get('/', ({ query }) => {
        return getProducts(query);
    }, {
        tags,
        detail: {
            summary: 'get all product',
        }
    })
    .get('/search', ({ query }) => {
        return app.searchDataByValue(query)
    }
        , {
            tags,
            detail: {
                summary: 'search product'
            }
        }
    )
    .get('/search-by-shortname', ({ query }) => {
        return searchByShortName(query.search_query as string);
    }
        , {
            query: t.Object({ search_query: t.String() }),
            tags,
            detail: {
                summary: 'search by short name'
            }
        }
    )
    .get('/search-by-name', ({ query }) => {
        return searchByName(query.search_query as string);
    }
        , {
            query: t.Object({ search_query: t.String() }),
            tags,
            detail: {
                summary: 'search by  name'
            }
        }
    )
    .get('/search-by-brand', ({ query }) => {
        return searchByBrand(query.search_query as string);
    }
        , {
            query: t.Object({ search_query: t.String() }),
            tags,
            detail: {
                summary: 'search by brand'
            }
        }
    )
    .get('/search-by-category', ({ query }) => {
        return searchByCategoryId(query.id as string);
    }
        , {
            query: t.Object({ id: t.String() }),
            tags,
            detail: {
                summary: 'search by category id'
            }
        }
    ).
    get(
        '/search-by-sku',
        ({ query }) => {
            return searchBySku(query.running_number as string, query.shelves as string)
        },
        {
            query: t.Object({
                running_number: t.String(),
                shelves: t.String(),
            }),
            tags,
            detail: {
                summary: 'search by sku',
            },
        }
    )
    .post('/search-special', ({ body, query }) => {
        return searchAdvance(body, true, query.category_id);
    }
        , {
            tags,
            detail: {
                summary: 'search special'
            }
        }
    )
    .get('/filter', ({ query }) => {
        return app.searchDataByField(query)
    }
        , {
            tags,
            detail: {
                summary: 'filter product'
            }
        }
    )
    .get('/:id', ({ params }) => {
        return getProductById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'get product by id',
        }
    })
    .delete('/:id', ({ params }) => {
        return app.deleteById(parseInt(params.id))
    }, {
        tags,
        detail: {
            summary: 'delete product by id',
        }
    })
    .patch('/:id', ({ params, body }) => {
        return app.updateById(body as Object, parseInt(params.id))
    }, {
        body: 'product.update',
        tags,
        detail: {
            summary: 'update product by id',
        }
    })
    .post('/', ({ body }) => {
        return app.post(body)
    }, {
        body: 'product.Model',
        tags,
        detail: {
            summary: 'created product',
        }
    })

export default routerProduct;