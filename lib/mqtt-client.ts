"use client"

import mqtt from "mqtt"
import { useEffect, useRef, useState } from "react"

// Configuración del broker MQTT
const MQTT_BROKER = process.env.NEXT_PUBLIC_MQTT_BROKER || "ws://localhost:9001"
const MQTT_USERNAME = process.env.NEXT_PUBLIC_MQTT_USERNAME
const MQTT_PASSWORD = process.env.NEXT_PUBLIC_MQTT_PASSWORD

export interface TankData {
  tankId: string
  pesoTanque: number
  timestamp: number
}

export interface EnvaseData {
  tankId: string
  pesoEnvase: number
  numeroEnvase: number
  timestamp: number
}

export interface ResumenEnvasado {
  tankId: string
  legajo: string
  ordenEnvasado: string
  inicio: number
  fin: number
  duracionSegundos: number
  totalEnvases: number
  pesoPromedio: number
  pesoMin: number
  pesoMax: number
  formatoSeleccionado: string
  toleranciaMinima: number
  toleranciaMaxima: number
  envasesOptimos: number
  envasesAlerta: number
  envasesFuera: number
  disponibilidad: number
  rendimiento: number
  calidad: number
  oee: number
}

export function useMQTTClient() {
  const clientRef = useRef<mqtt.MqttClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Conectar al broker MQTT
    const client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      clientId: `terplast-webapp-${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
    })

    client.on("connect", () => {
      console.log("[v0] MQTT conectado")
      setIsConnected(true)
      setError(null)
    })

    client.on("error", (err) => {
      console.error("[v0] MQTT error:", err)
      setError(err.message)
    })

    client.on("offline", () => {
      console.log("[v0] MQTT desconectado")
      setIsConnected(false)
    })

    clientRef.current = client

    return () => {
      if (client) {
        client.end()
      }
    }
  }, [])

  const subscribe = (topic: string, callback: (message: string) => void) => {
    if (!clientRef.current) return

    clientRef.current.subscribe(topic, (err) => {
      if (err) {
        console.error("[v0] Error suscribiendo a", topic, err)
        return
      }
      console.log("[v0] Suscrito a", topic)
    })

    clientRef.current.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        callback(message.toString())
      }
    })
  }

  const unsubscribe = (topic: string) => {
    if (!clientRef.current) return
    clientRef.current.unsubscribe(topic)
    console.log("[v0] Desuscrito de", topic)
  }

  const publish = (topic: string, message: string | object) => {
    if (!clientRef.current || !isConnected) {
      console.error("[v0] No se puede publicar: cliente no conectado")
      return
    }

    const payload = typeof message === "string" ? message : JSON.stringify(message)

    clientRef.current.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error("[v0] Error publicando a", topic, err)
      } else {
        console.log("[v0] Mensaje publicado a", topic)
      }
    })
  }

  return {
    isConnected,
    error,
    subscribe,
    unsubscribe,
    publish,
  }
}
