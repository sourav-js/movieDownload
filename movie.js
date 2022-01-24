require("dotenv").config();

var express				=require("express"),
    app                 =express(),
    mongoose            =require("mongoose"),
	
    request             =require("request"),
    flash               =require("connect-flash"), 
	cheerio             =require("cheerio"),
    body                =require("body-parser"),
    nodemailer          =require("nodemailer"),
  

    session             =require("express-session");  
var port=process.env.PORT || 1020;
app.use(body.urlencoded({extended:false}))     

app.use(flash())

app.use(session({
    secret:"movie",
    resave:false,
    saveUninitialized:false,
 }))   



app.use(function(req,res,next){

    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.get("/",function(req,res){

    res.render("input.ejs")
})

app.get("/findmovies",function(req,res){

	var items=[]
	request(`https://thepiratebay.party/search/${req.query.movie}/1/99/0`,function(error,response,html){
    
    if (!error && response.statusCode==200){

    	var $=cheerio.load(html)
      //   $("tr").each(function(i,el){

      //   	var data=$(el)

           
      //       console.log(data.find(".vertTh").next().text())
      //       console.log(data.find(".vertTh").next().next().text())
      //       console.log(data.find(".vertTh").next().next().next().next().text().replace("B","").replace("i","B"))
      //       console.log(data.find(".vertTh").next().next().next().next().next().text())
      //       console.log(data.find(".vertTh").next().next().next().next().next().next().text())
      //       console.log(data.find(".vertTh").next().next().next().find("a").attr("href"))
           

           

                  
           
      // }) 

        console.log(req.body.movie)
        var val=req.query.movie
        res.render("allmovies.ejs",{$:cheerio.load(html),lens:$("tr").find(".vertTh").length,values:val})
       
    }

})
})


app.post("/mail",function(req,res){

  res.render("email.ejs",{names:req.body.names,sizes:req.body.size,lee:req.body.li,see:req.body.si,magn:req.body.magnet,films:req.body.film})

})

app.post("/mailsent",function(req,res){

     var transport=nodemailer.createTransport({
         service:"gmail",
         auth:{
          user:"moviekhors.ofc@gmail.com",
          pass:process.env.password
        }
     })
   
                   var mailoptions={
                                           from:"moviekhors.ofc@gmail.com",
                                           bcc:`${req.body.email}`,
                                           subject:`MovieKhor!`,
                                           html:`
                                           <div align="center"> 
                                               <b>Hi,From MovieKhor!</b>
                                               
                                                <hr>
                                               <b>Movie Name</b>
                                                  <br>
                                                  ${req.body.movie} 
                                                <br>
						<hr>
                                                <b>Size</b>
                                                  <br>
                                                  ${req.body.size}
                                                <br>
						<hr>
                                                 <b>leechers</b> 
                                                  <br>
                                                  ${req.body.li}
                                                 <br>
						 <hr>
                                                 <b>seeders</b>
                                                   <br>
                                                 ${req.body.si}
                                                   <br>
						   <hr>
                                                <form action="https://moviedownload-send.herokuapp.com/download" method="POST">

                                                 <button style=background:green;border-radius:20px;border:none;cursor:pointer;><b>Download-${req.body.film}</b></button></a>
                                                 <input type="hidden" value=${req.body.magnet} name=magnet>
                                                 <input type="hidden" value=${req.body.film} name=film>

                                                </form>  
                                                  <br>
                                                  Thank-You From
                                                  <br>
                                                <a href=https://moviedownload-send.herokuapp.com/><button style=background:steelblue;color:black;border-radius:20px;border:none;cursor:pointer;><b>movieKhor</b></button></a>                        
                                                              
                                                              </form>
                                              </div>                  

                                                                 `
                                             
                           }     

          transport.sendMail(mailoptions,function(err,info){

              if(err)
              {
                console.log(err)
              }
              else{
                console.log("email sent")
              }
          })
 
        req.flash("success","mail sent successfully")
        res.redirect(`https://moviedownload-send.herokuapp.com/findmovies?movie=${req.body.film}`)

})


app.post("/download",function(req,res){

     res.render("download.ejs",{magnet:req.body.magnet,film:req.body.film})
})

app.listen(port,function(){

  console.log("server started")

})	


