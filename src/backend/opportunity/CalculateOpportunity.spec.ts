import { calculateOpportunitiesForSelectedTickers } from "./CalculateOpportunity";

// npx jest src/backend/opportunity/CalculateOpportunity.spec.ts
describe("calculateOpportunitiesForSelectedCoins", () => {
  it("calculates opportunities for selected coins", async () => {
    const selectedCoins = ["BTC", "ETH", "ADA"]; // Example coins
    const opportunities = await calculateOpportunitiesForSelectedTickers(
      selectedCoins
    );

    expect(Array.isArray(opportunities)).toBe(true);
    expect(opportunities.length).toBe(selectedCoins.length);
  });

  // Add more test cases here as needed
});
