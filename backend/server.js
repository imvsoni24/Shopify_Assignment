const express = require("express")
const axios = require("axios")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const apiKey = "c3e9d8c226c8cb85db30fc8e385a34d4";
const tokenAsPassword = "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";
const shopifyUrl = "85f085-2.myshopify.com";
const pipedriveApiToken = "f23177540a94c689b9e1b63113ebe5dd1ffddf81";


app.get("/findOrder",async(req,res)=>{
    const orderId = req.query.orderId
    const getOrderUrl = `https://${apiKey}:${tokenAsPassword}@${shopifyUrl}/admin/api/2023-04/draft_orders/${orderId}.json`;
    try{
        let response = await axios.get(getOrderUrl);
        res.json(response.data);
    }
    catch(e){
        res.json(e)
    }
    
})

app.get("/findPersonInPipedrive", async (req, res) => {
  const email = req.query.email;
  const findPersonUrl = `https://api.pipedrive.com/v1/persons/search?term=${email}&api_token=${pipedriveApiToken}`;
  try {
    let response = await axios.get(findPersonUrl);
    res.json(response.data);
  } catch (e) {
    res.json(e);
  }
});

app.post("/createPersonInPipedrive",async(req,res)=>{
  const {name,email,phone} = req.body;
  const createPersonUrl = `https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiToken}`;
  try{
    let response = await axios.post(createPersonUrl,{name,email,phone})
    res.json(response.data)
  }
  catch(e){
    res.json(e)
  }

});

app.get("/findProductInPipedrive", async (req, res) => {
  const sku = req.query.term;
  const findProductUrl = `https://api.pipedrive.com/v1/products/search?term=${sku}&api_token=${pipedriveApiToken}`;
  try {
    let response = await axios.get(findProductUrl);
    let productId = response.data.data.items[0].item.id;
    let details = await axios.get(
      `https://api.pipedrive.com/v1/products/${productId}?api_token=${pipedriveApiToken}`
    );
    res.json(details.data)
  } catch (e) {
    res.json(e);
  }
});

app.post("/createProductInPipedrive", async (req, res) => {
  const { name, code, prices } = req.body;
  const createProductUrl = `https://api.pipedrive.com/v1/products?api_token=${pipedriveApiToken}`;
  try {
    let response = await axios.post(createProductUrl, { name, code, prices });
    res.json(response.data);
  } catch (e) {
    res.json(e);
  }
});

app.post("/createDealInPipedrive", async (req, res) => {
  const { title,value,currency, person_id} = req.body;
  const createDealUrl = `https://api.pipedrive.com/v1/deals?api_token=${pipedriveApiToken}`;
  try {
    let response = await axios.post(createDealUrl, { title,value,currency, person_id});
    res.json(response.data);
  } catch (e) {
    res.json(e);
  }
});

app.post("/attachProductToDealInPipedrive", async (req, res) => {
  const { dealId, product_id,item_price,quantity } = req.body;
  const attachProductUrl = `https://api.pipedrive.com/v1/deals/${dealId}/products?api_token=${pipedriveApiToken}`;

  try {
    const response = await axios.post(attachProductUrl, {
      product_id,item_price,quantity
    });
    res.json(response.data);
  } catch (e) {
    res.json(e);
  }
});

app.listen(4000,()=>{
    try{
        console.log("server is running on port 4000")
    }
    catch(e){
        console.log(e)
    }
})