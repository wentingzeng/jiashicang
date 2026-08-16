"use client"

import { useEffect, useState } from "react"

/**
 * 模拟"实时更新"的数值波动效果。
 * 未来接入真实数据源时，可直接替换为 SWR / WebSocket 的返回值，
 * 组件消费方式保持不变。
 */
export function useLiveValue(baseValue: number, options?: { volatility?: number; intervalMs?: number }) {
  const { volatility = 0.015, intervalMs = 4000 } = options ?? {}
  const [value, setValue] = useState(baseValue)

  useEffect(() => {
    setValue(baseValue)
    const timer = setInterval(() => {
      setValue((prev) => {
        const delta = prev * volatility * (Math.random() * 2 - 1)
        const next = prev + delta
        return next < 0 ? 0 : next
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [baseValue, volatility, intervalMs])

  return value
}

/** 当前时间字符串，每秒刷新，用于展示"数据更新时间"的动态感。 */
export function useLiveClock() {
  // 初始值设为 null，避免服务端渲染时间与客户端水合时间不一致导致的 hydration 警告。
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return now
}
