import { describe, expect, it } from "vitest";
import { products, categories, money, getColorHex } from "@/lib/storefront";

describe("Storefront Catalog & Logic", () => {
  it("contains rich products across all core categories", () => {
    expect(products.length).toBeGreaterThanOrEqual(10);

    for (const cat of categories) {
      const found = products.filter((p) => p.category === cat);
      expect(found.length).toBeGreaterThan(0);
    }
  });

  it("ensures every product has valid price, gallery, description, and sizes", () => {
    for (const item of products) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.price).toBeGreaterThan(0);
      expect(item.gallery.length).toBeGreaterThanOrEqual(1);
      expect(item.colors.length).toBeGreaterThanOrEqual(1);
      expect(item.sizes.length).toBeGreaterThanOrEqual(1);
      expect(item.description).toBeTruthy();
    }
  });

  it("correctly formats currency with money helper", () => {
    expect(money(148)).toBe("$148");
    expect(money(0)).toBe("$0");
  });

  it("maps recognized colors to hex codes", () => {
    expect(getColorHex("Ivory")).toBe("#F8F5EE");
    expect(getColorHex("Black")).toBe("#171717");
    expect(getColorHex("18k Gold")).toBe("#D4AF37");
    expect(getColorHex("NonExistent")).toBe("#DDD8CF");
  });
});
