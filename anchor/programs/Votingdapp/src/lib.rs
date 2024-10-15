#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod Votingdapp {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingdapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Votingdapp.count = ctx.accounts.Votingdapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Votingdapp.count = ctx.accounts.Votingdapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingdapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.Votingdapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingdapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Votingdapp::INIT_SPACE,
  payer = payer
  )]
  pub Votingdapp: Account<'info, Votingdapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingdapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub Votingdapp: Account<'info, Votingdapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub Votingdapp: Account<'info, Votingdapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Votingdapp {
  count: u8,
}
