const express = require('express');
const request = require('request');
const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index', {lists: [], summary: {}, message: ''});
});

app.post('/', (req, res) => {
    let options = {
        uri: `https://api.github.com/users/${req.body.userId}`,
        method: 'GET',
        headers: {
            'User-Agent': req.body.userId,
            'Accept': 'application/vnd.github.mercy-preview+json'
        }
    }
    request(options, function(err, result, body) {
        if(body && 'message' in JSON.parse(body)) { // not found
            if(JSON.parse(body).message == 'Not Found') {
                res.render('index', {lists: [], summary: {}, message: 'Error: Cannot found the user.'});
            }
            else {
                res.render('index', {lists: [], summary: {}, message: 'Error: Unknow error. try again!'});
            }
        }
        else {
            let options = {
                uri: `https://api.github.com/users/${req.body.userId}/repos`,
                method: 'GET',
                headers: {
                    'User-Agent': req.body.userId,
                    'Accept': 'application/vnd.github.mercy-preview+json'
                }
            }
        
            request(options, function(err, result, body) {
                let lists = [];
                let summary = {};
                JSON.parse(body).forEach(element => {
                    const createDate = new Date(element.created_at);
                    let item = {
                        title: element.name,
                        language: element.language,
                        description: element.description,
                        url: element.html_url,
                        type: "created",
                        date: createDate.yyyymmdd()
                    }
                    lists.push(item);
                    if(!summary.total)
                        summary.total = 0;
                    if(!summary[createDate.getFullYear()])
                        summary[createDate.getFullYear()] = 0;
                    summary[createDate.getFullYear()] ++;
                    summary.total ++;

                    item = {
                        title: element.name,
                        language: element.language,
                        type: "updated",
                        date: new Date(element.updated_at).yyyymmdd()
                    }
                    lists.push(item);
        
                    item = {
                        title: element.name,
                        language: element.language,
                        type: "pushed",
                        date: new Date(element.pushed_at).yyyymmdd()
                    }
                    lists.push(item);
        
                    lists.sort(function(a, b) {
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    })
                });
                res.render('index', {lists: lists, summary: summary, message: `This is ${req.body.userId}\`s Timeline.`});
            });
        }
    });
});

app.listen(3000, () => {
    console.log('The express erver is opened on port 3000')
});

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();
  
    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
};