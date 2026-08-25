"use client"

import { useEffect, useId, useRef, useState } from "react"
import styles from "./destructive-action-confirmation.module.css"

type DestructiveActionConfirmationProps = {
  hasData: boolean
  triggerLabel: string
  prompt: string
  confirmLabel: string
  onConfirm: () => void
  cancelLabel?: string
  triggerClassName?: string
  focusTriggerOnMount?: boolean
}

export function DestructiveActionConfirmation({
  hasData,
  triggerLabel,
  prompt,
  confirmLabel,
  onConfirm,
  cancelLabel = "Keep draft",
  triggerClassName = "secondary-button",
  focusTriggerOnMount = false,
}: DestructiveActionConfirmationProps) {
  const [pending, setPending] = useState(false)
  const shouldReturnFocus = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const promptId = useId()

  useEffect(() => {
    if (focusTriggerOnMount) triggerRef.current?.focus()
  }, [focusTriggerOnMount])

  useEffect(() => {
    if (pending) {
      cancelRef.current?.focus()
      return
    }
    if (!pending && shouldReturnFocus.current) {
      shouldReturnFocus.current = false
      triggerRef.current?.focus()
    }
  }, [pending])

  if (!pending || !hasData) {
    return (
      <span className={styles.triggerOnly}>
        <button
          ref={triggerRef}
          type="button"
          className={triggerClassName}
          onClick={() => {
            if (hasData) {
              setPending(true)
              return
            }
            onConfirm()
          }}
        >
          {triggerLabel}
        </button>
      </span>
    )
  }

  return (
    <div className={styles.confirmation} role="group" aria-labelledby={promptId}>
      <p className={styles.prompt} id={promptId} aria-live="polite">
        {prompt}
      </p>
      <div className={styles.actions}>
        <button
          ref={cancelRef}
          type="button"
          className="secondary-button"
          onClick={() => {
            shouldReturnFocus.current = true
            setPending(false)
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={styles.danger}
          onClick={() => {
            shouldReturnFocus.current = true
            setPending(false)
            onConfirm()
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
