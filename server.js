'use strict';
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const request = require('request');
const eventproxy = require('eventproxy');
const ep = new eventproxy();

//**********************************************************************************************************************
let bolg = [];
let linkArr = [];

for (let i = 0; i <= 1; i++) {
    bolg.push('http://www.cnblogs.com/#p' + i);
}
http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    bolg.forEach((item) => {
        http.get(item, (r) => {
            let data = '';
            r.on('data', (chunk) => {
                data += chunk;
            });
            r.on('end', () => {
                let $ = cheerio.load(data.toString());
                let link = $('.post_item_body h3');
                for (let i = 0; i < link.length; i++) {
                    console.log(link.eq(i).html());
                    linkArr.push(link.eq(i).html());
                    ep.emit('all', link.eq(i).html());
                }
            })
        });
    });
    ep.after('all', linkArr.length, (link)=>{
        //console.log(link);

        link.forEach((item)=>{
            res.write(item + '<br/>');
        });
        res.end();
    })
}).listen(3333, '127.0.0.1');
//**********************************************************************************************************************