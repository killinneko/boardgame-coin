import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';  // ethersライブラリをインポート
import { Button, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

const BalanceDisplay = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // MetaMaskとの接続
  const connectWallet = async () => {
    setLoading(true);
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // アカウントリクエスト
        const signer = provider.getSigner();

        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        setIsConnected(true);

        // 残高を取得
        const userBalance = await provider.getBalance(userAccount);
        const formattedBalance = parseFloat(ethers.utils.formatEther(userBalance)).toFixed(2);
        setBalance(formattedBalance);  // ETHに変換して表示
      } catch (err) {
        console.error(err);
        setError("Failed to connect to MetaMask.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("MetaMask is not installed.");
      setLoading(false);
    }
  };

  // 初期化時に接続状態をチェック
  useEffect(() => {
    if (window.ethereum) {
      const checkConnection = async () => {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);

          const userBalance = await provider.getBalance(accounts[0]);
          const formattedBalance = parseFloat(ethers.utils.formatEther(userBalance)).toFixed(2);
          setBalance(formattedBalance);  // ETHに変換して表示
        }
        setLoading(false);
      };
      checkConnection();
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            MetaMask ETH 残高
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
                    残高: {balance} ETH
                  </Typography>
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

export default BalanceDisplay;
