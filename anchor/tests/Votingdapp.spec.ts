import * as anchor from '@coral-xyz/anchor'
import {startAnchor} from 'solana-bankrun'
import {BankrunProvider} from 'anchor-bankrun'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/Votingdapp'

const IDL = require('../target/idl/Votingdapp.json')

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('Votingdapp', () => {

  let context;
  let provider;
  let votingProgram: any;

  beforeAll(async () => {
    context = await startAnchor('', [{name: "Votingdapp", programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp> (
      IDL,
      provider
    );
  })

  it('Initialize Poll', async () => {
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite movie?",
      new anchor.BN(0),
      new anchor.BN(1829009563),
    ).rpc();  
    
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )
      const poll = await votingProgram.account.poll.fetch(pollAddress);
      console.log(poll);

      expect(poll.pollId.toNumber()).toEqual(1);
      expect(poll.description).toEqual("What is your favorite movie?");
      expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  it("Initialize candidate", async() => {
    await votingProgram.methods.initializeCandidate(
      "Matrix",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "Star",
      new anchor.BN(1),
    ).rpc();

    const [starAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Star')], votingAddress);
    const starCandidate = await votingProgram.account.candidate.fetch(starAddress);
    console.log(starCandidate);
    expect(starCandidate.candidateVotes.toNumber()).toEqual(0);

    const [matrixAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Matrix')], votingAddress);
    const matrixCandidate = await votingProgram.account.candidate.fetch(matrixAddress);
    console.log(matrixCandidate);
    expect(matrixCandidate.candidateVotes.toNumber()).toEqual(0);
  });

  it("Vote", async( ) => {
    await votingProgram.methods.vote(
      "Matrix",
      new anchor.BN(1)
    ).rpc()

    const [matrixAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Matrix')], votingAddress);
    const matrixCandidate = await votingProgram.account.candidate.fetch(matrixAddress);
    console.log(matrixCandidate);
    expect(matrixCandidate.candidateVotes.toNumber()).toEqual(1);
  })
});
