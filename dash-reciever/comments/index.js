const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
const commentsByPostId = {};

app.use(bodyParser.json());
app.use(cors());
app.get('/posts/:id/comments', (req, res) => {

    //res.send('posts');
    res.send(commentsByPostId[req.params.id] || []);

   // console.log(req.params.id);
   // console.log( commentsByPostId[req.params.id] , 'was sent' );

});


app.post('/posts/:id/comments', async (req, res) => {

    const commentId = randomBytes(4).toString('hex');

    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];


    comments.push({id: commentId, content, status: 'pending'});

    commentsByPostId [req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    }).catch((err)=>{
        console.log( 'njk', err.message);
    }) ;

    res.status(201).send(comments);

});


app.post('/events',  async (req, res)=>{
    console.log('Comments: event received', req.body.type);


    const {type, data} = req.body;

    if(type === 'CommentModerated'){

        console.log('comment moderated received');
        const {postId, id, status, content} = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id ===id;
        });
        comment.status =status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                content,
                status,
                postId
            }
        }).catch((err)=>{
            console.log( '4003', err.message);
        }) ;
    }

    res.send({});
});


app.listen(4001, ()=>{
    console.log('4001');
})