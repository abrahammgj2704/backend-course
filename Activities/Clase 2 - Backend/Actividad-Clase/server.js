import express from "express";

const app = express();
app.use(express.json());

app.get("/requests/:id", (request, response) => {
  const requestId = Number(request.params.id);
  response.status(200).json({
    id: requestId,
    status: "open",
  });
});

app.post("/requests", (request, response) => {
  const requestData = request.body;
  response.status(201).json({
    id: 43,
    title: requestData.title,
    status: "open",
  });
});

app.listen(8080, () => { 
  console.log("Server is running on port 8080");
});     



