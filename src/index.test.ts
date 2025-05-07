import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkMx } from "./index";
import dns from "dns";
import { promisify } from "util";

// Mock the dns module while preserving other exports
vi.mock("dns", async (importOriginal) => {
  const original = await importOriginal<typeof import("dns")>();
  return {
    ...original,
    resolveMx: vi.fn(),
  };
});

// Mock the promisify function
vi.mock("util", () => {
  const actual = vi.importActual<typeof import("util")>("util");
  return {
    ...actual,
    promisify: vi.fn((fn) => {
      // Return a mocked promisified function
      return vi.fn();
    }),
  };
});

// Get access to the mocked promisified function
const mockedResolveMx = vi.mocked(promisify(dns.resolveMx));

describe("checkMx", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return MX records when they exist", async () => {
    const mockMxRecords = [{ exchange: "smtp.google.com", priority: 10 }];

    // Mock the promisified function to resolve with MX records
    mockedResolveMx.mockResolvedValue(mockMxRecords);

    const result = await checkMx("google.com");
    expect(result.hasMx).toBe(true);
    expect(result.domain).toBe("google.com");
    expect(result.mxRecords).toEqual(mockMxRecords);
  });

  it("should indicate no MX records when they don't exist", async () => {
    mockedResolveMx.mockResolvedValue([]);

    const result = await checkMx("mail.example.com");

    expect(result.hasMx).toBe(false);
    expect(result.domain).toBe("mail.example.com");
    expect(result.mxRecords).toEqual([]);
  });

  it("should handle DNS errors", async () => {
    mockedResolveMx.mockRejectedValue(new Error("DNS error"));

    const result = await checkMx("nodomain.com");

    expect(result.hasMx).toBe(false);
    expect(result.domain).toBe("nodomain.com");
    expect(result.error).toBe("queryMx ENODATA nodomain.com");
  });

  it("should respect timeout option", async () => {
    mockedResolveMx.mockResolvedValue([]);

    const result = await checkMx("example.com", { timeout: 10 });
    expect(result.domain).toBe("example.com");
  });
});
