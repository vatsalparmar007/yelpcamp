const express = require('express');
const mongoose= require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const  methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
 
});


const db = mongoose.connection;
db.on("error",console.error.bind(console,"CONNECTION ERROR:"));
db.once("open",() =>{
    console.log("Database Conected");
});

const app = express();
app.set('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
// app.locals.layout ='layout/boilerplate.ejs'

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

app.get('/',(req,res) => {
    res.send('Hello From Yelp Camp')
})

app.get('/campgrounds',async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}) 

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',async(req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds'); 
})

app.put('/campgrounds/:id',async(req,res)=>{
   const{id} = req.params;
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
   res.redirect(`/campgrounds/${campground._id}`)
})


// app.get('/makecampground',async(req,res) => {
//     const camp= new Campground({title: 'My Backyard',description:'cheap Camping!'});
//     await camp.save();
//     res.send(camp)
// })



app.listen(3000, () =>{
    console.log('Serving on Port 3000 ')
})