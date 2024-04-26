const http = require("http");
const Post = require("./models/post");
const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config({path:"./config.env"})
//console.log(process.env.PORT)
const DB = process.env.DATABASE.replace(
    '<password>',process.env.DATABASE_PASSWORD
) 
// console.log(DB)
// 連接資料庫 
mongoose.connect(DB)
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error);
    });


const requestListener = async (req,res)=>{
    let body = "";
    req.on('data',chunk =>{
        body += chunk;
    })
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    if(req.url=="/posts" && req.method=="GET"){
        const posts = await Post.find().limit(10);
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            posts
        }))
        res.end() 
    }else if(req.url=="/posts" && req.method=="POST"){
        req.on('end',async()=>{
            try{
                const data = JSON.parse(body);
                const newPost = await Post.create(
                    {
                        name: data.name,
                        image:data.image,
                        content:data.content,
                        likes:data.likes,
                        comments: data.comments,
                        type:data.type,
                        tag:data.tag
                    }
                )
                res.writeHead(200,headers);
                res.write(JSON.stringify(
                    {
                        "status":"success",
                        posts:newPost
                    }
                ))
                res.end();
            }catch(error){
                res.writeHead(400,headers);
                res.write(JSON.stringify(
                    {
                        "status":"false",
                        "message":"欄位沒有正確，或沒有此 ID",
                        "error":error
                    }
                ))
                console.log(error);
                res.end();
            }
        }
        )
    }else if(req.url=="/posts" && req.method=="DELETE"){
        const posts = await Post.deleteMany({});
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            posts:[]
        }))
        res.end();
    }else if(req.method=="OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status":"false",
            "message":"無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener);
const port = process.env.PORT || 3000;
server.listen(port);