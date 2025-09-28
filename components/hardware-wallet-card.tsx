"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Usb, Wifi, Upload, Settings } from "lucide-react"
import type { HardwareWallet, PublicKeyInfo } from "@/lib/hardware-wallets"
import { KeyExtractionDialog } from "./key-extraction-dialog"

interface HardwareWalletCardProps {
  wallet: HardwareWallet
  onConnect: (walletType: string) => Promise<boolean>
  onExtractKey: (walletType: string, path?: string) => Promise<PublicKeyInfo | null>
  publicKey?: PublicKeyInfo | null
  isConnecting?: boolean
  isExtracting?: boolean
}

export function HardwareWalletCard({
  wallet,
  onConnect,
  onExtractKey,
  publicKey,
  isConnecting = false,
  isExtracting = false,
}: HardwareWalletCardProps) {
  const getWalletIcon = () => {
    switch (wallet.type) {
      case "ledger":
        return <Usb className="w-6 h-6" />
      case "trezor":
        return <Wifi className="w-6 h-6" />
      case "coldcard":
        return <Upload className="w-6 h-6" />
      default:
        return <Usb className="w-6 h-6" />
    }
  }

  const getConnectionMethod = () => {
    switch (wallet.type) {
      case "ledger":
        return "USB Connection"
      case "trezor":
        return "Web Bridge"
      case "coldcard":
        return "File Import"
      default:
        return "Connection"
    }
  }

  const handleExtractKey = async (path?: string) => {
    return await onExtractKey(wallet.type, path)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface">{getWalletIcon()}</div>
            <div>
              <CardTitle className="text-lg capitalize">{wallet.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{getConnectionMethod()}</p>
            </div>
          </div>
          <Badge variant={wallet.connected ? "default" : "secondary"}>
            {wallet.connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!wallet.connected ? (
          <Button onClick={() => onConnect(wallet.type)} disabled={isConnecting} className="w-full" variant="outline">
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              `Connect ${wallet.name}`
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={() => handleExtractKey()}
                disabled={isExtracting}
                className="flex-1 bg-primary hover:bg-primary-dark"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  "Quick Extract"
                )}
              </Button>

              <KeyExtractionDialog walletType={wallet.type} walletName={wallet.name} onExtract={handleExtractKey}>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </KeyExtractionDialog>
            </div>

            {publicKey && (
              <div className="p-3 bg-surface rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Public Key</span>
                  <Badge variant="outline" className="text-xs">
                    {publicKey.walletType}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Path: {publicKey.path}</p>
                  <p className="text-xs text-muted-foreground">Fingerprint: {publicKey.fingerprint}</p>
                  <p className="text-xs font-mono bg-background p-2 rounded border break-all">
                    {publicKey.xpub.slice(0, 50)}...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
