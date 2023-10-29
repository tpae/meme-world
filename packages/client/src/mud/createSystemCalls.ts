/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */
import { decodeEventLog } from "viem";
import ITemplateSystemAbi from "contracts/out/TemplateSystem.sol/TemplateSystem.abi.json";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { worldContract, waitForTransaction, publicClient }: SetupNetworkResult
) {
  const createTemplate = async (name: string) => {
    const tx = await worldContract.write.createTemplate([name]);
    await waitForTransaction(tx);

    const txReceipt = await publicClient.getTransactionReceipt({
      hash: tx,
    });

    const parsed = decodeEventLog({
      abi: ITemplateSystemAbi,
      data: txReceipt.logs[txReceipt.logs.length - 1].data,
      topics: txReceipt.logs[txReceipt.logs.length - 1].topics,
    });

    return (parsed.args as any).templateId as bigint;
  };

  const drawPaths = async (templateId: bigint, paths: [][]) => {
    const tx = await worldContract.write.drawPaths([templateId, paths]);
    await waitForTransaction(tx);
  };

  const mintTemplate = async (templateId: bigint) => {
    const tx = await worldContract.write.mintTemplate([templateId]);
    await waitForTransaction(tx);
  };

  const templateTokenURI = async (tokenId: bigint) => {
    const results = await worldContract.read.templateTokenURI([tokenId]);

    return results;
  };

  const mintDerivative = async (templateId: bigint, caption: string) => {
    const tx = await worldContract.write.mintDerivative([templateId, caption]);
    await waitForTransaction(tx);
  };

  const derivativeTokenURI = async (tokenId: bigint) => {
    const results = await worldContract.read.derivativeTokenURI([tokenId]);

    return results;
  };

  return {
    createTemplate,
    drawPaths,
    mintTemplate,
    templateTokenURI,
    mintDerivative,
    derivativeTokenURI,
  };
}
