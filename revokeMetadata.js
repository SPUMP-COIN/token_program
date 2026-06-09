import { 
  updateV1, 
  mplTokenMetadata 
} from '@metaplex-foundation/mpl-token-metadata'
import { 
  keypairIdentity, 
  publicKey 
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { readFileSync } from 'fs'

// 1. Initialize Umi
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplTokenMetadata())
console.log("Connected to Minnet")

// 2. Load Wallet (The wallet that is currently the Update Authority)
const wallet = process.env.path //Path to signer
const secretKey = JSON.parse(readFileSync(wallet, 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
umi.use(keypairIdentity(keypair))

// 3. Your Token's Mint Address
// REPLACE 'YOUR_MINT_ADDRESS_HERE' with the ID you got from your previous script
const MINT_ADDRESS = publicKey('AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT')

async function revokeMetadataAuthority() {
  console.log(" Revoking Metadata Mutable Authority...");
  
  try {
    // updateV1 allows us to modify specific properties of the metadata
    await updateV1(umi, {
      mint: MINT_ADDRESS,
      authority: umi.identity, // Must be the current Update Authority signer
      isMutable: false,        // This is the permanent "lock"
    }).sendAndConfirm(umi)

    console.log('---------------------------------------');
    console.log('SUCCESS! Metadata is now Immutable');
    console.log('Token ID:', MINT_ADDRESS.toString());
    console.log('Action: Mutable Authority has been revoked.');
    console.log('---------------------------------------');
    
  } catch (error) {
    console.error(' Error revoking authority:', error);
  }
}

revokeMetadataAuthority();