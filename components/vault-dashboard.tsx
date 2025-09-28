"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MultisigVault } from "@/lib/multisig"
import { Plus, Wallet, Copy, ExternalLink, Shield, Users, Key } from "lucide-react"

interface VaultDashboardProps {
  vaults: MultisigVault[]
  onCreateVault: () => void
}

export function VaultDashboard({ vaults, onCreateVault }: VaultDashboardProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(text)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (vaults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
          <Wallet className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Vaults Created</h3>
          <p className="text-muted-foreground max-w-md">
            Create your first multisig vault to start securing your Bitcoin with hardware wallets.
          </p>
        </div>
        <Button onClick={onCreateVault} className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Vault
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Vaults</h2>
          <p className="text-muted-foreground">Manage your multisig Bitcoin vaults secured by hardware wallets</p>
        </div>
        <Button onClick={onCreateVault} className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Create New Vault
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vaults.map((vault) => (
          <Card key={vault.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vault.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {vault.threshold} of {vault.totalSigners}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Created {formatDate(vault.createdAt)}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Vault Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Shield className="w-4 h-4 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Security</p>
                  <p className="text-sm font-medium">Multisig</p>
                </div>
                <div className="space-y-1">
                  <Users className="w-4 h-4 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Signers</p>
                  <p className="text-sm font-medium">{vault.totalSigners}</p>
                </div>
                <div className="space-y-1">
                  <Key className="w-4 h-4 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Required</p>
                  <p className="text-sm font-medium">{vault.threshold}</p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Vault Address</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-surface p-2 rounded truncate">{vault.address}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(vault.address)}
                    className="shrink-0"
                  >
                    {copiedAddress === vault.address ? (
                      <span className="text-xs">Copied!</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Hardware Wallets */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Hardware Wallets</label>
                <div className="flex flex-wrap gap-1">
                  {vault.publicKeys.map((key, index) => (
                    <Badge key={index} variant="secondary" className="text-xs capitalize">
                      {key.walletType}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => window.open(`https://blockstream.info/address/${vault.address}`, "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Explorer
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary-dark"
                  onClick={() => console.log("Manage vault:", vault.id)}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
