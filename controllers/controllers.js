const { fetchTopics } = require("../models/models")


exports.getTopics = (req, res) =>{
  
  fetchTopics().then((output)=>{
    res.status(200).send({ topics: output})
  })
};

