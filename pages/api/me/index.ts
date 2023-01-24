// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "../common";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "HEAD"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  let response = {
    me: {
      about: "Explore my API by following the paths below!",
      help: "On mobile or desktop, you can always tap the links instead of typing.",
    },
    links: [
      { path: "/me/bio", method: "GET" },
      { path: "/me/experience", method: "GET" },
      { path: "/me/contact", method: "GET" },
    ],
  };

  res.status(200).json(response);
}
