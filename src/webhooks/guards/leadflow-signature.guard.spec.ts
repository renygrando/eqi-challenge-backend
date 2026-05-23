import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { LeadflowSignatureGuard } from "./leadflow-signature.guard";

describe("LeadflowSignatureGuard", () => {
  let guard: LeadflowSignatureGuard;
  let configService: jest.Mocked<Pick<ConfigService, "get">>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    };
    guard = new LeadflowSignatureGuard(
      configService as unknown as ConfigService,
    );
  });

  function createContext(request: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  }

  it("throws when signature header is missing", () => {
    const context = createContext({ headers: {}, rawBody: "{}" });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      "X-LeadFlow-Signature header missing",
    );
  });

  it("throws when rawBody is missing", () => {
    const context = createContext({
      headers: { "x-leadflow-signature": "sha256=abc" },
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow("Request body is empty");
  });

  it("throws when secret is not configured", () => {
    configService.get.mockReturnValue(undefined);

    const context = createContext({
      headers: { "x-leadflow-signature": "sha256=abc" },
      rawBody: '{"lead":"x"}',
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      "LEADFLOW_WEBHOOK_SECRET not configured",
    );
  });

  it("throws when signature format is invalid", () => {
    configService.get.mockReturnValue("my-secret");

    const context = createContext({
      headers: { "x-leadflow-signature": "invalid-format" },
      rawBody: '{"lead":"x"}',
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      "Invalid X-LeadFlow-Signature format",
    );
  });

  it("throws when signature is invalid", () => {
    configService.get.mockReturnValue("my-secret");

    const context = createContext({
      headers: { "x-leadflow-signature": "sha256=deadbeef" },
      rawBody: '{"lead":"x"}',
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      "X-LeadFlow-Signature invalid",
    );
  });

  it("returns true when signature is valid", () => {
    const secret = "my-secret";
    const rawBody = '{"lead":"x"}';
    const hash = createHmac("sha256", secret).update(rawBody).digest("hex");

    configService.get.mockReturnValue(secret);

    const context = createContext({
      headers: { "x-leadflow-signature": `sha256=${hash}` },
      rawBody,
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});
