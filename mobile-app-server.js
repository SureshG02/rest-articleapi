const express = require('express');
const _ = require('lodash');

/** 
 * Dummy dataset for testing. List of objects where each object represents category and articles under that category.
*/
const dataset = require('./dataset');

const app = express();
app.use(express.json());
const port = process.env.PORT || 8000;

/**
 * Returns a list containing all article categories.
 */
app.get('/v1/categories', (req, res) => {
    var categories = [];
    _.each(dataset, function (data) {
        const category = {
            id: data.id,
            title: data.title,
            imageUrl: data.imageUrl
        }
        categories.push(category);
    });
    res.send({ 'categories': categories });
});

/**
 * Gets all the articles for an category.
 */
app.get('/v1/categories/:categoryId', (req, res) => {
    var articles = [];
    _.each(dataset, function (data) {
        if (data.id == req.params.categoryId) {
            data.articles.forEach((a) => articles.push(a.overview))
        }
    });

    if (articles.length == 0) {
        return res.status(404).send()
    }
    res.send({ 'articles': articles });
});

/**
 * Gets article details such as the body.
 */
app.get('/v1/articles/:articleId', (req, res) => {
    var article;
    for (var i = 0; i < dataset.length; i++) {
        article = dataset[i].articles.find((a) => a.overview.id == req.params.articleId);
        if (article) {
            break;
        }
    }
    if (!article) {
        return res.status(404).send()
    }
    res.send(article);
});

/**
 * Updates article's starred property.
 */
app.patch('/v1/articles/:articleId', (req, res) => {
    for (var i = 0; i < dataset.length; i++) {
        existingArticle = dataset[i].articles.find((a) => a.overview.id == req.params.articleId);
        if (existingArticle) {
            break;
        }
    }
    if (!existingArticle) {
        return res.status(404).send();
    }
    existingArticle.overview.starred = req.body.starred;
    res.send("Starred property updated OK");
});

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
