"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Key, Info } from "lucide-react"
import { KeyDerivationService, type ExtendedKeyInfo } from "@/lib/key-derivation"
import type { PublicKeyInfo } from "@/lib/hardware-wallets"

interface KeyExtractionDialogProps {
  walletType: string
  walletName: string
  onExtract: (path: string) => Promise<PublicKeyInfo | null>
  children: React.ReactNode
}

export function KeyExtractionDialog({ walletType, walletName, onExtract, children }: KeyExtractionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState(KeyDerivationService.STANDARD_PATHS.NATIVE_SEGWIT)
  const [customPath, setCustomPath] = useState("")
  const [useCustomPath, setUseCustomPath] = useState(false)
  const [extractedKey, setExtractedKey] = useState<ExtendedKeyInfo | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  const handleExtract = async () => {
    setIsExtracting(true)
    try {
      const path = useCustomPath ? customPath : selectedPath

      if (!KeyDerivationService.validatePath(path)) {
        alert("Invalid derivation path format")
        return
      }

      const publicKey = await onExtract(path)

      if (publicKey) {
        const extendedInfo = KeyDerivationService.parseXpub(publicKey.xpub, path, walletType)
        setExtractedKey(extendedInfo)
      }
    } catch (error) {
      console.error("Key extraction failed:", error)
      alert("Failed to extract public key. Please try again.")
    } finally {
      setIsExtracting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const resetDialog = () => {
    setExtractedKey(null)
    setUseCustomPath(false)
    setCustomPath("")
    setSelectedPath(KeyDerivationService.STANDARD_PATHS.NATIVE_SEGWIT)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetDialog()
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Extract Public Key - {walletName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!extractedKey ? (
            <>
              {/* Path Selection */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Derivation Path</Label>
                  <Select
                    value={useCustomPath ? "custom" : selectedPath}
                    onValueChange={(value) => {
                      if (value === "custom") {
                        setUseCustomPath(true)
                      } else {
                        setUseCustomPath(false)
                        setSelectedPath(value)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(KeyDerivationService.STANDARD_PATHS).map(([key, path]) => (
                        <SelectItem key={key} value={path}>
                          <div className="flex flex-col">
                            <span>{path}</span>
                            <span className="text-xs text-muted-foreground">
                              {KeyDerivationService.getPathDescription(path)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Path</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {useCustomPath && (
                  <div className="space-y-2">
                    <Label htmlFor="customPath">Custom Derivation Path</Label>
                    <Input
                      id="customPath"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      placeholder="m/48'/0'/0'/2'"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a valid BIP32 derivation path (e.g., m/48'/0'/0'/2')
                    </p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Path Information</p>
                      <p>{KeyDerivationService.getPathDescription(useCustomPath ? customPath : selectedPath)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extract Button */}
              <Button
                onClick={handleExtract}
                disabled={isExtracting || (useCustomPath && !customPath)}
                className="w-full bg-primary hover:bg-primary-dark"
              >
                {isExtracting ? "Extracting..." : "Extract Public Key"}
              </Button>
            </>
          ) : (
            /* Extracted Key Display */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {extractedKey.walletType}
                </Badge>
                <Badge variant="secondary">Depth: {extractedKey.depth}</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Derivation Path</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-surface rounded text-sm">{extractedKey.path}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(extractedKey.path)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Extended Public Key (xpub)</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-surface rounded text-xs break-all">{extractedKey.xpub}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(extractedKey.xpub)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sample Address</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-surface rounded text-sm">{extractedKey.address}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(extractedKey.address)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fingerprint</Label>
                    <code className="block p-2 bg-surface rounded text-sm">{extractedKey.fingerprint}</code>
                  </div>
                  <div className="space-y-2">
                    <Label>Child Number</Label>
                    <code className="block p-2 bg-surface rounded text-sm">{extractedKey.childNumber}</code>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={resetDialog} className="flex-1 bg-transparent">
                  Extract Another
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1 bg-primary hover:bg-primary-dark">
                  Use This Key
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
