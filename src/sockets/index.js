import axios from "axios";
import { serviceURL } from "../utils/config";
import defaultBeers from "../utils/beer";
var io;

let beers = [...defaultBeers];

var init = (server) => {
  io = require("socket.io").listen(server);
  io.set("origins", "*:*");

  io.on("connection", (socket) => {
    setInterval(async () => {
      try {
        const newBeers = await Promise.all(
          beers.map(async (x) => {
            try {
              const result = await axios.get(`${serviceURL}/${x.id}`);
              return {
                ...x,
                current: result.data.temperature,
              };
            } catch (error) {
              throw error;
            }
          })
        );

        const diff = beers.filter(
          (x, index) => x.current != newBeers[index].current
        );

        beers = [...newBeers];

        if (diff.length) socket.emit("changedTemperature", { beers });
      } catch (error) {
        console.log(error);
      }
    }, 3000);
  });
};

module.exports = {
  io,
  init,
};
