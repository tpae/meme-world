import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    GameConfig: {
      keySchema: {},
      dataStruct: false,
      valueSchema: {
        contractAddress: "address",
        templateAddress: "address",
      },
    },
    Creator: "address",
    Name: "string",
    Caption: "string",
    PathKey: "bytes32",
    Path: "uint256[]",
    Minted: "bool",
    TemplateKey: "bytes32",
    Reserved: "bool",
    TemplateIdIncrement: {
      keySchema: {},
      valueSchema: "uint256"
    },
    DerivativeIdIncrement: {
      keySchema: {},
      valueSchema: "uint256"
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PathKey")],
    },
    {
      name: "UniqueEntityModule",
      root: true
    }
  ]
});
