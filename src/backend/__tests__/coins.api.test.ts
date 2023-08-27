import * as vscode from "vscode";
import { getTickers, getSymbolImages } from "../coins.api";

// npx jest src/backend/opportunity/CalculateOpportunity.spec.ts
describe("Coins api ", () => {
  it("get images", async () => {
    const images = await getSymbolImages();
    expect(images).toBeDefined();
    // expect images to be type of dictionary
    expect(images).toHaveProperty("bitcoin");
    expect(images).toHaveProperty("BTC");
  });

  it("test getCoinsPrices", async () => {
    const result = await getTickers();
    expect(result).toBeDefined();
    expect(result[0]).toBeDefined();
    expect(result[0]).toHaveProperty("current_price");
  });
});
