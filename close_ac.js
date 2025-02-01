import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { closeAccount } from "@solana/spl-token";

(async () => {
    const connection = new Connection("http://127.0.0.1:8899");

    const secretKeyArray = new Uint8Array([
        194, 30, 202, 11, 10, 145, 94, 125, 193, 102, 168,
        82, 76, 78, 247, 20, 22, 24, 131, 160, 212, 21,
        130, 181, 72, 229, 167, 136, 71, 180, 230, 136, 56,
        49, 240, 170, 176, 24, 122, 47, 172, 147, 176, 18,
        6, 35, 51, 106, 71, 132, 168, 92, 209, 239, 80,
        90, 134, 143, 43, 22, 202, 227, 171, 195
    ]);
    const ownerKeypair = Keypair.fromSecretKey(secretKeyArray);

    const ownerPublicKey = ownerKeypair.publicKey;

    const tokenAccountToClose = new PublicKey("14qocHkpPpPwQdybxN298ZCngeuWqrMzJzxSpDDd3EZk");

    const receiverKeyPair = Keypair.generate();
    const receiverPublicKey = receiverKeyPair.publicKey;

    // Request an airdrop to the keypair
    const airdropSignature = await connection.requestAirdrop(ownerPublicKey, 1e9);
    // Confirm the transaction using the new strategy
    const confirmationStrategy = {
        signature: airdropSignature,
        commitment: "confirmed"
    };
    await connection.confirmTransaction(confirmationStrategy);
    console.log("Airdrop Successful");


    // Create the token account
    const signature = await closeAccount(
        connection,
        ownerKeypair,
        tokenAccountToClose, // Token account to close
        receiverPublicKey, // Receives remaining SOL
        ownerPublicKey, // The owner of the new token account,
        [ownerKeypair] // Pass an array of signers
    );
    console.log("Transaction successful:", signature);

})();
