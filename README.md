# Meme World

Meme World is a 100% on-chain meme creator with an experimental on-chain drawing interface built with MUD 2.0.

It's fully functional and is currently live on Optimism, and it can be viewed here: https://memeworld.lol/

This project was built over 72 hours for AW Hack 2023. :v:

### Inspiration

Is it possible to store an entire hand-drawn picture on the EVM?

By leveraging the principles of MUD, I could capture each brush stroke, serialize it down to bezier curve anchor points, and render it as base64 encoded data, viewable on the browser as SVG.

The result? Magic.

https://github.com/tpae/meme-world/assets/189663/7e4c9dd4-ee88-4b8c-8383-ad59830e719e

### Features

- Create a Template (for others to add captions to)
  - Draw Lines (draw 1 line per on-chain transaction)
  - Mint the Template as an NFT (ERC-721)
- Create a Meme (add captions to a template)
  - Choose a Template
  - Write a Caption
  - Mint the Meme as an NFT (ERC-721)

The NFT's metadata is stored 100% on-chain; there's no IPFS or external place for storing the data.

### Nice to Have Features

- Different color pens
- Undo / erase / clear feature
- Share friendly URL

### Potential Use Cases

- Proof-of-Sketch - additional security layer for hand-drawn digital signatures?
- On-chain SVG Library - there's much room for improvement
