import { afterEach, describe, expect, it, vi } from "vitest";

import { createSessionId } from "@/lib/session-id";

describe("createSessionId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usa randomUUID cuando el navegador lo admite", () => {
    const randomUUID = vi.fn(() => "uuid-nativo");
    vi.stubGlobal("crypto", { randomUUID });

    expect(createSessionId()).toBe("uuid-nativo");
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it("genera identificadores válidos cuando randomUUID no existe", () => {
    vi.stubGlobal("crypto", {});

    const first = createSessionId();
    const second = createSessionId();

    expect(first).toMatch(/^iec-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/);
    expect(second).toMatch(/^iec-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/);
    expect(first).not.toBe(second);
  });

  it("también funciona cuando crypto no está disponible", () => {
    vi.stubGlobal("crypto", undefined);

    expect(createSessionId()).toMatch(/^iec-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/);
  });
});
