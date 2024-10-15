import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingdapp} from '../target/types/Votingdapp'

describe('Votingdapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingdapp as Program<Votingdapp>

  const VotingdappKeypair = Keypair.generate()

  it('Initialize Votingdapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        Votingdapp: VotingdappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([VotingdappKeypair])
      .rpc()

    const currentCount = await program.account.Votingdapp.fetch(VotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingdapp', async () => {
    await program.methods.increment().accounts({ Votingdapp: VotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Votingdapp.fetch(VotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingdapp Again', async () => {
    await program.methods.increment().accounts({ Votingdapp: VotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Votingdapp.fetch(VotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingdapp', async () => {
    await program.methods.decrement().accounts({ Votingdapp: VotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Votingdapp.fetch(VotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set Votingdapp value', async () => {
    await program.methods.set(42).accounts({ Votingdapp: VotingdappKeypair.publicKey }).rpc()

    const currentCount = await program.account.Votingdapp.fetch(VotingdappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the Votingdapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        Votingdapp: VotingdappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.Votingdapp.fetchNullable(VotingdappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
