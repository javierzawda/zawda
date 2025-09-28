"use client"
import { Navigation } from "@/components/navigation"
import { VaultCreationWizard } from "@/components/vault-creation-wizard"
import type { MultisigVault } from "@/lib/multisig"
import { useRouter } from "next/navigation"

export default function CreateVaultPage() {
  const router = useRouter()

  const handleVaultCreated = (vault: MultisigVault) => {
    // Save vault to localStorage (in a real app, this would be saved to a database)
    try {
      const existingVaults = localStorage.getItem("zawda-vaults")
      const vaults = existingVaults ? JSON.parse(existingVaults) : []
      vaults.push(vault)
      localStorage.setItem("zawda-vaults", JSON.stringify(vaults))

      console.log("Vault created and saved:", vault)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Failed to save vault:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Vault</h1>
          <p className="text-muted-foreground">Set up a new multisig vault using your hardware wallets</p>
        </div>

        <VaultCreationWizard onVaultCreated={handleVaultCreated} />
      </main>
    </div>
  )
}
