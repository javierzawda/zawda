"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { VaultDashboard } from "@/components/vault-dashboard"
import type { MultisigVault } from "@/lib/multisig"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [vaults, setVaults] = useState<MultisigVault[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load vaults from localStorage (in a real app, this would be from a database)
    const savedVaults = localStorage.getItem("zawda-vaults")
    if (savedVaults) {
      try {
        const parsedVaults = JSON.parse(savedVaults).map((vault: any) => ({
          ...vault,
          createdAt: new Date(vault.createdAt),
        }))
        setVaults(parsedVaults)
      } catch (error) {
        console.error("Failed to load vaults:", error)
      }
    }
  }, [])

  const handleCreateVault = () => {
    router.push("/vault/create")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <VaultDashboard vaults={vaults} onCreateVault={handleCreateVault} />
      </main>
    </div>
  )
}
