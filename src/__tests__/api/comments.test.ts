/** @jest-environment node */
import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/comments";
import * as CommentService from "@/api/services/Comment";

jest.mock("@/api/services/Comment");
jest.mock("@/lib/apiAuth", () => ({
  requireAuth: jest.fn(),
  requireAdmin: jest.fn(),
}));

describe("/api/comments", () => {
  it("GET pa recipeId kthen 400", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it("GET me recipeId kthen 200 dhe komentet", async () => {
    (CommentService.getCommentsByRecipe as jest.Mock).mockResolvedValue([
      { _id: "c1", recipeId: "r1", text: "Shije!", rating: 5, userName: "Ana" },
    ]);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { recipeId: "r1" },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data[0].text).toBe("Shije!");
  });
});
