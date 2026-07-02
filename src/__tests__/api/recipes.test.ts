/** @jest-environment node */
import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/recipes";
import * as RecipeService from "@/api/services/Recipe";

// Mock shërbimin dhe mbrojtjen që testi të mos prekë DB-në reale.
jest.mock("@/api/services/Recipe");
jest.mock("@/lib/apiAuth", () => ({
  requireAdmin: jest.fn(),
  requireAuth: jest.fn(),
}));

describe("/api/recipes", () => {
  it("GET kthen 200 dhe listën e recetave", async () => {
    (RecipeService.getRecipes as jest.Mock).mockResolvedValue([
      { _id: "1", title: "Byrek", category: "Drekë", cookTime: 60 },
    ]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: "GET" });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].title).toBe("Byrek");
  });

  it("kthen 405 për metodë të pambështetur (PATCH)", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({ method: "PATCH" });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
