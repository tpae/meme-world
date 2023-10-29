import { BaseError, ContractFunctionRevertedError } from "viem";
import { CanvasPath } from "@/components/react-sketch-canvas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimHash(hash = '', startSize = 8): string {
  if (!hash) return '';

  return `${hash?.substring(0, startSize)}...${hash?.substring(
    (hash?.length || 0) - 4
  )}`;
}

export function serializePath(path: CanvasPath): bigint[][] {
  const points = path.paths.map(point => [BigInt(Math.trunc(point.x * 10000)), BigInt(Math.trunc(point.y * 10000))]);

  return points;
}

export function handleError(err: unknown) {
  if (err instanceof BaseError) {
    const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
    if (revertError instanceof ContractFunctionRevertedError) {
      toast.error(revertError.data?.args?.toString() ?? 'unknown error', {
        position: 'bottom-center'
      });
    }
  }
}