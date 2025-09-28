"use client"

import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    { text: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { text: "Contains a capital letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: "Contains a number", test: (pwd: string) => /\d/.test(pwd) },
    { text: "Contains a symbol", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  const passedRequirements = requirements.filter((req) => req.test(password)).length

  const getStrength = () => {
    if (passedRequirements === 0) return { text: "Weak", color: "password-strength-weak" }
    if (passedRequirements <= 2) return { text: "Weak", color: "password-strength-weak" }
    if (passedRequirements === 3) return { text: "Medium", color: "password-strength-medium" }
    return { text: "Strong", color: "password-strength-strong" }
  }

  const strength = getStrength()

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Password Strength:</span>
        <span className={`text-sm font-medium ${strength.color}`}>{strength.text}</span>
      </div>

      <div className="space-y-2">
        {requirements.map((requirement, index) => {
          const passed = requirement.test(password)
          return (
            <div key={index} className="flex items-center gap-2">
              {passed ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-error" />}
              <span className={`text-sm ${passed ? "text-success" : "text-muted-foreground"}`}>{requirement.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
