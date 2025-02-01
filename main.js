import {
    Connection,
    Keypair
} from "@solana/web3.js";

import { createMint } from "@solana/spl-token";

(async () => {
    // Generate a new keypair for the minting authority

    const feePayerKeyPair = Keypair.generate();
    // Connect to the local Solana test validator
    const solanaConnection = new Connection("http://127.0.0.1:8899");

    // Request an airdrop to the minting authority's wallet
    const airdropTransactionSignature = await solanaConnection.requestAirdrop(
        feePayerKeyPair.publicKey,
        1e9 // Amount in lamports (1 SOL = 10^9 lamports)
    );

    // Confirm the airdrop transaction
    const confirmationOptions = {
        signature: airdropTransactionSignature,
        commitment: "confirmed"
    };
    await solanaConnection.confirmTransaction(confirmationOptions);
    console.log("Airdrop completed successfully");


    const freezeAuthorityPublicKey = feePayerKeyPair.publicKey;
    const mintAuthorityPublicKey = feePayerKeyPair.publicKey;
    const decimal = 2;
    const keypairForNewTokenAccount = Keypair.generate();
    // Create a new SPL token mint
    const tokenMintAddress = await createMint(
        solanaConnection,             // Solana connection object
        feePayerKeyPair,      // Fee payer
        mintAuthorityPublicKey, // Mint authority
        freezeAuthorityPublicKey, // Freeze authority
        decimal,                   // Decimal places for the token
        keypairForNewTokenAccount
    );

    console.log("feePayerKeyPair:", feePayerKeyPair);
    console.log("keypairForNewTokenAccount Public Key:", keypairForNewTokenAccount.publicKey.toBase58());
    console.log("tokenMintAddress Public Key:", tokenMintAddress.toBase58());
})();
