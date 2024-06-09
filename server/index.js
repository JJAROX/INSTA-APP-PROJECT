import { createServer } from 'http';
import imageRouter from "./app/imageRouter.js";
import tagsRouter from "./app/tagsRouter.js"
import filtersRouter from './app/filtersRouter.js';
import usersRouter from './app/userRouter.js';
import profilesRouter from './app/profileRouter.js';
import uploadsRouter from './app/uploadsRouter.js';
import 'dotenv/config'
createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  //images
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  if (req.url.search("/api/photos/tags") != -1) {
    await tagsRouter(req, res)
  }

  //tags

  else if (req.url.search("/api/tags") != -1) {
    await tagsRouter(req, res)
  }
  else if (req.url.search("/api/photos") != -1) {
    await imageRouter(req, res)
  }
  else if (req.url.search("/api/filters") != -1) {
    await filtersRouter(req, res)
  }
  else if (req.url.search("/api/getimage") != -1) {
    await filtersRouter(req, res)
  }
  else if (req.url.search("/api/user") != -1) {
    await usersRouter(req, res)
  }
  else if (req.url.search("/api/profile") != -1) {
    await profilesRouter(req, res)
  }
  else if (req.url.search("/api/logout") != -1) {
    await profilesRouter(req, res)
  } else if (req.url.search("/uploads") != -1) {
    await uploadsRouter(req, res)
  }

})
  .listen(process.env.APP_PORT, () => console.log(`listen on ${process.env.APP_PORT}`))