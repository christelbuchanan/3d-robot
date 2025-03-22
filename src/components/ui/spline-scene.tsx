'use client'

import React, { useEffect, useState } from 'react'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [SplineComponent, setSplineComponent] = useState<React.ComponentType<any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const loadSpline = async () => {
      try {
        // Dynamically import Spline
        const splineModule = await import('@splinetool/react-spline')
        
        if (isMounted) {
          setSplineComponent(() => splineModule.default)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load Spline:', err)
        if (isMounted) {
          setError('Failed to load 3D component')
          setLoading(false)
        }
      }
    }

    loadSpline()
    
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="loader"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  if (!SplineComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400">
        Failed to load 3D component
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className || ''}`}>
      <SplineComponent scene={scene} />
    </div>
  )
}
