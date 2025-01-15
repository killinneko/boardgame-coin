import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ERC20ABI from '../contracts/ERC20ABI.json';
import { Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import UpdateBalanceButton from './UpdateBalanceButton'; // 更新ボタンコンポーネントをインポート

const ERC20BalanceDisplay = () => {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // コントラクトの情報
  const tokenAddress = "0x909dA9E145588b34EF9ddd14472F11d73fC339f1"; // コントラクトアドレス

  // ERC20トークン残高を取得する関数
  const fetchTokenBalance = async (userAccount) => {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
      const balance = await tokenContract.balanceOf(userAccount);
      setTokenBalance(ethers.utils.formatUnits(balance, 2)); // 2桁の単位で表示
    } catch (err) {
      setError("Failed to fetch token balance.");
    } finally {
      setLoading(false);
    }
  };

  // MetaMaskとの接続
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // アカウントリクエスト
        const signer = provider.getSigner();

        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        setIsConnected(true);

        // 初期残高を取得
        fetchTokenBalance(userAccount);
      } catch (err) {
        setError("Failed to connect to MetaMask.");
      }
    } else {
      setError("MetaMask is not installed.");
    }
  };

  // 初期化時に接続状態をチェック
  useEffect(() => {
    if (window.ethereum) {
      const checkConnection = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);

          // 初期残高を取得
          fetchTokenBalance(accounts[0]);
        }
      };
      checkConnection();
    }
  }, []);

  // アカウントが変更された際に残高を更新
  useEffect(() => {
    if (account) {
      fetchTokenBalance(account);
    }
  }, [account]); // `account` が変更されるたびに残高を更新

  // 残高を更新する関数
  const updateBalance = () => {
    if (account) {
      fetchTokenBalance(account); // 残高を再取得
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            ERC20 トークン残高
          </Typography>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
          ) : (
            <div>
              {isConnected ? (
                <>
                  <Typography variant="body1" color="text.secondary">
                    接続中のアカウント: {account}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
                    残高: {tokenBalance} トークン
                  </Typography>
                  <UpdateBalanceButton updateBalance={updateBalance} /> {/* 更新ボタン */}
                </>
              ) : (
                <>
                  <Typography variant="body1" color="text.secondary">
                    残高を見るにはウォレットを接続してください。
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={connectWallet}
                    sx={{ marginTop: 2, width: '100%' }}
                  >
                    MetaMaskを接続
                  </Button>
                </>
              )}
            </div>
          )}

          {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ERC20BalanceDisplay;
