"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HardwareWalletCard } from "./hardware-wallet-card"
import { hardwareWallets, type HardwareWallet, type PublicKeyInfo } from "@/lib/hardware-wallets"
import { MultisigManager, type MultisigVault } from "@/lib/multisig"
import { ArrowLeft, ArrowRight, Shield, CheckCircle } from "lucide-react"

interface VaultCreationWizardProps {
  onVaultCreated: (vault: MultisigVault) => void
}

export function VaultCreationWizard({ onVaultCreated }: VaultCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [vaultName, setVaultName] = useState("")
  const [threshold, setThreshold] = useState("2")
  const [totalSigners, setTotalSigners] = useState("3")

  const [wallets, setWallets] = useState<HardwareWallet[]>([
    { type: "ledger", name: "Ledger Nano S Plus", connected: false },
    { type: "trezor", name: "Trezor Model T", connected: false },
    { type: "coldcard", name: "Coldcard Mk4", connected: false },
  ])

  const [publicKeys, setPublicKeys] = useState<Record<string, PublicKeyInfo | null>>({})
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({})
  const [isExtracting, setIsExtracting] = useState<Record<string, boolean>>({})
  const [createdVault, setCreatedVault] = useState<MultisigVault | null>(null)

  const handleConnect = async (walletType: string): Promise<boolean> => {
    setIsConnecting((prev) => ({ ...prev, [walletType]: true }))

    try {
      const wallet = hardwareWallets[walletType as keyof typeof hardwareWallets]
      const connected = await wallet.connect()

      if (connected) {
        setWallets((prev) => prev.map((w) => (w.type === walletType ? { ...w, connected: true } : w)))
      }

      return connected
    } catch (error) {
      console.error(`Failed to connect ${walletType}:`, error)
      return false
    } finally {
      setIsConnecting((prev) => ({ ...prev, [walletType]: false }))
    }
  }

  const handleExtractKey = async (walletType: string, path?: string): Promise<PublicKeyInfo | null> => {
    setIsExtracting((prev) => ({ ...prev, [walletType]: true }))

    try {
      const wallet = hardwareWallets[walletType as keyof typeof hardwareWallets]
      let publicKey: PublicKeyInfo | null = null

      if (walletType === "coldcard") {
        // For Coldcard, we'd typically show a file upload dialog
        // This is a simplified example
        const xpub = prompt("Please enter the xpub from your Coldcard export file:")
        if (xpub) {
          publicKey = await wallet.getPublicKey(xpub, path)
        }
      } else {
        publicKey = await wallet.getPublicKey(path)
      }

      if (publicKey) {
        setPublicKeys((prev) => ({ ...prev, [walletType]: publicKey }))
      }

      return publicKey
    } catch (error) {
      console.error(`Failed to extract key from ${walletType}:`, error)
      return null
    } finally {
      setIsExtracting((prev) => ({ ...prev, [walletType]: false }))
    }
  }

  const handleCreateVault = () => {
    const selectedKeys = Object.values(publicKeys).filter(Boolean) as PublicKeyInfo[]

    if (selectedKeys.length < Number.parseInt(threshold)) {
      alert("Not enough public keys for the specified threshold")
      return
    }

    try {
      const vault = MultisigManager.createVault(
        vaultName,
        Number.parseInt(threshold),
        selectedKeys.slice(0, Number.parseInt(totalSigners)),
      )

      setCreatedVault(vault)
      setCurrentStep(4)
      onVaultCreated(vault)
    } catch (error) {
      console.error("Failed to create vault:", error)
      alert("Failed to create vault. Please try again.")
    }
  }

  const canProceedToStep2 = vaultName.trim() && threshold && totalSigners
  const canProceedToStep3 = Object.values(publicKeys).filter(Boolean).length >= Number.parseInt(threshold)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Vault Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaultName">Vault Name</Label>
                <Input
                  id="vaultName"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  placeholder="My Bitcoin Vault"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="threshold">Required Signatures</Label>
                  <Select value={threshold} onValueChange={setThreshold}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 of N</SelectItem>
                      <SelectItem value="3">3 of N</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalSigners">Total Signers</Label>
                  <Select value={totalSigners} onValueChange={setTotalSigners}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Signers</SelectItem>
                      <SelectItem value="4">4 Signers</SelectItem>
                      <SelectItem value="5">5 Signers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connect Hardware Wallets</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect your hardware wallets to extract public keys for the multisig vault.
                </p>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {wallets.slice(0, Number.parseInt(totalSigners)).map((wallet) => (
                <HardwareWalletCard
                  key={wallet.type}
                  wallet={wallet}
                  onConnect={handleConnect}
                  onExtractKey={handleExtractKey}
                  publicKey={publicKeys[wallet.type]}
                  isConnecting={isConnecting[wallet.type]}
                  isExtracting={isExtracting[wallet.type]}
                />
              ))}
            </div>
          </div>
        )

      case 3:
        const selectedKeys = Object.values(publicKeys).filter(Boolean) as PublicKeyInfo[]

        return (
          <Card>
            <CardHeader>
              <CardTitle>Review Vault Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vault Name</Label>
                  <p className="font-medium">{vaultName}</p>
                </div>
                <div>
                  <Label>Multisig Configuration</Label>
                  <p className="font-medium">
                    {threshold} of {totalSigners}
                  </p>
                </div>
              </div>

              <div>
                <Label>Public Keys ({selectedKeys.length})</Label>
                <div className="space-y-2 mt-2">
                  {selectedKeys.map((key, index) => (
                    <div key={index} className="p-3 bg-surface rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{key.walletType}</span>
                        <span className="text-xs text-muted-foreground">{key.path}</span>
                      </div>
                      <p className="text-xs font-mono bg-background p-2 rounded break-all">
                        {key.xpub.slice(0, 60)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                Vault Created Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {createdVault && (
                <div className="space-y-4">
                  <div>
                    <Label>Vault Name</Label>
                    <p className="font-medium">{createdVault.name}</p>
                  </div>

                  <div>
                    <Label>Multisig Address</Label>
                    <p className="font-mono text-sm bg-surface p-3 rounded-lg break-all">{createdVault.address}</p>
                  </div>

                  <div>
                    <Label>Configuration</Label>
                    <p className="font-medium">
                      {createdVault.threshold} of {createdVault.totalSigners} multisig
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? "bg-primary text-white" : "bg-surface text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 4 && <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-surface"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 3 && (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={(currentStep === 1 && !canProceedToStep2) || (currentStep === 2 && !canProceedToStep3)}
            className="bg-primary hover:bg-primary-dark"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {currentStep === 3 && (
          <Button onClick={handleCreateVault} className="bg-primary hover:bg-primary-dark">
            Create Vault
          </Button>
        )}
      </div>
    </div>
  )
}
