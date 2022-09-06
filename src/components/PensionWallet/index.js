import './PensionWallet.scss';
import React from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';

import {
  authRegistedAction,
  authUnregistedAction,
  authUnverifiedAction,
  authVerifiedAction,
  authLoguotAction,
  authloginAction,
} from '../../store/actions/authAction';

import proofOfHumanityAbi from '../../blockchain/environment/proof-of-humanity/proof-of-humanity-abi-.json';
import jsonProofOfHumanityAddress from '../../blockchain/environment/proof-of-humanity/proof-of-humanity-address.json';
import pensionContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/Pension.sol/Pension.json';
import jsonPension from '../../blockchain/environment/contract-address.json';

const pensionAddress = jsonPension.pensioncontract;
const proofOfHumanityAddress = jsonProofOfHumanityAddress.proofofhumanity;

function PensionWallet() {
  const { wallet, isRegisted, isVerified } = useSelector(({ auth }) => auth);

  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const connectWallet = async () => {
    if (!window.ethereum?.isMetaMask) {
      alert("Metamask wasn't detected, please install metamask extension");
      return;
    }

    if (wallet === 'Connect your Wallet') {
      setLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await web3Provider.send('eth_requestAccounts', []);

      const walletAcount = accounts[0];
      console.log(walletAcount)
      dispatch(authloginAction(accounts[0]));

      const verification = true //await verifyInProofOfHumanity(walletAcount);
      if (!verification) {
        alert('Your wallet is not registed in Proof of Humanity');
        return;
      }

      const web3Signer = web3Provider.getSigner();
      const chainId = await web3Signer.getChainId();
      if (chainId !== 4) {
        alert("Change your network to Rinkeby's testnet!");
        setLoading(false);
        return;
      }

      const mintVerification = await verifyMintInPension(walletAcount)
      if(!mintVerification) {
        setLoading(false);
        dispatch(authUnregistedAction());
        dispatch(authVerifiedAction());
        return;
      }

      setLoading(false);
      dispatch(authRegistedAction());
      dispatch(authVerifiedAction());
    } else {
      dispatch(authUnregistedAction());
      dispatch(authUnverifiedAction());
      dispatch(authLoguotAction());
      setLoading(false);

      if (window.location.href.includes('mypensions') || window.location.href.includes('register')) {
        dispatch(authLoguotAction());
      } else {
        dispatch(authLoguotAction());
      }
    }
  };

  const verifyMintInPension = async (wallet) => {
    const provider = ethers.providers.getDefaultProvider('rinkeby')
    const pensionContract = new ethers.Contract(pensionAddress, pensionContractAbi.abi, provider)

    return await pensionContract.verifyIfTheContributorAlreadyMinted(wallet)
  }

  const verifyInProofOfHumanity = async (wallet) => {
    const provider = ethers.providers.getDefaultProvider('mainnet');
    const proofOfHumanityContract = new ethers.Contract(proofOfHumanityAddress, proofOfHumanityAbi, provider);

    return await proofOfHumanityContract.isRegistered(wallet); //'0x918BD890FF76D2da0089Dbb086d258Da75960119'
  };

  return (
    <button className="wallet" onClick={connectWallet}>
      {loading ? 'loading...' : isRegisted || isVerified ? '...' + String(wallet).slice(38) : 'Connect your Wallet'}
    </button>
  );
}

export { PensionWallet };
