const express = require('express');
const request = require('request');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const options = {
        uri: 'https://api.github.com/users/skqoaudgh/repos',
        method: 'GET',
        headers: {
            'User-Agent': 'skqoaudgh',
            'Accept': 'application/vnd.github.mercy-preview+json'
        }
    }

    request(options, function(err, result, body) {
        let lists = [];
        JSON.parse(body).forEach(element => {
            let item = {
                title: element.name,
                description: element.description,
                url: element.html_url,
                type: "created",
                date: new Date(element.created_at).yyyymmdd()
            }
            lists.push(item);

            item = {
                title: element.name,
                type: "updated",
                date: new Date(element.updated_at).yyyymmdd()
            }
            lists.push(item);

            item = {
                title: element.name,
                type: "pushed",
                date: new Date(element.pushed_at).yyyymmdd()
            }
            lists.push(item);           
        });
       res.render('index', {lists: lists});
    });
});

app.listen(3000, () => {
    console.log('The express erver is opened on port 3000')
});

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};