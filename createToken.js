import {
  createAndMint,
  mplTokenMetadata,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  some,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { readFileSync } from 'fs'

// 1. Initialize Umi
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplTokenMetadata())

// 2. Load Wallet
const wallet = process.env.path
const secretKey = JSON.parse(readFileSync(wallet, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// 3. Generate Mint Signer
const mint = generateSigner(umi)

async function createLegacyToken() {
  console.log(" Launching SCOTTY PUMPKIN on Mainnet...");
  
  try {
    await createAndMint(umi, {
      mint,
      name: 'SCOTTY PUMPKIN',
      symbol: 'SPUMP',
      uri: 'https://bafybeiat7m74nnxfclctgadkskink4oljhn4lq2qjm5z5cuefxdsxq75b4.ipfs.w3s.link/minnet-meta.json',
      sellerFeeBasisPoints: percentAmount(1, 2), // 1%
      decimals: 6,
      amount: 10_000_000_000_000_000n, // 10 Billion with 6 decimals
      tokenOwner: umi.identity.publicKey,
      tokenStandard: TokenStandard.Fungible,
      isMutable: true,
    }).sendAndConfirm(umi)

    console.log('---------------------------------------');
    console.log('SUCCESS! Legacy Token Created');
    console.log('Token ID (Mint):', mint.publicKey.toString());
    console.log('Owner Wallet:', umi.identity.publicKey.toString());
    console.log('Explorer:', `https://solscan.io/token/${mint.publicKey}?cluster=mainnet-beta`);
    console.log('---------------------------------------');
    
  } catch (error) {
    console.error(' Error creating token:', error);
  }
}

createLegacyToken();










