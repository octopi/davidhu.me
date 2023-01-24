// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "../common";
import Cors from "cors";
import _ from "lodash";

const cors = Cors({
  methods: ["GET", "HEAD"],
});

type MeApiResponse = {
  links: Array<Object>;
  bio?: Object;
  experience?: Object;
  contact?: Object;
  error?: string;
};

const links = [
  { path: "/me/bio", method: "GET" },
  { path: "/me/experience", method: "GET" },
  { path: "/me/contact", method: "GET" },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const { path } = req.query;
  let response: MeApiResponse;
  let didError;

  switch (path) {
    case "bio":
      response = _.merge({
        links,
        bio: {
          homebase: "Brooklyn, NY",
          education: "B.S. Computer Science, Columbia University",
          likes: ["⛷️", "✈️", "🏔️", "🍺", "🍗", "🍜"],
          dislikes: ["🍅"],
        },
      });
      break;
    case "experience":
      response = _.merge({
        links,
        experience: {},
      });
      break;
    case "contact":
      response = _.merge({
        links,
        contact: {
          email: "octopie@gmail.com",
          twitter: "@octopi",
          github: "@octopi",
          instagram: "@octopeye",
        },
      });
      break;
    default:
      response = _.merge(
        { error: "Nothing is here! Did you mean `/api/me`?" },
        { links }
      );
      didError = true;
  }

  res.status(didError ? 404 : 200).json(response);
}
