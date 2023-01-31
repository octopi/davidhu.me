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
    links: [
      { path: "/me/bio", method: "GET" },
      { path: "/me/experience", method: "GET" },
      { path: "/me/contact", method: "GET" },
    ],
    me: {
      about: "This is a real API! Explore by following the `links`.",
      help: "Lazy folks can tap the links instead of typing.",
    },
  };

  res.status(200).json(response);
}
