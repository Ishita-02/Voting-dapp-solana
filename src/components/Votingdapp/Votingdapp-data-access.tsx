'use client'

import {getVotingdappProgram, getVotingdappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useVotingdappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingdappProgramId(cluster.network as Cluster), [cluster])
  const program = getVotingdappProgram(provider)

  const accounts = useQuery({
    queryKey: ['Votingdapp', 'all', { cluster }],
    queryFn: () => program.account.Votingdapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['Votingdapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ Votingdapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingdappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingdappProgram()

  const accountQuery = useQuery({
    queryKey: ['Votingdapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.Votingdapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['Votingdapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ Votingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['Votingdapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ Votingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['Votingdapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ Votingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['Votingdapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ Votingdapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
