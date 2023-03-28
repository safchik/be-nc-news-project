const { fetchTopics } = require("../models/models")


exports.getTopics = (req, res) =>{
  
  fetchTopics().then((output)=>{
    res.status(200).send({ topics: output})
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send({ error: "Unable to retrieve topics!" });
  });
};

