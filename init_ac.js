import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { createAccount } from "@solana/spl-token";

(async () => {
    const LOCAL_SOLANA_RPC_URL = "http://127.0.0.1:8899";
    const connection = new Connection(LOCAL_SOLANA_RPC_URL);

    // Generate a new keypair for the payer
    const feePayerKeyPair = Keypair.generate();
    // Define the token mint address. Copy paste from the main file.
    const TOKEN_MINT_ADDRESS = new PublicKey("FbG47xWvnAfyTm1XNpx3gHaCDqffHwbqnQsXbKxQFLfu");

    const ownerPublicKey = feePayerKeyPair.publicKey;
    const keypairForNewTokenAccount = Keypair.generate();


    // Request an airdrop to the payer account
    const airdropSignature = await connection.requestAirdrop(feePayerKeyPair.publicKey, 1e9);
    const confirmationDetails = {
        signature: airdropSignature,
        commitment: "confirmed"
    };

    await connection.confirmTransaction(confirmationDetails);
    console.log("Airdrop Successful");


    // Create a new token account
    const tokenAccountPublicKey = await createAccount(
        connection,
        feePayerKeyPair,            // Payer for transaction fees
        TOKEN_MINT_ADDRESS,        // Mint address for the token
        ownerPublicKey,           // Owner of the new token account
        keypairForNewTokenAccount // Keypair for the new token account
    );

    console.log("feePayerKeyPair: ", feePayerKeyPair);
    console.log("keypairForNewTokenAccount Public Key: ", keypairForNewTokenAccount.publicKey.toBase58());
    console.log("tokenAccountPublicKey Public Key: ", tokenAccountPublicKey.toBase58());
})();
