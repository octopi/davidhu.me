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
        experience: [
          {
            company: "Foursquare",
            roles: ["Manager, Developer Products & Relations", "Developer Advocate"],
            start: "Jan 2013",
            end: "Apr 2016"
          },
          {
            company: "Dexter",
            roles: ["VP, Engineering & Strategy"],
            start: "Apr 2016",
            end: "Dec 2018"
          },
          {
            company: "Stripe",
            roles: ["Product Manager", "Integration Engineer"],
            start: "Feb 2019",
            end: "Feb 2023"
          }
        ],
      });
      break;
    case "contact":
      response = _.merge({
        links,
        contact: {
          email: "mailto:me@davidhu.me",
          twitter: "https://twitter.com/octopi",
          linkedin: "https://www.linkedin.com/in/octopi",
          github: "https://github.com/octopi",
          instagram: "https://instagram.com/octopeye",
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
