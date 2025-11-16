/* eslint-disable react/button-has-type */
'use client';

import type { CSSProperties, ReactNode } from 'react';
import { ConnectModal } from '@iota/dapp-kit';

type WalletConnectButtonProps = {
  connectText?: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'>;

/**
 * Lightweight wrapper around the dApp Kit ConnectModal that avoids the
 * uncontrolled → controlled warning by ensuring the modal receives a
 * deterministic boolean `open` prop from the very first render.
 */
export function WalletConnectButton({
  connectText = 'Connect Wallet',
  className = '',
  style,
  ...buttonProps
}: WalletConnectButtonProps) {
  return (
    <ConnectModal
      defaultOpen={false}
      trigger={
        <button
          {...buttonProps}
          type="button"
          className={className}
          style={style}
        >
          {connectText}
        </button>
      }
    />
  );
}

