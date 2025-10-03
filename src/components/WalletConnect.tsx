import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatEther } from 'viem'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  if (isConnected && address) {
    return (
      <div style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ marginBottom: '10px', color: '#888' }}>Connected Wallet</div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '14px',
          marginBottom: '10px',
          color: '#fff'
        }}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        {balance && (
          <div style={{ marginBottom: '15px', fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>
            {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
          </div>
        )}
        <button
          onClick={() => disconnect()}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
        Connect Wallet
      </div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}
