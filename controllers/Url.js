const Url = require("../models/Url");
const User =  require("../models/User");
const jwt = require("jsonwebtoken");
const { url } = require("inspector");

module.exports.createShortLink = async function (req, res) {
  try {
    let url = await Url.findOne({ shortlink: req.body.shortlink });
    if (url) {
        return res.json(422, {
          message: "this shortlink url already exist. Please use different shortlink",
        });
    }
    const isValidUrl = urlString=> {
        var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
      '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
   }
   let urlValid = isValidUrl(req.body.url);
   if(!urlValid)
   {
    return res.json(422, {
        message: "your url is not a valid url.",
      });
   }
   let temp = req.body;
   let newdata = {...temp,id:req.user._id};
   let newShortLink = await Url.create(newdata);
    return res.json(200, {
      success: true,
      data:newShortLink,
      message: "hey shortlink create successfully you can use it now",
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "internal server error",
    });
  }
};

module.exports.deleteShortlink = async function (req, res) {
    try {
      let url = await Url.findById(req.params.id);
      url.remove();
      return res.json(200, {
        success: true,
        message: "hey shortlink deleted successfully",
      });
    } catch (err) {
      console.log(err);
      return res.json(500, {
        message: "internal server error",
      });
    }
  }; 

module.exports.searchShortlink = async function (req, res) {
    try {
        if( req.params.key == "description" )
        {
            const regex = new RegExp(req.params.value, "i");
            const result = await Url.find({
                 description: regex,
                }).select("shortlink description url tags id");
        
            const filterData = result.filter(link=>JSON.stringify(link?.id) === JSON.stringify(req.user._id))
        
            return res.status(200).json({
                message: "Links by sorted order",
                data: filterData
            });
        }
        else
        {
            const regex = new RegExp(req.params.value, "i");
            const result = await Url.find({
                 shortlink: regex,
                }).select("shortlink description url tags id");
        
            const filterData = result.filter(link=>JSON.stringify(link?.id) === JSON.stringify(req.user._id))
        
            return res.status(200).json({
                message: "Links by sorted order",
                data: filterData
            });
        }
    } catch (err) {
      console.log(err);
      return res.json(500, {
        message: "internal server error",
      });
    }
  };
