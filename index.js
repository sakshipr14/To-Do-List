//jshint esversion:6

const express = require("express");
const bodyParser=require("body-parser");
const mongoose =require("mongoose");
const app =express();
const date = require(__dirname+"/date.js");
console.log(date());
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema =({
    name :String,
});

const Item = mongoose.model("item",itemsSchema);
const item = new Item ({
    name:"work"
});
const jogging = new Item ({
    name:"jogging"
});
const eating = new Item ({
    name:"eating"
});

const defaultItems = [item, jogging, eating];
const listSchema ={
  name:String,
  items:[itemsSchema]
};

const List =mongoose.model("list",listSchema);

/*Item.insertMany(defaultItems)
  .then(() => {
    console.log("successfully saved");
  })
  .catch((err) => {
    console.log(err);
  });*/


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
    Item.find({})
  .then((result) => {
    if(result.length ===0){
      Item.insertMany(defaultItems)
  .then(() => {
    console.log("successfully saved");
  })
  .catch((err) => {
    console.log(err);
  });
  res.redirect("/");

    }else{
     res.render("list", { listTitle: day, newListItems: result }); 
    }
  })
  .catch((err) => {
    console.log(err);
  });


let day =date();
});

app.post("/",function(req,res){
    console.log(req.body);
  const itemName =req.body.newItem;


  const item = new Item({
name : itemName
  });

  item.save();
  res.redirect("/");
});

   /* if(req.body.list=="Work List"){
        workItems.push(item);
        res.redirect("/work");   
    }
    else{
        items.push(item);
        res.redirect("/");s
    }*/

app.post("/delete",function(req,res){
 const checkedItemId = req.body.checkbox;
 Item.findOneAndDelete({_id: checkedItemId})
  .then((deletedItem) => {
    if (deletedItem) {
      console.log("deleted");
      res.redirect("/");
    } else {
      console.log("no matching item found");
    }
  })
  .catch((error) => {
    console.log(error);
  });

});


/*app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workItems});
});*/

app.get("/:customListName",function(req,res){
  const customListName =req.params.customListName;
  List.findOne({ name: customListName })
  .then(function(foundList) {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      return list.save();
      res.redirect("/");
    } else {
      res.render("/"+customListName,{listTitle:customListName,newListItems:defaultItems});
      
      // foundList exists, do something with it
    }
  })
  .then(function() {
    console.log("success")
  })
  .catch(function(err) {
    // handle error
    console.log(err);
  });


});
app.post("/work",function(req,res){
   let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

})


app.listen(3000,function() {
console.log("server started on port 3000");
});
