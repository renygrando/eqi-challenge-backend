import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import type { Request } from "express";

@Injectable()
export class LeadflowSignatureGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers["x-leadflow-signature"] as string;
    const rawBody = (request as any).rawBody;

    if (!signature) {
      throw new UnauthorizedException("X-LeadFlow-Signature header missing");
    }

    if (!rawBody) {
      throw new UnauthorizedException("Request body is empty");
    }

    const secret = this.configService.get<string>("LEADFLOW_WEBHOOK_SECRET");
    if (!secret) {
      throw new UnauthorizedException("LEADFLOW_WEBHOOK_SECRET not configured");
    }

    // Espera formato: "sha256=<hex>"
    const [algorithm, providedHash] = signature.split("=");
    if (algorithm !== "sha256" || !providedHash) {
      throw new UnauthorizedException("Invalid X-LeadFlow-Signature format");
    }

    // Calcular HMAC-SHA256 do corpo bruto
    const computed = createHmac("sha256", secret).update(rawBody).digest("hex");

    // Comparação segura (timing attack prevention)
    if (!this.timingSafeCompare(computed, providedHash)) {
      throw new UnauthorizedException("X-LeadFlow-Signature invalid");
    }

    return true;
  }

  private timingSafeCompare(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return bufferA.equals(bufferB);
  }
}
