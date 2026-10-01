import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const timeoutRef = useRef(null)

  const showToast = useCallback(
    (
      message,
      type = 'success',
      duration = 3000
    ) => {
      if (timeoutRef.current) {
        clearTimeout(
          timeoutRef.current
        )
      }

      setToast({
        id: Date.now(),
        message,
        type
      })

      timeoutRef.current =
        setTimeout(() => {
          setToast(null)
          timeoutRef.current = null
        }, duration)
    },
    []
  )

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(
        timeoutRef.current
      )

      timeoutRef.current = null
    }

    setToast(null)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(
          timeoutRef.current
        )
      }
    }
  }, [])

  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast
      }}
    >
      {children}

      {toast && (
        <div
          className={
            `global-toast global-toast-${toast.type}`
          }
          role="alert"
        >

          <div className="global-toast-icon">

            {toast.type ===
              'success' && '✓'}

            {toast.type ===
              'error' && '!'}

            {toast.type ===
              'warning' && '!'}

            {toast.type ===
              'info' && 'i'}

          </div>

          <div className="global-toast-message">
            {toast.message}
          </div>

          <button
            type="button"
            className="global-toast-close"
            onClick={hideToast}
            aria-label="Close notification"
          >
            ×
          </button>

        </div>
      )}

    </ToastContext.Provider>
  )
}

export function useToast() {
  const context =
    useContext(ToastContext)

  /*
   * Some Jest tests render components
   * directly without wrapping them in
   * ToastProvider.
   *
   * Return safe fallback functions
   * instead of throwing an error.
   */
  if (!context) {
    return {
      showToast: () => {},
      hideToast: () => {}
    }
  }

  return context
}

export default ToastContext
