import { describe, expect, it } from "vitest";
import { API_ORIGIN, buildFileUrl } from "./api";

describe("buildFileUrl", () => {
  it("returns an empty string when no path is provided", () => {
    expect(buildFileUrl("")).toBe("");
  });

  it("normalizes relative upload paths against the API origin", () => {
    expect(buildFileUrl("/uploads\\sample-file.pdf")).toBe(
      `${API_ORIGIN}/uploads/sample-file.pdf`
    );
  });

  it("leaves absolute URLs unchanged", () => {
    const externalUrl = "https://cdn.example.com/uploads/sample-file.pdf";

    expect(buildFileUrl(externalUrl)).toBe(externalUrl);
  });
});
