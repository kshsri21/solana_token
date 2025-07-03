import {
    Connection,
    Keypair,
    PublicKey
} from "@solana/web3.js";
import {
    mintTo
} from "@solana/spl-token";

(async () => {
    const LOCAL_SOLANA_RPC_URL = "http://127.0.0.1:8899";
    const connection = new Connection(LOCAL_SOLANA_RPC_URL);

    // Your mint address from main.js
    const TOKEN_MINT_ADDRESS = new PublicKey("2aoAp324aALVTJW1HqYPAxNizcXSbxafLiNVCfHV2yRv");
    // Your token account address from second program
    const TOKEN_ACCOUNT_ADDRESS = new PublicKey("2RW4jSzkMETBhiPQz3SBDMkmsPBipii5PVWU5pGkXEA4");

    // Recreate feePayerKeyPair from saved secretKey
    const secretKey = Uint8Array.from([
        184, 79, 36, 245, 25, 75, 103, 251, 58, 209, 20,
        38, 12, 118, 253, 248, 106, 109, 175, 34, 49, 75,
        224, 83, 101, 104, 250, 58, 131, 76, 124, 123, 47,
        203, 180, 158, 125, 64, 185, 19, 83, 141, 48, 201,
        140, 162, 234, 190, 94, 234, 3, 167, 200, 205, 206,
        171, 191, 106, 224, 93, 9, 154, 231, 86
    ]);

    const feePayerKeyPair = Keypair.fromSecretKey(secretKey);

    // Request airdrop if needed
    const airdropSignature = await connection.requestAirdrop(feePayerKeyPair.publicKey, 1e9);
    await connection.confirmTransaction({
        signature: airdropSignature,
        commitment: "confirmed",
    });
    console.log("Airdrop to feePayer (mint authority) successful");

    // Mint tokens
    const amount = 1000; // in base units (if 2 decimals, 1000 = 10.00)

    await mintTo(
        connection,
        feePayerKeyPair,         // payer for transaction fees
        TOKEN_MINT_ADDRESS,      // mint address
        TOKEN_ACCOUNT_ADDRESS,   // destination token account
        feePayerKeyPair,         // mint authority signer
        amount
    );

    console.log(`Minted ${amount} tokens successfully to ${TOKEN_ACCOUNT_ADDRESS.toBase58()}`);
})();
