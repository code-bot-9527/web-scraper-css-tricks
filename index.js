const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const date = +new Date();
const data = [];
let images = [];

async function start() {
  await axios.get('https://unsplash.com/napi/photos?per_page=12&page=3&xp=search-quality-boosting%3Acontro')
    .then((resp) => {
      const arr = resp.data.slice(5);
      images = arr.map((item) => {
        return item.urls.thumb
      })
    })
  
  await axios.get('https://css-tricks.com/')
    .then(async response => {
      const $ = cheerio.load(response.data);
      const articles = $('.module-article.mini-card');
      articles.each((i, article) => {
        if(data.length > 5) return;
        
        const title = $(article).find('.mini-card-title').text().replaceAll('\n', '').replaceAll(' ', '');
        const time = $(article).find('time').get(0).attribs.datetime;
        data.push({
          title,
          time,
          image: images[i]
        })
      });
    })
    .catch(error => {
      console.log(error);
    }).finally(async () => {
      await fs.writeFileSync('articles.json', JSON.stringify({
        date,
        data
      }));

      console.log('Done');
    });
}

start();
