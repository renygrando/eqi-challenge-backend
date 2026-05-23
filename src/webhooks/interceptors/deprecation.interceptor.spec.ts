import { CallHandler, ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";
import { DeprecationInterceptor } from "./deprecation.interceptor";

describe("DeprecationInterceptor", () => {
  let interceptor: DeprecationInterceptor;

  beforeEach(() => {
    interceptor = new DeprecationInterceptor();
  });

  it("sets Deprecation and Sunset headers", (done) => {
    const response = {
      setHeader: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    const next = {
      handle: () => of({ received: true }),
    } as CallHandler;

    interceptor.intercept(context, next).subscribe({
      next: (value) => {
        expect(value).toEqual({ received: true });
        expect(response.setHeader).toHaveBeenCalledWith("Deprecation", "true");
        expect(response.setHeader).toHaveBeenCalledWith(
          "Sunset",
          "Mon, 01 Aug 2026 00:00:00 GMT",
        );
        done();
      },
      error: done,
    });
  });
});
